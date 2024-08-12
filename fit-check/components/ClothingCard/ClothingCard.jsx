// src/components/ClothingCard.js
import React from 'react';
import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import Image from 'next/image';
import ClothingCardModal from './ClothingCardModal';

const ClothingCard = ({ item, onSelect, isSelected, viewDetails}) => {
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
      //   // width: '18rem', 
      //   marginBottom: '1rem', 
        borderRadius: '0px',
      //   cursor: 'pointer', 
        background: isSelected ? 'rgb(226 232 240)' : 'white' ,
        borderColor: isSelected ? 'rgb(3 105 161)' : 'rgb(50 50 50)' ,
      //   // transition: "outline 0.1s ease-out",
      //   display: "grid",
      //   flexDirection: "column",
      //   flex: "1 0",
      //   minWidth: "100px"
      }}
      className={`hover:bg-slate-200 transition border-${isSelected ? 3 : 2} hover:border-sky-700 rounded-none cursor-pointer grid flex-grow flex-shrink-0 min-w-28 mb-4`}
    >
      {/* <Card.Img variant="top" src={`${process.env.NEXT_PUBLIC_API_URL}/public/images/patagonia.jpg`} alt={item.category || 'Image'} /> */}
      <div onClick={(onSelect) ? () => onSelect(item.id) : handleShow}>
        <div style={{ position: 'relative', width: '100%', paddingTop: '120%' }}>
          <Image src={image_path}  alt={item.category || 'Image'} layout='fill' objectFit='cover' sizes="(max-width: 600px) 100vw, 50vw"/>
        </div>
        {/* <Image src={`/images/${image_path}`}  alt={item.category || 'Image'} width={230} height={275} sizes="(max-width: 600px) 100vw, 50vw"/> */}
        <div style ={{ padding: "5px 5px"}} className='flex flex-column'>
          <div className='uppercase tracking-widest text-sm font-medium leading-4 font-mono'>
          {item.brand || 'No brand'}
          </div>
          <div className='capitalize font-semibold text-xl font-sans'>
            {item.color || 'No color'} {item.category || 'No category'}
          </div>
        </div>
        </div>
        {
          viewDetails && 
          <div className='flex flex-row-reverse flex-end px-1'>
            <button onClick={handleShow} className = "font-mono font-light hover:text-sky-700 tracking-tight">View Details</button>
          </div>
        }
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
