const fs = require ('fs');
const fsPromise = require('fs').promises;
const path = require('path');
const { success ,failure} = require('../util/common');
const { constants } = require('http2');


const file = path.join(__dirname,'..','data','products.json');
const file1 = path.join(__dirname,'..','data','user.json');
class UserClass{
 
    async getProductsPurchasedByUser(userId) {
        try {
            const Data = await fsPromise.readFile(file, { encoding: 'utf-8' });
            const parsedData = JSON.parse(Data);
    
            const userData = await fsPromise.readFile(file1, { encoding: 'utf-8' });
            const parsedUsersData = JSON.parse(userData);
    
            const userMatched = parsedUsersData.find(user => user.id === userId);
    
            if (!userMatched) {
                return { success: false, message: 'There is no user with this ID' };
            }
    
            const purchasedIDs = userMatched.ownedProducts;
    
            const purchasedProducts = purchasedIDs.map(productId => {
                const product = parsedProductsData.find(product => product.id === productId);
                return product; 
            });
    
            return { success: true, data: purchasedProducts };
        } catch (error) {
            return { success: false};
        }
        
    }
     
}

module.exports = new UserClass();