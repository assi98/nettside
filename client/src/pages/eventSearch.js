// @flow

/**
 * Renders the page for searching for an event
 */

import * as React from "react";
import {Component} from "react-simplified";
import {Event, eventService} from "../services/eventService";
import {createHashHistory} from "history";
import {EventViewHeader} from "../components/Header/headers";

const history = createHashHistory();

export class EventSearch extends Component<{match: {params: {input: string}}}> {
    errorMessage:string="";
    events: Event[] = [];
    input: string = "";

    mounted(){
        this.input = this.props.match.params.input;
        eventService
            .getEventBy(this.input)
            .then(events =>{
                this.events = events[0];
                if(events.body.error) this.errorMessage = events.body.error;
            })
            .catch((error: Error) => console.log(error.message));
        eventService
            .getEventsByUsername(this.input)
            .then(events => {
                events[0].map(e => this.events.push(e));
            })
            .catch((error: Error) => console.log(error.message));
    }
    viewEvent(e){
        history.push("/event/" + e + "/view")
    }
    render() {
        console.log(this.events);
        return (
            <div>
                <div className="image-header">
                    <img src="./img/several-people-at-a-party-1540338.jpg"  style={{height: "20vh", objectFit: "cover", objectPosition: "0% 0%"}} alt="" width="100%" height="auto"/>
                </div>
                <div className="container mt-4">
                    <EventViewHeader label="Search results"/>
                    {this.events.map(events => (
                        <a href={'#/event/' + events.event_id + "/view"} style={{textDecoration: 'none'}}><div className="card" id="frontpageCard" style={{width: '70%', height: '70%', margin: 'auto', marginBottom: 20}}>
                            <img className="card-img-top img-fluid" src={"http://localhost:4000/api/file/download/" + btoa(events.image)} alt=""/>
                            <div className="card-body" style={{backgroundColor: "white"}}>
                                <h5 className="card-title">
                                    {events.title}
                                </h5>
                                <h6 className="card-subtitle mb-2 text-muted">
                                    {events.time}
                                </h6>
                            </div>
                        </div>
                        </a>
                    ))}
                </div>
            </div>
        )
    }
}