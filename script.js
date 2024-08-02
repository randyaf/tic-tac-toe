const GameBoard = (function() {
    const boardState = [];
    // const boardState = [1, "a-1", 2, "c-3", 3, "b-2"];

    function tickCell(row, column) {
        if (!checkMoveValidity(row, column)) return;
        boardState.push(`${row}-${column}`);
    }

    function checkMoveValidity(row, column) {
        if (boardState.find(coordinate => coordinate === `${row}-${column}`)) return false;
        else if (!["a", "b", "c"].includes(row)) return false;
        else if (column < 1 && column > 3) return false;
        return true;
    }

    function checkWinner() {
        if (boardState.length % 2 === 0) {
            const evenPlayer = boardState.filter(coordinate => boardState.indexOf(coordinate) % 2 !== 0);
            return findWinningLine(evenPlayer);
        } else {
            const oddPlayer = boardState.filter(coordinate => boardState.indexOf(coordinate) % 2 === 0);
            return findWinningLine(oddPlayer);
        }
    }


    function findWinningLine(playerCells) {
        for (let row of ["a", "b", "c"]) {
            const winningLine = [];
            for (let column = 1; column <= 3; column++) {
                if (!playerCells.includes(`${row}-${column}`)) break;
                winningLine.push(`${row}-${column}`);
                if (column === 3) return winningLine;
            }
            winningLine.splice(0, winningLine.length);
        }
        for (let column = 1; column <= 3; column++) {
            const winningLine = [];
            for (let row of ["a", "b", "c"]) {
                if (!playerCells.includes(`${row}-${column}`)) break;
                winningLine.push(`${row}-${column}`);
                if (row === "c") return winningLine;
            }
            winningLine.splice(0, winningLine.length);
        }
        const diagonalRight = ["a-1", "b-2", "c-3"];
        for (let coordinate of diagonalRight) {
            if (!playerCells.includes(coordinate)) break;
            if (coordinate === "c-3") return diagonalRight;
        }
        const diagonalLeft = ["a-3", "b-2", "c-1"];
        for (let coordinate of diagonalLeft) {
            if (!playerCells.includes(coordinate)) break;
            if (coordinate === "c-1") return diagonalLeft;
        }
        return null;
    }

    function getBoardState() {
        return boardState;
    }

    function resetBoard() {
        boardState.splice(0, boardState.length);
    }

    return { getBoardState, tickCell, checkWinner, resetBoard, checkMoveValidity };
})();


// todo create the computer module with ability to make random move,
// and even better if it can have multiple difficulties.

const Computer = (function() {

    const game = GameBoard;

    function makeMove(difficulty = "easy") {
        if (difficulty = "easy") return easyDifMove();
        else if (difficulty = "medium") return mediumDifMove();
        else if (difficulty = "hard") return hardDifMove();
        else return easyDifMove();
    }

    function getRandomCoordinate() {
        return `${["a", "b", "c"][Math.floor(Math.random() * 3)]}-${Math.floor(Math.random() * 3) + 1}`;
    }

    // function defendCell() {

    // }

    function easyDifMove() {
        console.log("inside easy move");
        while(true) {
            console.count("loop");
            const coordinate = getRandomCoordinate();
            if(game.checkMoveValidity(...coordinate.split("-"))) return coordinate;
        }
    }

    return { makeMove };
})();

const ScoreBoard = (function() {
    let player1Score = 0;
    let player2Score = 0;
    let tieScore = 0;
    
    const game = GameBoard;

    function updateScore() {
        const winningLine = game.checkWinner();
        if (winningLine !== null) {
            if (game.getBoardState().indexOf(winningLine[0]) % 2 === 0) {
                player1Score++;
            } else if (game.getBoardState().indexOf(winningLine[0]) % 2 !== 0) {
                player2Score++;
            }
        } else {
            tieScore++;
        }
    }

    function resetScore() {
        player1Score = 0;
        player2Score = 0;
        tieScore = 0;
    }

    function getScores() {
        return { player1Score, player2Score, tieScore };
    }

    return { getScores, updateScore, resetScore };
})();

const ScoreBoardView = (function() {
    const playerScore = document.querySelector(".player-score");
    const computerScore = document.querySelector(".computer-score");
    const tieScore = document.querySelector(".tie-score");

    function render() {
        const scores = ScoreBoard.getScores();
        playerScore.textContent = scores.player1Score;
        computerScore.textContent = scores.player2Score;
        tieScore.textContent = scores.tieScore;
    }

    return { render };
})();




const GameBoardController = (function() {

    const game = GameBoard;
    let isGameFinished = false;

    function startGame() {
        isGameFinished = false;
        for (let i = 0; i < 9; i++) {
            if (isGameFinished) break;
            proceedRound();
        }
    }

    function proceedRound(coordinate) {
        if (!isGameFinished) game.tickCell(...coordinate.split("-"));
        if (!isGameFinished && game.checkWinner() !== null) {
            console.log("winning line: " + game.checkWinner());
            isGameFinished = true;
            return;
        } else if (!isGameFinished && game.getBoardState().length === 9) {
            isGameFinished = true;
            return;
        }
        if (isGameFinished) {
            ScoreBoard.updateScore();
            ScoreBoardView.render();
            game.resetBoard();
            isGameFinished = false;
        }
    }

    function getBoardState() {
        return game.getBoardState();
    }

    return { startGame, proceedRound, getBoardState };
})();

// GameBoardController.startGame();




const GameBoardView = (function() {
    const gameBoardController = GameBoardController;
    const gameBoardElement = document.querySelector(".game-board");
    const cells = document.querySelectorAll(".cell");

    gameBoardElement.addEventListener("click", cellsClickHandler);

    function cellsClickHandler(event) {
        const cell = event.target.closest(".cell");
        if (cell.matches(".cell")) {
            gameBoardController.proceedRound(cell.dataset.coordinate);
        }
        render();
    }

    function render() {
        // todo here to implement render
        const boardState = gameBoardController.getBoardState();
        for (let cell of cells) {
            if (boardState.includes(cell.dataset.coordinate)) {
                if (boardState.indexOf(cell.dataset.coordinate) % 2 === 0) {
                    cell.querySelector(".check-icon > img").src = "./images/cross.svg";
                    cell.querySelector(".check-icon > img").classList.add("visible");
                }
                else {
                    cell.querySelector(".check-icon > img").src = "./images/circle.svg";
                    cell.querySelector(".check-icon > img").classList.add("visible");
                }
            } else {
                cell.querySelector(".check-icon > img").classList.remove("visible");
            }
        }
    }

    return { render };
})();