/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to enable CORS
app.use(cors());

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
  const { name, type, price, quantity, id } = req.body;

  // 1. Validate input
  if (!name || !type || typeof price !== 'number' || typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Invalid input. Required: name, type (string); price, quantity (number).' });
  }

  // 2. Read existing products
  const products = readProducts();

  // 3. Set id with prefix if provided, else generate one
  let productId;
  if (id) {
    productId = id;
  } else {
    // Generate a new id with prefix and timestamp
    productId = `${Date.now()}`;
  }

  // 4. Check for duplicate id
  if (products.some(p => p.id === productId)) {
    return res.status(400).json({ error: "Product ID already exists. Please use a unique ID." });
  }

  // 5. Create and save the new product
  const newProduct = {
    id: productId,
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

// EXPORT the Express app as a Firebase HTTPS function
exports.api = functions.https.onRequest(app);
// This code sets up an Express.js server with endpoints to manage products.
// It includes functionality to add, list, retrieve by ID, and delete products.
// The products are stored in a JSON file named 'products.json'.
// The server listens on port 3000 and can be deployed as a Firebase function.
// The code also includes error handling for invalid inputs and unexpected errors.