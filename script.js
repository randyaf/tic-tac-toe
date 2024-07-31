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

    return { boardState, tickCell, checkWinner };
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

    function proceedRound() {
        game.tickCell(...prompt("pick the box").split("-"));
        if (game.checkWinner() !== null) {
            console.log("winning line: " + game.checkWinner());
            isGameFinished = true;
            return;
        }
    }

    return { startGame };
})();

GameBoardController.startGame();


const ScoreBoard = (function() {
    let player1Score = 0;
    let player2Score = 0;
    let tieScore = 0;
    
    const game = GameBoard;

    function updateScore(player) {
        if (player.name === "player1") player1Score++;
        else if (player.name === "player2") player2Score++;
        else tieScore++;
    }

    function resetScore() {
        player1Score = 0;
        player2Score = 0;
        tieScore = 0;
    }
})();