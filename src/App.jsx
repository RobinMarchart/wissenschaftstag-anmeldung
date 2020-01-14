import React from 'react';
import { Container, Accordion } from 'react-bootstrap';
import { AccordionWorkshopCard } from './WorkshopCard';
import WorkshopForm from './WorkshopForm';
import './App.css';
import index from "./workshops.json";
import Remote from "./remote";
import NotificationBar from "./NotificationBar";
import scheduler from "./scheduler";
import checkShortWorkshop from "./checkShortWorkshops"
import axios from "axios";

class App extends React.Component{
	constructor(props){
		super(props);
		this.state={notificationSystem:null,remoteWorkshops:[],availableShortWorkshops:[]};
		this.currentAvailableWorkshopsInitialized=false;
		this.remote=new Remote(index);
	}

	getWorkshopUsage(){
		axios.get(index.url+"/workshops").then(x=>{
			this.setState({remoteWorkshops:x.data,availableShortWorkshops:checkShortWorkshop(x.data.filter(x=>x[1].short))})
		}).catch((e)=>{
			console.error(e);
			if(e.response)this.state.notificationSystem.submit("Fehler: "+e.response.status,e.response.statusText);
			else this.state.notificationSystem.submit("Netzwerkfehler","");
		})
	}

	render(){
		if(!this.currentAvailableWorkshopsInitialized&&this.state.notificationSystem){
			this.scheduler=new scheduler(this.getWorkshopUsage(),120000)
			this.remote.setNot(this.state.notificationSystem);
			this.currentAvailableWorkshopsInitialized=true;
		}
		return (
		<div className="app">
			<Container>
				<Accordion>
					{index.workshops.map((x, y) => <AccordionWorkshopCard Key={y} key={y.toString()} Workshop={x} remoteWorkshop={this.state.remoteWorkshops}></AccordionWorkshopCard>)}
				</Accordion>
				<div className="separator"></div>
				<WorkshopForm Classes={index.classes} Workshops={index.workshops} Remote={this.remote.getHandle()} remoteWorkshops={this.state.remoteWorkshops} availableShortWorkshops={this.state.availableShortWorkshops}>
				</WorkshopForm>
			</Container>
			<NotificationBar ref={x=>{if(!this.state.notificationSystem)this.setState({notificationSystem:x});}}></NotificationBar>
		</div>
	);
	}
}


export default App;
