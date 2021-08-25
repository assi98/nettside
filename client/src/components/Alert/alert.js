// @flow

import * as React from 'react';
import {Component} from "react-simplified";

/**
 * Renders alert messages using Bootstrap classes.
 */
export class Alert extends Component {
    alerts: { id: number, text: React.Node, type: string }[] = [];
    static nextId = 0;

    render() {
        return (
            <>
                {this.alerts.map((alert, i) => (
                    <div key={alert.id} className={'alert alert-' + alert.type} role="alert" style={{marginBottom: 0}}>
                        {alert.text}
                        <button
                            type="button"
                            className="close"
                            onClick={() => {
                                this.alerts.splice(i, 1);
                            }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </>
        );
    }

    static success(name: string, text: React.Node) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            Alert.instances().filter(instance => instance.props.name === name)[0].alerts.push({ id: Alert.nextId++, text: text, type: 'success' });;
        });
    }

    static info(text: React.Node) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'info' });
        });
    }

    static warning(text: React.Node) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'warning' });
        });
    }

    static danger(name: string, text: React.Node) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            Alert.instances().filter(instance => instance.props.name === name)[0].alerts.push({ id: Alert.nextId++, text: text, type: 'danger' });
            //for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'danger' });
        });
    }
}