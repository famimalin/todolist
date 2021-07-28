/*=====================================
	web reducer

	Author: Gray
	CreateTime: 2021 / 07 / 27
=====================================*/

/*--------------------------
    Reducers
--------------------------*/
const reducers = {};

/*--------------------------
    Method
--------------------------*/

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