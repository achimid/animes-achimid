const mongoose = require('mongoose')

const schema = mongoose.Schema({    
    gAuth: { 
        type: Object,
        required: false
    },
    webSubscription: { 
        type: Object,
        required: false
    },
    animeToNotify: [{ 
        type: String,
        required: false
    }], 
    releaseNotified: [{ 
        animeId: { 
            type: String,
            required: false
        },
        episode: { 
            type: Object,
            required: false
        }
    }]
}, { versionKey: false, timestamps: true })

module.exports = mongoose.model('user', schema)