import fs from "fs"
import path from "path"
import express from "express"
import cors from "cors"
import crypto from "crypto"

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

async function run() {
    await fs.promises.access(outPath).catch(() => fs.promises.mkdir(outPath, { recursive: true }));
    await fs.promises.access(outPath, fs.constants.F_OK | fs.constants.W_OK)
    var watched = new Map();

    var app = express();
    app.options("/register", cors())
    app.put("/register", cors(), function(req, res) {
        fs.promises.writeFile(path.join(outPath, crypto.createHash("sha265").update(req.body).digest("hex")), req.body)
            .then(() => res.sendStatus(200))
            .catch(console.error)
            .then(() => console.log("received registration"));
    });
    app.listen(port);
    console.log("server ready")
}

run().catch(function(e) {
    console.error(e);
    process.exit(1);
});