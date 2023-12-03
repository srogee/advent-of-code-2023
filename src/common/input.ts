import * as fs from "fs";

export class InputUtil {
    public static load(path: string, removeEmptyLines?: boolean): string[] {
        const input = fs.readFileSync(path, { encoding: "utf8" }).split(/\r?\n/);

        if (removeEmptyLines) {
            return input.filter(line => line.length > 0);
        }
        
        return input;
    }
}

export class StringUtil {
    public static isDigit(char: string): boolean {
        const code = char.charCodeAt(0);
        return code >= 48 && code <= 57;
    }
}