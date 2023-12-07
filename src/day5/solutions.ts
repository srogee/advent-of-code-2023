import * as path from "path";
import { InputUtil, StringUtil } from "../common/input";
import * as _ from "lodash";

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
    private maps: ConceptMap[];

    constructor(input: string[]) {
        this.maps = [];
        let currentConceptMap: ConceptMap | null = null;
        const keyword = " map:";

        const cleanup = () => {
            if (currentConceptMap) {
                this.maps.push(currentConceptMap);
                currentConceptMap.ranges.sort((a, b) => this.sortRangesAsc(a.source, b.source));
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

    public map(ranges: Range[], mapIndex: number = 0): Range[] {
        // Base case - stop recursing, we're done
        if (mapIndex > this.maps.length - 1) {
            return ranges;
        }

        console.log(`Mapping ranges ${this.rangesToStr(ranges)} from ${this.maps[mapIndex].source} to ${this.maps[mapIndex].destination}`)
        const oneToMany = ranges.flatMap(range => this.mapInternalOneToMany(range, mapIndex));
        oneToMany.sort(this.sortRangesAsc);
        return this.map(oneToMany, mapIndex + 1);
    }

    public mapAndGetLowest(ranges: Range[]): number {
        return this.map(ranges)[0].start;
    }

    private addRangeIfValid(rangeArray: Range[], range: Range) {
        if (range && range.start != null && range.end != null && range.start < range.end) {
            rangeArray.push(range);
        }
    }

    private rangeMapToStr(range?: SourceRangeMap) {
        if (range) {
            return `${this.rangeToStr(range.source)}->${this.rangeToStr(range.destination)}`;
        } else {
            return "<none>"
        }
    }

    private rangeToStr(range?: Range) {
        if (range) {
            return `[${range.start},${range.end}]`;
        } else {
            return "<none>"
        }
    }

    private rangeMapsToStr(ranges: SourceRangeMap[]) {
        return ranges.map(e => this.rangeMapToStr(e)).join(", ");
    }

    private rangesToStr(ranges: Range[]) {
        return ranges.map(e => this.rangeToStr(e)).join(", ");
    }

    private mapInternalOneToMany(range: Range, mapIndex: number): Range[] {
        const sourceRanges = this.maps[mapIndex].ranges;
        const startRange = sourceRanges.find(r => r.source.start <= range.start && r.source.end >= range.start);
        const endRange = sourceRanges.find(r => r.source.start <= range.end && r.source.end >= range.end);
        const completelyInsideRanges = sourceRanges.filter(r => r.source.start > range.start && r.source.end < range.end);

        let ret: Range[] = [];

        // Special case - completely inside one range
        if (startRange && endRange && startRange === endRange) {
            const start = startRange.destination.start + range.start - startRange.source.start;
            const end = start + range.end - range.start;
            ret = [{
                start,
                end
            }];
        }
        else {
            this.addRangeIfValid(ret, startRange?.destination);

            // Generate ranges that go in the gaps around the ranges we completely encapsulate
            const firstGapRange = {
                start: Math.max(range.start, startRange?.source.end),
                end: completelyInsideRanges[0]?.source.start
            };
            this.addRangeIfValid(ret, firstGapRange);

            for (let i = 0; i < completelyInsideRanges.length; i++) {
                // Map existing range to dest
                ret.push({
                    start: completelyInsideRanges[i].destination.start,
                    end: completelyInsideRanges[i].destination.end
                });

                // Range between existing ranges
                if (i + 1 < completelyInsideRanges.length) {
                    ret.push({
                        start: completelyInsideRanges[i].source.end,
                        end: completelyInsideRanges[i + 1].source.start
                    });
                }
            }

            if (completelyInsideRanges.length === 0) {
                this.addRangeIfValid(ret, range);
            }

            const lastGapRange = {
                start: completelyInsideRanges[completelyInsideRanges.length - 1]?.source.end,
                end: Math.min(range.end, endRange?.source.start)
            }
            this.addRangeIfValid(ret, lastGapRange);

            this.addRangeIfValid(ret, endRange?.destination);
        }

        console.log(`Input: \t${this.rangeToStr(range)}, Start range: ${this.rangeMapToStr(startRange)}, End range: ${this.rangeMapToStr(endRange)}, Inside: ${this.rangeMapsToStr(completelyInsideRanges)}, Result: ${this.rangesToStr(ret)}`)
        return _.cloneDeep(ret);
    }

    private sortRangesAsc(a: Range, b: Range) {
        return a.start - b.start;
    }
}

const seeds = input[0].split(" ").map(num => parseInt(num)).filter(num => !isNaN(num));
const conceptMapper = new ConceptMapper(input);

// Solution 1 - ???
// const lowest = conceptMapper.mapAndGetLowest(seeds.map(seed => {
//     return {
//         start: seed, end: seed
//     }
// }));
// console.log(`Solution #1: ${lowest}`);

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
