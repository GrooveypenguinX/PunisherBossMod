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
Object.defineProperty(exports, "__esModule", { value: true });
// Jon Bernthal
const punisherhead = __importStar(require("../db/punisherhead.json"));
const config = __importStar(require("../config/config.json"));
const punisherhead_locale = require("../db/punisherhead_locale.json");
class JonBernthal {
    constructor() {
        this.mod = "servph-punisher";
    }
    postDBLoad(container) {
        const tables = container.resolve("DatabaseServer").getTables();
        // Jon B
        tables.templates.customization[punisherhead._id] = punisherhead;
        // add "punisherhead" to the characters templates
        if (config.addheadtoplayer) {
            tables.templates.character.push(punisherhead._id);
        }
        const localesToRegister = [
            punisherhead_locale
        ];
        // Add custom locales
        for (const locale of Object.values(tables.locales.global)) {
            for (const localeToRegister of localesToRegister) {
                const id = localeToRegister["id"];
                for (const key in localeToRegister) {
                    locale[`${id} ${key}`] = localeToRegister[key];
                }
            }
        }
    }
}
module.exports = { mod: new JonBernthal() };
