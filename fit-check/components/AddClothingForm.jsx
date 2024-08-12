import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function AddClothingForm( { handleInventoryUpdate, handleClose }) {

    const apiURL = process.env.NEXT_PUBLIC_API_URL;
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

    const sizes = {'':[],
                     't-shirt': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                     'shirt': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                     'pants': ['31', '32', '33', '34', '35', '36'],
                     'shorts': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                     'tank': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                     'jacket': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                     }

    const handleChange = (e) => {
        setClothingItem({ ...clothingItem, [e.target.name]: e.target.value });
        console.log(clothingItem)
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


        fetch(`${apiURL}/add-clothing`, {
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
        handleClose();
    };

    const controlStyle = 'border-1 border-gray-800 rounded-none w-full font-mono';
    const controlStyle2 = {borderRadius: "0", borderColor: "rgb(31 41 55)"}
    const groupStyle = 'mb-3';
    
    return (
        <Container>
            <Row className='flex justify-center'>
                <Col md={{ span: 10, }}> {/* TODO: need form validation for missing fields */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className={groupStyle}>
                            <Form.Label className='font-sans font-semibold tracking-wide leading-tight'>Category</Form.Label>
                            <Form.Select name="category" onChange={handleChange} className={controlStyle} style={controlStyle2} >
                                {Object.keys(sizes).map((category) => (
                                    <option id={category} value={category}>{category}</option>
                                ))}
                            </Form.Select>
                            {/* <Form.Control type="text" name="category" value={clothingItem.category} style={controlStyle2} onChange={handleChange} className={controlStyle} /> */}
                        </Form.Group>
                        <Form.Group className={groupStyle}>
                            <Form.Label className='font-sans font-semibold tracking-wide leading-tight'>Brand</Form.Label>
                            <Form.Control type="text" name="brand" value={clothingItem.brand} onChange={handleChange} style={controlStyle2} className={controlStyle}/>
                        </Form.Group>
                        <Form.Group className={groupStyle}>
                            <Form.Label className='font-sans font-semibold tracking-wide leading-tight'>Color</Form.Label>
                            <Form.Control type="text" name="color" value={clothingItem.color} onChange={handleChange} style={controlStyle2} className={controlStyle} />
                        </Form.Group>
                        <Form.Group className={groupStyle}>
                            <Form.Label className='font-sans font-semibold tracking-wide leading-tight'>Size</Form.Label>
                            <Form.Select name="size" onChange={handleChange} className={controlStyle} style={controlStyle2} >
                                {console.log("category", clothingItem.category)}
                                {sizes[clothingItem.category].map((size) => (
                                    <option id={size} value={size}>{size}</option>
                                ))}
                            </Form.Select>
                            {/* <Form.Control type="text" name="size" value={clothingItem.size} onChange={handleChange} style={controlStyle2} className={controlStyle} /> */}
                        </Form.Group>
                        <Form.Group className={groupStyle}>
                            <Form.Label className='font-sans font-semibold tracking-wide leading-tight'>Description</Form.Label>
                            <Form.Control type="text" name="description" value={clothingItem.description} onChange={handleChange} style={controlStyle2} className={controlStyle} />
                        </Form.Group>
                        <Form.Group className={groupStyle}>
                            <Form.Label className='font-sans font-semibold tracking-wide leading-tight'>Price</Form.Label>
                            <Form.Control type="number" name="price" value={clothingItem.price} onChange={handleChange} style={controlStyle2} className={controlStyle} />
                        </Form.Group>
                        <Form.Group className={groupStyle}>
                            <Form.Label className='font-sans font-semibold tracking-wide leading-tight'>Thrifted?</Form.Label>
                            <Form.Control type="checkbox" name="price" value={clothingItem.thrift} onChange={handleChange} style={controlStyle2} className={controlStyle} />
                        </Form.Group>
                        <Form.Group className={groupStyle}>
                            <Form.Label className='font-sans font-semibold tracking-wide leading-tight'>Quantity</Form.Label>
                            <Form.Control type="number" name="quantity" value={clothingItem.quantity} onChange={handleChange} style={controlStyle2} className={controlStyle} />
                        </Form.Group>
                        <Form.Group className={groupStyle}>
                            <Form.Label className='font-sans font-semibold tracking-wide leading-tight'>Purchase Date</Form.Label>
                            <Form.Control type="date" name="purchase" value={clothingItem.purchase} onChange={handleChange} style={controlStyle2} className={controlStyle} />
                        </Form.Group>
                        <Form.Group className={groupStyle}>
                            <Form.Label className='font-sans font-semibold tracking-wide leading-tight'>Photo</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} style={{borderRadius: "0", borderColor: "rgb(31 41 55)"}} className='font-sans'/>
                        </Form.Group>
                        <button className = 'font-mono border-2 border-black px-2 uppercase tracking-wider font-semibold bg-slate-200 hover:bg-sky-500 hover:text-white' type="submit">
                            Add Clothing Item
                        </button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default AddClothingForm;
