import {State} from "../../reducer";
import { createSelector } from 'reselect';
import {PATH_MESSAGE_FLOW} from "../reducers";
import {MessageFlow} from "../model";

export const messageFlowSelector = (state: State, props: any) => state.get(PATH_MESSAGE_FLOW, MessageFlow.emptyMessageFlow());

export const makeGetMessageFlow = (): (state: State, props: any) => MessageFlow.MessageFlow => {
    return createSelector(
        [messageFlowSelector]as any,
        (messageFlow: MessageFlow.MessageFlow): MessageFlow.MessageFlow => messageFlow
    );
};

export const makeMapStateToPropsCytoscape = () => {
    const getMessageFlow = makeGetMessageFlow();

    return (state: State, props: any) => {
        return {
            messageFlow: getMessageFlow(state, props)
        };
    };
};