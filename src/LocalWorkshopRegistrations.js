const storage=localStorage;

var handlers=new Set()

document.addEventListener("registrationadded",x=>handlers.forEach(x2=>x2(x.detail.all,x.detail.new)));

const reg=JSON.parse(storage.getItem("workshop-registrations"));
var registrations=(reg)?new Map(reg):new Map();

export function getRegistrations(){
    return registrations
}

export function addRegistration(reg){
    registrations.set(reg[0]+' '+reg[1]+','+reg[2],reg);
    storage.setItem("workshop-registrations",JSON.stringify(Array.from(registrations.values())))
    document.dispatchEvent(new CustomEvent("registrationadded",{detail:{all:registrations,new:reg}}));
}

export function addListener(listener){
    handlers.add(listener);
}

export function removeListener(listener){
    handlers.delete(listener);
}

export function getDefault(){
    return registrations.entries().next().value;
}
