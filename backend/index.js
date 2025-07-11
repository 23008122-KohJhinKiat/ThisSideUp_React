const port = 3000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const cors = require('cors');
const path = require('path');
const multer = require('multer');

app.use(cors());
app.use(express.json());

// Database Connetion
mongoose.connect("mongodb+srv://darys:cY0TWZoMSQIIWBi1@thissideupsite.knxw6oo.mongodb.net/ThisSideUp")

app.get("/", (req, res) =>{
    res.send("Express App is running")
})

// Image Storage
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req, file, cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})



const upload = multer({storage: storage})

app.use('/images', express.static('upload/images'))

app.post("/upload", upload.single('product'), (req, res)=>{
    res.json({
        success:1, 
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for Creating Products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true
    },
    name: { type: String, required: true },
    description: String,
    image: String,
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 70 },
    tags: [String],
    rating: { type: Number, default: 0 },
    numRatings: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    available: {
        type: Boolean,
        default: true
    }
})
app.post('/addproduct', async (req, res) => {
    let products =  await Product.find({});
    let id;
    if (products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        price: req.body.price,
        tags: req.body.tags,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name
    })
})

// Deleting Products
app.post('/deleteproduct', async (req, res)=>{
    await Product.findOneAndDelete({id: req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

// Getting All Products
app.get('/allproducts', async (req, res)=>{
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
})

app.listen(port, (error) => {
    if (!error){
        console.log("Server running on Port " +port)
    } 
    else {
        console.log("Error: "+error)
    }
})