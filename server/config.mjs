import fs from "fs";
import path from "path";

class Config {
    constructor(inpath) {
        this.inpath = inpath;
        this.watching = [];
        this.workshops = [];
        this.running=false;
        this.run_again=false;
        this.current_state=new Map();
    }

    schedule_read(){
        if(this.running)this.run_again=true;
        else this.read().catch(console.error);
    }

    async write_curr(){
        return await fs.promises.writeFile(path.join(this.inpath,"current_distribution.json"),JSON.stringify(Array.from(this.current_state.entries())),{encoding:"utf8"});
    }

    async read() {
        this.running=true;
        let watching=[];
        let workshops=[];
        let index=JSON.parse(await fs.promises.readFile(path.join(this.inpath,"index.json"),{encoding:"utf8"}));
        watching.push(fs.watch(path.join(this.inpath,"index.json"),this.schedule_read.bind(this)));
        for (let file in index.workshops){
            file=index.workshops[file];
            watching.push(fs.watch(path.join(this.inpath,path.join(...file.split("/"))),this.schedule_read.bind(this)));
        }
        let workshopstemp=index.workshops.map(x=>JSON.parse(fs.promises.readFile(path.join(this.inpath,path.join(...x.split("/"))),{encoding:"utf8"})))
        for (let workshop in workshopstemp){
            workshop=workshopstemp[workshop];
            workshops.push(await workshop);
        }
        for(let watch in watching){
            watch=watching[watch]
            watch.close();
        }
        this.watching=watching;
        this.workshops=workshops;
        let curr_path=path.join(this.inpath,"current_distribution.json");
        await fs.promises.access(curr_path).then(read_current.bind(null,curr_path,this.current_state),()=>{
            for (let workshop in workshops){
                workshop=workshops[workshop];
                this.current_state.set(workshop.title,{
                    short:workshop.short,
                    max:workshop.maxParticipants?workshop.maxParticipants:-1,
                    curr:0
                });
            }
        });
        if(this.run_again)this.read().catch(console.error);
        this.running=false;
    }

}

async function readConfig(outPath){
    let config=new Config(outPath);
    await config.read();
    return config;
} 

async function read_current(path,map){
    JSON.parse(await fs.promises.readFile(path,{encoding:"utf8"})).forEach(x=>{
        map.set(x[0],x[1]);
    })
}

export default readConfig;



