#!/usr/bin/env node
import { Command } from "commander";
import * as fs from "fs";
import path from "path";

const program = new Command();

function isString(value: any) : boolean {
    return typeof value === "string";
}

function preparePath(fileName: string) : string {
    return path.resolve(fileName);
}

async function readStream(
    stream: NodeJS.ReadStream | fs.ReadStream
  ): Promise<Buffer> {
    const chunks : Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }
function readFile(filepath: string) : string {
    return fs.readFileSync(filepath, 'utf8').toString()
}

function countBytes(filepath: string) : number { 
    return fs.statSync(filepath).size;
}

function countLines(fileContent: string) : number {
    return fileContent.split('\n').length - 1;
}

function countWords(fileContent: string) : number {
    let wordCount =  fileContent.trim().split(/\s+/).length;
    if (typeof wordCount === undefined) {
        return 0;
    }
    return wordCount;
}

function countCharacters(fileContent: string) : number {
    return fileContent.length;
}

program
    .version("1.0.0")
    .description("wc tool in Typescript")
    .option("-c, --bytes [value]", "outputs the number of bytes in a file")
    .option("-l, --lines [value]", "outputs the number of lines in a file")
    .option("-w, --words [value]", "outputs the number of words in a file")
    .option("-m, --characters [value]", "outputs the number of characters in a file")
    .parse(process.argv);

const options = program.opts();

if (options.bytes) {
    if (isString(options.bytes)){
        let filepath = preparePath(options.bytes);
        console.log(countBytes(filepath) + " " + options.bytes);
    }
    else {
        let buffer = await readStream(process.stdin);
        console.log(buffer.byteLength.toString());
    }
}
else if (options.lines){
    let fileContent : string = "";
    if (isString(options.lines)){
        let filepath = preparePath(options.lines);
        fileContent = readFile(filepath);
    }
    else {
        let buffer = await readStream(process.stdin);
        fileContent = buffer.toString();
    }    
    console.log(countLines(fileContent) + (isString(options.lines) ? ` ${options.lines}` : ""));
}
else if (options.words){    
    let fileContent : string = "";
    if (isString(options.words)){
        let filepath = preparePath(options.words);
        fileContent = readFile(filepath);
    }
    else {        
        let buffer = await readStream(process.stdin);
        fileContent = buffer.toString();
    }    
    console.log(countWords(fileContent) + (isString(options.words) ? ` ${options.words}` : ""));
}
else if (options.characters){    
    let fileContent : string = "";
    if(isString(options.characters)){
        let filepath = preparePath(options.characters);
        fileContent = readFile(filepath);
    }
    else {        
        let buffer = await readStream(process.stdin);
        fileContent = buffer.toString();
    }
    console.log(countWords(fileContent) + (isString(options.characters) ? ` ${options.characters}` : ""));
}
else if (process.argv.length === 3){
    let filepath = preparePath(process.argv[2]);    
    let fileContent = readFile(filepath);
    let bytes = countBytes(filepath);
    let lines = countLines(fileContent);
    let words = countWords(fileContent);
    console.log(
        bytes + ' ' + 
        lines + ' ' +
        words + ' ' +
        process.argv[2].toString());
}