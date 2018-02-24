import {StreamName} from "./EventStore/model/Stream";

export const rootPath = '/';
export const overviewPath = '/overview';
export const eventStorePath = {
    route: '/event-store/:streamName?',
    link: (streamName: StreamName | null) => (streamName? "/event-store/"+streamName : "/event-store")
};
export const messageFlowPath = '/message-flow';
