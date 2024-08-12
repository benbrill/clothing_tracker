import React, { useState, useEffect } from 'react'
import ClothingCard from './ClothingCard/ClothingCard'
import { Button, Container, Row, Col, CardGroup } from 'react-bootstrap'
import ClothingCardGroup from './ClothingCard/ClothingCardGroup'
import ClothingCardSmall from './ClothingCard/ClothingCardSmall'
import { Inter } from 'next/font/google'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
 
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const TodaysWears = ({ handleInventoryUpdate, wearsUpdated }) => {
  const [showModal, setShowModal] = useState(false);
  const [clothingItems, setClothingItems] = useState([]);
  const [groupedByWearId, setGroupedByWearId] = useState([]);

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
  }, [wearsUpdated]);

  const daysOfWeek = {0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday'}
  const months = {0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December'}
  
  dayjs.extend(utc)
  const today = dayjs().utc();
  return (
    <>
    <div className='flex py-2'>
      <div className='flex gap-2 pr-1'>
        <div className='w-3 h-full bg-sky-700 outline outline-1'></div>
      </div>
      <div className='font-sans text-4xl font-extrabold'>Your Fit</div>
    </div>
    <div className='font-mono text-l uppercase tracking-widest'>{daysOfWeek[today.day()]}, {months[today.month()]} {today.date()}</div>
      <ClothingCardGroup clothingItems={todaysWears}/>
      <div>
        <div className={`font-sans text-2xl font-semibold`}> Your other fits today</div>
        <Row className='flex gap-2.5 px-2 flex-nowrap overflow-x-scroll' >
        {groupedByWearId && Object.entries(groupedByWearId).slice(0,Object.entries(groupedByWearId).length - 1).map(([wear_id, wear_items], index) => (
          <Col key={wear_id} className='bg-slate-200 border-gray-400 border-2 px-2 grow-0 shrink-1' style={{flex: "0 1"}}>
            <div className='font-mono text-l font-medium uppercase tracking-widest'> Outfit {index + 1}</div>
              <CardGroup md = {12} xs = {4} className='flex gap-1.5 flex-nowrap'>
                {wear_items.map((item) => (
                  <ClothingCardSmall item={item}/>
                ))}
            </CardGroup>
          </Col>
        ))}
      </Row>
      </div>
      
    </>
  )
}

export default TodaysWears