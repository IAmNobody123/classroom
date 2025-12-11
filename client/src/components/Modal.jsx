import React from "react";
import "../styles/general.css"; 

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

//   const handleBackdropClick = (e) => {
//     if (e.target.className === "modal-overlay") {
//       onClose();
//     }
//   };

  return (
    <div className="modal-overlay" /*onClick={handleBackdropClick}*/>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
