const express = require('express');
const app = express();
const  ProductController = require('../controller/Product');
const creatValidation = require('../middleware/validation');
const validator = require("../middleware/validation_01");


app.post('/addItem',validator.addItem,ProductController.addItem);
app.get('/get', ProductController.getAll);
app.get('/getItem',ProductController.getByID);
app.get('/filter/:discountPercentage',ProductController.filterByDiscountPer);
app.get('/filters/:category/:price', validator.filterByCategoryAndPrice,ProductController.filterByCategoryAndPrice);
app.patch('/updateItem/:id',creatValidation,ProductController.updateById);
app.delete('/deleteItem/:id',ProductController.deleteById);
app.delete('/deleteAll',ProductController.deleteAll);

app.get('/get-products/:id',ProductController.getProductsPurchasedByUser);
app.use('*', (req, res) => {
    return res.status(400).send('Wrong URL!');
});
module.exports = app;

