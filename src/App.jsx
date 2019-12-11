import React from 'react';
import {Container} from 'react-bootstrap';
import Workshop from './Workshop';
import './App.css';

function App(props) {
  return (
    <div className="app">
      <Container>
      {props.workshops.map((x,y)=><Workshop key={y.toString()} Workshop={x}></Workshop>)}
    </Container>
    </div>
    
    
  );
}

export default App;
