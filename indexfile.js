import fs from 'fs'

const args = process.argv.slice(2)

const readFile = (path) => {
    return fs.readFileSync(path, { encoding: 'utf8' })
}

const formatTokens = (texts) => {
    return texts.join(' ').split(' ')
}

const formatNormalizedTokens = (texts) => {
    const tokens = formatTokens(texts)
    return tokens.join(' ').toLowerCase().replace(/[^a-z 0-9]/g, '').split(' ')
}

const formatUniqueWords = (texts) => {
    const normalizedTokens = formatNormalizedTokens(texts)
    return [...new Set(normalizedTokens)]
}

const filesContent = []

if(args.length && args.every(arg => arg.includes('.txt'))){
    args && args.forEach(fileName => {
        filesContent.push({
            name: fileName,
            text: readFile(fileName)
            }
        )
    })
}
if(args.length === 1 && args[0].includes('./')){
    const filesNames = fs.readdirSync(args[0])
    filesNames && filesNames.forEach(fileName => {
        filesContent.push({
            name: fileName,
            text: readFile(`./sources/${fileName}`)
            }
        )
    })
}
if(args.length === 0){
    const filesNames = readFile('files.txt').split(' ')
    filesNames && filesNames.forEach(fileName => {
        filesContent.push({
                name: fileName,
                text: readFile(fileName)
            }
        )
    })
}

const uniqueWords = formatUniqueWords(filesContent.map(fileContent => fileContent.text))
const index = {}
let link = null

uniqueWords.forEach((word, id) => {
    id ? index[link].nextNode = word : index.head = word
    const wordFreq = filesContent.map(file => formatNormalizedTokens([file.text]).filter(normalizedToken => normalizedToken === word).length)
    link = word
    index[word] = {
        word,
        freq: wordFreq
    }
})

fs.writeFileSync('index2.txt', JSON.stringify(index));
