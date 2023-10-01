const mongoose = require('mongoose')

const schema = mongoose.Schema({    
    title: { 
        type: String, 
        required: true
    },
    anime: { 
        type: String, 
        required: true
    },
    episode: { 
        type: String, 
        required: false
    },
    from: { 
        type: String, 
        required: true
    },
    url: { 
        type: String, 
        required: true
    },
    data: { 
        type: Object,
        required: false,
    },
    idt: { 
        type: String, 
        required: false
    },  
}, { versionKey: false, timestamps: true })

schema.index({createdAt: 1},{expireAfterSeconds: 172800}) // 2 dias
schema.index({idt: 1})

module.exports = mongoose.model('integration-event', schema)