import * as React from 'react';
import {Component} from "react-simplified";
import {createHashHistory} from 'history';
import {Ticket_ID, ticketService} from "../../services/ticketService";
import {Event} from "../../services/eventService";
import {EventEquipment} from "../../services/equipmentService";
import Row from "react-bootstrap/Row";
import {EventViewHeader, PageHeader} from "../Header/headers";
import {ModalWidget} from "../../components/widgets";

export default class TicketView extends Component {
    currentTicketID : number = 0;
    currentEvent: number = 0;
    eventOverview: Event = null;
    tickets: Ticket_ID[] = [];
    eventEquipment: EventEquipment[] =[];
    errorMessage: string = "";

    constructor(props){
        super(props);
    };

    render(){
        return (
                <div className="container">
                    <EventViewHeader label="Billettyper"/>
                    {!this.props.isArtist ?
                        <button type="submit" className="btn btn-outline-primary mb-4 mt-0 mr-0"
                                onClick={this.props.handleAddTicketClick}>
                            Legg til ny billettype
                        </button>
                        : null}
                    <div className="card-columns">
                    {this.tickets.map( (tickets =>
                        <div className="card">
                            <div style={{float:"left", width:"100%",height:"100%", border:"none"}} className="list-group-item">
                                <b>Type:</b>
                                <hr/>
                                <p>{tickets.title}</p>

                                <b>Billettinfo</b>
                                <hr/>
                                <p>{tickets.info}</p>

                                <b>Pris:</b>
                                <hr/>
                                <p>{tickets.price + 'kr'} </p>

                                <b>Antall billetter:</b>
                                <hr/>
                                <p>{tickets.count}</p>
                                {!this.props.isArtist ?
                                    <div className="btn-toolbar">
                                            <button type="button" className="btn btn-outline-primary my-2 mr-4"
                                                    onClick={() => {this.props.triggerParentUpdate(tickets.ticket_id); this.props.handleEditTicketClick()}}>
                                                Rediger billett
                                            </button>

                                            <button type="button" className="btn btn-outline-primary my-2" onClick={() => {this.delete(tickets.ticket_id); }} data-toggle="modal" data-target="#showModal">Slett
                                            </button>
                                    </div>
                                : null}
                            </div>
                        </div>
                    ))}
                    </div>
            </div>
        )
    }

    delete(currentTicketID){
        ticketService.removeTicket(currentTicketID).then((response) => {
            if (this.ticket) this.props.handleDelete();
            this.mounted();
        }).catch(error => error.message);

    }

    mounted(){
        this.currentEvent = this.props.eventId;
        this.currentTicketID = this.props.ticketId;
        ticketService
            .getAllTicket(this.currentEvent)
            .then(tickets => {
                this.tickets = tickets[0];
                if(tickets.body.error) {
                    this.errorMessage = tickets.body.error;
                }
            })
            .catch((error: Error) => error.message);
    }

}