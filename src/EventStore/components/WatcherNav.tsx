import * as React from 'react';
import { pure } from 'recompose';
import {Menu, MenuItem, Icon} from 'semantic-ui-react';
import {Map} from "immutable";
import {Watcher} from "../model";
import {NavLink} from "react-router-dom";
import {InjectedTranslateProps} from "react-i18next";

export interface WatcherNavProps extends InjectedTranslateProps {
    baseUrl: string,
    watchers: Map<string, Watcher.Watcher>,
    activeWatcher: Watcher.Id | null,
    onWatcherSelected: (watcherId: Watcher.Id) => void
}

export const WatcherNav = pure( (props: WatcherNavProps) => {

    let navLinks = [];

    props.watchers.forEach((watcher: Watcher.Watcher) => {
        navLinks.push(
            <MenuItem
                as={NavLink}
                to={props.baseUrl + "/" + encodeURIComponent(watcher.id())}
                active={watcher.id() === props.activeWatcher}
                key={watcher.id()}
                onClick={() => props.onWatcherSelected(watcher.id())}
            >
                {watcher.name()}
                { watcher.isWatching() && <Icon name='eye' color='red' /> }
            </MenuItem>
        );
    });

    return (
        <div>
            <h2>{ props.t('app.eventStore.watcher.title') }</h2>
            <Menu fluid vertical pointing secondary className='watcher'>
                {navLinks}
            </Menu>
        </div>
    );
});
