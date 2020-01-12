import React from "react";
import {Toast} from "react-bootstrap"

export default class Notification extends React.Component{
    constructor(props){
        super(props)
    }
    componentDidMount() {
        if (this.props.heightCallback)this.props.heightCallback(this.div.clientHeight)
    }
    render(){
        return <div style={this.props.hidden?{display:"none"}:{}} ref={div=>this.div=div}>
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