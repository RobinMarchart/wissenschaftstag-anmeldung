import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import workshops from './workshops.zip';
import WorkshopsList from './WorkshopsList';

async function init(){
    let workshopsList=await WorkshopsList(workshops)
    ReactDOM.render(<App Workshops={workshopsList} Classes={["extern","10a","10b"]}/>, document.getElementById('root'));
}

init().then(()=>serviceWorker.unregister()).catch(reason=>console.error(reason));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
