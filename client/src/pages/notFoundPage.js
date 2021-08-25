// @flow

/**
 * Renders the 404 - page not found page
 */
import * as React from 'react';
import { Component } from 'react-simplified';

export class NotFoundPage extends Component {
    render() {
        return (
            <div className="container">
                <h1>404!</h1>
                <h3>Oooooooops...</h3>
                <hr/>
                <p>Vi kan ikke finne siden du leter etter...</p>
                <p>Det kan være lurt å ta turen tilbake til hjemmesiden. <br/>
                Hvis du tror noe er ødelagt, rapporter problemet</p>
                <hr/>
                <div className="btn-toolbar">
                    <a className="btn btn btn-outline-primary my-2 mr-2" href="#" role="button" >Hjem</a>
                    <a className="btn btn btn-outline-primary my-2 ml-2" href="#/contactUs" role="button" >Kontakt oss</a>
                </div>
            </div>
        );
    }
}