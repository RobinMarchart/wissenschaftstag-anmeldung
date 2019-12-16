import JSZip from 'jszip';
import axios from "axios";

async function flatten(array){
let r=[];
for (const awaitable in array){
    let awaited=await array[awaitable];
    r.push(awaited)
}
return r;
}

export default async function generate_List(url){
var response=await axios.get(url);
var zip=await new JSZip.loadAsync(response.data);
zip.forEach((x,y)=>console.debug(x));
var content=await zip.file("index.json").async("string");
console.debug(content);
var index=JSON.parse(content);
return await flatten(index.map(async function(x){
    x.description=await zip.file(x.description).async("string");
    x.image.src=await zip.file(x.image.src).async("blob");
    return x;
}));
}