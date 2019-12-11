const jszip=require("jszip");
const fs=require("fs");
const path=require("path");

async function zip(){
let zip=jszip();
let dir=fs.promises.readdir("./workshops",{withFileTypes:true});
await addToZip(dir,zip,"./workshops","");
await new Promise((resolve,reject)=>
zip.generateNodeStream({compression:"DEFLATE",compressionOptions:{level:9},streamFiles:true})
.pipe(fs.createWriteStream("./src/workshops.zip"))
.on("finish",resolve).on("error",reject));
console.info("workshops zip created");
}

async function addToZip(dir,zip,par_path,zip_path){
let dirs=[];
dir=await dir;
for (const dirent of dir){
    let cur_path=par_path+path.sep+dirent.name;
    let cur_zip_path=zip_path+dirent.name;
    if (dirent.isDirectory())dirs.push( addToZip( fs.promises.readdir(cur_path,{withFileTypes:true}),zip,cur_path,cur_zip_path+'/'));
    else if (dirent.isFile())zip.file(cur_zip_path,fs.createReadStream(cur_path),{binary:true});    
}
await Promise.all(dirs);
}

module.exports=zip;
