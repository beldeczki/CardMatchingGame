const cardsImgs = ["angular.png", "d3.png", "evista.png", "jenkins.png", "postcss.png", "react.png", "redux.png", "sass.png", "ts.png", "webpack.png"]

let gameArea = document.getElementById("gameArea")
let deckSize = document.getElementById("deckSize")
let cards = null
let cardsPlaced = null
let cardImg = null
let cardsImgsCopy = null
let cardFlipped_first_i = null
let cardFlipped_second_i = null
let secondFlipInProgress = false
let playerTries = 0
let hideTimeout = null

function newGame() {
    cards = Number(deckSize.value)
    cardsPlaced = new Array(cards)
    cardImg = null
    cardsImgsCopy = [...cardsImgs];
    cardFlipped_first_i = null
    cardFlipped_second_i = null
    secondFlipInProgress = false
    playerTries = 0

    clearTimeout(hideTimeout)

    for(let i = 0; i < cards; i++) {
        let cardImg_i = null
    
        if(i % 2 === 0) {
            do {
                cardImg_i = Math.floor(Math.random() * cardsImgsCopy.length)
            } while(cardsImgsCopy[cardImg_i] == null)
    
            cardImg = cardsImgsCopy[cardImg_i]
            cardsImgsCopy[cardImg_i] = null
        }
    
        let slot = null
    
        do {
            slot = Math.floor(Math.random() * cards)
        } while(cardsPlaced[slot] != undefined)
    
        cardsPlaced[slot] = cardImg
    }

    gameArea.innerHTML = ""
    
    for(let i = 0; i < cards; i++) {
        let card = "<div class=\"col\"><div onclick=\"flipCard(" + i + ")\" class=\"card text-center\" style=\"width: 7rem; height: 7rem;\"><div class=\"card-body\"><img id=\"" + i + "\" src=\"cards/" + cardsPlaced[i] + "\" class=\"card-img-top\" hidden></div></div></div>"
        gameArea.innerHTML += card
    
        if(i + 1 === cards)
            break;
    }
}

function flipCard(i) {
    if(cardsPlaced[i] == null || secondFlipInProgress)
        return

    let card = document.getElementById(i)
    card.removeAttribute("hidden")

    if(cardFlipped_first_i == null) {
        cardFlipped_first_i = i
        return
    } else {
        cardFlipped_second_i = i

        if(cardFlipped_first_i === cardFlipped_second_i) {
            cardFlipped_second_i = null
            return
        }

        secondFlipInProgress = true
    }

    playerTries++
    console.log(playerTries)

    let firstCard = document.getElementById(cardFlipped_first_i)
    let secondCard = document.getElementById(cardFlipped_second_i)

    if(cardsPlaced[cardFlipped_first_i] === cardsPlaced[cardFlipped_second_i]) {
        cardsPlaced[cardFlipped_first_i] = null
        cardsPlaced[cardFlipped_second_i] = null

        secondFlipInProgress = false

        console.log("new pair")

        firstCard.setAttribute("style", "opacity: 0.5;")
        secondCard.setAttribute("style", "opacity: 0.5;")
    } else {
        hideTimeout = setTimeout(function() {
            firstCard.setAttribute("hidden", "true")
            secondCard.setAttribute("hidden", "true")

            secondFlipInProgress = false
        }, 1000)
    }

    cardFlipped_first_i = null
    cardFlipped_second_i = null
}