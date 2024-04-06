## A repository for CS3100 term project
link for the demo video: https://drive.google.com/drive/folders/1D4dZg2tINpWvHKrPGfWkkBN-R33Uu7Oz?usp=drive_link

to run the game follow these steps:
step 1: create a database named "Bigbull"
step 2: run the file "app.mjs"
step 3: go to admin and create a game and use the passkey-"WolfOfWallstreet" for all the admin functions.
step 4: register the player.

to go back to the main page to access the admin controls.


database that will be used for this app is named as "Bigbull" and the collection's name would be the gameId entered when creating the game using admin controls.

Due to api call limit just two trades will be possible in a minute.
css is applied to all the webpages but it's not super clean due to lack of time. Only the login-page has the best css by my side and it's also made responsive.

Below are the descriptions of the API endpoints along with the corresponding unit tests:

 ### Registration and Login:

#### API Endpoints:
1. **POST /register**: Registers a new user and provides a Web Token.
2. **GET /login**: Logs in an existing user and provides a Web Token.

#### Unit Tests:
- **Register Tests**: Tests for registering new users with various scenarios such as valid registration, invalid gameId, missing parameters, invalid parameter formats, and existing username.
- **Login Tests**: Tests for logging in existing users with valid and invalid credentials, including invalid gameId, invalid username, and invalid password.

### Game Management:

#### API Endpoints:
1. **POST /newGame**: Creates a new game with specified settings after entering the admin’s password.
2. **POST /provideCash**: Provides extra cash to players in the game.
3. **GET /portfolio**: Retrieves and updates the portfolio of a player.
4. **GET /declareWinner**: Declares the winner of the game.

#### Unit Tests:
- **New Game Tests**: Tests for creating a new game with various scenarios such as invalid passkey, missing gameId or startingCash parameters, and successful game creation.
- **Provide Cash Tests**: Tests for providing cash to players with scenarios including valid and invalid gameId, and invalid cash format.
- **Portfolio Tests**: Tests for retrieving and updating player portfolios with valid gameId.
- **Declare Winner Tests**: Tests for declaring winners with scenarios including valid and invalid gameId.

### Stock Trading:

#### API Endpoints:
1. **POST /tradeStock**: Enables buying and selling stocks for players.
2. **GET /tradingHistory**: Retrieves the trading history of a player.

#### Unit Tests:
- **Trade Stock Tests**: Tests for buying and selling stocks with scenarios including valid and invalid calls, symbols, and quantities.
- **Trading History Tests**: Tests for retrieving trading history with valid token and gameId.

### Stock Market:

#### API Endpoints:
1. **GET /searchStock**: Searches for stocks based on a given stock name.

#### Unit Tests:
- **Search Stock Tests**: Tests for searching stocks with scenarios including valid and invalid stock names.

### Setting Up and Running the Server:

#### Steps:
1. Install necessary dependencies using `npm install`.
2. Ensure MongoDB is running locally and create a new database with the name "Bigbull".
3. Run the server using `node app.mjs`.

### Note:
- The unit tests provided are based on scenarios relevant to each API endpoint and aim to cover various possible cases to ensure the robustness and reliability of the API.