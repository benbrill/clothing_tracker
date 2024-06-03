// src/components/ClothingCard.js
import React from 'react';
import { Card } from 'react-bootstrap';

const ClothingCard = ({ item, onSelect, isSelected }) => {
  if (!item) return null; // Early return if item is undefined

  return (
    <Card 
      style={{ 
        width: '18rem', 
        marginBottom: '1rem', 
        cursor: 'pointer', 
        outline: isSelected ? '2px solid blue' : '1px solid #ccc' ,
        transition: "outline 0.1s ease-out"
      }}
      onClick={() => onSelect(item.id)}
    >
      <Card.Img variant="top" src={process.env.PUBLIC_URL + "images/patagonia.jpg"} alt={item.category || 'Image'} />
      <Card.Body>
        <Card.Title>{item.category || 'No category'}</Card.Title>
        <Card.Text>
          <strong>Brand:</strong> {item.brand || 'No brand'}<br/>
          <strong>Color:</strong> {item.color || 'No color'}<br/>
          <strong>Size:</strong> {item.size || 'No size'}<br/>
          <strong>Price:</strong> {item.price || 'No price'}<br/>
          <strong>Quantity:</strong> {item.quantity || 'No quantity'}<br/>
          <strong>Purchase Date:</strong> {item.purchase || 'No purchase date'}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ClothingCard;
