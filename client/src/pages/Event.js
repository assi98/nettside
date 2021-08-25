// @flow

/**
 * Renders the main overview of an event
 */
import * as React from 'react';
import {Component} from "react-simplified";
import {Event, eventService} from "../services/eventService";
import {Ticket, ticketService} from "../services/ticketService";
import {EventEquipment, equipmentService} from "../services/equipmentService";
import AddEquipment from "../components/Equipment/add_equipment";
import TicketView from "../components/Ticket/ticket_types";
import EventView from "../components/Event/event_view";
import {EventEdit} from "../components/Event/event_edit";
import {AddEventArtist} from "./addEventArtist";
import {Alert} from '../components/Alert/alert';
import {Rider, riderService} from "../services/riderService";
import {AddRiderType, RiderEdit, RiderList} from "../components/Rider/rider";
const history = createHashHistory();
import {createHashHistory} from "history";
import AddRole from "../components/Staff/staff_overview"
import {TicketAdd} from "../components/Ticket/ticket_add";
import {TicketEdit} from "../components/Ticket/ticket_edit"
import {artistService} from "../services/artistService";
import {userService} from "../services/userService";
import {FileMain} from "./file";
import {PageHeader} from "../components/Header/headers";
/**
 * Class for the view of one event
 *
 * @author Victoria Blichfeldt
 */
//TODO fikse bug med at arrangement overview ikke alltid oppdateres etter at redigering er utført
//TODO flette utstyr og dokumenter når det er ferdig
class EventOverview extends Component<{ match: { params: { eventId: number } } }>{
    currentEvent: number = 0;
    eventOverview: Event = null;
    tickets: Ticket[] = [];
    eventEquipment: EventEquipment[] =[];
    riderList: Rider[] = [];
    rider: Rider = new Rider();
    //roles: Role[] = [];


    constructor(props){
        super(props);
        this.handleEventEdit = this.handleEventEdit.bind(this);
        this.handleEventView = this.handleEventView.bind(this);
        this.handleTicketEdit = this.handleTicketEdit.bind(this);
        this.handleTicketView = this.handleTicketView.bind(this);
        this.state = {
            isEditingEvent: false,
            isEditingRiders: false,
            isEditingTicket: false,
            isEditingArtist: false,
            isAddingTicket: false,
            currentTicketID: 0,
            isArtist: false
        }
    }

    /*
     * hvis true -> viser arrangement oversikt
     */
    handleEventView() {
        this.setState({isEditingEvent: true})
    }

    /*
    * hvis true -> viser redigerigs side for arrangement
    * */
    handleEventEdit() {
        this.setState({
            isEditingEvent: false,
        });
        this.loadEvent();
        Alert.success("eventEditAlert", "Event edited")
    }

    handleTicketView(){
        this.setState(
            {isEditingTicket: true}
        )
    }

    handleTicketEdit(){
        this.setState(
            {isEditingTicket: false}
        )
    }

    handleTicketAdd(){
        this.setState(prevState => ({
            isAddingTicket: !prevState.isAddingTicket
        }))
    }


    editThisTicket = (dataFromChild) =>{
        this.setState(
            {currentTicketID: dataFromChild}
        )
    };


    handleRiderEdit(){
        this.setState({
            isEditingRiders: false,
        })
    }

    handleRiderView(){
        this.setState({
            isEditingRiders: true,
        })
    }

    loadEvent() {
        eventService
            .getEventById(this.currentEvent)
            .then(eventOverview => {
                this.eventOverview = eventOverview[0];
                this.loadArtist();
                if(eventOverview.body.error) {
                    this.errorMessage = eventOverview.body.error;
                }
            })
            .catch((error: Error) => error.message);
    }

    loadTicket() {
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

    loadEquipment() {
        equipmentService
            .getEquipmentByEvent(this.currentEvent)
            .then(eventEquipment =>{
                this.eventEquipment = eventEquipment[0];
                if(eventEquipment.body.error) {
                    this.errorMessage = eventEquipment.body.error;
                }
            })
            .catch((error: Error) => error.message);
    }

    loadArtist() {
        artistService
            .getArtistByUser(userService.getUserId())
            .then(artists => {
                this.setState({isArtist: (artists[0].length > 0 && userService.getContactId() != this.eventOverview.organizer)});
            })
            .catch((error: Error) => console.log(error.message));
    }

    mounted(){
        this.currentEvent = this.props.match.params.eventId;
        this.loadEvent();
        this.loadTicket();
        this.loadEquipment();
        //this.loadArtist();
    }

    render() {
        const isEditingEvent = this.state.isEditingEvent;
        const isEditingTicket = this.state.isEditingTicket;
        const isEditingRiders = this.state.isEditingRiders;
        const isEditingArtist = this.state.isEditingArtist;
        let riderContent;
        const isAddingTicket = this.state.isAddingTicket;
        let eventContent;
        let ticketContent;
        let artistContent;
        let cancelled;

        if(this.eventOverview) {
            if(this.eventOverview.cancelled ) {
                console.log(this.eventOverview.cancelled);
                cancelled = <div style={{backgroundColor: "#ff4a3d", height: "9vh"}}><p style={{color: "white", fontSize: "5vh"}} className="justify-content-center row">Avlyst</p></div>
            } else {
                cancelled = <div></div>;
            }
        } else {
            cancelled = <div></div>;
        }

        if (!this.eventOverview || !this.tickets || !this.eventEquipment) return null;

        if(isEditingEvent) {
            eventContent = <EventEdit
                eventId={this.currentEvent}
                onClick={this.handleEventEdit}
                handleClickCancel={this.handleEventEdit}/>;
        }else {
            eventContent = <EventView eventId={this.currentEvent} handleClick={this.handleEventView} isArtist={this.state.isArtist}/>;
        }
        if(isAddingTicket){
            ticketContent = <TicketAdd
                eventId={this.currentEvent}
                postedTicket={this.handleTicketAdd}
                handleCancel={this.handleTicketAdd}
            />

        }else {
            if (isEditingTicket) {
                ticketContent = <TicketEdit ticketId={this.state.currentTicketID}
                                            handleSaveEdit={this.handleTicketEdit}
                                            handleDelete={this.handleTicketEdit}
                                            handleCancel={this.handleTicketEdit}
                                            onClick={this.handleTicketEdit}/>
            }else {
                ticketContent = <TicketView triggerParentUpdate={this.editThisTicket} eventId={this.currentEvent}
                                            handleEditTicketClick={this.handleTicketView}
                                            handleAddTicketClick={this.handleTicketAdd} isArtist={this.state.isArtist}/>
            }

        }

        if(isEditingRiders) {
            riderContent =  <RiderEdit onClick={this.handleRiderEdit}/>
        } else {
            if (!this.state.isArtist) {
                riderContent = <AddRiderType onClick={this.handleRiderView}/>
            }
        }

        return (
            <div className="container">
                {cancelled}
                <div className="card">
                    <div>
                        <h3 id="overview-title">{this.eventOverview.title}</h3>
                        <div className="card-header" id="overview-header">
                            <ul className="nav nav-tabs nav-fill card-header-tabs" role="tablist" id="eventOverview">
                                <li className="nav-item nav-item-event-overview">
                                    <a className="nav-link active" href="#overview" data-toggle="tab">Oversikt</a>
                                </li>
                                <li className="nav-item nav-item-event-overview">
                                    <a className="nav-link" href="#staff" data-toggle="tab">Personell</a>
                                </li>
                                <li className="nav-item nav-item-event-overview">
                                    <a className="nav-link" href="#ticket" data-toggle="tab">Billettyper</a>
                                </li>
                                <li className="nav-item nav-item-event-overview">
                                    <a className="nav-link" href="#riders" data-toggle="tab">Riders</a>
                                </li>
                                <li className="nav-item nav-item-event-overview">
                                    <a className="nav-link" href="#equipment" data-toggle="tab">Utstyr</a>
                                </li>
                                <li className="nav-item nav-item-event-overview">
                                    <a className="nav-link" href="#documents" data-toggle="tab">Dokumenter</a>
                                </li>
                                <li className="nav-item nav-item-event-overview">
                                    <a className="nav-link" href="#artist" data-toggle="tab">Artister</a>
                                </li>
                            </ul>
                        </div>
                        <div className="card-body">
                            <div className="tab-content" id="eventOverviewContent">
                                <div className="tab-pane active" id="overview" role="tabpanel">
                                    {eventContent}
                                </div>
                                <div className="tab-pane" id="staff" role="tabpanel">
                                    <h5>Personell oversikt</h5>
                                    <AddRole eventId={this.currentEvent} isArtist={this.state.isArtist}/>
                                </div>
                                <div className="tab-pane" id="ticket" role="tabpanel">
                                    {ticketContent}
                                </div>
                                <div className="tab-pane" id="riders" role="tabpanel">
                                    <RiderEdit eventId={this.currentEvent}/>
                                </div>
                                <div className="tab-pane" id="equipment" role="tabpanel">
                                    <AddEquipment eventId={this.currentEvent}
                                                  isArtist={this.state.isArtist}/>
                                </div>
                                <div className="tab-pane" id="documents" role="tabpanel">
                                    <FileMain eventId={this.currentEvent} isArtist={this.state.isArtist}/>
                                </div>
                                <div className="tab-pane" id="artist" role="tabpanel">
                                    <AddEventArtist eventId={this.currentEvent} isArtist={this.state.isArtist}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EventOverview;