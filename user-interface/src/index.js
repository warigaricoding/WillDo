import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './bootstrap.css'
import Grouptab from './components/grouptab';
import Tasktab from './components/tasktab';

//ReactDOM.render(<Frame />, document.getElementById('root'));
ReactDOM.render(<Grouptab />, document.getElementById('root'));
ReactDOM.render(<Tasktab />, document.getElementById('root'));



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
