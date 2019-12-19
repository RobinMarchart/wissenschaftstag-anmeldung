const fs=require("fs");
const path=require("path");

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

async function run(development){
    running=true;
    let out_ready=clearFile();
    let original=JSON.parse(await fs.promises.readFile(path.join(base,"index.json")));
    if(development)watchers.push(fs.watch(path.join(base,"index.json"),requestRebuild));
    let key=fs.promises.readFile(path.join(base,path.join(...original.key.split("/"))),{encoding:"ascii"});
    if(development)watchers.push(fs.watch(path.join(base,path.join(...original.key.split("/"))),requestRebuild));
    let workshops=[];
    var picture=[0];
    await out_ready;
    await Promise.all(original.workshops.map(x1=>async function(x,picture){
        let entry_base=path.dirname(path.join(...x.split("/")));
        let entry=JSON.parse(await fs.promises.readFile(path.join(base,path.join(...x.split("/")))));
        let descr=fs.promises.readFile(path.join(base,entry_base,path.join(...entry.description.split("/"))),{encoding:"utf8"});
        if(development)watchers.push(fs.watch(path.join(base,entry_base,path.join(...entry.description.split("/"))),requestRebuild));
        let picturename=picture[0].toString()+path.extname(entry.image.src)
        picture[0]=picture[0]+1;
        let picture_await=fs.promises.copyFile(path.join(base,entry_base,path.join(...entry.image.src.split("/")))
            ,path.join(out,picturename));
        if(development)watchers.push(fs.watch(path.join(base,entry_base,path.join(...entry.image.src.split("/"))),requestRebuild));
        entry.image.src="workshops/"+picturename;
        entry.description=await descr;
        workshops.push(entry);
        await picture_await;
    }(x1,picture)));
    await fs.promises.writeFile(path.join("src","workshops.json"),JSON.stringify({workshops:workshops,key:key}));
    running=false
    console.info("Finished processing workshops");
    if(run_again)rebuild();
}

module.exports=run;