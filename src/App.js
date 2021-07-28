import React from 'react';
import { Provider } from 'react-redux';
import actionStore from './actions/store/configureStore';
import RootView from './components/RootView';
import './index.css';

function App() {
    return (
        <Provider store={actionStore}>
            <RootView />
        </Provider>
    );
}

export default App;