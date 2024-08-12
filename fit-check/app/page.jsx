'use client'

import { useState } from "react"
import TodaysWears from "../components/TodaysWears"
import DisplayOptions from "../components/DisplayOptions"
import WearsCalendar from "../components/WearsCalendar"
import Test from "../components/test"
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
    const d = new Date()
    return (
        <>

        <div
        style={{
          margin: `0 auto`,
          maxWidth: 1080,
          padding: `0 1.0875rem 1.45rem`,
        }}>
            <div className="flex py-3">
                <div className="flex gap-2 pr-1">
                    <div className="w-3 h-full bg-sky-500 outline outline-1"></div>
                    <div className="w-3 h-full bg-sky-600 outline outline-1"></div>
                    <div className="w-3 h-full bg-sky-700 outline outline-1"></div>
                </div>
                <div className="font-mono text-6xl font-black leading-11 px-3">Drobe</div>
                <div className="flex gap-2 pl-1 overflow-clip">
                    <div className="w-3 h-full bg-sky-700 outline outline-1"></div>
                    <div className="w-3 h-full bg-sky-600 outline outline-1"></div>
                    <div className="w-3 h-full bg-sky-500 outline outline-1"></div>
                </div>
            </div>
            <TodaysWears handleInventoryUpdate={handleInventoryUpdate} wearsUpdated={wearsUpdated}/>
            <DisplayOptions inventoryUpdated={inventoryUpdated} handleInventoryUpdate={handleInventoryUpdate} handleWearsUpdate={handleWearsUpdate}/>
            <WearsCalendar />
            {/* <Test /> */}
        </div>
        </>)
}