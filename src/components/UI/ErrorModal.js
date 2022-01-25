import React from 'react';
import Modal from './Modal';

const ErrorModal = (props) => {
  return (
    <Modal>
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
