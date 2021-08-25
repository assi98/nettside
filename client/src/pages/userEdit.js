// @flow
import * as React from 'react';
import {Component} from "react-simplified";
import {Event, eventService} from "../services/eventService";
import { createHashHistory } from 'history';
import {userService} from "../services/userService";

/**
 * Renders the page for editing a user
 */
const history = createHashHistory();
import {Ticket, ticketService} from "../services/ticketService";
import {EventEquipment, equipmentService} from "../services/equipmentService";
import AddEquipment from "../components/Equipment/add_equipment";
import TicketView from "../components/Ticket/ticket_types";
import EventView from "../components/Event/event_view";
import {EventEdit} from "../components/Event/event_edit";
import {artistService} from "../services/artistService";
import {EventViewHeader, PageHeader} from "../components/Header/headers";
/**
 * Class for the view of one event
 *
 * @author Victoria Blichfeldt
 */
//TODO fikse bug med at arrangement overview ikke alltid oppdateres etter at redigering er utført
//TODO flette utstyr og dokumenter når det er ferdig
export default class UserEdit extends Component {
    firstName: string = userService.getFirstName();
    lastName: string = userService.getLastName();
    email: string = userService.getEmail();
    phone: string = userService.getPhone();
    oldPassword: string = "";
    newPassword: string = "";
    confirmNewPassword: string = "";
    artistName: string = "";
    userForm: any = null;
    passwordForm: any = null;
    artistForm: any = null;
    errorMessage: string = "";

    constructor(props){
        super(props);
        this.state = {isEditingEvent: false}
    }

    mounted() {
//TODO get events by user

        userService.getUser().then(respons => {
            if(this.artistName !== null && this.artistName !== "null") {
                this.artistName = userService.getArtistName();
            }
            this.firstName = userService.getFirstName();
            this.lastName  = userService.getLastName();
            this.email = userService.getEmail();
            this.phone = userService.getPhone();
        });
        userService.mountDropdown();
    }


    render(){
        let artistBox;
        if(userService.getArtistName() != null && userService.getArtistName() !== "null") {
            artistBox = (
                <div className="list-group" className="">
                    <li className="list-group-item">
                        <h6>Artist navn:</h6>
                        {this.artistName}
                    </li>
                </div>
            );
        } else {
            artistBox = (
                <div className="list-group">
                    <form ref={e => (this.artistForm = e)}>
                        <li className="list-group-item">
                            <h6>Artist navn:</h6>
                            <input
                                type="text"
                                className="form-control"
                                value={this.artistName}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.artistName= event.target.value)}
                                required
                                maxLength={50}
                            />
                        </li>
                        <br></br>
                        <button type="button" className="btn btn-outline-primary" onClick={(e) => {
                            this.registerArtist();
                        }}>
                            Registrer deg som artist
                        </button>
                    </form>
                </div>
            );
        }

        return (
            //TODO en eller annen header for hvilken user som er logget inn
            <div className="container mt-4" id="userOverview">
                <div className="row">
                    <div className="col-md-12">
                        <EventViewHeader label="Profil"/>
                        <div className="list-group" className="">
                            <form ref={e => (this.userForm = e)} onSubmit={this.saveChanges}>
                                <li className="list-group-item">
                                    <h6>Brukernavn</h6>
                                    {userService.getUsername()}
                                </li>
                                <li className="list-group-item">
                                    <h6>Navn</h6>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={this.firstName}
                                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.firstName = event.target.value)}
                                                required
                                                maxLength={50}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={this.lastName}
                                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.lastName  = event.target.value)}
                                                required
                                                maxLength={50}
                                            />
                                        </div>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <h6>Epost</h6>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.email}
                                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.email= event.target.value)}
                                        required
                                        maxLength={50}
                                    />
                                </li>
                                <li className="list-group-item">
                                    <h6>Telefon</h6>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.phone}
                                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.phone= event.target.value)}
                                        required
                                        maxLength={50}
                                    />
                                </li>
                                <br></br>
                                <button type="submit" className="btn btn-outline-primary" >
                                    Lagre Endringer
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <br/>
                        <EventViewHeader label="Passord"/>
                        <div className="list-group">
                            <form ref={e => (this.passwordForm = e)} onSubmit={this.changePassword}>
                                <li className="list-group-item">
                                    <h6>Gammelt passord</h6>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={this.oldPassword}
                                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.oldPassword = event.target.value)}
                                        required
                                        maxLength={256}
                                    />
                                </li>
                                <li className="list-group-item">
                                    <h6>Nytt passord</h6>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={this.newPassword}
                                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.newPassword = event.target.value)}
                                        required
                                        maxLength={256}
                                    />
                                </li>
                                <li className="list-group-item">
                                    <h6>Gjenta nytt passord</h6>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={this.confirmNewPassword}
                                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.confirmNewPassword= event.target.value)}
                                        required
                                        maxLength={256}
                                    />
                                </li>
                                <br/>
                                <button type="submit" className="btn btn-outline-primary">
                                    Oppdater passord
                                </button>
                            </form>
                        </div>
                        <br></br>

                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <EventViewHeader label="Artist"/>
                        {artistBox}
                    </div>
                </div>
                <p>{this.errorMessage}</p>
                <div className="row">
                    <div className="col-md-12">
                        <div className="list-group">
                            <button type="button" className="btn btn-outline-primary"
                                style={{marginTop: "20px"}}
                                onClick={(e) => {
                                    history.push("/user/" + userService.getUserId() + "/overview");
                                }}>
                                Tilbake
                            </button>
                           <br/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    saveChanges(e) {
        if(!this.userForm || !this.userForm.checkValidity()) {
            this.errorMessage = "Brukerinformasjon error";
            return;
        }
        userService.updateUser(this.email, this.firstName, this.lastName, this.phone).then(response => {
            history.push("/user/" + userService.getUserId() + "/overview");
            if(response.error) {
                this.errorMessage = response.error;
                return;
            } else {
                userService.getUser().then(response => {
                    this.errorMessage = "Brukerinformasjon oppdatert";
                    this.mounted();
                });
            }
        })
    }

    changePassword(e) {
        if(!this.passwordForm || !this.passwordForm.checkValidity()) {
            this.errorMessage = "Passord error";
            return;
        }
            if(this.newPassword === this.confirmNewPassword) {
                userService.updatePassword(this.oldPassword, this.newPassword).then(response => {
                    if(response.error) {
                        this.errorMessage = "Feil passord";
                    } else {
                        this.oldPassword = "";
                        this.newPassword = "";
                        this.confirmNewPassword = "";
                        this.errorMessage = "Passord oppdatert";
                    }
                })
            } else {

                this.errorMessage = "Passord ikke like";
            }
    }

    registerArtist() {
        artistService.createArtistOnContact(this.artistName, userService.getUserId()).then(response => {
            artistService.getArtistByUser(userService.getUserId()).then(response => {
                console.log(response);
                console.log("yo");
                if(response[0][0]) {
                    if(response[0][0].artist_id) {
                        userService.setArtist(response[0][0].artist_id, response[0][0].artist_name);
                    }
                }
                this.mounted();
            })
        })
    }

    saveImageChanges() {
        this.errorMessage = "saveImageChanges ikke implementert";
    }
}
