import React from "react";
import { Card, Media, Accordion, Badge } from "react-bootstrap";
import ReactMarkdown from 'react-markdown/with-html';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import './WorkshopCard.css'

function WorkshopBody(props) {
    return <Card.Body>
        <Media>
            <img className="mr-3 workshop-image" src={ props.Image.src } alt={ props.Image.alt } />
            <Media.Body>
                <div className="workshop-card-body">
                    <ReactMarkdown escapeHtml={ false } source={ props.Description }></ReactMarkdown>
                </div>
            </Media.Body>
        </Media>
    </Card.Body>;
}

export function WorkshopCard(props) {
    return <div className="workshop-card">
        <Card>
            <Card.Header>
                <div className="workshop-header-float-group">
                    <h5>
                        { props.Workshop.title }
                    </h5>
                    <div className="buffer"></div>
                    <Badge variant="secondary">{ props.Workshop.short ? "45 Min." : "90 Min." }</Badge>
                </div>
            </Card.Header>
            <WorkshopBody Image={ props.Workshop.image } Description={ props.Workshop.description } />
            <Card.Footer>
                Von { props.Workshop.authors.join(" & ") }
            </Card.Footer>
        </Card>
    </div>;
}

export class AccordionWorkshopCard extends React.Component {

    constructor(props) {
        super(props)
        this.state = { collapsed: true };

    }

    render() {
        let remote = this.props.remoteWorkshop.find(x => x[0] === this.props.Workshop.key);
        let used_max = []
        if (remote) {
            remote = remote[1];
            if (remote.short) {
                used_max.push([remote.used.first, remote.max]);
                used_max.push([remote.used.second, remote.max]);
            } else {
                used_max.push([remote.used, remote.max]);
            }
        }
        return <div className="workshop-card">
            <Card>
                <Accordion.Toggle as={ Card.Header } eventKey={ this.props.Key.toString() } onClick={ () => this.setState({ collapsed: !this.state.collapsed }) }>
                    <div className="workshop-card-accordion-header">
                        <div className="workshop-header-float-group">
                            <h4>
                                { this.props.Workshop.title }
                            </h4>
                            <div className="buffer"></div>
                            <Badge variant="secondary">{ this.props.Workshop.short ? "45 Min." : "90 Min." }</Badge>
                        </div>
                        <div className="workshop-header-float-group">
                            { used_max.map((x, y) => <div key={ y.toString() } className="workshop-header-float-group"><Badge variant={(x[1]&&x[1]>=0)? x[0] < x[1] ? "secondary" : "danger":"secondary" }>{(x[1]&&x[1]>=0)? "" + x[0] + "/" + x[1]: x[0] }</Badge><div className="buffer"></div></div>) }
                            <FontAwesomeIcon icon={ (this.state.collapsed) ? faAngleLeft : faAngleDown } size="lg"></FontAwesomeIcon>
                        </div>
                    </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={ this.props.Key.toString() }>
                    <div>
                        <WorkshopBody Image={ this.props.Workshop.image } Description={ this.props.Workshop.description } />
                        <Card.Footer>
                            Von { this.props.Workshop.authors.join(" & ") }
                        </Card.Footer>
                    </div>
                </Accordion.Collapse>
            </Card>
        </div>;
    }
}

