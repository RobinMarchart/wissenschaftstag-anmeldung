import React from "react";
import {Card,Media} from "react-bootstrap";
import ReactMarkdown from 'react-markdown/with-html';
import './WorkshopCard.css'

export default function WorkshopCard(props){
    return <div className="workshop-card">
        <Card>
    <Card.Header as="h4">
    {props.Title}
    </Card.Header>
    <Card.Body>
    <Media>
    <img width={128} height={128} className="mr-3" src={URL.createObjectURL(props.Image.src)} alt={props.Image.alt}/>
    <Media.Body>
        <div className="workshop-card-body">
        <ReactMarkdown escapeHtml={false} source={props.Description}></ReactMarkdown>
        </div>
    </Media.Body>
    </Media>
    </Card.Body>
    <Card.Footer>
    Von {props.Authors.join(" & ")}
    </Card.Footer>
    </Card>
    </div>;
}
