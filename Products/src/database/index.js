const ProductRepository = require('./repository/product-repository');

module.exports = {
    databaseConnection: require('./connection'),
    ProductRepository: require('./repository/product-repository'),
}