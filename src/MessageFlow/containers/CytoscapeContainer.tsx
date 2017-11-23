import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {translate, InjectedTranslateProps} from "react-i18next";
import {MessageFlow} from "../model";
import {Command} from "../actions";
import { Dispatch } from '../../types/types';
import {Cytoscape as CytoscapSelector} from "../selectors";
import Cytoscape from "../components/Cytoscape";
import * as cytoscapeLib from 'cytoscape';

interface StateProps extends InjectedTranslateProps {
    messageFlow: MessageFlow.MessageFlow
}

interface PropsToDispatch {
    onSaveMessageFlow: (messageFlow: MessageFlow.MessageFlow) => void,
    onImportMessageFlowFile: (file: File) => void,
    onNotSupportedFileTypeDropped: (file: File) => void,
}

interface OwnProps {
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({
        onSaveMessageFlow: Command.saveMessageFlow,
        onImportMessageFlowFile: Command.importMessageFlowFile,
        onNotSupportedFileTypeDropped: Command.notifyAboutNotSupportedFileType
    } as any, dispatch);
};

const CytoscapeContainer = connect<StateProps, PropsToDispatch, OwnProps>(CytoscapSelector.makeMapStateToPropsCytoscape, mapDispatchToProps, undefined, {pure: false})(Cytoscape as any);

export default translate()(CytoscapeContainer);