import {takeEvery,call} from "redux-saga/effects";
import {AT_SEND_HTTP_REQUEST, sendHttpRequestFlow} from "./api/WebData";
import {Command} from "./MessageFlow/actions";
import {importMessageFlowFileFlow, recordEventFlow} from "./MessageFlow/sagas";
import {Saga as ESSaga, EventStoreHttpApi} from "./EventStore/index";
import {Actions as ESActions} from "./EventStore/index";
import {History} from "history";


export default function* rootSaga(esHttpApi: EventStoreHttpApi, history: History) {
    console.log('root saga started');
    yield [
      takeEvery(AT_SEND_HTTP_REQUEST, sendHttpRequestFlow as any),
      takeEvery(Command.CMD_IMPORT_MESSAGE_FLOW_FILE, importMessageFlowFileFlow),
      takeEvery(ESActions.Cmd.RECORD_WATCHER_EVENT, recordEventFlow),
      call(ESSaga.watchStreamsFlow, esHttpApi, history),
    ];
}
