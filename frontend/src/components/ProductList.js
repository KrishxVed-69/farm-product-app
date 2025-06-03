// src/components/ProductList.js
import React from 'react';
import ProductItem from './ProductItem';

function ProductList({ products, onDelete, actionLoading }) {
  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.length === 0 && <li>No products found.</li>}
        {products.map(prod => (
          <ProductItem key={prod.id} product={prod} onDelete={onDelete} actionLoading={actionLoading} />
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
