import * as path from "path";
import { InputUtil, StringUtil } from "../common/input";

// Shared
const input = InputUtil.load(path.join(__dirname, "input.txt"), true);
const races = parseInput(input);

interface Race {
    time: number,
    bestDistance: number
}

function parseInput(input: string[]): Race[] {
    const times = parseLine(input[0]);
    const distances = parseLine(input[1]);
    return times.map((t, index) => {
        return {
            time: t,
            bestDistance: distances[index]
        };
    });
}

function parseLine(input: string): number[] {
    const split = input.split(" ");
    return split.map(el => parseInt(el)).filter(el => isFinite(el) && !isNaN(el));
}

// Calculates how many ways there are to win a particular race
function calcWaysToWin(race: Race): number {
    let sum = 0;
    for (let i = 1; i < race.time; i++) {
        if (simulateRace(race, i)) {
            sum++;
        }
    }
    return sum;
}

// Checks if you would win a race given how much time the button is held
function simulateRace(race: Race, timeHeld: number): boolean {
    const travelTime = race.time - timeHeld;
    return travelTime * timeHeld > race.bestDistance;
}

// Solution 1 - Boat Races
const sum = races.reduce((acc, race) => {
    return acc * calcWaysToWin(race);
}, 1);
console.log(`Solution #1: ${sum}`);

// Solution 2 - Single Boat Race
function parseInputPart2(input: string[]): Race {
    return {
        time: parseLinePart2(input[0]),
        bestDistance: parseLinePart2(input[1]),
    }
}

function parseLinePart2(input: string): number {
    const digits = input.split("").filter(c => StringUtil.isDigit(c)).join("");
    return parseInt(digits);
}

const singleRace = parseInputPart2(input);
console.log(`Solution #2: ${calcWaysToWin(singleRace)}`);
