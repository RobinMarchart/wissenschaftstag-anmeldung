import fs from "fs"
import path from "path"
import jszip from "jszip"
import express from "express"
import tmp from "tmp"
import crypto from "crypto"

var args=process.argv.slice(2)

function wrongParams(){
    console.error("Usage: worshop-anmeldung-server port inPath outPath")
    process.exit(1)
}

if(args.length!==3)wrongParams();
var port=parseInt(args[0]);
if (!port)wrongParams();
var basePath=args[1];
var outPath=args[2];

tmp.setGracefulCleanup();
var tmpfile=tmp.fileSync()



async function buildStaticFiles(){
    console.log("building archive")
    var jsonContent=await fs.promises.readFile(path.join(basePath,"index.json"),{encoding:"utf8"});
    var json=JSON.parse(jsonContent);
    var zip=jszip();
    var watch=["index.json"];
    zip.file("index.json",jsonContent);
    Promise.all(json.map(async function(x){
        let f1=fs.promises.readFile(path.join(basePath,x.description),{encoding:"utf8"})
        let f2=fs.promises.readFile(path.join(basePath,x.image.src),{encoding:"utf8"})
        zip.file(x.description,f1);
        zip.file(x.image.src,f2);
        watch.push(x.description);
        watch.push(x.image.src);
    }));
    let hash=crypto.createHash("sha256")
    await new Promise((resolve,reject)=>zip.generateNodeStream({compression:"DEFLATE",compressionOptions:{level:9},streamFiles:true})
    .pipe(hash).pipe(fs.createWriteStream(tmpfile.name))
    .on("finish",resolve).on("error",reject));
    let name=hash.digest('hex').slice(0,11)+".zip";
    return[JSON,name,watch]
}

function handleFileChange(staticFiles,watched){
    buildStaticFiles().then(function(x){
        staticFiles[0]=x[0];
        staticFiles[1]=x[1];
        staticFiles[2].filter(x2=>!x[2].includes(x2)).forEach(function(x2){
            watched.get(x2).close();
            watched.delete(x2);
        });
        x[2].filter(x2=>!staticFiles[2].includes(x2))
        .forEach(x=>watched.set(x,fs.watch(path.join(basePath,x),(eventType, filename)=>function(eventType,filename,staticFiles,watched){
            if(filename&&eventType==="change")handleFileChange(staticFiles,watched);
        }(eventType,filename,staticFiles,watched))));
        staticFiles[2]=x[2];
    }).catch(console.error)
}

async function run(){
    await fs.promises.access(outPath).catch(()=>fs.promises.mkdir(outPath,{recursive:true}));
    await fs.promises.access(outPath,fs.constants.F_OK|fs.constants.W_OK)
    var staticFiles=await buildStaticFiles();
    var watched=new Map();
    staticFiles[2].forEach(x=>watched.set(x,fs.watch(path.join(basePath,x),(eventType, filename)=>function(eventType,filename,staticFiles,watched){
        if(filename&&eventType==="change")handleFileChange(staticFiles,watched);
    }(eventType,filename,staticFiles,watched))));
    var app=express();
    app.get("/",function(req,res){
        res.set("Access-Control-Allow-Origin","*");
        res.redirect("zip/"+staticFiles[1]);
    });
    app.get("/key",function(req,res){
        res.set("Access-Control-Allow-Origin","*");
        res.set('Accept','text/plain');
        res.sendFile("key.asc")
    });
    app.get("/zip/*",function(req,res){
        res.set("Access-Control-Allow-Origin","*");
        if(!req.originalUrl.endsWith(staticFiles[1]))res.sendStatus(404);
        res.set("Cache-Control","public")
        res.sendFile(tmpfile.name);
    });
    app.put("/",function(req,res){
        fs.promises.writeFile(path.join(outPath,crypto.createHash("sha265").update(req.body).digest("hex")),req.body)
        .then(()=>res.sendStatus(200))
        .catch(console.error)
        .then(()=>console.log("received registration"));
    });
    app.listen(port);
    console.log("server ready")
}

run().catch(function(e){
    console.error(e);
    process.exit(1);
});

