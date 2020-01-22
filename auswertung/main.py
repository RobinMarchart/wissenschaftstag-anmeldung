#!/usr/bin/env python3

import argparse
import json
import asyncio
import csv
import aiofiles
import os
import itertools
import functools
import pathlib
import collections
import difflib

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

def findClosestClasses(classes,name):
    if name in classes:
        return name
    ownClass=list(itertools.filterfalse(lambda x:x.Class!=name.Class))
    classFirstName=[x.firstName for x in ownClass]
    first1NameMatches=difflib.get_close_matches(name.firstName,classFirstName,n=len(classFirstName),0.6)
    matching1FirstName=list(itertools.filterfalse(lambda y:not y in [x.firstName for x in first1NameMatches],ownClass))
    class1SecondName=[x.secondName for x in matching1FirstName]
    secondNameMatches1=difflib.get_close_matches(name.secondName,class1SecondName,n=len(class1SecondName),0.6)

    FirstName=[x.firstName for x in classes]
    first2NameMatches=difflib.get_close_matches(name.firstName,FirstName,n=len(FirstName),0.7)
    matching2FirstName=list(itertools.filterfalse(lambda y:not y in [x.firstName for x in first2NameMatches],classes))
    class2SecondName=[x.secondName for x in matching2FirstName]
    secondNameMatches2=difflib.get_close_matches(name.secondName,class2SecondName,n=len(class2SecondName),0.7)

    if len(secondNameMatches)<1:
        raise Exception("multiple matchingNames")

def splitExtern(regs,reg:Registration):
    if reg.Class=="extern":
        regs[0].append(reg)
    else:
        regs[1].append(reg)
    return regs

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
    (extern,intern)=functools.reduce(splitExtern,regs_filtered,([],[]))

    #TODO implement splitting to workshop
asyncio.run(main(args))