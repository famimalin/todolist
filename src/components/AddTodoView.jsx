/*=====================================
    AddTodoView

    Author: Gray
    CreateTime: 2021 / 07 / 27
=====================================*/

/*--------------------------
    Import
--------------------------*/
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import AutoSizeTextarea from 'react-textarea-autosize';
import actionCreators from '../actions/creators';
import GRRouter from './commons/router/GRRouter';
import { GlobalStyle, Colors } from '../stylecomponents';
import TopbarView from './TopbarView';
import TimeFormat, { FORMAT_TYPE } from "./commons/TimeFormat";
import globalutil from '../util/globalutil';
import {
    isBrowser,
    isMobile,
} from "react-device-detect";

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
const TitleTextarea = styled(AutoSizeTextarea)`
    padding: 20px 12px;
    width: 100%;
    min-height: 160px;
    line-height: 20px;
    border: 0;
    color: ${Colors.Dark};
    font-size: 15px;
    resize: none;
`;
const OptionRow = styled.label`
    position: relative;
    display: flex;
    height: 50px;
    padding: 0;
    border-top: 1px solid #eee;
    align-items: center;
    color: ${Colors.Dark3};
    font-size: 12px;
    cursor: pointer;

    &:last-child {
        border-bottom: 1px solid #eee;
    }
`;
const OptionRowIcon = styled.div`
    display: inline-flex;
    width: 50px;
    height: 50px;
    color: ${Colors.Dark3};
    font-size: 16px;
    align-items: center;
    justify-content: center;
`;
const OptionRowResult = styled.div`
    display: inline-block;
    margin: 0 16px 0 auto;
    padding: 4px 10px;
    border-radius: 8px;
    color: ${Colors.Dark2};
    font-size: 12px;
    background-color: ${Colors.LightBlue};
`;
const OptionRowHideSelect = styled.select`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 2;
    cursor: pointer;
`;
const OptionRowDateInput = styled.input`
    display: inline-block;
    margin: 0 16px 0 auto;
    padding: 4px 10px;
    border: none;
    border-radius: 8px;
    color: ${Colors.Dark2};
    font-size: 12px;
    background-color: ${Colors.LightBlue};
`;
const OptionRowHideDateInput = styled.input`
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    opacity: 0;
`;

/*--------------------------
    Main Component
--------------------------*/
class AddTodoView extends PureComponent {

    // ------------------------------
    // constructor
    // ------------------------------
    constructor(props) {

        super(props);

        this.state = {
            title: '',
            category: TODO_CATEGORY_TYPE.ALL,
            dateStr: '',
            time: 0,
        };

        this.goBack = this.goBack.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
        this.sumbit = this.sumbit.bind(this);
    }

    // ------------------------------
    // goBack
    // ------------------------------
    goBack() {

        const history = GRRouter.getHistory();

        if(!Array.isArray(history) || history.length <= 1) {
            this.props.webActions.grStateGo(STATES.HOME);
            return;
        }

        const size = history.length;

        let prevState = undefined;

        for(var i = size - 1; i--; i >= 0) {
            prevState = history[i];

            if(prevState && prevState.state.name !== STATES.ADD) {
                break;
            }
        }
        
        if(prevState) {
            this.props.webActions.grStateGo(prevState.state.name);
            return;
        }
        
        this.props.webActions.grStateGo(STATES.HOME);
    }

    // ------------------------------
    // onTitleChange
    // ------------------------------
    onTitleChange(event) {

        this.setState({
            title: event.target.value,
        });
    }

    // ------------------------------
    // onCategoryChange
    // ------------------------------
    onCategoryChange(event) {

        this.setState({
            category: event.target.value,
        });
    }

    // ------------------------------
    // onTimeChange
    // ------------------------------
    onTimeChange(event) {

        const dateStr = event.target.value;
        const date = new Date(dateStr);
        const time = date.getTime();

        this.setState({
            dateStr: dateStr,
            time: time,
        });
    }

    // ------------------------------
    // sumbit
    // ------------------------------
    sumbit() {

        let {
            title = '',
            category,
            time,
        } = this.state;

        title = title.trim();
        time = time > 0 ? time : Date.now();
        
        if(!title) {
            return;
        }

        this.props.todoActions.addTodo({
            title: title,
            time: time,
            category: category,
        });

        this.goBack();
    }

    // ------------------------------
    // render
    // ------------------------------
    render() {

        const {
            title,
            category,
            dateStr,
            time,
        } = this.state;

        return (
            <GlobalStyle.ViewContainer>
                <TopbarView
                    title={"新增 Todo"}
                    layoutType="action"
                    leftComponent={
                        <GlobalStyle.TopbarActionLeftBtn onClick={this.goBack}>
                            <i className="zmdi zmdi-chevron-left"></i>
                        </GlobalStyle.TopbarActionLeftBtn>
                    }
                    rightComponent={
                        <GlobalStyle.TopbarActionRightBtn onClick={this.sumbit}>
                            送出
                        </GlobalStyle.TopbarActionRightBtn>
                    }
                />
                <TitleTextarea
                    minRows={1}
                    placeholder='在這裡輸入新任務'
                    value={title}
                    onChange={this.onTitleChange}
                />
                <OptionRow>
                    <OptionRowIcon>
                        <i className="zmdi zmdi-label-alt"></i>
                    </OptionRowIcon>
                    分類
                    <OptionRowResult>{getTodoCategoryTypeText(category)}</OptionRowResult>

                    <OptionRowHideSelect
                        value={category}
                        onChange={this.onCategoryChange}
                    >
                        <option value={TODO_CATEGORY_TYPE.ALL}>{getTodoCategoryTypeText(TODO_CATEGORY_TYPE.ALL)}</option>
                        <option value={TODO_CATEGORY_TYPE.SELF}>{getTodoCategoryTypeText(TODO_CATEGORY_TYPE.SELF)}</option>
                        <option value={TODO_CATEGORY_TYPE.WORK}>{getTodoCategoryTypeText(TODO_CATEGORY_TYPE.WORK)}</option>
                        <option value={TODO_CATEGORY_TYPE.BUY}>{getTodoCategoryTypeText(TODO_CATEGORY_TYPE.BUY)}</option>
                    </OptionRowHideSelect>
                </OptionRow>
                <OptionRow>
                    <OptionRowIcon>
                        <i className="zmdi zmdi-time"></i>
                    </OptionRowIcon>
                    預定時間
                    
                    {isBrowser ? 
                        <OptionRowDateInput
                            type="datetime-local"
                            value={dateStr}
                            onChange={this.onTimeChange}
                        />
                        :
                        null
                    }
                    {isMobile ?
                        <OptionRowHideDateInput
                            type="datetime-local"
                            value={dateStr}
                            onChange={this.onTimeChange}
                        />
                        :
                        null
                    }
                    {isMobile && time > 0 ?
                        <OptionRowResult>
                            <TimeFormat
                                time={time}
                                format={FORMAT_TYPE.FULLTIME_DASH_STRING}
                            />
                        </OptionRowResult>
                        :
                        null
                    }
                </OptionRow>
            </GlobalStyle.ViewContainer>
        );
    }
}

/*--------------------------
    Redux Props
--------------------------*/
const mapStateToProps = function(state) {
    return {
    };
};

/*--------------------------
    Redux Action
--------------------------*/
const mapActionToProps = function(dispatch) {
    return {
        webActions: bindActionCreators(actionCreators.webActionCreators, dispatch),
        todoActions: bindActionCreators(actionCreators.todoActionCreators, dispatch),
    };
};

/*--------------------------
    Export
--------------------------*/
export default connect(mapStateToProps, mapActionToProps, null, {
    forwardRef: true
})(AddTodoView);