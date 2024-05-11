const { OrderStates } = require('../entities/order-entities')
const { UserPotencialActions } = require('../../user/entities/user-entities')
const { CustomError } = require('../../utils/tools-handler-error-utils')


function checkValidStatesSearchOrder(state, role) {

    let availableStates = []

    if (role == UserPotencialActions.marketplaceAdmin) {
        availableStates = [OrderStates.created, OrderStates.confirmed, OrderStates.dispatched, OrderStates.cancelled, OrderStates.delivered]
    } else {
        availableStates = [OrderStates.created, OrderStates.confirmed, OrderStates.dispatched, OrderStates.delivered]
    }

    if (!availableStates.includes(state)) {
        throw new CustomError('Invalid state to search orders', 400)
    }

}

module.exports = checkValidStatesSearchOrder