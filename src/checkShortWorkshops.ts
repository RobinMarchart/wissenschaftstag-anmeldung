type singleInput=[string,{used:{first:number,second:number}}];
type input=singleInput[];
type outputWorkshop={first:string,second:string};
type output=outputWorkshop[];

export default function check(input:input):output{
    let out:output=[];
    input.map(x=>x[0]).map(x1=>input.map(x=>x[0]).filter(x2=>x2!==x1).map(x2=>out.push({first:x1,second:x2})))
    return out;
}