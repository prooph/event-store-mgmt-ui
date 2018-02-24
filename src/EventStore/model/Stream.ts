import {fromJS, List, Record} from "immutable";
import {DomainEvent} from "./DomainEvent";

export type StreamName = string;

export interface StreamType {
    streamName: StreamName,
    loading?: boolean,
    events?: List<DomainEvent>
}

export class Stream extends Record({
    streamName: 'unknown',
    loading: false,
    events: fromJS([])
}) {
    constructor(data: StreamType) {
        super(data);

        this.name = this.name.bind(this);
        this.isLoading = this.isLoading.bind(this);
        this.events =  this.events.bind(this);
    }

    name(): StreamName {
        return this.get('streamName')
    }

    isLoading(): boolean {
        return this.get('loading')
    }

    events(): List<DomainEvent> {
        return this.get('events')
    }

    mergeEvents(events: List<DomainEvent>): Stream {
        let thisEvents = this.events();

        events.forEach(event => {
            if(!thisEvents.find(lEvent => lEvent.uuid() === event.uuid())) {
                thisEvents = thisEvents.push(event)
            }
        })

        thisEvents = thisEvents.sort((a, b) => {
            if(a.streamPosition() === b.streamPosition()) {
                return 0;
            }

            //Events are sorted in reverse order
            return a.streamPosition() < b.streamPosition()? 1 : -1;
        }) as List<DomainEvent>

        return this.set('events', thisEvents) as Stream;
    }
}
