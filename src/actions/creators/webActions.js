/*=====================================
    web action

    Author: Gray
    CreateTime: 2021 / 07 / 27
=====================================*/

/*--------------------------
    Import
--------------------------*/
import { push, replace } from 'react-router-redux';
import GRRouter from '../../components/commons/router/GRRouter';

/*--------------------------
    Method
--------------------------*/
// ------------------------------
// GR State 轉址
// ------------------------------
function grStateGo(statename, params, querys, locationState) {

    return dispatch => {

        if(!GRRouter.hasState(statename)) {
            throw new Error('GRState has not state: ' + statename);
        }

        const url = GRRouter.getPathname(statename, params);
        const search = GRRouter.getQueryUrl(querys);
        const location =  {
            pathname: url,
            search: search,
            state: locationState,
        };

        return dispatch(push(location));
    };
}

// ------------------------------
// GR State 轉址（不會記錄上下頁）
// ------------------------------
function grStateReplace(statename, params, querys, locationState) {

    return dispatch => {

        if(!GRRouter.hasState(statename)) {
            throw new Error('GRState has not state: ' + statename);
        }

        const url = GRRouter.getPathname(statename, params);
        const search = GRRouter.getQueryUrl(querys);
        const location =  {
            pathname: url,
            search: search,
            state: locationState,
        };

        return dispatch(replace(location));
    };
}

// ------------------------------
// GR State 轉至預設頁
// ------------------------------
function grStateGoOtherwise() {

    return dispatch => {

        const otherwise = GRRouter.getOtherwise();

        if(otherwise) {
            return dispatch(replace(otherwise));    
        }
    };
}

const webActions = {
    grStateGo, // GR State 轉址
    grStateReplace, // GR State 轉址（不會記錄上下頁）
    grStateGoOtherwise, // GR State 轉至預設頁
};

export default webActions;