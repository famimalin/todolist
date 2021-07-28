/*=====================================
    GR router 相關

    Author: Gray
    CreateTime: 2021 / 07 / 27
=====================================*/

/*--------------------------
    Import
--------------------------*/
import GRStateProvider from './GRStateProvider';

/*--------------------------
    Variables
--------------------------*/
const STATES = {
    HOME: 'home',
    SELF: 'self',
    WORK: 'work',
    BUY: 'buy',
    ADD: 'add',
    EDIT: 'edit',
};

var $stateProvider = new GRStateProvider();

$stateProvider.otherwise('/');

$stateProvider
    .state(STATES.HOME, '/')
    .state(STATES.SELF, '/self')
    .state(STATES.WORK, '/work')
    .state(STATES.BUY, '/buy')
    .state(STATES.ADD, '/add')
    .state(STATES.EDIT, '/edit/:id')
;

var PATHS = {};

for(var key in STATES) {

    var statename = STATES[key];

    PATHS[key] = $stateProvider.absolutePathMap[statename];
}

/*--------------------------
    Method
--------------------------*/

// ------------------------------
// 取得 react router 所需要的陣列
// ------------------------------
function getReactRouterList() {

    return $stateProvider.getReactRouterList();
}

// ------------------------------
// 更新目前state
// ------------------------------
function updateCurrent(location, action) {

    return $stateProvider.updateCurrent(location, action);
}

// ------------------------------
// 更新目前state
// ------------------------------
function updateCurrentByPath(path, action) {

    return $stateProvider.updateCurrentByPath(path, action);
}

// ------------------------------
// 更新目前state
// ------------------------------
function updateCurrentByState(statename, params, querys, path, action) {

    return $stateProvider.updateCurrentByState(statename, params, querys, path, action);
}

// ------------------------------
// 取得目前state
// ------------------------------
function getCurrent() {

    return $stateProvider.current;
}

// ------------------------------
// 取得state實際網址（含querys）
// ------------------------------
function getUrl(statename, params, querys) {

    return $stateProvider.getUrl(statename, params, querys);
}

// ------------------------------
// 取得state實際網址（無querys）
// ------------------------------
function getPathname(statename, params) {

    return $stateProvider.getPathname(statename, params);
}

// ------------------------------
// 取得query網址
// ------------------------------
function getQueryUrl(querys) {

    return $stateProvider.getQueryUrl(querys);
}

// ------------------------------
// 傳入的statename是否為目前state的state或是子state
// ------------------------------
function includes(statename) {

    return $stateProvider.includes(statename);
}

// ------------------------------
// 是否有該state
// ------------------------------
function hasState(statename) {

    return $stateProvider.hasState(statename);
}

// ------------------------------
// 判斷是否在此頁
// ------------------------------
function isActive(statename, params, querys) {

    return $stateProvider.isActive(statename, params, querys);
}

// ------------------------------
// 判斷目前是否為未定義的頁面
// ------------------------------
function isUnknowState() {

    return $stateProvider.isUnknowState();
}

// ------------------------------
// 取得otherwise
// ------------------------------
function getOtherwise() {

    return $stateProvider.otherwisePath;
}

// ------------------------------
// 取得歷史記錄
// ------------------------------
function getHistory() {

    return $stateProvider.getHistory();
}

const GRRouter = {
    /*--------------------------
        Variables
    --------------------------*/
    STATES, // 所有state
    PATHS, // State 對應到的 path

    /*--------------------------
        Method
    --------------------------*/
    getReactRouterList, // 取得 react router 所需要的陣列
    updateCurrent, // 更新目前state
    updateCurrentByPath, // 更新目前state
    updateCurrentByState, // 更新目前state
    getCurrent, // 取得目前state
    getUrl, // 取得state實際網址（含querys）
    getPathname, // 取得state實際網址（無querys）
    getQueryUrl, // 取得query網址
    includes, // 傳入的statename是否為目前state的state或是子state
    hasState, // 是否有該state
    isActive, // 判斷是否在此頁
    isUnknowState, // 判斷目前是否為未定義的頁面
    getOtherwise, // 取得otherwise
    getHistory, // 取得歷史記錄
};

export default GRRouter;
