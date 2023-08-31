const { body,param } = require("express-validator");

const validator = {
    filterByCategoryAndPrice: [
        param("category")
            .exists()
            .withMessage("category was not provided")
            .bail()
            .notEmpty()
            .withMessage('category cannot be empty')
            .bail()
            .isString()
            .withMessage("category must be a string"),
    ],
    addItem: [
        body("title")
          .exists()
          .withMessage("Title was not provided")
          .bail()
          .notEmpty()
          .withMessage("Title cannot be empty")
          .bail()
          .isString()
          .withMessage("Title must be a string"),
        body("description")
          .exists()
          .withMessage("Description was not provided")
          .bail()
          .notEmpty()
          .withMessage("Description cannot be empty")
          .bail()
          .isString()
          .withMessage("Description must be a string"),
        body("price")
          .exists()
          .withMessage("Price was not provided")
          .bail()
          .isNumeric()
          .withMessage("Price must be numeric")
          .custom((value) => {
            if (value <= 0) {
              throw new Error("Price cannot be 0 or negative");
            }
            return true;
          }),
        body("rating")
          .exists()
          .withMessage("Rating was not provided")
          .bail()
          .isNumeric()
          .withMessage("Rating must be numeric")
          .bail()
          .isFloat({ min: 0, max: 5 })
          .withMessage("Rating must be between 0 and 5"),
        body("stock")
          .exists()
          .withMessage("Stock was not provided")
          .bail()
          .isNumeric()
          .withMessage("Stock must be numeric")
          .bail()
          .custom((value) => {
            if (value <= 0) {
              throw new Error("Stock cannot be 0 or negative");
            }
            return true;
          }),
      ],
};

module.exports = validator;
