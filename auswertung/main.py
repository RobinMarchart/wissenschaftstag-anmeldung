#!/usr/bin/env python3

import argparse
import json
import asyncio
import csv
import aiofiles
import os
import itertools
import pathlib
import collections

Name=collections.namedtuple("Name",["Class","firstName","secondName"])
Registration=collections.namedtuple("Registration",["Class","firstName","secondName","firstWorkshop","secondWorkshop","timestamp"])

argp=argparse.ArgumentParser()
argp.add_argument("classes")
argp.add_argument("registration")
argp.add_argument("--max_class_timestamp")
args=argp.parse_args()

def flatten(iter2):
    for iter1 in iter2:
        for item in iter1:
            yield item

async def loadCLass(path):
    async with aiofiles.open(path, mode='r',encoding="utf8") as f:
        content=await f.read()
        rows=[x.split(";") for x in content.split("\n")]
        return [Name(row[2],row[1],row[0]) for row in rows]

async def loadClassList(path):
    files=os.listdir(path)
    paths=[pathlib.Path(path,file) for file in files]
    classes=[await loadCLass(x) for x in paths]
    return flatten(classes)

async def decrypt(data:str):
    process=await asyncio.create_subprocess_exec("/usr/bin/env","gpg","-d",stdin=asyncio.subprocess.PIPE,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.PIPE)
    (stdout,stderr)=await process.communicate(data.encode("ascii"))
    if process.returncode!=0:
        print(stderr)
        return None
    return stdout

async def loadReg(path):
    contentStr=""
    async with aiofiles.open(path, mode='r',encoding="utf8") as f:
        contentStr=await f.read()
    content=json.loads(contentStr)
    if (not "data" in content) or (not "timestamp" in content):
        return None
    decryptedBytes=await decrypt(content["data"])
    if decryptedBytes==None:
        return None
    decrypted=json.loads(decryptedBytes.decode("utf-8", "ignore"))
    return Registration(decrypted[2],decrypted[1],decrypted[0],decrypted[3],decrypted[4],content["timestamp"])

def ifNotExtern(reg:Registration,func):
    if reg.Class=="extern":
        return reg
    else:
        return func(reg)

def processNotExtern(reg:Registration):
    return reg #TODO implement

async def loadRegList(path):
    files=os.listdir(path)
    paths=[pathlib.Path(path,file) for file in files]
    return [await loadReg(x) for x in paths]

async def main(args):
    namesPromise=loadClassList(args.classes)
    regPromise=loadRegList(args.registration)
    names=list(await namesPromise)
    regs=await regPromise
    regs_filtered=itertools.filterfalse(lambda x:x==None,regs)
    regs_processed=[ifNotExtern(x,lambda y:processNotExtern(y)) for x in regs_filtered]
    regs_filtered2=itertools.filterfalse(lambda x:x==None,regs_processed)
    #TODO implement splitting to workshop
asyncio.run(main(args))