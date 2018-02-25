import * as React from 'react';
import {Form, Segment, Icon, Button} from 'semantic-ui-react';
import {InjectedTranslateProps} from "react-i18next";
import {StreamFilter} from "./StreamFilter";
import {fromJS, List} from "immutable";
import {Filter} from "../model";

export interface StreamFilterBoxProps extends InjectedTranslateProps {
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

    componentDidMount() {
        this.setState({
            dirtyFilters: this.props.filters
        })
    }

    componentWillReceiveProps(props: StreamFilterBoxProps) {
        this.setState({
            dirtyFilters: props.filters
        })
    }

    handleOnNewFilter = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        this.setState({
            dirtyFilters: this.state.dirtyFilters.push(emptyFilter())
        })
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
    }

    handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        const invalidFilters = this.state.dirtyFilters.filterNot(filter => filter.isValid());
        if(invalidFilters.count() > 0) {
            this.setState({
                failedSubmit: true
            })
            event.preventDefault();
            return false;
        }

        this.props.onFilterSubmit(this.state.dirtyFilters);
    }

    handleClearFilter = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        this.props.onClearFilter();
        event.preventDefault();
        return false;
    }

    render() {
        return <Form onSubmit={this.handleSubmit}>
            <Segment basic clearing className='filterbox' >
                {
                    this.state.dirtyFilters.map(
                        (filter, index) => <StreamFilter
                            key={index}
                            index={index}
                            filter={filter}
                            onPropertyChanged={this.handlePropertyChanged}
                            onOperatorChanged={this.handleOperatorChanged}
                            onValueChanged={this.handleValueChanged}
                            onRemoveFilter={this.handleRemoveFilter}
                            hasError={this.state.failedSubmit && !filter.isValid()}
                            t={this.props.t} />
                    )
                }
                <Button basic onClick={this.handleOnNewFilter}><Icon name='plus' size='large' /></Button>
                <Button basic floated='right' onClick={this.handleClearFilter}>
                    {this.props.t('app.eventStore.filter.clear')}
                </Button>
                <Button icon labelPosition='left' color='orange' floated='right' disabled={this.state.dirtyFilters.count() === 0}>
                    <Icon name='filter'/>{ this.props.t('app.eventStore.filter.apply') }
                </Button>
            </Segment>
        </Form>
    }
}
