# webcube-redux

```
npm install webcube-redux
```

## Summary

```js
// xxx/App.jsx
import { createApp, withRouter, withPersist, withImmutable } from 'webcube-redux';
import { reducers as notifications, Notify } from 'webcube-redux/notify';
import { middleware as loading, Loading } from 'webcube-redux/loading';
import { middleware as track } from 'webcube-redux/track';

@createApp(withRouter(withPersist({
  reducers: {
    // ...
    notifications,
  },
  // below are optional
  reducerDeps,
  epics,
  preloadedState,
  middlewares: [
    fetchMiddleware(),
    loading({
      enableBlock: true,
    }),
    track({
      // ...
    }),
    track({
      // ...
    }),
  ],
  enhancers,
})))
class SubApp extends PureComponent {
  render() {
    return (
      <div>
        <Loading>
          {/* ... */}
        </Loading>
        <Notify />
      </div>
    );
  }
}
```

```js
// xxx/containers/Xxx.jsx
import { connect } from 'webcube-redux';

@connect({
  selectors,
  actions,
})
class SmartComponent extends PureComponent {
  // ...
}
```

```js
// xxx/hub.js
import { createHub } from 'webcube-redux';

export default createHub();
```

```js
// xxx/actions/xxx.js  (optional)
import hub from '../hub';

hub.add({
    // ...
})
```

```js
// xxx/reducers/xxx.js
import hub from '../hub';

// async actions

// redux-thunk
hub.add('TYPE_ONE', dispatch => {
   // ...
});

// redux-promise-middleware
hub.add('TYPE_TWO', new Promise((resolve, reject) => {
   // ...
}));

// webcube-redux/remote/fetch
hub.add('TYPE_TWO', {
  // non-FSA
  url: 'http://www.mydomain.com/users/1/',
  // ...
});

// redux-observable
export const epics = [
    // ...
];

// bundle or duck
export const { reducers, actions, types, initialState } = hub.handle({
    // ...
});
```

## Modules

### webcube-redux

* `import { createApp, createHub, connect } from 'webcube-redux'`
* `createApp` is mainly a wrapper of [redux API](https://redux.js.org/docs/api/) and some must-have action middlewares, store enhancers, high-order reducers and high-order components
* `createHub` is mainly a wrapper of [redux-actions](https://www.npmjs.com/package/redux-actions)
* `connect` is mainly a wrapper of [react-redux](https://www.npmjs.com/package/react-redux) and  [reselect](https://www.npmjs.com/package/reselect)

### webcube-redux/remote

* `import { middleware, reducers } from 'webcube-redux/remote/fetch'`
    * Use fetch API, based on [hifetch](https://www.npmjs.com/package/hifetch)
* `import { middleware } from 'webcube-redux/remote/axios'`
    * Use XHR API, a wrapper of [redux-axios-middleware](https://www.npmjs.com/package/redux-axios-middleware)

### webcube-redux/notify

* `import { reducers, Notify } from 'webcube-redux/notify'`
* Alternative or wrapper of [react-notification-system-redux](https://www.npmjs.com/package/react-notification-system-redux) / [react-redux-toastr](https://www.npmjs.com/package/react-redux-toastr)

### webcube-redux/loading

* `import { middleware, Loading } from 'webcube-redux/loading'`
* Wrapper of [react-block-ui](https://www.npmjs.com/package/react-block-ui)

### webcube-redux/track

* `import { middleware } from 'webcube-redux/track'`
* `import bugSnag from 'webcube-redux/track/bugSnag'`
* `import googleAnalytics from 'webcube-redux/track/googleAnalytics'`
* Alternative or complement to [redux-beacon](https://www.npmjs.com/package/redux-beacon), [redux-raven-middleware](https://www.npmjs.com/package/redux-raven-middleware) / [raven-for-redux](https://www.npmjs.com/package/raven-for-redux), [redux-catch](https://www.npmjs.com/package/redux-catch)

## Built-in Wrapped Packages

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

## Optional Built-in Wrapped Packages

* [react-router-redux](https://www.npmjs.com/package/react-router-redux)
* [redux-immutable](https://www.npmjs.com/package/redux-immutable)
* [redux-persist](https://www.npmjs.com/package/redux-persist)
* [redux-axios-middleware](https://www.npmjs.com/package/redux-axios-middleware)
* [react-block-ui](https://www.npmjs.com/package/react-block-ui)
* [react-notification-system-redux](https://www.npmjs.com/package/react-notification-system-redux)
* [react-redux-toastr](https://www.npmjs.com/package/react-redux-toastr)

## Non-wrapped Recommended Packages

* [immutability-helper](https://www.npmjs.com/package/immutability-helper) / [immutable](https://www.npmjs.com/package/immutable)
* [normalizr](https://www.npmjs.com/package/normalizr)
* [redux-optimistic-ui](https://www.npmjs.com/package/redux-optimistic-ui)
* [localforage](https://www.npmjs.com/package/localforage)
* [redux-form](https://redux-form.com/)
* [redux-undo](https://www.npmjs.com/package/redux-undo)
* [react-intl-redux](https://www.npmjs.com/package/react-intl-redux)
* [redux-auth-wrapper](https://www.npmjs.com/package/redux-auth-wrapper)
* [redux-test-utils](https://www.npmjs.com/package/redux-test-utils) + [enzyme-redux](https://www.npmjs.com/package/enzyme-redux)
* [redux-testkit](https://www.npmjs.com/package/redux-testkit)

## Overview and Examples

See [examples/snippets.js](./examples/snippets.js)
