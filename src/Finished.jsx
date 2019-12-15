import React from "react";
import {Fade,Collapse} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCheck,faSpinner} from "@fortawesome/free-solid-svg-icons"
import "./Finished.css"
export default class Finished extends React.Component{
    constructor(props){
        super(props);
        this.prev=null;
        this.state={waiting:false,finished:false};
    }

    animationFinsishedHandler(){
        if(this.props.state===false)this.setState({waiting:true,finished:false});
        else if(this.props.state) this.setState({waiting:false,finished:true});
    }

    render(){
        if(this.prev!==this.props.state){
            if(this.prev===null){
                // eslint-disable-next-line react/no-direct-mutation-state
                if(this.props.state)this.state={waiting:false,finished:true};
                // eslint-disable-next-line react/no-direct-mutation-state
                else this.state={waiting:true,finished:false};
            }
            // eslint-disable-next-line react/no-direct-mutation-state
            else this.state={waiting:false,finished:false};
            this.prev=this.props.state;
        }
        return<div>
        <Fade in={this.state.waiting} onExited={this.animationFinsishedHandler.bind(this)} unmountOnExit>
        <FontAwesomeIcon icon={faSpinner} spin size="2x"></FontAwesomeIcon>
        </Fade>
        <Collapse in={this.state.finished} onExited={this.animationFinsishedHandler.bind(this)} unmountOnExit>
        <FontAwesomeIcon icon={faCheck} size="2x"></FontAwesomeIcon>
        </Collapse>
        </div>
    }
}