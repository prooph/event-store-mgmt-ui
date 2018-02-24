import {DomainEvent, DomainEventType} from './DomainEvent';
import {fromJS, List, Record} from "immutable";
import * as _ from 'lodash';

export class EventStoreHttpApi {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }
    getStreams(): string {
        return this.baseUrl + '/streams';
    }

    getLatestStreamEvents(streamName: string, limit: number): string {
        return this.baseUrl + `/stream/${streamName}/head/backward/${limit}`;
    }

    getOlderEvents(streamName: string, event: DomainEvent, limit: number): string {
        return this.baseUrl + `/stream/${streamName}/${event.streamPosition() - 1}/backward/${limit}`;
    }

    getNewerEvents(streamName: string, event: DomainEvent, limit: number): string {
        return this.baseUrl + `/stream/${streamName}/${event.streamPosition()}/forward/$W{limit}`;
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
