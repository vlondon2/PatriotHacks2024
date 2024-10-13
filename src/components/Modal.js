import React from 'react';
import './Modal.css';

const Modal = ({show, message, onClose}) => {
  if(!show){
    return null;
  }

  return(
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose} className='close-button'>Close</button>
      </div>
    </div>
  );
};

export default Modal;