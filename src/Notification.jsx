import React from "react";
import {Toast} from "react-bootstrap";

import "./Notification.css";

export default class Notification extends React.Component{
    componentDidMount() {
        if (this.props.heightCallback)this.props.heightCallback(this.div.clientHeight)
    }
    render(){
        return <div className="notification" style={this.props.hidden?{display:"none"}:{}} ref={div=>this.div=div}>
            <Toast onClose={this.props.onClose}>
            <Toast.Header>
            <strong>{this.props.content.title}</strong>
            <small>#Time since</small>
            </Toast.Header>
            <Toast.Body>
            {this.props.content.body}
            </Toast.Body>
            </Toast>
        </div>
    }
}