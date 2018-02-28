import {List, Record, fromJS} from "immutable";
import {StreamName} from "./Stream";
import {StreamFilter} from "./StreamFilter";
import {DomainEvent} from "./DomainEvent";

export type Id = string;
export type Name = string;

export interface WatcherType {
    watcherId: Id,
    watcherName: Name,
    streamName: StreamName,
    filters: List<StreamFilter>,
    watching?: boolean,
    recordedEvents?: List<DomainEvent>
    showFilterBox?: boolean,
}

export class Watcher extends Record({
    watcherId: '',
    watcherName: 'unknown watcher',
    streamName: 'unknown stream',
    filters: fromJS([]),
    watching: true,
    recordedEvents: fromJS([]),
    showFilterBox: false,
}) {
    constructor(data: WatcherType) {
        super(data);

        this.id = this.id.bind(this)
        this.name = this.name.bind(this)
        this.streamName = this.streamName.bind(this)
        this.filters = this.filters.bind(this)
        this.isWatching = this.isWatching.bind(this)
        this.recordedEvents = this.recordedEvents.bind(this)
        this.showFilterBox = this.showFilterBox.bind(this)
    }

    id(): Id {
        return this.get('watcherId')
    }

    name(): Name {
        return this.get('watcherName')
    }

    streamName(): StreamName {
        return this.get('streamName')
    }

    filters(): List<StreamFilter> {
        return this.get('filters')
    }

    isWatching(): boolean {
        return this.get('watching')
    }

    recordedEvents(): List<DomainEvent> {
        return this.get('recordedEvents')
    }

    showFilterBox(): boolean {
        return this.get('showFilterBox')
    }
}
