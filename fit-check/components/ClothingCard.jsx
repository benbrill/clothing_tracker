// src/components/ClothingCard.js
import React from 'react';
import { Card } from 'react-bootstrap';
import Image from 'next/image';

const ClothingCard = ({ item, onSelect, isSelected }) => {
  if (!item) return null; // Early return if item is undefined
  console.log(process.env.NEXT_PUBLIC_API_URL)
  return (
    <div 
      style={{ 
        // width: '18rem', 
        marginBottom: '1rem', 
        cursor: 'pointer', 
        outline: isSelected ? '2px solid blue' : '1px solid #ccc' ,
        transition: "outline 0.1s ease-out",
        display: "flex",
        flexDirection: "column",
        flex: "1",
      }}
      onClick={() => onSelect(item.id)}
    >
      {/* <Card.Img variant="top" src={`${process.env.NEXT_PUBLIC_API_URL}/public/images/patagonia.jpg`} alt={item.category || 'Image'} /> */}
        <Image src={`/images/patagonia.jpg`} height={300} width={300} alt={item.category || 'Image'} />
        <h2>{item.brand || 'No brand'} {item.color || 'No color'} {item.category || 'No category'}</h2>
        <Card.Text>
          {/* <strong>Brand:</strong> {item.brand || 'No brand'}<br/>
          <strong>Color:</strong> {item.color || 'No color'}<br/>
          <strong>Size:</strong> {item.size || 'No size'}<br/>
          <strong>Price:</strong> {item.price || 'No price'}<br/>
          <strong>Quantity:</strong> {item.quantity || 'No quantity'}<br/>
          <strong>Purchase Date:</strong> {item.purchase || 'No purchase date'} */}
        </Card.Text>
    </div>
  );
};

export default ClothingCard;
