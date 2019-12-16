import React from 'react';
import {Container,Accordion,Alert} from 'react-bootstrap';
import {AccordionWorkshopCard} from './WorkshopCard';
import WorkshopForm from './WorkshopForm';
import './App.css';

function ResolvedApp(props) {
  return (
    <div className="app">
      <Container>
      <Accordion>
      {props.Workshops.map((x,y)=><AccordionWorkshopCard Key={y} key={y.toString()} Workshop={x}></AccordionWorkshopCard>)}
      </Accordion>
      <div className="separator"></div>
      <WorkshopForm Classes={props.Classes} Workshops={props.Workshops}>
      </WorkshopForm>
    </Container>
    </div>
    
    
  );
}
function RejectedApp(props){
  console.error(props.error);
  return <Alert variant="danger">Ein Fehler ist aufgetreten: {props.error.message}</Alert>;
}

function WaitingApp(props){
  return <div></div>
}

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={state:null,data:undefined,promise:undefined}
  }
  rejected(data){
    this.setState({state:false,data:data});
  }
  resolved(data){
    this.setState({state:true,data:data});
  }
  render(){
    if(this.props.Promise!==this.state.promise){
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.promise=this.props.Promise;
      this.props.Promise(window.baseUrl).then(this.resolved.bind(this),this.rejected.bind(this));
    }

    if(this.state.state===null)return <WaitingApp/>;
    if(this.state.state)return <ResolvedApp Classes={["extern","10a","10b","10c","10d","10e"]} Workshops={this.state.data}></ResolvedApp>
    else return <RejectedApp error={this.state.data}/>
  }
}

export default App;
