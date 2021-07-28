/*=====================================
    actionMiddlewares

    Author: Gray
    CreateTime: 2021 / 07 / 27
=====================================*/

const logger = store => next => action => {
    let result = next(action);
    return result;
};
  
const crashReporter = store => next => action => {
    try {
        return next(action);
    } catch (err) {
        console.error(err);
        throw err;
    }
};
  
export { logger, crashReporter };  