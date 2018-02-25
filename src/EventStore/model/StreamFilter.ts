import {Record, fromJS} from "immutable";
import * as _ from 'lodash';

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

export type Metadata = 'metadata';
export type EventProperty = 'property';
export type FilterType = Metadata | EventProperty;
export type FilterProperty = string;
export type FilterOperator = 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'GREATER_THAN_EQUALS' | 'LOWER_THAN' | 'LOWER_THAN_EQUALS' | 'IN' | 'NOT_IN' | 'REGEX';
export type FilterValue = string;

export interface StreamFilterType {
    type: FilterType,
    property?: FilterProperty,
    operator?: FilterOperator,
    value?: FilterValue
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