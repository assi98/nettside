
// @flow

import axios from 'axios';

export class Event {
    event_id: number;
    title: string;
    description: string;
    location: string;
    start_time: string;
    end_time: string;
    category: string;
    capacity: number;
    organizer: number;
    cancelled: number;

    constructor(
        title: string,
        description: string,
        location: string,
        startTime: string,
        endTime: string,
        category: string,
        capacity: number,
        organizer: number,
        cancelled: 0)
    {
        this.title = title;
        this.description = description;
        this.location = location;
        this.start_time = startTime;
        this.end_time = endTime;
        this.category = category;
        this.capacity = capacity;
        this.organizer = organizer;
        this.cancelled = cancelled;
    }

}

export class Contact {
    first_name: string;
    last_name: string;
    email: string;

    constructor(first_name: string, last_name: string, email: string) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
    }
}


class CancelEventService {

    getCancelledEvents() {
        return axios.get<Event[]>('http://localhost:4000/cancelledevent').then(response => response.data);
    }

    cancelEvent(event: Event, eventId: number) {
        return axios.put('http://localhost:4000/cancelevent/' + eventId, event).then(response => response.data);
    }

    //Temp add
    getFrontpageEvents() {
        return axios.get<Event[]>('http://localhost:4000/event').then(response => response.data);
    }

    getCancelledEventInfo(eventId: number) {
        return axios.get<Contact>('http://localhost:4000/emailinfo/' + eventId).then(response => response.data);
    }

}

export let cancelEventService = new CancelEventService();