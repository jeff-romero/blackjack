
const SUITS = ["hearts", "diamonds", "spades", "clubs"];
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "ace", "jack", "queen", "king"];
const PLAYER_HAND_ID = "player-hand";
const DEALER_HAND_ID = "dealer-hand";
const SPLIT_HAND_ID = "split-hand";
const FACE_DOWN = "face-down";
const STARTING_CHIPS = 100;
const MAX_CHIPS = 999999999999;
const MAX_CHIP_VAL = 500;
const MIN_SHUFFLES = 3;
const MIN_BET = 1;
const WIN_THRESHOLD = 21;
const HARD_STAND_THRESHOLD = 17;
const ACE_HIGH = 11;
const ACE_LOW = 1;
const DEFAULT_CHECK_INTERVAL = 100;


class Pot {
    constructor() {
        let total = 0;

        this.getTotal = function() {
            return total;
        };

        this.add = function(value=0) {
            if (value <= 0 || value > MAX_CHIP_VAL || (total + value) > MAX_CHIPS) {
                return false;
            }

            total += value;

            return true;
        };

        this.subtract = function(value=0) {
            if (value <= 0 || value > MAX_CHIP_VAL || (total - value) < 0) {
                return false;
            }

            total -= value;

            return true;
        };
    }
}


class Card {
    constructor(suit, rank) {
        // used to get the className
        const RANK_MAP = {
            "2": "two",
            "3": "three",
            "4": "four",
            "5": "five",
            "6": "six",
            "7": "seven",
            "8": "eight",
            "9": "nine",
            "10": "ten",
            "ace": "ace",
            "jack": "jack",
            "queen": "queen",
            "king": "king"
        };
        const VALUE_MAP = {
            "2": 2,
            "3": 3,
            "4": 4,
            "5": 5,
            "6": 6,
            "7": 7,
            "8": 8,
            "9": 9,
            "10": 10,
            "ace": ACE_LOW,
            "jack": 10,
            "queen": 10,
            "king": 10
        };

        let s = suit;
        let r = rank;

        this.getCard = function() {
            return this;
        };

        this.getSuit = function() {
            return s;
        };

        this.getRank = function() {
            return r;
        };

        this.getValue = function() {
            return VALUE_MAP[this.getRank()];
        };

        this.cardString = function() {
            return this.getRank() + " of " + this.getSuit();
        };

        this.printCard = function() {
            console.log(this.getRank() + " of " + this.getSuit());
        };

        this.getClassName = function() {
            let cName = "";

            cName = RANK_MAP[this.getRank()] + "-of-" + this.getSuit();

            return cName;
        };
    }
}


class Deck {
    constructor() {
        let deck = [];

        for (let s = 0; s < SUITS.length; s++) {
            for (let r = 0; r < RANKS.length; r++) {
                let card = new Card(SUITS[s], RANKS[r]);
                deck.push(card);
            }
        }

        this.getDeck = function() {
            return deck;
        };

        this.isEmpty = function() {
            return deck.length == 0;
        };

        this.shuffleDeck = function(shuffles=1) {
            for (let _ = 0; _ < shuffles; _++) {
                // fisher-yates shuffle algorithm
                let max = deck.length - 1;
                for (let i = deck.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (max + 1));

                    let temp = deck[i];
                    deck[i] = deck[j];
                    deck[j] = temp;
                }
            }
        };

        this.printDeck = function() {
            for (let i = 0; i < deck.length; i++) {
                deck[i].printCard();
            }
        };
    }
}


class Shoe {
    constructor(decks=2) {
        let shoe = [];

        for (let _ = 0; _ < decks; _++) {
            let deck = new Deck();
            deck = deck.getDeck();

            for (let j = 0; j < deck.length; j++) {
                shoe.push(deck[j]);
            }
        }

        this.getShoe = function() {
            return shoe;
        };

        this.isEmpty = function() {
            return shoe.length == 0;
        };

        this.shuffleShoe = function(shuffles=1) {
            for (let _ = 0; _ < shuffles; _++) {
                // fisher-yates shuffle algorithm
                let max = shoe.length - 1;
                for (let i = shoe.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (max + 1));

                    let temp = shoe[i];
                    shoe[i] = shoe[j];
                    shoe[j] = temp;
                }
            }
        };

        this.drawCard = function() {
            if (this.isEmpty()) {
                return false;
            }

            return shoe.shift();
        };

        this.printShoe = function() {
            for (let i = 0; i < shoe.length; i++) {
                shoe[i].printCard();
            }
        };
    }
}


class Hand {
    constructor() {
        let hand = [];
        let standing = false;

        this.getHand = function() {
            return hand;
        };

        this.getHandTotal = function() {
            let total = 0;
            let aces = 0;

            for (let i = 0; i < hand.length; i++) {
                let card = hand[i];
                let value = card.getValue();

                // add aces to total later
                if (value == ACE_LOW) {
                    aces++;
                    continue;
                }
                total += value;
            }

            // add aces to total
            total += (aces * ACE_HIGH);

            while (aces > 0) {
                if (total > WIN_THRESHOLD) {
                    // convert to ace low
                    total -= (ACE_HIGH - 1);
                }
                aces--;
            }

            return total;
        };

        this.printHandTotal = function() {
            console.log("total: ", this.getHandTotal());
        };

        this.isBust = function() {
            return (this.getHandTotal() > WIN_THRESHOLD);
        };

        this.isStanding = function() {
            return standing;
        };

        this.unstand = function() {
            if (standing) {
                standing = false;
            }
        };

        this.stand = function() {
            // take no more cards during turn

            // asking for player bet after split
            if (hand.length <= 1) {
                return false;
            }
            else if (!standing) {
                console.log("standing");
                standing = true;
            }
            return true;
        };

        this.clearHand = function() {
            while (hand.length > 0) {
                hand.pop();
            }
        };

        this.isEmpty = function() {
            return hand.length == 0;
        };

        this.printHand = function() {
            console.log("printing hand:");
            for (let i = 0; i < hand.length; i++) {
                hand[i].printCard();
            }
        };
    }
}


class Player {
    /*
    player:
        hit - take another card
        stand/stay - take no more cards
        double down - increase initial bet by 100% and take one more card. the additional bet is placed next to the original bet.
        split - create two hands from a starting hand where both cards have the same value. each new hand gets a second card resulting in two starting hands. this requires an additional bet on the second hand. the two hands are played out independently, and the wager on each hand is won or lost independently.
        surrender - forfeit half the bet and end the hand immediately. not allowed after splitting.
    */
    constructor() {
        let hand = new Hand();
        let pot = new Pot();
        let splitHand = undefined;
        let splitPot = undefined;

        let currentHand = hand;
        let currentPot = pot;

        let total = STARTING_CHIPS;
        let chips = document.getElementById("player-chips");
        chips.innerText = total;
        let folded = false;

        this.useMainPot = function() {
            currentPot = pot;
        };

        this.useSplitPot = function() {
            currentPot = splitPot;
        };

        this.useMainHand = function() {
            currentHand = hand;
        };

        this.useSplitHand = function() {
            currentHand = splitHand;
        };

        this.getHand = function() {
            return currentHand;
        };

        this.getHandArr = function() {
            return currentHand.getHand();
        };

        this.getMainHand = function() {
            return hand;
        };

        this.getMainHandArr = function() {
            return hand.getHand();
        };

        this.getSplitHand = function() {
            return (splitHand !== undefined) ? splitHand : undefined;
        };

        this.getSplitHandArr = function() {
            return (splitHand !== undefined) ? splitHand.getHand() : [];
        };

        this.getPot = function() {
            return currentPot;
        };

        this.getMainPot = function() {
            return pot;
        };

        this.getSplitPot = function() {
            return splitPot;
        };

        this.getChips = function() {
            return total;
        };

        this.getHandTotal = function() {
            return currentHand.getHandTotal();
        };

        this.printHandTotal = function() {
            console.log("player hand total: ", currentHand.getHandTotal());
        };

        this.addChips = function(value=0) {
            if (value <= 0 || value > MAX_CHIP_VAL || (total + value) > MAX_CHIPS) {
                return false;
            }

            total += value;

            return true;
        };

        this.subtractChips = function(value=0) {
            if (value <= 0 || value > MAX_CHIP_VAL || (total - value) < 0) {
                return false;
            }

            total -= value;

            return true;
        };

        this.hit = function() {
            if (!playerTurn) {
                return false;
            }

            let drawnCard = shoe.drawCard();
            this.getHandArr().push(drawnCard);

            return true;
        };

        this.doubleDown = function() {
            if (!playerTurn) {
                return false;
            }

            /*
            increase initial bet by 100% and take one more card. the additional bet is placed next to the original bet.
            */
            let currentBet = this.getPot().getTotal();

            if (!dealer.takeChips(currentBet)) {
                return false;
            }

            this.hit();

            return true;
        };

        this.split = function() {
            /**
             * this.getMainHandArr() == 1
             * means the array was just split and is waiting for a new player bet on
             * the second hand
             * 
             * (splitHand !== undefined && splitHand.getHand().length == 2)
             * means the player has already split, bet, and is currently working on the main hand
             */
            if (!playerTurn || this.getMainHandArr().length > 2 || this.getMainHandArr().length == 1 || (splitHand !== undefined && splitHand.getHand().length == 2)) {
                console.log("cannot split");
                return false;
            }
            else if (total < MIN_BET) {
                // TODO: implement visual notification that player cannot split
                console.log("player cannot split due to insufficient funds!");
                return false;
            }
            console.log("splitting");
            /*
            split can only happen with the initial 2 card hand,
            so the index hard code is okay
            */
            let hand = this.getMainHandArr();
            if (hand[0].getRank() != hand[1].getRank()) {
                return false;
            }

            splitHand = new Hand();
            splitPot = new Pot();

            let secondCard = hand.pop();
            splitHand.getHand().push(secondCard);
            console.log("main hand after splitting:");
            hand[0].printCard();
            console.log("split hand after splitting:");
            splitHand.getHand()[0].printCard();

            return true;
        };

        this.hasFolded = function() {
            if (folded) {
                return true;
            }

            return false;
        };

        this.unfold = function() {
            if (folded) {
                folded = false;
            }
        };

        this.fold = function() {
            /**
             * forfeit all cards to the dealer and lose the bet.
             * cannot fold if player has a split hand, must play it out.
             */
            if (!playerTurn || this.getHand().length == 0 || (this.getSplitHand() === undefined && this.getSplitHandArr().length > 0)) {
                return false;
            }

            console.log("folding");
            this.getMainHand().clearHand();

            let pot = this.getMainPot();
            pot.subtract(pot.getTotal());
            folded = true;

            return true;
        };

        this.removePlayerChipBtns = (condition, ms=DEFAULT_CHECK_INTERVAL) => {
            let playerChips = document.getElementById("chip-button-wrapper");

            setTimeout(() => {
                playerChips.style.display = "none";
            }, 1000);

            return new Promise((resolve, reject) => {
                let checkCondition = setInterval(() => {
                    if (!condition()) {
                        return;
                    }
                    clearInterval(checkCondition);
                    resolve("removed player chip buttons");
                }, ms);
            });
        };

        this.addPlayerActionBtns = function() {
            let playerActions = document.getElementById("player-actions");

            playerActions.style.display = "flex";
            playerActions.style.animationPlayState = "running";
        };

        this.removeAllInBtn = function() {
            allIn.style.animationPlayState = "running";
            setTimeout(() => {
                allIn.style.display = "none"
            }, 500);
        };

        this.deal = async () => {
            /**
             * !roundStarted && didBet
             * means cleanup has occurred, so player can't intervene
             */
            if ((roundStarted && didBet) || (!roundStarted && didBet) || this.getPot().getTotal() < MIN_BET) {
                return false;
            }

            roundStarted = true;
            didBet = true;

            return true;
        };

        this.action = (callback) => {
            if (!roundStarted) {
                console.log("round hasn't started!");
                return false;
            }
            else if (!playerTurn) {
                console.log("not player turn!");
                return false;
            }
            else if (!callback) {
                console.log("callback failure");
                return false;
            }

            console.log("callback success");

            playerTurn = false;
            dealerTurn = true;

            return true;
        };

        this.cleanup = function() {
            splitHand = undefined;
            splitPot = undefined;
        };
    }
}


class Dealer {
    constructor() {
        let hand = new Hand();

        this.getHand = function() {
            return hand;
        };

        this.getHandArr = function() {
            return hand.getHand();
        };

        this.getHandTotal = function() {
            return hand.getHandTotal();
        };

        this.flipCard = function(hand=this.getHandArr(), index=0) {
            hand[index].classList.remove(FACE_DOWN);
        };

        this.dealSelf = function() {
            let drawnCard = shoe.drawCard();

            this.getHandArr().push(drawnCard);
            updateDealerHand();
            counters.updateTotals();

            dealerTurn = false;
            playerTurn = true;

            return true;
        };

        this.getPlayerChips = function() {
            return player.getChips();
        };

        this.takeChips = function(value=0, pot=player.getPot()) {
            if (!player.subtractChips(value) || !pot.add(value)) {
                console.log("dealer couldn't take chips");
                return false;
            }

            return true;
        };

        this.giveChips = function(value=0) {
            if (!player.addChips(value)) {
                return false;
            }

            return true;
        };

        this.printHandTotal = function() {
            console.log("dealer hand total: ", this.getHandTotal());
        };
    }
}


class Chip {
    constructor(element) {
        const CHIP_COLORS = {
            "1": {
                "mouseover": "lightgrey",
                "mouseleave": "white",
                "mousedown": "darkgrey",
                "mouseup": "lightgrey",
                "touchstart": "darkgrey",
                "touchend": "white"
            },
            "5": {
                "mouseover": "#8b1e22",
                "mouseleave": "#c12e34",
                "mousedown": "#69171a",
                "mouseup": "#8b1e22",
                "touchstart": "#69171a",
                "touchend": "#c12e34"
            },
            "25": {
                "mouseover": "#287e39",
                "mouseleave": "#319845",
                "mousedown": "#1f5f2b",
                "mouseup": "#287e39",
                "touchstart": "#1f5f2b",
                "touchend": "#319845"
            },
            "100": {
                "mouseover": "#2b4472",
                "mouseleave": "#3b5b98",
                "mousedown": "#22365a",
                "mouseup": "#2b4472",
                "touchstart": "#22365a",
                "touchend": "#3b5b98"
            },
            "500": {
                "mouseover": "#202020",
                "mouseleave": "#303030",
                "mousedown": "#000000",
                "mouseup": "#202020",
                "touchstart": "#000000",
                "touchend": "#303030"
            }
        };
        const CHIP_VALUES = {
            "1": 1,
            "5": 5,
            "25": 25,
            "100": 100,
            "500": 500
        };

        // let chip1 = document.getElementById("chip-1");
        // let chip5 = document.getElementById("chip-5");
        // let chip25 = document.getElementById("chip-25");
        // let chip100 = document.getElementById("chip-100");
        // let chip500 = document.getElementById("chip-500");

        // let chipButtons = [
        //     chip1,
        //     chip5,
        //     chip25,
        //     chip100,
        //     chip500
        // ];

        let chip = element;
        let chipText = "" + chip.innerText;
        let value = CHIP_VALUES[chipText];

        chip.addEventListener("mouseover", (e) => {
            e.target.style.backgroundColor = "" + CHIP_COLORS[chipText]["mouseover"];
        });
        chip.addEventListener("mouseleave", (e) => {
            e.target.style.backgroundColor = CHIP_COLORS[chipText]["mouseleave"];
        });
        chip.addEventListener("mousedown", (e) => {
            e.target.style.backgroundColor = CHIP_COLORS[chipText]["mousedown"];
        });
        chip.addEventListener("mouseup", (e) => {
            e.target.style.backgroundColor = CHIP_COLORS[chipText]["mouseup"];
        });

        chip.addEventListener("click", (e) => {
            /**
             * !roundStarted && didBet
             * means cleanup has occurred, so player can't intervene
             */
            if ((roundStarted && didBet) || (!roundStarted && didBet) || !dealer.takeChips(value, player.getPot())) {
                console.log("couldn't take player chips");
                return;
            }

            counters.updateTotals();
        });

        this.getChipElement = function() {
            return chip;
        };

        this.getChip = function() {
            return this;
        };

        this.getValue = function() {
            return value;
        };

        this.toggleAnimation = function() {
            if (getComputedStyle(chip).animationPlayState == "running") {
                chip.style.animationPlayState = "paused";
            }
            else {
                chip.style.animationPlayState = "running";
            }
        };
    }
}


class PlayerButtons {
    constructor() {
        const ACTION_BTN_COLORS = {
            "mouseover": "radial-gradient(rgb(200, 200, 0), rgb(200, 130, 0), rgb(200, 0, 0))",
            "mouseleave": "radial-gradient(rgb(255, 255, 0), rgb(255, 165, 0), rgb(255, 0, 0))",
            "mousedown": "radial-gradient(rgb(150, 150, 0), rgb(150, 97, 0), rgb(150, 0, 0))",
            "mouseup": "radial-gradient(rgb(200, 200, 0), rgb(200, 130, 0), rgb(200, 0, 0))",
            "touchstart": "radial-gradient(rgb(150, 150, 0), rgb(150, 97, 0), rgb(150, 0, 0))",
            "touchend": "radial-gradient(rgb(255, 255, 0), rgb(255, 165, 0), rgb(255, 0, 0))"
        };

        let chip1 = new Chip(document.getElementById("chip-1"));
        let chip5 = new Chip(document.getElementById("chip-5"));
        let chip25 = new Chip(document.getElementById("chip-25"));
        let chip100 = new Chip(document.getElementById("chip-100"));
        let chip500 = new Chip(document.getElementById("chip-500"));

        let hit = document.getElementById("hit");
        let stand = document.getElementById("stand");
        let doubleDown = document.getElementById("double-down");
        let split = document.getElementById("split");
        let fold = document.getElementById("fold");
        let allIn = document.getElementById("all-in");
        let deal = document.getElementById("deal");
        let reset = document.getElementById("reset");
        let playAgain = document.getElementById("play-again");
        let cashout = document.getElementById("cashout");

        let chipButtons = [
            chip1,
            chip5,
            chip25,
            chip100,
            chip500
        ];

        let actionButtons = [
            hit,
            stand,
            doubleDown,
            split,
            fold,
            allIn,
            deal,
            reset,
            playAgain,
            cashout
        ];

        for (let i = 0; i < actionButtons.length; i++) {
            let btn = actionButtons[i];

            btn.addEventListener("mouseover", (e) => {
                (e.target).style.backgroundImage = ACTION_BTN_COLORS["mouseover"];
            });
            btn.addEventListener("mouseleave", (e) => {
                (e.target).style.backgroundImage = ACTION_BTN_COLORS["mouseleave"];
            });
            btn.addEventListener("mousedown", (e) => {
                (e.target).style.backgroundImage = ACTION_BTN_COLORS["mousedown"];
            });
            btn.addEventListener("mouseup", (e) => {
                (e.target).style.backgroundImage = ACTION_BTN_COLORS["mouseup"];
            });
            btn.addEventListener("touchstart", (e) => {
                (e.target).style.backgroundImage = ACTION_BTN_COLORS["touchstart"];
            });
            btn.addEventListener("touchend", (e) => {
                (e.target).style.backgroundImage = ACTION_BTN_COLORS["touchend"];
            })
        }

        allIn.addEventListener("click", () => {
            /**
             * !roundStarted && didBet
             * means cleanup has occurred, so player can't intervene
             */
            if ((roundStarted && didBet) || (!roundStarted && didBet) || !dealer.takeChips(player.getChips(), player.getPot())) {
                return;
            }

            counters.updateTotals();
            player.deal();
        });

        this.printChipButtons = function() {
            for (let i = 0; i < chipButtons.length; i++) {
                chipButtons[i].toggleAnimation();
            }
        };
    }
}


class Settings {
    constructor() {

    }
}


class Counters {
    constructor(dealer=null, player=null, shoe=null) {
        // objects
        this.dealer = dealer;
        this.player = player;
        this.pot = this.player.getPot();
        // TODO: prob delete
        this.splitPot = this.player.getSplitPot();
        this.shoe = shoe;

        // elements
        this.playerChipCounter = document.getElementById("player-chips");
        this.potCounter = document.getElementById("pot");
        this.splitPotWrapper = document.getElementById("split-pot-wrapper");
        this.splitPotCounter = document.getElementById("split-pot");
        this.shoeCounter = document.getElementById("shoe-counter");

        this.updateTotals();
    }

    toggleSplitPotCounter() {
        if (this.splitPotWrapper.style.display == "none") {
            this.splitPotWrapper.style.display = "flex";
        }
        else {
            this.splitPotWrapper.style.display = "none";
        }
    }

    updateDealerTotals() {
        // TODO: implement dealer total counter
    }

    updatePlayerTotals() {
        this.playerChipCounter.innerText = this.player.getChips();
        this.potCounter.innerText = this.pot.getTotal();

        if (this.player.getSplitPot() !== undefined) {
            console.log("updating split pot counter");
            this.splitPotCounter.innerText = this.player.getSplitPot().getTotal();
        }
    }

    updateShoeCounter() {
        if (this.shoe === undefined || this.shoe == null) {
            return false;
        }

        this.shoeCounter.innerText = this.shoe.getShoe().length;
        return true;
    }

    updateTotals() {
        this.updateDealerTotals();
        this.updatePlayerTotals();
        this.updateShoeCounter();
    }
}


class Node {
    constructor(data=undefined) {
        this.dta = data;
        this.nxt = null;
    }

    get data() {
        return this.dta;
    }

    get next() {
        return this.next;
    }

    set data(data=undefined) {
        this.dta = data;
    }

    set next(next=null) {
        this.nxt = next;
    }

    hasNext() {
        return this.next != null;
    }
}


class Log {
    constructor() {
        this.root = null;
    }

    get firstLog() {
        return this.root;
    }

    log(message="") {
        if (typeof message !== "string" || !(message instanceof String)) {
            return;
        }

        if (this.root == null) {
            this.root = new Node(message);
        }
        else {
            let newNode = new Node(message);
            newNode.next = this.root;
        }
    }
}


function getCardXCoordinate(e) {
    if (e === undefined) {
        return;
    }

    console.log(e.getBoundingClientRect());
    return e.getBoundingClientRect().x;
}

function fanHand(handWrapper) {
    if (handWrapper === undefined) {
        return;
    }

    let startX = getCardXCoordinate(handWrapper.children[0]);
    console.log(startX);
    let offsetX = 0;
}

function createVisualCard(card) {
    let cName = card.getClassName();
    let cardWrapper = document.createElement("div");
    cardWrapper.className = "card";

    let viCard = document.createElement("img");
    viCard.className = cName;
    let rank = card.getRank();
    let suit = card.getSuit();
    viCard.src = "assets/images/" + suit + "/" + rank + "-of-" + suit + ".png";

    cardWrapper.appendChild(viCard);

    return cardWrapper;
}

function updateHand(handId=PLAYER_HAND_ID) {
    let handWrapper = document.getElementById(handId);

    while (handWrapper.firstChild) {
        handWrapper.removeChild(handWrapper.firstChild);
    }

    let hand = undefined;

    if (handId == PLAYER_HAND_ID) {
        hand = player.getHandArr();
    }
    else {
        hand = dealer.getHandArr();
    }

    if (hand.length == 0) {
        return;
    }

    for (let i = 0; i < hand.length; i++) {
        let card = hand[i];

        let cardWrapper = createVisualCard(card);
        handWrapper.appendChild(cardWrapper);
    }

    // fanHand(handWrapper);
}

function updateSplitHand() {
    // TODO: put into splitHand()
    // uses different hand element, so must use a separate function instead of context switching
    let splitHandWrapper = document.getElementById(SPLIT_HAND_ID);

    if (player.getSplitHand() === undefined) {
        return;
    }
    else if (player.getSplitHandArr().length == 1) {
        splitHandWrapper.style.display = "flex";
    }

    while (splitHandWrapper.firstChild) {
        splitHandWrapper.removeChild(splitHandWrapper.firstChild);
    }

    let splitHand = player.getSplitHandArr();

    if (splitHand.length > 0) {
        for (let i = 0; i < splitHand.length; i++) {
            let card = splitHand[i];

            let cardWrapper = createVisualCard(card);
            splitHandWrapper.appendChild(cardWrapper);
        }
    }

    // fanHand(splitHandWrapper);
}

function updateDealerHand() {
    updateHand(DEALER_HAND_ID);
}

function winCheck(dealer=undefined, player=undefined) {
    if (dealer === undefined || player === undefined) {
        return;
    }

    let dealerHand = dealer.getHand();
    let playerHand = player.getHand();

    let dealerHandTotal = dealerHand.getHandTotal();
    let playerHandTotal = playerHand.getHandTotal();

    let pot = player.getPot();
    let potTotal = pot.getTotal();
    pot.subtract(potTotal);

    if (dealerHand.isBust()) {
        if (!playerHand.isBust()) {
            if (playerHandTotal == WIN_THRESHOLD) {
                // 3:2 payout (for every 2 chips, player will get 3 in return)
                let wager = potTotal;
                let halfOfWager = Math.floor(wager / 2);

                // TODO: check
                console.log("payout: ", (wager + halfOfWager));
                dealer.giveChips(wager + halfOfWager);
            }
            else {
                console.log("dealer bust so player wins!");
                // 1:1 payout
                dealer.giveChips(potTotal * 2);
            }
        }
        else {
            console.log("both dealer and player bust!");
        }
    }
    else {
        if (playerHand.isBust() || playerHandTotal < dealerHandTotal) {
            console.log("dealer wins!");
        }
        else if (playerHandTotal > dealerHandTotal) {
            if (playerHandTotal == WIN_THRESHOLD) {
                // 3:2 payout (for every 2 chips, player will get 3 in return)
                console.log("player blackjack!");
                let wager = potTotal;
                let halfOfWager = Math.floor(wager / 2);

                // TODO: check
                console.log("payout: ", (wager + halfOfWager));
                dealer.giveChips(wager + halfOfWager);
            }
            else {
                // 1:1 payout
                console.log("player has the higher hand!");
                dealer.giveChips(potTotal * 2);
            }
        }
        else if (playerHandTotal == dealerHandTotal) {
            if (playerHandTotal == WIN_THRESHOLD) {
                console.log("push with blackjack!");
                // payout 3:2
                let wager = potTotal;
                let halfOfWager = Math.floor(wager / 2);

                // TODO: check
                console.log("payout: ", (wager + halfOfWager));
                dealer.giveChips(wager + halfOfWager);
            }
            else {
                console.log("push!");
                // return player bet
                dealer.giveChips(potTotal);
            }
        }
    }
    counters.updateTotals();
}

function togglePlayAgain() {
    let playAgainPopup = document.getElementById("play-again-popup");

    if (playAgainPopup.style.display == "flex") {
        playAgainPopup.style.display = "none";
    }
    else {
        playAgainPopup.style.display = "flex";
    }
}

function playAgain() {
    gameStarted = true;
    playerDecidedOnRestart = true;
    console.log("player restarting round!");
}

function cashout() {
    gameStarted = false;
    playerDecidedOnRestart = true;
    console.log("player cashing out!");
}

let waitForAction = (condition, ms=DEFAULT_CHECK_INTERVAL) => {
    return new Promise((resolve, reject) => {
        let checkCondition = setInterval(() => {
            if (!condition()) {
                return;
            }
            clearInterval(checkCondition);
            resolve("success!");
        }, ms);
    });
};


let dealer = new Dealer();
let player = new Player();
let shoe = new Shoe(2);
let counters = new Counters(dealer, player, shoe);
let playerActionButtons = new PlayerButtons();
let roundStarted = false;
let didBet = false;
let playerTurn = false;
let dealerTurn = false;
let gameStarted = true;
let playerDecidedOnRestart = false;

let start = async () => {
    // TODO: include player and dealer totals
    // TODO: add set player turn function

    while (gameStarted) {
        roundStarted = false;
        playerTurn = false;
        dealerTurn = false;
        playerDecidedOnRestart = false;
        shoe.shuffleShoe(MIN_SHUFFLES);

        // wait for player bet
        await waitForAction(() => roundStarted == true);
        didBet = true;
        console.log("starting round");

        // round start
        // initial deal to player and dealer
        for (let _ = 0; _ < 2; _++) {
            playerTurn = true;
            setTimeout("player.action(player.hit())", 1000);
            await waitForAction(() => playerTurn == false);
            updateHand(PLAYER_HAND_ID);
            counters.updateTotals();

            // TODO: deal first card face down
            setTimeout("dealer.dealSelf()", 1000);
            await waitForAction(() => dealerTurn == false);
        }

        let pTotal = player.getHand().getHandTotal();
        let splitPTotal = undefined;
        while (!player.getHand().isBust() && !player.hasFolded() && !player.getHand().isStanding() && pTotal != WIN_THRESHOLD) {
            playerTurn = true;
            await waitForAction(() => playerTurn == false);
            updateHand(PLAYER_HAND_ID);
            updateSplitHand();
            counters.updateTotals();

            console.log("player did action");
            pTotal = player.getHand().getHandTotal();
            player.getHand().printHandTotal();

            // set up two starting hands each with 2 cards after splitting
            if (player.getHandArr().length == 1) {
                console.log("setting up 2 new starting hands");

                // TODO: implement visual notification for second bet
                document.getElementById("split-pot-wrapper").style.display = "flex";
                player.useSplitPot();
                didBet = false;
                await waitForAction(() => didBet == true);
                console.log("player did second bet");
                player.useMainPot();

                // setTimeout("player.hit()", 1000);
                // player.hit();
                player.getHandArr().push(shoe.drawCard());
                pTotal = player.getHand().getHandTotal();

                player.useSplitHand();
                // player.hit();
                player.getHandArr().push(shoe.drawCard());
                splitPTotal = player.getHand().getHandTotal();
                player.useMainHand();

                console.log("player main hand:");
                player.getHand().printHand();
                console.log("player split hand");
                player.getSplitHand().printHand();

                console.log("updating visual");
                updateHand(PLAYER_HAND_ID);
                updateSplitHand();
                counters.updateTotals();
            }
        }

        if (player.getSplitHand() !== undefined) {
            console.log("doing play on split hand");
            player.useSplitHand();
            player.useSplitPot();
            splitPTotal = player.getHand().getHandTotal();

            while (!player.getHand().isBust() && !player.hasFolded() && !player.getHand().isStanding() && splitPTotal != WIN_THRESHOLD) {
                playerTurn = true;
                await waitForAction(() => playerTurn == false);
                updateSplitHand();
                counters.updateTotals();

                console.log("player did action on split hand");
                splitPTotal = player.getHand().getHandTotal();
                console.log("split hand total:");
                player.getHand().printHandTotal();
            }

            player.useMainHand();
            player.useMainPot();
        }

        if (!player.hasFolded()) {
            if (pTotal == WIN_THRESHOLD && player.getHandArr().length == 2) {
                console.log("player hit natural blackjack!");
            }
            if (splitPTotal !== undefined && splitPTotal == WIN_THRESHOLD && player.getSplitHandArr().length == 2) {
                console.log("player hit natural blackjack on split hand!");
            }

            let dealerHand = dealer.getHand();
            let dTotal = dealerHand.getHandTotal();
            while (!dealerHand.isBust() && dTotal <= HARD_STAND_THRESHOLD && dTotal != WIN_THRESHOLD) {
                dealerTurn = true;
                setTimeout("dealer.dealSelf()", 1000);
                await waitForAction(() => dealerTurn == false);
                dTotal = dealerHand.getHandTotal();
                dealer.printHandTotal();
                // counters.updateTotals();
            }

            if (dTotal == WIN_THRESHOLD) {
                console.log("dealer hit blackjack!");
            }

            player.useMainHand();
            winCheck(dealer, player);

            if (player.getSplitHand() !== undefined) {
                player.useSplitHand();
                player.useSplitPot();
                winCheck(dealer, player);
                player.useMainHand();
                player.useSplitPot();
            }
        }

        roundStarted = false;

        let finishCleanup = false;
        // discard cards
        setTimeout(() => {
            console.log("starting cleanup");
            let dealerHandWrapper = document.getElementById(DEALER_HAND_ID);
            let playerHandWrapper = document.getElementById(PLAYER_HAND_ID);
            let playerSplitHandWrapper = document.getElementById(SPLIT_HAND_ID);

            let dealerHand = dealer.getHand();
            let playerHand = player.getHand();
            let playerSplitHand = player.getSplitHand();

            dealerHand.clearHand();
            dealerHand.unstand();

            // TODO: clear split hand
            playerHand.clearHand();
            playerHand.unstand();
            if (playerSplitHand !== undefined) {
                playerSplitHand.clearHand();
                playerSplitHand.unstand();
                // TODO: put more in the cleanup
                player.cleanup();
                document.getElementById("split-pot-wrapper").style.display = "none";
            }
            player.unfold();

            while (dealerHandWrapper.firstChild) {
                dealerHandWrapper.removeChild(dealerHandWrapper.firstChild);
            }

            while (playerHandWrapper.firstChild) {
                playerHandWrapper.removeChild(playerHandWrapper.firstChild);
            }

            if (playerSplitHandWrapper.style.display != "none") {
                while (playerSplitHandWrapper.firstChild) {
                    playerSplitHandWrapper.removeChild(playerSplitHandWrapper.firstChild);
                }
                playerSplitHandWrapper.style.display = "none";
            }

            let dudCard = document.createElement("div");
            dudCard.className = "dud-card";
            dealerHandWrapper.appendChild(dudCard);

            dudCard = document.createElement("div");
            dudCard.className = "dud-card";
            playerHandWrapper.appendChild(dudCard);

            counters.updateTotals();
            finishCleanup = true;
        }, 5000);

        await waitForAction(() => finishCleanup == true);

        console.log("finished cleanup. ready to start a new round");

        if (player.getChips() > 0 && !shoe.isEmpty()) {
            togglePlayAgain();
            await waitForAction(() => playerDecidedOnRestart == true);
            console.log("exited await");
            togglePlayAgain();
        }
        else {
            cashout();
            // TODO: implement game over screen
        }
    }
}


start();
