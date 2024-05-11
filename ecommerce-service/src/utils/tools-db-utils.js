function serializeData(dataToserialize) {
    return JSON.parse(JSON.stringify(dataToserialize))
}

module.exports = { serializeData }
