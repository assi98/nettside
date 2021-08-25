//@flow

/**
 * Renders the register new user page
 */
import * as React from 'react';
import {Component} from "react-simplified";
import {userService} from "../services/userService";
import {createHashHistory} from 'history';
import {PageHeader} from "../components/Header/headers";

const history = createHashHistory();

export class UserRegister extends Component {
    form: any = null;
    username: string = "";
    password: string = "";
    email: string = "";
    firstName: string = "";
    lastName: string = "";
    phone: string = "";
    errorMessage: string = "";

    render() {
        return (<div className="container justify-content-center">
            <div className="m-5"><PageHeader label="Registrer deg"/>
                <form ref={e => (this.form = e)}>
                    <div className="form-group">
                        <label for="email">Email:</label>
                        <input id="email" type="email"
                             className="form-control"
                             value={this.email}
                             placeholder="eksempel@email.com"
                             onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.email = event.target.value)}
                             required maxLength={50}/>
                    </div>
                    <div className="form-group">
                        <label for="username">Fornavn:</label>
                        <input id="username" type="text"
                              className="form-control"
                              value={this.firstName}
                              placeholder="Fornavn"
                              onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.firstName = event.target.value)}
                              required maxLength={50}/>
                    </div>
                    <div className="form-group">
                        <label for="username">Etternavn:</label>
                        <input id="surname" type="text"
                                className="form-control"
                                value={this.lastName}
                                placeholder="Etternavn"
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.lastName = event.target.value)}
                                required
                                maxLength={50}/>
                    </div>
                    <div className="form-group">
                        <label for="phoneNo">Telefonnummer:</label>
                        <input id="phoneNo"
                               type="text"
                               className="form-control"
                               value={this.phone}
                               placeholder="Telefonnummer"
                               onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.phone = event.target.value)}
                               required
                               minLength={8}
                               maxLength={12}/>
                    </div>
                    <div className="form-group"><label htmlFor="username">Brukernavn:</label>
                        <input id="username"
                             type="text"
                             className="form-control"
                             value={this.username}
                             placeholder="Brukernavn"
                             onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.username = event.target.value)}
                             required
                             minLength={1}
                             maxLength={50}/>
                    </div>
                    <div className="form-group"><label for="password">Passord:</label> <input id="password"
                              type="password"
                              className="form-control"
                              value={this.password}
                              placeholder="Passord"
                              onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.password = event.target.value)}
                              required minLength={1}
                              maxLength={256}/></div>
                </form>
                <br/>
                <div className="btn-toolbar">
                    <button type="button" className="btn btn-outline-primary my-2 mr-4"
                            onClick={this.attemptRegister}>Registrer deg
                    </button>
                    <a type="button"
                          className="btn btn-outline-primary my-2"
                          href="/#">Avbryt</a>
                </div>
                <br/>                     <p style={{color: "dark-blue"}}>{this.errorMessage}</p></div>
        </div>)
    }

    attemptRegister() {
        if (!this.form || !this.form.checkValidity()) {
            this.errorMessage = "Fyll ut de røde feltene";
            return;
        }
        console.log("click2");
        userService.attemptRegister(this.username, this.password, this.email, this.firstName, this.lastName, this.phone, history);
    }
}

export class TokenBoi extends Component {
    render() {
        return (<div>
            <button type="button" className="btn btn-dark" style={{}} onClick={userService.updateToken}>Lag ny token
            </button>
        </div>)
    }
}

