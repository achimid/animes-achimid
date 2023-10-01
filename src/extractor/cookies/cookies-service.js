const fs = require('fs')
var path = require('path')

let cookiesCache = {}

const saveCookies = async (url, page) => {
    const cookies = await page.cookies()
    if (!cookies) return 

    cookiesCache[url] = cookies

    writeFile(JSON.stringify(cookiesCache, null, 2))
}

const getCookies = async (url,) => {
    const cookies = cookiesCache[url]
    if (!cookies) return 
    
    return cookies
}


const writeFile = (str, relPath = "./cookies.data") => fs.writeFileSync(path.join(__dirname, relPath), str)

const readFile = (relPath = "./cookies.data") => fs.readFileSync(path.join(__dirname, relPath))

const startCacheCookies = async () => {
    cookiesCache = JSON.parse(readFile())
}

module.exports = {
    getCookies,
    saveCookies,
    startCacheCookies
}