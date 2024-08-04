import React, { useState, useEffect } from 'react'
import ClothingCard from './ClothingCard'
import { Button, Container, Row, Col, CardGroup } from 'react-bootstrap'
import ClothingCardGroup from './ClothingCardGroup'

const TodaysWears = ({ handleInventoryUpdate, wearsUpdated }) => {
  const [showModal, setShowModal] = useState(false);
  const [clothingItems, setClothingItems] = useState([]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSelect = (item) => {
      return null
  }

    useEffect(() => {
        fetch('http://localhost:5000/get_today_wears')
            .then(response => response.json())
            .then(data => setClothingItems(data))
            .catch(error => console.error('Error:', error));
    }, [wearsUpdated]);
  return (
    <>
    <div style = {{fontSize: "2.25em", fontWeight: 500}}>What you are wearing</div>
 
      {clothingItems.length > 0 ?
      <ClothingCardGroup clothingItems={clothingItems[clothingItems.length - 1].items}/>: 
      <div>No items to display</div>}
    
    </>
  )
}

export default TodaysWears