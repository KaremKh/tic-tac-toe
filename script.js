
// This is a factory function that creates a new player object with a name and a mark (X or O).
const Player = (pName, mark) => {
    return {pName, mark};
};

// This is a module revealing pattern function that creates a game board object.
const GameBoard = (() => {
    // A 9-element array representing the game board. It's initialized as an empty array.
    let gameBoard = ['','','','','','','','',''];
    // A string that will hold the HTML content of the player names.
    let namesContent='';

    // A function that handles a turn in the game.
    let handleTurn = (event) => {
        // Get the current square from the event object.
        let currentSquare = event.target;
        // Get the ID of the current square and split it to get the index of the square.
        let squareId = currentSquare.id;
        // If the square is not already taken...
        if (GameBoard.gameBoard[squareId.split('-')[1]] === '')  {
            // Assign the mark of the current player to the square.
            GameBoard.gameBoard[squareId.split('-')[1]] = Game.currentPlayer.mark;
            // Add or remove the glow2 or glow3 classes depending on the current player mark.
            if (Game.currentPlayer.mark ==='O') {
                currentSquare.classList.remove("glow2");
                currentSquare.classList.add("glow3");
            } else {
                currentSquare.classList.remove("glow3");
                currentSquare.classList.add("glow2");
            }
            // Update the text content of the square to show the current player mark.
            currentSquare.textContent = Game.currentPlayer.mark;
            // Check if the game is over.
            Game.isGameOver();
            // Switch the current player.
            Game.currentPlayer = Game.switchPlayer();
        }
    }

    // This function is called when a player clicks on a square on the game board
    let handleAI = (event) => {
        // Get the clicked square and its ID
        let currentSquare = event.target;
        let squareId = currentSquare.id;
    
        // Check if it's player 1's turn and the clicked square is empty
        if (Game.currentPlayer === Game.player1 && GameBoard.gameBoard[squareId.split('-')[1]] === '')  {
        // Update the game board with player 1's mark
        GameBoard.gameBoard[squareId.split('-')[1]] = Game.currentPlayer.mark;
        
        // If player 1's mark is 'O', remove the 'glow2' class and add the 'glow3' class to the clicked square. Otherwise, remove the 'glow3' class and add the 'glow2' class.
        if (Game.currentPlayer.mark ==='O') {
            currentSquare.classList.remove("glow2");
            currentSquare.classList.add("glow3");
        } else {
            currentSquare.classList.remove("glow3");
            currentSquare.classList.add("glow2");
        }
        
        // Set the text content of the clicked square to player 1's mark
        currentSquare.textContent = Game.currentPlayer.mark;
    
        // Check if the game is over
        Game.isGameOver();
        
        // Find all empty squares on the game board
        const emptyIndices = [];
        for (let i = 0; i < GameBoard.gameBoard.length; i++) {
            if (GameBoard.gameBoard[i] === '') {
            emptyIndices.push(i);
            }
        }
    
        // Choose a random empty square to update with player 2's mark
        const randomIndex = Math.floor(Math.random() * emptyIndices.length);
        const emptyIndex = emptyIndices[randomIndex];
        GameBoard.gameBoard[emptyIndex] = Game.player2.mark; 
        console.log(GameBoard.gameBoard);
    
        // Get the empty square element and update it with player 2's mark
        let emptySquare = document.getElementById(`square-${emptyIndex}`);
    
        // If player 2's mark is 'O', remove the 'glow2' class and add the 'glow3' class to the empty square. Otherwise, remove the 'glow3' class and add the 'glow2' class.
        if (Game.player2.mark ==='O') {
            emptySquare.classList.remove("glow2");
            emptySquare.classList.add("glow3");
        } else {
            emptySquare.classList.remove("glow3");
            emptySquare.classList.add("glow2");
        }
        
        // Set the text content of the empty square to player 2's mark
        emptySquare.textContent = Game.player2.mark;
    
        // Check if the game is over
        Game.isGameOver();
        }
    };
    
      

    const renderBoard = (player1, player2) => {

        // Initializes an empty string to store HTML content
        let htmlContent='';
    
        // Creates a HTML content for player names using template literals
        namesContent = `<div class="playern">
                            <h2>${player1.pName} (${player1.mark})</h2>
                        </div>
                        <div class="playern">
                            <h2>${player2.pName} (${player2.mark})</h2>
                        </div>`;
    
        // Creates a HTML content for the game board using template literals
        gameBoard.forEach((value, index) => {
            htmlContent+=`<div class="square" id=square-${index}></div>`;
        });
    
        // Sets the player names HTML content to the DOM element with class name "names"
        document.querySelector(".names").innerHTML = namesContent;
    
        // Sets the game board HTML content to the DOM element with class name "gameboard"
        document.querySelector(".gameboard").innerHTML = htmlContent;
    
        // Selects all the HTML elements with class name "square" and stores them in a NodeList called "squares"
        const squares = document.querySelectorAll('.square');
    
        // Checks if the game mode is player vs player
        if (Game.mode === 'pvp'){
            // Adds a click event listener to each square, calling the handleTurn function when clicked
            squares.forEach((square, index) => {
                square.addEventListener('click', GameBoard.handleTurn);
            });
        }
        // Checks if the game mode is player vs AI
        else if (Game.mode === 'pvai'){
            // Adds a click event listener to each square, calling the handleAI function when clicked
            squares.forEach((square, index) => {
                square.addEventListener('click', GameBoard.handleAI);
            }); 
        } 
    } 
    

    return {
        renderBoard,
        handleTurn,
        handleAI,
        gameBoard

    };
})();


const Game = (() => {

    // Initialize variables
    let player1;
    let player2;
    let name1;
    let name2;
    let mark1;
    let mark2;
    let currentPlayer;
    let mode;
    

    // Helper function to switch players
    switchPlayer = () => {
        if (Game.currentPlayer == Game.player1)
            return Game.player2;
        else return Game.player1;
    };

    // Function called when the user clicks the "Start" button
    const startGame = (event) => {
        
        // Get form values
        let form = document.querySelector('form');
        name1 = document.getElementById('name1').value;
        name2 = document.getElementById('name2').value;
        Game.mode = document.getElementById('mode').value;
        
        // Get selected mark from radio buttons
        const markInputs = document.getElementsByName('options');
        let selectedOption = null;
        for (const input of markInputs) {
        if (input.checked) {
            selectedOption = input.value;
            break;
        }
        }
        // Assign marks to players
        if (selectedOption) {
        mark1 = selectedOption;
        if (selectedOption == 'X') mark2 = 'O';
        else mark2 = 'X';

        } else {
        mark1 = 'X';
        mark2 = 'O';
        }

        // Create player objects and set current player
        player1 = Player(name1, mark1);
        player2 = Player(name2, mark2);
        currentPlayer = player1;

        // Set properties on the Game object
        Game.player1 = player1;
        Game.player2 = player2;
        Game.currentPlayer = currentPlayer;

        // Render the game board
        GameBoard.renderBoard(player1, player2);
    };
    

    // Check if the game is over
    const isGameOver = () => {

        // Convert the game board array to a matrix
        let matrix = [];
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 3; j++) {
              row.push(GameBoard.gameBoard[i * 3 + j]);
            }
            matrix.push(row);
          }

          // Check for wins in rows and columns
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

          // Check for wins in diagonals
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
          
          // Check for tie
          let tie = true;

          for (let i = 0; i < 3; i++) {
            
            for (let j = 0; j < 3; j++) {
              if (matrix[i][j] === '') tie =false;
            }
            
          }
          if (tie === true) Game.gameTied();
    }

    // Define a function that displays a message and highlights the winning combination of squares on the game board
    const playerWon = (Player) => {
        // Get the container element for displaying the message and winning combination
        var container = document.getElementById("winning-container");
        // Get the h2 element for displaying the winning message
        let winMessage = document.querySelector('.dialog h2');
        // Set the winning message to include the player's name
        winMessage.textContent = `Congratulations ${Player.pName}, you won!`
        // Add a class to the container element to show it
        container.classList.add('show');
        // Get all the squares on the game board
        const squares = document.querySelectorAll('.square');
        // Loop through each square and remove its click event listener to prevent further gameplay
        squares.forEach((square, index) => {
            console.log('event listener removed');
            square.removeEventListener('click', GameBoard.handleTurn);
        });
    }
  
    // Define a function that displays a message indicating a tie game and removes the click event listeners from all squares
    const gameTied = () => {
        // Get the container element for displaying the message
        var container = document.getElementById("winning-container");
        // Get the h2 element for displaying the tie message
        let winMessage = document.querySelector('.dialog h2');
        // Set the tie message
        winMessage.textContent = `This game is a tie!`
        // Add a class to the container element to show it
        container.classList.add('show');
        // Get all the squares on the game board
        const squares = document.querySelectorAll('.square');
        // Loop through each square and remove its click event listener to prevent further gameplay
        squares.forEach((square, index) => {
            console.log('event listener removed');
            square.removeEventListener('click', GameBoard.handleTurn);
        });
    }
  
    // Define a function that resets the game board and starts a new game
    const playAgain = () => {
        // Reset the game board to its initial empty state
        GameBoard.gameBoard = ['','','','','','','','',''];
        // Get the radio inputs for selecting player marks
        const markInputs = document.getElementsByName('options');
        let selectedOption = null;
        // Loop through the radio inputs to find the selected option
        for (const input of markInputs) {
        if (input.checked) {
            selectedOption = input.value;
            break;
        }
        }
        // Set the player marks based on the selected option or the default values
        if (selectedOption) {
        mark1 = selectedOption;
        if (selectedOption == 'X') mark2 = 'O';
        else mark2 = 'X';
        } else {
        mark1 = 'X';
        mark2 = 'O';
        }
        // Reset the current player to player1
        currentPlayer = player1;
        // Set the current player for the game
        Game.currentPlayer = currentPlayer;
        // Clear the game board in the HTML
        document.querySelector(".gameboard").innerHTML='';
        console.log(document.querySelector(".gameboard").innerHTML);
        // Render the game board with the updated player marks
        GameBoard.renderBoard(Game.player1, Game.player2);
    }

    const endGame = () => {
        // Hide the winning message container
        hideWinningContainer();
        
        // Reset the game board to an empty state
        GameBoard.gameBoard = ['','','','','','','','',''];
        
        // Clear the game board display
        document.querySelector(".gameboard").innerHTML='';
        
        // Show the start game div
        const startgameDiv = document.querySelector('.startgame');
        startgameDiv.style.display = 'block';
        
        // Clear the player names display and reset the form
        document.querySelector(".names").innerHTML = '';
        form.reset();
    }
    
    // Define the public methods and properties of the Game object
    return {
        currentPlayer,
        switchPlayer,
        startGame,
        isGameOver,
        playerWon,
        playAgain,
        endGame,
        gameTied,
        player1,
        player2,
        mode
    };
    
    // Immediately invoked function expression to create the Game object
    })();
    
    function hideWinningContainer() {
        // Hide the winning message container by removing the "show" class
        var container = document.getElementById("winning-container");
        container.classList.remove("show");
        
        // Call the playAgain method to reset the game state
        Game.playAgain();
    }
    
    // Select the form and start game div elements
    const form = document.querySelector('.startgame form');
    const startgameDiv = document.querySelector('.startgame');
      
    form.addEventListener('submit', (event) => {
        // Prevent the form from submitting normally
        event.preventDefault();
      
        // Hide the start game div
        startgameDiv.style.display = 'none';
      
        // Call the startGame method to begin the game
        Game.startGame();
    });
    
    // Select the theme toggle button and body element
    const themeToggleBtn = document.querySelector('#theme-toggle');
    const body = document.querySelector('body');
    
    themeToggleBtn.addEventListener('click', function() {
        // Toggle the "dark-mode" class on the form and body elements
        form.classList.toggle('dark-mode');
        body.classList.toggle('dark-mode');
    });
    



