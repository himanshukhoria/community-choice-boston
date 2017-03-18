'use strict';

const request = require('superagent');

const FIELDS = ['start', 'location', 'summary', 'description'];

/*
 * Proxy call to Google calendar events to return the next event
 */

class CalendarHandler {
    constructor(config) {
        this.calId = config.GOOGLE_CAL_ID;
        this.url = 'https://www.googleapis.com/calendar/v3/calendars/' +
            this.calId + '/events';
        this.apiKey = config.GOOGLE_API_KEY;
    }

    handle(req, context) {
        request
            .get(this.url)
            .query({
                orderBy: 'startTime',
                singleEvents: 'True',
                maxResults: '20',
                timeMin: new Date().toISOString(),
                key: this.apiKey
            })
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    return context.done('ERR_INTERNAL_ERROR');
                }

                // Filter the event to just the required fields
                let ev = {calId: this.calId};
                if (res.body.items[0]) {
                    FIELDS.forEach((f) => {
                        ev[f] = res.body.items[0][f];
                    });
                }

                context.done(null, {data: ev});
            });
    }
}

module.exports = CalendarHandler;
