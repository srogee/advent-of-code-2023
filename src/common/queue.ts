export class Queue<T> {
    private data: T[];
    private startIndex: number;
    private endIndex: number;

    constructor(iterable?: Iterable<T>) {
        this.data = [];
        this.startIndex = 0;
        this.endIndex = 0;

        if (iterable) {
            for (const element of iterable) {
                this.push(element);
            }
        }
    }

    public push(element: T) {
        this.data[this.endIndex] = element;
        this.endIndex++;
    }

    public pop(): T {
        const item = this.data[this.startIndex];
        delete this.data[this.startIndex];
        this.startIndex++;
        return item;
    }

    public peek(): T {
        return this.data[this.startIndex];
    }

    public get length() {
        return this.endIndex - this.startIndex;
    }
}