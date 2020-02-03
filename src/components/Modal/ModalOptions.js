import React from 'react';
import Marker from '../Nav/NavOptions/Marker/index';

const ModalOptions = props => {
    const { type } = props;

    const renderNavOption = type => {
        switch(type) {
            case 'marker':
                return <Marker {...props} />;
            default:
                return null;
        }
    }

    return renderNavOption(type);
}

export default ModalOptions;