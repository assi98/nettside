//@flow

import * as React from 'react';
import {Component} from "react-simplified";
import { createHashHistory } from 'history';
import {ticketService, Ticket, Ticket_ID} from '../../services/ticketService'
import {EventViewHeader} from "../Header/headers";



const history = createHashHistory();
export class TicketEdit extends Component {
    currentTicketID = 0;
    ticketTypeList: Ticket[] = [];
    userForm: any = null;
    ticket = new Ticket(
        '',
        '',
        '',
        '',
        ''
    );
    errorMessage: string="";

    render() {
        if (!this.ticket) return null;
        return (
            <div>
            <EventViewHeader label="Title"/>
            <form ref={e => (this.userForm = e)}>
                <div className="form-group">
                    <label for="title">Title</label>
                    <input
                        required
                        id="title"
                        className="form-control form-control-event-overview"
                        type="text"
                        value={this.ticket.title}
                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                            if (this.ticket) this.ticket.title = event.target.value;
                        }}
                    />
                </div>

                <div className="form-group">
                    <label for="info">Info</label>
                    <input
                        required
                        id="info"
                        className="form-control form-control-event-overview"
                        type="text"
                        value={this.ticket.info}
                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                            if (this.ticket) this.ticket.info = event.target.value;
                        }}
                    />
                </div>

                <div className="form-group">
                    <label for="price">Price</label>
                    <input
                        required
                        className="form-control form-control-event-overview"
                        type="number"
                        value={this.ticket.price}
                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                            if (this.ticket) this.ticket.price = event.target.value;
                        }}
                    />
                </div>


                <div className="form-group">
                    <label for="count">Count</label>
                    <input
                        required
                        id="count"
                        className="form-control form-control-event-overview"
                        type="number"
                        value={this.ticket.count}
                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                            if (this.ticket) this.ticket.count = event.target.value;
                        }}
                    />
                </div>

                <div className="btn-toolbar">
                    <button type="button" className="btn btn-outline-primary my-2 mr-4"
                            onClick={() => {this.save(); }}>
                        Lagre
                    </button>

                    <button type="button" className="btn btn-outline-primary my-2 mr-4" onClick={() => {this.delete();}} data-toggle="modal" data-target="#showModal">
                        Slett
                    </button>

                    <button type="button" className="btn btn-outline-primary my-2" onClick={this.props.handleCancel} data-toggle="modal" data-target="#showModal">
                        Avbryt
                    </button>
                </div>
            </form>
            </div>
        );
    }

    mounted() {
        this.currentEventID = this.props.eventId;
        this.currentTicketID = this.props.ticketId;
        console.log(this.currentTicketID);
        ticketService
            .getTicketId(this.currentTicketID)
            .then((response) => {
                this.ticket = response[0][0];
            })
            .catch((error: Error) => console.log(error.message));
    }

    delete(){
        if(!this.ticket) return null;

        ticketService.removeTicket(this.currentTicketID).then((response) => {
            if (this.ticket) this.props.handleDelete();
        }).catch(error => error.message);
    }

    save() {
        if (!this.ticket|| !this.userForm.checkValidity()) return null;
        if(this.ticket.count < 0 || this.ticket.price < 0 ) {
            alert('pris eller antall kan ikke være under 0!');
            return;
        }
        ticketService.updateTicket(this.ticket, this.currentTicketID).then((response) => {
            if (this.ticket) this.props.handleCancel();
        }).catch(error => error.message);
    }
}
