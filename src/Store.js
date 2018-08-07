import React, { Component } from 'react';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';


const loggerMiddleware = createLogger();
// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();
// Build the middleware for intercepting and dispatching navigation actions
const boundRouterMiddleware = routerMiddleware(history);

let store = createStore(
    reducers,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware,
        boundRouterMiddleware
    )
);
export default class Store extends Component {
    render() {
        return (
            <Provider store={store}>
                { /* ConnectedRouter will use the store from Provider automatically */}
                <ConnectedRouter history={history}>
                {this.props.children}
                </ConnectedRouter>
            </Provider>
        )
    }
}


