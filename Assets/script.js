//Ship function returning an object with data about ship shipLength, total hit count, whether the ship is sunk and two functions to add a hit and check if ship is sunk
function ship(shipLengthOfShip) {
    return{
        shipLength: shipLengthOfShip,
        hitCount: 0,
        coordinates: [],
        sunk: false,
        hitFunction() {
            this.hitCount = this.hitCount + 1;
            this.confirmSink()
        }, 
        confirmSink() {
            if(this.shipLength == this.hitCount){
                this.sunk = true;
            } 
        }
    }
} 
function gameboard(user){
    return{
        player: user,
        board: "",
        shipFleet: [],
        positionShip(x, y, shipLength, direction){
            let newShip = ship(shipLength);
            let coordinates = []
            if(direction == "horizontal"){
                for(let i = 0; i < shipLength; i++){
                    let current = [(i + x), y];
                    coordinates.push(current)
                }
            } else{
                for(let i = 0; i < shipLength; i++){
                    let current = [x, (y + i)];
                    coordinates.push(current)
                }
            }
            newShip.coordinates = coordinates;
            this.shipFleet.push(newShip)
            return coordinates
        },
        randomiseAllShips(){
            
            let shipLengths = [5,4,3,3,2];
            //Generate vertical or horizontal randomly
            for(let i = 0; i < shipLengths.length; i++){
                
                let newShip = this.generateShip(shipLengths[i]);

                console.log(newShip[0][0], newShip[0][1], shipLengths[i], newShip[1])
                this.positionShip(newShip[0][0], newShip[0][1], shipLengths[i], newShip[1])
            }
        },
        //Function that checks if ship coordinates are being used
        checkShipPositions(coords){
            if(coords.length === 0){
                return false;
            }
            let positionTaken = false;
            if(this.shipFleet.length != 0){
                for(let i = 0; i < this.shipFleet.length; i ++){
                    for(let j = 0; j < this.shipFleet[i].coordinates.length; j++){
                        if(coords[0] == this.shipFleet[i].coordinates[j][0] && coords[1] == this.shipFleet[i].coordinates[j][1]){
                            return true;
                        }
                    }
                }
            }
            
            return positionTaken;
        },
        generateShip(shipLength){
            let randomDec = Math.random();
            let direction = "";
            
            let randomPosition = [];
            let randomDecimal;

            do{
                randomPosition = [];
                let random = Math.round(randomDec) + 1;
                if(random == 1){
                    direction = 'vertical';
                } else{
                    direction = 'horizontal';
                }
                randomDecimal = Math.random();
                randomPosition.push(Math.floor(randomDecimal * 10));

                randomDecimal = Math.random();
                randomPosition.push(Math.floor(randomDecimal * 10));
            }
            while(this.checkShipPositions(randomPosition) != false);


            let x = randomPosition[0];
            let y = randomPosition[1];
            for(let i = 0; i < shipLength; i++){
                //check if horizontal positions are taken
                if(direction === 'horizontal'){
                    let current = [(i + x), y];
                    if(this.checkShipPositions(current) === true || (i + x) > 9){
                        console.log('regen');
                        return this.generateShip(shipLength);
                        
                    }
                } else{
                    //check if vertical
                    let current = [x, (i + y)];
                    if(this.checkShipPositions(current) === true || (i + y) > 9){
                        console.log('regen');
                        return this.generateShip(shipLength);
                    }
                }
            }
            console.log(randomPosition)
            
            return [randomPosition, direction];
        },
        receiveAttack(x,y){
            let shipHit = false;
            let shipSunk = false;
            for(let i = 0; i < this.shipFleet.length; i++){
                for(let j = 0; j < this.shipFleet[i].coordinates.length; j++){
                    if(this.shipFleet[i].coordinates[j][0] == x && this.shipFleet[i].coordinates[j][1] == y){
                        this.shipFleet[i].hitFunction();
                        shipHit = true;
                        //Check if attacked ship is sunk
                        if(this.shipFleet[i].sunk){
                            console.log(this.shipFleet[i].sunk, this.shipFleet[i].shipLength)
                            shipSunk = true;
                        }
                        //Check if all ships are sunk for gameOver
                        this.checkShips()
                        return [shipHit, shipSunk];
                    }
                }
            }
            this.attackMissed(x,y);
            return [shipHit, shipSunk];
        },
        missedAttacks: [],
        attackMissed(x,y){
            this.missedAttacks.push([x,y])
        },
        checkShips(){
            let counter = 0;
            for(let i = 0; i < this.shipFleet.length; i++){
                if(this.shipFleet[i].sunk == true){
                    counter++;
                }
            }
            if(counter == this.shipFleet.length){
                gameOver(this.board);
                return true;
            } else{
                return false;
            }
        }
        
    }
}
function player(){
    return{
        shotList: [],
        strikeEnemy(x,y, enemyBoard){
            let shot = [x,y];
            for(let i = 0; i < this.shotList.length; i++){
                let arr1 = shot;
                let arr2 = this.shotList[i];

                if(JSON.stringify(arr1) === JSON.stringify(arr2)){
                    return false;
                }
            }
            this.shotList.push(shot);
            let outcome = enemyBoard.receiveAttack(x,y);
            shipStatus(outcome[0], x, y, playerBoard);
            return true;
        },

    }
}
function computer(){
    return{
        
        shotHistory: [],
        lastShotHit: null,
        trackedShipCoordinates: [],
        trackedShipOrientation: "",
        checkShotHistory(xCoord, yCoord){
            if(xCoord > 9 || yCoord > 9 || xCoord < 0 || yCoord < 0){
                        return true;
            }
            for(let i = 0; i < this.shotHistory.length; i++){
                    if(xCoord == this.shotHistory[i][0] && yCoord == this.shotHistory[i][1]){
                        return true
                    }
                    
            }

            return false
        },
        findOrientation(playerBoard){
            let y;
            let x;
            let outcome;
            //If horizontal y remains the same, x becomes either higher or lower than attained values
            if(this.trackedShipOrientation == "horizontal"){
                //y constant
                y = this.trackedShipCoordinates[0][1];
                x = this.trackedShipCoordinates[0][0] - 1

                if(this.checkShotHistory(x,y) == true){
                    x = this.trackedShipCoordinates[this.trackedShipCoordinates.length - 1][0] + 1;
                    if(this.checkShotHistory(x,y)){
                        this.trackedShipOrientation = "";
                        this.trackedShipCoordinates = [[this.trackedShipCoordinates[this.trackedShipCoordinates.length - 1][0], y]]
                        return this.findOrientation(playerBoard)
                        
                    }
                }
            } else if(this.trackedShipOrientation == "vertical"){
                y = this.trackedShipCoordinates[0][1] - 1
                x = this.trackedShipCoordinates[0][0];

                if(this.checkShotHistory(x,y) == true){
                    y = this.trackedShipCoordinates[this.trackedShipCoordinates.length - 1][1] + 1
                    if(this.checkShotHistory(x,y) == true){
                        this.trackedShipOrientation = "";
                        this.trackedShipCoordinates = [[x, this.trackedShipCoordinates[this.trackedShipCoordinates.length - 1][1]]]
                        return this.findOrientation(playerBoard);
                    }
                }
            } else if (this.trackedShipOrientation == ""){
                //Check horizontal, y remains constant
                let possibleOutcomes = [
                    [this.trackedShipCoordinates[0][0], this.trackedShipCoordinates[0][1] + 1],
                    [this.trackedShipCoordinates[0][0], this.trackedShipCoordinates[0][1] - 1],
                    [this.trackedShipCoordinates[0][0] + 1, this.trackedShipCoordinates[0][1]],
                    [this.trackedShipCoordinates[0][0] - 1, this.trackedShipCoordinates[0][1]]
                ];

                for(let i = 0; i < possibleOutcomes.length; i++){
                    if(!this.checkShotHistory(possibleOutcomes[i][0], possibleOutcomes[i][1])){
                        x = possibleOutcomes[i][0];
                        y = possibleOutcomes[i][1];

                        outcome = playerBoard.receiveAttack(x, y);
                        if(outcome[0] == true && i < 2){
                            this.trackedShipOrientation = "vertical";
                        } else if (outcome[0] == true && i > 1){
                            this.trackedShipOrientation = "horizontal";
                        }
                        break;
                    }
                }
                if(!x){
                    this.lastShotHit = false;
                    this.trackedShipCoordinates = [];
                    return this.randomShot(playerBoard);
                }
            }
            if(!outcome){
                outcome = playerBoard.receiveAttack(x,y)
            }
            this.shotHistory.push([x, y]);
            if(outcome[0] == true){
                this.trackedShipCoordinates.push([x,y]);
            } 
            if (outcome[1] == true){
                console.log('reset')
                this.lastShotHit = false;
                this.trackedShipCoordinates = [];
                this.trackedShipOrientation = "";
            }
            console.log("using coordinates", x, y, 
                "outcome was", outcome,
                "current tracking", this.trackedShipCoordinates, this.trackedShipOrientation
            )
            shipStatus(outcome[0], x, y, opponentBoard);
            
        },
        randomShot(playerBoard){
            let shot = [];
            let xCoord;
            let yCoord;
            if(this.lastShotHit == true){
                this.findOrientation(playerBoard);
                return
            } else{
                xCoord = Math.floor(Math.random() * 10);
                yCoord = Math.floor(Math.random() * 10);
                shot = [xCoord, yCoord];
                if(this.checkShotHistory() == true){
                    return this.randomShot(playerBoard)
                }
            }
            
            let outcome = playerBoard.receiveAttack(xCoord, yCoord);
            shipStatus(outcome[0], xCoord, yCoord, opponentBoard);
            this.shotHistory.push(shot);
            if(outcome[1] == true){
                this.lastShotHit = null;
                this.trackedShipCoordinates = [];
                this.trackedShipOrientation = ""
            } else if(outcome[0] == true){
                this.trackedShipCoordinates.push(shot);
                this.lastShotHit = true;
            }
            return shot;
        }
    }
}

//Append start button to initiate game
let startButton = document.createElement('button');
startButton.innerText = "Start Game"
startButton.addEventListener('click', launchGame);
startButton.id = "startBtn"
let buttonArea = document.querySelector('#startButtonArea');
buttonArea.append(startButton)

//initiate game by, creating the board for each player and placing players ships on board
function launchGame(){
    startButton.remove()

    let user = player();
    let opponent = computer();
    let playerBoard = gameboard('player');
    playerBoard.board = playerBoard;
    let playerBoardTiles = document.querySelector('#playerBoard');
    let opponentBoard = gameboard('computer');
    opponentBoard.board = opponentBoard;
    let opponentBoardTiles = document.querySelector('#opponentBoard');
    //create board tiles for player and opponent
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            let tile = document.createElement('div')
            tile.id = j + ',' + i + ',player';
            tile.classList.add('tile');
            playerBoardTiles.append(tile);

            let opponentTile = document.createElement('div')
            opponentTile.id = j + ',' + i + ',opponent';
            opponentTile.classList.add('tile');
            opponentTile.addEventListener('click', () =>{
                if(user.strikeEnemy(j, i, opponentBoard)){
                    opponent.randomShot(playerBoard);
                }

            })
            for(let k = 0; k < opponentBoard.shipFleet.length; k++){
                if(opponentBoard.shipFleet[k].coordinates == [i, j]){
                    tile.classList.add('ship')
                    tile.variable = oppponentBoard.shipFleet[i].name
                }
            }
            opponentBoardTiles.append(opponentTile);
        }
    }
    //add ship locations to respective players  fleet

    //Randomise opponent's board;
    playerBoard.randomiseAllShips();
    opponentBoard.randomiseAllShips();

    //identify where ships are and place them
    for(let i = 0; i < playerBoard.shipFleet.length; i++){
        for(let j = 0; j < playerBoard.shipFleet[i].coordinates.length; j++){
        //identify player ships and place them
            let shipLocationX = playerBoard.shipFleet[i].coordinates[j][0];
            let shipLocationY = playerBoard.shipFleet[i].coordinates[j][1];
            let coords =  shipLocationX + ',' + shipLocationY + ',player'
            let tempTile = document.getElementById(coords)
            tempTile.classList.add('ship')
        //identify opponent ships and place them
            shipLocationX = opponentBoard.shipFleet[i].coordinates[j][0];
            shipLocationY = opponentBoard.shipFleet[i].coordinates[j][1];
            coords =  shipLocationX + ',' + shipLocationY + ',opponent'
            tempTile = document.getElementById(coords)
            tempTile.classList.add('opponentShip')
        }
    }
}


function shipStatus(status, x, y, board){
    if(board === opponentBoard){
        let tile = document.getElementById(x + ',' + y + ',player');
        if(status){
            tile.classList.add('shipHit');
        } else{
            tile.classList.add('miss');
        }
    }
    if(board === playerBoard){
        let tile = document.getElementById(x + ',' + y + ',opponent');
        if(status){
            tile.classList.add('shipHit');
        } else{
            tile.classList.add('miss');
        }
    }
    
}

function gameOver(board){
    let screen = document.querySelector('section')

    let gameOverScreen = document.createElement('div');
    gameOverScreen.classList.add('gameOver');
    gameOverScreen.id = "gameOverScreen"
    

    let winnerHeading = document.createElement('h1');
    winnerHeading.classList.add('gameOverHeading')
    if(board.player != 'computer'){
        winnerHeading.innerText = "You Lose!";
    } else {
        winnerHeading.innerText = "You Win!";
    }
    
    gameOverScreen.append(winnerHeading)

    let restartButton = document.createElement('button');
    restartButton.classList.add('restartBtn');
    restartButton.innerText = 'Play Again?';
    restartButton.addEventListener('click', restartGame);
    gameOverScreen.append(restartButton);

    screen.append(gameOverScreen);
}

function restartGame(){
    const gameOverScreen = document.querySelector('#gameOverScreen');
    gameOverScreen.remove();


    const opponentField = document.getElementById('opponentBoard');
    const playerField = document.getElementById('playerBoard');

    while(opponentField.hasChildNodes()){
        opponentField.removeChild(opponentField.children[0]);
    }

    while(playerField.hasChildNodes()){
        playerField.removeChild(playerField.children[0]);
    }

    
    buttonArea.append(startButton)
}


module.exports = {
    ship, gameboard, player, computer
}