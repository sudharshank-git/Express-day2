import bodyParser from "body-parser";
import express from "express";
import productData from "./product.json" with { type: "json" };
import fs from "fs"

const requiredFields = [
    "name",
    "category",
    "price",
    "stock",
    "brand",
    "rating",
    "inStock"
];

const PORT = 3000;
const app = express();


app.use(bodyParser.urlencoded({extended:true}))


app.get("/products",(req,res)=>{
    try{
        res.status(200).json({
            message:"Product data fetched",
            Products: productData
        });
    }catch(err){
        res.status(404).json({
            message:"Product data not found",
        });
    }
})

app.get("/product/:id",(req,res)=>{
    const id = parseInt(req.params.id)
    try{
        const findData = productData.find(res => res.id === id )
        if(!findData){
            throw new Error("Product not found in this id")
        }
        res.json(findData)
    }catch(err){
        res.status(404).json({
            message: err.message
        })
    }
})
app.get("/products/filter",(req,res)=>{
    // Get Query Data To Filter
    const category = req.query.category
    const name = req.query.name
    const price = parseInt(req.query.price)
    const stock = parseInt(req.query.stock)
    const brand = req.query.brand
    const rating = parseInt(req.query.rating)
    const inStock = req.query.inStock
    // const size = parseInt(req.query.size)
    // const colors =req.query.colors
    // Filter Data Based On Query
    const filterData = productData.filter(res => res.category.toLowerCase() === category || 
    res.price <= price || 
    res.stock <= stock || 
    res.brand.toLowerCase() === brand || 
    res.rating <= rating || 
    String(res.inStock).toLowerCase() === inStock || 
    res.name.toLowerCase() === name) //|| res.size.S === size || res.size.M === size || res.colors.forEach(c => (c === colors)))
    try{
        // Check Proper Category Value Else Show The Available Category
        const categoryList = [...new Set(productData.map(f => f.category))]
        if(category !== undefined && filterData.length === 0){
            return res.status(404).json({message:"The category not found",Categories : categoryList})
        }
        // If No data is found throw error
        if(filterData.length<=0){
            throw new Error("Data is not found")
        }
        res.status(200).json({message:"Successfully Fetched Data ",ProductDetails :filterData})
    }catch(err){
        res.status(400).json({
            message : err.message}
        )
    }
})

app.post("/add/products",(req,res)=>{
    // Get Data From req.body
    const newProduct={
        "id": Math.max(...productData.map(product => product.id))+1,
        "name": req.body.name,
        "category": req.body.category,
        "price": parseInt(req.body.price),
        "stock": parseInt(req.body.stock),
        "brand": req.body.brand,
        "rating": parseFloat(req.body.rating),
        "inStock": Boolean(req.body.inStock),
        "size": JSON.parse(req.body.size),
        "colors": JSON.parse(req.body.colors)
    }
    try{
        // For Post Check If All required Data is Filled
        const missingField = requiredFields.filter(field => newProduct[field] === undefined)
        console.log(missingField)
        if(missingField.length >0){
            throw new Error("Not every required field is filled try again")
        }
        productData.push(newProduct)
        fs.writeFileSync("product.json" , JSON.stringify(productData,null,2) ,'utf-8')
        res.status(200).json({
            message : "New Product Added",
            "New Product" :newProduct}
        )
    }catch(err){
        res.status(400).json({
            message : err.message
        })
    }
})

app.put("/products/replace/:id",(req,res)=>{
    // Get The Data Id to be replaced and use the data index to replace
    const id = parseInt(req.params.id)
    const findData = productData.find(res => res.id === id)
    const findIndex = productData.findIndex(res => res.id === id)
    try{
        if(findIndex === -1){
                throw new Error("Could Not Find Product")
            }
        const replaceProduct={
            "id": id,
            "name": req.body.name,
            "category": req.body.category,
            "price": parseInt(req.body.price),
            "stock": parseInt(req.body.stock),
            "brand": req.body.brand,
            "rating": parseFloat(req.body.rating),
            "inStock": Boolean(req.body.inStock),
            "size": JSON.parse(req.body.size),
            "colors": JSON.parse(req.body.colors)
        }
        // for put all field needs data so check all field is filled 
        const missing = requiredFields.filter(res => req.body[res] === undefined)
        if(missing.length > 0){
            throw new Error("Missging Field Data try again")
        }
        // Replace the value of the data 
        productData[findIndex] = {id:id,...replaceProduct}
        fs.writeFileSync("product.json" , JSON.stringify(productData,null,2) ,'utf-8')
        res.status(200).json({
            message : "Product Replaced Completely",
            "Product Replaced" :replaceProduct}
        )
    }catch(err){
        res.status(400).json({
            message : err.message
        })
    }
})

app.patch("/products/update/:id",(req,res)=>{
    // Get Id to update the data
    const id = parseInt(req.params.id)
    const findData = productData.find(res => res.id === id)
    const findIndex = productData.findIndex(res => res.id === id)
    try{
        if(findIndex === -1){
            throw new Error("Could Not Find Product")
        }
        // update data with req.body or available data value
        const updatedProduct={
            "id": id,
            "name": req.body.name || findData.name,
            "category": req.body.category || findData.category,
            "price": parseInt(req.body.price) || findData.price,
            "stock": parseInt(req.body.stock) || findData.stock,
            "brand": req.body.brand || findData.brand,
            "rating": parseFloat(req.body.rating) || findData.rating,
            "inStock": Boolean(req.body.inStock) || findData.inStock,
            "size" : JSON.parse(req.body.size) || findData.size,
            "colors" : JSON.parse(req.body.colors) || findData.colors
        }
        // update the data 
        productData[findIndex] = updatedProduct
        fs.writeFileSync("product.json" , JSON.stringify(productData,null,2) ,'utf-8')
        res.status(200).json({
            message : "New Product Added",
            "New Product" :updatedProduct}
        )
    }catch(err){
        res.status(400).json({
            message : err.message
        })
    }
})


app.delete("/products/delete/:id",(req,res)=>{
    const id =parseInt(req.params.id);
    const findIndex = productData.findIndex(res => res.id === id);
    try{
        if(findIndex === -1){
            throw new Error("Data not found on this ID")
        }
        const deletedData = productData.splice(findIndex,1)
        fs.writeFileSync("product.json" , JSON.stringify(productData,null,2) ,'utf-8')
        res.status(200).json({
            message : "Product Deleted",
            "Removed Product" :deletedData}
        )
    }catch(err){
        res.status(400).json({
            message : err.message
        })
    }
})


app.delete("/products/remove/all",(req,res)=>{
    let deleteRecord = [...productData]
    productData.length = 0;
    console.log(productData)
    try{
        fs.writeFileSync("product.json" , JSON.stringify(productData,null,2) ,'utf-8')
        res.status(200).json({
            message : "All Product Deleted",
            "Removed Product" :deleteRecord}
        )
    }catch(err){
        res.status(400).json({
            message : "Unable to delete data",
            errer: err
        })
    }
})

app.listen(PORT,()=>{
    console.log(`Server is listening to port http://localhost:${PORT}/`)
})

