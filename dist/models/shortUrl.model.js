"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortUrl = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const shortUrlSchema = new mongoose_1.default.Schema({
    full: {
        type: String,
        required: true,
    },
    short: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.ShortUrl = mongoose_1.default.model("ShortUrl", shortUrlSchema, "shortUrls");
