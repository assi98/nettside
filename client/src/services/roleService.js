// @flow

import axios from 'axios';
import {userService} from "./userService";

export class Role {
    role_id: number;
    type: string;
    event: number;
}
export class EventRole extends Role{
    role: number;
    count: number;
}

class RoleService {
    getAllRoles() {
        return axios.get<Role[]>(`http://localhost:4000/auth/id/${userService.getUserId()}/role`, {
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
    getEventRoles(eventId: number): EventRole[] {
        return axios.get<EventRole[]>(`http://localhost:4000/auth/id/${userService.getUserId()}/event/${eventId}/role`, {
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
    createRole(role: Role): void {
        console.log(role.type);
        return axios.post(`http://localhost:4000/auth/id/${userService.getUserId()}/role`,
            {type: role.type, event: role.event}, {
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
    assignRole(role: EventRole): void {
        return axios.post(`http://localhost:4000/auth/id/${userService.getUserId()}/event/${role.event}/role`,
            {role: role.role_id, event: role.event, count: role.count}, {
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
    removeRoleFromEvent(roleId: number, eventId: number): void {
        return axios.delete(`http://localhost:4000/auth/id/${userService.getUserId()}/event/${eventId}/role/${roleId}`, {
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
    removeRole(roleId: number): void {
        return axios.delete(`http://localhost:4000/auth/id/${userService.getUserId()}/role/${roleId}`, {
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
    updateRoleCount(role: Object): void {
        return axios.put(`http://localhost:4000/auth/id/${userService.getUserId()}/event/${role.event}/role`,
            {role_id: role.role_id, event: role.event, count: role.count}, {
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

export let roleService = new RoleService();
