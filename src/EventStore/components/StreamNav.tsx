import * as React from 'react';
import { pure } from 'recompose';
import {Menu, MenuItem, Grid, SemanticWIDTHS} from 'semantic-ui-react';
import {List} from "immutable";
import {Stream} from "../model";
import {NavLink} from "react-router-dom";
import * as Url from "url";
import {escape} from "querystring";
import {InjectedTranslateProps} from "react-i18next";

export interface StreamNavProps extends InjectedTranslateProps {
    baseUrl: string,
    streams: List<Stream.Stream>,
    activeStream: Stream.StreamName | null
}

export const StreamNav = pure( (props: StreamNavProps) => {

    let navLinks = [];

    props.streams.forEach((stream: Stream.Stream) => {
        navLinks.push(
            <MenuItem
                as={NavLink}
                to={props.baseUrl + "/" + encodeURIComponent(stream.name())}
                active={stream.name() === props.activeStream}
                key={stream.name()}>
                {stream.name()}
            </MenuItem>
        );
    });

    return (
        <div>
            <h2>{ props.t('app.eventStore.streams.title') }</h2>
            <Menu fluid vertical pointing secondary>
                {navLinks}
            </Menu>
        </div>
    );
});
