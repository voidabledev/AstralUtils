"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.id = exports.search = void 0;
const util_1 = require("util");
const glob_1 = __importDefault(require("glob"));
exports.search = util_1.promisify(glob_1.default);
function id(base, length) {
    let gen = Math.floor(Math.random() * base ** length).toString(base);
    gen = '0'.repeat(length - gen.length) + gen;
    return gen;
}
exports.id = id;
