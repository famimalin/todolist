/*=====================================
    todo action

    Author: Gray
    CreateTime: 2021 / 07 / 28
=====================================*/

/*--------------------------
    Import
--------------------------*/
import actionTypes from '../actionTypes';
import globalutil from '../../util/globalutil';

/*--------------------------
    Variable
--------------------------*/
const {
    TODO_STATE,
} = globalutil;

const LOCAL_STORAGE_TODO_DATA_KEY = 'gr.todo_list_data_map';
let todoMap = {};

/*--------------------------
    Method
--------------------------*/

// ------------------------------
// [private] 取得存在 localStorage 的 todo 資料
// ------------------------------
function getStorageTodoMap() {

    let json = localStorage.getItem(LOCAL_STORAGE_TODO_DATA_KEY);
    
    todoMap = JSON.parse(json) || {};

    return todoMap;
}

// ------------------------------
// [private] 更新 localStorage 的 todo 資料
// ------------------------------
function updateStorageTodoMap(new_todoMap) {

    let json = JSON.stringify(new_todoMap);

    localStorage.setItem(LOCAL_STORAGE_TODO_DATA_KEY, json)
}

// ------------------------------
// 取得todo資料
// ------------------------------
function getTodoData() {

    return function (dispatch) {
        const promise = new Promise((resolve, reject) => {
            
            dispatch(getTodoDataStart());
            
            setTimeout(() => {
                const data = getStorageTodoMap();

                if(data) {
                    dispatch(getTodoDataSuccess(data));                                
                    resolve(true);
                } else {
                    dispatch(getTodoDataError());                                
                    reject(false);
                }
            }, 0);
        });

        return promise;
    }
}

// ------------------------------
// [private] 開始取得todo資料
// ------------------------------
function getTodoDataStart() {

    return { type: actionTypes.getTodoDataStart }
}

// ------------------------------
// [private] 成功取得todo資料
// ------------------------------
function getTodoDataSuccess(todoData) {

    const payload = {
        todoData: todoData,
    };

    return { type: actionTypes.getTodoDataSuccess, payload }
}

// ------------------------------
// [private] 失敗取得todo資料
// ------------------------------
function getTodoDataError() {

    return { type: actionTypes.getTodoDataError }
}

// ------------------------------
// 新增 Todo
// ------------------------------
function addTodo(payload) {

    const {
        title,
        time,
        category,
    } = payload;

    return function (dispatch) {
        const now = Date.now();
        const id = now + '';
        const todo = {
            id: id,
            title: title,
            createtime: now,
            todotime: time,
            category: category,
            remark: '',
            state: TODO_STATE.IDLE,
        };

        todoMap[id] = todo;
        updateStorageTodoMap(todoMap);

        dispatch(addTodoSuccess(todo));

        return todo;
    }
}

// ------------------------------
// [private] 成功新增todo資料
// ------------------------------
function addTodoSuccess(todo) {

    const payload = {
        todo: todo,
    };

    return { type: actionTypes.addTodoSuccess, payload }
}

// ------------------------------
// 編輯 Todo
// ------------------------------
function editTodo(payload) {

    const {
        id,
        title,
        time,
        category,
    } = payload;

    return function (dispatch) {
        const old_todo = todoMap[id] || {};
        const todo = Object.assign({}, old_todo, {
            title: title,
            todotime: time,
            category: category,
        })

        todoMap[id] = todo;
        updateStorageTodoMap(todoMap);

        dispatch(editTodoSuccess(todo));

        return todo;
    }
}

// ------------------------------
// [private] 成功編輯todo資料
// ------------------------------
function editTodoSuccess(todo) {

    const payload = {
        todo: todo,
    };

    return { type: actionTypes.editTodoSuccess, payload }
}

// ------------------------------
// 完成 Todo
// ------------------------------
function finishTodo(payload) {

    const {
        id,
    } = payload;

    return function (dispatch) {
        const old_todo = todoMap[id] || {};
        const todo = Object.assign({}, old_todo, {
            state: TODO_STATE.FINISH,
        });

        todoMap[id] = todo;
        updateStorageTodoMap(todoMap);

        dispatch(finishTodoSuccess(todo));

        return todo;
    }
}

// ------------------------------
// [private] 成功完成 Todo
// ------------------------------
function finishTodoSuccess(todo) {

    const payload = {
        todo: todo,
    };

    return { type: actionTypes.finishTodoSuccess, payload }
}

// ------------------------------
// 刪除 Todo
// ------------------------------
function deleteTodo(payload) {

    const {
        id,
    } = payload;

    return function (dispatch) {
        const old_todo = todoMap[id] || {};
        const todo = Object.assign({}, old_todo, {
            state: TODO_STATE.DELETE,
        });

        todoMap[id] = todo;
        updateStorageTodoMap(todoMap);

        dispatch(deleteTodoSuccess(todo));

        return todo;
    }
}

// ------------------------------
// [private] 成功刪除 Todo
// ------------------------------
function deleteTodoSuccess(todo) {

    const payload = {
        todo: todo,
    };

    return { type: actionTypes.deleteTodoSuccess, payload }
}

// ------------------------------
// 復原 Todo
// ------------------------------
function resetTodo(payload) {

    const {
        id,
    } = payload;

    return function (dispatch) {
        const old_todo = todoMap[id] || {};
        const todo = Object.assign({}, old_todo, {
            state: TODO_STATE.IDLE,
        });

        todoMap[id] = todo;
        updateStorageTodoMap(todoMap);

        dispatch(resetTodoSuccess(todo));

        return todo;
    }
}

// ------------------------------
// [private] 成功復原 Todo
// ------------------------------
function resetTodoSuccess(todo) {

    const payload = {
        todo: todo,
    };

    return { type: actionTypes.resetTodoSuccess, payload }
}

/*--------------------------
    Export
--------------------------*/
const todoActions = {
    getTodoData, // 取得todo資料
    addTodo, // 新增 Todo
    editTodo, // 編輯 Todo 
    finishTodo, // 完成 Todo 
    deleteTodo, // 刪除 Todo
    resetTodo, // 復原 Todo
};

export default todoActions;