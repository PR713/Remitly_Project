# SWIFT Codes Management API

## Project Description

The **SWIFT Codes Management API** enables the management of SWIFT codes data (Bank Identifier Codes), which are unique identifiers of a bank's branch or headquarters worldwide. The data is stored in a MongoDB database and exposed via a REST API. The application allows:

- Showing the details of a single SWIFT code (with branches, if it is a headquarter)
- Showing all SWIFT codes for a specified country by its `countryISO2` code
- Adding new SWIFT codes
- Deleting existing SWIFT codes (only if the code belongs to a bank's branch)

---

## Technical Requirements

- **Programming Language:** TypeScript
- **Database:** MongoDB
- **Framework:** Express.js
- **Containerization:** Docker
- **Testing:** Jest, Supertest

---

## Installation and Launching

### First Requirement:

- **Docker**

### Installation Steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/PR713/Remitly_Project
   cd Remitly_Project
   ```

2. For the purpose of running the application locally, the `.env` file is included in the repository. It contains default values for the database and application configuration. **It is only an example configuration**. If you want to use custom values, you can modify that configuration.

3. Build and launch the Docker containers:

   ```sh
   docker-compose up --build
   ```

   Now the app is available on `http://localhost:8080`

---

## Testing

The application includes both unit and integration tests to ensure reliability. To run the tests, execute the following command:

```sh
docker-compose exec app npm test
```

---

## Project Structure

```
data/                Stores a csv file with bank details
src/                 Main source code of the application.
├── controllers/     Controllers handling API endpoints.
├── models/         Data models and MongoDB schemas.
├── routes/         API route definitions.
tests/          Unit and integration tests.
dist/                Compiled TypeScript code (generated automatically).

Dockerfile           Docker container configuration for the application.
docker-compose.yml   Docker environment configuration (application + MongoDB).
```

---

## API Endpoints

### 1. Retrieve Details of a Single SWIFT Code

- **Method:** GET
- **Path:** `/v1/swift-codes/{swift-code}`
- **Description:** Returns details of a SWIFT code (address, bank name, country, etc.). If the SWIFT code represents a headquarters, it also returns a list of branches.

#### Example Response (Headquarters):

```json
{
    "address": "123 Bank St.",
    "bankName": "Test Bank",
    "countryISO2": "PL",
    "countryName": "POLAND",
    "isHeadquarter": true,
    "swiftCode": "TESTAAPLXXX",
    "branches": [
        {
            "address": "456 Branch Ave.",
            "bankName": "Test Bank",
            "countryISO2": "PL",
            "isHeadquarter": false,
            "swiftCode": "TESTAAPL001"
        }
    ]
}
```

#### Example Response (Branch):

```json
{
    "address": "789 Branch St.",
    "bankName": "Another Bank",
    "countryISO2": "US",
    "countryName": "UNITED STATES",
    "isHeadquarter": false,
    "swiftCode": "TESTBBUS002"
}
```

---

### 2. Retrieve All SWIFT Codes for a Country

- **Method:** GET
- **Path:** `/v1/swift-codes/country/{countryISO2code}`
- **Description:** Returns a list of all SWIFT codes for a specified country (both headquarters and branches).

#### Example Response:

```json
{
    "countryISO2": "US",
    "countryName": "UNITED STATES",
    "swiftCodes": [
        {
            "address": "123 Bank St.",
            "bankName": "Test Bank",
            "countryISO2": "US",
            "isHeadquarter": true,
            "swiftCode": "TESTBBUSXXX"
        },
        {
            "address": "456 Branch Ave.",
            "bankName": "Test Bank",
            "countryISO2": "US",
            "isHeadquarter": false,
            "swiftCode": "TESTBBUS002"
        }
    ]
}
```

---

### 3. Add a New SWIFT Code

- **Method:** POST
- **Path:** `/v1/swift-codes`
- **Description:** Adds a new SWIFT code to the database.

#### Example Request:

```json
{
    "address": "456 New Bank St.",
    "bankName": "New Bank",
    "countryISO2": "DE",
    "countryName": "GERMANY",
    "isHeadquarter": true,
    "swiftCode": "TESTCCDEXXX"
}
```

#### Example Response:

```json
{
    "message": "SWIFT code added successfully"
}
```

---

### 4. Delete a SWIFT Code

- **Method:** DELETE
- **Path:** `/v1/swift-codes/{swift-code}`
- **Description:** Deletes a SWIFT code from the database. If the SWIFT code represents a headquarter with existing branches, the operation will be rejected.

#### Example Response:

```json
{
    "message": "SWIFT code deleted successfully"
}
```

---

## Testing Endpoints

You can test the endpoints using **Postman** or below are some examples using **curl** tool:

#### Retrieve Details of a SWIFT Code

```sh
curl -X GET http://localhost:8080/v1/swift-codes/BREXPLPWGDA
```

#### Retrieve Details of a CountryISO2 Code
```sh
curl -X GET http://localhost:8080/v1/swift-codes/country/US
```

#### Add a New SWIFT Code

```sh
curl -X POST http://localhost:8080/v1/swift-codes \
-H "Content-Type: application/json" \
-d '{
    "address": "456 New Bank St.",
    "bankName": "New Bank",
    "countryISO2": "DE",
    "countryName": "GERMANY",
    "isHeadquarter": true,
    "swiftCode": "TESTCCDEXXX"
}'
```

#### Delete a SWIFT Code

```sh
curl -X DELETE http://localhost:8080/v1/swift-codes/TESTCCDEXXX
```



## Author
- Radosław Szepielak

