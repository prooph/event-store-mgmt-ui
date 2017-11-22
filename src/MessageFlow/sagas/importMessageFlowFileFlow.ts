import {call, put} from "redux-saga/effects";
import {Command} from "../actions";
import {fileGetContents} from "../../core/fileReader";
import {MessageFlow} from "../model";

export default function* (cmd: Command.ImportMessageFlowFile) {
    const fileContent = yield call(fileGetContents, cmd.file);

    try {
        const messageFlow: MessageFlow.MessageFlow = new MessageFlow.MessageFlow({
            elements: JSON.parse(fileContent)
        });
        yield put(Command.saveMessageFlow(messageFlow)) as any;
    } catch(err) {
        //@TODO show error in UI
        console.error(err);
    }
};