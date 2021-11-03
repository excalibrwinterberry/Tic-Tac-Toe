const GameBoard = (()=> {
    // const board = new Array(9).fill(0)

    const board = ["", "","","","","","","",""]

    const getValue = (index)=>{
        return board[index]
    }

    const setValue = (index, value) =>{
        board[index] = value
    }

    const checkWin = ()=>{
        //horizontally
        if(board[0] !== "" && (board[0] === board[1] && board[0] === board[2])){
            return board[0]
        }
        else if(board[3] !== "" && (board[3] === board[4] && board[3] === board[5])){
            return board[3]
        }
        else if(board[6] !== "" && (board[6] === board[7] && board[6] === board[8])){
            return board[6]
        }
        //vertically
        else if(board[0] !== "" && (board[0] === board[3] && board[0] === board[6])){
            return board[0]
        }
        else if(board[1] !== "" && (board[1] === board[4] && board[1] === board[7])){
            return board[1]
        }
        else if(board[2] !== "" && (board[2] === board[5] && board[2] === board[8])){
            return board[2]
        }
        //diagonally
        else if(board[0] !== "" && (board[0] === board[4] && board[0] === board[8])){
            return board[0]
        }
        else if(board[2] !== "" && (board[2] === board[4] && board[2] === board[6])){
            return board[0]
        }

        return ""
    }
    
    const resetBoard = () =>{
        for(let i=0; i<9; i++){
            board[i] = ""
        }
    }

    return {getValue, setValue, checkWin, board, resetBoard}

})()


const Players = () => {
    const {setValue} = GameBoard
    let symbol = ''
    const getSymbol =() => symbol

    const setSymbol = (input) => {
        symbol = input
    }

    const playTurn = (index) =>{

        setValue(index, getSymbol())
    }

    return {getSymbol, setSymbol, playTurn}
}

const DisplayController = (() => {
    const {getValue, checkWin, board, resetBoard} = GameBoard
    const gameboard = document.getElementsByClassName('gameboard')[0]

    const player1 = Players()
    const player2 = Players()

    let counter = 0 // even => player1 chance, odd => player2 chance


    const xBtn = document.getElementById('x')
    const oBtn = document.getElementById('o')
    const resetBtn = document.getElementById('reset')

    const status = document.getElementById('status')

    const handleSymbolEvent = (e) =>{

        const sym1 = e.target.id === 'x' ? 'X' : 'O'
        const sym2 = e.target.id === 'x' ? 'O' : 'X'

        player1.setSymbol(sym1)
        player2.setSymbol(sym2)

        xBtn.classList.toggle("disabled")
        oBtn.classList.toggle("disabled")
        resetBtn.classList.toggle("disabled")
        gameboard.classList.toggle("disabled")
        status.textContent = `Player 1 chose ${player1.getSymbol()}, Player 2 chose ${player2.getSymbol()}`
    }

    const handleClickCell = (e) =>{
        e.target.classList.add("notClickable")
        const playInd = parseInt(e.target.getAttribute('data-id'))
        if(counter%2 === 0){
            //player1 chance
            e.target.textContent = player1.getSymbol()
            player1.playTurn(playInd)
        }else{
            //player2 chance
            e.target.textContent = player2.getSymbol()
            player2.playTurn(playInd)
        }

        if(getValue(playInd) === 'X'){
            e.target.classList.add('xSymbol')
        }else{
            e.target.classList.add('oSymbol')
        }


        const result = checkWin() 

        if(result !== ''){
            let printRes = ``
            gameboard.classList.toggle("disabled")
            status.textContent = "Game Over"
            if(result === player1.getSymbol()){
                printRes = `Player1 Won`
            }else{
                printRes = `Player2 Won`
            }

            document.getElementById('res').textContent = printRes 
        }
        counter++
    }

    const handleResetEvent = (e) =>{
        const cells = [...document.getElementsByClassName('cell')]
        cells.forEach((cell) =>{
            cell.textContent = ""
            const classCell = cell.className
            if(classCell.search("xSymbol") !== -1){
                cell.classList.remove("xSymbol")
            }
            if(classCell.search("oSymbol") !== -1){
                cell.classList.remove("oSymbol")
            }

            cell.classList.remove("notClickable")
        })



        resetBoard()

        document.getElementById('res').textContent = ""
        status.textContent = "Choose a symbol to start the game"

        xBtn.classList.toggle("disabled")
        oBtn.classList.toggle("disabled")
        resetBtn.classList.toggle("disabled")
        gameboard.classList.toggle("disabled")

        counter = 0
    }



    const initialDisplay = () => {
        gameboard.classList.toggle("disabled")
        resetBtn.classList.toggle("disabled")
        for(let i=0; i<9; i++){
            let cell = document.createElement('div')
            cell.setAttribute('data-id', i)
            cell.textContent = getValue(i)
            cell.classList.add("cell")
            cell.addEventListener('click', handleClickCell)
            gameboard.appendChild(cell)
        }

        xBtn.addEventListener('click', handleSymbolEvent)
        oBtn.addEventListener('click', handleSymbolEvent)
        resetBtn.addEventListener('click', handleResetEvent)
    }

    return {initialDisplay}
    
})()


DisplayController.initialDisplay()

