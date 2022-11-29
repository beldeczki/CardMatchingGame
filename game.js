const cardsImgs = ["angular.png", "d3.png", "evista.png", "jenkins.png", "postcss.png", "react.png", "redux.png", "sass.png", "ts.png", "webpack.png"]

let gameArea = document.getElementById("gameArea")
let deckSize = document.getElementById("deckSize")
let deckSizeLanding = document.getElementById("deckSizeLanding")
let menu = document.getElementById("menu")
let landingPage = document.getElementById("landingPage")
let triesCounterHTML = document.getElementById("triesCounter")
let bestScoreHTML = document.getElementById("bestScore")
let gameContainer = document.getElementById("gameContainer")

let cards = null
let cardsPlaced = null
let cardsPlacedOriginal = null
let cardImg = null
let cardsImgsCopy = null
let cardFlipped_first_i = null
let cardFlipped_second_i = null
let secondFlipInProgress = false
let triesCounter = 0
let hideTimeout = null
let bestScore = 0

function newGame() {
    if(menu.hasAttribute("hidden")) {
        menu.removeAttribute("hidden")
        landingPage.setAttribute("hidden", "")
        gameContainer.removeAttribute("hidden")
        cards = Number(deckSizeLanding.value)
    } else {
        cards = Number(deckSize.value)
    }

    cardsPlaced = new Array(cards)
    cardImg = null
    cardsImgsCopy = [...cardsImgs]
    cardFlipped_first_i = null
    cardFlipped_second_i = null
    secondFlipInProgress = false
    triesCounter = 0
    triesCounterHTML.innerText = triesCounter

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

    cardsPlacedOriginal = [...cardsPlaced]    
    drawCards()
}

function restartGame() {
    cardsPlaced = [...cardsPlacedOriginal]
    cardFlipped_first_i = null
    cardFlipped_second_i = null
    secondFlipInProgress = false
    triesCounter = 0
    triesCounterHTML.innerText = triesCounter

    clearTimeout(hideTimeout)
    drawCards()
}

function drawCards() {
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

    triesCounter++
    triesCounterHTML.innerText = triesCounter

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