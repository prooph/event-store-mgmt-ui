import {Record} from 'immutable';
const uuid4 = require("uuid/v4");

export interface MessageType {
    title?: string | null,
    message?: string | null,
    level?: "success" | "error" | "warning" | "info",
    position?: "tr" | "tl" | "tc" | "br" | "bl" | "bc",
    autoDismiss?: number,
    dismissible?: boolean,
    handled?: boolean,
    uid?: string,
}

export class Message extends Record({
    title: null,
    message: null,
    level: "info",
    position: "bl",
    autoDismiss: 5,
    dismissible: true,
    handled: false,
    uid: uuid4()
}) {
    constructor(data: MessageType) {
        super(data);
        this.title = this.title.bind(this);
        this.message = this.message.bind(this);
        this.level = this.level.bind(this);
        this.position = this.position.bind(this);
        this.autoDismiss = this.autoDismiss.bind(this);
        this.dismissible = this.dismissible.bind(this);
        this.handled = this.handled.bind(this);
        this.uid = this.uid.bind(this);
        this.markAsHandled = this.markAsHandled.bind(this);
    }

    title(): string | null {
        return this.get("title");
    }

    message(): string | null {
        return this.get("message");
    }

    level(): string {
        return this.get("level")
    }

    position(): string {
        return this.get("position")
    }

    autoDismiss(): number {
        return this.get("autoDismiss")
    }

    dismissible(): boolean {
        return this.get("dismissible");
    }

    handled(): boolean {
        return this.get("handled");
    }

    uid(): string {
        return this.get("uid");
    }

    markAsHandled(): Message {
        return this.set("handled", true) as Message;
    }
}