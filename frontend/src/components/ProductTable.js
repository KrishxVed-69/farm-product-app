import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Avatar, IconButton, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function ProductTable({
  products,
  onDelete,
  onIncrement,
  onDecrement,
  actionLoading
}) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>ID</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ color: 'grey.500' }}>
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map(prod => (
              <TableRow key={prod.id} hover>
                <TableCell>
                  <Avatar
                    src={
                      prod.image ||
                      `https://source.unsplash.com/40x40/?${encodeURIComponent(prod.type || prod.name)}`
                    }
                    alt={prod.name}
                    variant="rounded"
                  />
                </TableCell>
                <TableCell>{prod.name}</TableCell>
                <TableCell>{prod.type}</TableCell>
                <TableCell>₹{prod.price}</TableCell>
                <TableCell>{prod.quantity}</TableCell>
                <TableCell>{prod.id}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Increase quantity">
                    <span>
                      <IconButton
                        color="primary"
                        onClick={() => onIncrement(prod.id)}
                        disabled={actionLoading}
                        aria-label="add"
                        size="small"
                      >
                        <AddIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Decrease quantity">
                    <span>
                      <IconButton
                        color="secondary"
                        onClick={() => onDecrement(prod.id)}
                        disabled={actionLoading || prod.quantity <= 0}
                        aria-label="subtract"
                        size="small"
                      >
                        <RemoveIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Delete this product">
                    <span>
                      <IconButton
                        color="error"
                        onClick={() => onDelete(prod.id)}
                        disabled={actionLoading}
                        aria-label="delete"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProductTable;
