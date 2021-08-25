// @flow

import * as React from 'react';
import {Component} from "react-simplified";
import {createHashHistory} from 'history';
import {eventService, Event} from "../services/eventService";
import {fileInfoService} from "../services/fileService"
import {Alert} from "../components/Alert/alert.js";
import DateTime from 'react-datetime';
import moment from "moment";
import {userService} from "../services/userService";
import Map from "../components/map";
import {BigHeader} from "../components/Header/headers";

/**
 * Renders the page for adding new events
 */

const history = createHashHistory();

moment.locale("no");

export class AddEvent extends Component {

    event: Event[] = [];
    allEvents = [];
    categories: string[] = [];
    createEvent = new Event();
    state = {
        start_time: new moment(),
        end_time: new moment()
    };

    handleStartTime(moment) {
        this.setState({
            start_time: moment.format("YYYY-MM-DDTHH:mm:ss"),
        })
    };

    handleEndTime(moment) {
        this.setState({
            end_time: moment.format("YYYY-MM-DDTHH:mm:ss")
        });
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            address: props.currentAddress,
            start_date: new Date(),
            end_date: new Date()
        };
        //this.handleChange = this.handleChange.bind(this);
    }

    _onClick = ({x, y, lat, lng, event}) => console.log(x, y, lat, lng, event);

    getAddress = (dataFromChild) => {
        this.createEvent.location = dataFromChild;
        this.setState([{address: dataFromChild}]);
        console.log(dataFromChild);
    };


    render() {

        return (
            <div>
                <div className="container mt-4">
                    <BigHeader label="Opprett arrangement"/>
                    <div className="row">
                        <form className="col" onSubmit={this.onSubmit}>
                            <div className={"form-group m-2"}>
                                <h6>Tittel</h6>
                                <input
                                    required
                                    type={"text"}
                                    className={"form-control"}
                                    id={"event-title"}
                                    placeholder={"Tittel på arrangement"}
                                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                        (this.createEvent.title = event.target.value)}/>
                            </div>
                            <p/>
                            <div className={"form-group m-2"}>
                                <h6>Beskrivelse</h6>
                                <textarea
                                    required
                                    rows={4} cols={50}
                                    className={"form-control"}
                                    id={"event-description"}
                                    placeholder={"Beskrivelse av arrangement"}

                                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                        (this.createEvent.description = event.target.value)}
                                />
                            </div>
                            <p/>
                            <div className={"form-group m-2"}>
                                <h6>Starttidspunkt:</h6>
                                <div>
                                    <DateTime

                                        type={'text'}
                                        id={"start_time"}
                                        dateFormat={"YYYY-MM-DD"}
                                        timeFormat={"HH:mm"}
                                        locale={"no"}
                                        inputProps={{readOnly: true}}
                                        onChange={this.handleStartTime}
                                        closeOnSelect={true}

                                    />
                                </div>
                            </div>
                            <p/>
                            <div className={"form-group m-2"}>
                                <h6>Sluttidspunkt:</h6>
                                <div>
                                    <DateTime

                                        id={"end_time"}
                                        dateFormat={"YYYY-MM-DD"}
                                        timeFormat={"HH:mm"}
                                        locale={"no"}
                                        inputProps={{readOnly: true}}
                                        onChange={this.handleEndTime}
                                        closeOnSelect={true}

                                    />
                                </div>
                            </div>
                            <div className={"form-group m-2"}>
                                <h6> Type arrangement:</h6>
                                <select
                                    required
                                    name={"category"}
                                    className="custom-select"
                                    style={
                                        {
                                            width: "300px"
                                        }
                                    }
                                    onChange={event => this.createEvent.category = event.target.value}
                                    value={this.createEvent.category}>
                                    <option selectedvalue="">Velg kategori...</option>
                                    {this.categories.map(category =>
                                        <option value={category.name}>{category.name}</option>
                                    )}
                                </select>
                            </div>
                            <p/>
                            <div className={"form-group m-2"}>
                                <h6> Total kapasitet:</h6>
                                <input
                                    required
                                    type="number"
                                    className={"form-control"}
                                    id={"ticket-amount"}
                                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.createEvent.capacity = event.target.value)}
                                />
                            </div>
                            <div className="form-group m-2">
                                <label>Bilde: </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    value={this.file}
                                    placeholder="Fil"
                                    onChange={(e) => this.handleFile(e)}
                                    accept=".png,.jpg,.jpeg,.gif"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Registrer</button>
                        </form>
                        <div className={"col"}>
                            <div className="form-group m-2">
                                <h6>Lokasjon</h6>
                                <Map
                                    center={
                                        {lat: 63.4154, lng: 10.4055}
                                    }
                                    google={this.props.google}
                                    height='300px'
                                    zoom={15}
                                    onChange={this.onChangeAddress}
                                    getAddress={this.getAddress}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onChangeAddress(address: string) {
        this.createEvent.location = address;
    }

    onSubmit(e) {

        let file = this.state.file;
        let formData = new FormData();
        this.createEvent.start_time = this.state.start_time;
        this.createEvent.end_time = this.state.end_time;

        const myNewFile = new File([file], this.props.eventId + this.nameAddOn + this.name, {type: file.type});


        if (typeof this.createEvent.start_time === typeof this.createEvent.end_time && this.createEvent.start_time + 100 < this.createEvent.end_time) {
            e.preventDefault();

            eventService
                .createEvent(this.createEvent)
                .then(() => {
                    console.log(userService.getUserId());
                    eventService
                        .getLastEventByUser(userService.getUserId())
                        .then((response) => {

                            console.log("DETTE ER EN VIKTIG EVENT ID!!!" + response[0].event_id);
                            const myNewFile = new File([file], response[0].event_id + "." + file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1), {type: file.type});

                            formData.append('file', myNewFile);
                            formData.append('image', ".\/files\/" + response[0].event_id + "." + file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1));
                            console.log("./files/" + response[0].event_id + "." + file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1));
                            fileInfoService.postImage(response[0].event_id, formData).then(response => {
                                if (response.data === "error") {
                                    this.errorMessage = "Denne filtypen kan ikke lastes opp"
                                }

                                Alert.success('You have created a new event!!!!');
                                history.push('/user/' + userService.getUserId() + '/overview');
                            })
                        })
                        .catch((error: Error) => Alert.danger(error.message));
                })
                .catch((error: Error) => Alert.danger(error.message));
        } else {
            e.preventDefault();
            if (this.createEvent.start_time + 100 >= this.createEvent.end_time) {
                return alert("start må være før slutt!");
            } else {
                e.preventDefault();
                return alert("Du må fylle ut event start og slutt!");
            }

        }
    }


        handleFile(e) {
        let file = e.target.files[0];
        this.setState({file: file});
        this.createEvent.image = file.name;
    }

    mounted() {
        this.createEvent.organizer = userService.getUserId();
        eventService
            .getEventByName()
            .then(event => (this.allEvents = event))
            .catch((error: Error) => Alert.danger(error.message));
        eventService
            .getCategories()
            .then(categories => this.categories = categories[0])
            .catch((error: Error) => error.message);

        this.setState({address: this.props.currentAddress});
    }

}