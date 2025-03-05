import express, {Request, Response} from 'express';
import {getSwiftCode} from '../controllers/swiftCodesController'

const router = express.Router();

router.get('/swift-codes/:swiftCode', (req: Request, res: Response) => {
    getSwiftCode(req, res);
});


//router.get('/v1/swift-codes/country/:countryISO2code');

//router.post('/v1/swift-codes');

//router.delete('/v1/swift-codes/:swiftCode')


export default router