import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './AppRouter';
import { BrowserRouter } from "react-router-dom";
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import store from './utils/store'

// BrowserRouter explanation: https://reacttraining.com/react-router/web/guides/primary-components

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
