const db = {}

const updateStatus = (name, url, status) => {
    db[name] = { ...db[name], name, url, status, lastExecution: new Date().toLocaleString() }
}

const updateLastRelease = (name) => {
    db[name].lastRelease = new Date().toLocaleString()
    db[name].status = true
}

const getStatus = async () => db

module.exports = {
    updateLastRelease,
    updateStatus,
    getStatus
}