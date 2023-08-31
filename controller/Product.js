const path = require('path');
const fs = require ('fs');
const ProductModel = require('../model/Product');
//const UserModel = require('../model/user');
const {success,failure} =require('../util/common');
const logFilePath = path.join(__dirname, 'server', 'log.txt');
const { validationResult } = require("express-validator");


class Product{
    //getAll
    async getAll(req,res){
        try {
            const result = await ProductModel.getAll();    
            if (result.success) {
                return res.status(200).send(success("Successfully received all products", result.data));
            } else {
                return res.status(500).send(failure("No Data found!"));
            }
        } catch (error) {
            return res.status(500).send(failure("Internal server error"));
        }
    }

    //get By id
    async getByID(req,res){
        const {id} =req.query;
        try{

            if(id){
                const itemResult = await ProductModel.getItemById(id);
                if(itemResult.success){
                    return res.status(200).send(success('Item fetched by id Successfully!', itemResult));
                }
                else{
                    return res.status(400).send(failure('Item not found!'));
                }
            }
            else{
                return res.status(400).send(failure('ID parameter is required.'));
            }

        }catch(error){
            return req.status(500).send(failure("Server Error..."));
        }
    
    }

    //delete By Id
    async deleteById(req,res){
        const{id} =req.params;
        try{
             const deleteItemResult = await ProductModel.deleteById(id);
            if(deleteItemResult.success){
                return res.status(200).send(success('Item deleted Successfully',deleteItemResult));
            }
            else{
                return res.status(400).send(failure('Item not found!'));
            }
        }
        catch(error){
                return res.status(500).send(failure('Server error...'));
        }
    }
    
    //add Item
    async addItem(req,res){
        try{
            const validation = validationResult(req).array();
            if(validation.length===0){
                    const addItemResult = await ProductModel.addItem(req.body);
                    if (addItemResult.success) {
                        const item = req.body;
                        return res.status(200).send(success('Great! Item Added!', item));
                    } else {
                        return res.status(400).send(failure(addItemResult.errors));
                    }            
                } 
                else {
                    return res.status(422).send(failure("Invalid inputs provided", validation));
                  }
        }catch(error){
            return res.status(500).send(failure("Internal server error"));
        }
    }

    //update By Id
    async updateById(req,res){        
        const { id } = req.params;        
        try{
            const updatedItemResult = await ProductModel.updateById(id, req.body);
            if (updatedItemResult.success) {  
                return res.status(200).send(success('Item updated successfully!'));
        
            } else {
                if (updatedItemResult.errors && updatedItemResult.errors.length > 0) {
                    return res.status(400).send(failure(updatedItemResult.errors));
                 } else {
                     return res.status(404).send(failure('Item not found!')); 
                }
            }
        }catch(error){
            return res.status(500).send(failure('Server error...'));
        }
        
    }

    //delete All
    async deleteAll(req,res){        
        try{
            const deleteAll = await ProductModel.deleteAll();
            if(deleteAll.success){
                return res.status(200).send(success('Deleted All item Successfully!'));
            }
            else{
                return res.status(400).send(failure('The file is already empty'));
            }
        }
            catch(error){
                return res.status(500).send(failure('Server Error...'));
        }

    }

    //filter by 
    async filterByDiscountPer(req,res){
        const {discountPercentage} = req.params;                 

            const itemResult = await ProductModel.filterByDiscountPer(discountPercentage);    
            if (itemResult.success) {
                if (itemResult.data.length > 0) {
                    return res.status(200).send(success('Item fetched Successfully!', itemResult.data));
                } else {
                    return res.status(404).send(failure('No items match the filtering criteria.'));
                }
            } else {
                return res.status(500).send(failure('Server Error...'));
            }  
    }
    //filter by category and Price
    async filterByCategoryAndPrice(req,res){
        try{
            const validation = validationResult(req).array();

            console.log(validation);

            if(validation.length===0){
                const {category,price} = req.params;                      

                const itemResult = await ProductModel.filterByCategoryAndPrice(category, price);
    
                if (itemResult.success) {
                    if (itemResult.data.length > 0) {
                        return res.status(200).send(success('Item fetched Successfully!', itemResult.data));
                    } else {
                        return res.status(404).send(failure('No items match the filtering criteria.'));
                }
                } else {
                        return res.status(500).send(failure('Server Error...'));
                }  
            }
            else{
                return res.status(422).send(failure("Invalid path", validation));
            }
        }catch(error){
                return res.status(500).send(failure("Interval Server error"))
        }
    }


    
    async getProductsPurchasedByUser(req,res){
        const {id} = req.params;  
            const itemResult = await ProductModel.getProductsPurchasedByUser(id);    
            if (itemResult.success) {
                if (itemResult.data.length > 0) {
                    return res.status(200).send(success('Item fetched Successfully!', itemResult.data));
                } else {
                    return res.status(404).send(failure('No items match the filtering criteria.'));
                }
            } else {
                return res.status(500).send(failure('Server Error...'));
            }  
    }
    

}

module.exports = new Product();