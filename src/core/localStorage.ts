import {Map} from "immutable";
import {MessageFlow} from "../MessageFlow/model";
import {ElementsDefinition} from "cytoscape";
import {Model as EventStoreModel} from '../EventStore/index';

const KEY_MESSAGE_FLOW = 'messageflow';
const KEY_WATCHERS = 'watchers';


export const loadMessageFlow = (): MessageFlow.MessageFlow => {
    try {
        const serializedState = localStorage.getItem(KEY_MESSAGE_FLOW);

        if(serializedState ===  null) {
            return MessageFlow.emptyMessageFlow();
        }

        const messageFlowData: ElementsDefinition = JSON.parse(serializedState);

        return new MessageFlow.MessageFlow({elements: messageFlowData});
    } catch (err) {
        console.error(err);
        return MessageFlow.emptyMessageFlow();
    }
}

export const saveMessageFlow = (flow: MessageFlow.MessageFlow): void => {
    try {
        const serializedFlow = JSON.stringify(flow.elements());
        localStorage.setItem(KEY_MESSAGE_FLOW, serializedFlow);
    } catch (err) {
        console.error(err);
        //@TODO: Better handling for write errors
    }
}

export const loadWatchers = (): Map<string, EventStoreModel.Watcher.Watcher> => {
    try {
        const serializedWatchers = localStorage.getItem(KEY_WATCHERS);
        if(serializedWatchers === null) {
            return Map({});
        }

        const watchersArr: EventStoreModel.Watcher.WatcherType[] = JSON.parse(serializedWatchers);
        let watchersMap: Map<string, EventStoreModel.Watcher.Watcher> = Map({});

        watchersArr.forEach(watcherData => watchersMap = watchersMap.set(
            watcherData.watcherId,
            new EventStoreModel.Watcher.Watcher(watcherData)
        ));

        return watchersMap;
    } catch (err) {
        return Map({})
    }
}

export const saveWatchers = (watchers: Map<string, EventStoreModel.Watcher.Watcher>): void => {
    try {
        const serializedWatchers = JSON.stringify(watchers.map(watcher => watcher.toJS()).toArray());
        localStorage.setItem(KEY_WATCHERS, serializedWatchers);
    } catch (err) {
        console.log(err);
        //@TODO: Better handling for write errors
    }
}