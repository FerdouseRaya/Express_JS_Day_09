//Express Modules
const express = require ('express');
const app = express();
const {success,failure} = require('./util/common');
const ProductRouter = require('./routes/Product');
const dotenv = require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && body in err) {
      return res.status(400).send({ message: 'Invalid JSON format' });
  }
});

//main route
app.use('/products',ProductRouter);


app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });