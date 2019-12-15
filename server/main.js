import fs from "fs"
import path from "path"
import jszip from "jszip"
import express from "express"

var args=process.argv.slice(2)

function wrongParams(){
    console.error("Usage: worshop-anmeldung-server port path")
    process.exit(1)
}

if(args.length!==2)wrongParams();
var port=parseInt(args[0]);
if (!port)wrongParams();
var basePath=args[1];

async function buildStaticFiles(){
    var jsonContent=await fs.promises.readFile(path.join(basePath,"index.json"),{encoding:"utf8"});
    var json=JSON.parse(jsonContent);
}

async function run(){
    var staticFiles=await buildStaticFiles();
}

run().catch(function(e){
    console.error(e);
    process.exit(1);
});

