import React, { useState, useEffect, Fragment } from 'react';
import './App.css';
import Map from './components/Map/Map';
import Nav from './components/Nav/Nav';
import { Container, Sidebar, Segment, Menu, List, Image, Table } from 'semantic-ui-react';
import FilterForm from './components/Filters/Form';


function App() {
  const [markers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  
  const [location, setLocation] = useState({});

  const [filters, setFilters] = useState([]);
  const [customFilters, setCustomFilters] = useState([]); 
  const [customFilterError, setCustomFilterError] = useState(null);

  //Sidebar Actions
  const [visible, setVisible] = useState(false);
  const [loadingSideBar, setLoadingSideBar] = useState(false);

  const handleAddMarker = coords => {
    setMarkers([...markers, { lat: coords.latitude, lng: coords.longitude }]);
    setLocation({ lat: coords.latitude, lng: coords.longitude });
  }

  const bulkAddMarkers = markerData => {
    setMarkers(markerData);
    setFilteredMarkers(markerData);
  }

  const showSidebar = () => {
    setLoadingSideBar(true);
    setSelectedMarker(null);
    setVisible(!visible);
  }

  const handleAddFilter = value => {
    if (!value) return;
    setFilters([ ...filters, value ]);
  }

  const handleAddCustomFilter = value => {
    if (!value) return;
    setCustomFilters([...customFilters, value]);
  }

  const handleRemoveFilter = value => setFilters(filters.filter(f => f !== value));
  const handleApplyFilter = filterSelected => handleAddFilter(filterSelected);

  const handleApplyCustomFilter = customFilter => handleAddCustomFilter(customFilter);
  const handleRemoveCustomFilter = equation => setCustomFilters(customFilters.filter(f => f.equation !== equation));
  

  const viewMarkerData = markerData => {
    if (!selectedMarker) setLoadingSideBar(true);
    setVisible(false);
    setSelectedMarker(markerData);
  }

  useEffect(() => {
    if (!filters.length && !customFilters.length) return setFilteredMarkers(markers);
    try {
      function buildFunction(filters) {
        const joinedFilters = filters.join(' || ');
        return new Function('x', 'return ' + joinedFilters);
      }

      const customSet = customFilters.map(f => f.equation);
      const builtFunction = buildFunction(filters.concat(customSet));
      const filteredMarkers = markers.filter(builtFunction);
      setFilteredMarkers(filteredMarkers);
    } catch(e) {
      customFilters.pop();
      setCustomFilters(customFilters)
      setCustomFilterError(e);
    }
  }, [filters, customFilters, markers]);

  useEffect(() => {
    if (!customFilterError) return;

    setTimeout(() => {
      setCustomFilterError(null)
    }, 5000);

  }, [customFilterError]);


  const renderTable = () => {
    if (!selectedMarker) return null;

    return (
      <Container>
        <Segment style={{ width: 'inherit' }}>
          <Menu inverted>
              <Menu.Item position='left' icon='angle right' onClick={() => setSelectedMarker(null)}/>
          </Menu>
          <Table celled>
            <Table.Body>
              {Object.keys(selectedMarker).map((key, i) => {
                return (
                  <Table.Row key={i}>
                    <Table.Cell>{key}</Table.Cell>
                    <Table.Cell>{selectedMarker[key]}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Segment>
      </Container>
    );
  }

  const renderSideBar = () => {
    return (
      <Fragment>
        <Sidebar
          as={Container}
          animation='scale down'
          icon='labeled'
          onHidden={() => setLoadingSideBar(false)}
          onShow={() => setLoadingSideBar(false)}
          visible={visible}
          width='wide'
        > 
          <FilterForm 
            customFilterError={customFilterError}
            filters={filters}
            customFilters={customFilters}
            showSidebar={showSidebar} 
            handleApplyFilter={handleApplyFilter} 
            handleRemoveFilter={handleRemoveFilter}
            handleApplyCustomFilter={handleApplyCustomFilter}
            handleRemoveCustomFilter={handleRemoveCustomFilter}
          />
            
          <Container>
            <Segment style={{ height: '40vh', overflow: 'auto'}}>
              <Menu inverted>
                <Menu.Item header>Legend</Menu.Item>
              </Menu>
              <List relaxed>
                <List.Item>
                  <span className='fault-line'></span>
                  <List.Content>
                    <List.Header>{`Fault Line`}</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <Image avatar src="http://maps.google.com/mapfiles/ms/icons/green-dot.png" />
                  <List.Content>
                    <List.Header>{`Magnitude < 5.0`}</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <Image avatar src="http://maps.google.com/mapfiles/ms/icons/yellow-dot.png" />
                  <List.Content>
                    <List.Header>{`Magnitude > 5.0 and < 7.0`}</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <Image avatar src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" />
                  <List.Content>
                    <List.Header>{`Magnitude > 7.0`}</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <Image avatar src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
                  <List.Content>
                    <List.Header>{`Magnitude Unknown`}</List.Header>
                  </List.Content>
                </List.Item>
              </List>
            </Segment>
          </Container>
        </Sidebar>

        <Sidebar
          as={Container}
          animation='scale down'
          icon='labeled'
          visible={!!selectedMarker}
          width='very wide'
          direction='right'
          onHidden={() => setLoadingSideBar(false)}
          onShow={() => setLoadingSideBar(false)}
        >
          {renderTable()}
        </Sidebar>
      </Fragment>
    );
  }

  return (
    <Sidebar.Pushable as={Container} fluid style={{height: '100vh'}}>
      {renderSideBar()}

      <Sidebar.Pusher>
        <Container fluid>
          <Segment loading={loadingSideBar} style={{ height: '100vh'}}>
            <Nav showsidebar={showSidebar} handleaddmarker={handleAddMarker} />
            <Map 
              viewMarkerData={viewMarkerData} 
              loadingSidebar={loadingSideBar} 
              location={location} 
              markers={filteredMarkers} 
              filters={filters} 
              bulkAddMarkers={bulkAddMarkers} 
            />
          </Segment>
        </Container>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
}

export default App;
