type singleInput=[string,{used:{first:number,second:number},key:string,max:number}];
type input=singleInput[];
type outputWorkshop={first:string,second:string};
type output=outputWorkshop[];

function flatten<T>(arg: T[][]): T[] {
    let r:T[]=[]
    arg.forEach(x=>r.push(...x));
    return r;
}


function checkWOrkshopDistribution(first_bunch:{curr:number,max:number,key:string}[],second_bunch:{curr:number,max:number,key:string}[]){
    first_bunch.map((x)=>{
        let needed=x.max-x.curr;
        let available=second_bunch.filter((x2)=>x.key!==x2.key).map(x2=>x2.max-x2.curr).reduce((x,y)=>x+y)
        return available>=needed;
    }).reduce((x,y)=>x&&y);
}
export default function check(input:input):output{

    let first_bunch=input.map(x=>{
        return {curr:x[1].used.first,max:x[1].max,key:x[0]}
    });
    let second_bunch=input.map(x=>{
        return {curr:x[1].used.second,max:x[1].max,key:x[0]}
    });

    let variants=flatten(first_bunch.map(x=>second_bunch.filter(x2=>x.key!=x2.key).map(x2=>{
            return {first:x,second:x2};
        }))).filter(x=>x.first.curr<x.first.max&&x.second.curr<x.second.max).map(x=>{
            return{keys:{first:x.first.key,second:x.second.key},would:{first:first_bunch.map(x2=>{
                if(x.first.key===x2.key)return {curr:x2.curr+1,max:x2.max,key:x2.key};
                else return x2;
            }),second:second_bunch.map(x2=>{
                if(x.second.key===x2.key)return {curr:x2.curr+1,max:x2.max,key:x2.key};
                else return x2;
            })}};
        }).filter(x=>checkWOrkshopDistribution(x.would.first,x.would.second)).map(x=>x.keys)
    
    return variants;
}