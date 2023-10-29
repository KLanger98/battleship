const ship = require('./script');

test('Confirms creation of ship with specified length', () => {
    let shipOne = ship(5)
    expect(shipOne.shipLength).toBe(5)
})

test('Confirms that once ship is hit, hit function will add one to hit count', () => {
    let shipOne = ship(5)
    expect(shipOne.hitCount).toBe(0)
    shipOne.hitFunction();
    expect(shipOne.hitCount).toBe(1)
})

test('Confirm that once hit count is equal to shipLength, ship is then sunk', () => {
    let shipTwo = ship(2);
    shipTwo.hitFunction();
    shipTwo.hitFunction();
    expect(shipTwo.sunk).toBe(true);
})