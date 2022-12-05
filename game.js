const cardsImgs = ["angular.png", "d3.png", "evista.png", "jenkins.png", "postcss.png", "react.png", "redux.png", "sass.png", "ts.png", "webpack.png"]

let gameArea = document.getElementById("gameArea")
let deckSize = document.getElementById("deckSize")
let deckSizeLanding = document.getElementById("deckSizeLanding")
let menu = document.getElementById("menu")
let landingPage = document.getElementById("landingPage")
let triesCounterHTML = document.getElementById("triesCounter")
let bestScoreHTML = document.getElementById("bestScore")
let gameContainer = document.getElementById("gameContainer")
let resumeButton = document.getElementById("resumeButton")

let cards = null
let cardsPlaced = null
let cardsPlacedOriginal = null
let cardImg = null
let cardsImgsCopy = null
let cardFlipped_first_i = null
let cardFlipped_second_i = null
let timeoutInProgress = false
let triesCounter = 0
let hideTimeout = null
let pairsFound = 0

function resetVars() {
    cardFlipped_first_i = null
    cardFlipped_second_i = null
    timeoutInProgress = false
    triesCounter = 0
    triesCounterHTML.innerText = triesCounter
    pairsFound = 0
}

if(localStorage.getItem("cardsPlaced") != null) {
    resumeButton.removeAttribute("disabled")
}

function resumeGame() {
    cardsPlacedOriginal = localStorage.getItem("cardsPlacedOriginal").split(",")
    cardsPlaced = cardsPlacedOriginal
    cards = cardsPlaced.length
    drawCards()
    cardsPlaced = localStorage.getItem("cardsPlaced").split(",")

    for(let i = 0; i < cardsPlaced.length; i++) {
        if(cardsPlaced[i] === "flipped") {
            pairsFound++
            let card = document.getElementById(i)
            card.removeAttribute("hidden")
            card.setAttribute("style", "opacity: 0.5;")
        }
    }

    menu.removeAttribute("hidden")
    landingPage.setAttribute("hidden", "")
    gameContainer.removeAttribute("hidden")
    deckSize.value = cards
    pairsFound /= 2

    if(Number(localStorage.getItem("best" + cards)) === 999999)
        bestScoreHTML.innerText = "-"
    else
        bestScoreHTML.innerText = Number(localStorage.getItem("best" + cards))

    triesCounter = Number(localStorage.getItem("triesCounter"))
    triesCounterHTML.innerText = triesCounter
}

function newGame() {
    if(menu.hasAttribute("hidden")) {
        menu.removeAttribute("hidden")
        landingPage.setAttribute("hidden", "")
        gameContainer.removeAttribute("hidden")
        cards = Number(deckSizeLanding.value)
        deckSize.value = cards
    } else {
        cards = Number(deckSize.value)
    }

    cardsPlaced = new Array(cards)
    cardImg = null
    cardsImgsCopy = [...cardsImgs]
    resetVars()

    let bestScore = localStorage.getItem("best" + cards)
    if(bestScore == null)
        localStorage.setItem("best" + cards, 999999)
    else if(Number(bestScore) === 999999)
        bestScoreHTML.innerText = "-"
    else
        bestScoreHTML.innerText = bestScore

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
    localStorage.setItem("cardsPlaced", cardsPlaced)
    localStorage.setItem("cardsPlacedOriginal", cardsPlacedOriginal)
    localStorage.setItem("triesCounter", triesCounter)
    drawCards()
}

function restartGame() {
    cardsPlaced = [...cardsPlacedOriginal]
    resetVars()
    localStorage.setItem("cardsPlaced", cardsPlaced)
    localStorage.setItem("cardsPlacedOriginal", cardsPlacedOriginal)
    localStorage.setItem("triesCounter", triesCounter)

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
    if(cardsPlaced[i] == "flipped" || timeoutInProgress)
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
    }

    triesCounter++
    triesCounterHTML.innerText = triesCounter
    localStorage.setItem("triesCounter", triesCounter)

    let firstCard = document.getElementById(cardFlipped_first_i)
    let secondCard = document.getElementById(cardFlipped_second_i)

    if(cardsPlaced[cardFlipped_first_i] === cardsPlaced[cardFlipped_second_i]) {
        cardsPlaced[cardFlipped_first_i] = "flipped"
        cardsPlaced[cardFlipped_second_i] = "flipped"
        pairsFound++
        localStorage.setItem("cardsPlaced", cardsPlaced)

        if(pairsFound === cards / 2) {
            if(triesCounter < localStorage.getItem("best" + cards)) {
                localStorage.setItem("best" + cards, triesCounter)
                bestScoreHTML.innerText = triesCounter
            }

            localStorage.removeItem("cardsPlaced")
            localStorage.removeItem("cardsPlacedOriginal")
            localStorage.removeItem("triesCounter")
            
            setTimeout(function() {
                alert("Congratulations, you found all the pairs.")
            }, 50)
        }

        firstCard.setAttribute("style", "opacity: 0.5;")
        secondCard.setAttribute("style", "opacity: 0.5;")
    } else {
        timeoutInProgress = true
        hideTimeout = setTimeout(function() {
            firstCard.setAttribute("hidden", "")
            secondCard.setAttribute("hidden", "")

            timeoutInProgress = false
        }, 1000)
    }

    cardFlipped_first_i = null
    cardFlipped_second_i = null
}
