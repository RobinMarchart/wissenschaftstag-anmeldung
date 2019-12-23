import React from "react";
import {Fade,Collapse} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCheck,faSpinner,faTimes} from "@fortawesome/free-solid-svg-icons"
import "./Finished.css"
export default class Finished extends React.Component{
    constructor(props){
        super(props);
        this.prev=null;
        this.state={waiting:false,finished:false,error:false};
    }

    animationFinsishedHandler(){
        if(this.props.state===undefined)this.setState({waiting:true});
        else if(this.props.state===true) this.setState({finished:true});
        else if(this.props.state===false) this.setState({error:true})
    }

    render(){
        if(this.prev!==this.props.state){
            if(this.prev===undefined){
                // eslint-disable-next-line react/no-direct-mutation-state
                if(this.props.state)this.state={finished:true};
                // eslint-disable-next-line react/no-direct-mutation-state
                else if(this.props.state===null) this.state={waiting:true};
                // eslint-disable-next-line react/no-direct-mutation-state
                else if(this.props.state===false)this.state={error:true};
            }
            // eslint-disable-next-line react/no-direct-mutation-state
            else this.state={waiting:false,finished:false,error:false};
            this.prev=this.props.state;
        }
        return<div>
        <Fade in={this.state.waiting} onExited={this.animationFinsishedHandler.bind(this)} unmountOnExit>
        <FontAwesomeIcon icon={faSpinner} spin size="2x"></FontAwesomeIcon>
        </Fade>
        <Collapse in={this.state.finished} onExited={this.animationFinsishedHandler.bind(this)} unmountOnExit>
        <FontAwesomeIcon icon={faCheck} size="2x"></FontAwesomeIcon>
        </Collapse>
        <Collapse in={this.state.error} onExited={this.animationFinsishedHandler.bind(this)} unmountOnExit>
        <FontAwesomeIcon icon={faTimes} size="2x"></FontAwesomeIcon>
        </Collapse>
        </div>;
    }
}