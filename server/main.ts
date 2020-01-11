import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import bodyParser from "body-parser";
import * as config from "./config";

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

type request = { data: any | undefined, add: any | undefined, remove: any | undefined };
type wellFormedRequest = { data: string, add: string | { first: string, second: string }, remove: string | { first: string, second: string } | undefined }

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace requestValidation {

    function validateShortWorkshop(workshop: { first: any | undefined, second: any | undefined }, config: config.Config): boolean {
        return typeof workshop.first === "string" &&
            config.current_state.has(workshop.first) &&
            (config.current_state.get(workshop.first)as config.Workshop).short &&
            typeof workshop.second === "string" &&
            config.current_state.has(workshop.second)&&
            (config.current_state.get(workshop.second)as config.Workshop).short
    }

    function validateWorkshop(workshop: any | undefined, config: config.Config): boolean {
        return typeof workshop === "string" ? (config.current_state.has(workshop as string)&&!(config.current_state.get(workshop as string)as config.Workshop).short) :
            (typeof workshop === "object" && validateShortWorkshop(workshop as { first: any, second: any }, config))
    }

    export function validate(request: request | any, config: config.Config): request is wellFormedRequest {
        return typeof request === "object" &&
            typeof (request as request).data === "string" &&
            validateWorkshop((request as request).add, config) &&
            typeof (request as request).remove === "undefined" ? true : validateWorkshop((request as request).remove, config)

    }
}

async function run() {
    await fs.promises.access(outPath).catch(() => fs.promises.mkdir(outPath, { recursive: true }));
    await fs.promises.access(outPath, fs.constants.F_OK | fs.constants.W_OK)

    let conf = await config.readConfig(basePath);

    var app = express();
    app.options("/register", cors())
    app.post("/register", cors(), bodyParser.json(), function (req, res, next) {
        let r: request | undefined = req.body;
        if (requestValidation.validate(r, conf)) {
            let hash = crypto.createHash("sha256").update(r.data).digest("hex");
            if(r.remove){
                if(typeof r.remove==="string"){
                    let workshop=conf.current_state.get(r.remove);
                }else{

                }
            }
        } else {

        }


    });
    app.options("/workshops", cors())
    app.get("/workshops", cors(), (req, res) => {
        res.status(200);
        res.json(Array.from(conf.current_state.entries()))
    })
    app.listen(port);
    console.log("server ready")
}

run().catch(function (e) {
    console.error(e);
    process.exit(1);
});