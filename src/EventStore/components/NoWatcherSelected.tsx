import * as React from 'react';
import { pure } from 'recompose';
import {InjectedTranslateProps} from "react-i18next";
import {Header, Message} from "semantic-ui-react";

export interface NoWatcherSelectedProps extends InjectedTranslateProps {
    style?: any,
}

export const NoWatcherSelected = pure((props: NoWatcherSelectedProps) => {
    return (
        <div style={props.style}>
            <Header as="h1" textAlign="center">{ props.t('app.eventStore.watcher.title') }</Header>
            <Message warning>{ props.t('app.eventStore.watcher.no_watcher_selected') }</Message>
        </div>
    )
});