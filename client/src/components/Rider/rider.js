//@flow

import * as React from 'react';
import {Component} from "react-simplified";
import { createHashHistory } from 'history';
const history = createHashHistory();
import Modal from 'react-bootstrap/Modal';
import { riderService, Rider} from "../../services/riderService";
import { Row, Column} from "../Grid/grid";
import Autosuggest from 'react-autosuggest';
import {fileInfoService} from "../../services/fileService";
import {eventService} from "../../services/eventService";
import {EventViewHeader} from "../Header/headers";


export class RiderCard extends Component <{rider_id: React.Node, description: React.Node}> {
    show = false;
    render(){
        return(
            <div className="row justify-content-center">
                <div className="card mb-4" style={{width: '50%'}}>
                    <div id={"card"} className="card-img-overlay"></div>
                    <div className="card-body">
                        <div className="card-text" style={{whiteSpace: 'pre-line'}}>{this.props.description}</div>
                        <br/>
                        <Row>
                            <Column width={2}>
                                <button type="button" className="btn btn-info" onClick={this.edit}>
                                    Rediger
                                </button>
                            </Column>
                            <Column>
                                <button type="button" className="btn btn-danger" onClick={this.handleShow}>
                                    Slett
                                </button>
                            </Column>
                        </Row>
                    </div>
                </div>
                <Modal show={this.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Er du sikker på at du vil slette denne Rideren?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <button type="button" className="btn btn-secondary" onClick={this.handleClose}>
                            Avbryt
                        </button>
                        <button type="button" className="btn btn-danger" onClick={this.delete}>
                            Slett
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
    handleShow(){
        this.show = true;
    }
    handleClose(){
        this.show = false;
        window.location.reload()
    }

    delete(){
        riderService
            .deleteRider(parseInt(this.props.rider_id))
            .then((response) => {
                console.log("Rider deleted");
                this.handleClose();
            })
            .catch((error: Error) => console.error(error.message));
    }
}

export class RiderList extends Component<{documentId: number}>{
    riders: Rider[] = [];

    render(){

        return(

            <div>

                {this.riders.map(r => (
                    <RiderCard rider_id={r.rider_id} description={r.description} key={r.rider_id}/>
                ))}

            </div>
        );
    }

    mounted(){


        riderService
            .getAllRiders(this.props.match.params.documentId)
            .then(riders => {
                this.riders = riders[0];
            })
            .catch((error: Error) => console.error(error.message));
    }
}


export class RiderEdit extends Component<{match: {params: {eventId: number}}}>{
    documentId: number = 1;
    eventDocuments: Document[] = [];
    newRider: Rider = new Rider("", null);
    fileList: Document[] = [];
    selectedFile: Document = new Document("", null);
    riderList: Rider[] = [];


    mounted() {
        this.fetch();
    }

    fetch() {
        fileInfoService.getFileInfo(this.props.eventId).then(response => {
            this.fileList = response[0];
            if(response.error) {
                this.errorMessage = response.error;
            }
        })
    }

    onChange() {

    }

    addRider() {
        if(this.newRider.description.length > 0 && this.newRider.document > 0) {
            riderService.addRider(this.newRider).then(response => {
                this.mounted();
                this.select(this.selectedFile);
                this.newRider.description = "";
            });
        }
    }

    select(f: File) {
        this.selectedFile = f;
        this.newRider.document = f.document_id;
        riderService.getAllRiders(f.document_id).then(response => {
            this.riderList = [];
            if(!response.error && response[0]) {
                this.riderList = response[0];
            }
        });
    }
    download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    deleteRider(r: Rider) {
        riderService.deleteRider(r.rider_id).then(response => {
            this.mounted();
            this.select(this.selectedFile);
        });
    }

    render(){
        return(
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="row">
                            <div className="col-12">
                                <EventViewHeader label="Kontrakter"/>
                            </div>
                            <table className="table">
                                <tbody>
                                {this.fileList.map(f => (
                                    <tr className="d-flex">
                                        <td className="col-9">{f.name}</td>
                                        {!this.props.isArtist ?
                                            <div>
                                                <td className="col-3">
                                                    <button type="button" className="btn btn-outline-primary"
                                                            style={{}}
                                                            onClick={(e) => {
                                                                this.select(f);
                                                            }}>Velg
                                                    </button>
                                                </td>
                                            </div>
                                            : null}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary m-2"
                                    style={{}}
                                    onClick={this.mounted}
                                >Oppdater</button>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="row">
                            <div className="col-12">
                                <EventViewHeader label="Riders"/>
                            </div>
                            <div className="col-12">
                                <textarea
                                    required
                                    rows={4} cols={50}
                                    value={this.newRider.description}
                                    className={"form-control"}
                                    id={"rider-description"}
                                    placeholder={"Beskrivelse av rider"}

                                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                        (this.newRider.description = event.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary ml-0 my-2"
                                    style={{}}
                                    onClick={this.addRider}
                                >Legg til</button>
                            </div>
                            <div className="col-12 my-2">
                                <hr/>
                                <h6>Valgt fil:  {this.selectedFile.name}</h6>
                            </div>
                            <div className="col-lg-12">
                                <table className="table">
                                    <tbody>
                                    {this.riderList.map(r => (
                                        <tr className="d-flex p-lg-2 p-sm-0">
                                            <td className="col-10 p-sm-0">{r.description}</td>
                                            {!this.props.isArtist ?
                                                <div>
                                                    <td className="col-2">
                                                        <button type="button" className="btn btn-outline-danger"
                                                                style={{}}
                                                                onClick={(e) => {
                                                                    this.deleteRider(r);
                                                                }}>Fjern
                                                        </button>
                                                    </td>
                                                </div>
                                                : null}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export class AddRiderType extends Component<{ description: React.Node, documentId: React.Node}>{
    rider = new Rider(
        '',
        ''
    );

    render(){

        if (!this.rider) return null;
        return(
            <form ref={e => {this.form = e}}>

                <h2>
                    Opprett en rider
                </h2>

                <div>
                    <div>Description</div>
                    <div>
                        <textarea
                            className="form-control"
                            required
                            minLength={1}
                            maxLength={100}
                            aria-label="tekst"
                            rows="10"
                            value={this.rider.description}
                            onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>{
                                (this.rider.description = event.target.value);
                                this.rider.document = this.props.documentId;}}>
                                </textarea>
                    </div>



                    <button onClick={() => {this.send(); this.props.onClick()}} type={"button"}>legg til rider</button>
                </div>
            </form>
        );}



    send() {
        if (!this.form || !this.form.checkValidity()) return;
        if (!this.rider) return null;
        console.log(this.rider.description, this.props.documentId);
        riderService.addRider(this.rider).then(() => {
            if(this.rider) {
                window.location.reload();
            }
        }).catch((error: Error) => console.log(error.message));
    }
    mounted(){

    }

}
