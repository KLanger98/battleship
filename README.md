# Battleship
## Description
The following project represents the classic board game Battleship. I have not spent much time on the visuals of this project as it really was focussed on as a test of my Javascript understanding and skills. The majority of the javascript exists within factory functions which generate the ships, the gameboard, the player and the computer. All related functions are then organised within their relative factory for the smoothest experience. This was a great advantage with the amount of coordinate tracking this game requires. 

This project challenged my critical thinking significantly, especially when it came to writing the computer's functions that would make the game more challenging for the user. The tracking function could still use some work as there are some minor bugs however for the most part it is currently working well. I look forward to adding some more features in the near future. 

I also used the start of this project to practice some test Driven development which can be seen in the sum.test.js file within the Assets folder.

Live link: https://klanger98.github.io/battleship/

## Usage
In order to play this game, simply press the 'Start Game' Button which will generate your board on the left and the players board with their hidden ships on the right.

Begin playing by clicking positions on the opponent's board to try and guess where their battleship is. If you get it correct, it will turn purple, incorrect it will turn red.

Your opponent (the computer) will also be playing against you and has some inbuilt intelligence. If the computer guesses a tile correctly it will try to determine the ships orientation before going along it's length.

Try your best to beat the computer!

Once either yourself or the computer wins you will be prsented with the option to restart the game and play again.

## Updates I would like to make
- Improve computer intelligence - it sometimes gives up on sinking your ship
- Add the ability to click and drag your own ships into different positions 
- Add some more CSS effects such as indicating when you have sunk an enemy's ship

