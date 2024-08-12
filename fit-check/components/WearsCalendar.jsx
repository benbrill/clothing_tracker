import React, { use } from 'react'
import { useState, useEffect } from 'react'
import { Row, Col, CardGroup } from 'react-bootstrap'
import ClothingCardSmall from './ClothingCard/ClothingCardSmall'
import WeeklyCalendar from './WeeklyCalendar'
import * as dayjs from 'dayjs'
import '../styles/calendar.css'

const WearsCalendar = () => {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const [startOfWeek, setStartOfWeek] = useState(dayjs().utc().startOf('week'));
  const [displayDate, setDisplayDate] = useState(dayjs().utc());
  const [clothingItems, setClothingItems] = useState({});
  const [displayedItems, setDisplayedItems] = useState({});
  const [entriesPerAddDate, setEntriesPerAddDate] = useState([]);

  // 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiURL}/wears/by-week-grouped?date=${dayjs(startOfWeek).format('YYYY-MM-DD')}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // console.log('Fetched data:', data);

        // Directly set the nested JSON structure into state
        setClothingItems(data);
        setDisplayedItems(data[dayjs(displayDate).format('YYYY-MM-DD')])
      } catch (error) {
        console.error('Error fetching clothing items:', error);
      }
    };

    fetchData();
  }, [apiURL, startOfWeek]);

  useEffect(() => {
    console.log('display date changed', dayjs(displayDate).format('YYYY-MM-DD'));
    setDisplayedItems(clothingItems[dayjs(displayDate).format('YYYY-MM-DD')]);
  }, [displayDate]);

  // console.log(displayDate, displayedItems);
  return (
    <div>
        <div id="header" style ={{display: "flex"}}>
           <div className='flex py-3'>
                <div className='flex gap-2 pr-1'>
            <div className='w-3 h-full bg-sky-500 outline outline-1'></div>
            </div>
                <div className='font-sans text-4xl font-extrabold'>Fit History</div>
            </div>
        </div>
        <WeeklyCalendar setStartOfWeek={setStartOfWeek} startOfWeek={startOfWeek} setDisplayDate = {setDisplayDate} displayDate={displayDate}/>
        {displayedItems ? <div>
        <Row className='flex gap-2.5 px-2 flex-nowrap overflow-x-scroll'>
        {Object.entries(displayedItems).map(([wear_id, wear_items], index) => (
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
        </div> : <div>No items found</div>}
    </div>
  )
}

export default WearsCalendar