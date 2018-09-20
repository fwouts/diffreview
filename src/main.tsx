import { App } from "@/components/app/App";
import { parsePath } from "@/routing";
import { Action } from "@/store/actions";
import { rootEpic } from "@/store/epics";
import reducer from "@/store/reducer";
import { AppState } from "@/store/state";
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware
} from "connected-react-router";
import { createBrowserHistory } from "history";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router";
import * as redux from "redux";
import { createEpicMiddleware } from "redux-observable";

const devToolsExtension = (window as any).devToolsExtension;

const epicMiddleware = createEpicMiddleware<Action, Action, AppState>();
const history = createBrowserHistory();
const storeEnhancer = redux.applyMiddleware(
  routerMiddleware(history),
  epicMiddleware
);
const store = redux.createStore(
  connectRouter(history)(reducer as redux.Reducer<AppState, redux.AnyAction>),
  devToolsExtension
    ? redux.compose(
        storeEnhancer,
        devToolsExtension ? devToolsExtension() : undefined
      )
    : storeEnhancer
);
epicMiddleware.run(rootEpic);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route
          render={props => <App {...parsePath(props.location.pathname)} />}
        />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("app")
);
