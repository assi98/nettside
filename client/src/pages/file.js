//@flow

/**
 * Renders the page for adding, downloading and deleting the files to an event
 */

import * as React from 'react';
import {Component} from "react-simplified";
import {createHashHistory} from 'history';
const history = createHashHistory();
import { FileInfo, fileInfoService, fileService } from "../services/fileService";
import {Alert} from "../components/Alert/alert";
import {Button} from "../components/Buttons/buttons";
import {Modal} from "react-bootstrap";
import {AddRiderType} from "../components/Rider/rider";
import {Rider} from "../services/riderService";
import {userService} from "../services/userService";

export class FileMain extends Component {
    errorMessage: string = "";
    rider = new Rider(
        '',
        ''
    );

    constructor(props) {
        super(props);
        this.state = {file: null, showConfirmDelete: false};
    }

    form: any = null;
    name: string = "";
    fileList: Object[] = [];
    errorMessage: string = "";
    path: string = "./files/";
    nameAddOn: string = "------";

    /*render() {
        return(
            <div>
                <Alert/>
                <div className="row justify-content-center">
                    <div className="row" style={{}}>
                        <div className="card" style={{}}>
                            <form ref={e => (this.form = e)}>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.name}
                                    placeholder="Filnavn"
                                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.name = event.target.value)}
                                    required
                                    maxLength={50}
                                />
                                <input
                                    type="file"
                                    className="form-control"
                                    value={this.file}
                                    placeholder="Fil"
                                    onChange={(e) => this.handleFile(e)}
                                    required
                                    style={{paddingBottom: "50px", paddingTop: "20px"}}
                                />
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    style={{}}
                                    onClick={e => this.handleUpload(e)}
                                    style={{marginBottom: "0px", marginTop: "20px", width: "100%"}}
                                >Last opp</button>
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    style={{}}
                                    onClick={e => this.handleOverwrite(e)}
                                    style={{marginBottom: "0px", marginTop: "20px", width: "100%"}}
                                >Skriv over</button>
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    style={{}}
                                    onClick={() => {this.setState({showConfirmDelete: true})}}
                                    style={{marginBottom: "0px", marginTop: "20px", width: "100%"}}
                                >Slett</button>
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    style={{}}
                                    onClick={e => this.handleDownload(e)}
                                    style={{marginBottom: "0px", marginTop: "20px", width: "100%"}}
                                >Last ned</button>
                            </form>
                            <p style={{color: "red"}}>{this.errorMessage}</p>
                        </div>
                    </div>
                    <div className="card" style={{width: "25%"}}>
                        <div className="list-group">
                            <li className="list-group-item" style={{}}>
                                <div className="row justify-content-center">
                                    Dokumenter
                                </div>
                            </li>
                            <select size="10" className="form-control" id="selectDocument">
                                {this.fileList.map(f =>
                                    <option value={f.document_id} key={"fileId" + f.document_id}
                                            onClick={(event) => this.setState({selected: event.target.innerText})}>{f.name}</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>
                <Modal
                    show={this.state.showConfirmDelete}
                    onHide={() => this.setState({showConfirmDelete: false})}
                    centered>
                    <Modal.Header>
                        <Modal.Title>Advarsel</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Er du sikker på at du ønsker å slette denne filen?
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Light
                            id="closeConfirmDelete"
                            onClick={() => this.setState({showConfirmDelete: false})}>Lukk</Button.Light>
                        <Button.Red onClick={() => {this.handleDelete(); this.setState({showConfirmDelete: false})}}>Bekreft</Button.Red>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }*/

    render() {
        return (
            <div className="w-100 m-2">
                <h4>{`Dokumenter`}</h4>
                <Alert name="fileAlert"/>
                {!this.props.isArtist ?
                    <form className="form-inline" onSubmit={this.handleUpload}>
                        <div className="form-group m-2">
                            <input
                                type="file"
                                className="form-control"
                                value={this.file}
                                placeholder="Fil"
                                onChange={(e) => this.handleFile(e)}
                                required
                                accept=".txt,.pdf,.doc,.docx,.odt"
                            />
                        </div>
                        <div className="form-group m-2">
                            <input
                                type="text"
                                className="form-control"
                                value={this.name}
                                placeholder="Filnavn"
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.name = event.target.value)}
                                required
                                maxLength={50}
                            />
                        </div>

                        <div className="form-group m-2">
                            <button type="submit" className="btn btn-outline-primary" style={{marginRight: '1vh'}}>Last opp</button>
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                style={{}}
                                onClick={this.mounted}
                            >Oppdater</button>
                        </div>
                    </form>
                    : null}
                <table className="table">
                    <thead>
                    <tr className="d-flex">
                        <th className="col-7">Filnavn</th>
                        <th className="col-5"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.fileList.map(f => (
                        <tr className="d-flex">
                            <td className="col-lg-8">{f.name}</td>
                            {!this.props.isArtist ?
                                <div className="row justify-content-center">
                                    <div className="col-lg-2">
                                        <button type="button" className="btn btn-link"
                                                onClick={(event) => {
                                                    this.setState({selected: f.name});
                                                    this.handleDownload(event, f.name);
                                                }}>
                                            <img src="./img/icons/download.svg" width="24" height="24"/>
                                        </button>
                                    </div>
                                    <div className="col-lg-2" style={{marginLeft: '1vw'}}>
                                        <button type="button" className="btn btn-outline-danger"
                                                onClick={() => {
                                                    this.setState({selected: f.name, showConfirmDelete: true})
                                                }}>Fjern
                                        </button>
                                    </div>
                                </div>
                                : null}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Modal
                    show={this.state.showConfirmDelete}
                    onHide={() => this.setState({showConfirmDelete: false})}
                    centered>
                    <Modal.Header>
                        <Modal.Title>Advarsel</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Er du sikker på at du ønsker å slette denne filen?
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-outline-primary"
                            id="closeConfirmDelete"
                            onClick={() => this.setState({showConfirmDelete: false})}>Lukk</button>
                        <button type="button" className="btn btn-outline-danger" onClick={() => {
                            this.handleDelete();
                            this.setState({showConfirmDelete: false})
                        }}>Bekreft</button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

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

    handleFile(e) {
        let file = e.target.files[0];
        this.setState({file: file});
        this.name = file.name;
    }

    handleUpload(e) {
        let file = this.state.file;
        let formData = new FormData();
        if(this.name !== file.name){
            if(this.name.slice((Math.max(0, this.name.lastIndexOf(".")) || Infinity) + 1) !== file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1)){
                this.name = this.name + "." + file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1)
            }
        }
        if(this.state.file !== null){
            fileInfoService.checkFileName(this.props.eventId, this.name)
                .then(response => {
                    if(response[0][0].duplicate === 0){

                        const myNewFile = new File([file], this.props.eventId + this.nameAddOn + this.name, {type: file.type});

                        formData.append('file', myNewFile);
                        formData.append('name', this.name);
                        formData.append('path', this.path + myNewFile.name);

                        fileInfoService.postFileInfo(this.name, this.props.eventId,  formData).then(response => {
                            if(response.data === "error"){
                                this.errorMessage = "Denne filtypen kan ikke lastes opp"
                            }
                            //this.setState({file: null});
                            console.log("should have posted fileInfo to database");
                            this.name = "";
                            this.mounted();
                        });
                    }else{
                        Alert.danger("fileAlert", 'En fil med dette navnet eksisterer allerede!');
                        //this.errorMessage = "En fil med dette navnet finnes allerede";
                        this.mounted();
                    }
                });
        }

    }

    handleDownload(e, f) {
        if (f !== undefined) {
            let filePath: string = this.path + this.props.eventId + this.nameAddOn + f;
            console.log(filePath);
            let encodedFilePath = btoa(filePath);
            //window.open("http://localhost:4000/auth/id/" + userService.getUserId() + "/file/download/" + encodedFilePath, "_blank");
            console.log(encodedFilePath);
            fileInfoService.downloadFile(encodedFilePath).then(response =>
                console.log("laster ned " + f));
            this.errorMessage = "";
            this.mounted();
        }
    }
    handleOverwrite(){
        if(this.state.selected !== undefined){
            if(this.state.selected.split('.').pop() === "txt"){
                let encodedFilePath = btoa(this.path + this.props.match.params.eventId + this.nameAddOn + this.state.selected);
                history.push("/event/" + this.props.match.params.eventId + "/edit/file/" + encodedFilePath);
            }else{
                this.errorMessage = "Kun .txt-filer kan redigeres";
                this.mounted();
            }
        }
    }

    handleDelete() {
        if (this.state.selected !== undefined) {
            let encodedFilePath = btoa(this.path + this.props.eventId + this.nameAddOn + this.state.selected);
            fileInfoService.deleteFile(encodedFilePath).then(response => {
                console.log(`Response: ${response}`);
                if (response.error) {
                    // Foreign key update fail from database
                    if (response.error.errno === 1451) {
                        Alert.danger("fileAlert", "Dokumentet kunne ikke slettes fordi det eksisterer en tilknyttet kontrakt!");
                    } else {
                        Alert.danger("FileAlert", `En feil har oppstått! (Feilkode: ${response.error.errno})`);
                    }
                } else {
                    this.mounted();
                }
            });
        }
    }
}

export class FileEdit extends Component <{ match: { params: { filepath: string, eventId: number } } }> {
    form = null;
    errorMessage: string = "";
    text: string = "";
    path: string = "./files/";

    render() {
        return (
            <div>
                <div className="row justify-content-center">
                    <div className="mb-4 border-0 " style={{width: '75%'}}>
                        <div className="card-body">
                            <form ref={e => (this.form = e)}>

                                <label htmlFor="basic-url">Tekst: </label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                    </div>
                                    <textarea
                                        className="form-control"
                                        required
                                        minLength={1}
                                        aria-label="tekst"
                                        rows="10"
                                        value={this.text}
                                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.text = event.target.value)}> </textarea>
                                </div>
                            </form>

                        </div>
                        <button
                            type="button"
                            className="btn btn-dark"
                            onClick={this.post}
                            style={{marginBottom: "0px", marginTop: "20px", width: "100%"}}
                        >Oppdater
                        </button>
                        <p style={{color: "red"}}>{this.errorMessage}</p>
                    </div>
                </div>
            </div>
        )
    }

    mounted() {
        fileInfoService.getFileContent(this.props.filepath).then(response => {
            this.text = response.data;
        });
    }

    post() {
        let formData = new FormData();

        if (!this.form || !this.form.checkValidity()) {
            Alert.danger("fileAlert", "Filnavn kan ikke stå tomt!");
            //this.errorMessage = "Filen kan ikke være tom";
            this.mounted();
        } else {
            let name = atob(this.props.match.params.filepath);
            name = name.replace(this.path, "");
            let data = new Blob([this.text], {type: 'text/plain'});
            const myNewFile = new File([data], name, {type: "text/plain"});

            formData.append('file', myNewFile);

            fileInfoService.updateFile(formData).then(response => {
                history.push("/event/" + this.props.eventId + "/edit/file");
            });
        }
    }
}
