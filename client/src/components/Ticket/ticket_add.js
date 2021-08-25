//@flow

import * as React from 'react';
import {Component} from "react-simplified/lib/index";
import { createHashHistory } from 'history';
import {ticketService, Ticket, Ticket_ID} from '../../services/ticketService'
import {EventViewHeader} from "../Header/headers";



const history = createHashHistory();

//TODO fjern?? ikkebrukt
export class listTicketType extends Component <{match: {params: {eventId: number, id : number}}}> {
    id_temp : number = 0;
    ticket = new Ticket_ID(
        '',
        '',
        '',
        '',
        '',
        '');

    ticketTypeList: Ticket[] = [];
    errorMessage: string = "";
    render(){
        return(
            <form>
                <div>
                    <h2>
                        Velg en billett og rediger denne
                    </h2>
                    <select
                        id="select"
                        value={this.ticket.title}
                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                            if (this.ticket) {
                                this.ticket.title = event.target.value;
                                this.ticket.ticket_id = event.target.value;
                                this.ticket.event = event.target.value;
                            }

                        }}>
                        <option value="" hidden >Velg Billettype</option>
                        {this.ticketTypeList.map(t => (
                            <option value={t.ticket_id} key={t.title + t.ticket_id}> {t.title}</option>

                        ))}
                    </select>
                </div>

                <button onClick={this.edit} className="btn-primary m-2" type="submit">Rediger billett type</button>
                <button onClick={this.opprettSide} type={"button"}>Opprett ny billettype</button>

            </form>
        );
    }

    edit() {
        if (!this.ticket) return null;
        if (this.ticket.ticket_id === '') return null;
        if (this.ticket) history.push('/' + 'event/'+ 'edit/' + this.ticket.event + '/ticket/'+ this.ticket.ticket_id + '/edit');

    }

    mounted() {
        /*
        ticketService.getAllTicket(this.props.match.params.eventId)
            .then(t => {
                this.ticketTypeList = t[0];
            })
            .catch(error => error.message);

         */

    }

    opprettSide(){
        if (this.ticket) history.push('/' + 'event/ticket');
    }
}


export class TicketAdd extends Component{
    currentEvent: number = 0;
    ticket = new Ticket(
        '',
        '',
        '',
        '',
        ''

    );
    render(){

        if (!this.ticket) return null;
        return(
            <div>
                <EventViewHeader label="Opprett en billettype"/>
                <form ref={e => {this.form = e}} className="form-group" onSubmit={this.send}>
                        <div className="form-group">
                            <label for="title">Tittel</label>
                            <input
                                id="title"
                                required
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
                                id="info"
                                required
                                className="form-control form-control-event-overview"
                                type="text"
                                value={this.ticket.info}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                                    if (this.ticket) this.ticket.info = event.target.value;
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <label for="price">Pris</label>
                            <input
                                id="price"
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
                            <label for="count">Antall</label>
                            <input
                                id="count"
                                required
                                className="form-control form-control-event-overview"
                                type="number"
                                value={this.ticket.count}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                                    if (this.ticket) this.ticket.count = event.target.value;
                                }}
                            />
                        </div>
                    <button type="submit" className="btn btn-outline-primary mr-4" >
                        Legg til billett type
                    </button>
                </form>
                <div className="btn-toolbar">

                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        variant="outline-secondary"
                        onClick={this.props.handleCancel}>
                        Avbryt
                    </button>
                </div>
            </div>
        );}
        mounted(){
            this.currentEvent = this.props.eventId;
            this.ticket.event = this.currentEvent;
            console.log(this.currentEvent);
        }


    send() {
        if (!this.form || !this.form.checkValidity()) return;
        if (!this.ticket) return null;
        if(this.ticket.count < 0 || this.ticket.price < 0 ) {
            alert('pris eller antall kan ikke være under 0!');
            return;
        }
        ticketService.postTicket(this.ticket)
            .then((response) => {
                if(response.error) {
                    alert(response.error);
                }else {
                    this.props.handleCancel();
                }

            })
            .catch((error: Error) => console.log(error));
    }



}

