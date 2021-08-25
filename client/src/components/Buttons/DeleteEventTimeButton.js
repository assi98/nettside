
// @flow

/*
import * as React from "react";
import { Component } from "react-simplified";
import { createHashHistory } from "history";
import { Button, Column, Alert } from '../widgets';
import { Modal } from 'react-bootstrap';
import { eventService, Event } from "../../services/eventService";

const history = createHashHistory();

export class DeleteEventTimeButton extends Component < { match: { params: { userId: number } } } > {

    events: Event[] = [];

    state = {
        showModal: false,
        setShowModal: false
    };

    show = () => {
        this.setState({ setShowModal: true });
    };

    close = () => {
        this.setState( { setShowModal: false });
    };

    render() {

        return (

            <div>

                <Column width={2}>

                    <Button.Blue onClick={this.show}>Slett utgåtte arrangementer</Button.Blue>

                    {this.events.map(e =>

                        <ul>
                            <li>
                                {e.title}
                            </li>
                        </ul>

                    )}

                </Column>

                <Modal
                    show = {this.state.setShowModal}
                    onHide= {this.close}
                    centered
                >

                    <Modal.Header>

                        <Modal.Title>Advarsel</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>

                        <p>
                            Er du sikker på at du vil slette alle utgåtte arrangementer?
                        </p>

                    </Modal.Body>

                    <Modal.Footer>

                        <Button.Light onClick={this.close}>Lukk</Button.Light>
                        <Button.Red onClick={this.deleteEventsByTime}>Slett</Button.Red>

                    </Modal.Footer>

                </Modal>

            </div>

        )
    }

    mounted(): void {

        eventService
            .getEventByUser(this.props.match.params.userId)
            .then(event => this.events = event)
            .catch((error: Error) => console.log(error.message))
    }

    deleteEventsByTime() {

    }
}

 */
