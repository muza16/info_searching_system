import fs from 'fs'

const readFile = (path) => {
    return fs.readFileSync(path, { encoding: 'utf8' })
}

const args = process.argv.slice(2)

let fileNames = readFile('./files.txt').split(' ')

const formatTokens = (texts) => {
    return texts.join(' ').split(' ')
}

const formatNormalizedTokens = (texts) => {
    const tokens = formatTokens(texts)
    return tokens.join(' ').toLowerCase().replace(/[^a-z 0-9]/g, '').split(' ')
}

if (args.includes('-n') && args.length > 1) {
    const definedFilesContainerName = args[args.findIndex(arg => arg === '-n')+1]
    fileNames = readFile(definedFilesContainerName).split(' ')
}

let index = readFile('./index.txt').split(' ')

if (args.includes('-i') && args.length > 1) {
    const definedIndexContainerName = args[args.findIndex(arg => arg === '-i')+1]
    index = readFile(definedIndexContainerName).split(' ')
}

const parsedIndex = JSON.parse(index)

const argsWithoutOptions = args.filter((arg, id) => !arg.includes('-') && !args[id - 1]?.includes('-'))

const normalizedWord = formatNormalizedTokens(argsWithoutOptions)[0]

if(parsedIndex[normalizedWord]){
    const freqWithFileName = parsedIndex[normalizedWord].freq.map((freq, id) => ({
        file: fileNames[id],
        freq
    }))
    freqWithFileName.sort((a,b) => b.freq - a.freq).forEach(el => {
        console.log(`${el.freq} ${el.file}`)
    });
}