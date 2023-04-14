const fs = require('fs');
const getAllFiles = require('get-all-files').default;
const fileExtension = require('file-extension');
const replaceExt = require('replace-ext');
const mkdirp = require('mkdirp');
const path = require('path');

/**
 * Returns the content of the file in path
 * @param {String} path 
 * @returns {String}
 */
function getFileContent(path) {
    return content = fs.readFileSync(path, 'utf8');
}

/**
 * Returns the files in the directory. Not recursive.
 * @param {String} path 
 * @returns {String[]}
 */
function getFilesInDirSingle(path) {
    return fs.readdirSync(path);
}

/**
 * Returns the files in the directory. Recursive.
 * @param {String} path
 * @returns {String[]}
 */
function getFilesInDirectoryRecusive(path) {
    return getAllFiles.sync.array(path)
}

/**
 * Returns files in the directory under path
 * @param {String} path The path to the directory
 * @param {Boolean} recursive If true, returns the files in subdirectories
 * @returns  {String[]} An array of files
 */
function getFilesInDirectory(path, recursive = false) {
    return (recursive)? getFilesInDirectoryRecusive(path) : getFilesInDirSingle(path);
}

/**
 * Writes content into a file
 * @param {String} path The path and the filename
 * @param {String} content The content
 */
function saveFile(filePath, content) {
    mkdirp.sync(filePath.replace(path.basename(filePath), ''));
    fs.writeFileSync(filePath, content);
}

/**
 * Returns only the markdown files in the directory under path
 * @param {String} path The path to the directory
 * @param {Boolean} recursive If true, returns the files in subdirectories too
 * @returns  {String[]} An array of files
 */
function getMarkdownFilesInDirectory(path, recursive = false) {
    return getFilesInDirectory(path, recursive)
        .filter(file => (fileExtension(file) === 'md'))
        .map(filePath => filePath.replace(path, ((path[path.length -1] === '/')? './': '.')));
}

/**
 * Changes the extension of the file to .pug
 * @param {String} path Path to the file
 * @returns {String} 
 */
function chnageExtension(path) {
    return replaceExt(path, '.pug');
}

exports.getFilesInDirSingle = getFilesInDirSingle;
exports.chnageExtension = chnageExtension;
exports.saveFile = saveFile;
exports.getFilesInDirectory = getFilesInDirectory;
exports.getFilesInDirectoryRecusive = getFilesInDirectoryRecusive;
exports.getFileContent = getFileContent;
exports.getMarkdownFilesInDirectory = getMarkdownFilesInDirectory;
