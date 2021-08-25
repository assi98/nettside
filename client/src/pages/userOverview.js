// @flow

/**
 * Renders the page with the user information, and the events where the user is an organizer
 */
import * as React from 'react';
import {Component} from "react-simplified";
import {Event, eventService} from "../services/eventService";
import {createHashHistory} from 'history';
import {userService} from "../services/userService";
import {Button} from '../components/Buttons/buttons';
import {ModalWidget} from "../components/widgets";

const history = createHashHistory();
import {Ticket, ticketService} from "../services/ticketService";
import {EventEquipment, equipmentService} from "../services/equipmentService";
import AddEquipment from "../components/Equipment/add_equipment";
import TicketView from "../components/Ticket/ticket_types";
import EventView from "../components/Event/event_view";
import {EventEdit} from "../components/Event/event_edit";
import {EventViewHeader} from "../components/Header/headers";
import {artistService} from "../services/artistService";

/**
 * Class for the view of one event
 *
 * @author Victoria Blichfeldt
 */
//TODO fikse bug med at arrangement overview ikke alltid oppdateres etter at redigering er utført
//TODO flette utstyr og dokumenter når det er ferdig
export default class UserOverview extends Component {
    currentUser: number = 0;
    events: Event[] = [];
    endedEvents: Event[] = [];
    artistEvents: Event[] = [];

    constructor(props) {
        super(props);

        this.state = {
            setShowModal: false,
            isEditingEvent: false,
            artistId: -1
        }
    }

    /**
     * Shows a modal dialog window
     * @param e Component triggering the dialog
     */
    show(e) {
        if (e.target.id === "showWarning") {
            this.setState({setShowModal: true});
        } else if (e.target.id === 'closeWarning') {
            this.setState({setShowModal: false});
        }
    }

    mounted() {
//TODO get events by user
        eventService.getEventByUser(userService.getUserId()).then(respons => {
            if (respons != null) {
                this.events = [];
                respons.map(e => {
                    this.events.push(e);
                });
            } else {
                console.log("shait");
            }
        });

        eventService.getEndedEventsByUser(userService.getUserId()).then(response => {
            if (response) {
                this.endedEvents = [];
                response.map(events => {
                    this.endedEvents.push(events);
                })
            }
        });

        artistService.getArtistByUser(userService.getUserId()).then(artists => {
            if (artists) {
                this.setState({artistId: (artists[0].length > 0) ? artists[0][0].artist_id : -1});
                eventService.getEventsByArtist(this.state.artistId)
                    .then(events => this.artistEvents = events[0] ? events[0] : []);
            }
        });
    }

    deleteEndedEvents() {

        eventService
            .deleteEndedEvents(userService.getUserId())
            .then(window.location.reload())
            .then(console.log("Arrangement slettet!"))
            .catch((error: Error) => console.log(error.message));
    }

    viewEvent = (event) => {
        history.push("/event/" + event.target.getAttribute('eventId') + "/overview");
    };


    render() {
        let artistBox = (<div></div>);
        if (userService.getArtistName() != null && userService.getArtistName() !== "null") {
            artistBox = (

                <div className="row">
                    <div className="col-md-12">
                        <EventViewHeader label="Artist"/>
                        <div className="list-group" className="">
                            <li className="list-group-item">
                                <h6>Artist navn</h6>
                                {userService.getArtistName()}
                            </li>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            //TODO en eller annen header for hvilken user som er logget inn
            <div className="container mt-4" id="userOverview">
                <div className="row">
                    <div className="col-lg-12">
                        <EventViewHeader label="Profil"/>
                        <div className="list-group" className="">
                            <li className="list-group-item">
                                <h6>Brukernavn</h6>{userService.getUsername()}
                            </li>
                            <li className="list-group-item">
                                <h6>Navn</h6> {userService.getFirstName() + " " + userService.getLastName()}
                            </li>
                            <li className="list-group-item">
                                <h6>Epost</h6> {userService.getEmail()}
                            </li>
                            <li className="list-group-item">
                                <h6>Telefon</h6> {userService.getPhone()}
                            </li>
                            <br></br>
                            <button type="button" className="btn btn-outline-primary" onClick={(e) => {
                                history.push("/user/" + userService.getUserId() + "/edit");
                            }}>Endre profil
                            </button>
                            <p></p>
                        </div>
                        {artistBox}
                    </div>
                </div>
                <div className="row" id="userOverviewEvents">
                    <div className="col-lg-6">
                        <EventViewHeader label="Dine arrangementer"/>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="list-group" className="">
                                    <button type="button" className="btn btn-outline-primary" onClick={(e) => {
                                        history.push("/event/new");
                                    }}>
                                        Legg til nytt arrangement
                                    </button>
                                    <p></p>
                                    {this.events.map(e => (
                                        //TODO hente inn en <a> og sender valgt event til eventoverview
                                        <li key={"event" + e.event_id} onClick={this.viewEvent} eventId={e.event_id}
                                            className="list-group-item list-group-item-action">
                                            {<strong>{e.title}</strong>} {', '} {e.start_time}
                                        </li>
                                    ))}
                                    <p></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        {this.state.artistId && this.artistEvents.length > 0 ?
                            <div>
                                <EventViewHeader label={"Dine kontrakter"}/>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="list-group">
                                            {this.artistEvents.map(e => (
                                                <li key={"event" + e.event_id} onClick={this.viewEvent}
                                                    eventId={e.event_id}
                                                    className="list-group-item list-group-item-action list-group-item-secondary">
                                                    {e.title} {e.end_time}
                                                </li>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null}
                    </div>
                    <div className="col-lg-6">
                        <EventViewHeader label="Dine arkiverte arrangementer"/>
                        <div className="row">
                            <div className="col-md-12">
                                <button id="showWarning" type="button" className="btn btn-outline-danger"
                                        onClick={this.show}>Slett arrangementene
                                </button>
                                <p></p>
                                <div className="list-group" className="">
                                    {this.endedEvents.map(e => (
                                        //TODO hente inn en <a> og sender valgt event til eventoverview
                                        <li key={"event" + e.event_id} onClick={this.viewEvent} eventId={e.event_id}
                                            className="list-group-item list-group-item-action list-group-item-secondary">
                                            {<strong>{e.title}</strong>} {', '} {e.start_time}
                                        </li>
                                    ))}
                                </div>
                                <br></br>
                            </div>
                        </div>

                        <ModalWidget
                            show={this.state.setShowModal}
                            onHide={() => this.setState({setShowModal: false})}
                            title='Advarsel'
                            body="Er du sikker på at du vil slette de arkiverte arrangementene?"
                        >
                            <button id="closeWarning" type="button" className="btn btn-outline-primary"
                                    onClick={() => this.setState({setShowModal: false})}>Lukk
                            </button>
                            <button className="btn btn-outline-danger" type="button"
                                    onClick={this.deleteEndedEvents}>Slett
                            </button>
                        </ModalWidget>
                    </div>
                </div>
            </div>
        )
    }
}
