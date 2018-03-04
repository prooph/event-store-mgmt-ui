import {State} from "../../reducer";
import {Command} from "../actions";
import {List, fromJS} from "immutable";
import {NotificationModel} from "../model";

export function applyNotify(state: State, action: Command.Notify): State {
    let messages: List<NotificationModel.Message> = state.get("messages", fromJS([])) as List<NotificationModel.Message>;

    const idx = messages.findIndex(lMsg => lMsg.uid() === action.message.uid());

    if(idx > -1) {
        if(action.message.handled()) {
            messages = messages.remove(idx);
        } else {
            messages = messages.set(idx, action.message);
        }
    } else {
        messages = messages.push(action.message);
    }

    return state.set("messages", messages);
}