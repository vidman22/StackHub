import React from 'react';
import Modal from 'react-bootstrap/Modal';


const LoginModal = (props) => {
    return (
    <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body >
          {props.component}
        </Modal.Body>
      </Modal>
    );
};


export default LoginModal;
