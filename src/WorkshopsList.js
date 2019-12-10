import JSZip from 'jszip';


export default async function generate_List(url){
var response=await fetch(url);
if (!response.ok)throw new Error(response.status+':'+response.statusText);
var zip=await new JSZip().loadAsync(await response.blob());
var index=JSON.parse(zip.file("index.json").async("string"));
index.map(async function(x){
    x.description=await zip.file(x.description).async("string");
    x.image.src=await zip.file(x.image.src).async("blob");
})
}