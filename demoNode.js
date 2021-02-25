const readline = require('readline');
const fs = require('fs');
const fileName = "demo.txt";
const {pipeline} = require('stream');
main();

async function main (){
    switch (process.argv[2]) {
        case "add":
            writeText(process.argv);
            break;
        case "read":
            readFile(process.argv);
            break;
        case "copy":
            copyFile(process.argv);
            break;
        default:
            break;
    }
}

/* load on ram only
async function writeText(args){
    let input = await readInput();
    fs.writeFileSync(fileName,input+"\n",{flag: "a+"});
}*/
async function writeText(args){
    let input = await readInput();
    let writableFile = fs.createWriteStream(fileName, {flags: "a"});
    writableFile.write(input+"\n");
    writableFile.end();
}

/*function readFile(args){
    let data = fs.readFileSync(fileName, {encoding: "utf-8"});
    console.log(data);
}*/

function readFile(args){
    let readerFile = fs.createReadStream(fileName);
    readerFile.setEncoding("utf-8");

    readerFile.on("data", function(data) {
        console.log(data);
    });

    readerFile.on("end", function(){
        readerFile.close();
    });
}

/*
async function copyFile(args){
    let copyFilename = await readInput("Ingrese nombre de archivo copia: ");
    let data = fs.readFileSync(fileName, {encoding: "utf-8"});
    fs.writeFileSync(copyFilename,data);
}*/

async function copyFile(args){
    let fileDestinationName = await readInput("Ingrese nombre de archivo copia: ");
    let readerFile = fs.createReadStream(fileName);
    let writableFile = fs.createWriteStream(fileDestinationName);
    pipeline(readerFile,writableFile, function(err){
        if (err)
            console.log(err);
        else
            console.log("Copia exitosa");
    });
}

function readInput(instructions = "Agrega tu mensaje: "){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(function(res,rej){
        rl.question(instructions, function(input){
            rl.close();
            res(input);
        })
    })
}