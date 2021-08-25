
// @flow

import * as React from 'react';
import {Component} from "react-simplified";
import { createHashHistory } from 'history';
import { Button} from './buttons';
import {Column, Row} from "../Grid/grid";
import {Alert} from "../Alert/alert";
import { Modal } from 'react-bootstrap';
//import { cancelEventService, Event} from "../services/TempCancelEventService";
import { eventService, Event } from "../../services/eventService";

const history = createHashHistory();

export class CancelEventButton extends Component < { match: { params: { eventId: number } } }> {

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

                    <Button.Red onClick={this.show}>Avlys arrangement</Button.Red>

                </Column>

                <Modal
                    show={this.state.setShowModal}
                    onHide={this.close}
                    centered
                >

                    <Modal.Header>

                        <Modal.Title>Advarsel</Modal.Title>

                    </Modal.Header>

                    <Modal.Body>

                        <p>
                            Er du sikker på at du vil avlyse dette arrangementet?
                        </p>

                    </Modal.Body>

                    <Modal.Footer>

                        <Button.Light onClick={this.close}>Lukk</Button.Light>
                        <Button.Red onClick={this.cancelEvent}>Avlys</Button.Red>

                    </Modal.Footer>

                </Modal>

            </div>

        )
    }

    mounted(): void {

        eventService
            .getEventById(this.props.match.params.eventId)
            .then(event => (this.event = event[0]))
            .catch((error: Error) => Alert(error.message));

    }

    cancelEvent() {

        if(!this.event) return null;

        //console.log(this.props.match.params.eventId + ": " + this.event[0].title);

        if(this.event.cancelled === 0) {

            eventService
                .cancelEvent(this.props.match.params.eventId)
                //.then(Alert.success("Arrangementet er avlyst! Email sendt."))
                .then(console.log("Arrangementet er avlyst!"))
                .then(history.push("/"))
                .catch((error: Error) => Alert.danger(error));

        } else if (this.event.cancelled === 1) {

            console.log("Dette arrangementet er allerede avlyst");
            //return (Alert.info("Dette arrangementet er allerede avlyst"));

        } else {

            console.log("Noe gikk galt!");
            //return Alert.danger("Noe gikk galt!");
        }

    }

}

export default CancelEventButton;