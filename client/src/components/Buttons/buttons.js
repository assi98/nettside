
// @flow

import * as React from 'react';
import {Component} from "react-simplified";
class RedButton extends Component< { onClick: () => mixed, style?: React.Node, children?: React.Node }> {

    render() {
        return (

            <button
                style={this.props.style}
                type="button"
                className="btn btn-danger btn-md btn-block"
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>

        )
    }
}

class GreenButton extends Component< { onClick: () => mixed, children?: React.Node }> {

    render() {
        return (

            <button
                type="button"
                className="btn btn-success btn-md btn-block"
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>

        )
    }
}

class LightButton extends Component< { onClick: () => mixed, children?: React.Node } > {

    render() {
        return (

            <button
                type="button"
                className="btn btn-light btn-md btn-block"
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>

        );
    }
}
class BlueButton extends Component< { onClick: () => mixed, children?: React.Node} > {

    render() {
        return (

            <button
                type="button"
                className="btn btn-info btn-md btn-block"
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>

        )
    }
}

export class Button {
    static Red = RedButton;
    static Green = GreenButton;
    static Light = LightButton;
    static Blue = BlueButton;
}
