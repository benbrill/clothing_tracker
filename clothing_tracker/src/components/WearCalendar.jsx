import React from 'react';
import Calendar from 'react-calendar';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';

function WearCalendar()  {

  const [value, onChange] = useState(new Date());
  return (
    <>  
        <Calendar onChange={onChange} value = {value}/>
    </>
  );
};

export default WearCalendar;
