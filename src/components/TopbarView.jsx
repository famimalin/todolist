/*=====================================
    Topbar

    Author: Gray
    CreateTime: 2021 / 07 / 27
=====================================*/

/*--------------------------
    Import
--------------------------*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import actionCreators from '../actions/creators';
import { GlobalStyle, Colors } from '../stylecomponents';
import GRRouter from './commons/router/GRRouter';
import globalutil from '../util/globalutil';

/*--------------------------
    Variable
--------------------------*/
const {
    STATES,
} = GRRouter;

const {
    TODO_CATEGORY_TYPE,
    getTodoCategoryTypeText,
} = globalutil;

/*--------------------------
    Styled
--------------------------*/
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: ${props => props.show ? 1 : 0};
    background-color: rgba(0,0,0,0.4);
    transition: opacity 0.3s;
    z-index: ${GlobalStyle.TopbarZindex + 1};
    user-select: none;
    pointer-events: none;
`;
const Sidebar = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: ${GlobalStyle.TopbarZindex + 2};
    transform: ${props => props.show ? 'none' : 'translateX(-100%)'};
    transition: transform 0.3s;
`;
const SidebarContent = styled.div`
    position: relative;
    width: 240px;
    max-width: 70%;
    height: 100%;
    background-color: #fff;
    z-index: 2;
`;
const SidebarOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`;
const SidebarHead = styled.div`
    display: flex;
    height: 120px;
    background-color: ${Colors.Main};
    align-items: center;
    justify-content: center;
`;
const SidebarHeadText = styled.div`
    line-height: 1.3;
    color: #fff;
    font-size: 20px;
    text-align: center;
`;
const NavItem = styled.div`
    display: flex;
    height: 40px;
    margin: 1px 0 0 0;
    border-left-width: 3px;
    border-left-style: solid;
    background-color: ${props => props.active ? '#eee' : '#fff'};
    color: ${Colors.Dark2};
    font-size: 14px;
    cursor: pointer;
    align-items: center;
`;
const NavItemAll = styled(NavItem)`
    border-left-color: ${Colors.AllColor}; 
`;
const NavItemSelf = styled(NavItem)`
    border-left-color: ${Colors.SelfColor};
`;
const NavItemWork = styled(NavItem)`
    border-left-color: ${Colors.WorkColor};
`;
const NavItemBuy = styled(NavItem)`
    border-left-color: ${Colors.BuyColor};
`;
const NavItemIcon = styled.div`
    display: flex;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    font-size: 16px;
`;

/*--------------------------
    Main Component
--------------------------*/
class TopbarView extends PureComponent {

    // ------------------------------
    // constructor
    // ------------------------------
    constructor(props) {

        super(props);

        this.state = {
            isShowMenu: false,
        };

        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.onNavClick = this.onNavClick.bind(this);
    }

    // ------------------------------
    // openMenu
    // ------------------------------
    openMenu() {

        this.setState({
            isShowMenu: true,
        });
    }

    // ------------------------------
    // closeMenu
    // ------------------------------
    closeMenu() {

        this.setState({
            isShowMenu: false,
        });
    }

    // ------------------------------
    // onNavClick
    // ------------------------------
    onNavClick(statename) {

        this.props.webActions.grStateGo(statename);
        this.closeMenu();
    }

    // ------------------------------
    // renderMenuTopbar
    // ------------------------------
    renderMenuTopbar() {

        const {
            isShowMenu,
        } = this.state

        const {
            title,
        } = this.props;

        return (
            <>
                <GlobalStyle.Topbar>
                    <GlobalStyle.TopbarMenuBtn onClick={this.openMenu}>
                        <i className="zmdi zmdi-menu"></i>
                    </GlobalStyle.TopbarMenuBtn>
                    <GlobalStyle.TopbarMenuTitle>{title}</GlobalStyle.TopbarMenuTitle>
                </GlobalStyle.Topbar>
                <Overlay show={isShowMenu}></Overlay>
                <Sidebar show={isShowMenu}>
                    <SidebarOverlay onClick={this.closeMenu}></SidebarOverlay>
                    <SidebarContent>
                        <SidebarHead>
                            <SidebarHeadText>
                                ToDo<br/>List
                            </SidebarHeadText>
                        </SidebarHead>
                        <NavItemAll
                            onClick={() => this.onNavClick(STATES.HOME)}
                            active={GRRouter.isActive(STATES.HOME)}
                        >
                            <NavItemIcon>
                                <i className="zmdi zmdi-apps"></i>
                            </NavItemIcon>
                            {getTodoCategoryTypeText(TODO_CATEGORY_TYPE.ALL)}
                        </NavItemAll>
                        <NavItemSelf
                            onClick={() => this.onNavClick(STATES.SELF)}
                            active={GRRouter.isActive(STATES.SELF)}
                        >
                            <NavItemIcon>
                                <i className="zmdi zmdi-account"></i>
                            </NavItemIcon>
                            {getTodoCategoryTypeText(TODO_CATEGORY_TYPE.SELF)}
                        </NavItemSelf>
                        <NavItemWork
                            onClick={() => this.onNavClick(STATES.WORK)}
                            active={GRRouter.isActive(STATES.WORK)}
                        >
                            <NavItemIcon>
                                <i className="zmdi zmdi-case"></i>
                            </NavItemIcon>
                            {getTodoCategoryTypeText(TODO_CATEGORY_TYPE.WORK)}
                        </NavItemWork>
                        <NavItemBuy
                            onClick={() => this.onNavClick(STATES.BUY)}
                            active={GRRouter.isActive(STATES.BUY)}
                        >
                            <NavItemIcon>
                                <i className="zmdi zmdi-shopping-cart"></i>
                            </NavItemIcon>
                            {getTodoCategoryTypeText(TODO_CATEGORY_TYPE.BUY)}
                        </NavItemBuy>
                    </SidebarContent>
                </Sidebar>
                    
            </>
        );
    }

    // ------------------------------
    // renderActionTopbar
    // ------------------------------
    renderActionTopbar() {

        const {
            title,
            leftComponent,
            rightComponent,
        } = this.props;

        return (
            <GlobalStyle.Topbar>
                {leftComponent}
                <GlobalStyle.TopbarActionTitle>{title}</GlobalStyle.TopbarActionTitle>
                {rightComponent}
            </GlobalStyle.Topbar>
        );
    }

    // ------------------------------
    // render
    // ------------------------------
    render() {

        const {
            layoutType,
        } = this.props;

        switch(layoutType) {
            case 'menu':
                return this.renderMenuTopbar();
            case 'action':
                return this.renderActionTopbar();
            default:
                return null;
        }
    }
}

/*--------------------------
    Props
--------------------------*/
TopbarView.propTypes = {
    title: PropTypes.string,
    layoutType: PropTypes.oneOf(['menu', 'action']),
    leftComponent: PropTypes.node,
    rightComponent: PropTypes.node,
}; 

TopbarView.defaultProps = {
    title: 'ToDo',
    layoutType: 'menu',
    leftComponent: null,
    rightComponent: null,
};

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
})(TopbarView);