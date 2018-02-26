import * as React from 'react';
import {Form, Segment, Icon, Button, Popup} from 'semantic-ui-react';
import {InjectedTranslateProps} from "react-i18next";
import {StreamFilter} from "./StreamFilter";
import {fromJS, List} from "immutable";
import {Filter} from "../model";

export interface StreamFilterBoxProps extends InjectedTranslateProps {
    existingFilterProps: List<string>,
    filters: List<Filter.StreamFilter>,
    onFilterSubmit: (filters: List<Filter.StreamFilter>) => void,
    onClearFilter: () => void,
}

const emptyFilter = () => new Filter.StreamFilter({type: "metadata"})

const updateFilter = (filters: List<Filter.StreamFilter>, index: number, propToUpdate: string, val: string): List<Filter.StreamFilter> => {
    const filter = filters.get(index, emptyFilter());
    return filters.set(index, filter.set(propToUpdate, val) as Filter.StreamFilter) as List<Filter.StreamFilter>;
}

export class StreamFilterBox extends React.Component<StreamFilterBoxProps, {dirtyFilters: List<Filter.StreamFilter>, failedSubmit: boolean}> {

    state = {dirtyFilters: fromJS([]), failedSubmit: false}

    form;

    componentDidMount() {
        this.setState({
            dirtyFilters: this.props.filters
        })

        document.addEventListener('keydown', this.handleKeyPress)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress)
    }

    componentWillReceiveProps(props: StreamFilterBoxProps) {
        this.setState({
            dirtyFilters: props.filters
        })
    }

    addEmptyFilter() {
        this.setState({
            dirtyFilters: this.state.dirtyFilters.push(emptyFilter())
        })
    }

    submitFiltersIfValid(): boolean {
        const invalidFilters = this.state.dirtyFilters.filterNot(filter => filter.isValid());
        if(invalidFilters.count() > 0) {
            this.setState({
                failedSubmit: true
            })
            return false;
        }

        this.props.onFilterSubmit(this.state.dirtyFilters);
        return true;
    }

    handleOnNewFilter = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        this.addEmptyFilter();
        event.preventDefault();
    }

    handlePropertyChanged = (index: number, property: string) => {
        let filters = updateFilter(this.state.dirtyFilters, index, 'property', property);
        filters = updateFilter(filters, index, 'type', Filter.detectFilterType(property));


        this.setState({
            dirtyFilters: filters
        })
    }

    handleOperatorChanged = (index: number, operator: string) => {
        console.log("operator ", operator)
        this.setState({
            dirtyFilters: updateFilter(this.state.dirtyFilters, index, 'operator', operator)
        })
    }

    handleValueChanged = (index: number, value: string) => {
        this.setState({
            dirtyFilters: updateFilter(this.state.dirtyFilters, index, 'value', value)
        })
    }

    handleRemoveFilter = (index: number) => {
        this.setState({
            dirtyFilters: this.state.dirtyFilters.remove(index)
        })
        //Todo focus new btn
    }

    handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        if(!this.submitFiltersIfValid()) {
            event.preventDefault();
        }
    }

    handleClearFilter = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        this.props.onClearFilter();
        event.preventDefault();
        return false;
    }

    handleKeyPress = (event: KeyboardEvent) => {
        console.log("key press", event)
        if(event.ctrlKey && event.key === 'Enter') {
            this.submitFiltersIfValid();
        }

        if(event.ctrlKey && event.key === '+') {
            this.addEmptyFilter();
            event.preventDefault();
        }

        if(event.key === 'Enter') {
            event.preventDefault();
        }
    }

    render() {
        return <Form onSubmit={this.handleSubmit} ref={(form) => {this.form = form}}>
            <Segment basic clearing className='filterbox'>
                {
                    this.state.dirtyFilters.map(
                        (filter, index) => <StreamFilter
                            key={index}
                            index={index}
                            filter={filter}
                            existingFilterProps={this.props.existingFilterProps}
                            onPropertyChanged={this.handlePropertyChanged}
                            onOperatorChanged={this.handleOperatorChanged}
                            onValueChanged={this.handleValueChanged}
                            onRemoveFilter={this.handleRemoveFilter}
                            hasError={this.state.failedSubmit && !filter.isValid()}
                            t={this.props.t} />
                    )
                }
                <Popup
                    trigger={<Button id='newfilter' basic onClick={this.handleOnNewFilter} autoFocus><Icon name='plus' size='large' /></Button>}
                    content='Ctrl +'
                    on='hover'
                    position='bottom center'
                />
                <Button basic floated='right' onClick={this.handleClearFilter}>
                    {this.props.t('app.eventStore.filter.clear')}
                </Button>
                <Popup
                    trigger={<Button icon labelPosition='left' color='orange' floated='right' disabled={this.state.dirtyFilters.count() === 0}>
                        <Icon name='filter'/>{ this.props.t('app.eventStore.filter.apply') }
                    </Button>}
                    content='Ctrl + Enter'
                    position='bottom center'
                />
            </Segment>
        </Form>
    }
}
