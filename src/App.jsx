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
import ReactMarkdown from "react-markdown";

class App extends React.Component{
	constructor(props){
		super(props);
		this.state={notificationSystem:null,remoteWorkshops:[],availableShortWorkshops:[]};
		this.currentAvailableWorkshopsInitialized=false;
		this.remote=new Remote(index);
	}

	getWorkshopUsage(){
		axios.get(index.url+"/workshops").then(x=>{
			let shorts=x.data.filter(x2=>x2[1].short);
			this.setState({remoteWorkshops:x.data,availableShortWorkshops:checkShortWorkshop(shorts)})
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
			this.remote.setCallback(async ()=>this.scheduler.run_now())
			this.currentAvailableWorkshopsInitialized=true;
		}
		return (
		<div className="app">
			<Container>
				<ReactMarkdown escapeHtml={ false } source={index.descr}></ReactMarkdown>
				<div className="separator"></div>
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
