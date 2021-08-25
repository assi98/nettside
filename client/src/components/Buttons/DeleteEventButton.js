
import * as React from "react";
import { Component } from "react-simplified";
import { createHashHistory } from "history";
import { Button} from './buttons';
import {Column, Row} from "../Grid/grid";
import { Alert} from "../Alert/alert";
import { Modal } from 'react-bootstrap';
import { eventService, Event } from "../../services/eventService";

const history = createHashHistory();

export class DeleteEventButton extends Component < { match: { params: { eventId: number } } } > {

    event : Event = new Event();

    state = {
        showModal: false,
        setShowModal: false
    };

    show = () => {
        this.setState({ setShowModal: true });
    };

    close = () => {
        this.setState({ setShowModal: false });
    };

    render() {

        return (

            <div>

                <Column width={2}>

                    <Button.Red onClick={this.show}>Slett arrangement</Button.Red>

                </Column>

                <Modal
                    show = {this.state.setShowModal}
                    onHide={this.close}
                    centered
                >

                    <Modal.Header>

                        <Modal.Title>Advarsel</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>

                        <p>
                            Er du sikker på at du vil slette dette arrangementet?
                        </p>

                    </Modal.Body>

                    <Modal.Footer>

                        <Button.Light onClick={this.close}>Lukk</Button.Light>
                        <Button.Red onClick={this.deleteEvent}>Slett</Button.Red>

                    </Modal.Footer>

                </Modal>

            </div>

        )
    }

    mounted(): void {

        eventService
            .getEventById(this.props.match.params.eventId)
            .then(event => (this.event = event[0]))
            .catch((error: Error) => console.log(error.message));

    }

    deleteEvent() {

        if(this.event == null) {
            return Alert.danger("Fant ikke arrangement")
        } else {
            eventService
                .deleteEvent(this.props.match.params.eventId)
                .then(console.log("Arrangementet er slettet!"))
                .then(history.push("/"))
                .catch((error: Error) => Alert.danger(error.message));

        }

    }

}

export default DeleteEventButton;