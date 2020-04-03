import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';
import './stylesheets/index.scss';
// eslint-disable-next-line import/no-unresolved
import 'react-notifications-component/dist/scss/notification.scss';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// "start": "HOST='127.0.0.1' PORT='5000' react-scripts start",
