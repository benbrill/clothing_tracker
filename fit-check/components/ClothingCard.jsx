// src/components/ClothingCard.js
import React from 'react';
import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import Image from 'next/image';
import ClothingCardModal from './ClothingCardModal';

const ClothingCard = ({ item, onSelect, isSelected }) => {
  if (!item) return null; // Early return if item is undefined
  const image_path = item.image_path || 'https://via.placeholder.com/150';

  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);



  return (
    <>
    <ClothingCardModal item={item} show={showModal} handleClose={handleClose}/>
    <Card 
      style={{ 
        // width: '18rem', 
        marginBottom: '1rem', 
        borderRadius: '0px',
        cursor: 'pointer', 
        outline: isSelected ? '2px solid blue' : '2px solid black' ,
        transition: "outline 0.1s ease-out",
        display: "grid",
        flexDirection: "column",
        flex: "1 0",
        minWidth: "100px"
      }}
      onClick={(onSelect) ? () => onSelect(item.id) : handleShow}
    >
      {/* <Card.Img variant="top" src={`${process.env.NEXT_PUBLIC_API_URL}/public/images/patagonia.jpg`} alt={item.category || 'Image'} /> */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '120%' }}>
          <Image src={image_path}  alt={item.category || 'Image'} layout='fill' objectFit='cover' sizes="(max-width: 600px) 100vw, 50vw"/>
        </div>
        {/* <Image src={`/images/${image_path}`}  alt={item.category || 'Image'} width={230} height={275} sizes="(max-width: 600px) 100vw, 50vw"/> */}
        <div style ={{fontSize: "1.25em", padding: "5px 5px"}} className='font-sans font-medium'>
          {item.brand || 'No brand'} {item.color || 'No color'} {item.category || 'No category'}
        </div>
        <button onClick={handleShow} className = "flex-end font-sans">View Details</button>
        <Card.Text>
          {/* <strong>Brand:</strong> {item.brand || 'No brand'}<br/>
          <strong>Color:</strong> {item.color || 'No color'}<br/>
          <strong>Size:</strong> {item.size || 'No size'}<br/>
          <strong>Price:</strong> {item.price || 'No price'}<br/>
          <strong>Quantity:</strong> {item.quantity || 'No quantity'}<br/>
          <strong>Purchase Date:</strong> {item.purchase || 'No purchase date'} */}
        </Card.Text>
    </Card>
    </>
  );
};

export default ClothingCard;
