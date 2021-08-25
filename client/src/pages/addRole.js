// @flow

import * as React from 'react';
import {Component} from "react-simplified";
import {createHashHistory} from 'history';
import {roleService, Role, EventRole} from "../services/roleService";
import {artistService} from "../services/artistService";
import {userService} from "../services/userService";
import {Alert} from "../components/Alert/alert";
/**
 * Renders the page for adding roles to an event, and deleting roles from an event
 */
const history = createHashHistory();

export class AddRole extends Component <{match: {params: {eventId: number}}}> {
    errorMessage:string="";
    currentEvent: number = 1;
    roles: Role[] = [];
    eventRoles: EventRole[] = [];
    newRole: Role = null;

    constructor(props, context) {
        super(props, context);
        this.newRole = {type: '', event: 0};
    }
    mounted() {
        this.currentEvent = this.props.match.params.eventId;
        this.newRole.event = this.currentEvent;
        roleService
            .getAllRoles()
            .then(roles =>{
                this.roles = roles[0];
                if(roles.body.error) {
                    this.errorMessage = roles.body.error;
                }
            })
            .catch((error: Error) => console.log(error.message));
        roleService
            .getEventRoles(this.currentEvent)
            .then(eventRoles =>{
                this.eventRoles = eventRoles[0];
                if(eventRoles.body.error) this.errorMessage = eventRoles.body.error;

            })
            .catch((error: Error) => console.log(error.message));

        artistService
            .getArtistByUser(userService.getUserID())
            .then(artists => {
                this.setState({isArtist: (artists[0].length > 0)})
                if(artists.body.error) this.errorMessage = artists.body.error;
            })
            .catch((error: Error) => console.log(error.message));
    }
    onChange(e) {
        this.newRole.type = e.target.value;
    }
    onSubmit(e) {
        e.preventDefault();
        console.log(this.newRole.type);
        roleService.createRole(this.newRole);
        this.newRole.type = '';
        window.location.reload();
    }

    remove(role){

        roleService.removeRole(role.role_id).then(response => {
            console.log('Response: ${response}');
            if (response.error) {
                // Foreign key update fail from database
                if (response.error.errno === 1451) {
                    Alert.danger("roleAlert", "rollen er i bruk i et event");
                } else {
                    Alert.danger("roleAlert", `En feil har oppstått! (Feilkode: ${response.error.errno})`);
                }
            } else {
                window.location.reload();
            }
        });

    }
    addToEvent(eventRole) {
        eventRole.count = 1;
        roleService.assignRole(eventRole);
        window.location.reload();
    }
    removeFromEvent(eventRole) {
        eventRole.event = this.currentEvent;
        roleService.removeRoleFromEvent(eventRole);
        window.location.reload();
    }
    incrementRole(eventRole) {
        eventRole.event = this.currentEvent;
        eventRole.count++;
        roleService.updateRoleCount(eventRole);
    }
    decrementRole(eventRole) {
        if(eventRole.count > 1) {
            eventRole.event = this.currentEvent;
            eventRole.count--;
            roleService.updateRoleCount(eventRole);
        }
    }
    render(){
        return(
            <div className="m-2">
                {!this.state.isArtist ?
                    <form className={"form-inline"} onSubmit={this.onSubmit}>
                        <div className="form-group m-2">
                            <input type="text"
                                   className="form-control"
                                   id="role-type"
                                   defaultValue={this.newRole.type}
                                   placeholder="Rollenavn"
                                   onChange={this.onChange}/>
                        </div>
                        <button type="submit" className="btn-primary m-2">Legg til</button>
                    </form>
                : null}
                <table className="table w-50">
                    <thead><tr><th>Personell</th></tr></thead>
                    <tbody>
                        {this.roles.map((role =>
                            <tr key={role.role_id} className="d-flex">
                                <td className="col-7">{role.type}</td>
                                {!this.state.isArtist ?
                                    <div>
                                        <td><button className="btn-primary" type="submit" onClick={() => this.addToEvent(role)}>Legg til</button></td>
                                        <td><button className="btn-danger" onClick={() => this.remove(role)}>Fjern</button></td>
                                    </div>
                                : null}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <table className="table w-50">
                    <thead><tr><th>Personell i arrangementet</th></tr></thead>
                    <tbody>
                        {this.eventRoles.map((eventRole =>
                            <tr key={eventRole.role_id} className="d-flex">
                                <td className="col-7">{eventRole.type}</td>
                                <td className="col-7">{eventRole.count}
                                    <div className="btn-group-vertical" role="group">
                                        <button type="button" className="btn-link" onClick={() => this.incrementRole(eventRole)}>
                                            <img src="../img/icons/chevron-up.svg"/></button>
                                        <button type="button" className="btn-link" onClick={() => this.decrementRole(eventRole)}>
                                            <img src="../img/icons/chevron-down.svg"/></button>
                                    </div>
                                </td>
                                <td><button type="button" className="btn-danger" onClick={() => this.removeFromEvent(eventRole)}>Fjern</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}
