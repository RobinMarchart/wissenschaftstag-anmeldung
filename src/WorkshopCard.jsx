import React from "react";
import {Card,Media,Accordion} from "react-bootstrap";
import ReactMarkdown from 'react-markdown/with-html';
import './WorkshopCard.css'

function WorkshopBody(props){
    return <Card.Body>
    <Media>
    <img width={128} height={128} className="mr-3" src={URL.createObjectURL(props.Image.src)} alt={props.Image.alt}/>
    <Media.Body>
        <div className="workshop-card-body">
        <ReactMarkdown escapeHtml={false} source={props.Description}></ReactMarkdown>
        </div>
    </Media.Body>
    </Media>
    </Card.Body>;
}

export function WorkshopCard(props){
    return <div className="workshop-card">
        <Card>
    <Card.Header>
    <h5>
    {props.Workshop.title}
    </h5>
    </Card.Header>
    <WorkshopBody Image={props.Workshop.image} Description={props.Workshop.description}/>
    <Card.Footer>
    Von {props.Workshop.authors.join(" & ")}
    </Card.Footer>
    </Card>
    </div>;
}

export function AccordionWorkshopCard(props){
    return <div className="workshop-card">
    <Card>
    <Accordion.Toggle as={Card.Header} eventKey={props.Key.toString()}>
    <h4>
    {props.Workshop.title}
    </h4>
    </Accordion.Toggle>
    <Accordion.Collapse eventKey={props.Key.toString()}>
    <div>
    <WorkshopBody Image={props.Workshop.image} Description={props.Workshop.description}/>
    <Card.Footer>
    Von {props.Workshop.authors.join(" & ")}
    </Card.Footer>
    </div>
    </Accordion.Collapse>
    </Card>
    </div>;
}
