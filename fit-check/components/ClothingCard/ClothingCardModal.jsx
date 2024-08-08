import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import Image from 'next/image'

const ClothingCardModal = ({item, show, handleClose}) => {
const image_path = item.image_path || 'https://via.placeholder.com/150';
console.log(item)
  return (
    <div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            {item.brand} {item.color} {item.category}
        </Modal.Header>
        <Modal.Title>{item.brand} {item.color} {item.category}</Modal.Title>
        <div style={{ position: 'relative', width: '100%', paddingTop: "120%"}}>
          <Image src={image_path}  alt={item.category || 'Image'} layout='fill' objectFit='cover' sizes="(max-width: 600px) 100vw, 50vw"/>
        </div>
        <Modal.Body>
            <p><strong>Brand:</strong> {item.brand || 'No brand'}</p>
            <p><strong>Color:</strong> {item.color || 'No color'}</p>
            <p><strong>Size:</strong> {item.size || 'No size'}</p>
            <p><strong>Price:</strong> ${item.price || 'No price'}</p>
            <p><strong>Quantity:</strong> {item.quantity || 'No quantity'}</p>
            <p><strong>Purchase Date:</strong> {item.purchase || 'No purchase date'}</p>
            <p><strong>Times worn:</strong> {item.wear_count || '0'}</p>
            <p><strong>Last worn::</strong> {item.last_wear_date|| 'Never worn before'}</p>
        </Modal.Body>

        </Modal>
    </div>
  )
}

export default ClothingCardModal