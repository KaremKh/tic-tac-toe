
const Player = (pName, mark) => {

    return {pName, mark};
};

const GameBoard = (() => {
    let gameBoard = ['','','','','','','','',''];
    
    let namesContent='';
    
    let handleTurn = (event) => {
        let currentSqaure = event.target;
        let squareId = currentSqaure.id;
        if (GameBoard.gameBoard[squareId.split('-')[1]] === '')  {
            GameBoard.gameBoard[squareId.split('-')[1]] = Game.currentPlayer.mark;
            console.log(currentSqaure.classList);
            if (Game.currentPlayer.mark ==='O') {
                currentSqaure.classList.remove("glow2");
                currentSqaure.classList.add("glow3");
            } else {
                currentSqaure.classList.remove("glow3");
                currentSqaure.classList.add("glow2");
            }
            currentSqaure.textContent = Game.currentPlayer.mark;
            Game.isGameOver();
            Game.currentPlayer = Game.switchPlayer();        
        }
    }

    const renderBoard = (player1, player2) => {
        let htmlContent='';
        namesContent = `<div class="playern">
                            <h2>${player1.pName} (${player1.mark})</h2>
                        </div>
                        <div class="playern">
                            <h2>${player2.pName} (${player2.mark})</h2>
                        </div>`;
        gameBoard.forEach((value, index) => {
            htmlContent+=`<div class="square" id=square-${index}></div>`;
    });
            document.querySelector(".names").innerHTML = namesContent;
            document.querySelector(".gameboard").innerHTML = htmlContent;

            const squares = document.querySelectorAll('.square');
            squares.forEach((square, index) => {
                square.addEventListener('click', GameBoard.handleTurn);
                square.classList.add("glow2");
            });
    }

    return {
        renderBoard,
        handleTurn,
        gameBoard

    };
})();


const Game = (() => {
    let player1;
    let player2;
    let name1;
    let name2;
    let mark1;
    let mark2;
    let currentPlayer;
    


    switchPlayer = () => {

        if (Game.currentPlayer == Game.player1)
            return Game.player2;
        else return Game.player1;
    };

    const startGame = (event) => {
        
        
        let form = document.querySelector('form');
        name1 = document.getElementById('name1').value;
        name2 = document.getElementById('name2').value;
        
        //event.preventDefault();

        const markInputs = document.getElementsByName('options');
        let selectedOption = null;
        for (const input of markInputs) {
        if (input.checked) {
            selectedOption = input.value;
            break;
        }
        }
        if (selectedOption) {
        mark1 = selectedOption;
        if (selectedOption == 'X') mark2 = 'O';
        else mark2 = 'X';

        } else {
        mark1 = 'X';
        mark2 = 'O';
        }

        player1 = Player(name1, mark1);
        player2 = Player(name2, mark2);
        currentPlayer = player1;

        Game.player1 = player1;
        Game.player2 = player2;
        Game.currentPlayer = currentPlayer;

        GameBoard.renderBoard(player1, player2);
    };
    

    

    const isGameOver = () => {

        let matrix = [];
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 3; j++) {
              row.push(GameBoard.gameBoard[i * 3 + j]);
            }
            matrix.push(row);
          }

          for (let i = 0; i < 3; i++) {
            
            if (matrix[i][0] === matrix[i][1] && matrix[i][1] === matrix[i][2] && matrix[i][1] != '') {
                if (matrix[i][0] === Game.player1.mark) {
                    Game.playerWon(Game.player1);
                }
                else {
                    Game.playerWon(Game.player2);
                }
            }

            if (matrix[0][i] === matrix[1][i] && matrix[1][i] === matrix[2][i] && matrix[1][i] != '') {
                if (matrix[0][i] === Game.player1.mark) {
                    Game.playerWon(Game.player1);
                }
                else {
                    Game.playerWon(Game.player2);
                }
            }
          }

          if (matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2] && matrix[1][1] != ''){
            if (matrix[0][0] === Game.player1.mark) {
                Game.playerWon(Game.player1);
            }
            else {
                Game.playerWon(Game.player2);
            }
          }

          if (matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0] && matrix[1][1] != ''){
            if (matrix[0][2] === Game.player1.mark) {
                Game.playerWon(Game.player1);
            }
            else {
                Game.playerWon(Game.player2);
            }
          }
    }

    const playerWon = (Player) => {
        var container = document.getElementById("winning-container");
        let winMessage = document.querySelector('.dialog h2');
        winMessage.textContent = `Congratulations ${Player.pName}, you won!`
        container.classList.add('show');
        const squares = document.querySelectorAll('.square');
            squares.forEach((square, index) => {
                console.log('event listener removed');
                square.removeEventListener('click', GameBoard.handleTurn);
        });
    }

    const playAgain = () => {
        GameBoard.gameBoard = ['','','','','','','','',''];
        const markInputs = document.getElementsByName('options');
        let selectedOption = null;
        for (const input of markInputs) {
        if (input.checked) {
            selectedOption = input.value;
            break;
        }
        }
        if (selectedOption) {
        mark1 = selectedOption;
        if (selectedOption == 'X') mark2 = 'O';
        else mark2 = 'X';

        } else {
        mark1 = 'X';
        mark2 = 'O';
        }

        currentPlayer = player1;
        Game.currentPlayer = currentPlayer;
        document.querySelector(".gameboard").innerHTML='';
        console.log(document.querySelector(".gameboard").innerHTML);
        GameBoard.renderBoard(Game.player1, Game.player2);
    }

    const endGame = () => {
        hideWinningContainer();
        GameBoard.gameBoard = ['','','','','','','','',''];
        document.querySelector(".gameboard").innerHTML='';
        const startgameDiv = document.querySelector('.startgame');
        startgameDiv.style.display = 'block';
        document.querySelector(".names").innerHTML = '';
        form.reset();


    

    }

    return {
        currentPlayer,
        switchPlayer,
        startGame,
        isGameOver,
        playerWon,
        playAgain,
        endGame,
        player1,
        player2
      };


})();

function hideWinningContainer() {
    var container = document.getElementById("winning-container");
    container.classList.remove("show");
    
    

    Game.playAgain();
  }

  const form = document.querySelector('.startgame form');
  const startgameDiv = document.querySelector('.startgame');
  
  form.addEventListener('submit', (event) => {
      // prevent the form from submitting normally
      event.preventDefault();
  
      // hide the startgame div
      startgameDiv.style.display = 'none';
  
      // call the startGame function (assuming it's defined elsewhere)
      Game.startGame();
  });



