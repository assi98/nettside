//@flow

import axios from 'axios';
import {userService} from "./userService";

export class Rider {
    rider_id: number;
    description: string;
    document: number;


    constructor(description: string, document: string) {
        this.description = description;
        this.document = document;
    }
}

class RiderService{

    addRider(rider : Rider): void {
        return axios.post(`http://localhost:4000/auth/id/${userService.getUserId()}/rider`, rider, {
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

    getRider(rider_id: number): Rider {
        return axios.get<Rider>(`http://localhost:4000/auth/id/${userService.getUserId()}/rider/one/${rider_id}`, {
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

    getAllRiders(document: number): Rider[] {
        return axios.get<Rider[]>(`http://localhost:4000/auth/id/${userService.getUserId()}/rider/all/${document}`, {
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

    updateRider(rider : Rider, id:number): void {
        return axios.put(`http://localhost:4000/auth/id/${userService.getUserId()}/rider/${id}`, rider, {
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

    deleteRider(rider_id: number): void {
        return axios.delete(`http://localhost:4000/auth/id/${userService.getUserId()}/rider/one/${rider_id}`, {
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

    deleteAllRiders(document: number): void {
        return axios.delete(`http://localhost:4000/auth/id/${userService.getUserId()}/rider/all/${document}`, {
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
}

export let riderService = new RiderService();