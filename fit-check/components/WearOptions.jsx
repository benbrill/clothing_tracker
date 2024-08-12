// src/components/ClothingTable.js
import React, { useState, useEffect } from 'react';


function WearOptions({}) {
    
    const [wearTag, setWearTag] = useState([]);
    const wearOptions = {
        '' : {},
        'workout': {
            color: 'bg-orange-400',
            icon: '🏋️'
        },
        'casual': {
            color: 'bg-green-400',
            icon: '👕'
        },
        'formal': {
            color: 'bg-blue-400',
            icon: '👔'
        },
        'bed': {
            color: 'bg-gray-400',
            icon: '🛏️'
        },
        'work': {
            color: 'bg-yellow-400',
            icon: '💼'
        },
        'party': {
            color: 'bg-red-400',
            icon: '🎉'
        },
        'dinner': {
            color: 'bg-purple-400',
            icon: '🍽️'
        },
        'show' : {
            color: 'bg-pink-400',
            icon: '🎭'
        },
        'game' : {
            color: 'bg-indigo-400',
            icon: '🎮'
        },
    }


    return (
        <>
        <div>
            <div>
                Add Wear Tag
                <div>
                    <select name="wearTag" id = "wearTag" className='font-sans capitalize border-black border-2' onChange={(e) => setWearTag([...wearTag, e.target.value])}>
                        {Object.keys(wearOptions).filter(item => !wearTag.includes(item)).map((key) => (
                            <option value={key} className='capitalize'>{key}</option>
                        ))}
                    </select>
                </div>
                {console.log(wearTag)}
                <div className='flex'>
                {wearTag.map((key, i) => (
                    <div className='p-2' key={i}>
                        <span className={`${wearOptions[key].color} font-mono font-medium tracking-wider uppercase px-2 border-2 border-black`}> 
                        {wearOptions[key].icon} {key} 
                        <button className='font-sans font-black font-lg cursor-pointer ml-2'  onClick={()=> setWearTag(wearTag.filter((item) => item !== key))}> X </button>
                        </span>
                    </div>
                ))}
                </div>
            </div>
        </div>
        </>
    );
}

export default WearOptions;
