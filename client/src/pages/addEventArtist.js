// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import {Component} from 'react-simplified';
import {Artist, artistService} from "../services/artistService";
import {eventService, Event, Document} from "../services/eventService";
import {Modal} from 'react-bootstrap';
import {Button} from "../components/Buttons/buttons";
import {userService} from "../services/userService";
import Autosuggest from 'react-autosuggest';
import {Alert} from '../components/Alert/alert';
import {fileInfoService} from "../services/fileService";
import {EventViewHeader} from "../components/Header/headers";

/**
 * Renders the page for adding an artist to an event, and deleting an artist from an event
 */

const getSuggestionValue = suggestion => suggestion.artist_name;

const renderSuggestion = suggestion => (
    <div>
        {suggestion.artist_name}
    </div>
);

export class AddEventArtist extends Component {
    errorMessage:string="";
    event: Event = new Event();
    newArtist: Artist;
    seeArtist: Artist;
    eventArtists: Artist[] = [];
    eventDocuments: Document[] = [];
    artistFilter: string = "";
    documentId: number = -1;
    name: string = "";
    path: string = "./files/";
    nameAddOn: string = "------";
    errorMessage = "";

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {file: null};

        this.newArtist = {
            artist_id: -1,
            artist_name: "",
            first_name: "",
            last_name: "",
            email: "",
            phone: ""
        };

        this.seeArtist = {
            artist_id: -1,
            artist_name: "",
            first_name: "",
            last_name: "",
            email: "",
            phone: ""
        };

        this.state = {
            value: '',
            showRemoveWarning: false,
            showConfirmAddUser: false,
            eventArtists: [],
            storedArtists: [],
            suggestions: []
        };
    }

    mounted(): void {
        this.fetchData();
    }

    /**
     * Updates all component data from the database
     */
    fetchData() {
        this.eventArtists = [];
        eventService
            .getEventById(this.props.eventId)
            .then(event =>{
                this.event = event[0];
                if(event.body.error) this.errorMessage = event.body.error;
            })
            .catch((error: Error) => error.message);

        artistService
            .getArtistByEvent(this.props.eventId)
            .then(artists =>{
                this.eventArtists = artists[0];
                if(artists.body.error) this.errorMessage = artists.body.error;
            })
            .catch((error: Error) => error.message);

        this.setState({eventArtists: []}, () => {
            artistService
                .getArtistByEvent(this.props.eventId)
                .then(artists =>{
                    this.setState({eventArtists: artists[0]});
                    if(artists.body.error) this.errorMessage = artists.body.error;
                })
                .catch((error: Error) => error.message);
        });

        this.setState({storedArtists: []}, () => {
            artistService
                .getArtistByEvent(this.props.eventId)
                .then(artists =>{
                    this.setState({storedArtists: artists[0]});
                    if(artists.body.error) this.errorMessage = artists.body.error;
                })
                .catch((error: Error) => error.message);
        });

        eventService
            .getDocumentByEvent(this.props.eventId)
            .then(documents =>{
                this.eventDocuments = documents[0];
                if(documents.body.error) this.errorMessage = documents.body.error;
            })
            .catch((error: Error) => error.message);
    }

    /**
     * Shows a modal dialog window
     * @param e Component triggering the dialog
     */
    show(e) {
        if (e.target.id === "showWarning") {
            this.setState({showRemoveWarning: true});
        } else if (e.target.id === "showAddUser") {
            this.setState({showConfirmAddUser: true});
        }
    };

    /**
     * On form data change
     * @param e
     */
    onChange(e) {
        switch (e.currentTarget.id) {
            case "documentSelect":
                this.documentId = e.target.value !== "" ? e.target.value : -1;
                break;
            case "artistFilter":
                this.artistFilter = e.target.value;
                break;
            default:
                const name = e.target.name;
                this.newArtist[name] = e.target.value;
                break;
        }
    }

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.state.storedArtists.filter(artist =>
            artist.artist_name.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    onSuggestionsFetchRequested = ({value}) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.keyCode) {
            case 13: {
                event.preventDefault();
            }
        }
    };

    /**
     * Called whenever the artist list is clicked
     * @param artist Artist object that was clicked on
     */
    onSelect(artist: Artist) {
        this.seeArtist = artist;
    }

    /**
     * Removes an artist from the event
     * @param e
     */
    removeArtist(e) {
        artistService
            .removeArtistFromEvent(this.event.event_id, this.seeArtist.artist_id)
            .then(response => this.fetchData());
        this.seeArtist = {
            artist_id: -1,
            artist_name: "",
            first_name: "",
            last_name: "",
            email: "",
            phone: ""
        };
        this.setState({showRemoveWarning: false});
        Alert.success("artistAlert", "Artist ble fjernet");
    }

    /**
     * Adds a user to the selected artist if none exist
     * @param e
     */
    addArtistUser(e) {
        userService
            .generateArtistUser(this.seeArtist.artist_name, this.seeArtist.first_name, this.seeArtist.last_name,
                                this.seeArtist.phone, this.seeArtist.email, this.seeArtist.contact_id)
            .then(response => this.fetchData());
        this.setState({showConfirmAddUser: false});
    }

    download() {
        window.open("http://localhost:4000/api/file/download/contract/" + this.seeArtist.artist_id, "_blank");
        fileInfoService.downloadContract(this.seeArtist.artist_id).then( res => {});
    }

    onDropdownChange = (event, {newValue}) => {
        this.setState({
            value: newValue
        });

        this.newArtist.artist_name = newValue;
    };

    /**
     * Called when the 'submit artist' button is pressed. Adds the artist from form to this event
     * @param e
     */
    onSubmit(e) {
        let file = this.state.file;
        let formData = new FormData();
        e.preventDefault();
        if(file && this.name !== file.name){
            if(this.name.slice((Math.max(0, this.name.lastIndexOf(".")) || Infinity) + 1) !== file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1)){
                this.name = this.name + "." + file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1)
            }
        }
        if(Number.parseInt(this.documentId) === -1){
            if(this.state.file !== null){
                fileInfoService.checkFileName(this.props.eventId, this.name)
                    .then(response => {
                        console.log("DUP?: "+ response[0][0].duplicate);
                        if(response[0][0].duplicate === 0){

                            const myNewFile = new File([file], this.props.eventId + this.nameAddOn + this.name, {type: file.type});

                            formData.append('file', myNewFile);
                            formData.append('name', this.name);
                            formData.append('path', this.path + myNewFile.name);


                            let path = this.path + myNewFile.name;

                            artistService.addArtistWithNewContract(this.newArtist, this.name, this.props.eventId, path).then(response => {
                                if (response.error) {
                                    if (response.error.errno === 1062) {
                                        Alert.danger("artistAlert", "Artist er allerede tilknyttet arrangement");
                                    } else {
                                        Alert.danger("artistAlert", "En feil har oppstått (testkode: " + response.error.errno + ")" );
                                    }
                                } else {
                                    Alert.success("artistAlert", "Artist lagt til event");
                                    fileInfoService.updateFile(formData).then(res =>{
                                        console.log("should have posted to server");
                                    });
                                    console.log("should have posted fileInfo to database");
                                    this.fetchData();
                                    this.newArtist = {
                                        artist_id: -1,
                                        artist_name: "",
                                        first_name: "",
                                        last_name: "",
                                        email: "",
                                        phone: ""
                                    };
                                    this.documentId = -1;
                                    this.name="";
                                    this.file=null;
                                    this.setState({file: null});

                                }
                            });
                        }else{
                            this.errorMessage = "En fil med dette navnet finnes allerede";
                            this.mounted();
                        }
                    });
            }
        }else{
            console.log("I am here");
            artistService.addArtistToEvent(this.newArtist, this.documentId).then(response => {
                if (response.error) {
                    if (response.error.errno === 1062) {
                        Alert.danger("artistAlert", "Artist er allerede tilknyttet arrangement");
                    } else {
                        Alert.danger("artistAlert", "En feil har oppstått");
                    }
                } else {
                    this.fetchData();
                    this.newArtist = {
                        artist_id: -1,
                        artist_name: "",
                        first_name: "",
                        last_name: "",
                        email: "",
                        phone: ""
                    };
                    this.documentId = -1;
                    this.name="";
                    this.file=null;
                    this.setState({file: null});
                    Alert.success("artistAlert", "Artist lagt til event");
                }
            });
        }
    }

    onSuggestionSelected = (e, data) => {
        const artistName = data.suggestionValue;
        let selectArtist = this.state.storedArtists.filter(a => a.artist_name === artistName)[0];
        this.newArtist = Object.assign({}, selectArtist);
    };

    handleFile(e) {
        let file = e.target.files[0];
        this.setState({file: file});
        this.name = file.name;
    }

    render() {
        let uploadBox;
        if(Number.parseInt(this.documentId) === -1){
            uploadBox = (
                <div>
                    <input
                        type="text"
                        className="form-control m-2"
                        value={this.name}
                        placeholder="Filnavn"
                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.name = event.target.value)}
                        required
                        maxLength={50}
                    />
                    <input
                        type="file"
                        className="form-control m-2"
                        value={this.file}
                        placeholder="Fil"
                        onChange={(e) => this.handleFile(e)}
                        required
                        style={{paddingBottom: "50px", paddingTop: "20px"}}
                        accept=".txt,.pdf,.doc,.docx,.odt"
                    />
                </div>
            )
        }else{
            uploadBox = (
                <div>
                </div>
            )
        }
        const {value, suggestions} = this.state;

        const inputProps = {
            placeholder: 'Artistnavn',
            value: this.newArtist.artist_name,
            onChange: this.onDropdownChange,
            className: "form-control m-2",
            required: "true",
            onKeyDown: this.onKeyDown,
            name: "artist_name"
        };

        return (
            <div>
                <div>
                    <h5 className="m-2">Artistliste for {this.event.title}</h5>
                    <div className="row">
                        <div className="col-lg-6">
                            <select size="10" className="form-control m-2" id="exampleFormControlSelect1">
                                {this.state.eventArtists.filter(artist => artist.artist_name.toLowerCase().includes(this.artistFilter.toLowerCase())).map(artist =>
                                    <option value={artist} key={artist.artist_id}
                                            onClick={() => this.onSelect(artist)}>{artist.artist_name}</option>
                                )}
                            </select>
                            <input className="form-control m-2" name="filter" placeholder="Filter" id="artistFilter"
                                   value={this.artistFilter}
                                   onChange={this.onChange}/>
                        </div>
                        <div className="col-lg-6">
                            <div className="card m-2">
                                <div className="card-header">
                                    Artist
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{this.seeArtist.artist_name}</h5>
                                    <p className="card-text"><b>Fullt
                                        navn: </b>{this.seeArtist.first_name + " " + this.seeArtist.last_name}</p>
                                    <p className="card-text"><b>Epost: </b>{this.seeArtist.email}</p>
                                    <p className="card-text"><b>Telefonnr.: </b>{this.seeArtist.phone}</p>
                                    {this.seeArtist.artist_name !== "" ? <p className="card-text">
                                        <a onClick={this.download} href="javascript:;"><img src="./img/icons/download.svg"/> Last ned kontrakt</a>
                                    </p> : null}
                                    {this.seeArtist.artist_name !== "" ?
                                        <div className="align-bottom form-inline">
                                            {!this.seeArtist.user_id && !this.props.isArtist ?
                                                <button
                                                    id="showAddUser"
                                                    className="btn btn-primary m-1"
                                                    onClick={this.show}>
                                                    Opprett bruker
                                                </button> : null}
                                            {!this.props.isArtist ?
                                                <button
                                                    id="showWarning"
                                                    className="btn btn-danger m-1"
                                                    onClick={this.show}>
                                                    Fjern
                                                </button> : null}
                                        </div>
                                        : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    {!this.props.isArtist ?
                        <div>
                            <hr/>
                            <form className="w-75 m-4" onSubmit={this.onSubmit}>
                                <EventViewHeader label="Legg til ny artist:"/>
                                <div className="row">
                                    <div className="col">
                                        <Autosuggest suggestions={suggestions}
                                                     onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                                     onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                                     getSuggestionValue={getSuggestionValue}
                                                     renderSuggestion={renderSuggestion}
                                                     inputProps={inputProps}
                                                     onSuggestionSelected={this.onSuggestionSelected}/>

                                    </div>
                                    <div className="col">
                                        <div className="m-2"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <input
                                            className="form-control m-2 col"
                                            name="first_name"
                                            placeholder="Fornavn"
                                            value={this.newArtist.first_name}
                                            onChange={this.onChange}
                                            required/>
                                    </div>
                                    <div className="col">
                                        <input className="form-control m-2 col" name="last_name" placeholder="Etternavn"
                                               value={this.newArtist.last_name} onChange={this.onChange} required/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <input className="form-control m-2" name="email" placeholder="E-post"
                                               value={this.newArtist.email} onChange={this.onChange} required/>
                                    </div>
                                    <div className="col">
                                        <input className="form-control m-2" name="phone" placeholder="Telefonnr."
                                               value={this.newArtist.phone} onChange={this.onChange} required/>
                                    </div>
                                </div>
                                <EventViewHeader label="Legg til kontrakt"/>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-8">
                                                <select id="documentSelect" className="custom-select m-2"
                                                        value={this.documentId}
                                                        onChange={this.onChange}>
                                                    <option selected value="">Velg dokument...</option>
                                                    {this.eventDocuments.map(document =>
                                                        <option value={document.document_id}>{document.name}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="col-4">
                                                <button
                                                    type="button"
                                                    className="btn btn-success m-2"
                                                    style={{}}
                                                    onClick={this.mounted}
                                                >Oppdater</button>
                                            </div>
                                        </div>
                                        {uploadBox}
                                    </div>
                                    <div className="col"/>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <button className="btn btn-outline-primary m-2" type="submit">Legg til
                                        </button>
                                    </div>
                                </div>
                                <Alert name="artistAlert"/>
                            </form>
                        </div>
                        : null}
                </div>
                <Modal
                    show={this.state.showRemoveWarning}
                    onHide={() => this.setState({showRemoveWarning: false})}
                    centered>
                    <Modal.Header>
                        <Modal.Title>Advarsel</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Er du sikker på at du vil slette kontrakten med denne artisten?
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Light id="closeWarning"
                                      onClick={() => this.setState({showRemoveWarning: false})}>Lukk</Button.Light>
                        <Button.Red onClick={this.removeArtist}>Slett</Button.Red>
                    </Modal.Footer>
                </Modal>
                <Modal
                    show={this.state.showConfirmAddUser}
                    onHide={() => this.setState({showConfirmAddUser: false})}
                    centered>
                    <Modal.Header>
                        <Modal.Title>Bekreft</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Bekreft opprettelse av bruker for {this.seeArtist.artist_name}.
                            E-post med innlogging blir sendt til {this.seeArtist.email}
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Light
                            id="closeAddUser"
                            onClick={() => this.setState({showConfirmAddUser: false})}>Lukk</Button.Light>
                        <Button.Green onClick={this.addArtistUser}>Bekreft</Button.Green>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}