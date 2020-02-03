import React, { Fragment, useState } from 'react';
import { Button, Header, Icon, Modal, Dropdown, Input } from 'semantic-ui-react';

const markerOptions = [
    {
        key: 1,
        text: 'Current Location',
        value: 'Current Location',
    },
    {
        key: 2,
        text: 'Latitude/Longitude',
        value: 'Latitude/Longitude'
    }
];

const Marker = props => {
    const { onClose, handleaddmarker } = props;
    const [option, setOption] = useState('Current Location');
    const [latLong, setLatLong] = useState({});


    const getCurrentLocation = () => {
        return navigator.geolocation.getCurrentPosition(location => {
            handleaddmarker(location.coords);
            return handleOnClose();
        }); 
    }

    const setMarkerWithLatLong = () => {
        handleaddmarker(latLong);
        return handleOnClose();
    }

    const handleOnConfirm = () => { 
        switch(option) {
            case 'Current Location':
                return getCurrentLocation();
            case 'Latitude/Longitude':
                return setMarkerWithLatLong();
            default:
                return null;
        }       
    }

    const handleOnClose = () => {
        setOption('Current Location');
        resetModal();
        return onClose();
    }

    const resetModal = () => {
        setLatLong({});
    }

    const shouldDisable = () => {
        switch(option) {
            case 'Current Location':
                return false;
            case 'Latitude/Longitude':
                return Object.values(latLong).length !== 2;
            default:
                return true;
        }
    }

    return (
        <Fragment>
        <Header icon='map outline' content='Add A Marker' />
        <Modal.Content>
            <Dropdown
                placeholder='Select Option'
                fluid
                selection
                options={markerOptions}
                defaultValue={'Current Location'}
                onChange={(e, result) => {
                    resetModal();
                    setOption(result.value);
                }}
            />
        {option && option !== 'Current Location' &&
            <Fragment>
                <Input placeholder="Latitude" onChange={(e, result) => setLatLong({ ...latLong, latitude: result.value})} />
                <Input placeholder="Longitude" onChange={(e, result) => setLatLong({ ...latLong, longitude: result.value})}/>
            </Fragment>
        }
        </Modal.Content>
        <Modal.Actions>
        <Button color='red' onClick={handleOnClose}>
            <Icon name='remove' /> Cancel
        </Button>
        <Button disabled={shouldDisable()} onClick={handleOnConfirm} color='green'>
            <Icon name='checkmark' /> Confirm
        </Button>
        </Modal.Actions>
        </Fragment>
    )
}

export default Marker;