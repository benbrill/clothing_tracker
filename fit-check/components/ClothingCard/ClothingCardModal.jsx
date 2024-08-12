import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import Image from 'next/image'
import dayjs from 'dayjs'

const ClothingCardModal = ({item, show, handleClose}) => {
const image_path = item.image_path || 'https://via.placeholder.com/150';
  return (
    <div>
        <Modal show={show} onHide={handleClose} className='my-modal font-sans'>
        <Modal.Header closeButton className='px-3 py-2'>
            View Clothing
        </Modal.Header>
        <div className='flex justify-between mx-3 my-2'>
          <div>
            <div className='uppercase tracking-widest text-m font-medium leading-4 font-mono'>
              {item.brand || 'No brand'}
            </div>
            <div className='capitalize font-semibold text-3xl font-sans'>
              {item.color || 'No color'} {item.category || 'No category'}
            </div>
          </div>
          <div className='flex flex-col justify-center text-center leading-none'>
            <div className = 'font-mono text-3xl font-medium text-gray-500 leading-none'>
              {item.size || 'No size'}
            </div>
            <div className='font-sans text-l leading-none text-gray-500'>
              ${item.price || 'No price'}
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', width: '100%', paddingTop: "120%"}}>
          <Image src={image_path}  alt={item.category || 'Image'} layout='fill' objectFit='cover' sizes="(max-width: 600px) 100vw, 50vw"/>
        </div>
        <Modal.Body>
            <div className='text-xl capitalize'>
              {item.description}
            </div>
            <div>
              <span className='font-mono font-bold'> Times worn: </span> <span>{item.wear_count || '0'}</span>
            </div>
            <div>
              <span className='font-mono font-bold'> Last worn: </span> 
              <span className='font-medium'>{dayjs(item.last_wear_date).format("MMM D, YYYY")|| 'Never worn before'}</span>
              <span className='italic font-light'> {dayjs().diff(dayjs(item.last_wear_date), 'day')} days ago</span>
            </div>
            <div>
              <span className='font-mono font-bold'> Purchased: </span> 
              <span className='font-medium'>{dayjs(item.purchase).format("MMM D, YYYY") || '0'}</span>
              <span className='italic font-light'> {dayjs().diff(dayjs(item.purchase), 'days')} days ago</span>
            </div>
        </Modal.Body>
        <Modal.Footer className='px-3 py-1'>
          <button className='font-mono border-2 border-black px-2 uppercase tracking-wider font-semibold bg-slate-400 hover:bg-sky-500 hover:text-white' onClick={handleClose}>
            Close
          </button>
        </Modal.Footer>
        </Modal>
    </div>
  )
}

export default ClothingCardModal