const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://farm-product-eno6rkjwx-krishsaini688-gmailcoms-projects.vercel.app',
  'https://farm-product-app-flax.vercel.app'
  // add any other deployed frontend URLs here
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));


// === MIDDLEWARE ===
app.use(bodyParser.json());

// === FILE HELPERS ===
function readProducts() {
  try {
    const data = fs.readFileSync('products.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeProducts(products) {
  fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
}

// === ROUTES ===

// Add a new product
app.post('/product', (req, res) => {
  const { name, type, price, quantity } = req.body;
  if (!name || !type || typeof price !== 'number' || typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Invalid input. Required: name, type (string); price, quantity (number).' });
  }
  const products = readProducts();
  const newProduct = {
    id: Date.now().toString(),
    name,
    type,
    price,
    quantity
  };
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// List all products
app.get('/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Get a product by ID
app.get('/products/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json(product);
});

// Delete a product by ID
app.delete('/products/:id', (req, res) => {
  let products = readProducts();
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  const deleted = products.splice(index, 1)[0];
  writeProducts(products);
  res.json({ message: 'Product deleted.', product: deleted });
});

// === ERROR HANDLER ===
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS error: This origin is not allowed.' });
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// === START SERVER (only once!) ===
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
