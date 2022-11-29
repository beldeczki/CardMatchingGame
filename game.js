const cardsImgs = ["angular.png", "d3.png", "evista.png", "jenkins.png", "postcss.png", "react.png", "redux.png", "sass.png", "ts.png", "webpack.png"]

let cards = 20
let cardsPlaced = new Array(cards)
let gameArea = document.getElementById("gameArea")
let cardImg = null
let cardsImgsCopy = [...cardsImgs];

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

for(let i = 0; i < cards; i++) {
    let card = "<div class=\"col\"><div onclick=\"flipCard(" + i + ")\" class=\"card text-center h-100\" style=\"width: 7rem;\"><div class=\"card-body\"><img id=\"" + i + "\" src=\"cards/" + cardsPlaced[i] + "\" class=\"card-img-top\" style=\"width: 5rem;\" hidden></div></div></div>"
    gameArea.innerHTML += card

    if(i + 1 === cards)
        break;
}

let cardFlipped_first_i = null
let cardFlipped_second_i = null
let secondFlipInProgress = false

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

    if(cardsPlaced[cardFlipped_first_i] === cardsPlaced[cardFlipped_second_i]) {
        cardsPlaced[cardFlipped_first_i] = null
        cardsPlaced[cardFlipped_second_i] = null

        secondFlipInProgress = false
        cardFlipped_first_i = null
        cardFlipped_second_i = null

        console.log("new pair")
    } else {
        setTimeout(function() {
            card = document.getElementById(cardFlipped_first_i)
            card.setAttribute("hidden", "true")
            card = document.getElementById(cardFlipped_second_i)
            card.setAttribute("hidden", "true")

            secondFlipInProgress = false
            cardFlipped_first_i = null
            cardFlipped_second_i = null
        }, 1000)

    }
}