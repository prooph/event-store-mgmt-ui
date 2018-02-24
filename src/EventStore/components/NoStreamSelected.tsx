import * as React from 'react';
import { pure } from 'recompose';
import {InjectedTranslateProps} from "react-i18next";
import {Header, Message} from "semantic-ui-react";

export interface NoStreamSelectedProps extends InjectedTranslateProps {}

export const NoStreamSelected = pure((props: NoStreamSelectedProps) => {
    return (
        <div>
            <Header as="h1" textAlign="center">{ props.t('app.eventStore.h1') }</Header>
            <Message warning>{ props.t('app.eventStore.streams.no_stream_selected') }</Message>
        </div>
    )
});