// @flow

/**
 * Sets up Nodemailer - a module for Node.js application for email sending
 */

const nodemailer = require("nodemailer");

/**
 * Creates a reusable transporter object using a default SMTP transport
 */

let transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: 'harmoni.team3@gmail.com',
        pass: 'Team3.harmoni'
    }

});

const url = `http://localhost:4000`;

export class Email {

    /**
     *
     * Sends an email to a contact when an event is cancelled
     *
     * @param mailList - the contact's email
     * @param eventId - the id of the cancelled event
     * @param title - the title of the cancelled event
     * @param name - first and last name of the contact
     * @param location - the location of the event
     * @param startTime - the start time of the event
     */

    cancelledNotification(mailList: Array, eventId: number, title: string, name: string, location: string, startTime: string) {

        let toMail = mailList.join(', ');

        let mailOption = {
            from: 'Harmoni <harmoni.team3@gmail.com>',
            bcc: toMail,
            subject: "Arrangementet " + title + " er avlyst",
            html: '<h3 style="font-size: 21px">Hei, ' + name + '</h3>' +
                '  <div style="font-size: 17px">' +
                '   <br>Dette er et varsel om at følgende arrangement har blitt avlyst: <a href="http://localhost:4000/#/event/' + eventId + '/view">Link til ditt arrangement</a>' +
                '   <div><b><br>Tittel: ' + title + '<br>Sted: ' + location + '<br>Tid: ' + startTime + '</b></div>' +
                '   <div><br>Med vennlig hilsen,' +
                '   <br>Harmoni Team 3</div>' +
                '   <br><p style="text-align: center">&copy; 2020 Team 3</div>' +
                '  </div>'
        };

        transporter.sendMail(mailOption, (err, res) => {
            if (err) {
                console.log("Error occured: " + err);
            } else {
                console.log("Email sent: " + res.response);
            }
        });
    }

    /**
     *
     * Sends an email when inserting a new artist on an existing contact
     *
     * @param recipient - the artist's email
     * @param artistName - the name of the artist
     * @param username - the artist's given username
     * @param password - the artist's gived password
     * @param organizer - the organizer of the event
     */

    artistUserNotification(recipient: string, artistName: string, username: string, password: string, organizer: string) {
        let mailOption = {
            from: `Harmoni <harmoni.team3@gmail.com>`,
            to: [recipient],
            subject: `${organizer} har opprettet en bruker for deg på Harmoni`,
            html: `<h3 style="font-size: 21px">Hei, ${artistName}` +
                `  <div style="font-size: 17px">` +
                `  <br>${organizer} har knyttet deg til sitt arrangement og har opprettet en bruker på vegne av deg!` +
                `  <br>Du kan nå logge inn på ${url} og se detaljer angående arrangementet ved å bruke følgende innlogging:` +
                `  <br><br><b>Brukernavn: </b>${username}` +
                `  <br><b>Passord: </b>${password}</div>` +
                `  <div>Med vennlig hilsen,` +
                `  <br>Harmoni Team 3</div>` +
                `  <br><p style="text-align: center">&copy; 2020 Team 3</div>` +
                `  </div>`

        };

        transporter.sendMail(mailOption, (err, res) => {
            if (err) {
                console.log("Error occured: " + err);
            } else {
                console.log("Email sent: " + res.response);
            }
        });
    }

    /**
     *
     * Sends an email to the operators of the website
     *
     * @param fromMail - submitter's email
     * @param name - submitter's first and last name
     * @param subject - subject of the email
     * @param content - content of the email
     */

    contactUs(fromMail: string, name: string, subject: string, content: string) {

        let mailOption = {
            from: name + '<' + fromMail + '>',
            to: 'harmoni.team3@gmail.com',
            subject: subject,
            html: '<div style="white-space: pre-line"><p>Svar sendes til: ' + fromMail + '</p>' + content + '</div>'
        };

        transporter.sendMail(mailOption, (err, res) => {
            if (err) {
                console.log("Error occured: " + err);
            } else {
                console.log("Email sent: " + res.response);
            }
        });

    }
}

