import fs from "fs";
import path from "path";
import crypto from "crypto";

type FileWorkshop={ title: string, short: boolean, maxParticipants: number | undefined, key: string };
export type Workshop={title: string,short: boolean,max: number,used:number|{first:number,second:number}};
export type LongWorkshop={title: string,short: boolean,max: number,used:number};
export type ShortWorkshop={title: string,short: boolean,max: number,used:{first:number,second:number}};

export function isShortWorkshop(workshop:Workshop): workshop is ShortWorkshop {
    return workshop.short;
}

export class Config {

    inpath: string;
    outpath:string;
    watching: Array<fs.FSWatcher>;
    workshops: Array<FileWorkshop>;
    running: boolean;
    run_again: boolean;
    current_state: Map<string, Workshop>;

    constructor(inpath: string,outpath:string) {
        this.inpath = inpath;
        this.outpath=outpath;
        this.watching = [];
        this.workshops = [];
        this.running = false;
        this.run_again = false;
        this.current_state = new Map();
    }

    schedule_read():void {
        if (this.running) this.run_again = true;
        else this.read().catch(console.error);
    }

     write_curr():Promise<void> {
        return fs.promises.writeFile(path.join(this.outpath, "current_distribution.json"), JSON.stringify(Array.from(this.current_state.entries())), { encoding: "utf8" });
    }

    async read():Promise<void> {
        this.running = true;
        let watching: Array<fs.FSWatcher> = [];
        let workshops: FileWorkshop[] = [];
        let index: { "workshops": Array<string> } = JSON.parse(await fs.promises.readFile(path.join(this.inpath, "index.json"), { encoding: "utf8" }));
        watching.push(fs.watch(path.join(this.inpath, "index.json"), this.schedule_read.bind(this)));

        let workshopstemp: string[][] = index.workshops.map(x => x.split("/"));
        let workshopstemp1: string[] = workshopstemp.map(x => path.join(...x));
        let workshopstemp2: string[] = workshopstemp1.map(x => path.join(this.inpath, x));
        workshopstemp2.forEach(x => watching.push(fs.watch(x, this.schedule_read.bind(this))));
        let workshopstemp3: Promise<string>[] = workshopstemp2.map(x => fs.promises.readFile(x, { encoding: "utf8" }));
        let workshopstemp4: Promise<FileWorkshop>[] = workshopstemp3.map(async x => JSON.parse(await x));
        let workshopstemp5 = workshopstemp4.map(async x => workshops.push(await x))
        await Promise.all(workshopstemp5)
        this.watching.forEach(x => x.close())
        this.watching = watching;
        this.workshops = workshops;
        let curr_path = path.join(this.outpath, "current_distribution.json");
        await fs.promises.access(curr_path).then(read_current.bind(null, curr_path, this.current_state, workshops), () => workshops.forEach(workshop => {
            this.current_state.set(crypto.createHash("sha256").update(workshop.key).digest("hex"), {
                short: workshop.short,
                max: workshop.maxParticipants ? workshop.maxParticipants : Infinity,
                title: workshop.title,
                used: workshop.short ? { first: 0, second: 0 } : 0
            });
        }));

        if (this.run_again) this.read().catch(console.error);
        this.running = false;
    }

}

export async function readConfig(InPath:string,outPath:string):Promise<Config> {
    let config = new Config(InPath,outPath);
    await config.read();
    return config;
}

async function read_current(path:string, map:Map<string,Workshop>, workshops:FileWorkshop[]) {
    let curr:Map<string,Workshop> = new Map(JSON.parse(await fs.promises.readFile(path, { encoding: "utf8" })));
    workshops.map(workshop => {
        let key = crypto.createHash("sha256").update(workshop.key).digest("hex");
        map.set(key, {
            short: workshop.short,
            max: workshop.maxParticipants ? workshop.maxParticipants : Infinity,
            title: workshop.title,
            used: curr.has(key) && (curr.get(key) !== undefined) && ((curr.get(key)as {used:any}).used !== undefined) ?
                (workshop.short ?
                    {
                        first: Number.isInteger((curr.get(key) as ShortWorkshop).used.first) && (curr.get(key) as ShortWorkshop).used.first >= 0 ?
                            (curr.get(key) as ShortWorkshop).used.first :
                            0,
                        second: Number.isInteger((curr.get(key) as ShortWorkshop).used.second) && (curr.get(key) as ShortWorkshop).used.second >= 0 ?
                            (curr.get(key) as ShortWorkshop).used.second :
                            0
                    } :
                    (Number.isInteger((curr.get(key) as LongWorkshop).used) && (curr.get(key) as {used:number}).used >= 0 ?
                    (curr.get(key) as {used:number}).used :
                        0
                    )
                ) :
                (workshop.short ?
                    { first: 0, second: 0 } :
                    0
                )
        })
    })
}
