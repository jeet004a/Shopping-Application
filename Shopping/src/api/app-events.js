const ShoppingService = require("../services/shopping-service");

module.exports = (app) => {

    const service = new ShoppingService();

    app.use('/app-events', async(req, res, next) => {

        const { event, data } = req.body.payload;
        console.log("============= Order ================");
        service.SubscribeEvents({ event, data });

        return res.status(200).json({ message: 'notified!' });

    });

}