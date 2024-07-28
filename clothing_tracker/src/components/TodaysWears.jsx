import React, { useState, useEffect } from 'react'
import ClothingCard from './clothing_card'
import { Button, Container, Row, Col } from 'react-bootstrap'

const TodaysWears = ({ handleInventoryUpdate, wearsUpdated }) => {
    const [showModal, setShowModal] = useState(false);
    const [clothingItems, setClothingItems] = useState([]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    useEffect(() => {
        fetch('http://localhost:5000/get_today_wears')
            .then(response => response.json())
            .then(data => setClothingItems(data))
            .catch(error => console.error('Error:', error));
    }, [wearsUpdated]);
console.log(clothingItems[1])
  return (
    <>
    <h2>Items Worn Today</h2>

    <Container>
        <Row>
      {clothingItems.length > 0 ?
      clothingItems[clothingItems.length - 1].items.map((item) => (
       <Col style = {{flex: "0"}}> 
       <ClothingCard key={item.id} item={item} /> 
       {/* Clothing card currently has an "OnSelect Function" */}
       </Col>
      )) : 
      <div>No items to display</div>}
      </Row>
    </Container>
    
    </>
  )
}

export default TodaysWears