import {getDb} from '../db.mjs'; 
import assert from "assert";
import supertest from "supertest";
var request = supertest('http://localhost:8820');
let database = await getDb();
var apikey;
describe('POST /newGame', function() {
    var tests = [
        { name: 'attempt1', args: { passkey: 'InvalidPass', gameId: 'game1', startingCash: 5000 }, expected: 400 },
        { name: 'attempt2', args: { passkey: 'WolfOfWallstreet', gameId: '', startingCash: 10000 }, expected: 400 },
        { name: 'attempt3', args: { passkey: 'WolfOfWallstreet', gameId: 'game2', startingCash: '' }, expected: 400 },
        { name: 'attempt4', args: { passkey: 'WolfOfWallstreet', gameId: 'game1', startingCash: 10000 }, expected: 200 },

    ];


    tests.forEach(function(test) {
        it(`POST /newGame ${test.name}`, async function() {
            let response = await request.post('/newGame')
                .send(test.args)
                .set('Content-Type', 'application/json');
            assert.equal(test.expected, response.status);
            console.log(response.body)
            if (response.status === 200) {
                let gameId = test.args.gameId;
            }
            let db = await database.listCollections().toArray()

        });
    });
});

describe('POST /register', function() {
    var tests = [
        // Valid registration
        { 
            name: 'Valid registration', 
            args: { 
                firstName: 'John', 
                lastName: 'Doe', 
                dob: '01-01-1990', 
                userName: 'johndoe123', 
                password: 'password123', 
                gameId: 'game1' 
            }, 
            expected: 200 
        },
        // Invalid gameId
        { 
            name: 'Invalid gameId', 
            args: { 
                firstName: 'Alice', 
                lastName: 'Smith', 
                dob: '05-12-1985', 
                userName: 'asmith', 
                password: 'pass123', 
                gameId: 'game5' 
            }, 
            expected: 400 
        },
        // Missing firstName
        { 
            name: 'Missing firstName', 
            args: { 
                lastName: 'Doe', 
                dob: '01-01-1990', 
                userName: 'johndoe123', 
                password: 'password123', 
                gameId: 'game1' 
            }, 
            expected: 400 
        },
        // Missing lastName
        { 
            name: 'Missing lastName', 
            args: { 
                firstName: 'John', 
                dob: '01-01-1990', 
                userName: 'johndoe123', 
                password: 'password123', 
                gameId: 'game1' 
            }, 
            expected: 400 
        },
        // Missing dob
        { 
            name: 'Missing dob', 
            args: { 
                firstName: 'John', 
                lastName: 'Doe', 
                userName: 'johndoe123', 
                password: 'password123', 
                gameId: 'game1' 
            }, 
            expected: 400 
        },
        // Missing userName
        { 
            name: 'Missing userName', 
            args: { 
                firstName: 'John', 
                lastName: 'Doe', 
                dob: '01-01-1990', 
                password: 'password123', 
                gameId: 'game1' 
            }, 
            expected: 400 
        },
        // Missing password
        { 
            name: 'Missing password', 
            args: { 
                firstName: 'John', 
                lastName: 'Doe', 
                dob: '01-01-1990', 
                userName: 'johndoe123', 
                gameId: 'game1' 
            }, 
            expected: 400 
        },
        // Invalid userName format
        { 
            name: 'Invalid userName format', 
            args: { 
                firstName: 'John', 
                lastName: 'Doe', 
                dob: '01-01-1990', 
                userName: 'john@doe', 
                password: 'password123', 
                gameId: 'game1' 
            }, 
            expected: 400 
        },
        // Existing userName
        { 
            name: 'Existing userName', 
            args: { 
                firstName: 'Alice', 
                lastName: 'Smith', 
                dob: '05-12-1985', 
                userName: 'johndoe123', // Existing userName from first test case
                password: 'pass123', 
                gameId: 'game2' 
            }, 
            expected: 400 
        },
        // Invalid password format
        { 
            name: 'Invalid password format', 
            args: { 
                firstName: 'John', 
                lastName: 'Doe', 
                dob: '01-01-1990', 
                userName: 'johndoe123', 
                password: 'pass', // Password less than 8 characters
                gameId: 'game1' 
            }, 
            expected: 400 
        },
        // Missing gameId
        { 
            name: 'Missing gameId', 
            args: { 
                firstName: 'John', 
                lastName: 'Doe', 
                dob: '01-01-1990', 
                userName: 'johndoe123', 
                password: 'password123'
            }, 
            expected: 400 
        },
        // Add more test cases as needed
    ];

    tests.forEach(function(test) {
        it(`POST /register ${test.name}`, async function() {
            let response = await request.post('/register')
                .send(test.args)
                .set('Content-Type', 'application/json');
                console.log(response.body)

            assert.equal(test.expected, response.status);

            if (response.status === 200) {
               apikey =await response.body.token;
            }
        });
    });
});

describe('GET /login', function() {
    var tests = [
        // Valid login
        { 
            name: 'Valid login', 
            args: { 
                userName: 'johndoe123', 
                password: 'password123', 
                gameId: 'game1' 
            }, 
            expected: 200 
        },
        // Invalid gameId
        { 
            name: 'Invalid gameId', 
            args: { 
                userName: 'johndoe123', 
                password: 'password123', 
                gameId: 'invalidGameId' 
            }, 
            expected: 400 
        },
        // Invalid userName
        { 
            name: 'Invalid userName', 
            args: { 
                userName: 'invalidUserName', 
                password: 'password123', 
                gameId: 'game1' 
            }, 
            expected: 400 
        },
        // Invalid password
        { 
            name: 'Invalid password', 
            args: { 
                userName: 'johndoe123', 
                password: 'invalidPassword', 
                gameId: 'game1' 
            }, 
            expected: 400 
        },
        // Add more test cases as needed
    ];

    tests.forEach(function(test) {
        it(`GET /login ${test.name}`, async function() {
            let queryString = `userName=${test.args.userName}&password=${test.args.password}&gameId=${test.args.gameId}`;
            let response = await request.get(`/login`)
                .send(test.args)
                .set('Content-Type', 'application/json');
            console.log(response.body)
            assert.equal(test.expected, response.status);
        
            if (response.status === 200) {
                apikey = await response.body.token;
                console.log(apikey)
             }
        });
    });
    
});

describe('POST /provideCash', function() {
    var tests = [
        // Valid provideCash
        { 
            name: 'Valid provideCash', 
            args: { 
                cash: 500, 
                gameId: 'game1' 
            }, 
            expected: 200 
        },
        // Invalid cash format
        { 
            name: 'Invalid cash format', 
            args: { 
                cash: 'abc', // Non-integer value
                gameId: 'game1' 
            }, 
            expected: 400 
        },
        // Invalid gameId
        { 
            name: 'Invalid gameId', 
            args: { 
                cash: 500, 
                gameId: 'invalidGameId' 
            }, 
            expected: 400 
        },
        // Add more test cases as needed
    ];

    tests.forEach(function(test) {
        it(`POST /provideCash ${test.name}`, async function() {
            let response = await request.post('/provideCash')
                .send(test.args)
                .set('Content-Type', 'application/json');
            console.log(response.body)
            assert.equal(test.expected, response.status);
        });
    });
});

describe('POST /tradeStock', function() {
    var tests = [
        // Valid buy call
        { 
            name: 'Valid buy call', 
            args: { 
                call: 'buy', 
                symbol: 'AAPL', 
                quantity: 10 
            }, 
            token: apikey, // Assuming apikey is the token variable
            expected: 200 
        },
        // Valid sell call
        { 
            name: 'Valid sell call', 
            args: { 
                call: 'sell', 
                symbol: 'AAPL', 
                quantity: 5 
            }, 
            token: apikey, // Assuming apikey is the token variable
            expected: 200 
        },
        // Invalid token
        { 
            name: 'Invalid token', 
            args: { 
                call: 'buy', 
                symbol: 'AAPL', 
                quantity: 10 
            }, 
            token: 'invalidToken', // Invalid token
            expected: 401 // Unauthorized
        },
        // Missing call parameter
        { 
            name: 'Missing call parameter', 
            args: { 
                symbol: 'AAPL', 
                quantity: 10 
            }, 
            token: apikey, 
            expected: 400 
        },
        // Missing symbol parameter
        { 
            name: 'Missing symbol parameter', 
            args: { 
                call: 'buy', 
                quantity: 10 
            }, 
            token: apikey, 
            expected: 400 
        },
        // Missing quantity parameter
        { 
            name: 'Missing quantity parameter', 
            args: { 
                call: 'buy', 
                symbol: 'AAPL', 
            }, 
            token: apikey, 
            expected: 400 
        },
        // Invalid call parameter
        { 
            name: 'Invalid call parameter', 
            args: { 
                call: 'invalid', // Invalid call
                symbol: 'AAPL', 
                quantity: 10 
            }, 
            token: apikey, 
            expected: 400 
        },
        // Invalid quantity parameter
        { 
            name: 'Invalid quantity parameter', 
            args: { 
                call: 'buy', 
                symbol: 'AAPL', 
                quantity: 'invalid' // Invalid quantity
            }, 
            token: apikey, 
            expected: 400 
        },
        // Negative quantity
        { 
            name: 'Negative quantity', 
            args: { 
                call: 'buy', 
                symbol: 'AAPL', 
                quantity: -10 // Negative quantity
            }, 
            token: apikey, 
            expected: 400 
        },
        // Zero quantity
        { 
            name: 'Zero quantity', 
            args: { 
                call: 'buy', 
                symbol: 'AAPL', 
                quantity: 0 // Zero quantity
            }, 
            token: apikey, 
            expected: 400 
        },
        // Add more test cases as needed
    ];

    tests.forEach(function(test) {
        it(`POST /tradeStock ${test.name}`, async function() {
            let response = await request.post('/tradeStock')
                .set('Authorization', 'Bearer ' + apikey)
                .send(test.args);
                console.log(response.body); // Log the response body

            assert.equal(test.expected, response.status);
        });
    });
});

describe('GET /portfolio', function() {
    var tests = [
        // Valid gameId
        { 
            name: 'Valid gameId', 
            args: { 
                gameId: 'game1' 
            }, 
            expected: 200 
        },
        // Invalid gameId
        { 
            name: 'Invalid gameId', 
            args: { 
                gameId: 'invalidGameId' 
            }, 
            expected: 400 
        },
        // Add more test cases as needed
    ];

    tests.forEach(function(test) {
        it(`GET /portfolio ${test.name}`, async function() {
            let response = await request.get('/portfolio')
                .send(test.args)
                .set('Content-Type', 'application/json');
            console.log(response.body);
            assert.equal(test.expected, response.status);
        });
    });
});
describe('GET /searchStock', function() {
    var tests = [
        // Valid stockName
        { 
            name: 'Valid stockName', 
            args: { 
                stockName: 'AAPL' 
            }, 
            expected: 200 
        },
        // Invalid stockName
        { 
            name: 'Invalid stockName', 
            args: { 
                stockName: 'INVALID' 
            }, 
            expected: 400 
        },
        // Missing stockName
        { 
            name: 'Missing stockName', 
            args: {}, 
            expected: 400 
        },
        // Add more test cases as needed
    ];

    tests.forEach(function(test) {
        it(`GET /searchStock ${test.name}`, async function() {
            // Making a GET request to the searchStock endpoint with the test arguments
            let response = await request.get('/searchStock')
                .query(test.args)
                .set('Content-Type', 'application/json');
                console.log(response.body)
            // Asserting that the response status matches the expected status
            assert.equal(test.expected, response.status);
        });
    });
});

describe('GET /declareWinner', function() {
    var tests = [
        // Valid gameId with players
        { 
            name: 'Valid gameId with players', 
            args: { 
                gameId: 'game1' 
            }, 
            expected: 200 
        },
    
        // Missing gameId
        { 
            name: 'Missing gameId', 
            args: {}, 
            expected: 400 
        },
        // Invalid gameId
        { 
            name: 'Invalid gameId', 
            args: { 
                gameId: 'invalidGameId' 
            }, 
            expected: 400 
        },
        // Add more test cases as needed
    ];

    tests.forEach(function(test) {
        it(`GET /declareWinner ${test.name}`, async function() {
            let response = await request.get('/declareWinner')
                .query(test.args)
                .set('Content-Type', 'application/json');
            console.log(response.body);
            assert.equal(test.expected, response.status);
        });
    });
});

describe('GET /tradingHistory', function() {
    var tests = [
        // Valid token and gameId
        { 
            name: 'Valid token and gameId', 
            args: { 
                token: apikey, 
            }, 
            expected: 200 
        },
        // Invalid token
        { 
            name: 'Invalid token', 
            args: { 
                token: 'invalidToken', 
            }, 
            expected: 401 
        },
        // Missing token
        { 
            name: 'Missing token', 
            args: { 
            }, 
            expected: 401 
        },

    ];

    tests.forEach(function(test) {
        it(`GET /tradingHistory ${test.name}`, async function() {
            let response = await request.get('/tradingHistory')
                .set('Authorization', 'Bearer ' + apikey)
                .set('Content-Type', 'application/json');
            console.log(response.body);
            assert.equal(test.expected, response.status);
        });
    });
});