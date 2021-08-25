// @flow

import React from "react";
import { Component } from "react-simplified";
import { userService} from "../../services/userService";
import {Link} from "react-router-dom";
import { createHashHistory } from 'history';
import {SearchBar} from "../SearchBar/searchBar";

const history = createHashHistory();

/**
 * Class for NavBar component
 *
 * @author Victoria Blichfeldt
 */

    //TODO kunne bruke skjema i popup for å logge inn
    //TODO vise hvem som er logget inn i popup -> trenger nok noe state greier fra noe user greier når det er up and running
    //TODO rette opp navbar
class NavBar extends Component {

    form: any = null;
    firstName: string = "";
    lastName: string = "";
    username: string = "";
    password: string = "";

    constructor(props, context) {
        super(props, context);

        this.state = {
            userId: 0,
            username: '',
            fullName: '',
            isLoggedIn: false
        };
    }

    logout() {
        userService.logout();
        this.mounted();
        history.push("/");
    }

    login() {
        if(this.form && this.form.checkValidity()) {
            userService.attemptLogin(this.username, this.password, this.mounted);
            this.setState({isLoggedIn: true});
        }
    }

    viewMyPage() {
        history.push("/user/" + userService.getUserId() + "/overview");
    }

    viewNewEvent() {
        history.push("/event/new");
    }

     mounted(): void {
        if(userService.getUserId() != null && userService.getUserId() !== "null") {
            this.username = userService.getUsername();
            this.firstName = userService.getFirstName();
            this.lastName = userService.getLastName();
            this.setState({isLoggedIn: true});
        }else{
            this.setState({isLoggedIn: false});
        }
         let id = userService.getUserId();
         let username = userService.getUsername();
         let fullName = `${userService.getFirstName()} ${userService.getLastName()}`;
         this.setState({userId: id, username: username, fullName: fullName});
         userService.setMountDropdown(this.mounted);
     }

    render() {
        let userIcon;
        if (userService.getUserId() > 0) {
            userIcon = (
                <div className="form-inline">
                    <div className="dropdown">
                        <button type="button" data-target="#navbarDropdown" className="btn btn-outline-dark" data-toggle="dropdown" data-html="true"
                                data-content=''>
                            <img  className="icon" src="./img/icons/person.svg" alt="login" width="22" height="22"/>
                        </button>
                        <div id="navbarDropdown" className="dropdown-menu dropdown-menu-right">
                            <div className="m-2">
                                <h5>{this.firstName + " " + this.lastName}</h5>
                                <p className="form-text text-muted">{`@${this.username}`}</p>
                                <div className="dropdown-divider"/>
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    style={{}}
                                    onClick={this.logout}
                                >Logg ut</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            userIcon = (
                <div>
                    <div className="dropdown">
                        <button type="button" data-target="#navbarDropdown" className="btn btn-outline-dark" data-toggle="dropdown" data-html="true"
                                data-content=''>
                            <img className="icon" src="./img/icons/person.svg" alt="login" width="22" height="22"/>
                        </button>
                        <div id="navbarDropdown" className="dropdown-menu dropdown-menu-right">
                            <div className="m-2">
                                <Link to="/login" style={{fontSize: "20px"}} className="mb-2">Logg inn</Link>
                                <form className="form-inline" ref={e => (this.form = e)}>
                                    <label for="username">Brukernavn:</label>
                                    <input
                                        id="username"
                                        type="text"
                                        className="form-control form-control-event-overview"
                                        value={this.username}
                                        placeholder="Brukernavn"
                                        required
                                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.username = event.target.value)}
                                        maxLength={50}
                                    />
                                    <label className="mt-2" for="password">Passord:</label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="form-control form-control-event-overview"
                                        value={this.password}
                                        required
                                        placeholder="Passord"
                                        onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.password = event.target.value)}
                                        maxLength={256}
                                    />

                                    <button
                                        type="submit"
                                        className="btn btn-outline-primary my-2"
                                        style={{}}
                                        onClick={this.login}>
                                        Logg inn
                                    </button>
                                </form>
                                <div>
                                    <p>
                                        Har du ikke en bruker?
                                    </p>
                                    <Link to="/register">Registrer deg her</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return(
            <nav className="navbar navbar-light navbar-default navbar-expand-lg sticky-top border-bottom border-light" >
                <a className="navbar-brand"  href="#">
                    <img className="mr-2" src="./img/logo/harmoni-logo-black-brown.png" alt="" height="50px" width="50px"/>
                    Harmoni
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarContent" aria-controls="navbarContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>

                <div className="collapse navbar-collapse justify-content-lg-end mr-auto" id="navbarContent">
                    <div className="nav-item">
                        <SearchBar>
                        </SearchBar>
                    </div>
                    {this.state.isLoggedIn ?
                        <div className="nav-item p-lg-1 p-md-1 p-lg-0">
                                <button type="button" className="btn btn-outline-primary" onClick={this.viewMyPage}>
                                    Min Side
                                </button>
                        </div> : null
                    }
                    <div>
                        {userIcon}
                    </div>
                </div>
            </nav>
        )
    }
}


export default NavBar;
