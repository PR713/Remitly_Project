//docker-compose exec app npm test
import request from 'supertest';
import {app} from "../src";
import { BankModel } from "../src/models/BankModel";


describe("GET /v1/swift-codes/:swiftCode", () => {
    beforeEach(async () => {
        await BankModel.create({
            address: "123 Bank St.",
            bankName: "Test Bank",
            countryISO2: "PL",
            countryName: "POLAND",
            isHeadquarter: true,
            swiftCode: "TESTAAPLXXX",
        });
    });

    afterEach(async () => {
        await BankModel.deleteMany({});
    });

    it("should return a valid SWIFT code", async () => {
        const res = await request(app).get("/v1/swift-codes/TESTAAPLXXX");
        expect(res.status).toBe(200);
        expect(res.body.swiftCode).toBe("TESTAAPLXXX");
        expect(res.body.isHeadquarter).toBe(true);
    });

    it("should return 404 for non-existent SWIFT code", async () => {
        const res = await request(app).get("/v1/swift-codes/NONEXISTABC");
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("SWIFT code not found");
    });

    it("should return 400 if SWIFT code is not exactly 11 characters long", async () => {
        const res = await request(app).get("/v1/swift-codes/TESTCDEBB");

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("SWIFT code must be exactly 11 characters long.");
    });
});


describe("GET /v1/swift-codes/country/:countryISO2code", () => {
    beforeEach(async () => {
        await BankModel.create([
            {
                address: "123 Bank St.",
                bankName: "Test Bank",
                countryISO2: "US",
                countryName: "UNITED STATES",
                isHeadquarter: true,
                swiftCode: "TESTBBUSXXX",
            },
            {
                address: "456 Branch Ave.",
                bankName: "Test Bank",
                countryISO2: "US",
                countryName: "UNITED STATES",
                isHeadquarter: false,
                swiftCode: "TESTBBUS002",
            },
        ]);
    });

    afterEach(async () => {
        await BankModel.deleteMany({});
    });

    it("should return all SWIFT codes for a country", async () => {
        const res = await request(app).get("/v1/swift-codes/country/US");
        expect(res.status).toBe(200);
        expect(res.body.swiftCodes).toHaveLength(2);
    });

    it("should return 404 for a non-existent country", async () => {
        const res = await request(app).get("/v1/swift-codes/country/XX");
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Country does not exist in database");
    });

    it("should return 400 if countryISO2 code is note exactly 2 letters long", async () => {
       const res = await request(app).get("/v1/swift-codes/country/ABC");

       expect(res.status).toBe(400);
        expect(res.body.message).toBe("CountryISO2 code must be 2 letters long.");
    });
});



describe('POST /v1/swift-codes/:swiftCode', () => {
    it("should add a new SWIFT code", async () => {
        const res = await request(app).post("/v1/swift-codes").send({
            address: "456 New Bank St.",
            bankName: "New Bank",
            countryISO2: "DE",
            countryName: "GERMANY",
            isHeadquarter: true,
            swiftCode: "TESTCCDEXXX",
        });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("SWIFT code added successfully");

        const bank = await BankModel.findOne({swiftCode: "TESTCCDEXXX"});
        expect(bank).toMatchObject({
            address: "456 New Bank St.",
            bankName: "New Bank",
            countryISO2: "DE",
            countryName: "GERMANY",
            isHeadquarter: true,
            swiftCode: "TESTCCDEXXX"
        });
    });

    it("should not add a duplicate SWIFT code", async () => {

        const res = await request(app).post("/v1/swift-codes").send({
            address: "456 New Bank St.",
            bankName: "New Bank",
            countryISO2: "DE",
            countryName: "GERMANY",
            isHeadquarter: true,
            swiftCode: "TESTCCDEXXX",
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("SWIFT code already exists!");
    });


    it("should return 400 if SWIFT code is not exactly 11 characters long", async () => {
        const res = await request(app).post("/v1/swift-codes").send({
            address: "4561 New Bank St.",
            bankName: "New Bank",
            countryISO2: "PL",
            countryName: "POLAND",
            isHeadquarter: false,
            swiftCode: "TESTCDEAB",
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("SWIFT code must be exactly 11 characters long.");
    });


    it("should return 400 if countryISO2 code is note exactly 2 letters long", async () => {
       const res = await request(app).post("/v1/swift-codes").send({
           address: "132 Bank St.",
           bankName: "The Bank IP",
           countryISO2: "ALA",
           countryName: "ALBANIA",
           isHeadquarter: true,
           swiftCode: "TESTDDFR10A",
       });

       expect(res.status).toBe(400);
       expect(res.body.message).toBe("CountryISO2 code must be 2 letters long.");
    });
});



describe('DELETE /v1/swift-codes/:swiftCode', () => {
    beforeEach(async() => {
        await BankModel.create({
            address: "999 Bank St.",
            bankName: "The Bank",
            countryISO2: "FR",
            countryName: "FRANCE",
            isHeadquarter: false,
            swiftCode: "TESTDDFR10A",
        });
    });

    afterEach(async () => {
        await BankModel.deleteMany({});
    });

    it("should delete that SWIFT code", async() => {
        const res = await request(app).delete("/v1/swift-codes/TESTDDFR10A");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("SWIFT code deleted successfully");

        const bank = await BankModel.findOne({swiftCode: "TESTDDFR10A"});
        expect(bank).toBeNull();
    });


    it("should return 404 for non-existent SWIFT code", async () => {
        const res = await request(app).delete("/v1/swift-codes/TESTNOEXIST");
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("SWIFT code not found");
    })


    it("should return 400 for no permission for deleting due to existing branches", async () => {

        await BankModel.create([
            {
                address: "123 Bank St.",
                bankName: "Test Bank",
                countryISO2: "PL",
                countryName: "POLAND",
                isHeadquarter: true,
                swiftCode: "TESTBBPLXXX",
            },
            {
                address: "456 Branch Ave.",
                bankName: "Test Bank",
                countryISO2: "PL",
                countryName: "POLAND",
                isHeadquarter: false,
                swiftCode: "TESTBBPL001",
            },
        ]);

        const res = await request(app).delete("/v1/swift-codes/TESTBBPLXXX");

        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Cannot delete headquarters! It has existing branches." +
            "Delete branches first.");
    });
})
