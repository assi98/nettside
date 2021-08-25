// @flow

import axios from 'axios';
import {Contact} from "./TempCancelEventService";
import { userService } from "./userService";

//axios.interceptors.response.use(response => response.data);

export class Event {
    event_id: number;
    title: string;
    location: string;
    description: string;
    start_time: string;
    end_time: string;
    category: string;
    capacity: number;
    organizer: number;
    organizer_name: string;
    cancelled: number;
    image: string;

}

export class FrontpageEvent {
    event_id: number;
    title: string;
    description: string;
    location: string;
    time: string;
    category: string;
    organizer: number;
}

export class EventSearch {
    event_id: number;
    title: string;
}

export class Document {
    document_id: number;
    name: string;
}

export class CreateEvent {
    title: string;
    description: string;
    location: string;
    start_time: string;
    end_time: string;
    category: string;
    capacity: number;
    organizer: number;
}

export class EventService {

    getAllEvents() {
        return axios
            .get("http://localhost:4000/api/event").then(response => {
                if(userService.error(response)){
                    return userService.error(response);
                }
                return response.data;
            })
            .catch(error => console.log("error" + error));
    }

    getEventBy(input: string){
        console.log("input " + input);
        return axios
            .get('http://localhost:4000/api/event/search/' + input.toLocaleUpperCase())
            .then(response => response.data)
            .catch(error => console.log("error " + error.message));
    }

    getEventById(eventId: number): Event[] {
        console.log(eventId);
        return axios.get<Event[]>('http://localhost:4000/api/event/' + eventId, {
            'headers': {
                'x-access-token': userService.getToken()
            }})
            .then(response => {
                if(userService.error(response)){
                    return userService.error(response);
                }
                return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    getEventIDUpdate(eventID: number): Event[] {
        return axios.get('http://localhost:4000/api/event/' + eventID + '/edit', {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
            if(userService.error(response)){
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    getEventByName(name: string): Promise<Event[]> {
        return axios.get('/' + name, {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
            if(userService.error(response)){
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    getEventByUser(userId: number): Event[] {
        return axios.get<Event[]>('http://localhost:4000/api/user/' + userId + '/event', {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
            if(userService.error(response)){
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    getLastEventByUser(userId: number): Event[] {
        return axios.get<Event[]>('http://localhost:4000/api/user/' + userId + '/event/last', {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
            if(userService.error(response)){
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    getEndedEventsByUser(userId: number): Event[] {
        return axios.get<Event[]>('http://localhost:4000/api/user/' + userId + "/event/ended", {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
            if(userService.error(response)){
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    createEvent(createEvent: Event): Promise<void> {
        return axios.post('http://localhost:4000/auth/id/' + userService.getUserId() + '/event', createEvent, {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
            if(userService.error(response)){
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    updateEvent(eventID: number, updateEvent: CreateEvent): Promise<void> {
        return axios.put('http://localhost:4000/auth/id/' + userService.getUserId() + '/event/' + eventID + '/edit', updateEvent, {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
            if(userService.error(response)){
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    getCancelledEvents() {
        return axios.get<Event[]>('http://localhost:4000/auth/id/' + userService.getUserId() + '/event?cancelled=true', {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
            if(userService.error(response)){
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    deleteEvent(eventId: number) {
        return axios.delete<Event>('http://localhost:4000/auth/id/' + userService.getUserId() + '/event/' + eventId, {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
            if(userService.error(response)){
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    deleteEndedEvents(userId: number) {
        return axios.delete<Event[]>('http://localhost:4000/auth/id/' + userService.getUserId() + '/user/event/' + userId + '/ended', {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
            if(userService.error(response)){
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    cancelEvent(eventId: number) {
        return axios.put('http://localhost:4000/auth/id/' + userService.getUserId() + '/event/' + eventId + '/cancel', "",{
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
                if(userService.error(response)){
                    return userService.error(response);
                }
                return response.data;
            })
            .catch(error => console.log("error" + error));
    }

    //Temp add
    getFrontpageEvents() {
        return axios.get<FrontpageEvent[]>('http://localhost:4000/api/event', {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
            if(userService.error(response)){
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    getCancelledEventInfo(eventId: number) {
        return axios.get<Contact>('http://localhost:4000/auth/id/' + userService.getUserId() + '/event/' + eventId + '/email', {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
            if(userService.error(response)){
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    getCategories() {
        return axios.get('http://localhost:4000/api/categories')
            .then(response => response.data)
            .catch(error => console.log("error" + error));
    }

    getEventsByUsername(userName: string) {
        return axios.get('http://localhost:4000/api/event/search/user/' + userName)
            .then(response => response.data)
            .catch(error => console.log(error.message));
    }

    getEventsByArtist(artistId: number): Event[] {
        return axios.get<Event[]>(`http://localhost:4000/api/event?artistId=${artistId}`)
            .then(response => response.data)
            .catch(error => console.log(error.message));
    }

    //DENNE ER I FEIL SERVICE
    getDocumentByEvent(eventId: number): Document[] {
        return axios.get<Document[]>('http://localhost:4000/auth/id/' + userService.getUserId() + '/event/' + eventId + '/document', {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
            if(userService.error(response)){
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }
}

export let eventService = new EventService();
