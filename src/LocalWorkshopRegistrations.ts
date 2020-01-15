const storage=localStorage;

export function getRegistration(){
    let reg=storage.getItem("registration");
    return (reg)?JSON.parse(reg):null;
}

export function setRegistration(reg){
    try{
        storage.setItem("registration",JSON.stringify(reg))
    }catch(e){
        console.error(e);
    }
}
export function deleteRegistration(){
    storage.removeItem("registration")
}