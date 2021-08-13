"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.afkModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    userId: String,
    message: String,
});
exports.afkModel = mongoose_1.model('afk', schema);
