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

def findClosestClasses(classes,name,deviation=0.5):
    if functools.reduce(lambda x,y:y or (x.Class.lower()==name.Class and x.firstName.lower()==name.firstName.lower() and x.secondName.lower()==name.secondName.lower()), classes):
        return name
    ownClass=list(itertools.filterfalse(lambda x:x.Class.lower()!=name.Class.lower()))
    classFirstName=set([x.firstName.lower() for x in ownClass])
    classFirstNameMatches=difflib.get_close_matches(name.firstName.lower(),classFirstName,n=len(classFirstName),cutoff=deviation)
    classMatchingFirstName=list(itertools.filterfalse(lambda x:not x.firstName.lower() in classFirstNameMatches,ownClass))
    classSecondName=set([x.secondName.lower() for x in classMatchingFirstName])
    classSecondNameMatches=difflib.get_close_matches(name.secondName.lower(), classSecondName,n=len(classSecondName),cutoff=deviation)
    classMatches=list(itertools.filterfalse(lambda x:not x.secondName.lower() in classSecondNameMatches))
    
    FirstName=set([x.firstName.lower() for x in ownClass])
    FirstNameMatches=difflib.get_close_matches(name.firstName.lower(),FirstName,n=len(FirstName),cutoff=deviation+0.1)
    MatchingFirstName=list(itertools.filterfalse(lambda x:not x.firstName.lower() in FirstNameMatches,ownClass))
    SecondName=set([x.secondName.lower() for x in MatchingFirstName])
    SecondNameMatches=difflib.get_close_matches(name.secondName.lower(), SecondName,n=len(SecondName),cutoff=deviation+0.1)
    matches=set(itertools.filterfalse(lambda x:not x.secondName.lower() in classSecondNameMatches)).union(set(classMatches))

    if len(matches)>1:
        if(deviation<0.9):
            return findClosestClasses(classes,name,deviation+0.1)
        else:
            print("to similar: {}".format(json.dumps(list(matches))))
            return None
    elif len(matches)==1:
        newName=matches.pop()
        print("replacing {} with {}".format(json.dumps(name), json.dumps(newName)))
        return newName
    else:
        print("no match found for {}".format(json.dumps(name)))
        return None



    #merge first names
    #simmilar first names
    # merge last names
    # find matching second names

    

def splitExtern(regs,reg:Registration):
    if reg.Class=="extern":
        regs[0].append(reg)
    else:
        regs[1].append(reg)
    return regs

def filter(predicate, iterable):
    return itertools.filterfalse(lambda x:not predicate(x),iterable)

async def loadRegList(path):
    files=os.listdir(path)
    paths=[pathlib.Path(path,file) for file in files]
    return [await loadReg(x) for x in paths]

def externReduce(extern):
    names=[(k,list([x[0] for x in g]))for k,g in itertools.groupby(sorted(extern))]
    namesSorted=[(k,sorted(g)[-1])for k,g in names]
    return namesSorted

def internReduce(intern, names):
    closest=[(reg,findClosestClasses(names,Name(Class=reg.Class,firstName=reg.firstName,secondName=reg.secondName)))for reg in intern]
    closestFiltered=filter(lambda x:x[1]!=None,closest)
    grouped=[(k,list([x[0] for x in g]))for k,g in itertools.groupby(sorted(closestFiltered,key=lambda x:x[1]),lambda x:x[1])]
    sortedRegistration=[(k,list(sorted(g,key=lambda x:x.timestamp))) for k,g in grouped]
    lastRegistrations=[(k,g[-1])for k,g in sortedRegistration]
    return lastRegistrations


async def main(args):
    namesPromise=loadClassList(args.classes)
    regPromise=loadRegList(args.registration)
    names=list(await namesPromise)
    regs=await regPromise
    regs_filtered=itertools.filterfalse(lambda x:x==None,regs)
    (extern,intern)=functools.reduce(splitExtern,regs_filtered,([],[]))
    registrations=internReduce(intern,names)
    registrations.extend(externReduce(extern))
    print(registrations)
    #TODO implement splitting to workshop
asyncio.run(main(args))