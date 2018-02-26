import {DomainEvent, DomainEventType} from './DomainEvent';
import {StreamName} from "./Stream";
import * as Filter from "./StreamFilter";
import {fromJS, List, Record} from "immutable";
import * as _ from 'lodash';

const typeToQueryKey = (type: Filter.FilterType): string => type === 'metadata'? 'meta' : type;

const translateProperty = (property: Filter.FilterProperty) => {
    if(property === Filter.PREFIX_EVENT + '.uuid') {
        return 'event_id';
    }

    if(property === Filter.PREFIX_EVENT + '.message_name') {
        return 'event_name';
    }

    return property;
}

const rmPropertyPrefix = (property: Filter.FilterProperty): Filter.FilterProperty => {
    return property.replace(/^(event\.)|(meta\.)/, '');
}

const filterToQueryPart = (filter: Filter.StreamFilter, index: number): string => {
    const queryKey = `${typeToQueryKey(filter.type())}_${index}`;
    const property = encodeURIComponent(rmPropertyPrefix(translateProperty(filter.property())))
    const operator = encodeURIComponent(filter.operator());
    const value = encodeURIComponent(filter.value());

    if(operator === Filter.IN || operator === Filter.NOT_IN) {
        const values = fromJS(filter.value().split(';'));
        return values.map(val => `${queryKey}_field=${property}&${queryKey}_operator=${operator}&${queryKey}_value[]=${val}`)
            .toArray().join('&');
    }

    return `${queryKey}_field=${property}&${queryKey}_operator=${operator}&${queryKey}_value=${value}`;
}

const filtersToQueryString = (filters: List<Filter.StreamFilter>): string => {
    return filters.map(filterToQueryPart).join('&');
}

export class EventStoreHttpApi {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }
    getStreams(): string {
        return this.baseUrl + '/streams';
    }

    getLatestStreamEvents(streamName: StreamName, limit: number): string {
        return this.baseUrl + `/stream/${streamName}/head/backward/${limit}`;
    }

    getOlderEvents(streamName: StreamName, event: DomainEvent, filters: List<Filter.StreamFilter>, limit: number): string {
        let url = this.baseUrl + `/stream/${streamName}/${event.streamPosition() - 1}/backward/${limit}`;

        if(filters.count()) {
            url = url + '?' + filtersToQueryString(filters);
        }

        return url;
    }

    getNewerEvents(streamName: StreamName, event: DomainEvent, limit: number): string {
        return this.baseUrl + `/stream/${streamName}/${event.streamPosition()}/forward/$W{limit}`;
    }

    getFilteredEvents(streamName: StreamName, filters: List<Filter.StreamFilter>, limit: number): string {
        return this.getLatestStreamEvents(streamName, limit) + '?' + filtersToQueryString(filters);
    }
}

export type RelationFirst = 'first';
export type RelationLast = 'last';
export type RelationSelf = 'self';
export type RelationNon = 'non';

export type LinkRelation = RelationFirst | RelationLast | RelationSelf | RelationNon;

export interface StreamResponseLinkType {
    uri: string,
    relation: LinkRelation
}

export class StreamResponseLink extends Record({
    uri: "",
    relation: 'non'
}) {
    constructor(data: StreamResponseLinkType) {
        super(data);

        this.uri = this.uri.bind(this);
        this.relation = this.relation.bind(this);
    }

    uri() {
        return this.get('uri')
    }

    relation() {
        return this.get('relation')
    }
}

export interface StreamResponseType {
    title: string,
    id: string,
    streamName: string,
    _links: StreamResponseLinkType[],
    entries: DomainEvent[]
}

export class StreamResponse extends Record({
    title: "Unknown Stream",
    id: "unknown",
    streamName: "unknown",
    _links: [],
    entries: []
}) {
    constructor(data: StreamResponseType) {
        super(data);

        this.title = this.title.bind(this);
        this.id = this.id.bind(this);
        this.streamName = this.streamName.bind(this);
        this.links = this.links.bind(this);
        this.events = this.events.bind(this);
    }

    title(): string {
        return this.get('title')
    }

    id(): string {
        return  this.get('id')
    }

    streamName(): string {
        return this.get('streamName')
    }

    links(): List<StreamResponseLink> {
        const links: StreamResponseLinkType[] = this.get('_links');
        return List.of(..._.map(links, link => new StreamResponseLink(link)));
    }

    events(): List<DomainEvent> {
        const events: DomainEventType[] = this.get('entries');
        return List.of(..._.map(events, entry => new DomainEvent(entry)));
    }
}
