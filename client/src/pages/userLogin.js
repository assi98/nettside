//@flow

/**
 * Renders the login page
 */
import * as React from 'react';
import {Component} from "react-simplified";
import {userService} from "../services/userService";
import {createHashHistory} from 'history';
import {PageHeader} from "../components/Header/headers";

const history = createHashHistory();

export class UserLogin extends Component {
    form: any = null;
    username: string = "";
    password: string = "";
    errorMessage: string = "";

    render() {
        return (<div className="container">
            <div className="m-5 "><PageHeader label="Logg inn"/>
                <form ref={e => (this.form = e)}>
                    <div className="form-group"><label for="username">Brukernavn:</label> <input id="username"
                                                                                                 type="text"
                                                                                                 className="form-control"
                                                                                                 value={this.username}
                                                                                                 placeholder="Brukernavn"
                                                                                                 onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.username = event.target.value)}
                                                                                                 required
                                                                                                 maxLength={50}/></div>
                    <div className="form-group"><label for="password">Passord</label> <input id="password"
                                                                                             type="password"
                                                                                             className="form-control"
                                                                                             value={this.password}
                                                                                             placeholder="Passord"
                                                                                             onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.password = event.target.value)}
                                                                                             required maxLength={256}/>
                    </div>
                </form>
                <br/>
                <div className="btn-toolbar">
                    <button type="button" className="btn btn-outline-primary my-2 mr-4" onClick={this.attemptLogin}>Logg
                        inn
                    </button>
                    <p>{this.errorMessage}</p>
                    <button type="button" className="btn btn-outline-primary my-2"
                            onClick={this.register}>Registrer
                    </button>
                </div>
            </div>
        </div>)
    }

    attemptLogin() {
        userService.attemptLogin(this.username, this.password, () => {
        });
        history.push("/");
    }

    register() {
        history.push("/register");
    }
}

