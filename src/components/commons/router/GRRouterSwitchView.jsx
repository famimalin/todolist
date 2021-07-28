/*=====================================
    RootSwitchView

    Author: Gray
    createtime: 2017 / 12 / 21
=====================================*/

/*--------------------------
    Import
--------------------------*/
import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import GRRouter from './GRRouter';
import AddTodoView from '../../AddTodoView';
import EditTodoView from '../../EditTodoView';
import TodoListView from '../../TodoListView';
import globalutil from '../../../util/globalutil';

/*--------------------------
    Variable
--------------------------*/
const {
    PATHS,
} = GRRouter;

const {
    TODO_CATEGORY_TYPE,
} = globalutil;


/*--------------------------
    Main Component
--------------------------*/
class GRRouterSwitchView extends PureComponent {
    
    // ------------------------------
    // render
    // ------------------------------    
    render() {

        const {
            location,
        } = this.props;

        return (
            <Switch location={location}>
                <Route path={PATHS.HOME} render={() => <TodoListView category={TODO_CATEGORY_TYPE.ALL}/>} exact/>
                <Route path={PATHS.SELF} render={() => <TodoListView category={TODO_CATEGORY_TYPE.SELF}/>} exact/>
                <Route path={PATHS.WORK} render={() => <TodoListView category={TODO_CATEGORY_TYPE.WORK}/>} exact/>
                <Route path={PATHS.BUY} render={() => <TodoListView category={TODO_CATEGORY_TYPE.BUY}/>} exact/>
                <Route path={PATHS.ADD} component={AddTodoView} exact/>
                <Route path={PATHS.EDIT} component={EditTodoView} exact/>
            </Switch>
        );
    }
}

export default GRRouterSwitchView;