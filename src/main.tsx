import reducer from "@/store/reducer";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as redux from "redux";
import thunk from "redux-thunk";
import { App } from "./components/app/App";

const devToolsExtension = (window as any).devToolsExtension;

const store = redux.createStore(
  reducer,
  redux.compose(
    redux.applyMiddleware(thunk),
    devToolsExtension ? devToolsExtension() : undefined
  )
);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
