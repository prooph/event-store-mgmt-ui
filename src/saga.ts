import {takeEvery} from "redux-saga/effects";
import {AT_SEND_HTTP_REQUEST, sendHttpRequestFlow} from "./api/WebData";

export default function* rootSaga() {
    console.log('root saga started');
    yield [
      takeEvery(AT_SEND_HTTP_REQUEST, sendHttpRequestFlow as any),
    ];
}
