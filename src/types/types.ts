import { Dispatch as ReduxDispatch } from 'redux';

import { State } from '../reducer';

export type Dispatch = ReduxDispatch<State>;