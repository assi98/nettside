// @flow

/**
 * Footer for  all pages
 *
 * @author Victoria Blichfeldt
 */

import React from "react";
import { Component } from "react-simplified";

class Footer extends Component {
    render() {
        return (
            <footer className="text-center mt-4" id="footer">
                <div className="border-top pt-2 pb-1 mx-3">
                    <div className="m-2 d-inline-block">&copy; 2020 Team 3</div>
                    <div className="m-2 d-inline-block"><a href="/#/contactUs">Kontakt oss</a></div>
                </div>
            </footer>
        );
    }
}

export default Footer;