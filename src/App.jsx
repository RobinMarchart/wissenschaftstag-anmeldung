import React from 'react';
import {Container} from 'react-bootstrap';
import Workshop from './Workshop';
import WorkshopForm from './WorkshopForm';
import './App.css';

function App(props) {
  return (
    <div className="app">
      <Container>
      <div className={"workshop-list"}>
      {props.Workshops.map((x,y)=><Workshop key={y.toString()} Workshop={x}></Workshop>)}
      </div>
      <WorkshopForm Classes={props.Classes}>
      </WorkshopForm>
    </Container>
    </div>
    
    
  );
}

export default App;
