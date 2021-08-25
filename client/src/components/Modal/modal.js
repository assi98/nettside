
// @flow

import * as React from 'react';
import {Component} from "react-simplified";

//TODO gjøres om til vanlig boostrap?
export class ModalWidget extends Component < {  title: string, body: string, children: React.Node  } > {

    render() {
        return (

            <div className="modal fade" id="showModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.title}</h5>
                        </div>
                        <div className="modal-body">{this.props.body}</div>
                        <div className="modal-footer">{this.props.children}</div>
                    </div>
                </div>
            </div>

        )
    }
}