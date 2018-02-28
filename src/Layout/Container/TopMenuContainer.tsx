import { connect } from 'react-redux';
import {translate, InjectedTranslateProps} from "react-i18next";
import {Model as ESModel} from '../../EventStore/index';
import TopMenu from '../TopMenu';
import * as TopMenuSelector from '../selectors';

interface StateProps extends InjectedTranslateProps {
    selectedStream: ESModel.Stream.StreamName,
    selectedWatcher: ESModel.Watcher.Id,
}

interface PropsToDispatch {
}

interface OwnProps {
}

const TopMenuContainer = connect<StateProps, PropsToDispatch, OwnProps>(TopMenuSelector.makeMapStateToPropsTopMenu, undefined, undefined, {pure: false})(TopMenu as any);

export default translate()(TopMenuContainer);