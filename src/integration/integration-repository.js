const Integration = require('./integration-model')

const save = async (integration) => {
    integration.idt = getIdt(integration)
    return integration.save()
}

const alreadyExists = async (integration) => {
    const alreadyExists = await Integration.findOne({ idt: getIdt(integration)})
    return {
        alreadyExists: alreadyExists !== null,
        integration
    }
}

const getIdt = (integration) => {
    return (integration.title + integration.anime + integration.episode + integration.from + integration.url).replace(/\s/g,'')
}

module.exports = {
    save,
    alreadyExists
}