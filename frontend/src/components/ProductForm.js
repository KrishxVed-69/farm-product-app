import React, { useState } from 'react';
import { Autocomplete, TextField, Button, Paper, Grid } from '@mui/material';

const farmProduce = [
  "Wheat", "Rice", "Corn", "Barley", "Oats", "Millet", "Sorghum", "Soybean", "Peanut", "Potato",
  "Tomato", "Onion", "Garlic", "Carrot", "Cabbage", "Spinach", "Apple", "Banana", "Grapes", "Mango",
  "Papaya", "Orange", "Lemon", "Watermelon", "Pumpkin", "Cucumber", "Peas", "Beans", "Lentil", "Chickpea"
];

const typeSuggestions = [
  "Plant", "Flower", "Fruit", "Vegetable", "Medicine", "Animal Product", "Herb", "Spice",
  "Grain", "Root", "Leafy", "Seed", "Nut", "Oilseed", "Pulse", "Fiber", "Beverage"
];

const resizableSx = {
  '& .MuiInputBase-root textarea': {
    resize: 'both',
    overflow: 'auto',
    minWidth: '120px',
    minHeight: '40px',
    boxSizing: 'border-box'
  }
};

function ProductForm({ onAdd, actionLoading }) {
  const [form, setForm] = useState({
    name: '',
    type: '',
    price: '',
    quantity: '',
    image: '',
    id: ''
  });
  const [filePreview, setFilePreview] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAutoChange = (event, value, field) => {
    setForm({ ...form, [field]: value || '' });
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
        setForm(f => ({ ...f, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.type || !form.price || !form.quantity) {
      alert('Please fill all fields.');
      return;
    }
    onAdd({
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
      image: form.image || undefined,
      id: form.id ? form.id : undefined
    });
    setForm({ name: '', type: '', price: '', quantity: '', image: '', id: '' });
    setFilePreview(null);
  };

  return (
    <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 4 }}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Autocomplete
              freeSolo
              options={farmProduce}
              value={form.name}
              onInputChange={(e, value) => handleAutoChange(e, value, 'name')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Name"
                  name="name"
                  required
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={6}
                  sx={resizableSx}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              freeSolo
              options={typeSuggestions}
              value={form.type}
              onInputChange={(e, value) => handleAutoChange(e, value, 'type')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Type"
                  name="type"
                  required
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={6}
                  sx={resizableSx}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Price"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Custom ID (optional)"
              name="id"
              value={form.id}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Image URL (optional)"
              name="image"
              value={form.image}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={actionLoading}
              sx={{
                minWidth: 120,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default ProductForm;
