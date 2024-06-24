import React from 'react'

const Modal = ({ isVisible, onClose, children }) => {

    if (!isVisible) return null;

    const handleClose = (e) => {
        if ( e.target.id === 'wrapper' ) onClose();
    }

  return (
    <>
    <div className=' fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-[9999]' id='wrapper' onClick={handleClose}>
        <div className=' w-[700px] flex flex-col bg-white rounded-lg '>
            <button className='text-gray-300 font-bold text-xl place-self-end pt-2 pr-6' onClick={() => onClose()}>X</button>
            <div className='p-2'>{children}</div>
        </div>
    </div>    
    </>
  )
}

export default Modal