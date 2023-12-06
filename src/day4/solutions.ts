import * as path from "path";
import { InputUtil } from "../common/input";
import { Queue } from "../common/queue";

// Shared
// const input = InputUtil.split(`
// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
// Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
// Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
// Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
// Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
// `);

const input = InputUtil.load(path.join(__dirname, "input.txt"));

interface Card {
    id: number,
    winningNumbers: number[],
    actualNumbers: number[]
}

function parseInput(input: string[]): Card[] {
    return input.map(line => {
        const split1 = line.split("|");
        const split2 = split1[0].split(":");
        const split3 = split2[0].split(" ");
        const id = parseInt(split3[split3.length - 1]);
        return {
            id,
            winningNumbers: parseNumberArray(split2[1]),
            actualNumbers: parseNumberArray(split1[1])
        }
    });
}

function parseNumberArray(input: string): number[] {
    return input.trim().split(" ").filter(piece => piece.length > 0).map(num => parseInt(num));
}

const cards = parseInput(input);

// Solution 1 - ???
const sum = cards.reduce((acc, card) => {
    const winningSet = new Set(card.winningNumbers);
    let winningCount = 0;
    for (const num of card.actualNumbers) {
        if (winningSet.has(num)) {
            winningCount++;
        }
    }
    return acc + (winningCount > 0 ? Math.pow(2, winningCount - 1) : 0);
}, 0);
console.log(`Solution #1: ${sum}`);

// Solution 2 - ???
let sum2 = 0;

// Cache of card win counts, indexed by <Card ID>-1
const cardCache = cards.map(card => calcWinningCountPart2(card));

function calcWinningCountPart2(card: Card) {
    const winningSet = new Set(card.winningNumbers);
    let winningCount = 0;
    for (const num of card.actualNumbers) {
        if (winningSet.has(num)) {
            winningCount++;
        }
    }
    return winningCount;
}

const cardsQueue = new Queue(cards.map(card => card.id));
while (cardsQueue.length > 0) {
    const cardId = cardsQueue.pop();
    sum2++;
    const winningCount = cardCache[cardId - 1];
    for (let i = 1; i <= winningCount; i++) {
        cardsQueue.push(cards[cardId + i - 1].id);
    }
}

console.log(`Solution #2: ${sum2}`);
