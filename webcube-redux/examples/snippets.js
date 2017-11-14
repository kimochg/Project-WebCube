/* eslint-disable no-unused-vars, import/order, react/prefer-stateless-function, react/no-multi-comp, import/first, import/no-duplicates, no-duplicate-imports, no-redeclare, react/jsx-filename-extension */

// ============================================================================
// app/entrypointOne/main/index.jsx
// ============================================================================
import React, { PureComponent } from 'react';

import { App as FeatureOne } from '../featureOne';
import { App as FeatureTwo } from '../featureTwo';
import { App as FeatureThree } from '../featureThree';

// @createApp({
//   // ...
// })
class BigApp extends PureComponent {
  render() {
    return (
      <div>
        <FeatureOne /> {/* Sub App */}
        <FeatureTwo /> {/* Sub App */}
        <FeatureThree /> {/* Sub App */}
      </div>
    );
  }
}
// export default BigApp;

// ============================================================================
// app/entrypointOne/featureOne/index.jsx
// ============================================================================
import React, { PureComponent } from 'react';
import { createApp } from 'webcube-redux';
import { reducers as notifications, Notify } from 'webcube-redux/notify';
import { middleware as loading, Loading } from 'webcube-redux/loading';
import { middleware as track } from 'webcube-redux/track';
import bugSnag from 'webcube-redux/track/bugSnag';
import googleAnalytics from 'webcube-redux/track/googleAnalytics';
import { middleware as fetchMiddleware } from 'webcube-redux/remote/fetch';
import { middleware as axiosMiddleware } from 'webcube-redux/remote/axios';

import FeatureFour from '../featureFour';
import {
  reducers as reducersForOne,
  epics as epicsForOne,
} from './reducers/one';
import { reducers as reducersForTwo } from './reducers/two';
import ContainerOne from './containers/One';
import ContainerTwo from './containers/Two';

// Sub App
@createApp({
  // same as combineReducers
  reducers: {
    // business logic
    reducersForOne,
    reducersForTwo,
    // ...
    // built-in utilities
    // redux-debounced
    // ...
    // optional utilities
    notifications,
    // redux-undo
    // redux-form
    // ...
  },
  // optional
  // same as topologically-combine-reducers
  reducerDeps: {
    reducersForOne: [reducersForTwo],
    reducersForTwo: [],
  },
  // optional
  // redux-observable
  epics: [...epicsForOne],
  // optional
  // react-router
  enableRouter: false,
  // optional
  // redux-immutable + ...
  enableImmutableJS: false,
  // optional
  // redux-persist
  enablePersist: false,
  // optional
  preloadedState: {
    // ...
  },
  // optional
  middlewares: [
    // built-in utilities
    // redux-thunk
    // redux-promise-middleware
    // redux-observable
    // redux-logger
    // redux-immutable-state-invariant
    // react-router
    // ...
    // optional utilities
    fetchMiddleware(),
    axiosMiddleware(),
    loading({
      enableBlock: true,
    }),
    track({
      service: bugSnag,
      // ...
    }),
    track({
      service: googleAnalytics,
      // ...
    }),
    // ...
  ],
  // optional
  enhancers: [
    //
  ],
})
class FeatureOne extends PureComponent {
  render() {
    return (
      <div>
        <Loading>
          <FeatureFour /> {/* Sub App */}
          <ContainerOne />
          <ContainerTwo />
        </Loading>
        <Notify />
      </div>
    );
  }
}
export const App = FeatureOne;

// ============================================================================
// app/entrypointOne/featureOne/containers/One.jsx
// ============================================================================
import { connect } from 'webcube-redux';

import { actions as actionCreatorsForOne } from '../reducers/one';
import * as actionCreatorsForTwo from '../actions/two';
import DumbComponentOne from '../components/One';
import DumbComponentTwo from '../components/Two';

@connect({
  // same as reselect's createSelector
  selectors: [
    state => state.value1,
    (state, props) => state.value2 + props.value2,
    (value1, value2) => ({
      total: value1 + value2,
    }),
  ],
  // with bindActionCreators
  actions: {
    ...actionCreatorsForOne,
    ...actionCreatorsForTwo,
  },
})
class SmartComponentOne extends PureComponent {
  render() {
    return (
      <div>
        <DumbComponentOne />
        <DumbComponentTwo />
      </div>
    );
  }
}
// export default SmartComponentOne;

// ============================================================================
// app/entrypointOne/featureOne/reducers/one.js
// ============================================================================
import { reducers as fetchReducers } from 'webcube-redux/remote/fetch';
import update from 'immutability-helper';

import hub from '../hub';

// optional
// no need to explicitly add all actions
hub.add({
  // optional namespace
  FEATURE_ONE: {
    // optional namespace
    COUNTER: {
      // FSA
      // {
      //   type: 'FEATURE_ONE/COUNTER/INCREMENT',
      //   payload: { amount: 1 },
      //   meta: { key: 'value', amount: 1 }
      // }
      INCREMENT: [
        // array form or function form
        // payloadCreator
        amount => ({ amount: parseInt(amount, 10) }),
        // metaCreator
        amount => ({ key: 'value', amount }),
      ],
      // payloadCreator
      DECREMENT: amount => ({ amount: parseInt(amount, 10) }),
    },
  },
});

// async actions

// redux-thunk
hub.add('ASYNC_ACTION_ONE', dispatch => {
  setTimeout(() => {
    dispatch(actions.featureA.asyncActionOneDone());
  }, 1000);
});

// redux-promise-middleware
hub.add(
  'ASYNC_ACTION_TWO',
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000);
  }),
);

// webcube-redux/remote/fetch
hub.add({
  // optional namespace
  FEATURE_ONE: {
    ASYNC_ACTION_THREE: {
      // non-FSA
      url: 'http://www.mydomain.com/users/1/',
      query: {
        mobile: true,
      },
      jwtToken: '...',
      headers: {},
      timeout: 10000,
    },
  },
});

// redux-observable
export const epics = [
  action$ =>
    action$
      .ofType('ASYNC_ACTION_FOUR')
      .delay(1000)
      .mapTo({ type: 'ASYNC_ACTION_FOUR_DONE' }),
  action$ =>
    action$
      .ofType('ASYNC_ACTION_FIVE')
      .mergeMap(
        action =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
            }, action.payload.delay);
          }),
      )
      .map(response => actions.asyncActionFiveDone(response)),
];

// bundle or duck
export const { reducers, actions, types, initialState } = hub.handle(
  {
    // optional namespace
    FEATURE_ONE: {
      // optional namespace
      COUNTER: {
        // combine actions
        [['INCREMENT', 'DECREMENT']]: (state, action) =>
          update(state, {
            counter: { $set: state.counter + action.payload.amount },
          }),
        // automatically added to hub
        RESET: () => ({
          counter: 0,
        }),
      },
      // automatically added to hub
      ACTION_ONE: state =>
        update(state, {
          //
        }),
      // automatically added to hub
      ACTION_TWO: state =>
        update(state, {
          //
        }),
      // automatically handle fetch actions
      ...fetchReducers('ASYNC_ACTION_THREE'),
      // or manually handle fetch actions
      // automatically dispatched by webcube-redux/remote/fetch
      ASYNC_ACTION_THREE_PENDING: state =>
        update(state, {
          //
        }),
      // automatically dispatched by webcube-redux/remote/fetch
      ASYNC_ACTION_THREE_SUCESS: state =>
        update(state, {
          //
        }),
      // automatically dispatched by webcube-redux/remote/fetch
      ASYNC_ACTION_THREE_FAIL: state =>
        update(state, {
          //
        }),
    },
    // automatically added to hub
    ASYNC_ACTION_ONE_DONE: state =>
      update(state, {
        //
      }),
    // automatically dispatched by redux-promise-middleware
    ASYNC_ACTION_TWO_PENDING: state =>
      update(state, {
        //
      }),
    // automatically dispatched by redux-promise-middleware
    ASYNC_ACTION_TWO_FULFILLED: state =>
      update(state, {
        //
      }),
    // automatically dispatched by redux-promise-middleware
    ASYNC_ACTION_TWO_REJECTED: state =>
      update(state, {
        //
      }),
    // automatically added to hub
    ASYNC_ACTION_FOUR_DONE: state =>
      update(state, {
        //
      }),
    // automatically added to hub
    ASYNC_ACTION_FOUR_FIVE: state =>
      update(state, {
        //
      }),
  },
  // initial state
  // automatically freeze in development environment
  {
    counter: 0,
  },
);

// ============================================================================
// app/entrypointOne/featureOne/hub.js
// ============================================================================
import { createHub } from 'webcube-redux';

export default createHub();

/* eslint-enable no-unused-vars, import/order, react/prefer-stateless-function, react/no-multi-comp, import/first, import/no-duplicates, no-duplicate-imports, no-redeclare, react/jsx-filename-extension */
