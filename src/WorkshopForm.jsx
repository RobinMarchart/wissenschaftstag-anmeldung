import React from "react";
import {Form,Col, Button} from "react-bootstrap";
import {WorkshopCard} from "./WorkshopCard";
import {getDefault,addRegistration} from "./LocalWorkshopRegistrations";

export default class WorkshopForm extends React.Component{

    constructor(props){
        super(props)
        this.state={workshop:getDefault(),chosen:""};
        this.form={};
    }

    handleSubmit(x){
        x.preventDefault();
        let registration=[this.form.name1.value,this.form.name2.value,this.form.class.value,this.form.workshop.value];
        console.debug(registration);
        addRegistration(registration);
        this.setState({workshop:registration});
    }

    handleWorkshopChange(x){
        this.setState({chosen:this.form.workshop.value});
    }

    RenderChosenWorkshop(){
        if(this.state.chosen){
            let workshop=this.props.Workshops.find(x=>x.title===this.state.chosen);
            if(workshop)return <WorkshopCard Workshop={workshop}/>
        }
    }

    render(){
        if(this.props.ThisRef)this.props.ThisRef(this);
        return <Form onSubmit={this.handleSubmit.bind(this)}>

        <Form.Row>
        <Form.Group controlId="formName1" as={Col} md="4">
        <Form.Label>Vorname</Form.Label>
        <Form.Control required type="text" placeholder="Otto" defaultValue={(this.state.workshop)?this.state.workshop[0][0]:null} ref={ref=>this.form.name1=ref}></Form.Control>
        </Form.Group>

        <Form.Group controlId="formName2" as={Col} md="4">
        <Form.Label>Nachname</Form.Label>
        <Form.Control required type="text" placeholder="Maier" ref={ref=>this.form.name2=ref}></Form.Control>
        </Form.Group>
		
		<Form.Group controlId="formClass" as={Col} md="4">
		<Form.Label>Classe</Form.Label>
		<Form.Control as="select" onChange={this.tmpHandle} ref={ref=>this.form.class=ref}>
            {this.props.Classes.map((x,y)=><option key={y.toString()}>{x}</option>)}
        </Form.Control>
		</Form.Group>
        </Form.Row>

        <Form.Group controlId="formWorkshop">
        <Form.Label>Workshop</Form.Label>
        <Form.Control as="select" onChange={this.handleWorkshopChange.bind(this)} ref={ref=>this.form.workshop=ref}>
        {this.props.Workshops.map((x,y)=><option key={y.toString()}>{x.title}</option>)}
        </Form.Control>
        </Form.Group>

        {this.RenderChosenWorkshop()}

        <Button type="submit">Anmelden</Button>

        </Form>
    }
}