/*jshint node:true*/
'use strict';

const path = require('path');
const util = require('util');
const { EventEmitter } = require('events');

const utils = require('./utils');
var ARGLISTS = ['_global', '_audio', '_audioFilters', '_video', '_videoFilters', '_sizeFilters', '_complexFilters'];


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
class FfmpegCommand extends EventEmitter {
    constructor(input, options) {
        // EventEmitter.call(this);

        if (typeof input === 'object' && !('readable' in input)) {
            // Options object passed directly
            options = input;
        } else {
            // Input passed first
            options = options || {};
            options.source = input;
        }

        // Add input if present
        this._inputs = [];
        if (options.source) {
            this.input(options.source);
        }

        // Add target-less output for backwards compatibility
        this._outputs = [];
        this.output();

        // Create argument lists
        var self = this;
        ['_global', '_complexFilters'].forEach(function (prop) {
            self[prop] = utils.args();
        });

        // Set default option values
        options.stdoutLines = 'stdoutLines' in options ? options.stdoutLines : 100;
        options.presets = options.presets || options.preset || path.join(__dirname, 'presets');
        options.niceness = options.niceness || options.priority || 0;

        // Save options
        this.options = options;

        // Setup logger
        this.logger = options.logger || {
            debug: function () { },
            info: function () { },
            warn: function () { },
            error: function () { }
        };
    }
    static setFfmpegPath(path) {
        (new FfmpegCommand()).setFfmpegPath(path);
    }
    static setFfprobePath(path) {
        (new FfmpegCommand()).setFfprobePath(path);
    }
    static setFlvtoolPath(path) {
        (new FfmpegCommand()).setFlvtoolPath(path);
    }
    static getAvailableFilters(callback) {
        (new FfmpegCommand()).availableFilters(callback);
    }
    static getAvailableCodecs(callback) {
        (new FfmpegCommand()).availableCodecs(callback);
    }
    static getAvailableFormats(callback) {
        (new FfmpegCommand()).availableFormats(callback);
    }
    static getAvailableEncoders(callback) {
        (new FfmpegCommand()).availableEncoders(callback);
    }
    static ffprobe(file) {
        var instance = new FfmpegCommand(file);
        instance.ffprobe.apply(instance, Array.prototype.slice.call(arguments, 1));
    }
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
    clone() {
        var clone = new FfmpegCommand();
        var self = this;

        // Clone options and logger
        clone.options = this.options;
        clone.logger = this.logger;

        // Clone inputs
        clone._inputs = this._inputs.map(function (input) {
            return {
                source: input.source,
                options: input.options.clone()
            };
        });

        // Create first output
        if ('target' in this._outputs[0]) {
            // We have outputs set, don't clone them and create first output
            clone._outputs = [];
            clone.output();
        } else {
            // No outputs set, clone first output options
            clone._outputs = [
                clone._currentOutput = {
                    flags: {}
                }
            ];

            ['audio', 'audioFilters', 'video', 'videoFilters', 'sizeFilters', 'options'].forEach(function (key) {
                clone._currentOutput[key] = self._currentOutput[key].clone();
            });

            if (this._currentOutput.sizeData) {
                clone._currentOutput.sizeData = {};
                utils.copy(this._currentOutput.sizeData, clone._currentOutput.sizeData);
            }

            utils.copy(this._currentOutput.flags, clone._currentOutput.flags);
        }

        // Clone argument lists
        ['_global', '_complexFilters'].forEach(function (prop) {
            clone[prop] = self[prop].clone();
        });

        return clone;
    }

    // submodule methods
    /**
    * Disable audio in the output
    *
    * @method FfmpegCommand#noAudio
    * @category Audio
    * @alias FfmpegCommand#withNoAudio
    * @returns {FfmpegCommand}
    */
    noAudio() {
        throw new Error('Not implemented');
    }

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
    audioCodec(codec) {
        throw new Error('Not implemented');
    }

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
    audioBitrate(bitrate) {
        throw new Error('Not implemented');
    }

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
    audioChannels(channels) {
        throw new Error('Not implemented');
    }

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
    audioFrequency(freq) {
        throw new Error('Not implemented');
    }

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
    audioQuality(quality) {
        throw new Error('Not implemented');
    }

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
    audioFilters(filters) {
        throw new Error('Not implemented');
    }

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
    inputOptions(options) {
        throw new Error('Not implemented');
    }

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
    outputOptions(options) {
        throw new Error('Not implemented');
    }

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
    complexFilter(spec) {
        throw new Error('Not implemented');
    }

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
    input(source) {
        throw new Error('Not implemented');
    }

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
    inputFormat(format) {
        throw new Error('Not implemented');
    }

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
    inputFps(fps) {
        throw new Error('Not implemented');
    }

    /**
     * Use native framerate for the last specified input
     *
     * @method FfmpegCommand#native
     * @category Input
     * @aliases nativeFramerate,withNativeFramerate
     *
     * @return FfmmegCommand
     */
    native() {
        throw new Error('Not implemented');
    }

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
    seekInput(seek) {
        throw new Error('Not implemented');
    }

    /**
     * Loop over the last specified input
     *
     * @method FfmpegCommand#loop
     * @category Input
     *
     * @param {String|Number} [duration] loop duration in seconds or as a '[[hh:]mm:]ss[.xxx]' string
     * @returns {FfmpegCommand}
     */
    loop(duration) {
        throw new Error('Not implemented');
    }

    /**
     * Use preset
     *
     * @method FfmpegCommand#preset
     * @category Miscellaneous
     * @aliases usingPreset
     *
     * @param {String|Function} preset preset name or preset function
     */
    preset(preset) {
        throw new Error('Not implemented');
    }

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
    output(target, pipeopts) {
        throw new Error('Not implemented');
    }

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
    seek(seek) {
        throw new Error('Not implemented');
    }

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
    duration(duration) {
        throw new Error('Not implemented');
    }

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
    format(format) {
        throw new Error('Not implemented');
    }

    /**
     * Add stream mapping to output
     *
     * @method FfmpegCommand#map
     * @category Output
     *
     * @param {String} spec stream specification string, with optional square brackets
     * @returns {FfmpegCommand}
     */
    map(spec) {
        throw new Error('Not implemented');
    }

    /**
     * Run flvtool2/flvmeta on output
     *
     * @method FfmpegCommand#flvmeta
     * @category Output
     * @aliases updateFlvMetadata
     *
     * @returns {FfmpegCommand}
     */
    flvmeta() {
        throw new Error('Not implemented');
    }

    /**
     * Disable video in the output
     *
     * @method FfmpegCommand#noVideo
     * @category Video
     * @aliases withNoVideo
     *
     * @returns {FfmpegCommand}
     */
    noVideo() {
        throw new Error('Not implemented');
    }

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
    videoCodec(codec) {
        throw new Error('Not implemented');
    }

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
    videoBitrate(bitrate, constant) {
        throw new Error('Not implemented');
    }

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
    videoFilters(filters) {
        throw new Error('Not implemented');
    }

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
    fps(fps) {
        throw new Error('Not implemented');
    }

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
    frames(frames) {
        throw new Error('Not implemented');
    }

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
    keepPixelAspect() {
        throw new Error('Not implemented');
    }

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
    size(size) {
        throw new Error('Not implemented');
    }

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
    aspect(aspect) {
        throw new Error('Not implemented');
    }

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
    autopad(pad, color) {
        throw new Error('Not implemented');
    }
}

module.exports = {
    FfmpegCommand: FfmpegCommand
}




/* Add methods from options submodules */

require('./options/inputs')(FfmpegCommand.prototype);
require('./options/audio')(FfmpegCommand.prototype);
require('./options/video')(FfmpegCommand.prototype);
require('./options/videosize')(FfmpegCommand.prototype);
require('./options/output')(FfmpegCommand.prototype);
require('./options/custom')(FfmpegCommand.prototype);
require('./options/misc')(FfmpegCommand.prototype);


/* Add processor methods */

require('./processor')(FfmpegCommand.prototype);


/* Add capabilities methods */

require('./capabilities')(FfmpegCommand.prototype);




// FfmpegCommand.availableFilters =
// ;

// FfmpegCommand.availableCodecs =
// ;

// FfmpegCommand.availableFormats =
// ;

// FfmpegCommand.availableEncoders =
// ;


/* Add ffprobe methods */

require('./ffprobe')(FfmpegCommand.prototype);


/* Add processing recipes */

require('./recipes')(FfmpegCommand.prototype);
