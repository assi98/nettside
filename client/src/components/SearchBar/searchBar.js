// @flow

/**
 * SearchBar components
 *
 * @author Victoria Blichfeldt
 */

import * as React from "react";
import { Component } from "react-simplified";
import { EventSearch, eventService} from "../../services/eventService";
import {createHashHistory} from "history";
const history = createHashHistory();

export class SearchBar extends Component {
    events: EventSearch[] = [];
    input: string = "";

    render() {
        return (
            <div className="form-inline dropdown show">
                <input className="form-control mr-sm-2 dropdown-toggle" type="text" value={this.input} placeholder="Søk" id="search"
                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                    if(event.target.value.trim() === '') {
                        this.input = event.target.value.trim();
                        this.mounted();
                    }else{
                        this.input = event.target.value;
                        this.mounted();
                    }
                }} minLength={1} maxLength={40} data-toggle="dropdown" onKeyPress={this.ifEnter}/>
                <div className="dropdown-menu">
                    <div className="list-group list-group-flush">
                        {this.events.map( event => (
                            <button onKeyPress={this.ifEnterInList} onClick={() => this.viewEvent(event.event_id)} type="button" className="list-group-item list-group-item-action dropdown-item">{event.title}</button>
                        ))}
                    </div>
                </div>
                <button className="btn btn-outline-dark my-2 my-sm-0" type="button" onClick={() => this.buttonSearch()}>Søk</button>
            </div>
        );
    }

    mounted() {
        if(this.input.length > 0) {
            eventService.getEventBy(this.input).then(response => {
                this.events = [];
                response[0].map(e => {
                    this.events.push(e);
                });
            }).catch((error: Error) => console.log(error.message));
        } else {
            this.events = [];
        }
    }
    viewEvent(e) {
        history.push("/event/" + e + "/view")
    }
    ifEnter = (event) => {
        if(this.input !== '')
        if(event.key === 'Enter'){
            console.log("enter");
            history.push("/event/search/" + this.input);
            this.input = '';
        }
    };
    buttonSearch() {
        if(this.input !== '')
            history.push("/event/search/" + this.input);
    }
    ifEnterInList = (event) => {
        if(event.key === 'Enter'){
            console.log("enter");
            history.push("/event/" + event.event_id + "/view");
        }
    };
}