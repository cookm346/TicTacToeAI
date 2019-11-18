var origBoard;
var huPlayer;
var aiPlayer;
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const cells = document.querySelectorAll('.cell');

//startGame("X");

function startGame(symbol){
    
    huPlayer = symbol;
    aiPlayer = symbol == "O" ? "X" : "O";
    
    origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    document.querySelector(".endgame").style.display = "none";
    
    for(var i = 0; i < cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
    
    if(symbol == "X"){
        let openingMoves = [0, 2, 6, 8];
        let firstMove = openingMoves[Math.floor(Math.random() * openingMoves.length)]
        turn(firstMove, aiPlayer);
        //turn(bestSpot(), aiPlayer);
    }
}


function turnClick(square){
    turn(square.target.id, huPlayer);
    if(!checkWin(origBoard, huPlayer) && !checkTie()){
        turn(bestSpot(), aiPlayer);
        checkWin(origBoard, aiPlayer);
        checkTie();
    }
}


function turn(squareInd, player){
    origBoard[squareInd] = player;
    cells[squareInd].innerText = player;
    cells[squareInd].removeEventListener('click', turnClick, false);
    
    let outcome = checkWin(origBoard, player);
    
    if(outcome.win == true){
        displayWinner(player);
        colorWinner(outcome.ind, player);
        removeListen();
    }
}


function bestSpot(){
    return minimax(origBoard, aiPlayer).index;
}


function checkTie(){
    if(emptySquares(origBoard).length == 0){
        colorWinner();
        displayWinner("Cat's game!");
        return true;
    }
    return false;
}


function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}


function checkWin(board, player){
    let outcome = {}
    
    for(var i = 0; i < winCombos.length; i++){
        let ind = [];
        for(var j = 0; j < 3; j++){
            ind[j] = board[ winCombos[i][j] ]
        }
        if(allEqual(ind, player)){
            outcome.ind = winCombos[i];
            outcome.winner = player;
            outcome.win = true;
            return outcome;
        }
    }
    return false;
}


function allEqual(squareInds, player){
    return squareInds.every( (val, i, arr) => val === player );
}


function removeListen(){
    for(var i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
}


function displayWinner(message){
    if(message == huPlayer){
        message = "You win!"
    } else if (message == aiPlayer){
        message = "You lose!"
    }
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".text").innerText = message;
}


function colorWinner(squareInds, player){
    let color;
    if(player == undefined){
        color = "grey";
    } else if (player == huPlayer){
        color = "green";
    } else if (player === aiPlayer){
        color = "red";
    }
    
    if(squareInds === undefined){
        for(var i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = color;
        }
    } else {
        for(var i = 0; i < 3; i++){
            cells[ squareInds[i] ].style.backgroundColor = color;
        }
    }
    
}


function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, huPlayer)) {
        return {score: -10};
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }

    var moves = [];
    for (let i = 0; i < availSpots.length; i ++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player === aiPlayer)
            move.score = minimax(newBoard, huPlayer).score;
        else
            move.score =  minimax(newBoard, aiPlayer).score;
        newBoard[availSpots[i]] = move.index;
        if ((player === aiPlayer && move.score === 10) || (player ===       huPlayer && move.score === -10))
            return move;
        else 
            moves.push(move);
    }

    let bestMove, bestScore;
    if (player === aiPlayer) {
    bestScore = -10000;
        for(let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
        } else {
            bestScore = 10000;
            for(let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
    }
    return moves[bestMove];
}
