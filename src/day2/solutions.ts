import * as path from "path";
import { InputUtil } from "../common/input";

// Shared
export interface Game {
    id: number,
    rounds: CubeSet[]
}

export interface CubeSet {
    red: number,
    green: number,
    blue: number
}

const input = InputUtil.load(path.join(__dirname, "input.txt"), true);
const games = parseInput(input);

// Solution 1 - Sum of IDs of possible games
const possible: CubeSet = {
    red: 12,
    green: 13,
    blue: 14
}

// Get all games that are actually possible
const possibleGames = games.filter(game => {
    return game.rounds.every(round => round.red <= possible.red && round.blue <= possible.blue && round.green <= possible.green);
});

let sum = possibleGames.reduce((acc, game) => acc + game.id, 0);
console.log(sum);

// Solution 2 - Sum of powers of min possible sets
interface GameMinPossible extends Game {
    minPossible: CubeSet
}

const gamesMinPossible = getMinPossible(games);
sum = gamesMinPossible.reduce((acc, game) => acc + getPower(game.minPossible), 0);
console.log(sum);

// Gets the min number of cubes to play each round of each game
function getMinPossible(games: Game[]): GameMinPossible[] {
    return games.map(game => {
        const minPossible: CubeSet = {
            red: 0,
            green: 0,
            blue: 0
        };

        for (const round of game.rounds) {
            // Set minPossible.red / green / blue to the max of each round
            for (const propName of Object.getOwnPropertyNames(round)) {
                minPossible[propName] = Math.max(round[propName], minPossible[propName]);
            }
        }

        return {
            ...game,
            minPossible
        }
    });
}

// Gets the power of a cube set (all elements multiplied together)
function getPower(cubeSet: CubeSet) {
    return cubeSet.red * cubeSet.green * cubeSet.blue;
}

// Parses input into an array of Game objects
export function parseInput(input: string[]): Game[] {
    const gameKeyword = "Game ";
    const gameInfoDelim = ":";
    const roundDelim = ";";
    const cubeColorDelim = ",";

    return input.map(line => {
        // Split out game id and the rest of the game info
        const pieces = line.split(gameInfoDelim);
        const id = parseInt(pieces[0].substring(gameKeyword.length));

        // Split out per-round info
        const roundPieces = pieces[1].split(roundDelim);
        const rounds = roundPieces.map(roundPiece => {
            let round = {
                red: 0,
                green: 0,
                blue: 0,
            }

            // Split out per-cube info
            const cubePieces = roundPiece.split(cubeColorDelim);
            for (const cubePiece of cubePieces) {
                const trimmed = cubePiece.trim();
                const value = parseInt(trimmed);
                for (const propName of Object.getOwnPropertyNames(round)) {
                    if (trimmed.endsWith(propName)) {
                        round[propName] += value;
                        break;
                    }
                }
            }

            return round;
        });

        return {
            id,
            rounds,
        }
    });
}