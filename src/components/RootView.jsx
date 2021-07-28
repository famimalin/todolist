/*=====================================
    Root

    Author: Gray
    CreateTime: 2021 / 07 / 27
=====================================*/

/*--------------------------
    Import
--------------------------*/
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actionCreators from '../actions/creators';
import { GlobalStyle } from '../stylecomponents';
import GRRouterView from './commons/router/GRRouterView';
import GRRouterSwitchView from './commons/router/GRRouterSwitchView';
import 'react-confirm-alert/src/react-confirm-alert.css';

/*--------------------------
    Main Component
--------------------------*/
class RootView extends Component {

    // ------------------------------
    // constructor
    // ------------------------------
    constructor(props) {

        super(props);

        this.state = {

        };
    }

    // ------------------------------
    // componentDidMount
    // ------------------------------
    componentDidMount() {

    }

    // ------------------------------
    // render
    // ------------------------------
    render() {

        const {
            history,
        } = this.props;

        return (
            <GRRouterView>
                <ConnectedRouter history={history}>
                    <GlobalStyle.RootContainer>
                        <Route component={GRRouterSwitchView} />
                    </GlobalStyle.RootContainer>
                </ConnectedRouter>
            </GRRouterView>
        );
    }
}

/*--------------------------
    Redux Props
--------------------------*/
const mapStateToProps = function(state) {
    return {
        history: state.web.history,
    };
};

/*--------------------------
    Redux Action
--------------------------*/
const mapActionToProps = function(dispatch) {
    return {
        webActions: bindActionCreators(actionCreators.webActionCreators, dispatch),
    };
};

/*--------------------------
    Export
--------------------------*/
export default connect(mapStateToProps, mapActionToProps, null, {
    forwardRef: true
})(RootView);