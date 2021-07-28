/*=====================================
    GR Router View

    Author: Gray
    createtime: 2021 / 07 / 27
=====================================*/

/*--------------------------
    Import
--------------------------*/
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GRRouter from "./GRRouter";
import actionCreators from "../../../actions/creators";

/*--------------------------
    Main Component
--------------------------*/
class GRRouterView extends PureComponent {

    // ------------------------------
    // componentWillMount
    // ------------------------------
    componentWillMount() {

        const {
            history,
        } = this.props

        const {
            location,
            action,
        } = history;

        GRRouter.updateCurrent(location, action);

        if(GRRouter.isUnknowState()) {
            this.props.webActions.grStateGoOtherwise();
        }

        // 不是Route物件內的components不會感覺到history的變動，所以必須監聽事件，
        // 但是listen事件沒有辦法移除，所以會變成會一直 componentDidMount 跟 componentWillUnmount 的 components 不能執行這個動作
        history.listen((new_location, new_action) => {
            GRRouter.updateCurrent(new_location, new_action);

            if(GRRouter.isUnknowState()) {
                this.props.webActions.grStateGoOtherwise();
            }
        });
    }

    // ------------------------------
    // render
    // ------------------------------
    render() {
        return (
            <>
                {this.props.children}
            </>
        );
    }
}

/*--------------------------
    Reducer Props
--------------------------*/
const mapStateToProps = function(state) {
    return {
        history: state.web.history,
    };
};

/*--------------------------
    Reducer Action
--------------------------*/
const mapActionToProps = function(dispatch) {
    return {
        webActions: bindActionCreators(actionCreators.webActionCreators, dispatch),
    };
};

/*--------------------------
    export
--------------------------*/
export default connect(mapStateToProps, mapActionToProps, null, {
    forwardRef: true
})(GRRouterView);