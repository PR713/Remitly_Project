"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swiftCodesController_1 = require("../controllers/swiftCodesController");
const router = express_1.default.Router();
router.get('/swift-codes/:swiftCode', (req, res) => {
    (0, swiftCodesController_1.getSwiftCode)(req, res);
});
router.get('/swift-codes/country/:countryISO2code', (req, res) => {
    (0, swiftCodesController_1.getSwiftCodesByCountry)(req, res);
});
//router.post('/swift-codes');
//router.delete('/swift-codes/:swiftCode')
exports.default = router;
