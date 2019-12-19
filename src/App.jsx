import React from 'react';
import { Container, Accordion } from 'react-bootstrap';
import { AccordionWorkshopCard } from './WorkshopCard';
import WorkshopForm from './WorkshopForm';
import './App.css';
import index from "./workshops.json"

function App(props) {
  return (
    <div className="app">
      <Container>
        <Accordion>
          { index.workshops.map((x, y) => <AccordionWorkshopCard Key={ y } key={ y.toString() } Workshop={ x }></AccordionWorkshopCard>) }
        </Accordion>
        <div className="separator"></div>
        <WorkshopForm Classes={ ["extern", "10a", "10b", "10c", "10d", "10e"] } Workshops={ index.workshops }>
        </WorkshopForm>
      </Container>
    </div>


  );
}

export default App;
