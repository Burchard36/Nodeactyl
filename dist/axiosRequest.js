"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class Axios {
    constructor(host, key) {
        this.host = host;
        this.key = key;
    }
    getHeaders() {
        return {
            Authorization: 'Bearer ' + this.key,
            'Content-Type': 'application/json',
            Accept: 'Application/vnd.pterodactyl.v1+json',
        };
    }
    request(method, cmdUrl, data) {
        const URL = this.host.trim() + cmdUrl;
        return axios_1.default(URL, {
            headers: this.getHeaders(),
            maxRedirects: 5,
            method,
            data,
        });
    }
}
exports.default = Axios;
