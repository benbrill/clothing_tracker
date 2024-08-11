import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const ClothingItemsComponent = () => {
  const [groupedClothingItems, setGroupedClothingItems] = useState({});
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const startOfWeek = new Date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiURL}/wears/by-week-grouped?date=${dayjs(startOfWeek).format('YYYY-MM-DD')}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        // Directly set the nested JSON structure into state
        setGroupedClothingItems(data);
      } catch (error) {
        console.error('Error fetching clothing items:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
        {console.log('test', groupedClothingItems)}
      <h2>Grouped Clothing Items</h2>
      {Object.keys(groupedClothingItems).length === 0 ? (
        <p>No clothing items found.</p>
      ) : (
        Object.entries(groupedClothingItems).map(([date, wearGroups]) => (
          <div key={date}>
            <h3>Date: {date}</h3>
            {Object.entries(wearGroups).map(([wearId, items]) => (
              <div key={wearId}>
                <h4>Wear ID: {wearId}</h4>
                <ul>
                  {items.map((item, index) => (
                    <li key={index}>
                      {item.brand} - {item.description} ({item.category})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ClothingItemsComponent;
