const CustomerService = require("../service/customer-service");

module.exports = (app) => {

    const service = new CustomerService();
    app.use('/app-events', async(req, res, next) => {

        const { event, data } = req.body.payload;
        // const { payload } = req.body
        // console.log(data)
        // console.log(event)

        //handle subscribe events
        service.SubscribeEvents({ event, data });

        console.log("============= Shopping ================");
        // console.log(event);
        return res.json(event);
        // res.json(req)

    });

}