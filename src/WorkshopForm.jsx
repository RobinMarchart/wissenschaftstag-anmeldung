import React from "react";
import { Form, Col, Button } from "react-bootstrap";
import { WorkshopCard } from "./WorkshopCard";
import { getRegistration, setRegistration } from "./LocalWorkshopRegistrations";
import FormSelect from "./FormSelect";
import Finished from "./Finished";
import "./WorkshopForm.css";

export default class WorkshopForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = { workshop: getRegistration(), chosen: "", chosen2: "", send: undefined, short: false };
        if (this.state.workshop) {
            this.state.chosen = this.state.workshop[3];
            this.state.chosen2 = this.state.workshop[4];
        }
        this.form = {};
        this.changed = false;
        //display warning as user leaves
        window.addEventListener("beforeunload", this.warnIfUnsaved.bind(this));
    }

    warnIfUnsaved(event) {
        if (this.changed && !this.state.send) {
            let notsaved = "Nicht alle änderungen wurden gesendet!";
            let notsend = "Nicht alle Änderungen wurden gesendet, bitte kurz warten!";
            let message = (this.state.send === null) ? notsaved : notsend;
            (event || window.event).returnValue = message;
            return message;
        }
        else return undefined
    }

    handleSubmit(x) {
        x.preventDefault();
        let registration = [this.form.name1.value, this.form.name2.value, this.form.class.value,
        this.form.workshop.value, (this.state.short) ? this.form.workshop2.value : ""];
        console.debug(registration);
        setRegistration(registration);
        this.setState({ workshop: registration, send: null });
        this.props.Remote.send(registration).then(this.handleSuccessfulSubmit.bind(this), this.handleUnsuccessfulSubmit.bind(this));
    }

    handleSuccessfulSubmit(x) {
        console.log(x.message)
        this.setState({ send: true });
    }

    handleUnsuccessfulSubmit(e) {
        console.error(e.message);
        this.setState({ send: false });
    }

    handleWorkshopChange(x) {
        if (this.props.Workshops.find(x => x.title === this.form.workshop.value).short) this.setState({ chosen: this.form.workshop.value, send: undefined, short: true });
        else this.setState({ chosen: this.form.workshop.value, send: undefined, short: false });
        this.changed = true;
    }

    handleSecondWorkshopChange(x) {
        this.setState({ chosen2: this.form.workshop2.value, send: undefined });
        this.changed = true;
    }

    renderChosenWorkshop() {
        if (this.state.chosen) {
            let workshop = this.props.Workshops.find(x => x.title === this.state.chosen);
            if (workshop) return <WorkshopCard Workshop={workshop} />
        }
    }

    renderSecondWorkshop() {
        if (this.state.short && this.state.chosen) {
            let workshops = this.props.Workshops.filter(x => x.short && (x.title !== this.state.chosen));
            return <Form.Group controlId="formWorkshop2">
                <Form.Label>Workshop</Form.Label>
                <FormSelect
                    defaultValue={(this.state.workshop) ? this.state.workshop[4] : null}
                    onChange={this.handleSecondWorkshopChange.bind(this)}
                    Ref={ref => this.form.workshop2 = ref}
                    Options={workshops.map(x=>x.title)}
                />
            </Form.Group>;
        }
    }

    renderSecondChosenWorkshop() {
        if (this.state.short && this.state.chosen2) {
            let workshop = this.props.Workshops.find(x => x.title === this.state.chosen2);
            if (workshop) return <WorkshopCard Workshop={workshop} />
        }
    }

    handleStateChange() {
        this.setState({ send: undefined })
        this.changed = true;
    }


    render() {
        if (this.props.ThisRef) this.props.ThisRef(this);
        return <Form onSubmit={this.handleSubmit.bind(this)}>

            <Form.Row>
                <Form.Group controlId="formName1" as={Col} md="4">
                    <Form.Label>Vorname</Form.Label>
                    <Form.Control required type="text" onChange={this.handleStateChange.bind(this)} placeholder="Otto" defaultValue={(this.state.workshop) ? this.state.workshop[0] : null} ref={ref => this.form.name1 = ref}></Form.Control>
                </Form.Group>

                <Form.Group controlId="formName2" as={Col} md="4">
                    <Form.Label>Nachname</Form.Label>
                    <Form.Control required type="text" onChange={this.handleStateChange.bind(this)} placeholder="Maier" defaultValue={(this.state.workshop) ? this.state.workshop[1] : null} ref={ref => this.form.name2 = ref}></Form.Control>
                </Form.Group>

                <Form.Group controlId="formClass" as={Col} md="4">
                    <Form.Label>Klasse</Form.Label>
                    <FormSelect
                        onChange={this.handleStateChange.bind(this)}
                        defaultValue={(this.state.workshop) ? this.state.workshop[2] : null}
                        Ref={ref => this.form.class = ref}
                        Options={this.props.Classes}
                    />
                </Form.Group>
            </Form.Row>

            <Form.Group controlId="formWorkshop">
                <Form.Label>Workshop</Form.Label>
                <FormSelect
                    defaultValue={(this.state.workshop) ? this.state.workshop[3] : null}
                    onChange={this.handleWorkshopChange.bind(this)}
                    Ref={ref => this.form.workshop = ref}
                    Options={this.props.Workshops.map(x=>x.title)} />
            </Form.Group>

            {this.renderChosenWorkshop()}

            {this.renderSecondWorkshop()}

            {this.renderSecondChosenWorkshop()}

            <div className="submit-group">
                <Button type="submit">Anmelden</Button>
                <div className="submit-status">
                    <Finished state={this.state.send}></Finished>
                </div>
            </div>

        </Form>
    }
}