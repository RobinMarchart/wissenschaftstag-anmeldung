import React from 'react';
import {Container} from 'react-bootstrap';
import WorkshopCard from './WorkshopCard';
import './App.css';

function App(props) {
  return (
    <div className="app">
      <Container>
      {props.workshops.map(x=><WorkshopCard Title={x.title} Authors={x.authors} Image={x.image}>{x.description}</WorkshopCard>)}
    </Container>
    </div>
    
    
  );
}

export default App;
