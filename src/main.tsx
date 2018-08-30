import { App } from "@/components/app/App";
import { parsePath } from "@/routing";
import { Action } from "@/store/actions";
import { rootEpic } from "@/store/epics";
import reducer from "@/store/reducer";
import { RepoState } from "@/store/state";
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

const epicMiddleware = createEpicMiddleware<Action, Action, RepoState>();
const history = createBrowserHistory();
const store = redux.createStore(
  connectRouter(history)(reducer as redux.Reducer<RepoState, redux.AnyAction>),
  redux.compose(
    redux.applyMiddleware(routerMiddleware(history), epicMiddleware),
    devToolsExtension ? devToolsExtension() : undefined
  )
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
