import {List, Record, fromJS} from "immutable";
import {StreamName} from "./Stream";
import {StreamFilterGroup} from "./StreamFilter";
import {DomainEvent} from "./DomainEvent";
import {eventProperties, PREFIX_META} from "./StreamFilter";
import * as _ from 'lodash';

export type Id = string;
export type Name = string;

export interface WatcherType {
    watcherId: Id,
    watcherName: Name,
    streams: List<StreamName>,
    filters: List<StreamFilterGroup>,
    watching?: boolean,
    recordedEvents?: List<DomainEvent>
    showFilterBox?: boolean,
}

//Note: If you change record structure you have to align deserialization in src/core/localStorage.ts!!!
export class Watcher extends Record({
    watcherId: '',
    watcherName: 'unknown watcher',
    streams: fromJS([]),
    filters: fromJS([]),
    watching: true,
    recordedEvents: fromJS([]),
    showFilterBox: false,
}) {
    constructor(data: WatcherType) {
        super(data);

        this.id = this.id.bind(this)
        this.name = this.name.bind(this)
        this.streams = this.streams.bind(this)
        this.filters = this.filters.bind(this)
        this.isWatching = this.isWatching.bind(this)
        this.recordedEvents = this.recordedEvents.bind(this)
        this.showFilterBox = this.showFilterBox.bind(this)
        this.isInterestedIn = this.isInterestedIn.bind(this)
        this.suggestFilterProperties = this.suggestFilterProperties.bind(this)
    }

    id(): Id {
        return this.get('watcherId')
    }

    name(): Name {
        return this.get('watcherName')
    }

    streams(): List<StreamName> {
        return this.get('streams')
    }

    filters(): List<StreamFilterGroup> {
        return this.get('filters')
    }

    isWatching(): boolean {
        return this.get('watching')
    }

    recordedEvents(): List<DomainEvent> {
        return this.get('recordedEvents')
    }

    recordEvent(event: DomainEvent): Watcher {
        let thisEvents = this.recordedEvents();

        if(!thisEvents.find(lEvent => lEvent.uuid() === event.uuid())) {
            thisEvents = thisEvents.unshift(event)
        } else {
            return this;
        }

        thisEvents = thisEvents.sort((a, b) => {
            if(a.createdAt() === b.createdAt()) {
                return 0;
            }

            return a.createdAt() < b.createdAt()? 1 : -1;
        }) as List<DomainEvent>

        return this.set('recordedEvents', thisEvents) as Watcher;
    }

    showFilterBox(): boolean {
        return this.get('showFilterBox')
    }

    isInterestedIn(streamName: StreamName, event: DomainEvent): boolean {
        if(!this.streams().contains(streamName)) {
            return false;
        }

        let matched = false;

        this.filters().forEach(filterGroup => {
            matched = filterGroup.streamName() === streamName && filterGroup.groupMatch(event);
            return !matched;
        });

        return matched;
    }

    suggestFilterProperties(): List<string> {
        let props = eventProperties.toArray();

        this.recordedEvents().forEach(event => {
            event.metadata().forEach((val,key) => {
                if(key === '_position') {
                    return;
                }
                key = `${PREFIX_META}.${key}`;

                if(!_.includes(props, key)) {
                    props.push(key);
                }
            })
        })

        return List.of(...props);
    }
}
