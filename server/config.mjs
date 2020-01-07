import fs from "fs";
import path from "path";
import crypto from "crypto";

class Config {
    constructor(inpath) {
        this.inpath = inpath;
        this.watching = [];
        this.workshops = [];
        this.running = false;
        this.run_again = false;
    }

    schedule_read() {
        if (this.running) this.run_again = true;
        else this.read().catch(console.error);
    }

    async write_curr() {
        return await fs.promises.writeFile(path.join(this.inpath, "current_distribution.json"), JSON.stringify(Array.from(this.current_state.entries())), { encoding: "utf8" });
    }

    async read() {
        this.running = true;
        let watching = [];
        let workshops = [];
        let index = JSON.parse(await fs.promises.readFile(path.join(this.inpath, "index.json"), { encoding: "utf8" }));
        watching.push(fs.watch(path.join(this.inpath, "index.json"), this.schedule_read.bind(this)));
        for (let file in index.workshops) {
            file = index.workshops[file];
            watching.push(fs.watch(path.join(this.inpath, path.join(...file.split("/"))), this.schedule_read.bind(this)));
        }
        let workshopstemp = index.workshops.map(x => JSON.parse(fs.promises.readFile(path.join(this.inpath, path.join(...x.split("/"))), { encoding: "utf8" })))
        for (let workshop in workshopstemp) {
            workshop = workshopstemp[workshop];
            workshops.push(await workshop);
        }
        for (let watch in watching) {
            watch = watching[watch]
            watch.close();
        }
        this.watching = watching;
        this.workshops = workshops;
        let curr_path = path.join(this.inpath, "current_distribution.json");
        await fs.promises.access(curr_path).then(read_current.bind(null, curr_path, this.current_state, workshops), () => {
            for (let workshop in workshops) {
                workshop = workshops[workshop];
                this.current_state.set(crypto.createHash("sha256").update(workshop.key).digest("hex"), {
                    short: workshop.short,
                    max: workshop.maxParticipants ? workshop.maxParticipants : -1,
                    title: workshop.title,
                    used: workshop.short ? { first: 0, second: 0 } : 0
                });
            }
        });

        if (this.run_again) this.read().catch(console.error);
        this.running = false;
    }

}

async function readConfig(outPath) {
    let config = new Config(outPath);
    await config.read();
    return config;
}

async function read_current(path, map, workshops) {
    var curr = new Map(JSON.parse(await fs.promises.readFile(path, { encoding: "utf8" })));
    workshops.map(workshop => {
        let key = crypto.createHash("sha256").update(workshop.key).digest("hex");
        map.set(key, {
            short: workshop.short,
            max: workshop.maxParticipants ? workshop.maxParticipants : -1,
            title: workshop.title,
            used: curr.has(key) && (curr.get(key) !== undefined) && (curr.get(key).used !== undefined) ?
                (workshop.short ?
                    {
                        first: Number.isInteger(curr.get(key).used.first) && curr.get(key).used.first >= 0 ?
                            curr.get(key).used.first :
                            0,
                        second: Number.isInteger(curr.get(key).used.second) && curr.get(key).used.second >= 0 ?
                            curr.get(key).used.second :
                            0
                    } :
                    (Number.isInteger(curr.get(key).used) && curr.get(key).used >= 0 ?
                        curr.get(key).used :
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

export default readConfig;



