const fs=require("fs");
const path=require("path");

const crypto = require("crypto")

const base="workshops"

const out=path.join("public","workshops")

async function clearFile(){
    try{
        await fs.promises.access(out);
        if ((await fs.promises.stat(out)).isDirectory())await fs.promises.rmdir(out,{recursive:true});
        else await fs.promises.unlink(out);
    }catch{

    }
    await fs.promises.mkdir(out);
}

var running=false;

var run_again=false;

function requestRebuild(event, filename){
    if(filename){
    if(running)run_again=true;
    else rebuild();
    }
}

function rebuild(){
    watchers.forEach(x=>x.close());
    watchers=[];
    run().catch(console.error);
}

var watchers=[];

function addListener(name){
    watchers.push(fs.watch(name,requestRebuild));
}

var duplicates=(()=>{
let count = names =>
  names.reduce((a, b) => ({ ...a,
    [b]: (a[b] || 0) + 1
  }), {})
let duplicates = dict =>
  Object.keys(dict).filter((a) => dict[a] > 1)
  return x=>duplicates(count(x));
})();

async function run(url,watch,passthrough){
    running=true;
    let out_ready=clearFile();
    let original=JSON.parse(await fs.promises.readFile(path.join(base,"index.json")));
    if(watch)addListener(path.join(base,"index.json"));
    let key=fs.promises.readFile(path.join(base,path.join(...original.key.split("/"))),{encoding:"ascii"});
    if(watch)addListener(path.join(base,path.join(...original.key.split("/"))));
    let workshops=[];
    var picture=[0];
    await out_ready;
    await Promise.all(original.workshops.map(x1=>async function(x,picture){
        let entry_base=path.dirname(path.join(...x.split("/")));
        let entry=JSON.parse(await fs.promises.readFile(path.join(base,path.join(...x.split("/")))));
        let descr=fs.promises.readFile(path.join(base,entry_base,path.join(...entry.description.split("/"))),{encoding:"utf8"});
        if(watch)addListener(path.join(base,entry_base,path.join(...entry.description.split("/"))));
        let picturename=picture[0].toString()+path.extname(entry.image.src)
        picture[0]=picture[0]+1;
        let picture_await=fs.promises.copyFile(path.join(base,entry_base,path.join(...entry.image.src.split("/")))
            ,path.join(out,picturename));
        if(watch)addListener(path.join(base,entry_base,path.join(...entry.image.src.split("/"))));
        entry.image.src="workshops/"+picturename;
        entry.description=await descr;
        entry.key=crypto.createHash("sha256").update(entry.key).digest("hex");
        workshops.push(entry);
        await picture_await;
    }(x1,picture)));
    let key_str=await key;
    let dup_title=duplicates(workshops.map(x=>x.title));
    if(dup_title.length>0){
        console.error("non unique titles found: "+dup_title.join(" "))
        process.exit(1);
    }
    let dup_key=duplicates(workshops.map(x=>x.key));
    if(dup_key.length>0){
        console.error("non unique keys found: "+dup_title.join(" "))
        process.exit(1);
    }
    await fs.promises.writeFile(path.join("src","workshops.json"),JSON.stringify({workshops:workshops,key:key_str,url:url?url:original.url,classes:original.classes}));
    running=false
    console.info("Finished processing workshops");
    if(run_again)rebuild();
    return passthrough;
}

module.exports=run;