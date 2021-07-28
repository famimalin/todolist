/*=====================================
    TodoListView

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
import GRRouter from './commons/router/GRRouter';
import GRSrefView from './commons/router/GRSrefView';
import { GlobalStyle, Colors } from '../stylecomponents';
import TimeFormat, { FORMAT_TYPE } from "./commons/TimeFormat";
import TopbarView from './TopbarView';
import globalutil from '../util/globalutil';

/*--------------------------
    Variable
--------------------------*/
const {
    STATES,
} = GRRouter;

const {
    TODO_CATEGORY_TYPE,
    TODO_STATE,
    getTodoCategoryTypeText,
} = globalutil;

/*--------------------------
    Styled
--------------------------*/
const Content = styled.div`
    padding: 0 10px;
`;
const ListTitle = styled.div`
    display: flex;
    height: 40px;
    color: ${Colors.Dark};
    font-size: 14px;
    cursor: pointer;
    align-items: center;

    i {
        margin: 0 6px 0 auto;
        font-size: 18px;
    }
`;
const List = styled.div`
    padding: 0 2px;
`;
const ListEmpty = styled.div`
    height: 50px;
    line-height: 50px;
    color: ${Colors.Dark5};
    font-size: 12px;
    text-align: center;
`;
const Item = styled.div`
    display: flex;
    margin: 0 0 4px 0;
    padding: 12px;
    border-left-width: 3px;
    border-left-style: solid;
    border-left-color: ${props => props.color ? props.color : '#f3f3f3'};
    border-radius: 5px;
    background-color: #f3f3f3;
    align-items: center;
`;
const CheckBox = styled.div`
    display: inline-flex;
    width: 20px;
    min-width: 20px;
    height: 20px;
    margin: 0 12px 0 0;
    border: 2px solid #ccc;
    border-radius: 50%;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    align-items: center;
    justify-content: center;

    i {
        opacity: 0;
    }

    ${props => {
        if(props.active) {
            return `
                background-color: #ccc;

                i {
                    opacity: 1;
                }
            `;
        }
    }}
`;
const ItemTextWrapper = styled.div`
    display: block;
`;
const ItemTitle = styled.div`
    color: ${Colors.Dark};
    font-size: 14px;
`;
const ItemMeta = styled.div`
    color: ${Colors.Dark5};
    font-size: 12px;
`;
const AddBtn = styled.div`
    position: fixed;
    display: flex;
    right: 20px;
    bottom: 20px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    color: #fff;
    font-size: 24px;
    background-color: ${Colors.Main};
    cursor: pointer;
    align-items: center;
    justify-content: center;
    z-index: 2;
    box-shadow: #ddd 0px 3px 8px;
`;

/*--------------------------
    Main Component
--------------------------*/
class TodoListView extends PureComponent {

    // ------------------------------
    // constructor
    // ------------------------------
    constructor(props) {

        super(props);

        this.state = {
            foldMap: {},
        };

        this.toogleFold = this.toogleFold.bind(this);
        this.toogleFinishTodo = this.toogleFinishTodo.bind(this);
        this.editTodo = this.editTodo.bind(this);
    }

    // ------------------------------
    // componentDidMount
    // ------------------------------
    componentDidMount() {

        this.getTodoData();
    }

    // ------------------------------
    // getTodoData
    // ------------------------------
    getTodoData() {

        const {
            isTodoLoading,
            isTodoLoadError,
            isTodoLoaded,
        } = this.props;

        if(isTodoLoading || isTodoLoadError || isTodoLoaded) {
            return;
        }

        this.props.todoActions.getTodoData().then((result) => {

        }, (error) => {

        });
    }

    // ------------------------------
    // toogleFold
    // ------------------------------
    toogleFold(key) {

        const {
            foldMap,
        } = this.state;

        const isFold = foldMap[key];
        const new_foldMap = Object.assign({}, foldMap, {
            [key]: !isFold
        });

        this.setState({
            foldMap: new_foldMap,
        })
    }

    // ------------------------------
    // toogleFinishTodo
    // ------------------------------
    toogleFinishTodo(event, todo) {

        event.stopPropagation();

        const {
            id,
            state,
        } = todo;

        if(state !== TODO_STATE.FINISH) {
            this.props.todoActions.finishTodo({
                id: id,
            });
        } else {
            this.props.todoActions.resetTodo({
                id: id,
            });
        }
    }

    // ------------------------------
    // editTodo
    // ------------------------------
    editTodo(id) {

        this.props.webActions.grStateGo(STATES.EDIT, {
            id: id,
        });
    }

    // ------------------------------
    // renderList
    // ------------------------------
    renderList(key, name, listObj, hideEmptyState) {

        const {
            foldMap,
        } = this.state;

        const isFold = foldMap[key];
        const list = listObj[key] || [];
        const isEmpty = list.length === 0;

        if(isEmpty && hideEmptyState) {
            return null;
        }

        return (
            <>
                <ListTitle onClick={() => this.toogleFold(key)}>
                    {name}
                    {!isEmpty ? ` (${list.length})` : null}

                    {isFold ?
                        <i className="zmdi zmdi-caret-down"></i>
                        :
                        <i className="zmdi zmdi-caret-up"></i>
                    }
                </ListTitle>
                {isFold ?
                    null
                    :
                    <List>
                        {list.map((id, index) => {
                            return this.renderItem(id, index);
                        })}

                        {list.length === 0 ?
                            <ListEmpty>
                                目前沒有代辦任務，點擊+新增任務。
                            </ListEmpty>
                            :
                            null
                        }
                    </List>
                }
            </>
        )
    }

    // ------------------------------
    // renderItem
    // ------------------------------
    renderItem(id, key) {

        const {
            todoMap,
        } = this.props;

        const todo = todoMap[id];

        if(!todo) {
            return null;
        }

        const {
            title,
            category,
            todotime,
            state,
        } = todo;

        if(state === TODO_STATE.DELETE) {
            return null;
        }

        let color;

        switch(category) {
            case TODO_CATEGORY_TYPE.ALL:
                color = Colors.AllColor;
                break;
            case TODO_CATEGORY_TYPE.SELF:
                color = Colors.SelfColor;
                break;
            case TODO_CATEGORY_TYPE.WORK:
                color = Colors.WorkColor;
                break;
            case TODO_CATEGORY_TYPE.BUY:
                color = Colors.BuyColor;
                break;
            default:
                color = Colors.AllColor;
                break;
        }

        return (
            <Item key={key} color={color} onClick={() => this.editTodo(id)}>
                <CheckBox active={state === TODO_STATE.FINISH} onClick={(event) => this.toogleFinishTodo(event, todo)}>
                    <i className="zmdi zmdi-check"></i>
                </CheckBox>
                <ItemTextWrapper>
                    <ItemTitle>{title}</ItemTitle>
                    <ItemMeta>
                        <TimeFormat
                            time={todotime}
                            format={FORMAT_TYPE.FULLTIME_DASH_STRING}
                        />
                    </ItemMeta>
                </ItemTextWrapper>                
            </Item>
        )
    }

    // ------------------------------
    // render
    // ------------------------------
    render() {

        const {
            category,
            todoList,
        } = this.props;

        const listObj = todoList[category] ||　{};
        let title = `Todo - ${getTodoCategoryTypeText(category)}`;

        return (
            <GlobalStyle.ViewContainer>
                <TopbarView
                    title={title}
                    layoutType="menu"
                />
                <Content>
                    {this.renderList('today', '今天', listObj)}
                    {this.renderList('others', '代辦', listObj)}
                    {this.renderList('success', '完成', listObj, true)}

                    <GRSrefView
                        statename={STATES.ADD}
                        stylecomponent={AddBtn}
                    >
                        <i className="zmdi zmdi-plus"></i>
                    </GRSrefView>
                </Content>
            </GlobalStyle.ViewContainer>
        );
    }
}

/*--------------------------
    Props
--------------------------*/
TodoListView.propTypes = {
    category: PropTypes.oneOf([
        TODO_CATEGORY_TYPE.ALL, TODO_CATEGORY_TYPE.SELF, TODO_CATEGORY_TYPE.WORK, TODO_CATEGORY_TYPE.BUY,
    ]),
}; 

TodoListView.defaultProps = {
    category: TODO_CATEGORY_TYPE.ALL,
};

/*--------------------------
    Redux Props
--------------------------*/
const mapStateToProps = function(state) {
    return {
        isTodoLoading: state.todo.isTodoLoading,
        isTodoLoadError: state.todo.isTodoLoadError,
        isTodoLoaded: state.todo.isTodoLoaded,
        todoMap: state.todo.todoMap,
        todoList: state.todo.todoList,
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
})(TodoListView);