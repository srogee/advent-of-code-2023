import * as path from "path";
import { InputUtil, StringUtil } from "../common/input";

// Shared
const input = InputUtil.load(path.join(__dirname, "input.txt"), true);
let number: string = "";
let numberStartX = -1;
let numberEndX = -1;

// Solution 1 - Sum of part numbers
let partNumberSum = 0;

// Loop through each line, looking for numbers
processInput((x: number, y: number) => {
    if (numberStartX !== -1 && numberEndX === -1) {
        numberEndX = x - 1;

        let anyAdjacentSymbols = false;
        for (let x2 = numberStartX - 1; x2 <= numberEndX + 1; x2++) {
            for (let y2 = y - 1; y2 <= y + 1; y2++) {
                if (isSymbol(x2, y2)) {
                    anyAdjacentSymbols = true;
                    break;
                }
            }

            if (anyAdjacentSymbols) {
                break;
            }
        }

        if (anyAdjacentSymbols) {
            partNumberSum += parseInt(number, 10);
        }

        numberStartX = -1;
        numberEndX = -1;
        number = "";
    }
});

console.log(`Solution #1: ${partNumberSum}`);

// Solution 2 - Sum of gear ratios
let gearRatioSum = 0;
let adjacencyInfo = new Map<number, number[]>();

// Loop through each line, looking for numbers
processInput((x: number, y: number) => {
    if (numberStartX !== -1 && numberEndX === -1) {
        numberEndX = x - 1;

        const parsedNumber = parseInt(number, 10);

        for (let x2 = numberStartX - 1; x2 <= numberEndX + 1; x2++) {
            for (let y2 = y - 1; y2 <= y + 1; y2++) {
                if (isGear(x2, y2)) {
                    const key = y2 * input[y].length + x2; // Unique key for gear
                    if (!adjacencyInfo.has(key)) {
                        adjacencyInfo.set(key, []);
                    }

                    adjacencyInfo.get(key).push(parsedNumber);
                }
            }
        }

        numberStartX = -1;
        numberEndX = -1;
        number = "";
    }
});

// Find gears that have exactly 2 adjacent numbers, and get the sum of the products of those numbers
gearRatioSum = [...adjacencyInfo.values()].reduce((sum, numbers) => {
    return sum + (numbers.length === 2 ? numbers[0] * numbers[1] : 0);
}, 0);

console.log(`Solution #2: ${gearRatioSum}`);

// Check if the character at x,y is a symbol
function isSymbol(x: number, y: number) {
    const char = isInBounds(x, y) ? input[y][x] : ".";
    return char !== "." && !StringUtil.isDigit(char);
}

// Check if the character at x,y is a gear
function isGear(x: number, y: number) {
    return isInBounds(x, y) && input[y][x] === "*";
}

// Check if x,y is in bounds of input array
function isInBounds(x: number, y: number) {
    return x >= 0 && y >= 0 && y < input.length && x < input[y].length;
}

// Process input array using a function that is run for every non-digit character
function processInput(func: (x: number, y: number) => void) {
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            const char = input[y][x];
            if (StringUtil.isDigit(char)) {
                if (numberStartX === -1) {
                    numberStartX = x;
                }
                number += char;
            } else {
                func(x, y);
            }
        }
    
        func(input[y].length - 1, y);
    }
}