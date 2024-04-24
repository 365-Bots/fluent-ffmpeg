export = FfmpegCommand;
/**
 * Create an ffmpeg command
 *
 * Can be called with or without the 'new' operator, and the 'input' parameter
 * may be specified as 'options.source' instead (or passed later with the
 * addInput method).
 *
 * @constructor
 * @param {String|ReadableStream} [input] input file path or readable stream
 * @param {Object} [options] command options
 * @param {Object} [options.logger=<no logging>] logger object with 'error', 'warning', 'info' and 'debug' methods
 * @param {Number} [options.niceness=0] ffmpeg process niceness, ignored on Windows
 * @param {Number} [options.priority=0] alias for `niceness`
 * @param {String} [options.presets="fluent-ffmpeg/lib/presets"] directory to load presets from
 * @param {String} [options.preset="fluent-ffmpeg/lib/presets"] alias for `presets`
 * @param {String} [options.stdoutLines=100] maximum lines of ffmpeg output to keep in memory, use 0 for unlimited
 * @param {Number} [options.timeout=<no timeout>] ffmpeg processing timeout in seconds
 * @param {String|ReadableStream} [options.source=<no input>] alias for the `input` parameter
 */
declare function FfmpegCommand(input?: string | ReadableStream<any> | undefined, options?: {
    logger?: Object | undefined;
} | undefined): FfmpegCommand;
declare class FfmpegCommand {
    /**
     * Create an ffmpeg command
     *
     * Can be called with or without the 'new' operator, and the 'input' parameter
     * may be specified as 'options.source' instead (or passed later with the
     * addInput method).
     *
     * @constructor
     * @param {String|ReadableStream} [input] input file path or readable stream
     * @param {Object} [options] command options
     * @param {Object} [options.logger=<no logging>] logger object with 'error', 'warning', 'info' and 'debug' methods
     * @param {Number} [options.niceness=0] ffmpeg process niceness, ignored on Windows
     * @param {Number} [options.priority=0] alias for `niceness`
     * @param {String} [options.presets="fluent-ffmpeg/lib/presets"] directory to load presets from
     * @param {String} [options.preset="fluent-ffmpeg/lib/presets"] alias for `presets`
     * @param {String} [options.stdoutLines=100] maximum lines of ffmpeg output to keep in memory, use 0 for unlimited
     * @param {Number} [options.timeout=<no timeout>] ffmpeg processing timeout in seconds
     * @param {String|ReadableStream} [options.source=<no input>] alias for the `input` parameter
     */
    constructor(input?: string | ReadableStream<any> | undefined, options?: {
        logger?: Object | undefined;
    } | undefined);
    _inputs: any[] | undefined;
    _outputs: any[] | undefined;
    options: {
        logger?: Object | undefined;
    } | undefined;
    logger: Object | {
        debug: () => void;
        info: () => void;
        warn: () => void;
        error: () => void;
    } | undefined;
    /**
     * Clone an ffmpeg command
     *
     * This method is useful when you want to process the same input multiple times.
     * It returns a new FfmpegCommand instance with the exact same options.
     *
     * All options set _after_ the clone() call will only be applied to the instance
     * it has been called on.
     *
     * @example
     *   var command = ffmpeg('/path/to/source.avi')
     *     .audioCodec('libfaac')
     *     .videoCodec('libx264')
     *     .format('mp4');
     *
     *   command.clone()
     *     .size('320x200')
     *     .save('/path/to/output-small.mp4');
     *
     *   command.clone()
     *     .size('640x400')
     *     .save('/path/to/output-medium.mp4');
     *
     *   command.save('/path/to/output-original-size.mp4');
     *
     * @method FfmpegCommand#clone
     * @return FfmpegCommand
     */
    clone(): FfmpegCommand;
}
declare namespace FfmpegCommand {
    function setFfmpegPath(path: any): void;
    function setFfprobePath(path: any): void;
    function setFlvtoolPath(path: any): void;
    function availableFilters(callback: any): void;
    function getAvailableFilters(callback: any): void;
    function availableCodecs(callback: any): void;
    function getAvailableCodecs(callback: any): void;
    function availableFormats(callback: any): void;
    function getAvailableFormats(callback: any): void;
    function availableEncoders(callback: any): void;
    function getAvailableEncoders(callback: any): void;
    function ffprobe(file: any, ...args: any[]): void;
}
//# sourceMappingURL=fluent-ffmpeg.d.ts.map