import {fromJS, List, Record} from "immutable";
import {DomainEvent} from "./DomainEvent";
import {StreamFilter} from "./StreamFilter";
import {Query} from '../actions';
import {eventProperties, PREFIX_META} from "./StreamFilter";
import * as _ from 'lodash';

export type StreamName = string;

export interface StreamType {
    streamName: StreamName,
    loading?: boolean,
    events?: List<DomainEvent>,
    filters?: List<StreamFilter>,
    lastErrorCode?: number | null,
    showFilterBox?: boolean,
}

export class Stream extends Record({
    streamName: 'unknown',
    loading: false,
    events: fromJS([]),
    filters: fromJS([]),
    lastErrorCode: null,
    showFilterBox: false,
}) {
    constructor(data: StreamType) {
        super(data);

        this.name = this.name.bind(this);
        this.isLoading = this.isLoading.bind(this);
        this.lastErrorCode = this.lastErrorCode.bind(this);
        this.showFilterBox = this.showFilterBox.bind(this);
        this.events =  this.events.bind(this);
        this.clearEvents = this.clearEvents.bind(this);
        this.filters = this.filters.bind(this);
    }

    name(): StreamName {
        return this.get('streamName')
    }

    isLoading(): boolean {
        return this.get('loading')
    }

    lastErrorCode(): number | null {
        return this.get('lastErrorCode');
    }

    showFilterBox(): boolean {
        return this.get('showFilterBox');
    }

    events(): List<DomainEvent> {
        return this.get('events')
    }

    clearEvents(): Stream {
        return this.set('events', fromJS([])) as Stream;
    }

    canHaveOlderEvents(): boolean {
        if(this.lastErrorCode() && _.includes(Query.EmptyStreamErrorCodes, this.lastErrorCode())) {
            return false;
        }

        return this.events().count() > 0 && this.events().last().streamPosition() > 1;
    }

    filters(): List<StreamFilter> {
        return this.get('filters')
    }

    replaceFilters(filters: List<StreamFilter>): Stream {
        return this.set('filters', filters) as Stream;
    }

    replaceEvents(events: List<DomainEvent>): Stream {
        return this.set("events", events) as Stream;
    }

    mergeEvents(events: List<DomainEvent>): Stream {
        let thisEvents = this.events();

        events.forEach(event => {
            if(!thisEvents.find(lEvent => lEvent.uuid() === event.uuid())) {
                thisEvents = thisEvents.push(event)
            }
        })

        thisEvents = thisEvents.sort((a, b) => {
            if(a.streamPosition() === b.streamPosition()) {
                return 0;
            }

            //Events are sorted in reverse order
            return a.streamPosition() < b.streamPosition()? 1 : -1;
        }) as List<DomainEvent>

        return this.set('events', thisEvents) as Stream;
    }

    suggestFilterProperties(): List<string> {
        let props = eventProperties.toArray();

        this.events().forEach(event => {
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
