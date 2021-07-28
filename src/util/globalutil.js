/*=====================================
    Global

    Author: Gray
    CreateTime: 2021 / 07 / 27
=====================================*/

/*--------------------------
    Variable
--------------------------*/

// 網域 origin url
const ORIGIN_URL = window.location.origin;

// todo 分類
const TODO_CATEGORY_TYPE = {
    ALL: 'all',
    SELF: 'self',
    WORK: 'work',
    BUY: 'buy',
};

// todo 狀態
const TODO_STATE = {
    IDLE: 0,
    FINISH: 100,
    DELETE: 200,
};

/*--------------------------
    Method
--------------------------*/

// ------------------------------
// 簡易複製 object
// ------------------------------
function shallowCopy(object) {

    if(object === undefined) {
        return undefined;
    }

    return JSON.parse(JSON.stringify(object))
}

// ------------------------------
// 取得 todo 分類文案
// ------------------------------
function getTodoCategoryTypeText(type) {

    switch(type) {
        case TODO_CATEGORY_TYPE.ALL:
            return "全部";
        case TODO_CATEGORY_TYPE.SELF:
            return "個人";
        case TODO_CATEGORY_TYPE.WORK:
            return "工作";
        case TODO_CATEGORY_TYPE.BUY:
            return "購物清單";
        default:
            return "";
    }
}

// ------------------------------
// 取得 todo 狀態文案
// ------------------------------
function getTodoStateText(state) {
    
    switch(state) {
        case TODO_STATE.IDLE:
            return "待辦";
        case TODO_STATE.FINISH:
            return "完成";
        case TODO_STATE.DELETE:
            return "刪除";
        default:
            return "";
    }
}

/*--------------------------
    Export
--------------------------*/
const globalutil = {
    /*--------------------------
        Variable
    --------------------------*/
    ORIGIN_URL, // 網域 origin url
    TODO_CATEGORY_TYPE, // todo 分類
    TODO_STATE, // todo 狀態

    /*--------------------------
        Method
    --------------------------*/
    shallowCopy, // 簡易複製 object
    getTodoCategoryTypeText, // 取得 todo 分類文案
    getTodoStateText, // 取得 todo 狀態文案
};

export default globalutil;