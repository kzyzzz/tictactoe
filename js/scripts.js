const tttGame = ([...board], marker) => {

    this.board = board
    this.marker = marker

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
            // console.log(`Play(${index} -> ${marker})`,index, board, checkWinner())
            if (marker == 'X') {
                marker = 'O'
            } else {
                marker = 'X'
            }
            
            return true
        }
        return false
    }
    const hasSpaces = () => {
        return board.some((item) => item = '')
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

    const declareWinner = () => {
        let message = 'It\'s a Tie!'

        if (checkWinner() === true) {
            message = (marker == 'X') ? 'O' : 'X'
            message += ' is the Winner!'
        }

        document.querySelector('.popup-text').textContent = message
        document.querySelector('.popup').style.display = 'flex'

        document.getElementById('restart-game').addEventListener('click', () => {
            gameInit()
        })
        
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

                    score = minmax(board, marker, false)

                    board[position] = ''

                    moveList.push({position, score})
                }
            }
        
        console.log(moveList)
        return moveList.sort(() => Math.random() - 0.5).sort((a, b) => b.score - a.score)[0].position

    }

    const minmax = (board, jMarker, isMaximizing) => {
        
        
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
                    score = minmax(board, marker, false)
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
                    score = minmax(board, marker, true)
                    board[position] = ''
                    moveList.push({position, score})
                }
            }

            return moveList.sort(() => Math.random() - 0.5).sort((a, b) => a.score - b.score)[0].score    

        }
    }

    const makeMove = (index) => {
      //  console.log(area, index)
        let mk = marker
        let area = document.getElementById(`area-${index}`)
        if (board[index] == '') {
          //  console.log(board[index])
            play(index)
           // console.log('play',board[index])
            area.textContent = mk
            area.classList.add('area-clicked')
            //console.log(board)
            //console.log('Winner?: ',checkWinner())
            if (checkWinner() == true || checkWinner() == 'tie') declareWinner()
        }
       
    }

    const render = () => {
    
        document.querySelector('.popup').style.display = 'none'

        let boardFrame = document.querySelector('.gameboard')
        boardFrame.style.display = 'grid'
        boardFrame.innerHTML = ''
        this.board.forEach((item, index) => {
            let area = document.createElement('div')
            area.classList.add('area')
            area.textContent = item
            area.id = 'area-' + index
            boardFrame.append(area)
            area.addEventListener('click', () => {
                makeMove(index)
                if (checkWinner() === false) {
                    document.getElementById('popup-transparent').style.display = 'flex';
                    setTimeout(() => makeMove(aiMove()), 1000);
                    setTimeout(() => document.getElementById('popup-transparent').style.display = 'none', 1000);
                }
                
               // 

            })
        });

        document.getElementById('start-game').addEventListener('click', () => {
            makeMove(aiMove())

                  
        });
        
    };

    return {
        board,
        render,
        getBoard,
        getMarker,        
        play,
        checkWinner,
        hasSpaces,
        aiMove,
        makeMove
    }
}

const Player = (name, marker) => {
    this.name = name;
    this.marker = marker;
    return {name, marker};
}

function gameInit() {
    let gameboard = ['', '', '', '', '', '', '', '', '']
    let game = tttGame(gameboard, 'X')
    game.render()
}

gameInit()


