// @flow
import * as React from "react";

type Props = { label: string };

export function PageHeader(props: Props) {
    return (<div className="border-bottom border-dark mb-5 mt-4"><p className="h5">{props.label}</p></div>);
}

export function BigHeader(props: Props) {
    return (<div className="border-bottom border-dark mb-5 mt-4"><h1>{props.label}</h1></div>);
}

export function EventViewHeader(props: Props) {
    return (<div id="eventViewHeader" className="border-bottom border-dark mb-3 mt-4"><p className="h5">{props.label}</p></div>);
}

