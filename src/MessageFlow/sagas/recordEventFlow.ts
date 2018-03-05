import {put, select} from "redux-saga/effects";
import {Command} from "../actions";
import {Actions as ESActions} from "../../EventStore/index";
import {Cytoscape} from "../selectors";
import {MessageFlow} from "../model";

export default function* recordEventFlow(action: ESActions.Cmd.RecordWatcherEvent) {
    const messageFlow: MessageFlow.MessageFlow = yield select(Cytoscape.messageFlowSelector);

    if(messageFlow.isWatching()) {
        yield put(Command.recordEvent(action.event));
    }
}