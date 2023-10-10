const Integration = require('./integration-model')

const { save, alreadyExists } = require('./integration-repository')
const { processRelease } = require('../release/release-service')

const createFromList = async (events) => {
    try {
        const eventsAlreadyExists = await Promise.all(events.map(alreadyExists))
        const eventsNotProcessed = eventsAlreadyExists.filter(i => !i.alreadyExists).map(i => i.integration)    
        
        console.log(`=> Chegaram ${events.length} novas integrações, porem apenas ${eventsNotProcessed.length} não haviam sido processadas` )

        await Promise.all(events.map(create))    
    } catch (error) {
        console.log('Error on integration batch', error)
    }     
}

const create = async (event) => {
    return Promise.resolve(new Integration(event))
        .then(save)
        .then(processRelease)
}



module.exports = {
    create,
    createFromList
}