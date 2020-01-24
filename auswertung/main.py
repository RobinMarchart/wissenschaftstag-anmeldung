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
import hashlib
import io

Name=collections.namedtuple("Name",["Class","firstName","secondName"])
Registration=collections.namedtuple("Registration",["Class","firstName","secondName","firstWorkshop","secondWorkshop","timestamp"])
WorkshopDescr=collections.namedtuple("WorkshopDescr",["title","key","max","short"])

argp=argparse.ArgumentParser()
argp.add_argument("classes")
argp.add_argument("registration")
argp.add_argument("workshop_base")
argp.add_argument("out")
args=argp.parse_args()

async def readWorkshop(path):
    workshop=None
    async with aiofiles.open(path,encoding="utf8") as f:
        workshop= json.loads(await f.read())
    maxW=workshop["maxParticipants"] if "maxParticipants" in workshop else -1
    return WorkshopDescr(title=workshop["title"],key=hashlib.sha256(workshop["key"].encode("utf8")).hexdigest(),max=maxW,short=workshop["short"])

async def readWorkshops(workshop_base):
    index=None
    async with aiofiles.open(pathlib.Path(workshop_base,"index.json"),encoding="utf8") as f:
        index=json.loads(await f.read())
    workshops=[await readWorkshop(pathlib.Path(workshop_base,workshop)) for workshop in index['workshops']]
    return workshops

def flatten(iter2):
    for iter1 in iter2:
        for item in iter1:
            yield item

async def loadCLass(path):
    async with aiofiles.open(path, mode='r',encoding="utf8") as f:
        content=await f.read()
        rows=[x.split(";") for x in content.split("\n")]
        return [Name(row[2],row[0],row[1]) for row in rows]

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
    same=list(itertools.filterfalse(lambda x:not((x.Class.lower()==name.Class.lower()) and (x.firstName.lower()==name.firstName.lower()) and (x.secondName.lower()==name.secondName.lower())), classes))
    if len(same)>0:
        return same[0]
    ownClass=list(itertools.filterfalse(lambda x:x.Class.lower()!=name.Class.lower(),classes))
    classFirstName=set([x.firstName.lower() for x in ownClass])
    classFirstNameMatches=difflib.get_close_matches(name.firstName.lower(),classFirstName,n=len(classFirstName),cutoff=deviation)
    classMatchingFirstName=list(itertools.filterfalse(lambda x:not x.firstName.lower() in classFirstNameMatches,ownClass))
    classSecondName=set([x.secondName.lower() for x in classMatchingFirstName])
    classSecondNameMatches=difflib.get_close_matches(name.secondName.lower(), classSecondName,n=len(classSecondName),cutoff=deviation) if len(classSecondName)>0 else []
    classMatches=list(itertools.filterfalse(lambda x:not x.secondName.lower() in classSecondNameMatches,classMatchingFirstName))
    
    FirstName=set([x.firstName.lower() for x in ownClass])
    FirstNameMatches=difflib.get_close_matches(name.firstName.lower(),FirstName,n=len(FirstName),cutoff=deviation+0.1)
    MatchingFirstName=list(itertools.filterfalse(lambda x:not x.firstName.lower() in FirstNameMatches,ownClass))
    SecondName=set([x.secondName.lower() for x in MatchingFirstName])
    SecondNameMatches=difflib.get_close_matches(name.secondName.lower(), SecondName,n=len(SecondName),cutoff=deviation+0.1) if len(SecondName)>0 else []
    matches=set(itertools.filterfalse(lambda x:not x.secondName.lower() in SecondNameMatches,MatchingFirstName)).union(set(classMatches))

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

def regToName(reg):
    return Name(reg.Class,reg.firstName,reg.secondName)

def externReduce(extern):
    names=[(k,list(g))for k,g in itertools.groupby(sorted(extern,key=regToName),regToName)]
    namesSorted=[(k,sorted(g,key=lambda x:x.timestamp)[-1])for k,g in names]
    return namesSorted

def internReduce(intern, names):
    closest=[(reg,findClosestClasses(names,Name(Class=reg.Class,firstName=reg.firstName,secondName=reg.secondName)))for reg in intern]
    closestFiltered=filter(lambda x:x[1]!=None,closest)
    grouped=[(k,list([x[0] for x in g]))for k,g in itertools.groupby(sorted(closestFiltered,key=lambda x:x[1]),lambda x:x[1])]
    sortedRegistration=[(k,list(sorted(g,key=lambda x:x.timestamp))) for k,g in grouped]
    lastRegistrations=[(k,g[-1])for k,g in sortedRegistration]
    return lastRegistrations

def findWorkshop(workshops,key):
    return next((x for x in workshops if x.key==key),None)


async def writePerWorkshop(workshop,basepath):
    out=io.StringIO()
    writer=csv.writer(out,"excel")
    writer.writerow(["Name","Vorname","Klasse"])
    writer.writerows([[x[0].firstName,x[0].secondName,x[0].Class] for x in workshop[1]])
    async with aiofiles.open(pathlib.PurePath(basepath,"{}.csv".format(workshop[0].title)),mode="w") as f:
        await f.write(out.getvalue())
    out.close()

async def writePerWorkshop2(workshop,workshops,basepath):
    out=io.StringIO()
    writer=csv.writer(out,"excel")
    writer.writerow(["Name","Vorname","Klasse"])
    writer.writerows([[x[0].firstName,x[0].secondName,x[0].Class] for x in workshop[1]])
    async with aiofiles.open(pathlib.PurePath(basepath,"{}2.csv".format(findWorkshop(workshops,workshop[0]).title)),mode="w") as f:
        await f.write(out.getvalue())
    out.close()

async def writePerClass(workshop,Class,basepath):
    out=io.StringIO()
    writer=csv.writer(out,"excel")
    writer.writerow(["Name","Vorname","Workshop1","Workshop2"])
    writer.writerows(workshop)
    async with aiofiles.open(pathlib.PurePath(basepath,"{}.csv".format(Class)),mode="w") as f:
        await f.write(out.getvalue())
    out.close()

async def main(args):
    workshopsPromise=readWorkshops(args.workshop_base)
    namesPromise=loadClassList(args.classes)
    regPromise=loadRegList(args.registration)
    names=list(await namesPromise)
    regs=await regPromise
    regs_filtered=itertools.filterfalse(lambda x:x==None,regs)
    (extern,intern)=functools.reduce(splitExtern,regs_filtered,([],[]))
    registrations=internReduce(intern,names)
    registrations.extend(externReduce(extern))
    workshops=await workshopsPromise
    workshopRegistration =[(y,x,findWorkshop(workshops,x.firstWorkshop)) for y,x in registrations]
    tmp=[x for x,y in registrations]
    unused=set(names)-set(tmp)

    groupedWorkshops=[(findWorkshop(workshops,k),list(g)) for k,g in itertools.groupby(sorted(workshopRegistration,key=lambda x:x[2].key),lambda x:x[2].key)]

    add=[(w,[]) for w in set(workshops)-set([x[0] for x in groupedWorkshops])]
    groupedWorkshops.extend(add)

    for why in unused:
        sort=sorted(filter(lambda x:x[0].max>len(x[1]) if x[0].max!=-1 else True,groupedWorkshops),key=lambda x:len(x[1]))
        sort[0][1].append((why,None,sort[0][0]))

    try:
        os.mkdir(args.out)
    except:
        pass
    for perWorkshop in [writePerWorkshop(x,args.out) for x in groupedWorkshops]:
        await perWorkshop
    
    shorts=list(flatten([x[1] for x in filter(lambda y:y[0].short,groupedWorkshops)]))

    shortsSorted=list(filter(lambda x:x[0]!='',[(k,list(g)) for k,g in itertools.groupby(sorted(filter(lambda x:x[1]!=None,shorts),key=lambda x:x[1].secondWorkshop),lambda x:x[1].secondWorkshop)]))

    unused2=set(shorts)-set(flatten([x[1] for x in shortsSorted]))
    add2=[(w,[]) for w in set([x.key for x in filter(lambda x:x.short,workshops)])-set([x[0] for x in shortsSorted])]
    shortsSorted.extend(add2)

    for why in unused2:
        sort=sorted(filter(lambda x:findWorkshop(workshops,x[0]).max>len(x[1]) if findWorkshop(workshops,x[0]).max!=-1 else True,filter(lambda x:x[0]!=why[2].key,shortsSorted)),key=lambda x:len(x[1]))
        sort[0][1].append((why[0],None,sort[0][0]))

    for perWorkshop in [writePerWorkshop2(x,workshops,args.out) for x in shortsSorted]:
        await perWorkshop

    for perClass in itertools.groupby(sorted(names,key=lambda x:x.Class),lambda x:x.Class):
        ls=[(x.firstName,x.secondName,next((y for y in flatten([z[1] for z in groupedWorkshops]) if y[0]==x))[2].title,
          next(iter([findWorkshop(workshops,b[1]).title for b in (y for y in flatten([[(a[0],z[0]) for a in z[1]] for z in shortsSorted]) if y[0]==x)]),"")) for x in perClass[1]]
        await writePerClass(ls,perClass[0],args.out)

    #TODO implement splitting to workshop
asyncio.run(main(args))