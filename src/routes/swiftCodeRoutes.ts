import express, {Request, Response} from 'express';
import {
    addNewSwiftCodeEntries,
    deleteSwiftCode,
    getSwiftCode,
    getSwiftCodesByCountry
} from '../controllers/swiftCodesController'
import {BankInput} from '../models/BankModel'

const router = express.Router();


router.get('/swift-codes/:swiftCode',
    (req: Request, res: Response) => {
    getSwiftCode(req, res);
});


router.get('/swift-codes/country/:countryISO2code',
    (req: Request, res: Response) => {
    getSwiftCodesByCountry(req, res);
    });


router.post('/swift-codes',
    (req: Request<{}, {}, BankInput>, res: Response) => {
    addNewSwiftCodeEntries(req, res);
    });


router.delete('/swift-codes/:swiftCode',
    (req: Request, res: Response) => {
    deleteSwiftCode(req, res);
    })

export default router