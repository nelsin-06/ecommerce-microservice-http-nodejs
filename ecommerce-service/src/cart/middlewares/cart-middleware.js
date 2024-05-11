async function cartDataProcessor(req, res, next) {

    const products = req.body.products


    const processedCart = {};
    products.forEach(item => {
        const key = item.productId + '-' + item.storeId;
        if (processedCart[key]) {
            processedCart[key].quantity += item.quantity;
        } else {
            processedCart[key] = { ...item };
        }
    });

    req.body.products = Object.values(processedCart)
    
    next()
}

module.exports = cartDataProcessor