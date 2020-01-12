import React from 'react';
import { Container, Accordion } from 'react-bootstrap';
import { AccordionWorkshopCard } from './WorkshopCard';
import WorkshopForm from './WorkshopForm';
import './App.css';
import index from "./workshops.json"
import Remote from "./remote";
import NotificationBar from "./NotificationBar"

class App extends React.Component{
	constructor(props){
		super(props);
		this.state={notificationSystem:null};
	}
	render(){
		return (
		<div className="app">
			<Container>
				<Accordion>
					{index.workshops.map((x, y) => <AccordionWorkshopCard Key={y} key={y.toString()} Workshop={x}></AccordionWorkshopCard>)}
				</Accordion>
				<div className="separator"></div>
				<WorkshopForm Classes={index.classes} Workshops={index.workshops} Remote={new Remote(index)}>
				</WorkshopForm>
			</Container>
			<NotificationBar ref={x=>{if(!this.state.notificationSystem)this.setState({notificationSystem:x});}}></NotificationBar>
		</div>
	);
	}
}


export default App;
