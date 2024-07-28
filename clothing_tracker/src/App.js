import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import TodaysWears from './components/TodaysWears';
import ClothingTable from './components/display_options';
import ClothingCard from './components/clothing_card';
import Header from './components/Header';
import { Container, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';


function App() {
  const [inventoryUpdated, setInventoryUpdated] = useState(false);
  const handleInventoryUpdate = () => {
    setInventoryUpdated(!inventoryUpdated); // Toggle the state to trigger useEffect in ClothingTable
  };

  const [wearsUpdated, setWearsUpdated] = useState(false);
  const handleWearsUpdate = () => {
    setWearsUpdated(!wearsUpdated); // Toggle the state to trigger useEffect in TodaysWears
  };



  return (
   <>
   <Container>
    <Header/>
    <TodaysWears handleInventoryUpdate = {handleInventoryUpdate} wearsUpdated = {wearsUpdated}/>
    <ClothingTable inventoryUpdated={inventoryUpdated} handleWearsUpdate = {handleWearsUpdate} />
    <ClothingCard/>
    </Container>
   </>
  );
}

export default App;
