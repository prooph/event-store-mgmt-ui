import {call, put, select} from "redux-saga/effects";
import {Command} from "../actions";
import {fileGetContents} from "../../core/fileReader";
import {MessageFlow} from "../model";
import {Command as NotificationsCmd} from "../../NotificationSystem/actions";
import {Cytoscape} from "../selectors";

export default function* (cmd: Command.ImportMessageFlowFile) {
    const fileContent = yield call(fileGetContents, cmd.file);

    try {
        const elements = JSON.parse(fileContent);

        const service = elements.project;

        const messageFlow: MessageFlow.MessageFlow = yield select(Cytoscape.makeGetMessageFlow() as any);

        const mergedFlow = messageFlow.mergeElements(elements, service);

        yield put(Command.saveMessageFlow(mergedFlow)) as any;
    } catch(err) {
        yield put(NotificationsCmd.error("Failed to read file content", ""+err));
    }
};