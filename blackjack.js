/*
player:
    hit - take another card
    stand/stay - take no more cards
    double down - increase initial bet by 100% and take one more card. the additional bet is placed next to the original bet.
    split - create two hands from a starting hand where both cards have the same value. each new hand gets a second card resulting in two starting hands. this requires an additional bet on the second hand. the two hands are played out independently, and the wager on each hand is won or lost independently.
    surrender - forfeit half the bet and end the hand immediately. not allowed after splitting.
*/


const SUITS = ["Hearts", "Diamonds", "Spades", "Clubs"];
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Ace", "Jack", "Queen", "King"];


class Chip {
    constructor(parent=null, position=null) {
        let chip = document.createElement("div");

        this.getChip = function() {
            return chip;
        };

        this.changeChipPosition = function(position=null) {

        };
    }
}


class Card {
    constructor(cardSuit, cardRank, parent=null, position=null) {
        let card = document.createElement("div");
        card.className = "card";

        let suit = cardSuit;
        let rank = cardRank;

        this.getCard = function() {
            return card;
        };

        this.getSuit = function() {
            return suit;
        };

        this.getRank = function() {
            return rank;
        };

        this.changeCardPosition = function(position=null) {

        };
    }
}


class Deck {
    constructor() {
        let deck = [];

        this.getDeck = function() {
            return deck;
        };

        this.changeDeckPosition = function(position=null) {

        };
    }
}


class Hand {
    constructor() {
        let hand = [];

        this.getHand = function() {
            return hand;
        };
    }
}


class Player extends Hand {
    constructor() {
        let chips = [];

        this.hit = function() {

        };

        this.stand = function() {

        };

        this.doubleDown = function() {

        };

        this.split = function() {

        };

        this.fold = function() {

        };
    }
}


class Dealer {
    constructor() {


        this.deal = function(player=null) {
            
        };
    }
}

let card = document.getElementById("dealer-card");
console.log(card.getBoundingClientRect());
