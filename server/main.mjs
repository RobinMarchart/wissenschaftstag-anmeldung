import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import bodyParser from "body-parser";
import config from "./config";

var args = process.argv.slice(2)

function wrongParams() {
    console.error("Usage: worshop-anmeldung-server port inPath outPath")
    process.exit(1)
}

if (args.length !== 3) wrongParams();
var port = parseInt(args[0]);
if (!port) wrongParams();
var basePath = args[1];
var outPath = args[2];

async function handleWorkshopsPost(req, res, conf) {
    let title = req.params.title;
    if (conf.current_state.has(title)) {
        let info = conf.current_state.get(title);
        switch (req.query.method) {
            case "add": if (info.curr >= 0) {
                if(info.curr<info.max){
                    info.curr++;
                    await conf.write_curr();
                }else throw new Error("Workshop already full");
            }
            else throw (new Error("Internal Counter Error"));
                break;
                case "remove": if (info.curr > 0) {
                    if(info.curr<=info.max){
                        info.curr--;
                        await conf.write_curr();
                    }else throw new Error("Internal Counter Error");
                }
                else throw (new Error("Workshop already empty"));
                    break;
            default: throw (new Error("Unsupported Method"));
        }

    }
}

async function run() {
    await fs.promises.access(outPath).catch(() => fs.promises.mkdir(outPath, { recursive: true }));
    await fs.promises.access(outPath, fs.constants.F_OK | fs.constants.W_OK)

    let conf = await config(basePath);

    var app = express();
    app.options("/register", cors())
    app.put("/register", cors(), bodyParser.text({ type: "application/json" }), function (req, res) {
        let r = req.body;
        fs.promises.writeFile(path.join(outPath, crypto.createHash("sha256").update(JSON.parse(r).data).digest("hex") + ".json"), r)
            .then(() => res.sendStatus(200))
            .catch(console.error)
            .then(() => console.log("received registration"));
    });
    app.get("/workshops/:operation/:first", cors(), (req, res, next) => {
        handleWorkshopsPost(req,res,conf).then(()=>{
            res.status(200);
            res.json({message:"ok"});
            next();
        },e=>{
            res.status(500);
            res.json({message:e.message});
            next();
        });
    });
    app.get("/workshops", cors(), (req,res)=>{
        res.status=200;
        res.json(Array.from(conf.current_state.entries()))
    })
    app.listen(port);
    console.log("server ready")
}

run().catch(function (e) {
    console.error(e);
    process.exit(1);
});