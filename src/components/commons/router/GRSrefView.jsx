/*=====================================
    GR Sref View

    Author: Gray
    createtime: 2021 / 07 / 27
=====================================*/

/*--------------------------
    Import
--------------------------*/
import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import GRRouter from "./GRRouter";
import styled from 'styled-components';

/*--------------------------
    Main Component
--------------------------*/
class GRSrefView extends PureComponent {

    static propTypes = {
        statename: PropTypes.string.isRequired,
        params: PropTypes.object,
        querys: PropTypes.object,
        children: PropTypes.node,
        locationState: PropTypes.object,
        stylecomponent: PropTypes.any,
    };

    // ------------------------------
    // constructor
    // ------------------------------
    constructor(props) {

        // ----------------
        // props
        // ----------------
        super(props);

        this.clean_props = {...this.props};

        if(this.props.stylecomponent) {

            const newNavLink = styled(({
                active,
                padding,
                measure,
                ...rest
            }) => <NavLink {...rest} />)``;

            this.ViewComponent = this.props.stylecomponent.withComponent(newNavLink);
        } else {
            this.ViewComponent = NavLink;
        }

        // ----------------
        // state
        // ----------------
        this.state = {
            to: {
                pathname: '',
                state: undefined,
                search: undefined,
            },
        }
    }

    // ------------------------------
    // componentDidMount
    // ------------------------------
    componentDidMount() {

        this.init(this.props);
    }

    // ------------------------------
    // componentWillReceiveProps
    // ------------------------------
    componentWillReceiveProps(nextProps) {
        
        this.init(nextProps);
    }

    // ------------------------------
    // [private] 初始化
    // ------------------------------
    init(props) {

        const {
            statename,
            params,
            querys,
            locationState,
        } = this.props;

        const url = GRRouter.getPathname(statename, params);
        const search = GRRouter.getQueryUrl(querys);

        if(url === this.state.to.pathname && search === this.state.to.search) {
            return;
        }

        let newTo = Object.assign({}, this.state.to, {
            pathname: url,
            search: search,
            state: locationState,
        });

        // 全空的時候，要用空字串，才會正確連到root
        if(!url && !search && !locationState) {
            newTo = '';
        }

        this.setState({
            to: newTo,
        });
    }

    // ------------------------------
    // render
    // ------------------------------
    render() {

        const {
            statename,
            params,
            querys,
            children,
            stylecomponent,
            locationState,
            ...rest
        } = this.props;

        return (
            <this.ViewComponent 
                to={this.state.to}
                {...rest}
            >
                {this.props.children}
            </this.ViewComponent>
        );
    }
}

/*--------------------------
    export
--------------------------*/
export default GRSrefView;