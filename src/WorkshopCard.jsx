import React from "react";
import {Card,Media} from "react-bootstrap";
import './WorkshopCard.css'

function WorkshopCard(props){
    return <div className="workshop-card">
        <Card>
    <Card.Header as="h4">
    {props.Title}
    </Card.Header>
    <Card.Body>
    <Media>
    <img width={128} height={128} className="mr-3" src={props.Image.src} alt={props.Image.alt}/>
    <Media.Body>
        <div className="workshop-card-body">
    {props.children}
        </div>
    </Media.Body>
    </Media>
    </Card.Body>
    <Card.Footer>
    {props.Authors}
    </Card.Footer>
    </Card>
    </div>;
}

export default WorkshopCard;