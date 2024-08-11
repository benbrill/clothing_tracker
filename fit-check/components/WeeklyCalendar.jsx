import React from 'react'
import * as dayjs from 'dayjs'
import { useState, useEffect } from 'react';
import { utc } from 'dayjs';

const WeeklyCalendar = ({ setStartOfWeek, startOfWeek, setDisplayDate, displayDate }) => {
    const daysOfWeek = {0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday'}
    const months = {0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December'}

    dayjs.extend(utc)
    const [week, setWeek] = useState([])
    const [isSelected, setIsSelected] = useState(dayjs(displayDate).day())

    useEffect(() => {
        let week = Array(7).fill(dayjs(startOfWeek)).map((day, i) => day.add(i, 'day'))
        setWeek(week)
    }, [startOfWeek])

    const handleDateSelection = (e) => {
        setDisplayDate(dayjs(e.target.value))
        setIsSelected(dayjs(e.target.value).day())
        setStartOfWeek(dayjs(e.target.value).startOf('week'))
        // setDate(dayjs(e.target.value).startOf('week'))
    }

    const handleClick = (day) => {
        setIsSelected(day.day())
        setDisplayDate(day)
    }

  return (
    <>
    <input type="date" id="start" name="trip-start" onChange={handleDateSelection}/>
    <div className='flex pt-3 flex-col'>
        <div className='grid-cols-7 grid grid-row justify-center items-center'>
          {Object.entries(daysOfWeek).map(([index, day], i) => (
              <div className='text-slate-800 font-mono text-l font-medium uppercase tracking-widest text-center' key={index}>{day.slice(0,3).toUpperCase()}</div>
          ))
          }
        </div>
        <div className='grid-cols-7 grid grid-row'>
            {
                week.map((day, i) => (
                    <button className={`bg-${isSelected === day.day() ? 'sky-500' :'slate-100'} border-gray-800 border-2 aspect-square cursor-pointer flex justify-end`} key={i} onClick={() => handleClick(day)}>
                        <div className='text-slate-800 font-mono text-l font-medium uppercase tracking-widest px-2 py-1'>{day.format("DD")}</div>
                    </button>
                ))
            }      
        </div>
    </div>
    </>
  )
}

export default WeeklyCalendar