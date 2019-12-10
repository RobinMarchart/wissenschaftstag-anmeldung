import React from "react";
import Bootstrap from "react-bootstrap";

function WorkshopField(props){
    return <Bootstrap.Card>
    <Bootstrap.Card.Header as="h4">
    {props.Title}
    </Bootstrap.Card.Header>
    <Bootstrap.Card.Body>
    <Bootstrap.Media>
    <img width={128} height={128} className="mr-3" src={props.Image["src"]} alt={props.Image["alt"]}/>
    <Bootstrap.Media.Body>
    {props.children}
    </Bootstrap.Media.Body>
    </Bootstrap.Media>
    </Bootstrap.Card.Body>
    <Bootstrap.Card.Footer>
    {props.Authors}
    </Bootstrap.Card.Footer>
    </Bootstrap.Card>;
}

export default WorkshopField;