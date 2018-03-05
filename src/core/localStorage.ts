import {List, Map} from "immutable";
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

        const data = JSON.parse(serializedState);

        const messageFlowData: ElementsDefinition = data.elements;

        return new MessageFlow.MessageFlow({elements: messageFlowData, watching: data.watching});
    } catch (err) {
        console.error(err);
        return MessageFlow.emptyMessageFlow();
    }
}

export const saveMessageFlow = (flow: MessageFlow.MessageFlow): void => {
    try {
        const serializedFlow = JSON.stringify({elements: flow.elements(), watching: flow.isWatching()});
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

        const watchersArr: {
            watcherId: string,
            watcherName: string,
            streams: any[] | List<EventStoreModel.Stream.StreamName>,
            filters: any[] | List<EventStoreModel.Filter.StreamFilterGroup>,
            recordedEvents: any[] | List<EventStoreModel.Event.DomainEvent>,
        }[] = JSON.parse(serializedWatchers);
        let watchersMap: Map<string, EventStoreModel.Watcher.Watcher> = Map({});

        //@TODO: Refactor to use a record factory
        watchersArr.forEach(watcherData => {
            watcherData.streams = List(watcherData.streams);
            watcherData.filters = List(watcherData.filters).map((filterGroupData: any) => {
                filterGroupData.filters = List(filterGroupData.filters).map(
                    (filterData: any) => new EventStoreModel.Filter.StreamFilter(filterData)
                )
                return new EventStoreModel.Filter.StreamFilterGroup(filterGroupData)
            }) as List<EventStoreModel.Filter.StreamFilterGroup>

            watcherData.recordedEvents = List(watcherData.recordedEvents).map((eventData: any) => {
                return new EventStoreModel.Event.DomainEvent(eventData)
            }) as List<EventStoreModel.Event.DomainEvent>;

            watchersMap = watchersMap.set(watcherData.watcherId, new EventStoreModel.Watcher.Watcher(watcherData as EventStoreModel.Watcher.WatcherType))
        });

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