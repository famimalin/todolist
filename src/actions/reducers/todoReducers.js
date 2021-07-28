/*=====================================
	todo reducer

	Author: Gray
	CreateTime: 2021 / 07 / 28
=====================================*/
import actionTypes from '../actionTypes';
import globalutil from '../../util/globalutil';

/*--------------------------
	Variable
--------------------------*/
const {
    TODO_CATEGORY_TYPE,
    TODO_STATE,
} = globalutil;

const ONE_DAY = 1000 * 60 * 60 * 24;

/*--------------------------
    Reducers
--------------------------*/
const reducers = {
	// 開始取得todo資料
	[actionTypes.getTodoDataStart]: (state, action) => getTodoDataStart(state, action),
	// 成功取得todo資料
	[actionTypes.getTodoDataSuccess]: (state, action) => getTodoDataSuccess(state, action),
	// 失敗取得todo資料
	[actionTypes.getTodoDataError]: (state, action) => getTodoDataError(state, action),
	// 成功新增todo資料
	[actionTypes.addTodoSuccess]: (state, action) => addTodoSuccess(state, action),
	// 成功編輯todo資料
	[actionTypes.editTodoSuccess]: (state, action) => editTodoSuccess(state, action),
	// 成功完成 Todo
	[actionTypes.finishTodoSuccess]: (state, action) => finishTodoSuccess(state, action),
	// 成功刪除 Todo
	[actionTypes.deleteTodoSuccess]: (state, action) => deleteTodoSuccess(state, action),
	// 成功復原 Todo
	[actionTypes.resetTodoSuccess]: (state, action) => resetTodoSuccess(state, action),
};

/*--------------------------
    Method
--------------------------*/

// ------------------------------
// [private] addTodoToList
// ------------------------------
function addTodoToList(todo, stateTodoMap, stateTodoList, stopSort) {

	const {
		category,
	} = todo;
	
	let listObj = undefined;

    switch(category) {
        case TODO_CATEGORY_TYPE.SELF:
        case TODO_CATEGORY_TYPE.WORK:
        case TODO_CATEGORY_TYPE.BUY:
            listObj = stateTodoList[category] || {};
            break;
        default:
            break;
    }

    if(listObj) {
        listObj = addTodoToListObj(todo, stateTodoMap, listObj, stopSort);
        stateTodoList[category] = listObj;
    }

    listObj = stateTodoList[TODO_CATEGORY_TYPE.ALL] || {};
    listObj = addTodoToListObj(todo, stateTodoMap, listObj, stopSort);
    stateTodoList[TODO_CATEGORY_TYPE.ALL] = listObj;
}

// ------------------------------
// [private] addTodoToListObj
// ------------------------------
function addTodoToListObj(todo, stateTodoMap, listObj, stopSort) {

    if(listObj) {

        const {
            id,
            todotime,
            createtime,
            state,
        } = todo;

        let today = listObj.today || [];
        let others = listObj.others || [];
        let success = listObj.success || [];

        switch(state) {
            case TODO_STATE.IDLE:
                if(todotime - createtime >= ONE_DAY) {
                    others.push(id);
                    others = stopSort ? others : sortTodoList(others, stateTodoMap);
                } else {
                    today.push(id);
                    today = stopSort ? today : sortTodoList(today, stateTodoMap);
                }
                break;
            case TODO_STATE.FINISH:
                success.push(id);
                success = stopSort ? success : sortTodoList(success, stateTodoMap);
                break;
            case TODO_STATE.DELETE:
            default:
                break;
        }

        listObj.today = today;
        listObj.others = others;
        listObj.success = success;
    }

    return listObj;
}

// ------------------------------
// [private] sortTodoList
// ------------------------------
function sortTodoList(list, stateTodoMap) {

    list.sort(function(idA, idB) {

        let todoA = stateTodoMap[idA];
        let todoB = stateTodoMap[idB];
        let todotimeA = todoA ? todoA.todotime : 0; 
        let todotimeB = todoB ? todoB.todotime : 0; 

        return todotimeA - todotimeB;
    });

    return list;
}

// ------------------------------
// [private] removeAllListTodo
// ------------------------------
function removeAllListTodo(id, stateTodoList) {

    for(let key in TODO_CATEGORY_TYPE) {
        let type = TODO_CATEGORY_TYPE[key];
        let listObj = stateTodoList[type];

        if(listObj) {
            let today = listObj.today || [];
            let others = listObj.others || [];
            let success = listObj.success || [];
            
            today = today.filter((item_id) => {
                return item_id !== id;
            });
    
            others = others.filter((item_id) => {
                return item_id !== id;
            });
    
            success = success.filter((item_id) => {
                return item_id !== id;
            });
    
            listObj.today = today;
            listObj.others = others;
            listObj.success = success;

            stateTodoList[type] = listObj;
        }
    }
}

// ------------------------------
// 開始取得todo資料
// ------------------------------
function getTodoDataStart(state, action) {
	
	const {
		isTodoLoading,
	} = state;

	if(isTodoLoading) {
		return state;
	}

	return Object.assign({}, state, {
        isTodoLoading: true,
        isTodoLoadError: false,
    });
}

// ------------------------------
// 成功取得todo資料
// ------------------------------
function getTodoDataSuccess(state, action) {

	const {
		todoMap,
		todoList,
	} = state;

	const {
        payload,
    } = action;

	const {
		todoData,
	} = payload;

	if(!todoData) {
		return state;
	}

	let new_todoMap = Object.assign({}, todoMap);
	let new_todoList = Object.assign({}, todoList);

	for(let id in todoData) {
		let todo = todoData[id];

		new_todoMap[id] = todo; 

		addTodoToList(todo, new_todoMap, new_todoList, true);
	}

	return Object.assign({}, state, {
		isTodoLoading: false,
		isTodoLoaded: true,
        todoMap: new_todoMap,
        todoList: new_todoList,
    });
}

// ------------------------------
// 失敗取得todo資料
// ------------------------------
function getTodoDataError(state, action) {

	const {
		isTodoLoadError,
	} = state;

	if(isTodoLoadError) {
		return state;
	}

	return Object.assign({}, state, {
        isTodoLoading: false,
        isTodoLoadError: true,
    });
}

// ------------------------------
// 成功新增todo資料
// ------------------------------
function addTodoSuccess(state, action) {

	const {
		todoMap,
		todoList,
	} = state;

	const {
		payload,
	} = action;

	const {
		todo,
	} = payload;

	let new_todoMap = Object.assign({}, todoMap);
	let new_todoList = Object.assign({}, todoList);

	new_todoMap[todo.id] = todo;

	addTodoToList(todo, new_todoMap, new_todoList, false);

	return Object.assign({}, state, {
        todoMap: new_todoMap,
        todoList: new_todoList,
    });
}

// ------------------------------
// 成功編輯todo資料
// ------------------------------
function editTodoSuccess(state, action) {

	const {
		todoMap,
		todoList,
	} = state;

	const {
		payload,
	} = action;

	const {
		todo,
	} = payload;

	let new_todoMap = Object.assign({}, todoMap);
	let new_todoList = Object.assign({}, todoList);

	new_todoMap[todo.id] = todo;

	removeAllListTodo(todo.id, new_todoList);
	addTodoToList(todo, new_todoMap, new_todoList, false);

	return Object.assign({}, state, {
        todoMap: new_todoMap,
        todoList: new_todoList,
    });
}

// ------------------------------
// 成功完成 Todo
// ------------------------------
function finishTodoSuccess(state, action) {

	const {
		todoMap,
		todoList,
	} = state;

	const {
		payload,
	} = action;

	const {
		todo,
	} = payload;

	let new_todoMap = Object.assign({}, todoMap);
	let new_todoList = Object.assign({}, todoList);

	new_todoMap[todo.id] = todo;

	removeAllListTodo(todo.id, new_todoList);
	addTodoToList(todo, new_todoMap, new_todoList, false);

	return Object.assign({}, state, {
        todoMap: new_todoMap,
        todoList: new_todoList,
    });
}

// ------------------------------
// 成功刪除 Todo
// ------------------------------
function deleteTodoSuccess(state, action) {

	const {
		todoMap,
		todoList,
	} = state;

	const {
		payload,
	} = action;

	const {
		todo,
	} = payload;

	let new_todoMap = Object.assign({}, todoMap);
	let new_todoList = Object.assign({}, todoList);

	new_todoMap[todo.id] = todo;

	removeAllListTodo(todo.id, new_todoList);

	return Object.assign({}, state, {
        todoMap: new_todoMap,
        todoList: new_todoList,
    });
}

// ------------------------------
// 成功復原 Todo
// ------------------------------
function resetTodoSuccess(state, action) {

	const {
		todoMap,
		todoList,
	} = state;

	const {
		payload,
	} = action;

	const {
		todo,
	} = payload;

	let new_todoMap = Object.assign({}, todoMap);
	let new_todoList = Object.assign({}, todoList);

	new_todoMap[todo.id] = todo;

	removeAllListTodo(todo.id, new_todoList);
	addTodoToList(todo, new_todoMap, new_todoList, false);

	return Object.assign({}, state, {
        todoMap: new_todoMap,
        todoList: new_todoList,
    });
}

/*--------------------------
	Export
--------------------------*/
export default function createReducers(initialState) {
	return function reducer(state = initialState, action) {
		if (reducers.hasOwnProperty(action.type)) {
			return reducers[action.type](state, action);
		} else {
			return state;
		}
	};
};