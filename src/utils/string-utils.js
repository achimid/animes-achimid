const stringSimilarity = require('string-similarity')

const selectBestMatch = async (name, details, fMapName) => {

    if (!details || details.length == 0) return null

    const similaritys = []

    for (let i = 0; i < details.length; i++) {
        const detail = details[i];
        const namesDetail =  [...new Set([].concat.apply([], fMapName(detail)))].filter(s => s)
        for (let j = 0; j < namesDetail.length; j++) {
            const nameDetail = namesDetail[j].toUpperCase()
            const nameCompateble = name.toUpperCase().replace('Temporada'.toUpperCase(), 'Season'.toUpperCase())
            
            const similarity = stringSimilarity.compareTwoStrings(nameCompateble, nameDetail);

            similaritys.push({similarity, detail})
            if (similarity > 0.75) {
                // console.log(`Similaridade bateu (${similarity}): ${name} != ${nameDetail}`)
                // return detail
            } else {
                // console.error(`Similaridade não bateu (${similarity}): ${name} != ${nameDetail}`)
            }
        }        
    }

    similaritys.sort((a, b) => {
        if (a.similarity < b.similarity) return 1;
        if (a.similarity > b.similarity) return -1;
        return 0;
    })

    const { similarity, detail} = similaritys[0]

    if (similarity > 0.75) {
        // console.log(`Similaridade bateu (${similarity}): ${name} != ${detail.title || detail.name }`)
        return detail
    }

    console.error(`*************** Nenhum anime encontrado com esse nome: ${name}`,)
    return null
}

module.exports = {
    selectBestMatch
}