# Redux Cube

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/redux-cube.svg
[nodei-image]: https://nodei.co/npm/redux-cube.png?downloads=true
[npm-url]: https://npmjs.org/package/redux-cube
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/redux-cube/master.svg
[travis-url]: https://travis-ci.org/dexteryy/redux-cube
[dep-image]: https://david-dm.org/dexteryy/redux-cube.svg
[dep-url]: https://david-dm.org/dexteryy/redux-cube
-->

![iOS Safari](https://github.com/alrra/browser-logos/raw/master/src/safari-ios/safari-ios_48x48.png) | ![Android WebView](https://github.com/alrra/browser-logos/raw/master/src/android/android_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- |
iOS 7+ ✔ | Android 4+ ✔ | 11+ ✔ |

Redux Cube is a app state manager. It's a set of wrappers which simplify the use of Redux and its whole ecosystem, reduce boilerplate, and provide many features (Sub App, Reducer Bundle, ...)

Slides: [Introduction to Redux Cube](https://app.cubemage.cn/slides/intro-to-redux-cube/index.html)

```
npm install --save-dev redux-cube
```


<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
<!-- code_chunk_output -->

* [Redux Cube](#redux-cube)
	* [Examples](#examples)
	* [Overview](#overview)
		* [Action Type](#action-type)
		* [Action Creators](#action-creators)
		* [Reducers](#reducers)
		* [Ducks Modular / Reducer Bundle](#ducks-modular-reducer-bundle)
		* [Sub-Apps](#sub-apps)
		* [Connect to React Components](#connect-to-react-components)
		* [Async Action Creators](#async-action-creators)
		* [Immutable](#immutable)
	* [Modules](#modules)
		* [redux-cube](#redux-cube-1)
		* [redux-cube/lib/plugins](#redux-cubelibplugins)
		* [redux-cube/lib/helpers](#redux-cubelibhelpers)
	* [Redux Ecosystem](#redux-ecosystem)
		* [Built-in Wrapped Packages](#built-in-wrapped-packages)
		* [Optional Built-in Wrapped Packages](#optional-built-in-wrapped-packages)
		* [Non-wrapped Recommended Packages](#non-wrapped-recommended-packages)

<!-- /code_chunk_output -->


## Examples

* "react-redux-app" and "react-redux-router-app" in [Initial Webcube Examples](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-initial-structure)
* [Webcube's TodoMVC Example](https://github.com/dexteryy/Project-WebCube/tree/master/examples/webcube-todo-app/)

## Overview

![](overview.png)

### Action Type

```js
// sampleApp/hub.js
import { createHub } from 'redux-cube';

export default createHub();
```

```js
// sampleApp/actions/sample.js
import hub from '../hub';

export const { actions, types } = hub.add('NAMESPACE/MORE_NAMESPACE/MY_TYPE');
```

```js
export const { actions, types } = hub.add('namespace.moreNamespace.myType');
```

```js
export const { actions, types } = hub.add({
  NAMESPACE: {
    MORE_NAMESPACE: {
      MY_TYPE: true
    },
  },
});
```

```js
export const { actions, types } = hub.add({
  namespace: {
    moreNamespace: {
      myType: true
    },
  },
});
```

### Action Creators

```js
export const { actions, types } = hub.add('NAMESPACE/MORE_NAMESPACE/MY_TYPE', payloadCreator, metaCreator);
```

```js
export const { actions, types } = hub.add({
  namespace: {
    moreNamespace: {
      myType: true,
      myType2: payloadCreator,
      myType3: [payloadCreator, metaCreator],
      myType4: [
        (a, b) => ({ data: a + b }),
        (a, b) => ({ a, b }),
      ],
      myType5: {
        [hub.ACTION_CREATOR]: actionCreator,
      },
    },
  },
});
```

Call the action creator (default payloadCreator)

```js
actions.namespace.moreNamespace.myType(10);
// or
types['NAMESPACE/MORE_NAMESPACE/MY_TYPE'](10);
```

Result:

```js
{
  "type": "NAMESPACE/MORE_NAMESPACE/MY_TYPE",
  "payload": 10
}
```

Call the action creator (custom payloadCreator and metaCreator)

```js
// call action creator
actions.namespace.moreNamespace.myType4(1, 10);
// or
types['NAMESPACE/MORE_NAMESPACE/MY_TYPE_4'](1, 10);
```

Result:

```js
{
  "type": "NAMESPACE/MORE_NAMESPACE/MY_TYPE_4",
  "payload": { data: 11 },
  "meta": { "a": 1, "b": 10 }
}
```

### Reducers

```js
// sampleApp/reducers/sample.js
import hub from '../hub';

export const { reducer } = hub.handle({
  namespace: {
    moreNamespace: {
      myType: (state, { payload, meta }) => newState,
    },
  },
  anotherType: (state, { payload, meta }) => newState,
}, initialStateForASliceOfStore);
```

### Ducks Modular / Reducer Bundle

Original Ducks Modular:

```js
// widgets.js

// Action Types

// Action Creators

// Side Effects
// e.g. thunks, epics, etc

// Reducer
```

Redux Cube's Reducer Bundle:

```js
// sampleApp/actions/sample.js
import hub from '../hub';

export const { actions, types } = hub.add({
  myType1: payloadCreator,
  myType2: payloadCreator,
});
```

```js
// sampleApp/reducers/sample.js
import { deepMerge } from 'redux-cube/lib/helpers';
import hub from '../hub';
import { types, actions } from '../actions/sample';

const { reducer, types: handledTypes, actions: handledActions } = hub.handle(
  myType1: (state, { payload, meta }) => newState,
  myType3: (state, { payload, meta }) => newState,
  myType4: (state, { payload, meta }) => newState,
}, initialStateForASliceOfStore);

const epics = [
  action$ =>
    action$.pipe(/* ... */)
];

deepMerge(actions, handledActions);
Object.assign(types, handledTypes);

export { reducer, actions, types, epics };
```

```js
import { actions, types } from '../reducers/sample';

console.log(actions);

// {
//   myType1: actionCreator,
//   myType2: actionCreator,
//   myType3: actionCreator,
//   myType4: actionCreator,
// }

console.log(types);

// {
//   MY_TYPE_1: actionCreator,
//   MY_TYPE_2: actionCreator,
//   MY_TYPE_3: actionCreator,
//   MY_TYPE_4: actionCreator,
// }
```

### Sub-Apps

```js
import React, { Component } from 'react';
import localforage from 'localforage';
import withPersist from 'redux-cube/lib/plugins/withPersist';
import { createApp } from 'redux-cube';

import { reducer as sampleReducer, epics } from './reducers/sample';
import { reducer as sample2Reducer, epics } from './reducers/sample2';
import Sample from './containers/Sample';

@createApp(withPersist({
  reducers: {
    items: sampleReducer,
    sample2: {
      data: sample2Reducer,
    },
  },
  epics,
  preloadedState: typeof window !== 'undefined' && window._preloadSampleData,
  devToolsOptions: { name: 'SampleApp' },
  persistStorage: localforage,
  persistKey: 'sampleRoot2',
}))
class SampleApp extends Component {
  render() {
    return <Sample />;
  }
}

export const App = SampleApp;
```

```js
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import withRouter from 'redux-cube/lib/plugins/withRouter';
import { createApp } from 'redux-cube';
import { App as TodoApp } from '../todo-app/main';

const JediTodoApp = () => (
  <TodoApp
    title="Jedi Todo"
    routePath="/jedi-todo"
    appConfig={{
      persistKey: 'jediTodoRoot',
      devToolsOptions: { name: 'JediTodoApp' },
      preloadedState:
        typeof window !== 'undefined' && window._preloadJediTodoData,
    }}
  />
);
const SithTodoApp = () => (
  <TodoApp
    title="Sith Todo"
    routePath="/sith-todo"
    appConfig={{
      persistKey: 'sithTodoRoot',
      devToolsOptions: { name: 'SithTodoApp' },
      preloadedState:
        typeof window !== 'undefined' && window._preloadSithTodoData,
    }}
  />
);
```

```js
@createApp(withRouter({
  supportHtml5History: isDynamicUrl(),
  devToolsOptions: { name: 'EntryApp' },
}))
class EntryApp extends Component {
  render() {
    const TodoApps = () => (
      <div>
       <JediTodoApp />
       <SithTodoApp />
      </div>
    );
    const JumpToDefault = () => <Redirect to="jedi-todo/" />;
    return (
      <Switch>
        <Route path="/" exact={true} render={JumpToDefault} />
        <Route path="/" render={TodoApps} />
      </Switch>
    );
  }
}

export const App = EntryApp;
```

### Connect to React Components

```js
import { connect } from 'redux-cube';
import { actions as todoActions } from '../reducers/todo';

@connect({
  select: {
    todo: {
     input: true,
     items: true,
    },
  },
  transform: (input, items) => ({
    input,
    items,
    count: items.filter(item => !item.isCompleted).length,
  }),
 actions: todoActions,
})
export default class Main extends PureComponent {
  @autobind
  handleInputChange(content) {
   this.props.actions.todo.changeInput(content);
  }
  render() {
    const { input, items, count } = this.props;
```

### Async Action Creators

* [redux-thunk](https://www.npmjs.com/package/redux-thunk)
* [redux-promise-middleware](https://www.npmjs.com/package/redux-promise-middleware)
* [redux-debounced](https://www.npmjs.com/package/redux-debounced)
* [redux-observable](https://www.npmjs.com/package/redux-observable)

[hifetch](https://www.npmjs.com/package/hifetch) + [redux-promise-middleware](https://www.npmjs.com/package/redux-promise-middleware) + [redux-thunk](https://www.npmjs.com/package/redux-thunk):

```js
import { reset } from 'redux-form';
import hifetch from 'hifetch';
import hub from '../hub';

export const { actions, types } = hub.add({
  users: {
    fetchAll: () =>
      hifetch({
        url: '/v1/users/',
      }).send(),

    toAdd: {
      [hub.ACTION_CREATOR]: (userId, userData) => dispatch =>
        dispatch(
          actions.users.save(userId, userData, {
            success(result) {
              dispatch(reset('userInfos'));
              return result;
            },
          }),
        ),
    },

    add: [
      (userId, userData, opt) =>
        hifetch({
          url: `/v1/users/${userId}`,
          method: 'put',
          data: userData,
          ...opt,
        }).send(),
      userId => ({
        userId,
      }),
    ],

    edit: [
      (userId, userData) =>
        hifetch({
          url: `/v1/users/${userId}`,
          method: 'post',
          data: userData,
        }).send(),
      userId => ({
        userId,
      }),
    ],

    delete: [
      userId =>
        hifetch({
          url: `/v1/users/${userId}`,
          method: 'delete',
        }).send(),
      userId => ({
        userId,
      }),
    ],
  },
});
```

```js
import { deepMerge } from 'redux-cube/lib/helpers';
import Immutable from 'immutable';
import hub from '../hub';
import { actions as existActions, types as existTypes } from '../actions/users';

const { reducer, actions, types } = hub.handle(
  {
    users: {
      fetchAllPending: state => state.set('isLoading', true),
      fetchAllFulfilled: (state, { payload }) =>
        state.mergeDeep({
          users: Immutable.fromJS(payload.data),
          isLoading: false,
        }),
      fetchAllRejected: state => state.set('isLoading', false),
      addPending: state => state.set('isLoading', true),
      // ...
      updateRejected: state => state.set('isLoading', false),
      deleteFulfilled: (state, { payload }) =>
        state.set(
          'users',
          state.get('users').filter(user => user.get('id') !== payload.userId),
        ),
    },
  },
  Immutable.fromJS({
    users: [],
    isLoading: false,
  }),
);

deepMerge(actions, existActions);
deepMerge(types, existTypes);

export { reducer, actions, types };

```

### Immutable

ImmutableJS object + [redux-immutable](https://www.npmjs.com/package/redux-immutable)

```js
@createApp(withImmutable(withRouter({
  reducers, //
  // ...
})))
```

[Frozen](https://www.npmjs.com/package/redux-immutable-state-invariant) plain object + [immutability-helper](https://www.npmjs.com/package/immutability-helper) / [icepick](https://www.npmjs.com/package/icepick) / [seamless-immutable](https://www.npmjs.com/package/seamless-immutable) / [dot-prop-immutable](https://www.npmjs.com/package/dot-prop-immutable) / [object-path-immutable](https://www.npmjs.com/package/object-path-immutable) / [timm](https://www.npmjs.com/package/timm) / [updeep](https://www.npmjs.com/package/updeep)

```js
@createApp(withPersist(withRouter({
  reducers,
 disableFreezeState: false, // default
  enableTopologic: true,
  // ...
})))
```

```js
import { update } from 'redux-cube/lib/helpers';
import hub from '../hub';

export const { reducer, types, actions } = hub.handle({
  changeInput: (state, { payload: content }) =>
    update(state, {
     input: { $set: content },
    }),
  todo: {
    clearCompleted: state =>
      update(state, {
        items: {
         $apply: items =>
            items.map(item =>
              update(item, {
               isCompleted: { $set: false },
              }),
            ),
        },
      }),
  },
}, {
  items: [],
  input: '',
});
```

## Modules

### redux-cube

* `import { createApp, createHub, connect } from 'redux-cube'`
* `createApp` is mainly a wrapper of [redux API](https://redux.js.org/docs/api/) and some must-have action middlewares, store enhancers, high-order reducers and high-order components. It provides the support for [Sub-App pattern](https://gist.github.com/gaearon/eeee2f619620ab7b55673a4ee2bf8400) (React component with its own isolated Redux store)
* `createHub` is an enhancer (almost a rewrite) of [redux-actions](https://www.npmjs.com/package/redux-actions). It provides the support for [Reducer-Bundle-or-Ducks-Modular-like pattern](https://medium.freecodecamp.org/scaling-your-redux-app-with-ducks-6115955638be)
* `connect` is mainly a wrapper of [react-redux](https://www.npmjs.com/package/react-redux) and  [reselect](https://www.npmjs.com/package/reselect)

### redux-cube/lib/plugins

* `import withRouter from 'redux-cube/lib/plugins/withPersist'`
  * Add support to `createApp` for [redux-persist](https://www.npmjs.com/package/redux-persist)
* `import withRouter from 'redux-cube/lib/plugins/withRouter'`
  * Add support to `createApp` for [react-router v4+](https://reacttraining.com/react-router/) + [react-router-redux v5+](https://github.com/reacttraining/react-router/tree/master/packages/react-router-redux)
* `import withRouter3 from 'redux-cube-withrouter3'`
  * Add support to `createApp` for [react-router v3](https://github.com/ReactTraining/react-router/tree/v3/docs) + [react-router-redux v4](https://github.com/reactjs/react-router-redux)
* `import withImmutable from 'redux-cube/lib/plugins/withImmutable'`
  * Add support to `createApp` for [redux-immutable](https://www.npmjs.com/package/redux-immutable)

### redux-cube/lib/helpers

* `import { update, deepMerge } from 'redux-cube/lib/helpers'`
* Provide some utility fuctions, such as [immutability-helper](https://www.npmjs.com/package/immutability-helper)'s `update`

<!-- ### redux-cube/lib/remote (TODO)

* `import { middleware, reducers } from 'redux-cube/lib/remote/fetch'`
    * Use fetch API, based on [hifetch](https://www.npmjs.com/package/hifetch)
* `import { middleware } from 'redux-cube/lib/remote/axios'`
    * Use XHR API, a wrapper of [redux-axios-middleware](https://www.npmjs.com/package/redux-axios-middleware)

### redux-cube/lib/notify (TODO)

* `import { reducers, Notify } from 'redux-cube/lib/notify'`
* Alternative or wrapper of [react-notification-system-redux](https://www.npmjs.com/package/react-notification-system-redux) / [react-redux-toastr](https://www.npmjs.com/package/react-redux-toastr)

### redux-cube/lib/loading (TODO)

* `import { middleware, Loading } from 'redux-cube/lib/loading'`
* Wrapper of [react-block-ui](https://www.npmjs.com/package/react-block-ui)

### redux-cube/lib/track (TODO)

* `import { middleware } from 'redux-cube/lib/track'`
* `import bugSnag from 'redux-cube/lib/track/bugSnag'`
* `import googleAnalytics from 'redux-cube/lib/track/googleAnalytics'`
* Alternative or complement to [redux-beacon](https://www.npmjs.com/package/redux-beacon), [redux-raven-middleware](https://www.npmjs.com/package/redux-raven-middleware) / [raven-for-redux](https://www.npmjs.com/package/raven-for-redux), [redux-catch](https://www.npmjs.com/package/redux-catch) -->

## Redux Ecosystem

### Built-in Wrapped Packages

* [react-redux](https://www.npmjs.com/package/react-redux)
* [reselect](https://www.npmjs.com/package/reselect)
* [flux-standard-action](https://www.npmjs.com/package/flux-standard-action)
* [redux-actions](https://www.npmjs.com/package/redux-actions)
* [topologically-combine-reducers](https://www.npmjs.com/package/topologically-combine-reducers)
* [redux-logger](https://www.npmjs.com/package/redux-logger)
* [redux-thunk](https://www.npmjs.com/package/redux-thunk)
* [redux-promise-middleware](https://www.npmjs.com/package/redux-promise-middleware)
* [redux-debounced](https://www.npmjs.com/package/redux-debounced)
* [redux-observable](https://www.npmjs.com/package/redux-observable)
* [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension#1-with-redux)

### Optional Built-in Wrapped Packages

* [redux-persist](https://www.npmjs.com/package/redux-persist)
* [react-router v4+](https://reacttraining.com/react-router/) + [react-router-redux v5+](https://github.com/reacttraining/react-router/tree/master/packages/react-router-redux)
* [react-router v3](https://github.com/ReactTraining/react-router/tree/v3/docs) + [react-router-redux v4](https://github.com/reactjs/react-router-redux)
* [immutability-helper](https://www.npmjs.com/package/immutability-helper)
* [redux-immutable](https://www.npmjs.com/package/redux-immutable) + [immutable](https://www.npmjs.com/package/immutable)
* [redux-axios-middleware](https://www.npmjs.com/package/redux-axios-middleware)
* [react-block-ui](https://www.npmjs.com/package/react-block-ui)
* [react-notification-system-redux](https://www.npmjs.com/package/react-notification-system-redux)
* [react-redux-toastr](https://www.npmjs.com/package/react-redux-toastr)

### Non-wrapped Recommended Packages

* [normalizr](https://www.npmjs.com/package/normalizr)
* [redux-optimistic-ui](https://www.npmjs.com/package/redux-optimistic-ui)
* [localforage](https://www.npmjs.com/package/localforage)
* [redux-form](https://redux-form.com/)
* [redux-undo](https://www.npmjs.com/package/redux-undo)
* [react-intl-redux](https://www.npmjs.com/package/react-intl-redux)
* [redux-auth-wrapper](https://www.npmjs.com/package/redux-auth-wrapper)
* [redux-test-utils](https://www.npmjs.com/package/redux-test-utils) + [enzyme-redux](https://www.npmjs.com/package/enzyme-redux)
* [redux-testkit](https://www.npmjs.com/package/redux-testkit)
