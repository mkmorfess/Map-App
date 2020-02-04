import React, { useState, useEffect } from 'react';
import './Map.css';
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react';
import { Message, Icon, Container, Segment } from 'semantic-ui-react';
import axios from 'axios';

const MapContainer = props => {
  const { bulkAddMarkers, markers, viewMarkerData } = props;
  const [polylines, setPolylines] = useState([]);
  const [initialLocation, setInitialLocation] = useState()
  const mapStyles = {
    width: '98%',
    height: '90%'
  };

  const icons = {
    high: {
      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // url
      scaledSize: new props.google.maps.Size(35, 35), // scaled size
    },
    medium: {
      url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png", // url
      scaledSize: new props.google.maps.Size(30, 30), // scaled size
    },
    low: {
      url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // url
      scaledSize: new props.google.maps.Size(20, 20), // scaled size
    },
    unknown: {
      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // url
      scaledSize: new props.google.maps.Size(15, 15), // scaled size
    }
  }

  const getIcon = mag => {
    if (mag <= 5) return icons['low']
    if (mag > 5 && mag <= 7) return icons['medium']
    if (mag > 7) return icons['high'];

    return icons['unknown'];
  }

  const renderMarkers = () => markers.map((marker, i) => {
    return ( 
      <Marker key={i} onClick={() => viewMarkerData(marker)} data={marker} position={{ lat: marker.lat, lng: marker.lng }} icon={getIcon(marker.magnitude)} />
    );
  });

  const renderPolylines = () => polylines.map((polyline, i) => {
    return (
      <Polyline path={polyline} key={i} strokeColor='#000000'
          strokeOpacity={1} strokeWeight={2} />
    );
  })

  useEffect(() => {
    const handleLocationError = err => {
      console.error(err && err.code);
      console.error(err && err.message);

      setInitialLocation({ lat: 33.8283, lng: -98.5795 });
    }
    navigator.geolocation.getCurrentPosition(location => {
      const { coords } = location
      setInitialLocation({ lat: coords.latitude, lng: coords.longitude });
    }, handleLocationError);
  }, []);

  useEffect(() => {
    axios.get('/data/earthquake').then(res => {
      const { data } = res;
      const earthquakeData = data.earthquakeData;
      const faultLineData = data.faultLineData;
    
      const dataSet = earthquakeData.features
      .filter(feature => feature.geometry.type === 'Point')
      .reduce((arr, feature) => {
        const { geometry, properties } = feature;
        return arr.concat(
          { lat: geometry.coordinates[1], lng: geometry.coordinates[0], magnitude: feature.properties.mag, ...properties }
        )}, 
      []);

      const faultLines = faultLineData.features
      .filter(feature => feature.geometry.type === 'LineString')
      .reduce((arr, feature) => {
        const latLongs = feature.geometry.coordinates.map(coords => ({ lat: coords[1], lng: coords[0] }))
        return arr.concat([latLongs])
      }, []);
    
      setPolylines(faultLines);
      bulkAddMarkers(dataSet);
    });
  }, []);

  if (!initialLocation) return (
    <Container>
      <Segment basic>
        <Message icon>
          <Icon name='circle notched' loading />
          <Message.Content>
            <Message.Header>Just one second</Message.Header>
            We are loading the application for you.
          </Message.Content>
        </Message>
      </Segment>
    </Container>
  );

  return (
    <Container fluid>
      <Segment style={{ height: '100vh'}}>
        <Map
          google={props.google}
          zoom={4}
          style={mapStyles}
          initialCenter={initialLocation}
          yesIWantToUseGoogleMapApiInternals
          // location={searchedLocation}
        >
          {renderMarkers()}
          {renderPolylines()}
        </Map>
      </Segment>
    </Container>
  );
}

const shouldNotUpdate = (props, nextProps) => {
  if (props.loadingSidebar === nextProps.loadingSidebar) return false;
  return true;
}

export default React.memo(GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY || 'AIzaSyDomeXKvy8n2GG1lCgJ7KZLenY7atqHdNU',
})(MapContainer), shouldNotUpdate);