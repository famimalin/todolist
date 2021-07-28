/*=====================================
    GR state class

    Author: Gray
    createtime: 2021 / 07 / 27
=====================================*/

/*--------------------------
    class
--------------------------*/
class GRState {

    // ------------------------------
    // constructor
    // ------------------------------
    constructor(name, path) {

        if(name === undefined || path === undefined) {
            throw new Error('GRState constructor error');
        }

        this.name = name;
        this.path = path;
        this.parent = undefined;

        const dotIndex = this.name.lastIndexOf('.');

        if(dotIndex !== -1) {
            this.parent = this.name.substr(0, dotIndex);
        }
    }

    // ------------------------------
    // 傳入的state是否為目前state的state或是父state
    // ------------------------------
    includes(statename) {

        if(!statename) {
            return false;
        }

        const index = this.name.indexOf(statename);

        return index === 0;
    }

    // ------------------------------
    // 取得實際網址
    // ------------------------------
    getUrl(params) {

        if(this.path === '' || this.path === '/') {
            return '/';
        }
        
        var url_params = this.path.split('/');
        var url_param;
        var param;
        var url = "";

        for(var i = 0; i < url_params.length; i++) {
            url_param = url_params[i];

            if(url_param.indexOf(':') === 0) {
                url_param = url_param.substr(1);
                param = (params && (params[url_param] !== undefined || params[url_param] !== null)) ? params[url_param] : "";
                url = url.concat("/").concat(param);
            } else if(url_param) {
                url = url.concat("/").concat(url_param);
            }
        }

        return url;
    }
}

/*--------------------------
    export
--------------------------*/
export default GRState;