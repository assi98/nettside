// @flow

import * as React from "react";
import {Component} from "react-simplified";
import {createHashHistory} from "history";
import { contactUsService, ContactUs } from '../services/contactService';
import { BigHeader } from "../components/Header/headers";
/**
 * Renders the contact form page where the operators of the website get feedback
 */
const history = createHashHistory();

export class ContactForm extends Component {
    errorMessage :string="";
    contactUsData = new ContactUs();
    form = null;

    render() {

        return (

            <div className="container">

                <div style={{textAlign: 'center'}}>
                    <BigHeader label="Kontakt oss"/>
                    <p style={{marginTop: 15}}>Bruk dette skjemaet for spørsmål, idéer, tilbakemeldinger eller andre henvendelser. </p>
                    <hr/>
                </div>

                <form ref={e => {this.form = e}} className="form-group">

                    <div className={"form-group m-2"}>
                        <label>Navn*</label>
                        <p><input
                            className="form-control"
                            type="text"
                            placeholder="Skriv inn fullt navn"
                            onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.contactUsData.name = event.target.value}
                            required={true}
                        /></p>
                    </div>

                    <div className={"form-group m-2"}>
                        <label>Epost*</label>
                        <p><input
                            className="form-control"
                            type="text"
                            placeholder="Skriv inn din epostadresse"
                            onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.contactUsData.email = event.target.value}
                            required={true}
                        /></p>
                    </div>

                    <h4 style={{marginBottom: 12, marginLeft: 8, fontSize: 21}}>Din henvendelse</h4>

                    <div className={"form-group m-2"}>
                        <label>Hva gjelder det?*</label>
                        <p>
                            <select className="form-control" onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.contactUsData.subject = event.target.value} required={true}>
                                <option value="" hidden>Velg emne </option>
                                <option value={"Spørsmål"}>Spørsmål</option>
                                <option value={"Idéer"}>Idéer</option>
                                <option value={"Melding om feil/bugs"}>Melding om feil/bugs</option>
                        </select></p>
                    </div>

                    <div className={"form-group m-2"}>
                        <label>Melding*</label>
                        <p><textarea
                            className="form-control"
                            style={{height: 200}}
                            placeholder="Skriv din melding"
                            onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.contactUsData.content = event.target.value}
                            required={true}
                        /></p>
                    </div>



                <div style={{textAlign: "center"}}>
                    <button type="submit" className="btn btn-outline-primary" onClick={this.sendEmail}>Send</button>
                </div>
            </form>
            </div>
        )
    }

    sendEmail() {

        if (!this.form || !this.form.checkValidity())  {
            return (
                Alert.danger("Vennligst fyll ut alle feltene")
            );
        }

        contactUsService
            .contactUs(this.contactUsData)
            .then(window.location.reload())
            .catch((error: Error) => console.log(error))

    }

}
