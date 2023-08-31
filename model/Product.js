const fs = require ('fs');
const fsPromise = require('fs').promises;
const path = require('path');
const { success ,failure} = require('../util/common');
const { constants } = require('http2');


const file = path.join(__dirname,'..','data','products.json');
const file1 = path.join(__dirname,'..','data','user.json');
class Product{
    // getAll function
    async getAll(){
     return fsPromise
    .readFile(file, {encoding:'utf-8'})
    .then((data)=>{
         return {success: true,data: JSON.parse(data)};
    })
    .catch((error)=>{
         return {success:false};
    })
     } 
    //addItem
   async addItem(Product){
          const data = await fsPromise.readFile(file, { encoding: 'utf-8' });              
          const Data =JSON.parse(data);
          let lastID=1;
          if(lastID>0){
               const lastProduct = Data[Data.length-1];
               lastID = lastProduct.id+1;
          }
          const addedData = {...Product,id: lastID};          
          Data.push(addedData);
          const stringifyData =JSON.stringify(Data)

          return fsPromise
          .writeFile(file,stringifyData)
          .then(()=>{
               return {success: true};
          })
          .catch((error)=>{
               return {success:false};
          })

    }    
     // getItemByID
    async getItemById(id){
     return fsPromise
     .readFile(file, {encoding:'utf-8'})
     .then((data)=>{
          const parsedData = JSON.parse(data);
          const findItem = parsedData.filter((item) => item.id == id);
          if(findItem.length==0){
               return {success:false}
          }
          else{

               const itemIndex = parsedData.findIndex((item) => item.id == id)
               const val=parsedData[itemIndex];
               return { success:true, data:val};
          }
     })
     .catch((error)=>{
          return {success:false};
     })
    }
    //updateById
    async updateById(id, product) {     
     return fsPromise
     .readFile(file, {encoding:'utf-8'})
     .then((data)=>{
          const parsedData = JSON.parse(data);
          const productParsed = product;         
          const findItem = parsedData.filter((item) => item.id != id);
          if(findItem.length==parsedData.length){
               return {success:false,message:'ID not found'};
          }
          else{               
               const itemIndex = parsedData.findIndex((item) => item.id == id) ;         
               parsedData[itemIndex]={...parsedData[itemIndex],...productParsed};

               const stringifyData = JSON.stringify(parsedData);
               return fsPromise
               .writeFile(file, stringifyData)
               .then(()=>{
                    return { success: true };
               })
               .catch((error)=>{
                    return { success: false };
                    }) 
          }
     })
     .catch((error)=>{
          return {success:false};
     })
     }
    //deleteByID   
    async deleteById(id){
          try {
              const data = await fsPromise.readFile(file, { encoding: 'utf-8' });
              const parsedData = JSON.parse(data);
 
              const updatedItem = parsedData.filter(item => item.id != id);
      
              if (updatedItem.length === parsedData.length) {
                  return { success: false};
              }
      
              const stringifyData = JSON.stringify(updatedItem);
      
              await fsPromise.writeFile(file, stringifyData);
      
              return { success: true};
          } catch (error) {
              return { success: false};
          }
         
    }
    //Delete All
    async deleteAll(){
           try{
               const data = await fsPromise.readFile(file, { encoding: 'utf-8' });
               const parsedData = JSON.parse(data);
               //const parsedData =data;
               if (parsedData.length === 0) {
                    return {success:false};
               }

               const emptyString =[];
               const stringifyEmpty = JSON.stringify(emptyString);
               return fsPromise
               .writeFile(file, stringifyEmpty)
               .then(()=>{
                    return { success: true };
               })
               .catch((error)=>{
                    return { success: false };
               }) 

          }
          catch(error){
               return {success:false};
          }
     }
     //filter by discountPrice
     async filterByDiscountPer(discountPercentage){
          try{
               const data = await fsPromise.readFile(file,{encoding:'utf-8'});
               const parsedData = JSON.parse(data);
               let filteredItem = [];

               if(!isNaN(discountPercentage)){
                    filteredItem = parsedData.filter((item)=> item.discountPercentage<=discountPercentage);
               }

               if(filteredItem.length>0){
                    return {success:true, data:filteredItem};
               }
               else{
                    return {success:false,message: 'There is no item with the category and price'};
               }

          }catch(error){
               return {success:false};
          }
     }
     //filter by category and price
     async filterByCategoryAndPrice(category,maxPrice){
          const data = await fsPromise.readFile(file, { encoding: 'utf-8' });
          const parsedData = JSON.parse(data);
          let filteredItem = parsedData;
     
          if(category){
               filteredItem = filteredItem.filter((item)=> item.category==category);
          }
          if(!isNaN(maxPrice)){
               filteredItem = filteredItem.filter((item)=> item.price<=maxPrice);
          }
     
          if(filteredItem.length>0){
               return {success:true, data:filteredItem};
          }
          else{
               return {success:false,message: 'There is no item with the category and price'};
          }
     }
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
              
              const purchasedProducts = parsedData.filter(product => purchasedIDs.includes(product.id));
      
              return { success: true, data: purchasedProducts };
          } catch (error) {
              return { success: false};
          }
          
      }

}

module.exports = new Product();