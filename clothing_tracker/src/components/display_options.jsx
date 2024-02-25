import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

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

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Purchase Date</th>
                    </tr>
                </thead>
                <tbody>
                    {clothingItems.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <Form.Check 
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleSelectItem(item.id)}
                                />
                            </td>
                            <td>{item.category}</td>
                            <td>{item.brand}</td>
                            <td>{item.color}</td>
                            <td>{item.size}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.purchase}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button onClick={handleSubmit}>Submit Selected Items</Button>
        </div>
    );
}

export default ClothingTable;
