import React from "react";
import {Form,Col, Button} from "react-bootstrap";

function getState(){

}


export default class WorkshopForm extends React.Component{

    constructor(props){
        super(props)
        this.state={workshop:getState()};
        this.form=new Object();
        this.form.name1=React.createRef();
        this.form.name2=React.createRef();
        this.form.class=React.createRef();
        
    }

    handleSubmit(x){
        x.preventDefault();
        
    }

    render(){
        return <Form onSubmit={this.handleSubmit.bind(this)}>

        <Form.Row>
        <Form.Group controlId="formName1" as={Col} md="4">
        <Form.Label>Vorname</Form.Label>
        <Form.Control required type="text" placeholder="Otto" ref={this.form}></Form.Control>
        </Form.Group>

        <Form.Group controlId="formName2" as={Col} md="4">
        <Form.Label>Nachname</Form.Label>
        <Form.Control required type="text" placeholder="Maier"></Form.Control>
        </Form.Group>
		
		<Form.Group controlId="formClass" as={Col} md="4">
		<Form.Label>Classe</Form.Label>
		<Form.Control as="select" ref={this.form.class}>
            {this.props.Classes.map((x,y)=><option key={y.toString()}>{x}</option>)}
        </Form.Control>
		</Form.Group>
        </Form.Row>

        <Button type="submit">Anmelden</Button>

        </Form>
    }
}