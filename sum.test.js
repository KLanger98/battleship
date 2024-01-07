const {ship, gameboard, player, computer} = require('./script')

test('Confirms creation of ship with specified length', () => {
    let shipOne = ship(5)
    expect(shipOne.shipLength).toBe(5)
});

test('Confirms that once ship is hit, hit function will add one to hit count', () => {
    let shipOne = ship(5)
    expect(shipOne.hitCount).toBe(0)
    shipOne.hitFunction();
    expect(shipOne.hitCount).toBe(1)
});

test('Confirm that once hit count is equal to shipLength, ship is then sunk', () => {
    let shipTwo = ship(2);
    shipTwo.hitFunction();
    shipTwo.hitFunction();
    expect(shipTwo.sunk).toBe(true);
});

test('Confirm that once a coordinate is decided a ship of specified length is created along all necessary coordinates', () =>{
    let playerBoard = gameboard()
    let coords = playerBoard.positionShip(0,1,3);
    expect(coords[1][0]).toBe(1)
});

test('Confirm that once the coordinates of a ship are decided and saved, that an opponent hitting the ships coordinate will trigger the ships hitFunction', () =>{
    let playerBoard = gameboard()
    playerBoard.positionShip(0,1,3);
    playerBoard.receiveAttack(0,1);
    playerBoard.receiveAttack(1,1);
    expect(playerBoard.shipFleet[0].name.hitCount).toBe(2);
});

test('If attack misses, update missed attacks record', () =>{
    let playerBoard = gameboard()
    playerBoard.positionShip(0,1,3);
    playerBoard.receiveAttack(4,5);
    playerBoard.receiveAttack(5,4)
    expect(playerBoard.missedAttacks[1][0]).toBe(5);
})

test('If all ships are sunk return true', () =>{
    let playerBoard = gameboard()
    playerBoard.positionShip(0,1,3);
    playerBoard.receiveAttack(0,1);
    playerBoard.receiveAttack(1,1);
    playerBoard.receiveAttack(2,1);

    console.log(playerBoard.shipFleet[0].location)
    
    expect(playerBoard.checkShips()).toBe(true);
})

test('If player takes the shot, it is added to the shot list and the shot is taken at the opponents gameboard', () =>{
    let me = player();
    let myOpponent = gameboard()
    me.strikeEnemy(0,1, myOpponent);
    expect(me.shotList[0]).toStrictEqual([0,1])
});