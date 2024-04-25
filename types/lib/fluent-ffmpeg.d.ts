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
export class FfmpegCommand {
    static setFfmpegPath(path: any): void;
    static setFfprobePath(path: any): void;
    static setFlvtoolPath(path: any): void;
    static getAvailableFilters(callback: any): void;
    static getAvailableCodecs(callback: any): void;
    static getAvailableFormats(callback: any): void;
    static getAvailableEncoders(callback: any): void;
    static ffprobe(file: any, ...args: any[]): void;
    constructor(input: any, options: any);
    _inputs: any[];
    _outputs: any[];
    options: any;
    logger: any;
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
     * @returns {FfmpegCommand}
     */
    clone(): FfmpegCommand;
    /**
    * Disable audio in the output
    *
    * @method FfmpegCommand#noAudio
    * @category Audio
    * @alias FfmpegCommand#withNoAudio
    * @returns {FfmpegCommand}
    */
    noAudio(): FfmpegCommand;
    /**
     * Specify audio codec
     *
     * @method FfmpegCommand#audioCodec
     * @category Audio
     * @alias withAudioCodec
     *
     * @param {String} codec audio codec name
     * @returns {FfmpegCommand}
     */
    audioCodec(codec: string): FfmpegCommand;
    /**
     * Specify audio bitrate
     *
     * @method FfmpegCommand#audioBitrate
     * @category Audio
     * @alias withAudioBitrate
     *
     * @param {String|Number} bitrate audio bitrate in kbps (with an optional 'k' suffix)
     * @returns {FfmpegCommand}
     */
    audioBitrate(bitrate: string | number): FfmpegCommand;
    /**
     * Specify audio channel count
     *
     * @method FfmpegCommand#audioChannels
     * @category Audio
     * @alias withAudioChannels
     *
     * @param {Number} channels channel count
     * @returns {FfmpegCommand}
     */
    audioChannels(channels: number): FfmpegCommand;
    /**
     * Specify audio frequency
     *
     * @method FfmpegCommand#audioFrequency
     * @category Audio
     * @alias withAudioFrequency
     *
     * @param {Number} freq audio frequency in Hz
     * @returns {FfmpegCommand}
     */
    audioFrequency(freq: number): FfmpegCommand;
    /**
     * Specify audio quality
     *
     * @method FfmpegCommand#audioQuality
     * @category Audio
     * @aliases withAudioQuality
     *
     * @param {Number} quality audio quality factor
     * @returns {FfmpegCommand}
     */
    audioQuality(quality: number): FfmpegCommand;
    /**
     * Specify custom audio filter(s)
     *
     * Can be called both with one or many filters, or a filter array.
     *
     * @example
     * command.audioFilters('filter1');
     *
     * @example
     * command.audioFilters('filter1', 'filter2=param1=value1:param2=value2');
     *
     * @example
     * command.audioFilters(['filter1', 'filter2']);
     *
     * @example
     * command.audioFilters([
     *   {
     *     filter: 'filter1'
     *   },
     *   {
     *     filter: 'filter2',
     *     options: 'param=value:param=value'
     *   }
     * ]);
     *
     * @example
     * command.audioFilters(
     *   {
     *     filter: 'filter1',
     *     options: ['value1', 'value2']
     *   },
     *   {
     *     filter: 'filter2',
     *     options: { param1: 'value1', param2: 'value2' }
     *   }
     * );
     *
     * @method FfmpegCommand#audioFilters
     * @aliases withAudioFilter,withAudioFilters,audioFilter
     * @category Audio
     *
     * @param {...String|String[]|Object[]} filters audio filter strings, string array or
     *   filter specification array, each with the following properties:
     * @param {String} filters.filter filter name
     * @param {String|String[]|Object} [filters.options] filter option string, array, or object
     * @returns {FfmpegCommand}
     */
    audioFilters(filters: (string | string[] | Object[])[]): FfmpegCommand;
    /**
     * Add custom input option(s)
     *
     * When passing a single string or an array, each string containing two
     * words is split (eg. inputOptions('-option value') is supported) for
     * compatibility reasons.  This is not the case when passing more than
     * one argument.
     *
     * @example
     * command.inputOptions('option1');
     *
     * @example
     * command.inputOptions('option1', 'option2');
     *
     * @example
     * command.inputOptions(['option1', 'option2']);
     *
     * @method FfmpegCommand#inputOptions
     * @category Custom options
     * @aliases addInputOption,addInputOptions,withInputOption,withInputOptions,inputOption
     *
     * @param {...String} options option string(s) or string array
     * @returns {FfmpegCommand}
     */
    inputOptions(options: string[]): FfmpegCommand;
    /**
     * Add custom output option(s)
     *
     * @example
     * command.outputOptions('option1');
     *
     * @example
     * command.outputOptions('option1', 'option2');
     *
     * @example
     * command.outputOptions(['option1', 'option2']);
     *
     * @method FfmpegCommand#outputOptions
     * @category Custom options
     * @aliases addOutputOption,addOutputOptions,addOption,addOptions,withOutputOption,withOutputOptions,withOption,withOptions,outputOption
     *
     * @param {...String} options option string(s) or string array
     * @returns {FfmpegCommand}
     */
    outputOptions(options: string[]): FfmpegCommand;
    /**
     * Specify a complex filtergraph
     *
     * Calling this method will override any previously set filtergraph, but you can set
     * as many filters as needed in one call.
     *
     * @example <caption>Overlay an image over a video (using a filtergraph string)</caption>
     *   ffmpeg()
     *     .input('video.avi')
     *     .input('image.png')
     *     .complexFilter('[0:v][1:v]overlay[out]', ['out']);
     *
     * @example <caption>Overlay an image over a video (using a filter array)</caption>
     *   ffmpeg()
     *     .input('video.avi')
     *     .input('image.png')
     *     .complexFilter([{
     *       filter: 'overlay',
     *       inputs: ['0:v', '1:v'],
     *       outputs: ['out']
     *     }], ['out']);
     *
     * @example <caption>Split video into RGB channels and output a 3x1 video with channels side to side</caption>
     *  ffmpeg()
     *    .input('video.avi')
     *    .complexFilter([
     *      // Duplicate video stream 3 times into streams a, b, and c
     *      { filter: 'split', options: '3', outputs: ['a', 'b', 'c'] },
     *
     *      // Create stream 'red' by cancelling green and blue channels from stream 'a'
     *      { filter: 'lutrgb', options: { g: 0, b: 0 }, inputs: 'a', outputs: 'red' },
     *
     *      // Create stream 'green' by cancelling red and blue channels from stream 'b'
     *      { filter: 'lutrgb', options: { r: 0, b: 0 }, inputs: 'b', outputs: 'green' },
     *
     *      // Create stream 'blue' by cancelling red and green channels from stream 'c'
     *      { filter: 'lutrgb', options: { r: 0, g: 0 }, inputs: 'c', outputs: 'blue' },
     *
     *      // Pad stream 'red' to 3x width, keeping the video on the left, and name output 'padded'
     *      { filter: 'pad', options: { w: 'iw*3', h: 'ih' }, inputs: 'red', outputs: 'padded' },
     *
     *      // Overlay 'green' onto 'padded', moving it to the center, and name output 'redgreen'
     *      { filter: 'overlay', options: { x: 'w', y: 0 }, inputs: ['padded', 'green'], outputs: 'redgreen'},
     *
     *      // Overlay 'blue' onto 'redgreen', moving it to the right
     *      { filter: 'overlay', options: { x: '2*w', y: 0 }, inputs: ['redgreen', 'blue']},
     *    ]);
     *
     * @method FfmpegCommand#complexFilter
     * @category Custom options
     * @aliases filterGraph
     *
     * @param {String|Array} spec filtergraph string or array of filter specification
     *   objects, each having the following properties:
     * @param {String} spec.filter filter name
     * @param {String|Array} [spec.inputs] (array of) input stream specifier(s) for the filter,
     *   defaults to ffmpeg automatically choosing the first unused matching streams
     * @param {String|Array} [spec.outputs] (array of) output stream specifier(s) for the filter,
     *   defaults to ffmpeg automatically assigning the output to the output file
     * @param {Object|String|Array} [spec.options] filter options, can be omitted to not set any options
     * @param {Array} [map] (array of) stream specifier(s) from the graph to include in
     *   ffmpeg output, defaults to ffmpeg automatically choosing the first matching streams.
     * @returns {FfmpegCommand}
     */
    complexFilter(spec: string | any[]): FfmpegCommand;
    /**
     * Add an input to command
     *
     * Also switches "current input", that is the input that will be affected
     * by subsequent input-related methods.
     *
     * Note: only one stream input is supported for now.
     *
     * @method FfmpegCommand#input
     * @category Input
     * @aliases mergeAdd,addInput
     *
     * @param {String|Readable} source input file path or readable stream
     * @returns {FfmpegCommand}
     */
    input(source: string | Readable): FfmpegCommand;
    /**
     * Specify input format for the last specified input
     *
     * @method FfmpegCommand#inputFormat
     * @category Input
     * @aliases withInputFormat,fromFormat
     *
     * @param {String} format input format
     * @returns {FfmpegCommand}
     */
    inputFormat(format: string): FfmpegCommand;
    /**
     * Specify input FPS for the last specified input
     * (only valid for raw video formats)
     *
     * @method FfmpegCommand#inputFps
     * @category Input
     * @aliases withInputFps,withInputFPS,withFpsInput,withFPSInput,inputFPS,inputFps,fpsInput
     *
     * @param {Number} fps input FPS
     * @returns {FfmpegCommand}
     */
    inputFps(fps: number): FfmpegCommand;
    /**
     * Use native framerate for the last specified input
     *
     * @method FfmpegCommand#native
     * @category Input
     * @aliases nativeFramerate,withNativeFramerate
     *
     * @return FfmmegCommand
     */
    native(): void;
    /**
     * Specify input seek time for the last specified input
     *
     * @method FfmpegCommand#seekInput
     * @category Input
     * @aliases setStartTime,seekTo
     *
     * @param {String|Number} seek seek time in seconds or as a '[hh:[mm:]]ss[.xxx]' string
     * @returns {FfmpegCommand}
     */
    seekInput(seek: string | number): FfmpegCommand;
    /**
     * Loop over the last specified input
     *
     * @method FfmpegCommand#loop
     * @category Input
     *
     * @param {String|Number} [duration] loop duration in seconds or as a '[[hh:]mm:]ss[.xxx]' string
     * @returns {FfmpegCommand}
     */
    loop(duration?: string | number | undefined): FfmpegCommand;
    /**
     * Use preset
     *
     * @method FfmpegCommand#preset
     * @category Miscellaneous
     * @aliases usingPreset
     *
     * @param {String|Function} preset preset name or preset function
     */
    preset(preset: string | Function): void;
    /**
     * Add output
     *
     * @method FfmpegCommand#output
     * @category Output
     * @aliases addOutput
     *
     * @param {String|Writable} target target file path or writable stream
     * @param {Object} [pipeopts={}] pipe options (only applies to streams)
     * @returns {FfmpegCommand}
     */
    output(target: string | Writable, pipeopts?: Object | undefined): FfmpegCommand;
    /**
     * Specify output seek time
     *
     * @method FfmpegCommand#seek
     * @category Input
     * @aliases seekOutput
     *
     * @param {String|Number} seek seek time in seconds or as a '[hh:[mm:]]ss[.xxx]' string
     * @returns {FfmpegCommand}
     */
    seek(seek: string | number): FfmpegCommand;
    /**
     * Set output duration
     *
     * @method FfmpegCommand#duration
     * @category Output
     * @aliases withDuration,setDuration
     *
     * @param {String|Number} duration duration in seconds or as a '[[hh:]mm:]ss[.xxx]' string
     * @returns {FfmpegCommand}
     */
    duration(duration: string | number): FfmpegCommand;
    /**
     * Set output format
     *
     * @method FfmpegCommand#format
     * @category Output
     * @aliases toFormat,withOutputFormat,outputFormat
     *
     * @param {String} format output format name
     * @returns {FfmpegCommand}
     */
    format(format: string): FfmpegCommand;
    /**
     * Add stream mapping to output
     *
     * @method FfmpegCommand#map
     * @category Output
     *
     * @param {String} spec stream specification string, with optional square brackets
     * @returns {FfmpegCommand}
     */
    map(spec: string): FfmpegCommand;
    /**
     * Run flvtool2/flvmeta on output
     *
     * @method FfmpegCommand#flvmeta
     * @category Output
     * @aliases updateFlvMetadata
     *
     * @returns {FfmpegCommand}
     */
    flvmeta(): FfmpegCommand;
    /**
     * Disable video in the output
     *
     * @method FfmpegCommand#noVideo
     * @category Video
     * @aliases withNoVideo
     *
     * @returns {FfmpegCommand}
     */
    noVideo(): FfmpegCommand;
    /**
     * Specify video codec
     *
     * @method FfmpegCommand#videoCodec
     * @category Video
     * @aliases withVideoCodec
     *
     * @param {String} codec video codec name
     * @returns {FfmpegCommand}
     */
    videoCodec(codec: string): FfmpegCommand;
    /**
     * Specify video bitrate
     *
     * @method FfmpegCommand#videoBitrate
     * @category Video
     * @aliases withVideoBitrate
     *
     * @param {String|Number} bitrate video bitrate in kbps (with an optional 'k' suffix)
     * @param {Boolean} [constant=false] enforce constant bitrate
     * @returns {FfmpegCommand}
     */
    videoBitrate(bitrate: string | number, constant?: boolean | undefined): FfmpegCommand;
    /**
     * Specify custom video filter(s)
     *
     * Can be called both with one or many filters, or a filter array.
     *
     * @example
     * command.videoFilters('filter1');
     *
     * @example
     * command.videoFilters('filter1', 'filter2=param1=value1:param2=value2');
     *
     * @example
     * command.videoFilters(['filter1', 'filter2']);
     *
     * @example
     * command.videoFilters([
     *   {
     *     filter: 'filter1'
     *   },
     *   {
     *     filter: 'filter2',
     *     options: 'param=value:param=value'
     *   }
     * ]);
     *
     * @example
     * command.videoFilters(
     *   {
     *     filter: 'filter1',
     *     options: ['value1', 'value2']
     *   },
     *   {
     *     filter: 'filter2',
     *     options: { param1: 'value1', param2: 'value2' }
     *   }
     * );
     *
     * @method FfmpegCommand#videoFilters
     * @category Video
     * @aliases withVideoFilter,withVideoFilters,videoFilter
     *
     * @param {...String|String[]|Object[]} filters video filter strings, string array or
     *   filter specification array, each with the following properties:
     * @param {String} filters.filter filter name
     * @param {String|String[]|Object} [filters.options] filter option string, array, or object
     * @returns {FfmpegCommand}
     */
    videoFilters(filters: (string | string[] | Object[])[]): FfmpegCommand;
    /**
     * Specify output FPS
     *
     * @method FfmpegCommand#fps
     * @category Video
     * @aliases withOutputFps,withOutputFPS,withFpsOutput,withFPSOutput,withFps,withFPS,outputFPS,outputFps,fpsOutput,FPSOutput,FPS
     *
     * @param {Number} fps output FPS
     * @returns {FfmpegCommand}
     */
    fps(fps: number): FfmpegCommand;
    /**
     * Only transcode a certain number of frames
     *
     * @method FfmpegCommand#frames
     * @category Video
     * @aliases takeFrames,withFrames
     *
     * @param {Number} frames frame count
     * @returns {FfmpegCommand}
     */
    frames(frames: number): FfmpegCommand;
    /**
     * Keep display aspect ratio
     *
     * This method is useful when converting an input with non-square pixels to an output format
     * that does not support non-square pixels.  It rescales the input so that the display aspect
     * ratio is the same.
     *
     * @method FfmpegCommand#keepDAR
     * @category Video size
     * @aliases keepPixelAspect,keepDisplayAspect,keepDisplayAspectRatio
     *
     * @returns {FfmpegCommand}
     */
    keepPixelAspect(): FfmpegCommand;
    /**
     * Set output size
     *
     * The 'size' parameter can have one of 4 forms:
     * - 'X%': rescale to xx % of the original size
     * - 'WxH': specify width and height
     * - 'Wx?': specify width and compute height from input aspect ratio
     * - '?xH': specify height and compute width from input aspect ratio
     *
     * Note: both dimensions will be truncated to multiples of 2.
     *
     * @method FfmpegCommand#size
     * @category Video size
     * @aliases withSize,setSize
     *
     * @param {String} size size string, eg. '33%', '320x240', '320x?', '?x240'
     * @returns {FfmpegCommand}
     */
    size(size: string): FfmpegCommand;
    /**
     * Set output aspect ratio
     *
     * @method FfmpegCommand#aspect
     * @category Video size
     * @aliases withAspect,withAspectRatio,setAspect,setAspectRatio,aspectRatio
     *
     * @param {String|Number} aspect aspect ratio (number or 'X:Y' string)
     * @returns {FfmpegCommand}
     */
    aspect(aspect: string | number): FfmpegCommand;
    /**
     * Enable auto-padding the output
     *
     * @method FfmpegCommand#autopad
     * @category Video size
     * @aliases applyAutopadding,applyAutoPadding,applyAutopad,applyAutoPad,withAutopadding,withAutoPadding,withAutopad,withAutoPad,autoPad
     *
     * @param {Boolean} [pad=true] enable/disable auto-padding
     * @param {String} [color='black'] pad color
     */
    autopad(pad?: boolean | undefined, color?: string | undefined): void;
}
//# sourceMappingURL=fluent-ffmpeg.d.ts.map