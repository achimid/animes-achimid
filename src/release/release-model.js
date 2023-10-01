const mongoose = require('mongoose')

const schema = mongoose.Schema({    
    title: { 
        type: String, 
        required: true
    },
    episode: {
        type: String, 
        required: false
    },
    anime: { type: Object }, 
    mirrors: [{ type: Object }], 
    sources: [{ type: Object }]
}, { versionKey: false, timestamps: true })

module.exports = mongoose.model('release', schema)