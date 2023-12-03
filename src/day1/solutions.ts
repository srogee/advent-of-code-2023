import * as path from "path";
import { InputUtil, StringUtil } from "../common/input";

// Shared
const input = InputUtil.load(path.join(__dirname, "input.txt"), true);

// Solution 1 - Sum of first and last digits in each line
let sum = input.reduce((acc, line) => {
    const digits = getFirstAndLastDigits(line, false);
    const calibrationValue = parseInt(digits[0] + digits[1]);
    return acc + calibrationValue;
}, 0);

console.log(`Solution #1: ${sum}`);

// Solution 2 - Sum of first and last digits in each line, including spelled out digits
const spelledOutDigits = new Map([
    ["one", "1"],
    ["two", "2"],
    ["three", "3"],
    ["four", "4"],
    ["five", "5"],
    ["six", "6"],
    ["seven", "7"],
    ["eight", "8"],
    ["nine", "9"]
]);

sum = input.reduce((acc, line) => {
    const digits = getFirstAndLastDigits(line, true);
    const calibrationValue = parseInt(digits[0] + digits[1]);
    return acc + calibrationValue;
}, 0);

console.log(`Solution #2: ${sum}`);

// Gets the first and last digits in a string, optionally allowing spelled out digits like "one", "two", etc.
function getFirstAndLastDigits(str: string, allowSpelledOutDigits: boolean): [string, string] {
    const start = 0;
    const end = str.length - 1;
    const digits: [string, string] = ["", ""];

    for (let index = start; index <= end; index++) {
        const char = str[index];
        if (StringUtil.isDigit(char)) {
            // Look for single character digits
            if (digits[0] === "") {
                digits[0] = char;
            }
            digits[1] = char;
        } else if (allowSpelledOutDigits) {
            // Look for spelled out digits like "one", "two" etc
            for (const kvp of spelledOutDigits.entries()) {
                if (str.substring(index, index + kvp[0].length) === kvp[0]) {
                    if (digits[0] === "") {
                        digits[0] = kvp[1];
                    }
                    digits[1] = kvp[1];
                    break;
                }
            }
        }
    }

    return digits;
}