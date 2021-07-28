/*=====================================
    config

    Author: Gray
    CreateTime: 2021 / 07 / 27
=====================================*/

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'react-router-redux';
import { connectRouter } from 'connected-react-router';
import { createBrowserHistory as createHistory } from 'history';
import reducerCreators from '../reducers';
import { logger, crashReporter } from '../actionMiddlewares';

const history = createHistory();
const middleWare = applyMiddleware(thunk,logger, crashReporter, routerMiddleware(history));

/*--------------------------
    State Init
--------------------------*/
const webDefaultState = {
    history: history,
};

const todoDefaultState = {
    isTodoLoading: false,
    isTodoLoadError: false,
    isTodoLoaded: false,
    todoMap: {},
    todoList: {
        // [key] : {today: [], others: []},
        // key: all, self, work, buy...
    },
};

/*--------------------------
    Reducer Export
--------------------------*/
const actionReducers = combineReducers({
    web: reducerCreators.createWebReducers({}),
    todo: reducerCreators.createTodoReducers({}),
    router: connectRouter(history),
});

const storeObject = {
    web: webDefaultState,
    todo: todoDefaultState,
};

const actionStore = createStore(actionReducers, storeObject, composeWithDevTools(middleWare));

export default actionStore;