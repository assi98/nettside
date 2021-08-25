//@flow

import axios from 'axios';
import {userService} from "./userService";

export class Equipment {
    item: string;
}

export class EventEquipment extends Equipment{
    event: number;
    equipment: number;
    item: string;
    amount: number;

    constructor(props) {
        super(props);
        this.item = '';
        this.amount = 1;
    }

}

class EquipmentService {
    getEquipment(): Equipment[] {
        return axios.get<Equipment[]>(`http://localhost:4000/auth/id/${userService.getUserId()}/equipment`, {
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

    getEquipmentByEvent(eventId: number): EventEquipment[] {
        return axios.get<EventEquipment[]>(`http://localhost:4000/auth/id/${userService.getUserId()}/equipment?event=${eventId}`, {
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

    addEquipmentToEvent(eventId: number, equipment: Equipment, amount: number): void {
        return axios.post(`http://localhost:4000/auth/id/${userService.getUserId()}/event/${eventId}/equipment`,
            {item: equipment.item,
                amount: amount}, {
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

    removeEquipmentFromEvent(eventEquipment: EventEquipment): void {
        return axios.delete(`http://localhost:4000/auth/id/${userService.getUserId()}/event/${eventEquipment.event}/equipment/${eventEquipment.equipment}`, {
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

    updateEquipmentOnEvent(eventEquipment: EventEquipment): void {
        return axios.put(`http://localhost:4000/auth/id/${userService.getUserId()}/event/${eventEquipment.event}/equipment/${eventEquipment.equipment}`,
            {amount: eventEquipment.amount}, {
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

export let equipmentService = new EquipmentService();
