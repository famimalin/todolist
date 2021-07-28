/*=====================================
    GR state provider class

    Author: Gray
    createtime: 2021 / 07 / 27
=====================================*/

/*--------------------------
    Import
--------------------------*/
import GRState from './GRState';
import { parse } from 'qs';

/*--------------------------
    Variables
--------------------------*/
const rootState = {
    name: "_ROOT_",
    path: "/",
};

const nullState = {
    name: "_UNKNOW_",
    path: undefined,
};

var cache = new Map();

/*--------------------------
    class
--------------------------*/
class GRStateProvider {

    // ------------------------------
    // constructor
    // ------------------------------
    constructor() {
        this.states = {}; // 所有state, {statename, GRState}
        this.levelStateMapList = []; // 依造層級分state（用來轉換 react router list用的）
        this.slashStateMapList = []; // 依造path /的各數來分state（用來判斷目前path是在哪個state用的）
        this.absolutePathMap = {}; // state對應到的實際網址 {statename, absolutePath}
        this.current = undefined;
        this.otherwisePath = undefined;
        this.history = [];

        // 建一個root state
        this.state(rootState.name, rootState.path);
    }

    // ------------------------------
    // 新增新的state
    // ------------------------------
    state(statename, path) {

        if(this.states[statename]) {
            throw new Error('GRState state error, has same statename ' + statename);
        }

        var state = new GRState(statename, path);

        // 如果有設定root state，則移除預設的
        if(statename !==  rootState.name && state.path === rootState.path) {
            this.removeRootState();
        }

        this.states[statename] = state;

        // 依造層級分state
        var dotList = statename.split('.');
        var dotCount = dotList.length - 1;

        if(!this.levelStateMapList[dotCount]) {
            this.levelStateMapList[dotCount] = {};
        }

        this.levelStateMapList[dotCount][statename] = state;

        // 記錄state對應到的實際網址
        var absolutePath = this.getPath(statename);
        this.absolutePathMap[statename] = absolutePath;

        // 依造absolutePath /的各數來分state
        var slashList = absolutePath.split('/');
        var slashCount = slashList.length - 1;

        if(!this.slashStateMapList[slashCount]) {
            this.slashStateMapList[slashCount] = {};
        }

        this.slashStateMapList[slashCount][statename] = state;

        return this;
    }

    // ------------------------------
    // 設定otherwise
    // ------------------------------
    otherwise(otherwisePath) {

        this.otherwisePath = otherwisePath;
    }

    // ------------------------------
    // 移除預設root state
    // ------------------------------
    removeRootState() {

        delete this.states[rootState.name];
        delete this.absolutePathMap[rootState.name];

        if(this.levelStateMapList[0]) {
            delete this.levelStateMapList[0][rootState.name];
        }
        if(this.slashStateMapList[1]) {
            delete this.slashStateMapList[1][rootState.name];
        }
    }

    // ------------------------------
    // 取得state實際path
    // ------------------------------
    getPath(statename) {

        var path = "";
        var state_path = "";
        var newStateName = statename;
        var grState = this.states[newStateName];
        var dotIndex;

        while(grState) {
            state_path = grState.path;
            path = state_path.concat(path);

            dotIndex = newStateName.lastIndexOf('.');

            if(dotIndex > 0) {
                newStateName = newStateName.substr(0, dotIndex);
                grState = this.states[newStateName];

                if(!grState) {
                    throw new Error('GRState getPath error, no parent ' + newStateName);
                }

            } else {
                grState = undefined;
            }
        };

        return path;
    }

    // ------------------------------
    // 取得 react router 所需要的陣列
    // ------------------------------
    getReactRouterList() {

        var stateMap;
        var statename;
        var state;
        var newState;

        // 將子元素放入父元素
        if(this.levelStateMapList.length > 1) {
            for(var i = this.levelStateMapList.length - 1; i > 0; i--) {
                stateMap = this.levelStateMapList[i];
                var parentStateMap = this.levelStateMapList[i - 1];

                for(statename in stateMap) {

                    if(statename === rootState.name) {
                        continue;
                    }

                    state = stateMap[statename];

                    newState = {
                        path: this.absolutePathMap[statename],
                        routes: state.routes,
                    };

                    var parentState = parentStateMap[state.parent];

                    if(!parentState) {
                        throw new Error('GRState getReactRouterList error, wrong relationship on ' + statename);
                    }

                    if(!parentState.routes) {
                        parentState.routes = [];
                    }

                    parentState.routes.push(
                        newState
                    );
                }
            }
        }

        // format 父元素
        stateMap = this.levelStateMapList[0];
        var resultList = [];

        for(statename in stateMap) {

            if(statename === rootState.name) {
                continue;
            }

            state = stateMap[statename];

            newState = {
                path: this.absolutePathMap[statename],
                routes: state.routes,
            };

            resultList.push(newState);
        }

        return resultList;
    }

    // ------------------------------
    // 由網址取得目前state
    // ------------------------------
    getStateByPath(path) {

        if(!path || typeof path !== 'string') {
            return undefined;
        }

        var slashList = path.split('/');
        var slashCount = slashList.length - 1;
        var stateMap = this.slashStateMapList[slashCount];
        var isFind = false;
        var params = undefined;

        for(var statename in stateMap) {
            var state = stateMap[statename];
            var absolutePath = this.absolutePathMap[statename];
            var absoluteSlashList = absolutePath.split('/');

            isFind = true;
            params = {};

            for(var i = 0; i <= slashCount; i++) {
                var partPath = slashList[i];
                var absolutePartPath = absoluteSlashList[i];

                if(absolutePartPath.indexOf(":") === 0) {
                    var key = absolutePartPath.substr(1);
                    params[key] = partPath;
                } else if(partPath !== absolutePartPath) {
                    isFind = false;
                    break;
                }
            }

            if(isFind) {
                return {
                    state: state,
                    params: params,
                };
            }
        }

        return undefined;
    }

    // ------------------------------
    // 更新目前state
    // action : PUSH, REPLACE, or POP
    // ------------------------------
    updateCurrent(location, action) {

        if(!location) {
            this.current = {
                state: nullState,
            };

            this.updateHistory(action);
            return false;
        }

        var current = this.getStateByPath(location.pathname);

        if(!current) {
            this.current = {
                state: Object.assign({}, nullState, {
                    path: location.pathname,
                }),
            };

            this.updateHistory(action);
            return false;
        }

        if(location.search) {
            current.querys = parse(location.search.substr(1));
        }

        if(location.state) {
            current.locationState = Object.assign({}, location.state);
        }

        this.current = current;
        this.updateHistory(action);
        return true;
    }

    // ------------------------------
    // 更新目前state
    // action : PUSH, REPLACE, or POP
    // ------------------------------
    updateCurrentByPath(path, action) {

        if(!path) {
            this.current = {
                state: nullState,
            };

            this.updateHistory(action);
            return false;
        }

        var searchIndex = path.indexOf('?');
        var search = undefined;

        if(searchIndex !== -1) {
            search = path.substr(searchIndex);
            path = path(0, searchIndex);
        }

        var current = this.getStateByPath(path);

        if(!current) {
            this.current = {
                state: Object.assign({}, nullState, {
                    path: path,
                }),
            };

            this.updateHistory(action);
            return false;
        }

        if(search) {
            current.querys = parse(search.substr(1));
        }

        this.current = current;
        this.updateHistory(action);
        return true;
    }

    // ------------------------------
    // 更新目前state
    // action : PUSH, REPLACE, or POP
    // ------------------------------
    updateCurrentByState(statename, params, querys, path, action) {

        var state = this.states[statename];

        if(!state) {
            this.current = {
                state: Object.assign({}, nullState, {
                    path: path,
                }),
            };

            this.updateHistory(action);
            return false;
        }

        this.current = {
            state: state,
            params: params,
            querys: querys,
        }

        this.updateHistory(action);
        return true;
    }

    // ------------------------------
    // 更新瀏覽記錄
    // 會依照action類型決定更新方法
    // action : PUSH, REPLACE, or POP
    // ------------------------------
    updateHistory(action) {

        if(this.history.length === 0) {
            this.history.push(this.current);
            return;
        }

        switch(action) {
            case 'POP': // 上 n 頁
                var last = this.history.pop(),
                    isFind = false;

                while(last) {
                    isFind = this.isActive(last.state.name, last.params, last.querys);

                    if(isFind) {
                        break;
                    }
                    last = this.history.pop();
                }

                this.history.push(this.current);
                break;
            case 'REPLACE': // 原頁面替換
                this.history[this.history.length - 1] = this.current;    
                break;
            case 'PUSH': // 進入新的一頁
            default:
                this.history.push(this.current);
                break;
        }
    }

    // ------------------------------
    // 取得cache用的key
    // ------------------------------
    getCacheKey(statename, params, querys) {

        return JSON.stringify({
            statename: statename,
            params: params,
            querys: querys
        });
    }

    // ------------------------------
    // 取得state實際網址（含querys）
    // ------------------------------
    getUrl(statename, params, querys) {

        const mapKey = this.getCacheKey(statename, params, querys);

        if (cache.has(mapKey)) {
            return cache.get(mapKey);
        }

        var url = this.getPathname(statename, params) + this.getQueryUrl(querys);
        

        return url;
    }

    // ------------------------------
    // 取得state實際網址（無querys）
    // ------------------------------
    getPathname(statename, params) {

        const mapKey = this.getCacheKey(statename, params);

        if (cache.has(mapKey)) {
            return cache.get(mapKey);
        }

        var url = "";
        var state_url = "";
        var newStateName = statename;
        var grState = this.states[newStateName];
        var dotIndex;

        while(grState) {

            state_url = grState.getUrl(params);
            url = state_url.concat(url);

            dotIndex = newStateName.lastIndexOf('.');

            if(dotIndex > 0) {
                newStateName = newStateName.substr(0, dotIndex);
                grState = this.states[newStateName];
            } else {
                grState = undefined;
            }
        };

        cache.set(mapKey, url);

        return url;
    }

    // ------------------------------
    // 取得query網址
    // ------------------------------
    getQueryUrl(querys) {

        const url = querys && Object.keys(querys).reduce((acc, key, index) => {

            const value = querys[key];
        
            let searchString = Array.isArray(value)
                ? value.reduce((acc, item, index) => index === 0 ? `${key}=${item}` : `${acc}&${key}=${item}` , '')
                : `${key}=${value}`;
        
        
            return index === 0 ? `?${searchString}` : `${acc}&${searchString}`;
        }, '');

        return url || '';
    }

    // ------------------------------
    // 傳入的statename是否為目前state的state或是子state
    // ------------------------------
    includes(statename) {

        if(!this.current || this.isUnknowState()) {
            return false;
        }

        return this.current.state.includes(statename);
    }

    // ------------------------------
    // 是否有該state
    // ------------------------------
    hasState(statename) {

        if(this.states[statename]) {
            return true;
        } else {
            return false;
        }
    }

    // ------------------------------
    // 判斷是否在此頁
    // ------------------------------
    isActive(statename, params, querys) {

        if(!this.current) {
            return false;
        }

        if(this.current.state.name !== statename) {
            return false;
        }

        if(params) {
            var c_params = this.current.params;
            var c_param;
            var param;

            for(var pkey in params) {
                param = params[pkey];
                c_param = c_params[pkey];

                if(param !== c_param) {
                    return false;
                }
            }
        }

        if(querys) {
            var c_querys = this.current.querys;
            var c_query;
            var query;

            for(var qkey in querys) {
                query = querys[qkey];
                c_query = c_querys[qkey];

                if(query !== c_query) {
                    return false;
                }
            }
        }

        return true;
    }

    // ------------------------------
    // 判斷目前是否為未定義的頁面
    // ------------------------------
    isUnknowState() {

        if(!this.current) {
            return false;
        }

        return this.current.state.name === nullState.name;
    }

    // ------------------------------
    // 取得歷史記錄
    // ------------------------------
    getHistory() {

        return this.history.slice(0); // slice 複製一份出去，避免修改到實際資料
    }
}

/*--------------------------
    export
--------------------------*/
export default GRStateProvider;