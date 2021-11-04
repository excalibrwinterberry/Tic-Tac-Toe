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
        //tie
        let isTie = true
        // board.forEach((cell) =>{
        //     if(cell === ""){
        //         isTie = false
        //         break
        //     }
        // })

        for(let i=0; i<9; i++){
            if(board[i] === ""){
                isTie = false
                break
            }
        }

        if(isTie){
            return "T"
        }

        return ""
    }
    
    const resetBoard = () =>{
        for(let i=0; i<9; i++){
            board[i] = ""
        }
    }

    return {getValue, setValue, checkWin, resetBoard}

})()


const Players = () => {
    const {setValue} = GameBoard
    let symbol = ''
    let name = ''
    const getSymbol =() => symbol

    const setSymbol = (input) => {
        symbol = input
    }

    const getName =() => name

    const setName = (input) =>{
        name = input
    }

    const playTurn = (index) =>{

        setValue(index, getSymbol())
    }

    return {getSymbol, setSymbol, getName, setName, playTurn}
}

const DisplayController = (() => {
    const {getValue, checkWin, resetBoard} = GameBoard

    const nameSelect = document.getElementsByClassName('nameSelect')[0]
    const gameboard = document.getElementsByClassName('gameboard')[0]
    const symbolSelect = document.getElementsByClassName('symbolSelect')[0]
    const resultTag = document.getElementsByClassName('result')[0]

    const player1 = Players()
    const player2 = Players()

    let counter = 0 // even => player1 chance, odd => player2 chance

    const setNameBtn = document.getElementById('setname')
    const xBtn = document.getElementById('x')
    const oBtn = document.getElementById('o')
    const resetBtn = document.getElementById('reset')

    const status = document.getElementById('status')

    const handleSetNameEvent = (e) =>{
        const inputp1 = document.getElementById('p1name').value.trim()
        const inputp2 = document.getElementById('p2name').value.trim()

        if(inputp1 !== ''){
            player1.setName(inputp1)
        }else{
            player1.setName('Player1')
        }

        if(inputp2 !== ''){
            player2.setName(inputp2)
        }else{
            player2.setName('Player2')
        }

        status.textContent = `Choose a symbol ${player1.getName()}`

        nameSelect.classList.add('invisible')
        symbolSelect.classList.remove('invisible')

        document.getElementById('p1name').value = ''
        document.getElementById('p2name').value = ''


    }

    const handleSymbolEvent = (e) =>{

        const sym1 = e.target.id === 'x' ? 'X' : 'O'
        const sym2 = e.target.id === 'x' ? 'O' : 'X'

        player1.setSymbol(sym1)
        player2.setSymbol(sym2)

        status.textContent = `${player1.getName()} chose ${player1.getSymbol()}, ${player2.getName()} chose ${player2.getSymbol()}`
        symbolSelect.classList.add('invisible')

        gameboard.classList.remove('invisible')
        resultTag.classList.remove('invisible')
        
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
            gameboard.classList.add("disabled")
            status.textContent = "Game Over"
            if(result === player1.getSymbol()){
                printRes = `${player1.getName()} Won`
            }else if(result === player2.getSymbol()){
                printRes = `${player2.getName()} Won`
            }else{
                printRes = `All cells are filled, its a Tie`
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
        status.textContent = "Fill out player's name"

        gameboard.classList.remove("disabled")

        counter = 0

        nameSelect.classList.remove('invisible')
        gameboard.classList.add('invisible')
        resultTag.classList.add('invisible')

    }



    const initialDisplay = () => {

        for(let i=0; i<9; i++){
            let cell = document.createElement('div')
            cell.setAttribute('data-id', i)
            cell.textContent = getValue(i)
            cell.classList.add("cell")
            cell.addEventListener('click', handleClickCell)
            gameboard.appendChild(cell)
        }

        status.textContent = "Fill out player's name"

        xBtn.addEventListener('click', handleSymbolEvent)
        oBtn.addEventListener('click', handleSymbolEvent)
        resetBtn.addEventListener('click', handleResetEvent)
        setNameBtn.addEventListener('click', handleSetNameEvent)


        gameboard.classList.add('invisible')
        symbolSelect.classList.add('invisible')
        resultTag.classList.add('invisible')

    }

    return {initialDisplay}
    
})()


DisplayController.initialDisplay()

