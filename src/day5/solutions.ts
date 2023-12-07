import * as path from "path";
import { InputUtil } from "../common/input";

// Shared
const input = InputUtil.load(path.join(__dirname, "input.txt"), true);

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
    private maps: ConceptMap[];

    // Given the input, parses it and generates data structure
    constructor(input: string[]) {
        this.maps = [];
        let currentConceptMap: ConceptMap | null = null;
        const keyword = " map:";

        const addMap = () => {
            if (currentConceptMap) {
                this.maps.push(currentConceptMap);
                currentConceptMap.ranges.sort((a, b) => this.sortRangesAsc(a.source, b.source));
                currentConceptMap = null;
            }
        }

        for (const line of input) {
            if (line.includes(keyword)) {
                addMap();

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

        addMap();
    }

    // Map a range or ranges all the way from seed to location, and return the possible ranges
    public map(ranges: Range[], mapIndex: number = 0): Range[] {
        // Base case - stop recursing, we're done
        if (mapIndex > this.maps.length - 1) {
            return ranges;
        }

        // Map ranges, clean up, then recurse
        const oneToMany = ranges.flatMap(range => this.mapInternalOneToMany(range, mapIndex));
        oneToMany.sort(this.sortRangesAsc);
        return this.map(oneToMany, mapIndex + 1);
    }

    // Map a range or ranges all the way from seed to location, and return the lowest possible
    public mapAndGetLowest(ranges: Range[]): number {
        return this.map(ranges)[0].start;
    }

    // Map a single range to one or more ranges (e.g. seed to soil)
    private mapInternalOneToMany(testRange: Range, mapIndex: number): Range[] {
        // Find all ranges intersecting with the test range
        const intersectingRanges = this.maps[mapIndex].ranges.filter(r => testRange.end >= r.source.start && testRange.start <= r.source.end);

        // Start with the intersecting ranges, clamp them if appropriate to the test range, and flag which ones are clamped
        let startClampedRange: SourceRangeMap = null;
        let endClampedRange: SourceRangeMap = null;
        let ret: Range[] = intersectingRanges.map(r => {
            let start = r.destination.start;
            let end = r.destination.end;
            if (r.source.start < testRange.start) {
                startClampedRange = r;
                start = r.destination.start + testRange.start - r.source.start;
            }
            if (r.source.end > testRange.end) {
                endClampedRange = r;
                end = r.destination.end + testRange.end - r.source.end
            }
            return {
                start,
                end
            }
        });

        if (intersectingRanges.length === 0) {
            // No intersections, just return what was passed in
            ret = [testRange];
        } else {
            // Before ranges
            if (startClampedRange === null) {
                ret.push({
                    start: testRange.start,
                    end: intersectingRanges[0].source.start - 1
                });
            }

            // In between ranges
            for (let i = 0; i + 1 < intersectingRanges.length; i++) {
                ret.push({
                    start: intersectingRanges[i].source.end + 1,
                    end: intersectingRanges[i + 1].source.start - 1,
                });
            }

            // After ranges
            if (endClampedRange === null) {
                ret.push({
                    start: intersectingRanges[0].source.end + 1,
                    end: testRange.end
                });
            }
        }

        // Remove invalid ranges
        return ret.filter(r => r.start <= r.end);
    }

    // Sort two ranges by their start numbers
    private sortRangesAsc(a: Range, b: Range) {
        return a.start - b.start;
    }
}

const seeds = input[0].split(" ").map(num => parseInt(num)).filter(num => !isNaN(num));
const conceptMapper = new ConceptMapper(input);

// Solution 1 - ???
const lowest = conceptMapper.mapAndGetLowest(seeds.map(seed => {
    return {
        start: seed, end: seed
    }
}));
console.log(`Solution #1: ${lowest}`);

// Solution 2 - ???
const seedRanges: Range[] = [];
for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push({
        start: seeds[i],
        end: seeds[i] + seeds[i + 1] - 1
    });
}

const lowest2 = conceptMapper.mapAndGetLowest(seedRanges);
console.log(`Solution #2: ${lowest2}`);
