import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {InjectedTranslateProps, translate} from "react-i18next";
import {RouteComponentProps, withRouter} from "react-router";
import {Stream, Event, EventStore, Filter, Watcher} from "../model";
import {Map} from "immutable";
import {WatchersLayout} from "../components/WatchersLayout";
import {WatchersSelector} from "../selectors";
import { Dispatch } from '../../types/types';
import {Query, Cmd} from '../actions';

interface StateProps extends InjectedTranslateProps {
    watchers: Map<string, Watcher.Watcher>,
}

interface PropsToDispatch {
    onWatcherSelected: (watcherId: Watcher.Id) => void,
    onRemoveWatcher: (watcherId: Watcher.Id) => void,
    onToggleWatcher: (watcherId: Watcher.Id, isWatching: boolean) => void,
}

interface OwnProps extends RouteComponentProps<{watcherId?: Watcher.Id}>  {
    baseUrl: string,
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({
        onWatcherSelected: Cmd.setSelectedWatcher,
        onRemoveWatcher: Cmd.removeStreamWatcher,
        onToggleWatcher: Cmd.toggleStreamWatcher,
    } as any, dispatch);
};


const WatchersLayoutContainer = connect<StateProps, PropsToDispatch, OwnProps>(WatchersSelector.makeMapStateToPropsWatchersLayout(), mapDispatchToProps, undefined, {pure: false})(WatchersLayout);

export default withRouter(translate('translation')(WatchersLayoutContainer));