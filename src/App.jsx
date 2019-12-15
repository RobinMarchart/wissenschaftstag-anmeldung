import React from 'react';
import {Container,Accordion} from 'react-bootstrap';
import {AccordionWorkshopCard} from './WorkshopCard';
import WorkshopForm from './WorkshopForm';
import './App.css';

function App(props) {
  return (
    <div className="app">
      <Container>
      <Accordion>
      {props.Workshops.map((x,y)=><AccordionWorkshopCard Key={y} key={y.toString()} Workshop={x}></AccordionWorkshopCard>)}
      </Accordion>
      <div className="separator"></div>
      <WorkshopForm Classes={props.Classes} Workshops={props.Workshops}>
      </WorkshopForm>
    </Container>
    </div>
    
    
  );
}

export default App;
