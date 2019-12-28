import React from "react"
import {Form} from "react-bootstrap"

class FormSelect extends React.Component{

    constructor(props){
        super(props);
        this.state={unselected:!this.props.defaultValue};
    }

    handleOnChange(event){
        this.props.onChange(event);
        if(this.state.unselected)this.setState({unselected:false});
    }

    render(){
        return <Form.Control as="select" 
        onChange={this.handleOnChange.bind(this)} 
        defaultValue={this.props.defaultValue ? this.props.defaultValue : "Bitte Auswählen"} 
        ref={this.props.Ref}>
        {this.props.Options.map((x, y) => <option key={y.toString()}>{x}</option>)}
        {this.state.unselected?<option>Bitte Auswählen</option>:null}
    </Form.Control>;
    }
}

export default FormSelect