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

argp=argparse.ArgumentParser()
argp.add_argument("classes")
argp.add_argument("registration")
argp.add_argument("--max_class_timestamp")
args=argp.parse_args()

async def flatten(iter2):
    for iter1 in iter2:
        for item in iter1:
            yield item

async def loadCLass(path):
    Class=pathlib.Path(path).name
    content=await aiofiles.open(path).readall()
    return map(lambda row:Name(Class,row[1],row[0]),csv.reader(content))

def loadClassList(path):
    files=os.listdir(path)
    classes=map(loadCLass,files)
    fattened=flatten(classes)

async def main(args):
    classPromnise=loadClassList(args.classes)
    names=[]
    for name in classPromnise:
        names.append(await name)
    print(names)

print(args)

asyncio.run(main(args))