'use strict';

const axios = require('axios');
const Promise = require('bluebird');
const baseURL = 'https://www.humanity.com/api/';

const ShiftPlanning = class ShiftPlanning {

    constructor (apiKey, username, password) {
        this.apiKey = apiKey;
        this.username = username;
        this.password = password;
        this.token = '';
    }

    config () {
        return this.request("GET", "api.config");
    }

    /**
     * Get a list of locations.
     * @return {Promise} Promise containing results of the API Request
     */
    getLocations(type) {
        return this.request("GET", "location.locations", {
            type: type
        });
    }

    /**
     * Get a list of timesheets between two dates
     * @param  {String} startDate start date in format MMM dd, YYYY
     * @param  {String} endDate   end date in format MMM dd, YYYY
     * @return {Promise} Promise containing results of the API Request
     */
    getTimesheets(startDate, endDate) {
        return this.request("GET", "reports.timesheets", {
            start_date: startDate,
            end_date: endDate,
            type: "timesheets_summary"
        });
    }

    /**
     * Login as a Shiftplanning user.
     * @return {Promise} Promise containing results of the API Request
     */
    login () {
        return this.request("GET", "staff.login", {
            username: this.username,
            password: this.password
        });
    }

    /**
     * Set the access token for subsequent API requests
     * @param {String} token access token
     */
    setToken (token) {
        this.token = token;

        return this;
    }

    request(method, module, params) {
        if (!params)
            params = {};

        const request = {
            key: this.apiKey,
            output: "json",
            token: this.token,
            request: Object.assign({
                method: method,
                module: module
            }, params)
        };

        return axios({
            method: 'post',
            url: baseURL,
            data: request,
            headers: {
                'origin': 'https://www.humanity.com'
            },
            transformRequest: [function(data) {
                data = 'data='+encodeURIComponent(JSON.stringify(data));

                return data;
            }]
        }).then((response) => {
            if (response && response.data && response.data.status == 1)
                return Promise.resolve(response);

            return Promise.reject(response);
        });
    }
}


module.exports = ShiftPlanning;