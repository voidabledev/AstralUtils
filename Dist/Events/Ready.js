"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const mongoose_1 = require("mongoose");
const config_json_1 = __importDefault(require("../config.json"));
exports.event = {
    event: "ready",
    once: true,
    async run(client) {
        console.log(`Ready! Logged in as ${client.user?.tag}!`);
        await mongoose_1.connect(config_json_1.default.db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            keepAlive: true
        });
    }
};
