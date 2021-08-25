// @flow
import axios from 'axios';
import { userService } from "../services/userService";


export class Ticket_ID {
    ticket_id: number;
    title: string;
    info: string;
    price: number;
    count: number;
    event : number;


    constructor(ticket_id : number, title: string, info: string, price: number, count: number, event : number) {
        this.ticket_id = ticket_id;
        this.title = title;
        this.info = info;
        this.price = price;
        this.count = count;
        this.event = event;
    }
}


export class Ticket {

    title: string;
    info: string;
    price: number;
    count: number;
    event: number;


    constructor( title: string, info: string, price: number, count: number, event : number) {
        this.title = title;
        this.info = info;
        this.price = price;
        this.count = count;
        this.event = event;
    }


}

class TicketService{
    getAllTicket(event : number) {
        return axios.get<Ticket[]>('http://localhost:4000/api/event/' + event + '/ticket', {
            'headers': {
                'x-access-token': userService.getToken()
            }
        }).then(response => response.data, {});

    }

    getTicketId(id: number) {
        return axios.get<Ticket[]>('http://localhost:4000/auth/id/' + userService.getUserId() + '/ticket/ticket/' + id, {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => response.data, {
        });
    }



    postTicket(ticket: Ticket){
        return axios.post('http://localhost:4000/auth/id/' + userService.getUserId() + '/ticket/ticket', ticket, {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => {
                return response.data;
            });
    }

    updateTicket(ticket: Ticket, id : number){
        return axios.put('http://localhost:4000/auth/id/' + userService.getUserId() + '/ticket/ticket/' + id, ticket, {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => response.data, {
        });
    }

    removeTicket(id: number) {
        return axios.delete<Ticket>('http://localhost:4000/auth/id/' + userService.getUserId() + '/ticket/ticket/' + id, {
            'headers': {
                'x-access-token': userService.getToken()
            }}).then(response => response.data, {
        });
    }


}

export let ticketService = new TicketService();
