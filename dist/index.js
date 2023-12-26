"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database = __importStar(require("./config/database"));
const shortUrl_model_1 = require("./models/shortUrl.model");
const dotenv_1 = __importDefault(require("dotenv"));
const nanoid_1 = require("nanoid");
const utils = __importStar(require("./utils/utils"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
database.connect();
app.use(express_1.default.static(`${__dirname}/public`));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const shortUrls = yield shortUrl_model_1.ShortUrl.find({ deleted: false });
    res.render("index.pug", {
        shortUrls: shortUrls,
    });
}));
app.post("/shortUrl", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullUrl, description } = req.body;
    if (utils.validateUrl(fullUrl)) {
        try {
            const short = (0, nanoid_1.nanoid)(8);
            let url = yield shortUrl_model_1.ShortUrl.findOne({
                full: fullUrl,
            });
            if (url) {
                console.log("Đã có url này rồi!");
            }
            else {
                url = new shortUrl_model_1.ShortUrl({
                    full: fullUrl,
                    short: short,
                    description: description,
                });
                yield url.save();
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        console.log("Url không hợp lệ!");
    }
    return res.redirect("back");
}));
app.get("/:shortUrl", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortUrl = yield shortUrl_model_1.ShortUrl.findOne({
            short: req.params.shortUrl,
        });
        if (shortUrl == null)
            return res.sendStatus(403);
        shortUrl.clicks++;
        shortUrl.save();
        res.redirect(shortUrl.full);
    }
    catch (error) {
        console.log("Có lỗi xảy ra ", error.message);
        res.redirect("back");
    }
}));
app.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on port`);
});
