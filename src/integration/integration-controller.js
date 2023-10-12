const router = require('express').Router()
const { CREATED } = require('http-status-codes').StatusCodes

const statusService = require('./../status/status-service')
const integrationService = require('./integration-service')

const queue = []

router.post('/callback', async (req, res) => {
    res.status(CREATED).send()    
    
    const { execution, request } = req.body

    console.log(`Execução do script ${request.url} ${execution.isSuccess} ${execution.executionTime}`, )

    const itens = execution.result

    if (execution.isSuccess == false || itens == null || itens == undefined || itens == "" || itens.length == 0) {
        statusService.updateStatus(request.ref, request.url, false)
        return console.error("Nenhum retorno na execução do script", req.body)        
    }

    integrationService.createFromList(itens)

    // queue.push(itens)
    // startIntegration()    

    statusService.updateStatus(request.ref, request.url, true)    
})

const integrate = async (itens) => {    
    console.time("integration.time");
    await integrationService.createFromList(itens)
    console.timeEnd("integration.time");
}

let isIntegrating = false
const startIntegration = async () => {
    if (isIntegrating || queue.length == 0) return

    isIntegrating = true
    while(queue.length > 0) {      
        console.log("File de integração ", queue.length)
        await integrate(queue.shift())
    }
    isIntegrating = false
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

setInterval(startIntegration, 30000)

module.exports = router