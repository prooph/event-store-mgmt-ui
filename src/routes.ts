import {Model as EventStoreModel} from "./EventStore/index";

export const rootPath = '/';
export const overviewPath = '/overview';
export const eventStorePath = {
    route: '/event-store/:streamName?',
    link: (streamName: EventStoreModel.Stream.StreamName | null) => (streamName? "/event-store/"+streamName : "/event-store")
};
export const watchersPath = {
    route: '/watchers/:watcherId?',
    link: (watcherId: EventStoreModel.Watcher.Id | null) => (watcherId? "/watchers/"+watcherId : "/watchers")
};
export const messageFlowPath = '/message-flow';
