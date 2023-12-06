import * as path from "path";
import { InputUtil, StringUtil } from "../common/input";

// Shared
const input = InputUtil.load(path.join(__dirname, "testinput.txt"), true);

type Concept = "seed" | "soil" | "fertilizer" | "water" | "light" | "temperature" | "humidity" | "location";

interface ConceptMap {
    source: Concept;
    destination: Concept;
    ranges: SourceRangeMap[];
}

interface SourceRangeMap {
    destination: Range
    source: Range
}

interface Range {
    start: number,
    end: number
}

class ConceptMapper {
    private maps: Map<Concept, ConceptMap>;

    constructor(input: string[]) {
        this.maps = new Map();
        let currentConceptMap: ConceptMap | null = null;
        const keyword = " map:";

        const cleanup = () => {
            if (currentConceptMap) {
                this.maps.set(currentConceptMap.source, currentConceptMap);
                currentConceptMap = null;
            }
        }

        for (const line of input) {
            if (line.includes(keyword)) {
                cleanup();

                const pieces = line.split(" ")[0].split("-to-") as Concept[];

                currentConceptMap = {
                    source: pieces[0],
                    destination: pieces[1],
                    ranges: []
                }
            } else if (currentConceptMap) {
                const numbers = line.split(" ").map(num => parseInt(num));
                if (numbers.length === 3) {
                    const range: SourceRangeMap = {
                        destination: {
                            start: numbers[0],
                            end: numbers[0] + numbers[2] - 1
                        },
                        source: {
                            start: numbers[1],
                            end: numbers[1] + numbers[2] - 1,
                        }
                    };

                    currentConceptMap.ranges.push(range);
                }
            }
        }

        cleanup();
    }

    public map(value: number, source: Concept, destination: Concept): number {
        const conceptMap = this.maps.get(source);
        if (conceptMap && conceptMap.destination === destination) {
            for (const range of conceptMap.ranges) {
                if (value >= range.source.start && value <= range.source.end) {
                    return range.destination.start + value - range.source.start;
                }
            }

            return value;
        } else {
            throw new Error(`Could not find map ${source}-to-${destination}`);
        }
    }

    // public mapRange(range: Range, source: Concept, destination: Concept): Range[] {
    //     const conceptMap = this.maps.get(source);
    //     if (conceptMap && conceptMap.destination === destination) {
    //         const existingRangesSorted = conceptMap.ranges.filter(range2 => range2.source.start >= range.start && range2.source.end <= range.end);
    //         existingRangesSorted.sort((a, b) => a.source.start - b.source.start);
    //     } else {
    //         throw new Error(`Could not find map ${source}-to-${destination}`);
    //     }
    // }

    public mapMulti(seed: number, path: Concept[]): number {
        let value = seed;
        for (let i = 0; i < path.length - 1; i++) {
            value = this.map(value, path[i], path[i + 1]);
        }
        return value;
    }
}

const seeds = input[0].split(" ").map(num => parseInt(num)).filter(num => !isNaN(num));
const conceptMapper = new ConceptMapper(input);
const seedToLocation: Concept[] = ["seed", "soil", "fertilizer", "water", "light", "temperature", "humidity", "location"];

// Solution 1 - ???
let min: number | null = null;
for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    const location = conceptMapper.mapMulti(seed, seedToLocation);
    if (min === null || location < min) {
        min = location;
    }
}
console.log(`Solution #1: ${min}`);

// Solution 2 - ???
min = null;
for (let i = 0; i < seeds.length; i += 2) {
    for (let j = 0; j < seeds[i + 1]; j++) {
        const seed = seeds[i] + j;
        const location = conceptMapper.mapMulti(seed, seedToLocation);
        if (min === null || location < min) {
            min = location;
        }
    }
}

console.log(`Solution #2: ${min}`);
