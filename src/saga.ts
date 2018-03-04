import {takeEvery,call} from "redux-saga/effects";
import {AT_SEND_HTTP_REQUEST, sendHttpRequestFlow} from "./api/WebData";
import {Command} from "./MessageFlow/actions";
import {importMessageFlowFileFlow} from "./MessageFlow/sagas";
import {Saga as ESSaga, EventStoreHttpApi} from "./EventStore/index";

export default function* rootSaga(esHttpApi: EventStoreHttpApi) {
    console.log('root saga started');
    yield [
      takeEvery(AT_SEND_HTTP_REQUEST, sendHttpRequestFlow as any),
      takeEvery(Command.CMD_IMPORT_MESSAGE_FLOW_FILE, importMessageFlowFileFlow),
      call(ESSaga.watchStreamsFlow, esHttpApi),
    ];
}
