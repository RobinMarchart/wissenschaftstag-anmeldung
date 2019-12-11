import React from "react";
import {Form,Col, Button} from "react-bootstrap";

function getState(){

}


export default class WorkshopForm extends React.Component{

    constructor(props){
        super(props)
        this.state={workshop:getState()};
    }

    handleSubmit(x){
console.log(x);
    }

    render(){
        return <Form onSubmitCapture={this.handleSubmit.bind(this)}>

        <Form.Row>
        <Form.Group controlId="formName1" as={Col} md="6">
        <Form.Label>Vorname</Form.Label>
        <Form.Control required type="text" placeholder="Otto"></Form.Control>
        </Form.Group>

        <Form.Group controlId="formName2" as={Col} md="6">
        <Form.Label>Nachname</Form.Label>
        <Form.Control required type="text" placeholder="Maier"></Form.Control>
        </Form.Group>
        </Form.Row>

        <Button type="submit">Anmelden</Button>

        </Form>
    }
}