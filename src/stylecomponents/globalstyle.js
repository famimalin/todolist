/*=====================================
	global style

	Author: Gray
	CreateTime: 2021 / 07 / 27
=====================================*/

import styled, { css, keyframes } from 'styled-components';
import Colors from './colors';

/*--------------------------
    Style Variables
--------------------------*/
const ContainerMaxWidth = 600;
const TopbarHeight = 60;
const TopbarZindex = 950;

/*--------------------------
    Style Keyframes
--------------------------*/
const rotate360 = keyframes`
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
`;

/*--------------------------
    CSS
--------------------------*/
const imageBackgroundCSS = css`
	background-color: ${Colors.ImgBackground};
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
`;

/*--------------------------
    Style Component
--------------------------*/
const RootContainer = styled.div`
	position: relative;
	margin: 0 auto;
	padding: 0;
	width: 100%;
	max-width: ${ContainerMaxWidth}px;
	min-height: 100vh;
	height: 100%;
`;
const ViewContainer = styled.div`
	position: relative;
	padding: ${TopbarHeight}px 0 0 0px;
`;
const Topbar = styled.div`
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: ${TopbarHeight}px;
    background-color: ${Colors.Main};
    z-index: ${TopbarZindex};
    align-items: center;
`;
const TopbarMenuBtn = styled.div`
    display: inline-flex;
    width: ${TopbarHeight}px;
    height: ${TopbarHeight}px;
    color: #fff;
    font-size: 22px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
`;
const TopbarMenuTitle = styled.div`
    color: #fff;
    font-size: 16px;
`;
const TopbarActionTitle = styled.div`
    display: block;
	width: 100%;
	padding: 0 60px;
	color: #fff;
    font-size: 16px;
    text-align: center;
`;
const TopbarActionBtn = styled.div`
	position: absolute;
	display: inline-flex;
	top: 0;
    height: ${TopbarHeight}px;
	padding: 0 16px;
	color: #fff;
	font-size: 14px;
    cursor: pointer;
    align-items: center;
    justify-content: center;

	i {
		font-size: 20px;
	}
`;
const TopbarActionLeftBtn = styled(TopbarActionBtn)`
	left: 0;
`;
const TopbarActionRightBtn = styled(TopbarActionBtn)`
	right: 0;
`;
const Spin = styled.div`
	position: relative;
	vertical-align: sub;
	display: ${props => props.display ? props.display : 'inline-block'};
	width: ${props => props.size ? props.size : '20px'};
	height: ${props => props.size ? props.size : '20px'};
	margin: ${props => props.margin ? props.margin : '0 auto'};
	border-width: ${props => props.borderWidth ? props.borderWidth : '2px'};
	border-style: solid;
	border-top-color: ${props => props.bgColor ? props.bgColor : 'transparent'};
	border-left-color: ${props => props.bgColor ? props.bgColor : 'transparent'};
	border-right-color: ${props => props.color ? props.color : Colors.Main};
	border-bottom-color: ${props => props.color ? props.color : Colors.Main};
	border-radius: 100%;
	animation: ${rotate360} 0.6s linear infinite;
`;
const LoadingContainer = styled.div`
	position: relative;
	display: flex;
	width: 100%;
	height: ${props => props.height ? props.height : '112px'};
	align-items: center;
	justify-content: center;
`;
const LoadingSpinCenter = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
`;
const StatusContainer = styled.div`
	position: relative;
	width: 100%;
	padding: ${({ contentPadding }) => contentPadding ? contentPadding : '10px'};
	display: flex;
	flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
	background-color: ${({ BGColor }) => BGColor || 'transparent'};
`;
const StateContainer = styled.div`
	display: flex;
	position: relative;
	width: 100%;
	height: 300px;
	align-items: center;
	justify-content: center;
`;
const StateContent = styled.div`
	text-align: center;
	max-width: 480px;
`;
const StateTtile = styled.h3`
	font-size: 18px;
	margin: 0;
	color: ${Colors.Title};
`;
const StateDescription = styled.p`
	font-size: 16px;
	margin: 20px 0 0;
	color: ${Colors.Paragraph};
	a {
		display: inline-flex;
		margin: 0;
		padding: 0;
		text-decoration: underline;
		color: #333;
		font-weight: 600;
	}
`;
const StateAction = styled.div`
`;

const GlobalStyle = {
	/*--------------------------
		Variables
	--------------------------*/
	ContainerMaxWidth,
	TopbarHeight,
	TopbarZindex,

	/*--------------------------
		CSS
	--------------------------*/
	imageBackgroundCSS,

	/*--------------------------
		Component
	--------------------------*/
	RootContainer,
	ViewContainer,
	Topbar,
	TopbarMenuBtn,
	TopbarMenuTitle,
	TopbarActionTitle,
	TopbarActionLeftBtn,
	TopbarActionRightBtn,
	Spin,
	LoadingContainer,
	LoadingSpinCenter,
	StatusContainer,
	
	/*--------------------------
		State
	--------------------------*/
	StateContainer,
	StateContent,
	StateTtile,
	StateDescription,
	StateAction,
}

export default GlobalStyle;