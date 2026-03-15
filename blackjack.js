
const SUITS = ["hearts", "diamonds", "spades", "clubs"];
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "ace", "jack", "queen", "king"];
const PLAYER_HAND_ID = "player-hand";
const DEALER_HAND_ID = "dealer-hand";
const SPLIT_HAND_ID = "split-hand";
const FACE_DOWN = "face-down";
const MIN_DECKS = 1;
const MAX_DECKS = 10;
const DEFAULT_NUM_OF_DECKS = 2;
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
const DEALER_NAME = "DEALER";
const PLAYER_NAME = "PLAYER";
const NO_WINNER = "NO ONE";


class Pot {
    constructor() {
        this.__total = 0;
    }

    get total() {
        return this.__total;
    }

    set total(value) {
        this.__total = value;
    }

    add(value=0) {
        if (!Chip.chipValueInBounds(value)) {
            return false;
        }
        else if ((this.__total + value) > MAX_CHIPS) {
            log.log(`Pot cannot hold more chips! (max: ${MAX_CHIPS})`);
            return false;
        }

        this.__total += value;

        return true;
    }

    subtract(value=0) {
        if (!Chip.chipValueInBounds(value)) {
            return false;
        }
        else if ((this.__total - value) < 0) {
            console.log("pot is empty!");
            return false;
        }

        this.__total -= value;

        return true;
    }
}


class Card {
    // used to get the className
    static RANK_MAP = {
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
    static VALUE_MAP = {
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

    constructor(suit, rank, flipped=false) {
        this.__suit = suit;
        this.__rank = rank;
        this.__flipped = flipped;
    }

    get suit() {
        return this.__suit;
    }

    get rank() {
        return this.__rank;
    }

    get value() {
        return Card.VALUE_MAP[this.__rank];
    }

    get flipped() {
        return this.__flipped;
    }

    set flipped(value) {
        this.__flipped = value;
    }

    toString() {
        return this.__rank + " of " + this.__suit;
    }

    print() {
        console.log(this.toString());
    }

    flip() {
        if (this.__flipped) {
            this.__flipped = false;
        }
        else {
            this.__flipped = true;
        }
    }
}


class Deck {
    constructor() {
        this.__deck = [];

        for (let s = 0; s < SUITS.length; s++) {
            for (let r = 0; r < RANKS.length; r++) {
                let card = new Card(SUITS[s], RANKS[r]);
                this.__deck.push(card);
            }
        }
    }

    get deck() {
        return this.__deck;
    }

    get() {
        return this.__deck;
    }

    set deck(value) {
        this.__deck = value;
    }

    getLength() {
        return this.__deck.length;
    }

    isEmpty() {
        return this.__deck.length == 0;
    }

    shuffleDeck(shuffles=1) {
        for (let _ = 0; _ < shuffles; _++) {
            // fisher-yates shuffle algorithm
            let max = this.__deck.length - 1;
            for (let i = this.__deck.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (max + 1));

                let temp = this.__deck[i];
                this.__deck[i] = this.__deck[j];
                this.__deck[j] = temp;
            }
        }
    }

    printDeck() {
        for (let i = 0; i < this.__deck.length; i++) {
            this.__deck[i].print();
        }
    }
}


class Shoe {
    constructor(decks=DEFAULT_NUM_OF_DECKS) {
        this.__shoe = [];

        for (let _ = 0; _ < decks; _++) {
            let __deck = new Deck();
            __deck = __deck.deck;

            for (let j = 0; j < __deck.length; j++) {
                this.__shoe.push(__deck[j]);
            }
        }
    }

    get shoe() {
        return this.__shoe;
    }

    get() {
        return this.__shoe;
    }

    set shoe(value) {
        this.__shoe = value;
    }

    getLength() {
        return this.__shoe.length;
    }

    isEmpty() {
        return this.__shoe.length == 0;
    }

    shuffleShoe(shuffles=1) {
        for (let _ = 0; _ < shuffles; _++) {
            // fisher-yates shuffle algorithm
            let max = this.__shoe.length - 1;
            for (let i = this.__shoe.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (max + 1));

                let temp = this.__shoe[i];
                this.__shoe[i] = this.__shoe[j];
                this.__shoe[j] = temp;
            }
        }
    }

    drawCard() {
        if (this.isEmpty()) {
            return null;
        }

        return this.__shoe.shift();
    }

    print() {
        for (let i = 0; i < this.__shoe.length; i++) {
            this.__shoe[i].print();
        }
    }
}


class Hand {
    constructor() {
        this.__hand = [];
        this.__standing = false;
    }

    get hand() {
        return this.__hand;
    }

    get() {
        return this.__hand;
    }

    set hand(value) {
        this.__hand = value;
    }

    push(card) {
        this.__hand.push(card);
    }

    pop() {
        return this.__hand.pop();
    }

    getLength() {
        return this.__hand.length;
    }

    getTotal() {
        let total = 0;
        let aces = 0;

        for (let i = 0; i < this.__hand.length; i++) {
            let card = this.__hand[i];
            let value = card.value;

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
                total -= (ACE_HIGH - ACE_LOW);
            }
            aces--;
        }

        return total;
    }

    printHandTotal() {
        console.log(`hand total: ${this.getTotal()}`);
    }

    isBust() {
        return (this.getTotal() > WIN_THRESHOLD);
    }

    isStanding() {
        return this.__standing;
    }

    unstand() {
        if (this.__standing) {
            this.__standing = false;
        }
    }

    stand() {
        /**
         * take no more cards during turn.
         */

        if (this.hand.length <= 1) {
            /**
             * cannot stand if the dealer is waiting for player bet,
             * either before the initial bet or before the split bet.
             */
            log.log("Cannot stand before making a bet!");
            return false;
        }
        else if (!this.__standing) {
            console.log("standing");
            this.__standing = true;
        }
        return true;
    }

    clearHand() {
        while (this.__hand.length > 0) {
            this.__hand.pop();
        }
    }

    isEmpty() {
        return this.__hand.length == 0;
    }

    print() {
        console.log("printing hand...");
        for (let i = 0; i < this.__hand.length; i++) {
            this.__hand[i].print();
        }
        console.log();
    }
}


class Player {
    /**
     * hit - take another card
     * stand/stay - take no more cards
     * double down - increase initial bet by 100% and take one more card. the additional bet is placed next to the original bet.
     * split - create two hands from a starting hand where both cards have the same value. each new hand gets a second card resulting in two starting hands. this requires an additional bet on the second hand. the two hands are played out independently, and the wager on each hand is won or lost independently.
     * surrender - forfeit half the bet and end the hand immediately. not allowed after splitting.
     */
    constructor() {
        this.__pot = new Pot();
        this.__splitPot = null;
        this.__currentPot = this.__pot;

        this.__hand = new Hand();
        this.__splitHand = null;
        this.__currentHand = this.__hand;

        this.__total = STARTING_CHIPS;

        // initialize front-end value from here for security
        this.__chips = document.getElementById("player-chips");
        this.__chips.innerText = this.__total;
        this.__folded = false;
    }

    get pot() {
        return this.__pot;
    }

    get splitPot() {
        return this.__splitPot;
    }

    get currentPot() {
        return this.__currentPot;
    }

    get hand() {
        return this.__hand;
    }

    get splitHand() {
        return this.__splitHand;
    }

    get currentHand() {
        return this.__currentHand;
    }

    get total() {
        return this.__total;
    }

    get chips() {
        return this.__total;
    }

    get folded() {
        return this.__folded;
    }

    set pot(value) {
        this.__pot = value;
    }

    set splitPot(value) {
        this.__splitPot = value;
    }

    set currentPot(value) {
        this.__currentPot = value;
    }

    set hand(value) {
        this.__hand = value;
    }

    set splitHand(value) {
        this.__splitHand = value;
    }

    set currentHand(value) {
        this.__currentHand = value;
    }

    set total(value) {
        this.__total = value;
    }

    set chips(value) {
        this.__total = value;
    }

    set folded(value) {
        this.__folded = value;
    }

    useMainPot() {
        this.__currentPot = this.__pot;
    }

    useSplitPot() {
        this.__currentPot = this.__splitPot;
    }

    useMainHand() {
        this.__currentHand = this.__hand;
    }

    useSplitHand() {
        this.__currentHand = this.__splitHand;
    }

    printHandTotal() {
        console.log(`player hand total: ${this.__currentHand.getTotal()}`);
    }

    addChips(value=0) {
        if (!Chip.chipValueInBounds(value)) {
            return false;
        }
        else if ((this.__total + value) > MAX_CHIPS) {
            log.log(`Player cannot take more chips! (max: ${MAX_CHIPS})`);
            return false;
        }

        this.__total += value;

        return true;
    }

    subtractChips(value=0) {
        if (!Chip.chipValueInBounds(value)) {
            return false;
        }
        else if ((this.__total - value) < 0) {
            log.log("Player has no more chips!");
            return false;
        }

        this.__total -= value;

        return true;
    }

    hit() {
        if (!playerTurn) {
            return false;
        }
        else if (shoe.isEmpty()) {
            log.log("Shoe is empty! Cannot take more cards");
            return false;
        }

        let drawnCard = shoe.drawCard();
        this.__currentHand.push(drawnCard);
        log.log("Player has hit.");

        return true;
    }

    doubleDown() {
        if (!playerTurn) {
            return false;
        }

        /**
         * increase initial bet by 100% and take one more card.
         * the additional bet is placed next to the original bet.
         */
        let currentBet = this.__currentPot.total;
        if (!dealer.takeChips(currentBet)) {
            log.log(`Player cannot double down due to insufficient funds! (Available chips: ${this.__total})`);
            return false;
        }

        if (!this.hit()) {
            log.log("Player cannot double down!");
            return false;
        }
        log.log("Player has doubled down.");

        return true;
    }

    split() {
        if (!playerTurn) {
            return false;
        }
        else if (this.__splitHand != null) {
            log.log("Player has already split! Cannot split again.");
            return false;
        }

        let handLength = this.__hand.getLength();
        if (handLength > 2) {
            log.log("Player can only split after receiving the initial two card hand!");
            return false;
        }
        else if (handLength == 1) {
            log.log("Player is in the process of splitting! Cannot split again; Waiting for bet on split hand...");
            return false;
        }
        else if (this.__total < MIN_BET) {
            log.log(`Player cannot split due to insufficient funds! (Available chips: ${this.__total}, Min bet: ${MIN_BET})`);
            return false;
        }

        /**
         * split can only happen with the initial 2 card hand
         * so the index hard code is okay. checks have already
         * occurred above.
         */
        let hand = this.__hand.get();
        let firstCard = hand[0];
        let secondCard = hand[1];
        if (firstCard.rank != secondCard.rank) {
            log.log(`Player cannot split because the cards are not equal in value! (${firstCard.rank}, ${secondCard.rank})`);
            return false;
        }

        disableAllPlayerButtons();

        this.__splitHand = new Hand();
        this.__splitPot = new Pot();

        secondCard = this.__hand.pop();
        this.__splitHand.push(secondCard);
        console.log("main hand after splitting:");
        this.__hand.print();
        console.log("split hand after splitting:");
        this.__splitHand.print();

        log.log("Player has split.");

        return true;
    }

    fold() {
        /**
         * forfeit all cards to the dealer and lose the bet
         */

        if (!playerTurn) {
            return false;
        }
        else if (this.__folded) {
            log.log("Player has already folded! Cannot fold again.");
            return false;
        }
        else if (this.__hand.getLength() == 0) {
            log.log("Player cannot fold with an empty hand!");
            return false;
        }
        else if (this.__splitHand != null) {
            log.log("Player cannot fold! Must play out the split hand!");
            return false;
        }

        this.__hand.clearHand();
        this.__pot.subtract(this.__pot.total);
        this.__folded = true;
        log.log("Player has folded.");

        return true;
    }

    unfold() {
        if (this.__folded) {
            this.__folded = false;
        }
    }

    async deal() {
        if (roundStarted && didBet) {
            log.log("Player cannot deal! In the middle of a round!");
            return false;
        }
        else if (!roundStarted && didBet) {
            log.log("Player cannot deal! Board cleanup in progress...");
            return false;
        }
        else if (this.__pot.total < MIN_BET) {
            log.log(`Player cannot deal! Must bet at least ${MIN_BET} chips!`);
            return false;
        }

        disablePlayerBetButtons();

        roundStarted = true;
        didBet = true;

        return true;
    }

    action(callback) {
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

        if (this.__currentHand.isStanding()) {
            log.log("Player stands.");
        }

        console.log("callback success");

        playerTurn = false;
        dealerTurn = true;

        return true;
    }

    cleanup() {
        this.__splitHand = null;
        this.__splitPot = null;
    }
}


class Dealer {
    constructor() {
        this.__hand = new Hand();
    }

    get hand() {
        return this.__hand;
    }

    dealPlayer(player=null) {
        let drawnCard = shoe.drawCard();

        if (!player) {
            return false;
        }

        player.currentHand.push(drawnCard);

        playerTurn = false;
        dealerTurn = true;

        return true;
    }

    dealSelf(flipped=false) {
        let drawnCard = shoe.drawCard();

        if (flipped) {
            drawnCard.flip();
        }

        this.__hand.push(drawnCard);
        updateDealerHand();
        counters.updateTotals();

        dealerTurn = false;
        playerTurn = true;

        return true;
    }

    takeChips(value=0, pot=player.currentPot) {
        if (!player.subtractChips(value) || !pot.add(value)) {
            return false;
        }

        return true;
    }

    giveChips(value=0) {
        if (!player.addChips(value)) {
            return false;
        }

        return true;
    }

    printHandTotal() {
        console.log(`dealer hand total: ${this.__hand.getTotal()}`);
    }
}


class Chip {
    constructor(id, value=0) {
        this.__value = value;
        this.__chip = document.createElement("button");
        this.__chip.className = "chip";
        this.__chip.id = id;
        this.__chip.innerText = this.__value;
    }

    static chipValueInBounds(value=0) {
        if (value <= 0 || value > MAX_CHIP_VAL) {
            console.log("chip value is out of bounds!");
            return false;
        }

        return true;
    }

    get chip() {
        return this.__chip;
    }

    get element() {
        return this.__chip;
    }

    get value() {
        return this.__value;
    }

    disableAnimation() {
        this.__chip.style.animationPlayState = "paused";
    }

    enableAnimation() {
        this.__chip.style.animationPlayState = "running";
    }
}


/**
 * based off of the values contained in Chips.CHIP_VALUES, this class
 * will create Chip objects, then create front-end chip elements,
 * and add those front-end chip elements to the DOM.
 */
class Chips {
    static CHIP_BUTTON_WRAPPER = document.getElementById("chips-wrapper");

    static CHIP_VALUES = [
        1,
        5,
        25,
        100,
        500
    ];

    static CHIP_COLORS = {
        1: {
            "mouseover": "lightgrey",
            "mouseleave": "white",
            "mousedown": "darkgrey",
            "mouseup": "lightgrey",
            "touchstart": "darkgrey",
            "touchend": "white"
        },
        5: {
            "mouseover": "#8b1e22",
            "mouseleave": "#c12e34",
            "mousedown": "#69171a",
            "mouseup": "#8b1e22",
            "touchstart": "#69171a",
            "touchend": "#c12e34"
        },
        25: {
            "mouseover": "#287e39",
            "mouseleave": "#319845",
            "mousedown": "#1f5f2b",
            "mouseup": "#287e39",
            "touchstart": "#1f5f2b",
            "touchend": "#319845"
        },
        100: {
            "mouseover": "#2b4472",
            "mouseleave": "#3b5b98",
            "mousedown": "#22365a",
            "mouseup": "#2b4472",
            "touchstart": "#22365a",
            "touchend": "#3b5b98"
        },
        500: {
            "mouseover": "#202020",
            "mouseleave": "#303030",
            "mousedown": "#000000",
            "mouseup": "#202020",
            "touchstart": "#000000",
            "touchend": "#303030"
        }
    };

    static CHIP_ID_PREFIX = "chip";
    static CHIP_ID_DELIMITER = "-";

    constructor() {
        // will contain chip ids (e.g. ["chip-1", "chip-100"])
        this.__chipIds = [];
        // will contain Chip objects (e.g. [Chip(), Chip()])
        this.__chips = [];

        // create Chip objects
        for (let i = 0; i < Chips.CHIP_VALUES.length; i++) {
            let newChipValue = Chips.CHIP_VALUES[i];
            let newChipId = Chips.CHIP_ID_PREFIX + Chips.CHIP_ID_DELIMITER + newChipValue;
            this.__chipIds.push(newChipId);

            let newChip = new Chip(newChipId, newChipValue);
            this.__chips.push(newChip);
        }

        // add hover and click functionality to Chip objects
        for (let i = 0; i < this.__chips.length; i++) {
            let currentChip = this.__chips[i];

            currentChip.element.addEventListener("mouseover", (e) => {
                e.target.style.backgroundColor = Chips.CHIP_COLORS[currentChip.value]["mouseover"];
            });
            currentChip.element.addEventListener("mouseleave", (e) => {
                e.target.style.backgroundColor = Chips.CHIP_COLORS[currentChip.value]["mouseleave"];
            });
            currentChip.element.addEventListener("mousedown", (e) => {
                e.target.style.backgroundColor = Chips.CHIP_COLORS[currentChip.value]["mousedown"];
            });
            currentChip.element.addEventListener("mouseup", (e) => {
                e.target.style.backgroundColor = Chips.CHIP_COLORS[currentChip.value]["mouseup"];
            });

            currentChip.element.addEventListener("click", (e) => {
                if (roundStarted && didBet) {
                    log.log("Round has already started! Cannot add more chips to the pot!");
                    return;
                }
                else if (!roundStarted && didBet) {
                    log.log("Board cleanup in progress! Cannot add more chips to the pot!");
                    return;
                }
                else if (!dealer.takeChips(currentChip.value, player.currentPot)) {
                    console.log("couldn't take player chips");
                    return;
                }

                counters.updateTotals();
            });
        }

        while (Chips.CHIP_BUTTON_WRAPPER.firstChild) {
            Chips.CHIP_BUTTON_WRAPPER.removeChild(Chips.CHIP_BUTTON_WRAPPER.firstChild);
        }

        for (let i = 0; i < this.__chips.length; i++) {
            Chips.CHIP_BUTTON_WRAPPER.appendChild(this.__chips[i].element);
        }
    }

    get chip_ids() {
        return this.__chipIds;
    }

    get chips() {
        return this.__chips;
    }

    disable() {
        Chips.CHIP_BUTTON_WRAPPER.setAttribute("inert", "");

        for (let i = 0; i < this.__chips.length; i++) {
            this.__chips[i].disableAnimation();
        }
    }

    enable() {
        if (Chips.CHIP_BUTTON_WRAPPER.attributes.getNamedItem("inert")) {
            Chips.CHIP_BUTTON_WRAPPER.removeAttribute("inert");

            for (let i = 0; i < this.__chips.length; i++) {
                this.__chips[i].enableAnimation();
            }
        }
    }
}


class ActionButton {
    constructor(id) {
        this.__actionButon = document.createElement("button");
        this.__actionButton.className = "action";
        this.__actionButton.id = id;
    }

    get actionButton() {
        return this.__actionButon;
    }
}


class ActionButtons {
    static ACTION_BTN_COLORS = {
        "mouseover": "radial-gradient(rgb(200, 200, 0), rgb(200, 130, 0), rgb(200, 0, 0))",
        "mouseleave": "radial-gradient(rgb(255, 255, 0), rgb(255, 165, 0), rgb(255, 0, 0))",
        "mousedown": "radial-gradient(rgb(150, 150, 0), rgb(150, 97, 0), rgb(150, 0, 0))",
        "mouseup": "radial-gradient(rgb(200, 200, 0), rgb(200, 130, 0), rgb(200, 0, 0))",
        "touchstart": "radial-gradient(rgb(150, 150, 0), rgb(150, 97, 0), rgb(150, 0, 0))",
        "touchend": "radial-gradient(rgb(255, 255, 0), rgb(255, 165, 0), rgb(255, 0, 0))"
    };

    constructor() {
        /**
         * unlike Chips, which all share the same agnostic function, but
         * are separated based off of its argument (numeric value), each action 
         * button will have a unique function.
         */
        this.__hit = document.getElementById("hit");
        this.__stand = document.getElementById("stand");
        this.__doubleDown = document.getElementById("double-down");
        this.__split = document.getElementById("split");
        this.__fold = document.getElementById("fold");
        this.__allIn = document.getElementById("all-in");
        this.__deal = document.getElementById("deal");
        this.__reset = document.getElementById("reset");
        this.__playAgain = document.getElementById("play-again");
        this.__cashout = document.getElementById("cashout");

        this.__actionButtons = [
            this.__hit,
            this.__stand,
            this.__doubleDown,
            this.__split,
            this.__fold,
            this.__allIn,
            this.__deal,
            this.__reset,
            this.__playAgain,
            this.__cashout
        ];

        for (let i = 0; i < this.__actionButtons.length; i++) {
            let currentButton = this.__actionButtons[i];

            currentButton.addEventListener("mouseover", (e) => {
                (e.target).style.backgroundImage = ActionButtons.ACTION_BTN_COLORS["mouseover"];
            });
            currentButton.addEventListener("mouseleave", (e) => {
                (e.target).style.backgroundImage = ActionButtons.ACTION_BTN_COLORS["mouseleave"];
            });
            currentButton.addEventListener("mousedown", (e) => {
                (e.target).style.backgroundImage = ActionButtons.ACTION_BTN_COLORS["mousedown"];
            });
            currentButton.addEventListener("mouseup", (e) => {
                (e.target).style.backgroundImage = ActionButtons.ACTION_BTN_COLORS["mouseup"];
            });
            currentButton.addEventListener("touchstart", (e) => {
                (e.target).style.backgroundImage = ActionButtons.ACTION_BTN_COLORS["touchstart"];
            });
            currentButton.addEventListener("touchend", (e) => {
                (e.target).style.backgroundImage = ActionButtons.ACTION_BTN_COLORS["touchend"];
            })
        }
    }

    get actionButtons() {
        return this.__actionButtons;
    }
}


class PlayerButtons {
    static ACTION_BTN_COLORS = {
        "mouseover": "radial-gradient(rgb(200, 200, 0), rgb(200, 130, 0), rgb(200, 0, 0))",
        "mouseleave": "radial-gradient(rgb(255, 255, 0), rgb(255, 165, 0), rgb(255, 0, 0))",
        "mousedown": "radial-gradient(rgb(150, 150, 0), rgb(150, 97, 0), rgb(150, 0, 0))",
        "mouseup": "radial-gradient(rgb(200, 200, 0), rgb(200, 130, 0), rgb(200, 0, 0))",
        "touchstart": "radial-gradient(rgb(150, 150, 0), rgb(150, 97, 0), rgb(150, 0, 0))",
        "touchend": "radial-gradient(rgb(255, 255, 0), rgb(255, 165, 0), rgb(255, 0, 0))"
    };

    constructor() {
        this.__chips = new Chips();
        this.__chipButtons = this.__chips.chips;

        this.__hit = document.getElementById("hit");
        this.__stand = document.getElementById("stand");
        this.__doubleDown = document.getElementById("double-down");
        this.__split = document.getElementById("split");
        this.__fold = document.getElementById("fold");
        this.__allIn = document.getElementById("all-in");
        this.__deal = document.getElementById("deal");
        this.__reset = document.getElementById("reset");
        this.__playAgain = document.getElementById("play-again");
        this.__cashout = document.getElementById("cashout");

        this.__actionButtons = [
            this.__hit,
            this.__stand,
            this.__doubleDown,
            this.__split,
            this.__fold,
            this.__allIn,
            this.__deal,
            this.__reset,
            this.__playAgain,
            this.__cashout
        ];

        for (let i = 0; i < this.__actionButtons.length; i++) {
            let btn = this.__actionButtons[i];

            btn.addEventListener("mouseover", (e) => {
                (e.target).style.backgroundImage = PlayerButtons.ACTION_BTN_COLORS["mouseover"];
            });
            btn.addEventListener("mouseleave", (e) => {
                (e.target).style.backgroundImage = PlayerButtons.ACTION_BTN_COLORS["mouseleave"];
            });
            btn.addEventListener("mousedown", (e) => {
                (e.target).style.backgroundImage = PlayerButtons.ACTION_BTN_COLORS["mousedown"];
            });
            btn.addEventListener("mouseup", (e) => {
                (e.target).style.backgroundImage = PlayerButtons.ACTION_BTN_COLORS["mouseup"];
            });
            btn.addEventListener("touchstart", (e) => {
                (e.target).style.backgroundImage = PlayerButtons.ACTION_BTN_COLORS["touchstart"];
            });
            btn.addEventListener("touchend", (e) => {
                (e.target).style.backgroundImage = PlayerButtons.ACTION_BTN_COLORS["touchend"];
            })
        }

        this.__allIn.addEventListener("click", () => {
            if (roundStarted && didBet) {
                log.log("Round has already started! Cannot add more chips to the pot!");
                return;
            }
            else if (!roundStarted && didBet) {
                log.log("Board cleanup in progress! Cannot add more chips to the pot!");
                return;
            }
            else if (!dealer.takeChips(player.total, player.currentPot)) {
                console.log("couldn't take player chips");
                return;
            }

            disablePlayerBetButtons();
            counters.updateTotals();
            player.deal();
        });
    }

    disableChipButtons() {
        this.__chips.disable();
    }

    enableChipButtons() {
        this.__chips.enable();
    }

    disableAllButtons() {

    }

    enableAllButtons() {

    }
}


class Settings {
    constructor() {

    }
}


class Counters {
    constructor(dealer=null, player=null, shoe=null) {
        // objects
        this.__dealer = dealer;
        this.__player = player;
        this.__shoe = shoe;

        // elements
        this.__playerChipCounter = document.getElementById("player-chips");
        this.__potCounter = document.getElementById("pot");
        this.__splitPotWrapper = document.getElementById("split-pot-wrapper");
        this.__splitPotCounter = document.getElementById("split-pot");
        this.__shoeCounter = document.getElementById("shoe-counter");

        this.updateTotals();
    }

    updateDealerTotals() {}

    updatePlayerTotals() {
        this.__playerChipCounter.innerText = this.__player.total;
        this.__potCounter.innerText = this.__player.pot.total;

        if (this.__player.splitPot != null) {
            this.__splitPotCounter.innerText = this.__player.splitPot.total;
        }
    }

    updateShoeCounter() {
        if (this.__shoe != null) {
            this.__shoeCounter.innerText = this.__shoe.getLength();
        }
    }

    updateTotals() {
        this.updateDealerTotals();
        this.updatePlayerTotals();
        this.updateShoeCounter();
    }
}


class Message {
    constructor(hours=0, minutes=0, seconds=0, message="") {
        this.__hours = hours;
        this.__minutes = minutes;
        this.__seconds = seconds;
        this.__timeString = `[${this.timeToString(this.__hours)}:${this.timeToString(this.__minutes)}:${this.timeToString(this.__seconds)}]`;
        this.__message = message;
    }

    get hours() {
        return this.__hours;
    }

    get minutes() {
        return this.__minutes;
    }

    get seconds() {
        return this.__seconds;
    }

    get timeString() {
        return this.__timeString;
    }

    get message() {
        return this.__message;
    }

    timeToString(time=0) {
        let s = "" + time;
        return s.padStart(2, "0");
    }
}


/**
 * nodes will contain a message
 * nodes are kept in memory so log can be retrieved any time during gameplay loop
 */
class Node {
    constructor(data=undefined) {
        this.__data = data;
        this.__next = null;
    }

    get data() {
        return this.__data;
    }

    get next() {
        return this.__next;
    }

    set data(data=undefined) {
        this.__data = data;
    }

    set next(next=null) {
        this.__next = next;
    }

    hasNext() {
        return this.__next != null;
    }
}


class Log {
    constructor() {
        this.logWrapper = document.getElementById("log");
        this.__root = null;
        this.date = new Date();
    }

    get root() {
        return this.__root;
    }

    set root(newRoot=null) {
        this.__root = newRoot;
    }

    get length() {
        let len = 0;
        while (this.root != null) {
            len++;
            this.root = this.root.next;
        }
        return len;
    }

    log(message="") {
        if (this.root == null) {
            this.root = new Node();
        }
        else {
            // append to the beginning of the linked list
            let newNode = new Node();
            newNode.next = this.root;
            this.root = newNode;
        }

        // save memory by overwriting date object
        this.date = new Date();
        this.root.data = new Message(
            this.date.getHours(),
            this.date.getMinutes(),
            this.date.getSeconds(),
            message
        );

        // add the message to the log
        let newMessage = document.createElement("div");
        newMessage.className = "message";
        let messageTime = document.createElement("span");
        messageTime.className = "message-time";
        let messageContent = document.createElement("p");
        messageContent.className = "message-content";

        messageTime.innerText = this.root.data.timeString;
        messageContent.innerText = this.root.data.message;

        newMessage.appendChild(messageTime);
        newMessage.appendChild(messageContent);
        this.logWrapper.insertBefore(newMessage, this.logWrapper.firstChild);
    }

    clearLog() {
        let prev = null;
        while (this.__root != null) {
            prev = this.__root;
            this.__root = this.__root.next;
            prev = null;
        }

        while (this.logWrapper.firstChild) {
            this.logWrapper.removeChild(this.logWrapper.firstChild);
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
    let cardWrapper = document.createElement("div");
    cardWrapper.className = "card";

    let viCard = document.createElement("img");
    let rank = card.rank;
    let suit = card.suit;

    if (card.flipped) {
        viCard.src = "assets/images/card-back.png";
    }
    else {
        viCard.src = "assets/images/" + suit + "/" + rank + "-of-" + suit + ".png";
    }

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
        hand = player.currentHand.get();
    }
    else {
        hand = dealer.hand.get();
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
    // uses different hand element, so must use a separate function instead of context switching
    let splitHandWrapper = document.getElementById(SPLIT_HAND_ID);

    if (player.splitHand == null) {
        return;
    }
    else if (player.splitHand.getLength() == 1) {
        splitHandWrapper.style.display = "flex";
    }

    while (splitHandWrapper.firstChild) {
        splitHandWrapper.removeChild(splitHandWrapper.firstChild);
    }

    let splitHand = player.splitHand.get();

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

function winCheck(dealer=null, player=null) {
    if (dealer == null || player == null) {
        console.error("null value provided for dealer or player");
        return;
    }

    let dealerHand = dealer.hand;
    let playerHand = player.currentHand;

    let dealerHandTotal = dealerHand.getTotal();
    let playerHandTotal = playerHand.getTotal();

    let pot = player.pot;
    let potTotal = pot.total;
    pot.subtract(potTotal);
    let payout = 0;

    log.log(`Player hand: ${playerHandTotal}, dealer hand: ${dealerHandTotal}`);

    if (dealerHand.isBust()) {
        if (!playerHand.isBust()) {
            if (playerHandTotal == WIN_THRESHOLD) {
                // 3:2 payout (for every 2 chips, player will get 3 in return)
                let wager = potTotal;
                let halfOfWager = Math.floor(wager / 2);
                payout = wager + halfOfWager;
                log.log(`Player blackjack! Payout: ${payout}`);
            }
            else {
                // 1:1 payout
                payout = potTotal * 2;
                log.log(`Dealer bust. Player wins! Payout: ${payout}`);
            }
            setWinner(PLAYER_NAME);
        }
        else {
            log.log("Both dealer and player bust!");
            setWinner(NO_WINNER);
        }
    }
    else {
        if (playerHand.isBust()) {
            log.log("Player busts!");
            setWinner(DEALER_NAME);
        }
        else if (playerHandTotal < dealerHandTotal) {
            log.log("Dealer has the higher hand. Dealer wins!");
            setWinner(DEALER_NAME);
        }
        else if (playerHandTotal > dealerHandTotal) {
            if (playerHandTotal == WIN_THRESHOLD) {
                // 3:2 payout (for every 2 chips, player will get 3 in return)
                let wager = potTotal;
                let halfOfWager = Math.floor(wager / 2);
                payout = wager + halfOfWager;
                log.log(`Player blackjack! Payout: ${payout}`);
            }
            else {
                // 1:1 payout
                payout = potTotal * 2;
                log.log(`Player has the higher hand! Payout: ${payout}`);
            }
            setWinner(PLAYER_NAME);
        }
        else if (playerHandTotal == dealerHandTotal) {
            if (playerHandTotal == WIN_THRESHOLD) {
                // payout 3:2
                let wager = potTotal;
                let halfOfWager = Math.floor(wager / 2);
                payout = wager + halfOfWager;
                log.log(`Push with blackjack! Payout: ${payout}`);
            }
            else {
                // return player bet
                log.log("Push! Returning player bet...");
                payout = potTotal;
            }
            setWinner(NO_WINNER);
        }
    }

    if (payout > 0) {
        dealer.giveChips(payout);
    }
    counters.updateTotals();
}

function setWinner(winner=DEALER_NAME) {
    let w = document.getElementById("winner");

    if (winner == DEALER_NAME || winner == PLAYER_NAME) {
        w.innerText = `${winner} WINS!`;
    }
    else {
        w.innerText = "NO WINNER...";
    }
}

function toggleWinPopup() {
    if (winPopup.style.display == "grid") {
        winPopup.style.display = "none";
    }
    else {
        winPopup.style.display = "grid";
    }
}

function disablePlayerBetButtons() {
    chipButtons.setAttribute("inert", "");
    betButtons.setAttribute("inert", "");
}

function setPlayerBetPhase() {
    console.log("setting player bet phase");
    playerActions.setAttribute("inert", "");
    if (chipButtons.attributes.getNamedItem("inert")) {
        chipButtons.removeAttribute("inert");
    }
    if (betButtons.attributes.getNamedItem("inert")) {
        betButtons.removeAttribute("inert");
    }
}

function setPlayerActionPhase() {
    console.log("setting player action phase");
    disablePlayerBetButtons();
    if (playerActions.attributes.getNamedItem("inert")) {
        playerActions.removeAttribute("inert");
    }
}

function disableAllPlayerButtons() {
    console.log("disabling all player buttons");
    playerActions.setAttribute("inert", "");
    disablePlayerBetButtons();
}

function enableAllPlayerButtons() {
    if (playerActions.attributes.getNamedItem("inert")) {
        playerActions.removeAttribute("inert");
    }
    if (chipButtons.attributes.getNamedItem("inert")) {
        chipButtons.removeAttribute("inert");
    }
    if (betButtons.attributes.getNamedItem("inert")) {
        betButtons.removeAttribute("inert");
    }
}

function setCurrentHandContext() {

}

function playAgain() {
    gameStarted = true;
    playerDecidedOnRestart = true;
    console.log("player restarting round!");
}

function cashout() {
    gameStarted = false;
    playerDecidedOnRestart = true;
    log.log("Cashing out. Thanks for playing!");
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


let log = new Log();
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
let playerActions = document.getElementById("player-actions");
let chipButtons = document.getElementById("chips-wrapper");
let betButtons = document.getElementById("stacked-button-wrapper");
let winPopup = document.getElementById("win-popup");


let start = async () => {
    while (gameStarted) {
        roundStarted = false;
        didBet = false;
        playerTurn = false;
        dealerTurn = false;
        playerDecidedOnRestart = false;
        shoe.shuffleShoe(MIN_SHUFFLES);

        log.clearLog();
        setPlayerBetPhase();

        log.log("Waiting for player bet...");
        await waitForAction(() => roundStarted == true);
        // didBet = true;
        log.log("Dealing initial hand...");

        /**
         * ROUND START
         * - initial deal to the player and dealer
         */
        for (let i = 0; i < 2; i++) {
            playerTurn = true;
            setTimeout(() => {
                dealer.dealPlayer(player);
            }, 1000);
            await waitForAction(() => playerTurn == false);
            updateHand(PLAYER_HAND_ID);
            counters.updateTotals();

            setTimeout(() => {
                if (i == 0) {
                    dealer.dealSelf(true);
                }
                else {
                    dealer.dealSelf();
                }
            }, 1000);
            await waitForAction(() => dealerTurn == false);
        }
        log.log("Initial hand has been dealt.");

        /**
         * PLAYER TURN
         * MAIN HAND PHASE
         */
        let pTotal = player.hand.getTotal();
        let splitPTotal = null;
        while (!player.hand.isBust() && !player.folded && !player.hand.isStanding() && pTotal != WIN_THRESHOLD) {
            if (player.splitHand != null) {
                log.log("Waiting for player action on main hand...");
            }
            else {
                log.log("Waiting for player action...");
            }
            /**
             * always set player action phase in the while loop
             * to prevent the race condition of user spam clicking
             */
            
            setPlayerActionPhase();
            playerTurn = true;
            await waitForAction(() => playerTurn == false);
            updateHand(PLAYER_HAND_ID);
            updateSplitHand();
            counters.updateTotals();

            console.log("player did action");
            pTotal = player.hand.getTotal();
            player.printHandTotal();

            // set up two starting hands each with 2 cards after splitting
            if (player.hand.getLength() == 1) {
                console.log("setting up 2 new starting hands");

                document.getElementById("split-pot-wrapper").style.display = "flex";
                player.useSplitPot();
                didBet = false;

                setPlayerBetPhase();
                log.log("Waiting for player bet on split hand...");
                await waitForAction(() => didBet == true);
                // setPlayerActionPhase();

                console.log("player did second bet");
                player.useMainPot();

                // setTimeout("player.hit()", 1000);
                // player.hit();
                player.hand.push(shoe.drawCard());
                pTotal = player.hand.getTotal();

                // player.useSplitHand();
                // player.hit();
                player.splitHand.push(shoe.drawCard());
                splitPTotal = player.splitHand.getTotal();
                // player.useMainHand();

                console.log("player main hand:");
                player.hand.print();
                console.log("player split hand:");
                player.splitHand.print();

                console.log("updating visuals");
                updateHand(PLAYER_HAND_ID);
                updateSplitHand();
                counters.updateTotals();
            }
        }

        /**
         * PLAYER TURN
         * SPLIT HAND PHASE
         */
        if (player.splitHand != null) {
            console.log("doing play on split hand");
            player.useSplitHand();
            player.useSplitPot();
            splitPTotal = player.splitHand.getTotal();

            while (!player.splitHand.isBust() && !player.folded && !player.splitHand.isStanding() && splitPTotal != WIN_THRESHOLD) {
                log.log("Waiting for player action on split hand...");
                /**
                 * always set player action phase in the while loop
                 * to prevent the race condition of user spam clicking
                 */
                setPlayerActionPhase();
                playerTurn = true;
                await waitForAction(() => playerTurn == false);
                updateSplitHand();
                counters.updateTotals();

                console.log("player did action on split hand");
                splitPTotal = player.splitHand.getTotal();
                console.log("split hand total: ", splitPTotal);
            }

            player.useMainHand();
            player.useMainPot();
        }

        disableAllPlayerButtons();
        // reveal dealer's flipped card
        console.log("dealer flip");
        dealer.hand.get()[0].flip();
        updateDealerHand();

        /**
         * DEALER TURN
         */
        if (!player.folded) {
            if (pTotal == WIN_THRESHOLD && player.hand.getLength() == 2) {
                log.log("Player hit natural blackjack!");
            }
            if (splitPTotal != null && splitPTotal == WIN_THRESHOLD && player.splitHand.getLength() == 2) {
                log.log("Player hit natural blackjack on split hand!");
            }

            let dealerHand = dealer.hand;
            let dTotal = dealerHand.getTotal();
            while (!dealerHand.isBust() && dTotal < HARD_STAND_THRESHOLD && dTotal != WIN_THRESHOLD) {
                dealerTurn = true;
                setTimeout("dealer.dealSelf()", 1000);
                await waitForAction(() => dealerTurn == false);
                log.log("Dealer hits.");
                dTotal = dealerHand.getTotal();
                dealer.printHandTotal();
                if (dTotal == HARD_STAND_THRESHOLD) {
                    log.log(`Dealer stands.`);
                    break;
                }
                // counters.updateTotals();
            }

            if (dTotal == WIN_THRESHOLD) {
                log.log("Dealer hit blackjack!");
            }

            player.useMainHand();
            winCheck(dealer, player);

            if (player.splitHand != null) {
                setTimeout(() => {

                }, 1000);
                player.useSplitHand();
                player.useSplitPot();
                winCheck(dealer, player);
                player.useMainHand();
                player.useSplitPot();
            }
        }

        /**
         * BOARD CLEANUP
         */
        roundStarted = false;
        let finishCleanup = false;
        log.log("Beginning board cleanup...");
        // discard cards
        setTimeout(() => {
            console.log("starting cleanup");
            let dealerHandWrapper = document.getElementById(DEALER_HAND_ID);
            let playerHandWrapper = document.getElementById(PLAYER_HAND_ID);
            let playerSplitHandWrapper = document.getElementById(SPLIT_HAND_ID);

            let dealerHand = dealer.hand;
            let playerHand = player.hand;
            let playerSplitHand = player.splitHand;

            dealerHand.clearHand();
            dealerHand.unstand();

            playerHand.clearHand();
            playerHand.unstand();
            if (playerSplitHand != null) {
                playerSplitHand.clearHand();
                playerSplitHand.unstand();
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

        log.log("Finished cleanup. Ready to start a new round.");

        if (player.total > 0 && !shoe.isEmpty() && shoe.getLength() >= 4) {
            toggleWinPopup();
            await waitForAction(() => playerDecidedOnRestart == true);
            console.log("exited await");
            toggleWinPopup();
        }
        else {
            if (player.total == 0) {
                log.log("Player has no more available chips! Forcing cash out...");
            }
            if (shoe.isEmpty()) {
                log.log("Dealer shoe is empty! Forcing cash out...");
            }
            cashout();
            log.log("GAME OVER!");
        }
    }
}


start();
