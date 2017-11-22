import {takeEvery} from "redux-saga/effects";
import {AT_SEND_HTTP_REQUEST, sendHttpRequestFlow} from "./api/WebData";
import {Command} from "./MessageFlow/actions";
import {importMessageFlowFileFlow} from "./MessageFlow/sagas";

export default function* rootSaga() {
    console.log('root saga started');
    yield [
      takeEvery(AT_SEND_HTTP_REQUEST, sendHttpRequestFlow as any),
      takeEvery(Command.CMD_IMPORT_MESSAGE_FLOW_FILE, importMessageFlowFileFlow),
    ];
}
