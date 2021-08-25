//@flow

import axios from 'axios';
import {userService} from "./userService";

export class Artist {
    artist_id: number;
    artist_name: string;
    contact_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    user_id: string;
}

class ArtistService {
    getAllArtists(): Artist[] {
        return axios.get<Artist[]>(`http://localhost:4000/auth/id/${userService.getUserId()}/artist`, {
            'headers': {
                'x-access-token': userService.getToken()
            }
        })
            .then(response => {
                if (userService.error(response)) {
                    return userService.error(response);
                }
                return response.data;
            })
            .catch(error => console.log("error" + error));
    }

    getArtistById(artistId: number): Artist {
        return axios.get<Artist>(`http://localhost:4000/auth/id/${userService.getUserId()}/artist/${artistId}`, {
            'headers': {
                'x-access-token': userService.getToken()
            }
        })
            .then(response => {
                if (userService.error(response)) {
                    return userService.error(response);
                }
                return response.data;
            })
            .catch(error => console.log("error" + error));
    }

    getArtistByContactId(contactId: number): Artist {
        return axios.get<Artist>(`http://localhost:4000/auth/${userService.getUserId()}/user/contact/${contactId}/artist`, {
            'headers': {
                'x-access-token': userService.getToken()
            }
        })
            .then(response => {
                if (userService.error(response)) {
                    return userService.error(response);
                }
                return response.data;
            })
            .catch(error => console.log("error" + error));
    }

    getArtistByEvent(eventId: number): Artist[] {
        return axios.get<Artist[]>(`http://localhost:4000/api/event/${eventId}/artist`, {
            'headers': {
                'x-access-token': userService.getToken()
            }
        })
            .then(response => {
                if (userService.error(response)) {
                    return userService.error(response);
                }
                return response.data;
            })
            .catch(error => console.log("error" + error));
    }

    addArtistToEvent(artist: Artist, documentId: number, eventId): void {
        return axios.post(`http://localhost:4000/auth/id/${userService.getUserId()}/event/${eventId}/artist`,
            {
                artist_name: artist.artist_name,
                first_name: artist.first_name,
                last_name: artist.last_name,
                email: artist.email,
                phone: artist.phone,
                document_id: documentId
            }, {
                'headers': {
                    'x-access-token': userService.getToken()
                }
            })
            .then(response => {
                if (userService.error(response)) {
                    return userService.error(response);
                }
                return response.data;
            })
            .catch(error => console.log("error" + error));
    }

    insertArtist(artist: Artist): void {
        return axios.post(`http://localhost:4000/auth/id/${userService.getUserId()}/artist`, {
            artistName: artist.artist_name,
            firstName: artist.first_name,
            lastName: artist.last_name,
            email: artist.email,
            phone: artist.phone
        }, {
            'headers': {
                'x-access-token': userService.getToken()
            }
        }).then(response => {
            if (userService.error(response)) {
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    createArtistOnContact(artistName: string, contactId: number): void {
        return axios.post(`http://localhost:4000/auth/id/${userService.getUserId()}/artist`, {
            artistName: artistName,
            userId: contactId
        }, {
            'headers': {
                'x-access-token': userService.getToken()
            }
        }).then(response => {
            if (userService.error(response)) {
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    addArtistWithNewContract(artist: Artist, documentName: string, eventId: number, path: string) {
        return axios.post(`http://localhost:4000/auth/id/${userService.getUserId()}/artist/contract/${eventId}`, {
                artist_name: artist.artist_name,
                first_name: artist.first_name,
                last_name: artist.last_name,
                email: artist.email,
                phone: artist.phone,
                name: documentName,
                path: path
            },
            {
                'headers': {
                    'x-access-token': userService.getToken()
                }
            })
            .then(response => {
                if(userService.error(response)){
                    return userService.error(response);
                }
                return response.data;
            })
            .catch(error => console.log("error" + error));
    }

    removeArtistFromEvent(eventId: number, artistId: number): void {
        return axios.delete(`http://localhost:4000/auth/id/${userService.getUserId()}/event/${eventId}/artist/${artistId}`, {
            'headers': {
                'x-access-token': userService.getToken()
            }
        })
            .then(response => {
                if (userService.error(response)) {
                    return userService.error(response);
                }
                return response.data;
            })
            .catch(error => console.log("error" + error));
    }

    getArtistByUser(userId: number): Artist[] {
        return axios.get<Artist[]>(`http://localhost:4000/auth/id/${userService.getUserId()}/artist/user/${userId}`, {
            'headers': {
                'x-access-token': userService.getToken()
            }
        }).then(response => {
            if (userService.error(response)) {
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }

    getArtistByPreviousContract(contactId: number): Artist[] {
        return axios.get<Artist[]>(`http://localhost:4000/auth/id/${userService.getUserId()}/artist?contact=${contactId}`, {
            'headers': {
                'x-access-token': userService.getToken()
            }
        }).then(response => {
            if (userService.error(response)) {
                return userService.error(response);
            }
            return response.data;
        })
            .catch(error => console.log("error" + error));
    }
}

export let artistService = new ArtistService();

