import {fromJS, Map, Record, List} from 'immutable';
import * as moment from 'moment';

export interface DomainEventType {
    message_name: string,
    uuid: string,
    payload: Map<string, any>,
    metadata: Map<string, any>,
    created_at: string
}

export class DomainEvent extends Record({
    message_name: "Unknown",
    uuid: "00000000-0000-0000-0000-00000000",
    payload: fromJS({}),
    metadata: fromJS({_position: 0}),
    created_at: moment().toISOString()
}) {
    constructor(data: DomainEventType) {
        super(data);

        this.messageName = this.messageName.bind(this);
        this.uuid = this.uuid.bind(this);
        this.payload = this.payload.bind(this);
        this.metadata = this.metadata.bind(this);
        this.createdAt = this.createdAt.bind(this);
        this.displayCreatedAt = this.displayCreatedAt.bind(this);
        this.streamPosition = this.streamPosition.bind(this);
    }

    messageName(): string {
        return this.get('message_name');
    }

    shortMessageName(len?: number): string {
        if(typeof len === 'undefined') {
            len = 40;
        }

        if(this.messageName().length > len) {
            let messageName = this.messageName();

            let parts = List(messageName.split('\\'));

            if(parts.size === 1) {
                parts = List(messageName.split('.'));
            }

            messageName = parts.last();

            if(messageName.length > len) {
                messageName = messageName.substr(0, len - 3) + '...';
            }

            return messageName;
        }

        return this.messageName();
    }

    uuid(): string {
        return this.get('uuid');
    }

    payload(): Map<string, any> {
        return fromJS(this.get('payload'));
    }

    metadata(): Map<string, any> {
        return fromJS(this.get('metadata'));
    }

    createdAt(): moment.Moment {
        return moment(this.get('created_at'));
    }

    displayCreatedAt(): string {
        //rm milliseconds and add UTc flag instead
        let createdAt = this.createdAt().toString().replace(/\.[0-9]+$/, 'Z');
        return (date => date.toLocaleString())(new Date(createdAt));
    }

    streamPosition(): number {
        return parseInt(this.metadata().get('_position', "0"));
    }
}
