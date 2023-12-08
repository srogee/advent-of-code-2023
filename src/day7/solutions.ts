import * as path from "path";
import { InputUtil, StringUtil } from "../common/input";
import * as _ from "lodash";

// Shared
const input = InputUtil.load(path.join(__dirname, "input.txt"), true);

const cards = "AKQJT98765432".split("").reverse();
const cardsJokerRule = "AKQT98765432J".split("").reverse();
const handTypes = [
    "5", // Five of a kind
    "41", // Four of a kind
    "32", // Full house
    "311", // Three of a kind
    "221", // Two pair
    "2111", // One pair
    "11111" // High card
].reverse();

interface Hand {
    cards: string[],
    bid: number,
    rank: number
}

// Parse input into hands
function parseInput(input: string[]): Hand[] {
    return input.map(line => {
        const split = line.split(" ", 2);
        return {
            cards: split[0].split(""),
            bid: parseInt(split[1]),
            rank: 0
        }
    });
}

// Gets a string represent
function getHandType(cards: string[], jokerRule: boolean): string {
    // Get a map of each letter to the count of that letter
    const map = new Map<string, number>();
    for (const c of cards) {
        map.set(c, (map.get(c) ?? 0) + 1);
    }

    // If joker rule enabled, calculate its contribution and remove it
    let jokerContribution = 0;
    if (jokerRule) {
        const jokerCount = map.get("J");
        if (jokerCount > 0 && jokerCount < 5) { // If all 5 are jokers, it's a five pair
            jokerContribution = jokerCount;
            map.delete("J");
        }
    }

    const vals = [...map.values()];
    vals.sort((a, b) => b - a);

    // Now add back the joker contribution
    vals[0] += jokerContribution;

    return vals.join("");
}

function getTotalWinnings(input: string[], jokerRule: boolean) {
    const hands = parseInput(input);
    const whichCards = (jokerRule ? cardsJokerRule : cards);
    hands.sort((a, b) => {
        // Determine the hand type and return the difference in strengths if they're different
        const aHandStrength = handTypes.indexOf(getHandType(a.cards, jokerRule));
        const bHandStrength = handTypes.indexOf(getHandType(b.cards, jokerRule));
        if (aHandStrength !== bHandStrength) {
            return aHandStrength - bHandStrength;
        }
    
        // Go through each card in the hand and return the difference in strengths between the first 2 cards that are different
        for (let i = 0; i < 5; i++) {
            const aCardStrength = whichCards.indexOf(a.cards[i]);
            const bCardStrength = whichCards.indexOf(b.cards[i]);
            if (aCardStrength !== bCardStrength) {
                return aCardStrength - bCardStrength;
            }
        }
    
        return 0;
    });
    
    // Rank the cards
    for (let i = 0; i < hands.length; i++) {
        hands[i].rank = i + 1;
    }

    // Calculate total winnings
    return hands.reduce((acc, hand) => acc + (hand.bid * hand.rank), 0);
}

// Solution 1 - Total Winnings
console.log(`Solution #1: ${getTotalWinnings(input, false)}`);

// Solution 2 - Total Winnings (Joker Rule)
console.log(`Solution #2: ${getTotalWinnings(input, true)}`);
