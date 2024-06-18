const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const Product = require('./models/productmodel');

const app = express();
const port = 3000;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public/images/db');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = function (req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images only!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));


const dbURI = 'mongodb+srv://hagar2204577:R7nULH9qSYkl5otw@hagar.shuywlc.mongodb.net/alldata?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Routes
app.get('/', (req, res) => {
  res.redirect('/adminchange');
});

app.get('/adminchange', (req, res) => {
  res.render('adminchange');
});

app.post('/adminchange', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]), async (req, res) => {
  const { name, type, price, description, size, gender, quantity } = req.body;

  if (!name || !type || !price || !description || !size || !gender || !quantity) {
    return res.status(400).send('All fields are required.');
  }

  const productPrice = parseFloat(price);
  const productQuantity = parseInt(quantity, 10);

  if (isNaN(productPrice) || productPrice < 0) {
    return res.status(400).send('Price must be a positive number.');
  }

  if (isNaN(productQuantity) || productQuantity < 0) {
    return res.status(400).send('Quantity must be a positive integer.');
  }

  try {
    const imagePaths = {
      image1: req.files['image1'] ? req.files['image1'][0].path.replace('public', '') : null,
      image2: req.files['image2'] ? req.files['image2'][0].path.replace('public', '') : null,
      image3: req.files['image3'] ? req.files['image3'][0].path.replace('public', '') : null
    };

    const newProduct = new Product({
      image1: imagePaths.image1,
      image2: imagePaths.image2,
      image3: imagePaths.image3,
      name,
      type,
      price: productPrice,
      description,
      size,
      gender,
      quantity: productQuantity,
    });

    await newProduct.save();
    res.redirect('/adminchange');
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).send('Error saving product: ' + err.message);
  }
});
