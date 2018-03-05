import * as React from 'react';
import {InjectedTranslateProps} from "react-i18next";
import {fromJS, List} from "immutable";
import {Form, Segment, Icon, Button, Popup, Divider, Dropdown, Message} from 'semantic-ui-react';
import {Filter, Watcher, Stream} from "../model";
import {StreamFilter} from "./StreamFilter";
import * as uuid from "uuid";

export interface WatcherFilterBoxProps extends InjectedTranslateProps {
    existingFilterProps: List<string>,
    availableStreams: List<Stream.StreamName>,
    filters: List<Filter.StreamFilterGroup>,
    onCancel: () => void,
    onFilterSubmit: (filters: List<Filter.StreamFilterGroup>) => void,
}

const emptyFilter = () => new Filter.StreamFilter({type: "metadata"})

const updateFilter = (filters: List<Filter.StreamFilterGroup>, groupId, index: number, propToUpdate: string, val: string): List<Filter.StreamFilterGroup> => {
    const groupIdx = filters.findIndex(group => group.groupId() === groupId);

    return filters.setIn([groupIdx, "filters", index, propToUpdate], val) as List<Filter.StreamFilterGroup>;
}

interface StateProps {
    dirtyFilters: List<Filter.StreamFilterGroup>,
    failedSubmit: boolean,
    lastModifiedGroup: null | string,
    unsaved: boolean,
}

export class WatcherFilterBox extends React.Component<WatcherFilterBoxProps, StateProps> {
    state = {dirtyFilters: fromJS([]), failedSubmit: false, lastModifiedGroup: null, unsaved: false}

    componentDidMount() {
        this.setState({
            dirtyFilters: this.props.filters
        })

        document.addEventListener('keydown', this.handleKeyPress)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress)
    }

    componentWillReceiveProps(props: WatcherFilterBoxProps) {
        if(!this.state.unsaved) {
            this.setState({
                dirtyFilters: props.filters
            })
        }
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
        this.setState({
            unsaved: false,
        })
        return true;
    }

    addEmptyFilter(groupId: Filter.GroupId) {
        const entry = this.state.dirtyFilters.findEntry(group => group.groupId() === groupId);

        if(!entry) {
            return;
        }

        let [idx, group] = entry;

        group = group.set("filters", group.filters().push(emptyFilter()));

        this.setState({
            dirtyFilters: this.state.dirtyFilters.set(idx, group),
            unsaved: true,
        })
    }

    handleOnNewFilterGroup = (event: React.SyntheticEvent<HTMLButtonElement>) => {

        const streamName = this.props.availableStreams.count() === 1? this.props.availableStreams.first() : '';

        const filterGroup = new Filter.StreamFilterGroup({
            groupId: uuid.v4(),
            filters: List.of(emptyFilter()),
            streamName
        });

        this.setState({
            dirtyFilters: this.state.dirtyFilters.push(filterGroup),
            unsaved: true,
        })
        event.preventDefault();
    }

    handleOnNewFilter = (groupId: Filter.GroupId, event: React.SyntheticEvent<HTMLButtonElement>) => {
        this.addEmptyFilter(groupId);
        event.preventDefault();
    }

    handlePropertyChanged = (groupId: Filter.GroupId, index: number, property: string) => {
        let filters = updateFilter(this.state.dirtyFilters, groupId, index, 'property', property);
        filters = updateFilter(filters, groupId, index, 'type', Filter.detectFilterType(property));


        this.setState({
            dirtyFilters: filters,
            unsaved: true,
        })
    }

    handleOperatorChanged = (groupId: Filter.GroupId, index: number, operator: string) => {
        this.setState({
            dirtyFilters: updateFilter(this.state.dirtyFilters, groupId, index, 'operator', operator),
            unsaved: true,
        })
    }

    handleValueChanged = (groupId: Filter.GroupId, index: number, value: string) => {
        this.setState({
            dirtyFilters: updateFilter(this.state.dirtyFilters, groupId, index, 'value', value),
            unsaved: true,
        })
    }

    handleRemoveFilter = (groupId: Filter.GroupId, index: number) => {
        const groupIdx = this.state.dirtyFilters.findIndex(group => group.groupId() === groupId);

        const modifiedFilters = this.state.dirtyFilters.removeIn([groupIdx, 'filters', index]);

        this.setState({
            dirtyFilters: modifiedFilters,
            unsaved: true,
        })

        if(modifiedFilters.getIn([groupIdx, 'filters']).count() === 0) {
            this.setState({
                dirtyFilters: this.state.dirtyFilters.remove(groupIdx),
                unsaved: true,
            })
        }
    }

    handleChangeStreamName = (groupId: Filter.GroupId, streamName: Stream.StreamName) => {
        const groupIdx = this.state.dirtyFilters.findIndex(group => group.groupId() === groupId);

        this.setState({
            dirtyFilters: this.state.dirtyFilters.setIn([groupIdx, 'streamName'], streamName),
            unsaved: true,
        })
    }

    handleCancel = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        this.setState({
            dirtyFilters: this.props.filters,
            unsaved: false,
        });
        this.props.onCancel();
        event.preventDefault();
        return false;
    }

    handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        if(!this.submitFiltersIfValid()) {
            event.preventDefault();
        }
    }

    handleKeyPress = (event: KeyboardEvent) => {
        if(event.ctrlKey && event.key === 'Enter') {
            this.submitFiltersIfValid();
        }

        if(event.ctrlKey && event.key === '+') {
            const groupId = this.state.lastModifiedGroup? this.state.lastModifiedGroup : this.state.dirtyFilters.last().groupId();
            this.addEmptyFilter(groupId);
            event.preventDefault();
        }

        if(event.key === 'Enter') {
            event.preventDefault();
        }
    }

    render() {
        const streamDropdownOpts = this.props.availableStreams.map(streamName => {
            return {text: streamName, value: streamName}
        }).toJS();

        const filterGroups = this.state.dirtyFilters.map((streamFilterGroup: Filter.StreamFilterGroup, groupIdx) => {
            const groupId = streamFilterGroup.groupId();

            const streamFilters = streamFilterGroup.filters().map(
                (filter, index) => <StreamFilter
                    key={groupId + "-" + index}
                    index={index}
                    filter={filter}
                    existingFilterProps={this.props.existingFilterProps}
                    onPropertyChanged={(index: number, property: string) => this.handlePropertyChanged(groupId, index, property)}
                    onOperatorChanged={(index: number, operator: string) => this.handleOperatorChanged(groupId, index, operator)}
                    onValueChanged={(index: number, value: string) => this.handleValueChanged(groupId, index, value)}
                    onRemoveFilter={(index: number) => this.handleRemoveFilter(groupId, index)}
                    hasError={this.state.failedSubmit && !filter.isValid()}
                    autoFocus={streamFilterGroup.streamName() !== ''}
                    t={this.props.t} />
            );

            return <Segment basic clearing>
                <Dropdown
                    selection
                    options={streamDropdownOpts}
                    open={streamFilterGroup.streamName() === ''}
                    placeholder={this.props.t('app.eventStore.watcher.select_stream')}
                    error={this.state.failedSubmit && streamFilterGroup.streamName() === ''}
                    onChange={(event: any, data: any) => this.handleChangeStreamName(groupId, data.value)}
                    value={streamFilterGroup.streamName()} />
                <Divider horizontal />
                {streamFilters}
                <Popup
                    trigger={<Button id='newfilter' basic onClick={evt => this.handleOnNewFilter(groupId, evt)}><Icon name='plus' size='large' /></Button>}
                    content={this.props.t('app.eventStore.filter.new') + ' (Ctrl +)'}
                    on='hover'
                    position='bottom center'
                />
            </Segment>
        })

        let filterGroupsAndDividers = [];

        filterGroups.forEach((filterGroupEle, groupIdx) => {
            if(groupIdx > 0) {
                filterGroupsAndDividers.push(<Divider horizontal key={groupIdx + "-divider"}>{ this.props.t('common.or') }</Divider>)
            }

            filterGroupsAndDividers.push(filterGroupEle);
        })

        return <Form onSubmit={this.handleSubmit} className='watcher'>
            <Segment basic clearing className='filterbox watcher'>
                {filterGroupsAndDividers}
                <Button basic floated='right' onClick={this.handleCancel}>
                    {this.props.t('common.cancel')}
                </Button>
                <Button icon labelPosition='left' color='red' inverted floated='left' onClick={this.handleOnNewFilterGroup}>
                    <Icon name='plus' />{ this.props.t('app.eventStore.watcher.add_filter_group') }
                </Button>
                <Popup
                    trigger={<Button icon labelPosition='left' color='red' floated='right' disabled={!this.state.unsaved}>
                        <Icon name='check' />{ this.props.t('common.save') }
                    </Button>}
                    content='Ctrl + Enter'
                    position='bottom center'
                />
            </Segment>
            <Message icon info secondary attached='bottom' >
                <Icon name='filter' />
                <Message.Content>{ this.props.t('app.eventStore.watcher.filter_hint') }</Message.Content>
            </Message>
        </Form>
    }
}
