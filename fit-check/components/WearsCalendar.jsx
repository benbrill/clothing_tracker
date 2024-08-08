import React from 'react'
import Calendar from 'react-calendar'
import { useState, useEffect } from 'react'
import { Row, Col, CardGroup } from 'react-bootstrap'
import ClothingCardSmall from './ClothingCard/ClothingCardSmall'

const WearsCalendar = () => {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const [value, onChange] = useState(new Date());
  const [clothingItems, setClothingItems] = useState([]);
  const [groupedByWearId, setGroupedByWearId] = useState([]);

  useEffect(() => {
    // Fetch the data from the API
    fetch(`${apiURL}/wears?date=${value.toISOString().split('T')[0]}`)
      .then(response => response.json())
      .then(data => {
        // Update clothing items state
        setClothingItems(data);

        const groupedData = data.reduce((acc, item) => {
          // console.log(acc);
          const { wear_id } = item;
          if (!acc[wear_id]) {
            acc[wear_id] = [];
          }
          acc[wear_id].push(item);
          return acc;
        }, {});

        // Update the state with the grouped items
        setGroupedByWearId(groupedData);
      })
      .catch(error => console.error('Error:', error));
  }, [value]);

  return (
    <div className='flex pt-3 flex-col'>
        <div>
        <Calendar className='font-sans' onChange={onChange} value = {value}/>
        </div>
        <div>
        <Row className='flex gap-2.5 px-2'>
        {Object.entries(groupedByWearId).map(([wear_id, wear_items], index) => (
          <Col key={wear_id} className='bg-slate-200 border-gray-400 border-2 px-2 flex-none' style={{flex: "0 1"}}>
            <div className='font-mono text-l font-medium uppercase tracking-widest' > Outfit {index + 1}</div>
              <CardGroup md = {12} xs = {4} className='flex gap-1.5 flex-nowrap'>
                {wear_items.map((item) => (
                  <ClothingCardSmall item={item}/>
                ))}
            </CardGroup>
          </Col>
        ))}
        </Row>
        </div>
    </div>
  )
}

export default WearsCalendar