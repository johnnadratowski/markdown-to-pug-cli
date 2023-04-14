#!/usr/bin/env node
const Md2pug = require('markdown-to-pug');
const anchor = require("markdown-it-anchor");
const highlight = require('markdown-it-highlightjs');
const { Command } = require('commander');
const chalk = require('chalk');
const { isBinary } = require('istextorbinary');
const path = require('path');
const isFile = require('is-file');
const isDirectory = require('is-directory');
const fh = require('./fileHandlers');
const Confirm = require('prompt-confirm');

// Exit codes
const NO_CONTENT_TO_CONVERT = 1;
const INPUT_FILE_PATH_INVALID = 2;
const FILE_IS_BINARY = 3;
const INPUT_DIR_PATH_INVALID = 4;
const OUTPUT_DIR_PATH_INVALID = 5;
const USER_ABORTED = 6;

// Globals
let outputDir;
let inputDir;
let files = [];

// Setup commander
const program = new Command();
program.name('md2pug');
program.description('Convert your markdown files into pug code');
program.version('md2pug v2.0.0', '-v, --version', 'output the current version');
program.option('-a, --anchor', 'use markdown-it-anchor plugin');
program.option('-s, --syntax-highlight', 'use markdown-it-highlightjs plugin');
program.option('-f, --file <file>', 'file to convert');
program.option('-d, --directory <dir>', 'convert every file in directory');
program.option('-o, --output <dir>', 'set where to save the converted file (only directory)');
program.option('-r, --recursive', 'convert directory recursively');
program.option('-S, --safe', 'will show the input, output dirertories and files, and prompt for accepting it before converting');
program.option('-V, --verbose', 'verbose mode');

// Parser given arguments
program.parse(process.argv);

// Function to log errors
const errorLog = (text) => console.log(`${chalk.magenta(program.name())} ${chalk.bgBlack.red('ERROR')} ${text}`);

// Function to log infos
const infoLog = (text, force = false) => {
    if (program.verbose || force) console.log(`${chalk.magenta(program.name())} ${chalk.bgYellow.black('INFO')} ${text}`);
}

// Check if the user is specified a file or a directory
if ((!program.file) && (!program.directory)) {
    errorLog('No such file or directory specified');
    process.exit(NO_CONTENT_TO_CONVERT);
}

// #######################################################################

// Make the converter instance
const converter = new Md2pug();

// Add plugins
if (program.anchor) {
    infoLog('Using markdown-it-anchor plugin');
    converter.md.use(anchor);
}

if (program.syntaxHighlight) {
    infoLog('Using markdown-it-highlightjs plugin');
    converter.md.use(highlight);
}

// #######################################################################

// File mode
if (program.file) {
    inputDir = path.normalize(program.file.replace(path.basename(program.file), ''));
    let file;

    if (inputDir === '.') {
        file = path.normalize(program.file);
    } else {
        file = path.normalize(program.file.replace(inputDir, ''));
    }
    
    // Check if file exists
    if (!isFile(inputDir + path.sep + file)) {
        errorLog(`Input is not a file or not exists: ${file}`);
        process.exit(INPUT_FILE_PATH_INVALID);
    }
    
    // Check if file is a binary
    if (isBinary(file)) {
        errorLog(`This is a binary file: ${file}`)
        process.exit(FILE_IS_BINARY);
    }

    files.push(file);
}

// #######################################################################

// Directory mode
if (program.directory) {
    inputDir = path.normalize(program.directory);
    
    if (!isDirectory.sync(inputDir)) {
        errorLog(`Input is not a directory or not exists: ${inputDir}`)
        process.exit(INPUT_DIR_PATH_INVALID);
    }

    fh.getMarkdownFilesInDirectory(inputDir, program.recursive).map((file) => {
        // files.push(path.relative(inputDir, file));
        files.push(path.normalize(file))
    });
}

// #######################################################################

// Set the output directory
if (program.output) {
    outputDir = path.normalize(program.output);

    if (!isDirectory.sync(outputDir)) {
        errorLog(`Output is not a directory or not exist: ${outputDir}`);
        process.exit(OUTPUT_DIR_PATH_INVALID);
    }

} else {
    outputDir = inputDir;
}

// #######################################################################


// Informations
infoLog(`Input directory: ${chalk.blue(inputDir)}`, program.safe);
infoLog(`Output directory: ${chalk.blue(outputDir)}`, program.safe);
infoLog('Collected files:', program.safe);
files.map((file, index) => {
    infoLog(`No. ${index}: ${chalk.blue(file)}`, program.safe);
});

// #######################################################################

if (program.safe) {
    const prompt = new Confirm('Do you want to continue?');
    prompt.ask(function (answer) {
        if (answer) {
            convert();
        } else {
            infoLog('User aborted.');
            process.exit(USER_ABORTED);
        }
    });
} else {
    convert();
}

function convert() {

    files.map((file) => {
        const outFileName = fh.chnageExtension(file);
        
        infoLog(`Converting ${chalk.blue(file)} to ${chalk.blue(outFileName)}`);

        const mdContent = fh.getFileContent(path.join(inputDir, file));

        const pugContent = converter.render(mdContent);
    
        fh.saveFile(path.join(outputDir, outFileName), pugContent);
        
    });
}

// TODO watch mode
