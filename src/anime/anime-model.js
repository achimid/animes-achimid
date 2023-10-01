const mongoose = require('mongoose')

const schema = mongoose.Schema({    
    name: {
        type: String,
        required: true,
        unique : true
    },
    names: {
        type: [{ type: String }],
        default: undefined
    },
    image: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    source: {
        mal: { type: Object },
        atc: { type: Object }
    },
    extra: {
        type: [{ type: Object }],
        default: undefined
    }    
}, { versionKey: false, timestamps: true })

module.exports = mongoose.model('anime', schema)