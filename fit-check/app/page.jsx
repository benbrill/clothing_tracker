'use client'

import { useState } from "react"
import TodaysWears from "../components/TodaysWears"
import DisplayOptions from "../components/DisplayOptions"
import WearsCalendar from "../components/WearsCalendar"
import 'react-calendar/dist/Calendar.css';


export default function FirstPost() {
    const [inventoryUpdated, setInventoryUpdated] = useState(false);
    const handleInventoryUpdate = () => {
        setInventoryUpdated(!inventoryUpdated); // Toggle the state to trigger useEffect in ClothingTable
    };

    const [wearsUpdated, setWearsUpdated] = useState(false);
    const handleWearsUpdate = () => {
        setWearsUpdated(!wearsUpdated); // Toggle the state to trigger useEffect in TodaysWears
    };

    
    return (
        <>

        <div
        style={{
          margin: `0 auto`,
          maxWidth: 1080,
          padding: `0 1.0875rem 1.45rem`,
        }}>
            <div className="font-sans text-6xl font-bold pb-3">FitCheck</div>
            <TodaysWears handleInventoryUpdate={handleInventoryUpdate} wearsUpdated={wearsUpdated}/>
            <DisplayOptions inventoryUpdated={inventoryUpdated} handleWearsUpdate={handleWearsUpdate}/>
            <WearsCalendar />
        </div>
        </>)
}