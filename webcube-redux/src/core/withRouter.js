// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
} from 'react-router-redux';

// https://reacttraining.com/react-router/core/guides/redux-integration/deep-integration
export default function withRouter({
  // https://github.com/ReactTraining/history#usage
  routerHistory,
  ...config
}) {
  return {
    _enableRouter: true,
    _routerReducer: routerReducer,
    _routerMiddleware: routerMiddleware,
    _routerHistory: routerHistory,
    _ConnectedRouter: ConnectedRouter,
    ...config,
  };
}
