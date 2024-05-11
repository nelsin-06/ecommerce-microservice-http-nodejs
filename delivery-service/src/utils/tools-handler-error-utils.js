
class CustomError extends Error {
    message
    status
    additionalInfo
    errorId
    constructor(
        message,
        status = 500,
        additionalInfo = {}
    ) {
        super()
        this.additionalInfo = additionalInfo
        this.status = status

        const code = status
        const error_code = status

        const getEntryPointFromCode = ''

        const getMessageFromCode = ''

        if (getMessageFromCode) {
            this.message = `${getEntryPointFromCode} - ${error_code} - ${getMessageFromCode}`
        }

        this.message = message
    }
}



const notFoundMiddle = async (req, res, next) => {
    await res.status(404).json({
        status: 404,
        message: 'Resource not found',
    })
    next()
}

const handleError = async (err, req, res, next) => {

    let error = JSON.parse(JSON.stringify(err ?? ''))
    console.log("🚀 ~ handleError ~ error:", error)
    if (!(err instanceof CustomError)) {
        error = new CustomError('Internal Error')
        error.additionalInfo = err.message
    }

    return next(res.status(error?.status ?? 500).json(error))
}

module.exports = { CustomError, notFoundMiddle, handleError }
