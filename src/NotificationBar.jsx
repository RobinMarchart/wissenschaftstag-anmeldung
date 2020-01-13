import React from "react"
import Notification from "./Notification"
import "./NotificationBar.css"

export default class NotificationBar extends React.Component{
    constructor(props){
        super(props)
        this.state={rendered:[],test_size:[],queue:[],usedHeight:0,availableHeight:0};
    }

    componentDidMount(){
        this.setState({availableHeight:this.not_con.clientHeight});
    }

    render(){
        while(this.state.queue.length&&this.state.availableHeight>this.state.usedHeight+this.state.queue[0].height){
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.usedHeight+=this.state.queue[0].height
            this.state.rendered.push(this.state.queue.shift());
        }
        return <div><div className="notification-container" ref={x=>this.not_con=x}>
            {this.state.rendered.map((x,y)=><Notification key={y} Content={x} onClose={()=>this._remove(x)}></Notification>)}
            Test
        </div>
        <div className="notification-test">
        {this.state.test_size.map((x,y)=><Notification key={y} hidden={true} content={x} heightCallback={h=>this._queue(x,h)}></Notification>)}
        </div>
        </div>
    }
    _queue(content,height){
        this.setState({test_size:this.state.test_size.filter(x=>x!==content),queue:this.state.queue.concat(Object.assign(content,{height:height}))});

    }
    _remove(content){
        this.setState({rendered:this.state.rendered.filter(x=>x!==content),usedHeight:this.state.usedHeight-content.height});
    }
    submit(title,body){
        this.setState({test_size:this.state.test_size.concat({title:escape(title),body:escape(body),time:Date.now()})})
    }
}