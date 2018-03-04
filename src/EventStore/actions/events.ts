import {Action} from "redux";
import {Event, Stream} from "../model";

export const EVT_NEW_DOMAIN_EVENT_RECEIVED = 'EVT_NEW_DOMAIN_EVENT_RECEIVED';

export interface NewDomainEventReceived extends Action {
    event: Event.DomainEvent,
    streamName: Stream.StreamName,
}

export function newDomainEventReceived(streamName: Stream.StreamName, event: Event.DomainEvent): NewDomainEventReceived {
    return {
        event,
        streamName,
        type: EVT_NEW_DOMAIN_EVENT_RECEIVED,
    }
}