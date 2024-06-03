// src/components/ClothingTable.js
import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import ClothingCard from './clothing_card';

function ClothingTable() {
    const [clothingItems, setClothingItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/clothing')
            .then(response => response.json())
            .then(data => setClothingItems(data))
            .catch(error => console.error('Error:', error));
    }, []);

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
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    if (!clothingItems.length) {
        return <div>Loading...</div>; // Add a loading state or message
    }

    return (
        <Container>
            <Row lg={4} xl ={4} md = {2} sm = {1}>
                {clothingItems.map((item) => (
                    <Col key={item.id}>
                        <ClothingCard 
                            item={item}
                            onSelect={handleSelectItem}
                            isSelected={selectedItems.includes(item.id)}
                        />
                    </Col>
                ))}
            </Row>
            <Button onClick={handleSubmit}>Submit Selected Items</Button>
        </Container>
    );
}

export default ClothingTable;
