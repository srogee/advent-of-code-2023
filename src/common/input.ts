import * as fs from "fs";

export class InputUtil {
    public static load(path: string, removeEmptyLines: boolean = true): string[] {
        const input = fs.readFileSync(path, { encoding: "utf8" });

        return this.split(input, removeEmptyLines);
    }

    public static split(input: string, removeEmptyLines: boolean = true): string[] {
        const lines = input.split(/\r?\n/);

        if (removeEmptyLines) {
            return lines.filter(line => line.length > 0);
        }
        
        return lines;
    }
}

export class StringUtil {
    public static isDigit(char: string): boolean {
        const code = char.charCodeAt(0);
        return code >= 48 && code <= 57;
    }
}