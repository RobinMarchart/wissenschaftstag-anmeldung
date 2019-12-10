import React from 'react';
import {Container} from 'react-bootstrap';
import WorkshopCard from './WorkshopCard';
import './App.css';
import ente from './Ente.jpg';


function App() {
  return (
    <div className="app">
      <Container>
      <WorkshopCard Title="TEST TITLE" Authors="ICH" Image={{src:ente,alt:'Ente'}}>
      THIS IS AN EXAMPLE DESCRIPTION
    </WorkshopCard>
    <WorkshopCard Title="Workshop 2" Authors="ICH &amp; ICH" Image={{src:ente,alt:'Ente2'}}>
      dfglhdfg sgh  hsfg hkgfdh f hgf hbfgks b sfb kjfgs bkj gf bjkfs bfgb fg bkdjsf gbjkjb   gjn sdf gdfb fgjkds bdfsgb fds gdsf gfd g bfsg fds gdfs g sdf fds g dsfh sdg hsdf g gh dfgh
    </WorkshopCard>
    </Container>
    </div>
    
    
  );
}

export default App;
