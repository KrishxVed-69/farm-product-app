// src/components/ProductItem.js
import React from 'react';
import { IconButton, Avatar, ListItem, ListItemText, ListItemSecondaryAction, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function ProductItem({ product, onDelete, actionLoading }) {
  return (
    <ListItem divider>
      <Avatar
        src={product.image || `https://source.unsplash.com/40x40/?${encodeURIComponent(product.type)}`}
        alt={product.name}
        variant="rounded"
        sx={{ marginRight: 2 }}
      />
      <ListItemText
        primary={`${product.name} (${product.type})`}
        secondary={`₹${product.price} × ${product.quantity} ${product.id ? `| ID: ${product.id}` : ''}`}
      />
      <ListItemSecondaryAction>
        <Tooltip title="Delete this product">
          <span>
            <IconButton edge="end" aria-label="delete" color="error" onClick={() => onDelete(product.id)} disabled={actionLoading}>
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default ProductItem;
