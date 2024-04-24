export var isWindows: any;
export var streamRegexp: RegExp;
export declare function copy(source: Object, dest: Object): void;
export declare function args(): {
    (...args: any[]): void;
    clear(): void;
    get(): any[];
    find(arg: any, count: any): any[] | undefined;
    remove(arg: any, count: any): void;
    clone(): any;
};
export declare function makeFilterStrings(filters: string[] | Object[]): string[];
export declare function which(name: string, callback: Function): any;
export declare function timemarkToSeconds(timemark: string): number;
export declare function extractCodecData(command: FfmpegCommand, stderrLine: string, codecsObject: any): boolean;
export declare function extractProgress(command: FfmpegCommand, stderrLine: string): void;
export declare function extractError(stderr: string): string;
export declare function linesRing(maxLines: number): {
    callback: (cb: any) => void;
    append: (str: any) => void;
    get: () => string;
    close: () => void;
};
//# sourceMappingURL=utils.d.ts.map