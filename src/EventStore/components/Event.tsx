import * as React from 'react';
import { Event as ModelEvent} from '../model';
import { List, Header, Icon } from 'semantic-ui-react';
import JSONTreeComponent from 'react-json-tree';
import { Json } from '../../utils';
import { InjectedTranslateProps } from 'react-i18next';

export interface EventProps extends InjectedTranslateProps {
    event: ModelEvent.DomainEvent;
}

const Event = (props: EventProps) => {
    const json = <JSONTreeComponent data={props.event.payload().toJS()} theme={Json.jsonTreeTheme} hideRoot={true} />;
    const metadataJson = <JSONTreeComponent data={props.event.metadata().toJS()} theme={Json.jsonTreeTheme} hideRoot={true} />;
    const uuid = props.event.uuid();

    return {
        title: {
            key: 't-' + uuid,
            content: (<Header size='small' style={{display: 'inline'}}>{props.event.messageName()}
                    <Header floated="right" sub={true}>{props.event.displayCreatedAt()}</Header>
                </Header>
            ),
        },
        content: {
            key: 'c-' + uuid,
            content: (
                <List verticalAlign={'middle'} size={'large'} divided={true}>
                    <List.Item
                        header={props.t('app.eventStore.event.uuid')}
                        content={uuid}
                    />
                    <List.Item
                        header={props.t('app.eventStore.event.payload')}
                        content={json}
                    />
                    <List.Item
                        header={props.t('app.eventStore.event.metadata')}
                        content={metadataJson}
                    />
                </List>
            ),
        },
    };
};
export default Event;
