import { Action } from "@/store/actions";
import { fetchTreeEpic } from "@/store/epics";
import reducer from "@/store/reducer";
import { RepoState } from "@/store/state";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as redux from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { App } from "./components/app/App";

const devToolsExtension = (window as any).devToolsExtension;

const rootEpic = combineEpics(fetchTreeEpic);
const epicMiddleware = createEpicMiddleware<Action, Action, RepoState>();
const store = redux.createStore(
  reducer,
  redux.compose(
    redux.applyMiddleware(epicMiddleware),
    devToolsExtension ? devToolsExtension() : undefined
  )
);
epicMiddleware.run(rootEpic);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
