import {Channel} from "redux-saga";
import {call, put} from "redux-saga/effects";
import {AxiosPromise, AxiosRequestConfig} from 'axios';
import {Action} from "redux";
import configuredAxios from "./ConfiguredAxios";
import {Action as Notify} from "../NotificationSystem";
import * as _ from 'lodash';

export const AT_SEND_HTTP_REQUEST = 'AT_SEND_HTTP_REQUEST';
export const AT_RESET_WEB_DATA = 'AT_RESET_WEB_DATA';

export interface WEB_DATA_NOT_ASKED {type: "notAsked", data?: undefined, msg?: undefined, errorCode?: undefined}
export interface WEB_DATA_LOADING {type: "loading", data?: undefined, msg?: undefined, errorCode?: undefined}
export interface WEB_DATA_FAILURE {type: "error", data?: undefined, msg: string, errorCode: number}
export interface WEB_DATA_SUCCESS<D> {type: "success", data: D, msg?: undefined, errorCode?: undefined}

export type WebData<D> = WEB_DATA_NOT_ASKED | WEB_DATA_LOADING | WEB_DATA_FAILURE | WEB_DATA_SUCCESS<D>;

export interface WebDataAction<D, TMeta> extends Action {webData: WebData<D>, metadata: TMeta}

export interface SendHttpRequest<TMeta> extends Action {request: AxiosRequestConfig, responseAction: string, metadata?: TMeta}
export function sendHttpRequest<TMeta> (request: AxiosRequestConfig, responseAction: string, metadata?: TMeta ): SendHttpRequest<TMeta> {
  let action = {
    type: AT_SEND_HTTP_REQUEST,
    request,
    responseAction,
  }

  if(metadata) {
    action["metadata"] = metadata;
  }

  return action;
}

export const isSuccess = <D>(webData: WebData<D>): boolean => webData.type === 'success';
export const isLoading = <D>(webData: WebData<D>): boolean => webData.type === 'loading';
export const isError = <D>(webData: WebData<D>): boolean => webData.type === 'error';

export interface ResetWebData extends Action {responseAction: string}
export function resetWebData ( responseAction: string ): ResetWebData  {
  return {
    type: AT_RESET_WEB_DATA,
    responseAction
  }
}

export interface ResponseAction<D, TMeta> extends Action {webData: WebData<D>, metadata: TMeta}
export function responseAction<D, TMeta> ( type: string, webData: WebData<D>, metadata: TMeta ): ResponseAction<D, TMeta> {
  return {
    type,
    webData,
    metadata
  }
}

export interface ErrorCodeWhitelist {
  errorCodeWhitelist?: number[]
}

// noinspection TypeScriptValidateTypes
export function* sendHttpRequestFlow<TMeta> ( action: SendHttpRequest<ErrorCodeWhitelist & TMeta>, chan?: Channel<Action> ) {

  yield tryPutOnChannel(responseAction( action.responseAction, { type: "loading" }, action.metadata ), chan );

  try {
    let data = yield call( fetchStatusWrapper, action.request);

    yield tryPutOnChannel( responseAction( action.responseAction, { type: "success", data: data }, action.metadata ), chan );
  } catch ( err ) {
    let msg = "Unknown Error";
    let code = 500;

    if ( typeof err === "string" ) {
      msg = err;
    } else {
      let error = err.error || { code: undefined, message: undefined };
      msg = error.message || msg;
      code = error.code || code;

    }

    const errMsg = "[" + code + "] " + msg;

    if(!action.metadata || !action.metadata.errorCodeWhitelist || !_.includes(action.metadata.errorCodeWhitelist, code)) {
        yield put(Notify.Command.error("Webdata error", errMsg));
    }

    yield tryPutOnChannel( responseAction( action.responseAction, { type: "error", msg: errMsg, errorCode: code}, action.metadata ), chan );
  }
}

export function fetchStatusWrapper ( request: AxiosRequestConfig ): AxiosPromise {
  return configuredAxios.request(request).then(response => {
    return isSuccessResponse(response.status)? response.data : Promise.reject(response.data);
  }, function (error) {
    if (error.response) {
      if(error.response.data && error.response.data.error) {
        return Promise.reject(error.response.data);
      }

      return Promise.reject({error: {
        code: error.response.status,
        message: error.response.data
      }});
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      return Promise.reject("Failed to send request: " + JSON.stringify(error.request));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject('Error: ' + error.message);
    }
  })
}

function isSuccessResponse(status: number): boolean
{
  return status >= 200 && status < 300;
}

function* tryPutOnChannel(action: Action, chan?: Channel<Action>) {
  if(chan) {
    yield put(chan, action);
  } else {
    yield put(action);
  }
}
