const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

// Allow requests from your local frontend and deployed frontend
app.use(cors({
  origin: [
    'http://localhost:3000',      // Default React dev server
    'http://localhost:3001',      // Your current dev server port
    'https://farm-product-app-flax.vercel.app' // Your deployed frontend URL
  ]
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Helper: Read products from file
function readProducts() {
  try {
    const data = fs.readFileSync('products.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper: Write products to file
function writeProducts(products) {
  fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
}

// POST /product - Add a new product
app.post('/product', (req, res) => {
  const { name, type, price, quantity } = req.body;
  // Simple validation
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

// GET /products - List all products
app.get('/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// GET /products/:id - Get a product by ID
app.get('/products/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json(product);
});

// DELETE /products/:id - Delete a product by ID
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

// Global error handler (optional, for catching unexpected errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
