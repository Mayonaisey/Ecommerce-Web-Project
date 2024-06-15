const express=require("express");
const app=express();
const PORT=8080;

const productsRoute=require('./routes/products');
app.use('/products',productsRoute);

app.listen(PORT,()=>{
console.log("Server is running");
});