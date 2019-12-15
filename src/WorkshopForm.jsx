import React from "react";
import {Form,Col, Button} from "react-bootstrap";
import {WorkshopCard} from "./WorkshopCard";
import {getRegistration,setRegistration} from "./LocalWorkshopRegistrations";
import Finished from "./Finished"
import "./WorkshopForm.css"

export default class WorkshopForm extends React.Component{

    constructor(props){
        super(props)
        this.state={workshop:getRegistration(),chosen:"",send:null};
        if(this.state.workshop)this.state.chosen=this.state.workshop[3];
        this.form={};
        this.changed=false;
        //display warning as user leaves
        window.addEventListener("beforeunload",this.warnIfUnsaved.bind(this));
    }

    warnIfUnsaved(event){
        if(this.changed&&!this.state.send){
            let notsaved="Nicht alle änderungen wurden gesendet!";
            let notsend="Nicht alle Änderungen wurden gesendet, bitte kurz warten!";
            let message=(this.state.send===null)?notsaved:notsend;
            (event || window.event).returnValue = message;
            return message;
        }
        else return undefined
    }

    handleSubmit(x){
        x.preventDefault();
        let registration=[this.form.name1.value,this.form.name2.value,this.form.class.value,this.form.workshop.value];
        console.debug(registration);
        setRegistration(registration);
        this.setState({workshop:registration,send:false});
    }

    handleWorkshopChange(x){
        this.setState({chosen:this.form.workshop.value,send:null});
        this.changed=true;
    }

    RenderChosenWorkshop(){
        if(this.state.chosen){
            let workshop=this.props.Workshops.find(x=>x.title===this.state.chosen);
            if(workshop)return <WorkshopCard Workshop={workshop}/>
        }
    }
    handleStateChange(){
        this.setState({send:null})
        this.changed=true;
    }

    render(){
        if(this.props.ThisRef)this.props.ThisRef(this);
        return <Form onSubmit={this.handleSubmit.bind(this)}>

        <Form.Row>
        <Form.Group controlId="formName1" as={Col} md="4">
        <Form.Label>Vorname</Form.Label>
        <Form.Control required type="text" onChange={this.handleStateChange.bind(this)} placeholder="Otto" defaultValue={(this.state.workshop)?this.state.workshop[0]:null} ref={ref=>this.form.name1=ref}></Form.Control>
        </Form.Group>

        <Form.Group controlId="formName2" as={Col} md="4">
        <Form.Label>Nachname</Form.Label>
        <Form.Control required type="text" onChange={this.handleStateChange.bind(this)} placeholder="Maier" defaultValue={(this.state.workshop)?this.state.workshop[1]:null} ref={ref=>this.form.name2=ref}></Form.Control>
        </Form.Group>
		
		<Form.Group controlId="formClass" as={Col} md="4">
		<Form.Label>Classe</Form.Label>
		<Form.Control as="select" onChange={this.handleStateChange.bind(this)}  defaultValue={(this.state.workshop)?this.state.workshop[2]:null} ref={ref=>this.form.class=ref}>
            {this.props.Classes.map((x,y)=><option key={y.toString()}>{x}</option>)}
        </Form.Control>
		</Form.Group>
        </Form.Row>

        <Form.Group controlId="formWorkshop">
        <Form.Label>Workshop</Form.Label>
        <Form.Control as="select" defaultValue={(this.state.workshop)?this.state.workshop[3]:null} onChange={this.handleWorkshopChange.bind(this)} ref={ref=>this.form.workshop=ref}>
        {this.props.Workshops.map((x,y)=><option key={y.toString()}>{x.title}</option>)}
        </Form.Control>
        </Form.Group>

        {this.RenderChosenWorkshop()}
        <div className="submit-group">
        <Button type="submit">Anmelden</Button>
        <div className="submit-status">
        <Finished state={this.state.send}></Finished>
        </div>
        </div>

        </Form>
    }
}