import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function AddClothingForm( { handleInventoryUpdate }) {
    const [clothingItem, setClothingItem] = useState({
        category: '',
        brand: '',
        color: '',
        size: '',
        price: '',
        quantity: '',
        purchase: '',
        description: '',
        thrift: false
    });

    useEffect(() => {
        // Fetch clothing items logic here (if needed)
    }, []);

    const handleChange = (e) => {
        setClothingItem({ ...clothingItem, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setClothingItem({ ...clothingItem, file: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit logic here
        console.log(clothingItem);
        const formData = new FormData();
        Object.keys(clothingItem).forEach(key => {
            if (key !== 'file') {
                formData.append(key, clothingItem[key]);
            }
        });

        console.log(clothingItem.file);
        if (clothingItem.file) {
            formData.append('file', clothingItem.file);
        }


        fetch('http://localhost:5000/add-clothing', {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json',
            // },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            handleInventoryUpdate(); // Trigger a re-fetch of the inventory
            // Handle success here (e.g., clear form, show message)
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle error here (e.g., show error message)
        });

        // Clear the form
        setClothingItem({
            category: '',
            brand: '',
            color: '',
            size: '',
            price: 0,
            quantity: '1',
            purchase: Date.now(),
            thrift: false,
            description: '',
        });
    };

    return (
        <Container>
            <Row>
                <Col md={{ span: 6, offset: 3 }}> {/* TODO: need form validation for missing fields */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Control type="text" name="category" value={clothingItem.category} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type="text" name="brand" value={clothingItem.brand} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Color</Form.Label>
                            <Form.Control type="text" name="color" value={clothingItem.color} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Size</Form.Label>
                            <Form.Control type="text" name="size" value={clothingItem.size} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" value={clothingItem.description} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" name="price" value={clothingItem.price} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Thrifted?</Form.Label>
                            <Form.Control type="checkbox" name="price" value={clothingItem.thrift} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" name="quantity" value={clothingItem.quantity} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Purchase Date</Form.Label>
                            <Form.Control type="date" name="purchase" value={clothingItem.purchase} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Photo</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add Clothing Item
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default AddClothingForm;
