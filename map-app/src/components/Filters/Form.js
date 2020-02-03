import React, { useState, Fragment, useRef } from 'react';
import { Form, Dropdown, Button, Container, Segment, Divider, Header, Icon, Menu, Input } from 'semantic-ui-react';

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
    const { handleApplyFilter, handleRemoveFilter, showSidebar, filters, handleApplyCustomFilter, customFilters, handleRemoveCustomFilter } = props;
    const [filterSelected, setFilterSelected] = useState(null);
    const [filterType, setFilterType] = useState('Built-In');
    const [customFilterInput, setCustomFilterInput] = useState({ nameOfFilter: null, equation: null });

    const nameOfFilter = useRef(null);
    const equation = useRef(null);

    const handleOnSubmit = () => {
        if (filters.includes(filterSelected) || customFilters.includes(filterSelected)) return;
        setFilterSelected(null);
        handleApplyFilter(filterSelected);
    }

    const handleCustomFilterSubmit = () => {
        if (Object.values(customFilterInput).length !== 2 ) return;
        if (filters.includes(filterSelected) || customFilters.includes(filterSelected)) return;
        handleApplyCustomFilter({ ...customFilterInput, equation: `(${customFilterInput.equation})`});
        setCustomFilterInput({ nameOfFilter: null, equation: null });
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
                <Form onSubmit={handleCustomFilterSubmit}>
                    <Form.Field 
                        control={Input}
                        required
                        label="Name of Filter"
                        ref={nameOfFilter}
                        onChange={(e, result) => setCustomFilterInput({ ...customFilterInput, nameOfFilter: result.value })}
                    />
                    <Form.Field 
                        control={Input}
                        required
                        label="Equation"
                        ref={equation}
                        onChange={(e, result) => setCustomFilterInput({ ...customFilterInput, equation: result.value })}
                    />
                    <Form.Field 
                        control={Button}
                        content="Apply Filter"
                    />
                </Form>
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