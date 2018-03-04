import {Record, fromJS, List} from "immutable";
import * as _ from 'lodash';
import {DomainEvent} from "./DomainEvent";
import {StreamName} from "./Stream";

export const EQUALS = 'EQUALS';
export const NOT_EQUALS = 'NOT_EQUALS';
export const GREATER_THAN = 'GREATER_THAN';
export const GREATER_THAN_EQUALS = 'GREATER_THAN_EQUALS';
export const LOWER_THAN = 'LOWER_THAN';
export const LOWER_THAN_EQUALS = 'LOWER_THAN_EQUALS';
export const IN = 'IN';
export const NOT_IN = 'NOT_IN';
export const REGEX = 'REGEX';
export const PREFIX_EVENT = 'event';
export const PREFIX_META = 'meta';
export const EVENT_PROPERTY = 'property';
export const METADATA = 'metadata';

export type Metadata = 'metadata';
export type EventProperty = 'property';
export type FilterType = Metadata | EventProperty;
export type FilterProperty = string;
export type FilterOperator = 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'GREATER_THAN_EQUALS' | 'LOWER_THAN' | 'LOWER_THAN_EQUALS' | 'IN' | 'NOT_IN' | 'REGEX';
export type FilterValue = string;
export type GroupId = string;

export interface StreamFilterType {
    type: FilterType,
    property?: FilterProperty,
    operator?: FilterOperator,
    value?: FilterValue
}

export interface StreamFilterGroupType {
    groupId: GroupId,
    streamName: StreamName,
    filters: List<StreamFilter>,
}

export const eventProperties = fromJS([
    PREFIX_EVENT + '.uuid',
    PREFIX_EVENT + '.created_at',
    PREFIX_EVENT + '.message_name',
])

export function detectFilterType(property: FilterProperty): FilterType {
    if(eventProperties.contains(property)) {
        return 'property';
    }

    return 'metadata';
}

export class StreamFilter extends Record({
    type: 'metadata',
    property: '',
    operator: EQUALS,
    value: ''
}) {
    constructor(data: StreamFilterType) {
        super(data)

        this.type = this.type.bind(this);
        this.property = this.property.bind(this);
        this.operator = this.operator.bind(this);
        this.value = this.value.bind(this);
        this.isValid = this.isValid.bind(this);
    }

    type(): FilterType {
        return this.get('type')
    }

    property(): FilterProperty {
        return this.get('property')
    }

    operator(): FilterOperator {
        return this.get('operator')
    }

    value(): FilterValue {
        return this.get('value')
    }

    isValid(prop?: string): boolean {
        if(prop) {
            return !_.isEmpty(this.get(prop));
        }

        return !_.isEmpty(this.type())
            && !_.isEmpty(this.property())
            && !_.isEmpty(this.operator())
            && !_.isEmpty(this.value());
    }
}

export class StreamFilterGroup extends Record({
    groupId: 'unknown',
    streamName: 'unknown',
    filters: fromJS([]),
}) {
    constructor(data: StreamFilterGroupType) {
        super(data);

        this.groupId = this.groupId.bind(this);
        this.streamName = this.streamName.bind(this);
        this.filters = this.filters.bind(this);
        this.groupMatch = this.groupMatch.bind(this);
    }

    groupId(): GroupId {
        return this.get('groupId')
    }

    streamName (): StreamName {
        return this.get('streamName')
    }

    filters(): List<StreamFilter> {
        return this.get('filters')
    }

    groupMatch (event: DomainEvent): boolean {
        return match(this.filters(), event);
    }
}

export function match(filters: List<StreamFilter>, event: DomainEvent): boolean {
    let matched = true;

    filters.forEach(filter => {
        if(!matchFilter(filter, event)) {
            matched = false;
        }
    })

    return matched;
}

function matchFilter(filter: StreamFilter, event: DomainEvent): boolean {
    switch (filter.operator()) {
        case EQUALS:
            return extractEventValue(filter, event) === castFilterValue(event, filter);
        case NOT_EQUALS:
            return extractEventValue(filter, event) !== castFilterValue(event, filter);
        case GREATER_THAN:
            return extractEventValue(filter, event) > castFilterValue(event, filter);
        case GREATER_THAN_EQUALS:
            return extractEventValue(filter, event) >= castFilterValue(event, filter);
        case LOWER_THAN:
            return extractEventValue(filter, event) < castFilterValue(event, filter);
        case LOWER_THAN_EQUALS:
            return extractEventValue(filter, event) <= castFilterValue(event, filter);
        case IN:
            return _.includes(castFilterValueArr(event, filter), extractEventValue(filter, event));
        case NOT_IN:
            return !_.includes(castFilterValueArr(event, filter), extractEventValue(filter, event));
        case REGEX:
            return  RegExp(filter.value()).test(extractEventValue(filter, event).toString());
    }

    return false;
}

function extractEventValue(filter: StreamFilter, event: DomainEvent): string | number {
    if(filter.type() === 'property') {
        return event.get(normalizeEventProperty(filter.property()), '')
    }

    return event.metadata().get(normalizeMetadata(filter.property()), '')
}

function normalizeEventProperty(prop: string): string {
    return prop.replace(/^event\./, '');
}

function normalizeMetadata(meta: string): string {
    return meta.replace(/^meta\./, '');
}

function castFilterValue(event: DomainEvent, filter: StreamFilter): string | number {
    return _.isNumber(extractEventValue(filter, event))? parseInt(filter.value()) : filter.value();
}

function castFilterValueArr(event: DomainEvent, filter: StreamFilter): string[] | number[] {
    const filterValArr = filter.value().split(";");
    return _.isNumber(extractEventValue(filter, event))? filterValArr.map(parseInt) : filterValArr;
}