import * as React from 'react';
import {Form, Segment, Icon, Button, Popup} from 'semantic-ui-react';
import {InjectedTranslateProps} from "react-i18next";
import {StreamFilter} from "./StreamFilter";
import {fromJS, List} from "immutable";
import {Filter, Watcher, Stream} from "../model";
import {CreateWatcherModal} from "./CreateWatcherModal";

export interface StreamFilterBoxProps extends InjectedTranslateProps {
    existingFilterProps: List<string>,
    filters: List<Filter.StreamFilter>,
    onFilterSubmit: (filters: List<Filter.StreamFilter>) => void,
    onClearFilter: () => void,
    onChangeUnsavedState: (unsavedFilters: boolean) => void,
    onAddWatcher: (watcherId: Watcher.Id, watcherName: Watcher.Name) => void,
}

const emptyFilter = () => new Filter.StreamFilter({type: "metadata"})

const updateFilter = (filters: List<Filter.StreamFilter>, index: number, propToUpdate: string, val: string): List<Filter.StreamFilter> => {
    const filter = filters.get(index, emptyFilter());
    return filters.set(index, filter.set(propToUpdate, val) as Filter.StreamFilter) as List<Filter.StreamFilter>;
}

interface StateProps {
    dirtyFilters: List<Filter.StreamFilter>,
    failedSubmit: boolean,
    showWatcherModal: boolean,
}

export class StreamFilterBox extends React.Component<StreamFilterBoxProps, StateProps> {

    state = {dirtyFilters: fromJS([]), failedSubmit: false, showWatcherModal: false}

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
            dirtyFilters: this.state.dirtyFilters.push(emptyFilter()),
        })

        this.props.onChangeUnsavedState(true);
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
        this.props.onChangeUnsavedState(false);
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
            dirtyFilters: filters,
        })

        this.props.onChangeUnsavedState(true)
    }

    handleOperatorChanged = (index: number, operator: string) => {
        console.log("operator ", operator)
        this.setState({
            dirtyFilters: updateFilter(this.state.dirtyFilters, index, 'operator', operator),
        })
        this.props.onChangeUnsavedState(true)
    }

    handleValueChanged = (index: number, value: string) => {
        this.setState({
            dirtyFilters: updateFilter(this.state.dirtyFilters, index, 'value', value),
        })
        this.props.onChangeUnsavedState(true)
    }

    handleRemoveFilter = (index: number) => {
        this.setState({
            dirtyFilters: this.state.dirtyFilters.remove(index),
        })
        this.props.onChangeUnsavedState(true)
    }

    handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        if(!this.submitFiltersIfValid()) {
            event.preventDefault();
        }
    }

    handleOnCreateWatcher = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        if(!this.submitFiltersIfValid()) {
            return;
        }

        this.setState({showWatcherModal: true})
    }

    handleCloseWatcherModal = () => this.setState({showWatcherModal: false})

    handleSubmitWatcher = (watcherId: Watcher.Id, watcherName: Watcher.Name) => {
        this.props.onAddWatcher(watcherId, watcherName);
        this.setState({showWatcherModal: false})
    }


    handleClearFilter = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        this.props.onClearFilter();
        this.props.onChangeUnsavedState(false)
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
        return <Form onSubmit={this.handleSubmit}>
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
                    content={this.props.t('app.eventStore.filter.new') + ' (Ctrl +)'}
                    on='hover'
                    position='bottom center'
                />
                <CreateWatcherModal open={this.state.showWatcherModal}
                                    onClose={this.handleCloseWatcherModal}
                                    onSubmitWatcher={this.handleSubmitWatcher}
                                    t={this.props.t}/>
                <Popup
                    trigger={<Button
                        color='green'
                        circular
                        disabled={this.state.dirtyFilters.count() === 0}
                        icon='eye'
                        size='tiny'
                        onClick={this.handleOnCreateWatcher}
                        />}
                    content={ this.props.t('app.eventStore.filter.new_watcher') }
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
