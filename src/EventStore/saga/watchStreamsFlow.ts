import {Action} from "redux";
import {Map, List} from "immutable";
import {delay, channel, Channel, Task} from 'redux-saga'
import {call, cancel, fork, take, put, ForkEffect, CallEffect, TakeEffect, select} from 'redux-saga/effects'
import {WebData} from "../../api";
import {Cmd, Query, Evt} from "../actions";
import {EventStore, Watcher, Event, Stream} from "../model";
import {mapStreamResponse} from "../reducers";
import {WatchersSelector} from "../selectors";
import {Action as Notify, NotificationModel} from "../../NotificationSystem";
import {History} from "history";
import * as Routes from "../../routes";

function* watchStream(streamName: Stream.StreamName, httpApi: EventStore.EventStoreHttpApi, chan: Channel<Evt.NewDomainEventReceived>) {
    let latestEvent: Event.DomainEvent = yield call(fetchLatestEvent, streamName, httpApi);

    while (true) {
        const newestEvents: EventStore.StreamResponse = yield call(fetchNewerEvents, streamName, httpApi, latestEvent);

        if(newestEvents) {
            for(let i = 0, len = newestEvents.events().size; i < len; i++) {
                const event = newestEvents.events().get(i);
                yield put(chan, Evt.newDomainEventReceived(streamName, event))
                latestEvent = event;
            }
        }

        yield call(delay, 2000);
    }
}

function* handleEvents(history: History, chan: Channel<Evt.NewDomainEventReceived>) {
    while(true) {
        const action = yield take(chan);

        const watcherList: Map<string, Watcher.Watcher> = yield select(WatchersSelector.watchersSelector);

        const watcherIds = List(watcherList.keys());

        for(let i = 0, len = watcherIds.size;i < len; i++) {
            const watcher = watcherList.get(watcherIds.get(i));

            if(watcher.isWatching() && watcher.isInterestedIn(action.streamName, action.event)) {
                yield put(Cmd.recordWatcherEvent(watcher.id(), action.event));
                //@TODO: check watcher config if notification should be triggered

                const notification = new NotificationModel.Message({
                    title: `Watcher: ${watcher.name()}`,
                    message: action.event.shortMessageName(),
                    autoDismiss: 0,
                    action: {
                        label: 'Details',
                        callback: () => {
                            history.push(Routes.watchersEventDetailsPath.link(watcher.id(), action.event.uuid()))
                        }
                    }
                })
                yield put(Notify.Command.notify(notification));
            }
        }
    }
}

export default function* watchStreamsFlow(httpApi: EventStore.EventStoreHttpApi, history: History) {

    const chan = yield call(channel);
    let watcherTaskList = Map({});
    let activeWatcherStreams = yield call(determineActiveWatcherStreams);

    for(let i = 0, len = activeWatcherStreams.size; i < len; i++) {
        const activeStream = activeWatcherStreams.get(i);

        const task = yield fork(watchStream, activeStream, httpApi, chan);

        watcherTaskList = watcherTaskList.set(activeStream, task);
    }

    yield fork(handleEvents, history, chan);

    while (true) {
        const action = yield take([Cmd.REMOVE_STREAM_WATCHER, Cmd.TOGGLE_STREAM_WATCHER]);

        activeWatcherStreams = yield call(determineActiveWatcherStreams);
        for(let i = 0, len = activeWatcherStreams.size; i < len; i++) {
            const activeStream = activeWatcherStreams.get(i);

            if(!watcherTaskList.has(activeStream)) {
                const task = yield fork(watchStream, activeStream, httpApi, chan);
                watcherTaskList = watcherTaskList.set(activeStream, task);
            }
        }
        let cleanedWatcherTaskList = Map({});
        watcherTaskList.forEach((task: Task, streamName: Stream.StreamName) => {
            if(!activeWatcherStreams.contains(streamName)) {
                task.cancel();
            } else {
                cleanedWatcherTaskList = cleanedWatcherTaskList.set(streamName, task)
            }
        });
        watcherTaskList = cleanedWatcherTaskList;
    }


}

function* determineActiveWatcherStreams(): List<Stream.StreamName> | IterableIterator<any> {
    const watcherList: Map<string, Watcher.Watcher> = yield select(WatchersSelector.watchersSelector);
    let streamList = List<Stream.StreamName>();


    watcherList.forEach((watcher) => {
        if(watcher.isWatching()) {
            watcher.streams().forEach((streamName) => {
                if(!streamList.contains(streamName)) {
                    streamList = streamList.push(streamName)
                }
            })
        }
    })

    return streamList;
}

function* fetchLatestEvent(
    streamName: Stream.StreamName,
    httpApi: EventStore.EventStoreHttpApi): Event.DomainEvent
    | null
    | IterableIterator<ForkEffect | CallEffect | TakeEffect>
{
    const requestChan = yield call(channel);

    yield fork(WebData.sendHttpRequestFlow, Query.getLatestStreamEvents(httpApi, streamName, 1), requestChan);

    let action: WebData.ResponseAction<EventStore.StreamResponseType, undefined> = yield take(requestChan);

    if(WebData.isLoading(action.webData)) {
        action = yield take(requestChan);
    }

    if(WebData.isError(action.webData)) {
        return null;
    } else {
        const streamResponse = mapStreamResponse(action.webData.data);
        return streamResponse.events().first();
    }
}

function* fetchNewerEvents(streamName: Stream.StreamName,
                           httpApi: EventStore.EventStoreHttpApi,
                           event: Event.DomainEvent): EventStore.StreamResponse
    | null
    | IterableIterator<ForkEffect | CallEffect | TakeEffect>
{
    const requestChan = yield call(channel);

    yield fork(WebData.sendHttpRequestFlow, Query.getNewerStreamEvents(httpApi, streamName, event), requestChan);

    let action: WebData.ResponseAction<EventStore.StreamResponseType, undefined> = yield take(requestChan);

    if(WebData.isLoading(action.webData)) {
        action = yield take(requestChan);
    }

    if(WebData.isError(action.webData)) {
        return null;
    } else {
        return mapStreamResponse(action.webData.data);
    }
}
