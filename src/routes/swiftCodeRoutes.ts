import express, {Request, Response} from 'express';
import {getSwiftCode, getSwiftCodesByCountry} from '../controllers/swiftCodesController'

const router = express.Router();

router.get('/swift-codes/:swiftCode',
    (req: Request, res: Response) => {
    getSwiftCode(req, res);
});


router.get('/swift-codes/country/:countryISO2code',
    (req: Request, res: Response) => {
    getSwiftCodesByCountry(req, res);
    });

//router.post('/swift-codes');

//router.delete('/swift-codes/:swiftCode')


export default router