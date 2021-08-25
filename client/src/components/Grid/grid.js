
// @flow

import * as React from 'react';
import {Component} from "react-simplified";

export class Row extends Component < { children?: React.Node } > {

    render() {

        return <div className="row">{this.props.children}</div>

    }
}

export class Column extends Component < { width?: number, children?: React.Node } > {

    render() {

        return (

            <div className={'col-lg' + (this.props.width ? '-' + this.props.width : '') + (this.props.right ? ' text-right' : '')} style={{paddingLeft: 0}}
            >
                {this.props.children}
            </div>

        )
    }
}