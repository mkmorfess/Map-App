import React, { useEffect, useState, Fragment } from 'react';
import { Dropdown, Icon, Menu, Header } from 'semantic-ui-react';
import Modal from '../Modal/Modal';
import ModalOptions from '../Modal/ModalOptions';

const Nav = props => {
  const { showsidebar } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState(null);

  //If context is cleared, we close to modal
  const onClose = () => setContext(null);

  //Props here are the properties on Dropdown.Item
  const onOpen = (e, props) => setContext(<ModalOptions onClose={onClose} {...props}/>);

  useEffect(() => {
      if (!context) return setIsOpen(false);
      setIsOpen(true);
  }, [context]);

  return (
    <Fragment>
        <Menu attached='top' inverted>
            <Menu.Item icon='angle right' onClick={showsidebar}></Menu.Item>
            <Dropdown item icon='wrench' simple>
                <Dropdown.Menu>
                    <Dropdown.Item>
                        
                        <Icon name='dropdown' />
                        <span className='text'>New</span>

                        <Dropdown.Menu>
                            <Dropdown.Item type='marker' onClick={onOpen} {...props}>Marker</Dropdown.Item>
                        </Dropdown.Menu>

                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Header style={{ margin: 'auto', paddingRight: '40px' }} inverted>Contiguous U.S. Earthquakes - 4.0+ Magnitude - (2000-2020)</Header>
        </Menu>

        <Modal open={isOpen} onClose={onClose} >
            {context}
        </Modal>
    </Fragment>
  )
}

export default Nav;