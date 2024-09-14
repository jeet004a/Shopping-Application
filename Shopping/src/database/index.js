// const ProductRepository = require('./repository/product-repository');

module.exports = {
    databaseConnection: require('./connection'),
    ShoppingRepository: require('./repository/shopping-repository')
}