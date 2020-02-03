import React, { useState, Fragment, useRef } from 'react';
import { Form, Dropdown, Button, Container, Segment, Divider, Header, Icon, Menu, Input, Message } from 'semantic-ui-react';

const filterOptions = [
    {
      key: 1,
      text: 'Magnitude less than 5.0',
      value: 'x.magnitude < 5'
    },
    {
      key: 2,
      text: 'Magnitude in between 5.0 and 7.0',
      value: '(x.magnitude > 5 && x.magnitude < 7)'
    },
    {
      key: 3,
      text: 'Magnitude greater than 7.0',
      value: 'x.magnitude > 7'
    }
]

const FilterForm = props => {
    const { customFilterError, handleApplyFilter, handleRemoveFilter, showSidebar, filters, handleApplyCustomFilter, customFilters, handleRemoveCustomFilter } = props;
    const [filterSelected, setFilterSelected] = useState(null);
    const [filterType, setFilterType] = useState('Built-In');
    const [customFilterInput, setCustomFilterInput] = useState({ nameOfFilter: '', equation: '' });

    const handleOnSubmit = () => {
        if (filters.includes(filterSelected) || customFilters.includes(filterSelected)) return;
        setFilterSelected(null);
        handleApplyFilter(filterSelected);
    }

    const handleCustomFilterSubmit = () => {
        const inputValues = Object.values(customFilterInput);
        if (!inputValues[0].length || !inputValues[1].length) return;
        if (filters.includes(filterSelected) || customFilters.includes(filterSelected)) return;
        handleApplyCustomFilter({ ...customFilterInput, equation: `(${customFilterInput.equation})`});
        setCustomFilterInput({ nameOfFilter: '', equation: '' });
    }

    const renderFilterButtons = () => {
        return filters.map(f => {
            return (
                <Button icon labelPosition='left' key={f} onClick={() => handleRemoveFilter(f)}>
                    <Icon name='delete' />
                    {filterOptions.find(option => option.value === f).text}
                </Button>
            );
        });
    }

    const renderCustomFilterButtons = () => {
        return customFilters.map(f => {
            return (
                <Button icon labelPosition='left' key={f.nameOfFilter} onClick={() => handleRemoveCustomFilter(f.equation)}>
                    <Icon name='delete' />
                    {f.nameOfFilter}
                </Button>
            );
        })
    }

    const renderErrorMessage = () => {
        if (!customFilterError) {
          return (
            <Message floating info>
            <Message.Header>Use JavaScript syntax to build equation</Message.Header>
            <p>Use x to access any property on the earthquake object. (Ex: x.magnitude, x.time)</p>
          </Message>
          );
        }
    
        return (
          <Message floating negative>
            <Message.Header>Cannot Apply Custom Filter</Message.Header>
            <p>Error: {`${customFilterError}`}</p>
          </Message>
        );
    }

    const renderForm = () => {
        if (filterType === 'Built-In') {
            return (
                <Form onSubmit={handleOnSubmit}>
                    <Form.Field 
                    as={Dropdown}
                    placeholder='Select Filter'
                    fluid
                    selection
                    onChange={(e, result) => setFilterSelected(result.value)}
                    options={filterOptions}
                    value={filterSelected}
                    />
                    <Form.Field 
                    control={Button}
                    content="Apply Filter"
                    type="submit"
                    />
                </Form>
            );
        } else {
            return (
                <Fragment>
                    {filterType === 'Custom' && renderErrorMessage()}
                    <Form onSubmit={handleCustomFilterSubmit}>
                        
                        <Form.Field 
                            control={Input}
                            required
                            label='Name Of Filter'
                            type='text'
                            onChange={e => setCustomFilterInput({ ...customFilterInput, nameOfFilter: e.target.value })}
                            value={customFilterInput.nameOfFilter}
                        />
                       
                       <Form.Field
                            control={Input}
                            required
                            label='Equation'
                            type='text'
                            onChange={e => setCustomFilterInput({ ...customFilterInput, equation: e.target.value })}
                            value={customFilterInput.equation}
                        />

                        <Form.Field 
                            control={Button}
                            content="Apply Filter"
                        />
                    </Form>
                </Fragment>
            )
        }
    }
    const renderActiveFilters = () => {
        if (!filters.length && !customFilters.length) return null;

        return (
        <Fragment>
            <Divider />
            <Container fluid>
                <Header as='h4' block>
                Active Filters
                </Header>
                {renderFilterButtons()}
                {renderCustomFilterButtons()}
            </Container>
        </Fragment>
        );
    }

    return (
        <Container>
          <Segment style={{ height: '60vh', overflow: 'auto'}}>
            <Menu inverted>
                <Menu.Item header>Apply Filters</Menu.Item>
                <Dropdown item icon='setting' simple>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setFilterType('Built-In')}>Built-In Filters</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterType('Custom')}>Custom Filters</Dropdown.Item>    
                    </Dropdown.Menu>
                </Dropdown>
                <Menu.Item position='right' icon='angle left' onClick={showSidebar}/>
            </Menu>
            <Container>
                <Segment>
                    {renderForm()}
                    {renderActiveFilters()}
                </Segment>
            </Container>
          </Segment>
        </Container>
    );
}

export default FilterForm;