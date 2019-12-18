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
}

module.exports=async function (){
    let out_ready=clearFile();
    let original=JSON.parse(await fs.promises.readFile(path.join(base,"index.json")));
    let key=fs.promises.readFile(path.join(base,path.join(original.key.split("/"))));
    let workshops=[];
    var picture=[0];
    await out_ready;
    await Promise.all(original.workshops.map(x1=>async function(x,picture){
        let entry_base=x.split("/");
        let entry=JSON.parse(await fs.promises.readFile(path.join(base,path.join(entry_base))));
        let descr=fs.promises.readFile(path.join(base,path.join(entry_base),path.join(entry.description.split("/"))));
        let picturename=picture[0].toString()+"."+path.extname(entry.image.src)
        picture[0]=picture[0]+1;
        let picture_await=fs.promises.copyFile(path.join(base,path.join(entry_base),path.join(entry.image.src.split("/")))
            ,path.join(out,"pictures",picturename));
        entry.image.src="workshops/pictures/"+picturename;
        entry.description=await descr;
        workshops.push(entry);
        await picture_await;
    }(x1,picture)));
    await fs.promises.writeFile(path.join(out,"index.json"),JSON.stringify({workshops:workshops,key:key}));
}
