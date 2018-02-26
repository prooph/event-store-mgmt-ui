import * as React from 'react';
import {List} from "immutable";
import { pure } from 'recompose';
import {Form} from 'semantic-ui-react';
import {InjectedTranslateProps} from "react-i18next";
import {Filter} from '../model';

export interface StreamFilterProps extends InjectedTranslateProps {
    filter: Filter.StreamFilter,
    index: number,
    existingFilterProps: List<string>,
    onPropertyChanged: (index: number, property: Filter.FilterProperty) => void,
    onOperatorChanged: (index: number, operator: Filter.FilterOperator) => void,
    onValueChanged: (index: number, value: Filter.FilterValue) => void,
    onRemoveFilter: (index: number) => void,
    hasError: boolean
}

const operatorOptions = [
    {text: "=", value: Filter.EQUALS},
    {text: "!=", value: Filter.NOT_EQUALS},
    {text: ">", value: Filter.GREATER_THAN},
    {text: ">=", value: Filter.GREATER_THAN_EQUALS},
    {text: "<", value: Filter.LOWER_THAN},
    {text: "<=", value: Filter.LOWER_THAN_EQUALS},
    {text: "IN", value: Filter.IN},
    {text: "NOT IN", value: Filter.NOT_IN},
    {text: "REGEX", value: Filter.REGEX},
]

const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>, props: StreamFilterProps) => {
    if(event.key === 'Escape') {
        props.onRemoveFilter(props.index);
    }
}

export const StreamFilter = pure((props: StreamFilterProps) => {

    const propertyOptions = props.existingFilterProps.map(prop => <option key={prop} value={prop} />).toJS();

    return <Form.Group>
        <Form.Input
            fluid
            placeholder={props.t('app.eventStore.filter.property')}
            width={7}
            list='filterProps'
            autoFocus
            value={props.filter.property()}
            error={props.hasError && !props.filter.isValid('property')}
            onChange={(event: any) => props.onPropertyChanged(props.index, event.target.value)}
            onKeyDown={(event) => handleEscape(event, props) }
        />
        <datalist id='filterProps'>{ propertyOptions }</datalist>
        <Form.Dropdown
            fluid
            selection
            search
            placeholder={props.t('app.eventStore.filter.operator')}
            options={operatorOptions}
            width={2}
            value={props.filter.operator()}
            error={props.hasError && !props.filter.isValid('operator')}
            onChange={(event: any, data: any) => props.onOperatorChanged(props.index, data.value)}/>
        <Form.Input
            fluid
            placeholder={props.t('app.eventStore.filter.value')}
            width={6}
            value={props.filter.value()}
            error={props.hasError && !props.filter.isValid('value')}
            onChange={(event: any) => props.onValueChanged(props.index, event.target.value)}
            onKeyDown={(event) => handleEscape(event, props) }
        />
        <Form.Button fluid basic icon='remove' size='large' onClick={() => props.onRemoveFilter(props.index)} />
    </Form.Group>
});
