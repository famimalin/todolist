/*=====================================
    Action types

    Author: Gray
    CreateTime: 2021 / 07 / 27
=====================================*/

/*--------------------------
    Variable
--------------------------*/

// todo actions
const getTodoDataStart = "getTodoDataStart";
const getTodoDataSuccess = "getTodoDataSuccess";
const getTodoDataError = "getTodoDataError";
const addTodoSuccess = "addTodoSuccess";
const editTodoSuccess = "editTodoSuccess";
const finishTodoSuccess = "finishTodoSuccess";
const deleteTodoSuccess = "deleteTodoSuccess";
const resetTodoSuccess = "resetTodoSuccess";

/*--------------------------
    Export
--------------------------*/
const actionTypes = {
    getTodoDataStart,
    getTodoDataSuccess,
    getTodoDataError,
    addTodoSuccess,
    editTodoSuccess,
    finishTodoSuccess,
    deleteTodoSuccess,
    resetTodoSuccess,
};

export default actionTypes;