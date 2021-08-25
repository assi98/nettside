// @flow

import axios from 'axios';

export class ContactUs {
    email: string;
    name: string;
    subject: string;
    content: string;
}

class ContactUsService {

    contactUs(contactForm: ContactUs) {
        return axios.post<ContactUs>('http://localhost:4000/api/contactUs', contactForm).then(response => response.data);
    }
}

export let contactUsService = new ContactUsService();