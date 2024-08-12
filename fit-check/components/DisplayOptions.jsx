// src/components/ClothingTable.js
import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, CardGroup } from 'react-bootstrap';
import ClothingCard from './ClothingCard/ClothingCard';
import AddClothingModal from './AddClothingModal';
import ClothingCardGroup from './ClothingCard/ClothingCardGroup';
import WearOptions from './WearOptions';

function ClothingTable({ inventoryUpdated, handleInventoryUpdate, handleWearsUpdate }) {
    const [clothingItems, setClothingItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);


    const apiURL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${apiURL}/clothing`)
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
        fetch(`${apiURL}/add-wear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: selectedItems })
        })
        .then(response => response.json())
        .then(data => {
            setSelectedItems([]); // Clear selection after submission
            handleWearsUpdate(); // Trigger a re-fetch of the items worn today
            handleInventoryUpdate(); // Trigger a re-fetch of the inventory
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    if (!clothingItems.length) {
        
        return (
        <>
        <div>Loading...</div>;
        <button className= 'font-sand border-2 border-black px-2 uppercase tracking-wider font-semibold bg-slate-200' onClick={handleShow}>Add Item</button>
        <AddClothingModal show={showModal} handleClose={handleClose}/>
        </>
        )
    }

    return (
        <div className='pt-3'>

        <div id="header" style ={{display: "flex"}}>
           <div className='flex py-2'>
                <div className='flex gap-2 pr-1'>
            <div className='w-3 h-full bg-sky-600 outline outline-1'></div>
            </div>
            <div className='font-sans text-4xl font-extrabold'>Your Wardrobe</div>
        </div>
            <div style={{display: "flex", alignItems: "center", padding: "0 20px"}}>   
                <button className= 'font-mono border-2 border-black px-2 uppercase tracking-wider font-semibold bg-slate-200 hover:bg-sky-500 hover:text-white' onClick={handleShow}>Add Item</button>
            </div>
        </div>
        <div className='font-sans text-lg pb-3'>
            Select items to wear today
        </div>
        <ClothingCardGroup clothingItems={clothingItems} handleSelectItem={handleSelectItem} selectedItems={selectedItems} viewDetails={true} />
        <WearOptions />
        <button onClick={handleSubmit} className= 'font-mono border-2 border-black px-2 uppercase tracking-wider font-semibold bg-slate-200 hover:bg-sky-500 hover:text-white'>Submit Selected Items</button>
        <AddClothingModal show={showModal} handleClose={handleClose} handleInventoryUpdate={handleInventoryUpdate}/>
        </div>
    );
}

export default ClothingTable;
