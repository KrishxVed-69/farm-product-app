import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, AppBar, Toolbar } from '@mui/material';
import api from './api';
import ProductForm from './components/ProductForm';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import ProductTable from './components/ProductTable';
import Notification from './components/Notification';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [notif, setNotif] = useState({ open: false, severity: 'success', message: '' });

  const showNotification = (severity, message) => setNotif({ open: true, severity, message });
  const handleNotifClose = () => setNotif({ ...notif, open: false });

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product) => {
    setActionLoading(true);
    try {
      await api.post('/product', product);
      fetchProducts();
      showNotification('success', `Added: ${product.name} (${product.type})`);
    } catch (err) {
      showNotification('error', err.response?.data?.error || 'Error adding product');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setActionLoading(true);
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      showNotification('success', 'Product deleted');
    } catch (err) {
      showNotification('error', err.response?.data?.error || 'Error deleting product');
    } finally {
      setActionLoading(false);
    }
  };

  // PATCH for incrementing quantity
  const incrementProduct = async (id) => {
    setActionLoading(true);
    try {
      await api.patch(`/products/${id}`, { op: 'increment' });
      fetchProducts();
      showNotification('success', 'Quantity increased');
    } catch (err) {
      showNotification('error', err.response?.data?.error || 'Error incrementing quantity');
    } finally {
      setActionLoading(false);
    }
  };

  // PATCH for decrementing quantity
  const decrementProduct = async (id) => {
    setActionLoading(true);
    try {
      await api.patch(`/products/${id}`, { op: 'decrement' });
      fetchProducts();
      showNotification('success', 'Quantity decreased');
    } catch (err) {
      showNotification('error', err.response?.data?.error || 'Error decrementing quantity');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div">
            Crop Product Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Notification {...notif} onClose={handleNotifClose} />
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Crop Product Dashboard
        </Typography>
        <ProductForm onAdd={addProduct} actionLoading={actionLoading} />
        <ErrorMessage message={error} />
        {loading ? (
          <Loader />
        ) : (
          <ProductTable
            products={products}
            onDelete={deleteProduct}
            onIncrement={incrementProduct}
            onDecrement={decrementProduct}
            actionLoading={actionLoading}
          />
        )}
        <Notification {...notif} onClose={handleNotifClose} />
      </Paper>
    </Container>
  );
}

export default App;
