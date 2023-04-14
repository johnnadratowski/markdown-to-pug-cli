const fs = require('fs');
const getAllFiles = require('get-all-files');
const fileExtension = require('file-extension');
const replaceExt = require('replace-ext');
/**
 * Returns the content of the file in path
 * @param {String} path 
 * @returns {String}
 */
export function getFileContent(path) {
    return content = fs.readFileSync(path, 'utf8');
}

/**
 * Returns the files in the directory. Not recursive.
 * @param {String} path 
 * @returns {String[]}
 */
export function getFilesInDirSingle(path) {
    return fs.readdirSync(path);
}

/**
 * Returns the files in the directory. Recursive.
 * @param {String} path
 * @returns {String[]}
 */
export function getFilesInDirectoryRecusive(path) {
    return getAllFiles.sync.array(path)
}

/**
 * Returns files in the directory under path
 * @param {String} path The path to the directory
 * @param {Boolean} recursive If true, returns the files in subdirectories
 * @returns  {String[]} An array of files
 */
export function getFilesInDirectory(path, recursive = false) {
    return (recursive)? getFilesInDirectoryRecusive(path) : getFilesInDirSingle(path);
}

/**
 * Writes content into a file
 * @param {String} path The path and the filename
 * @param {String} content The content
 */
export function saveFile(path, content) {
    fs.writeFileSync(path, content);
}

/**
 * Returns only the markdown files in the directory under path
 * @param {String} path The path to the directory
 * @param {Boolean} recursive If true, returns the files in subdirectories too
 * @returns  {String[]} An array of files
 */
export function getMarkdownFilesInDirectory(path, recursive = false) {
    return getFilesInDirectory(path, content).filter(file => (fileExtension(file) === 'md'));
}

/**
 * Changes the extension of the file to .pug
 * @param {String} path Path to the file
 * @returns {String} 
 */
export function chnageExtension(path) {
    return replaceExt(path, '.pug');
}
