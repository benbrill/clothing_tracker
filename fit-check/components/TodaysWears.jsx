import React, { useState, useEffect } from 'react'
import ClothingCard from './ClothingCard/ClothingCard'
import { Button, Container, Row, Col, CardGroup } from 'react-bootstrap'
import ClothingCardGroup from './ClothingCard/ClothingCardGroup'

const TodaysWears = ({ handleInventoryUpdate, wearsUpdated }) => {
  const [showModal, setShowModal] = useState(false);
  const [clothingItems, setClothingItems] = useState([]);

  const [todaysWears, setTodaysWears] = useState([]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSelect = (item) => {
      return null
  }

  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Fetch the data from the API
    fetch(`${apiURL}/get_today_wears`)
      .then(response => response.json())
      .then(data => {
        // Update clothing items state
        setClothingItems(data);

        // Find the maximum change_count value
        const maxChangeCount = Math.max(...data.map(entry => entry.change_count));

        // Filter the entries to only those with the maximum change_count
        const filteredEntries = data.filter(entry => entry.change_count === maxChangeCount);

        // Update the state with the filtered entries
        setTodaysWears(filteredEntries);
      })
      .catch(error => console.error('Error:', error));
  }, [wearsUpdated]);

  return (
    <>
    <div className='font-sans text-4xl font-bold'>Your Outfit</div>
 

      <ClothingCardGroup clothingItems={todaysWears}/>
      <div>
        <div className='font-sans text-2xl font-medium'> Your other outfits today </div>
        <ClothingCardGroup clothingItems={clothingItems} handleSelectItem={handleSelect}/>

      </div>
      
    </>
  )
}

export default TodaysWears