#!/usr/bin/env node

import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import bodyParser from "body-parser";
import * as config from "./config";
import https from "https";

import {NextFunction,Response} from "express";

import {checkWOrkshopDistribution} from "./checkShortWorkshops"

var args = process.argv.slice(2)

function wrongParams() {
    console.error("Usage: worshop-anmeldung-server port inPath outPath certfile keyfile")
    process.exit(1)
}

if (!((args.length === 3)||(args.length === 5))) wrongParams();
var port = parseInt(args[0]);
if (!port) wrongParams();
var basePath = args[1];
var outPath = args[2];

type request = { data: any | undefined, add: any | undefined, remove: any | undefined };
type wellFormedRequest = { data: string, add: string | { first: string, second: string }, remove: string | { first: string, second: string } | undefined }

type response = { status: number, message: string };

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace requestValidation {

    function validateShortWorkshop(workshop: { first: any | undefined, second: any | undefined }, config: config.Config): boolean {
        return typeof workshop.first === "string" &&
            config.current_state.has(workshop.first) &&
            (config.current_state.get(workshop.first) as config.Workshop).short &&
            typeof workshop.second === "string" &&
            config.current_state.has(workshop.second) &&
            (config.current_state.get(workshop.second) as config.Workshop).short
    }

    function validateWorkshop(workshop: any | undefined, config: config.Config): boolean {
        return typeof workshop === "string" ? (config.current_state.has(workshop as string) && !(config.current_state.get(workshop as string) as config.Workshop).short) :
            (typeof workshop === "object" && validateShortWorkshop(workshop as { first: any, second: any }, config))
    }

    export function validate(request: request | any, config: config.Config): request is wellFormedRequest {
        return typeof request === "object" &&
            typeof (request as request).data === "string" &&
            validateWorkshop((request as request).add, config) &&
            typeof (request as request).remove === "undefined" ? true : validateWorkshop((request as request).remove, config)

    }
}

function checkSmallWorkshopsRegistration(first: string, second: string, map: Map<string, config.Workshop>): boolean {
    let firstB=Array.from(map.entries()).filter(x=>x[1].short).map(x=>{
        return {key:x[0], curr:x[0]===first?(x[1].used as {first:number,second:number}).first+1:(x[1].used as {first:number,second:number}).first,max:x[1].max};
    })
    let secondB=Array.from(map.entries()).filter(x=>x[1].short).map(x=>{
        return {key:x[0], curr:x[0]===second?(x[1].used as {first:number,second:number}).second+1:(x[1].used as {first:number,second:number}).second,max:x[1].max};
    })
    return checkWOrkshopDistribution(firstB,secondB);
}

function fullfillRequest(error:boolean,response:response,res:Response,next:NextFunction):void{
    if(!error){
        response={status:200,message:"Erfolgreich angemeldet"}
    }
    res.status(response.status).json(response);
    next();
}

async function run() {
    await fs.promises.access(outPath).catch(() => fs.promises.mkdir(outPath, { recursive: true }));
    await fs.promises.access(outPath, fs.constants.F_OK | fs.constants.W_OK)

    let conf = await config.readConfig(basePath);

    var app = express();
    app.options("/register", cors())
    app.post("/register", cors(), bodyParser.json(), function (req, res, next) {

        let r: request | undefined = req.body;
        let response: response = { status: 500, message: "Nicht bearbeitet" };
        let error: boolean = false;
        let Notsend:boolean = true;
        if (requestValidation.validate(r, conf)) {
            let hash = crypto.createHash("sha256").update(r.data).digest("hex");
            if (r.remove) {
                if (typeof r.remove === "string") {
                    let workshop = conf.current_state.get(r.remove) as config.LongWorkshop;
                    if (workshop.used < 1) {
                        response = { status: 500, message: "Fehler beim abmelden von " + workshop.title }
                        error = true;
                    } else {
                        workshop.used--;
                    }

                } else {
                    let workshop1 = conf.current_state.get(r.remove.first) as config.LongWorkshop;
                    if (workshop1.used < 1) {
                        response = { status: 500, message: "Fehler beim abmelden von " + workshop1.title }
                        error = true;
                    } else {
                        workshop1.used--;
                        let workshop2 = conf.current_state.get(r.remove.second) as config.LongWorkshop;
                        if (workshop2.used < 1) {
                            response = { status: 500, message: "Fehler beim abmelden von " + workshop2.title }
                            error = true;
                        } else {
                            workshop2.used--;
                        }
                    }
                }
            }
            if (!error) {
                if (typeof r.add === "string") {
                    let workshop = conf.current_state.get(r.add) as config.LongWorkshop;
                    if (workshop.used >= workshop.max) {
                        response = { status: 500, message: "Nicht genug freie Plätze in " + workshop.title }
                        error = true;
                    } else {
                        workshop.used++;
                    }

                } else {
                    if (checkSmallWorkshopsRegistration(r.add.first, r.add.second, conf.current_state)) {
                        let workshop1 = conf.current_state.get(r.add.first) as config.LongWorkshop;
                        if (workshop1.used >= workshop1.max) {
                            response = { status: 418, message: "Nicht genug freie Plätze in " + workshop1.title };
                            error = true;
                        } else {
                            workshop1.used++;
                            let workshop2 = conf.current_state.get(r.add.second) as config.LongWorkshop;
                            if (workshop2.used >= workshop2.max) {
                                response = { status: 418, message: "Nicht genug freie Plätze in " + workshop2.title };
                                error = true;
                            } else {
                                workshop2.used++;
                            }
                        }
                    } else {
                        response = { status: 418, message: "Diese Workshop Kombination ist nicht mehr verfügbar" };
                        error = true;
                    }

                }
            }
            if(!error){
                //safe request
                let savedRequest:{timestamp:number}&wellFormedRequest=r as {timestamp:number}&wellFormedRequest;
                savedRequest.timestamp=Date.now();
                fs.promises.writeFile(path.join(outPath,hash+".json"),JSON.stringify(savedRequest),{encoding:"utf8"}).then(conf.write_curr).catch(e=>{
                    response={status:500,message:"IO Fehler"};
                    error=true
                }).finally(()=>{
                    Notsend=false;
                    fullfillRequest(error,response,res,next)
                });
            }
        } else {
            response={status:400,message:"Bad Request"}
            error=true;
        }
        if(Notsend)fullfillRequest(error,response,res,next);

    });
    app.options("/workshops", cors())
    app.get("/workshops", cors(), (req, res) => {
        res.status(200);
        res.json(Array.from(conf.current_state.entries()))
    })
    if(args.length>=5){
        https.createServer({cert:args[3],key:args[4]},app).listen(port)
    }
    else app.listen(port);
    console.log("server ready")
}

run().catch(function (e) {
    console.error(e);
    process.exit(1);
});