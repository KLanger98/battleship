
function ship(lengthOfShip) {
    return{
        shipLength: lengthOfShip,
        hitCount: 0,
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

function gameboard(){
    return{
        receiveAttack(X, Y) {

        }
    }
}

let shipOne = ship(5)
console.log(shipOne)
console.log(shipOne.confirmSink())

module.exports = ship;