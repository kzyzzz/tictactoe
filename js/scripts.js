const tttGame = (() => {

    let board = []
    let marker = 'X'

    const getBoard = () => {
        return board
    }
    const getMarker = () => {
        return marker
    }

    const play = (index) => {
       // console.log('Playng: ', index, ' on ', board, 'with: ', marker)
        if (board[index] == '') {
            
            board[index] = marker
            console.log(`Play(${index} -> ${marker})`,index, board, checkWinner())
            if (marker == 'X') {
                marker = 'O'
            } else {
                marker = 'X'
            }
            
            return true
        }
        return false
    }

    const checkWinner = () => { 
        const winStates = [[0, 1, 2],
                           [3, 4, 5],
                           [6, 7, 8],
                           [0, 3, 6],
                           [1, 4, 7],
                           [2, 5, 8],
                           [0, 4, 8],
                           [2, 4, 6]]

                           
        let state =  winStates.some((state) => {
                        return state.every((index) => {
                                return board[index] == board[state[0]] &&  board[state[0]] != ''
                                //every item in triplet indexes of board is the same and not empty('')
                        
                        })
                    })
        if (board.every((item) => item != '') && state == false) return 'tie'
        return state
    }

    const flush = () => {
        for (let index = 0; index < 9; index++) {
            board[index] = ''
            marker = 'X'
        }
    }



    let playerMarker
    let aiMarker

    const aiMove = () => {
        if (board.every((item) => item == '')) return 4
        let score = -Infinity
        let moveList = []
        aiMarker = marker
        if (aiMarker == 'X') {playerMarker = 'O'} else {playerMarker = 'X'}
            for (let position = 0; position < 9; position++){
                if (board[position] == ''){
              
                    board[position] = aiMarker

                    score = minmax(board, false)

                    board[position] = ''

                    moveList.push({position, score})
                }
            }
        
        console.log(moveList)
        return moveList.sort(() => Math.random() - 0.5).sort((a, b) => b.score - a.score)[0].position

    }

    const minmax = (board, isMaximizing) => {
        
        
        let winState = checkWinner()
        let moveList = []


            if (winState == true) {
                if (isMaximizing) {return -10}
                return 10
            }
            else if (winState == 'tie') {
                return 0
            }

        if (isMaximizing) {
            let score = -Infinity

            for (let position = 0; position < 9; position++){
                if (board[position] == '') {
                
                    board[position] = aiMarker
                    score = minmax(board, false)
                    board[position] = ''
                    moveList.push({position, score})
                }
            }

            return moveList.sort(() => Math.random() - 0.5).sort((a, b) => b.score - a.score)[0].score    

        } else {
            let score = Infinity
            for (let position = 0; position < 9; position++){
                if (board[position] == '') {

                    board[position] = playerMarker
                    score = minmax(board, true)
                    board[position] = ''
                    moveList.push({position, score})
                }
            }

            return moveList.sort(() => Math.random() - 0.5).sort((a, b) => a.score - b.score)[0].score    

        }
    }



    return {
        board,
        getBoard,
        getMarker,        
        play,
        checkWinner,
        aiMove,
        flush
    }
})();

const render = (game) => {
    
    let boardFrame = document.querySelector('.gameboard')
    boardFrame.style.display = 'grid'
    boardFrame.innerHTML = ''
    game.board.forEach((item, index) => {
        let area = document.createElement('div')
        area.classList.add('area')
        area.id = 'area-' + index
        boardFrame.append(area)
        area.addEventListener('click', () => {
            if (makeMove(index)) {
                if (game.checkWinner() === false) {
                    document.getElementById('popup-transparent').style.display = 'flex';
                    setTimeout(() => makeMove(game.aiMove()), 1000);
                    setTimeout(() => document.getElementById('popup-transparent').style.display = 'none', 1000);
                }
            }
           // 

        })
    });

    function restart(game) {

        document.querySelector('.popup').style.display = 'none'

        game.flush()
        game.getBoard().forEach((item, index) =>{
            let area = document.getElementById(`area-${index}`)
            area.classList.remove('area-clicked')
            area.textContent = game.getBoard()[index]
        })
    }

    function makeMove(index) {

          let area = document.getElementById(`area-${index}`)
          if (game.board[index] == '') {

              area.textContent = game.getMarker()
              game.play(index)
              area.classList.add('area-clicked')

              if (game.checkWinner() == true || game.checkWinner() == 'tie') declareWinner()
              return true
          } else return false
         
    }


    function declareWinner() {
        let message = 'It\'s a Tie!'

        if (game.checkWinner() === true) {
            message = (game.getMarker() == 'X') ? 'O' : 'X'
            message += ' is the Winner!'
        }

        document.querySelector('.popup-text').textContent = message
        document.querySelector('.popup').style.display = 'flex'

        document.getElementById('restart-game').addEventListener('click', () => {
            game.flush()
            restart(game)
        })
        
    }
    

    document.getElementById('start-game').addEventListener('click', () => {
        makeMove(game.aiMove())

              
    })
    
};


tttGame.flush()
render(tttGame)



