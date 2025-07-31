const router = require('express').Router()
const releaseService = require('../release/release-service')

var animesIds = []

releaseService.findAnimeIds().then(ids => {
    animesIds = ids
})

router.get('/sitemap.xml',  async (req, res) => {
    const dateH = new Date();
    dateH.setHours(dateH.getHours() - 4);

    const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://animes.achimid.com.br</loc>
    <lastmod>${dateH.toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://animes.achimid.com.br/animes</loc>
    <lastmod>${dateH.toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://animes.achimid.com.br/info</loc>
    <lastmod>2025-07-31T12:36:44.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  ${animesIds.map(i => {
    return `<url>
    <loc>https://animes.achimid.com.br/anime/${i}</loc>
    <lastmod>${dateH.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
  })}  
</urlset>`
    
    res.header('Content-Type', 'application/xml')
    res.send(content)
})

module.exports = router