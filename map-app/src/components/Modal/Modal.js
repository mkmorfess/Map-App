import React from 'react'
import { Modal } from 'semantic-ui-react'

const ModalWindow = props => (
  <Modal open={props.open} onClose={props.onClose} closeIcon>
    {props.children}
  </Modal>
)

export default ModalWindow;