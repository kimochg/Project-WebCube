/* eslint-disable filenames/match-exported */
/* eslint-disable import/named */
// https://github.com/ReactTraining/react-router/tree/v3/docs
import { browserHistory, hashHistory } from 'react-router';
// https://www.npmjs.com/package/react-router-redux
import {
  syncHistoryWithStore,
  routerMiddleware,
  routerReducer,
} from 'react-router-redux';
/* eslint-enable import/named */

export default function withRouter3({ disableHashRouter = false, ...config }) {
  const history = disableHashRouter ? browserHistory : hashHistory;
  return {
    _enableRouter3: true,
    _routerReducer: routerReducer,
    _routerMiddleware: routerMiddleware,
    _routerHistory: history,
    _syncRouterHistoryWithStore: syncHistoryWithStore,
    ...config,
  };
}
/* eslint-enable filenames/match-exported */
