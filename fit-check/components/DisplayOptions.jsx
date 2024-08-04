// src/components/ClothingTable.js
import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, CardGroup } from 'react-bootstrap';
import ClothingCard from './ClothingCard';
import AddClothingModal from './AddClothingModal';
import ClothingCardGroup from './ClothingCardGroup';

function ClothingTable({ inventoryUpdated, handleWearsUpdate }) {
    const [clothingItems, setClothingItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    useEffect(() => {
        fetch('http://localhost:5000/clothing')
            .then(response => response.json())
            .then(data => setClothingItems(data))
            .catch(error => console.error('Error:', error));
    }, [inventoryUpdated]);

    const handleSelectItem = (itemId) => {
        const updatedSelection = selectedItems.includes(itemId)
            ? selectedItems.filter(id => id !== itemId)
            : [...selectedItems, itemId];
        setSelectedItems(updatedSelection);
    };

    const handleSubmit = () => {
        fetch('http://localhost:5000/add-wear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: selectedItems })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setSelectedItems([]); // Clear selection after submission
            handleWearsUpdate(); // Trigger a re-fetch of the items worn today
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    if (!clothingItems.length) {
        
        return (
        <>
        <div>Loading...</div>;
        <Button variant="primary" onClick={handleShow}>Add Item</Button>
        <AddClothingModal show={showModal} handleClose={handleClose}/>
        </>
        )
    }

    return (
        <>

        <div id="header" style ={{display: "flex"}}>
            <div style = {{fontSize: "2.25em", fontWeight: 500}}>Your Wardrobe</div>
            <div style={{display: "flex", alignItems: "center", padding: "0 20px"}}>   
                <Button variant="primary" onClick={handleShow}>Add Item</Button>
            </div>
        </div>
        <ClothingCardGroup clothingItems={clothingItems} handleSelectItem={handleSelectItem} selectedItems={selectedItems} />
        {/* <CardGroup style={{display: "flex", flexWrap: "wrap"}}>
            <Row lg={4} xl ={4} md = {4} sm = {4}>
                {clothingItems.map((item) => (
                    <Col key={item.id} className='d-flex align-items-stretch'>
                        <ClothingCard 
                            item={item}
                            onSelect={handleSelectItem}
                            isSelected={selectedItems.includes(item.id)}
                        />
                    </Col>
                ))}
            </Row>
        </CardGroup> */}
        <Button onClick={handleSubmit}>Submit Selected Items</Button>
        <AddClothingModal show={showModal} handleClose={handleClose}/>
        </>
    );
}

export default ClothingTable;
