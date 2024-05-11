const { Cart } = require('../../../src/cart/entities/cart-entities');
const { CustomError } = require('../../../src/utils/tools-handler-error-utils');
const sinon = require('sinon');
const assert = require('assert');
const CartUseCase = require('../../../src/cart/usecases/cart-usecase');
const { faker } = require('@faker-js/faker');
const { Store, StoreDocument } = require('../../../src/store/entities/store-entities');

describe('CartUseCase', () => {
    let cartRepositoryStub;
    let productRepositoryStub;
    let storeRepositoryStub;
    let userRepositoryStub;
    let orderUseCaseStub;
    let cartUseCase;

    beforeEach(() => {
        cartRepositoryStub = {
            getCartByUserId: sinon.stub(),
            createCart: sinon.stub(),
            updateCart: sinon.stub(),
            getCarts: sinon.stub(),
        };
        productRepositoryStub = {
            getStoreByStoreId: sinon.stub(),
            getProductsByProductsCart: sinon.stub(),
            checkProductsAvailable: sinon.stub()

        }
        storeRepositoryStub = {
            getStoreByStoreId: sinon.stub(),

        };
        userRepositoryStub = {
            getUserById: sinon.stub()
        };
        orderUseCaseStub = {
            registerBuyOrder: sinon.stub()
        }

        cartUseCase = new CartUseCase(
            cartRepositoryStub,
            productRepositoryStub,
            storeRepositoryStub,
            userRepositoryStub,
            orderUseCaseStub
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should create a new cart', async () => {

        const store = new StoreDocument(
            faker.string.nanoid(),
            faker.company.name(),
            faker.company.buzzPhrase(),
            faker.string.nanoid(),
            faker.location.streetAddress()
        )

        const productsData = [
            {
                id: faker.string.nanoid(),
                name: faker.commerce.product(),
                description: faker.company.buzzPhrase(),
                price: faker.number.int({ max: 100, min: 10 }),
                sku: faker.string.alphanumeric(10),
                stock: 150,
                storeId: store.id
            }, {
                id: faker.string.nanoid(),
                name: faker.commerce.product(),
                description: faker.company.buzzPhrase(),
                price: faker.number.int({ max: 100, min: 10 }),
                sku: faker.string.alphanumeric(10),
                stock: 150,
                storeId: store.id
            }]

        const body = {
            userId: faker.string.nanoid(),
            products: productsData.map(product => {
                return {
                    productId: product.id,
                    storeId: product.storeId,
                    quantity: 10
                }
            })
        }


        cartRepositoryStub.getCartByUserId.resolves(null);
        cartRepositoryStub.createCart.resolves(true);
        storeRepositoryStub.getStoreByStoreId.resolves(store)
        productRepositoryStub.getProductsByProductsCart.resolves(productsData)



        const result = await cartUseCase.createCart(body);

        assert.strictEqual(result, true);
        // sinon.assert.calledOnceWithExactly(cartUseCase.createCart, sinon.match(body));
    })


    it('should create a new cart but fail due to insufficient stock', async () => {
        const store = new StoreDocument(
            faker.string.nanoid(),
            faker.company.name(),
            faker.company.buzzPhrase(),
            faker.string.nanoid(),
            faker.location.streetAddress()
        )

        const productsData = [
            {
                id: faker.string.nanoid(),
                name: faker.commerce.product(),
                description: faker.company.buzzPhrase(),
                price: faker.number.int({ max: 100, min: 10 }),
                sku: faker.string.alphanumeric(10),
                stock: 5,
                storeId: store.id
            }, {
                id: faker.string.nanoid(),
                name: faker.commerce.product(),
                description: faker.company.buzzPhrase(),
                price: faker.number.int({ max: 100, min: 10 }),
                sku: faker.string.alphanumeric(10),
                stock: 150,
                storeId: store.id
            }]

        const body = {
            userId: faker.string.nanoid(),
            products: productsData.map(product => {
                return {
                    productId: product.id,
                    storeId: product.storeId,
                    quantity: 10
                }
            })
        }

        cartRepositoryStub.getCartByUserId.resolves(null);
        storeRepositoryStub.getStoreByStoreId.resolves(store)
        productRepositoryStub.getProductsByProductsCart.resolves(productsData)

        await assert.rejects(async () => {
            await cartUseCase.createCart(body);
        }, CustomError);

        sinon.assert.notCalled(cartRepositoryStub.createCart);
    })

    it('should create a new cart but fails due to incorrect products', async () => {
        const store = new StoreDocument(
            faker.string.nanoid(),
            faker.company.name(),
            faker.company.buzzPhrase(),
            faker.string.nanoid(),
            faker.location.streetAddress()
        )

        const productsData = [
            null, {
                id: faker.string.nanoid(),
                name: faker.commerce.product(),
                description: faker.company.buzzPhrase(),
                price: faker.number.int({ max: 100, min: 10 }),
                sku: faker.string.alphanumeric(10),
                stock: 150,
                storeId: store.id
            }]

        const body = {
            userId: faker.string.nanoid(),
            products: productsData.map(product => {
                return {
                    productId: faker.string.nanoid(),
                    storeId: product?.storeId,
                    quantity: 10
                }
            })
        }

        cartRepositoryStub.getCartByUserId.resolves(null);
        storeRepositoryStub.getStoreByStoreId.resolves(store)
        productRepositoryStub.getProductsByProductsCart.resolves(productsData)

        await assert.rejects(async () => {
            await cartUseCase.createCart(body);
        }, CustomError);

        sinon.assert.notCalled(cartRepositoryStub.createCart);
    })

    it('should buy cart', async () => {
        const userId = faker.string.nanoid()
        const user = {
            id: userId,
            name: faker.person.firstName(),
            shippingAddres: faker.location.streetAddress()
        };

        const store = new StoreDocument(
            faker.string.nanoid(),
            faker.company.name(),
            faker.company.buzzPhrase(),
            faker.string.nanoid(),
            faker.location.streetAddress()
        )

        const products = [
            {
                id: faker.string.nanoid(),
                name: faker.commerce.product(),
                description: faker.company.buzzPhrase(),
                price: faker.number.int({ max: 100, min: 10 }),
                sku: faker.string.alphanumeric(10),
                stock: 150,
                storeId: store.id
            }, {
                id: faker.string.nanoid(),
                name: faker.commerce.product(),
                description: faker.company.buzzPhrase(),
                price: faker.number.int({ max: 100, min: 10 }),
                sku: faker.string.alphanumeric(10),
                stock: 150,
                storeId: store.id
            }]

        const cart = new Cart(
            userId,
            products.map(product => {
                return {
                    productId: product.id,
                    storeId: product.storeId,
                    quantity: faker.number.int({ max: 10 })
                }
            }),
            true
        )

        cartRepositoryStub.getCartByUserId.resolves(cart);

        userRepositoryStub.getUserById.resolves(user);
        storeRepositoryStub.getStoreByStoreId.resolves(store)
        productRepositoryStub.getProductsByProductsCart.resolves(products)
        orderUseCaseStub.registerBuyOrder.resolves(true);
        cartRepositoryStub.updateCart.resolves(true);

        const result = await cartUseCase.buyCart(userId);

        assert.strictEqual(result, true);
        sinon.assert.calledOnceWithExactly(cartRepositoryStub.getCartByUserId, userId)
        sinon.assert.calledOnceWithExactly(userRepositoryStub.getUserById, userId);
        sinon.assert.called(storeRepositoryStub.getStoreByStoreId)
        sinon.assert.callCount(orderUseCaseStub.registerBuyOrder, products.length);
    });

    it('should throw an error if user does not have an active cart', async () => {
        const userId = faker.string.nanoid();

        cartRepositoryStub.getCartByUserId.resolves(null);

        await assert.rejects(async () => {
            await cartUseCase.buyCart(userId);
        }, CustomError);

        sinon.assert.calledOnceWithExactly(cartRepositoryStub.getCartByUserId, userId);
        sinon.assert.notCalled(productRepositoryStub.checkProductsAvailable);
        sinon.assert.notCalled(userRepositoryStub.getUserById);
        sinon.assert.notCalled(storeRepositoryStub.getStoreByStoreId);
        sinon.assert.notCalled(orderUseCaseStub.registerBuyOrder);
        sinon.assert.notCalled(cartRepositoryStub.updateCart);
    });


});