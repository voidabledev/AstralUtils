"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.economyModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    userId: String,
    coins: {
        type: Number,
        default: 0
    }
});
exports.economyModel = mongoose_1.model("C");
