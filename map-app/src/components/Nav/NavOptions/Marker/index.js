import React, { Fragment, useState, useEffect } from 'react';
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
    const [latLong, setLatLong] = useState({ latitude: '', longitude: '' });


    const getCurrentLocation = () => {
        const onError = err => {
            console.error(err && `${err.code} - ${err.message}`);
            handleOnClose();
        }
        return navigator.geolocation.getCurrentPosition(location => {
            handleaddmarker(location.coords);
            return handleOnClose();
        }, onError); 
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
        setLatLong({ latitude: '', longitude: '' });
    }

    const shouldDisable = () => {
        switch(option) {
            case 'Current Location':
                return false;
            case 'Latitude/Longitude':
                return !Object.values(latLong)[0].length || !Object.values(latLong)[1].length;
            default:
                return true;
        }
    }

    useEffect(() => {
        setLatLong({ latitude: '', longitude: '' })
    }, [option]);

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
                <Input placeholder="Latitude" value={latLong.latitude} onChange={(e, result) => setLatLong({ ...latLong, latitude: e.target.value })} />
                <Input placeholder="Longitude" value={latLong.longitude} onChange={(e, result) => setLatLong({ ...latLong, longitude: e.target.value })}/>
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