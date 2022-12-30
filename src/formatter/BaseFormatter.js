
const chalk = require('chalk')
const padStart = require('string.prototype.padstart')

function BaseFormatter(streamWriter, currency) {
    this.currency = currency
    this.streamWriter = streamWriter
    this.yearToggle = true
    this.yearMem = 0
    this.i = 0
}

function begin() {
    this.streamWriter.write("\n")
}

function end() {
    this.streamWriter.write("\n")
}

function writeHeaderRow(columns) {
    this.streamWriter.write(chalk['bgBlue'].white.bold([
        ' ',
        padStart(columns[0], 8),
        padStart(columns[1], 15),
        padStart(columns[2], 17),
        padStart(columns[3], 12),
        padStart(columns[4], 12),
        padStart(columns[5], 16),
        ' '
    ].join(' ')) + "\n")
}

function writeRow(columns) {
    let rowToggle = this.i%2
    let bgColor = rowToggle ? 'bgBlackBright': 'bgBlack';
    let color = rowToggle ? 'whiteBright': 'white';

    this.yearToggle = (
        parseInt(columns[0].format('YYYY'), 10)
        - parseInt(this.yearMem || columns[0].format('YYYY'), 10)
    ) % 2 === 1 ? !this.yearToggle : this.yearToggle
    let fontThickness = this.yearToggle ? chalk['reset'] : chalk['bold']

    this.streamWriter.write(fontThickness[bgColor][color](padStart('', 89)) + "\n")
    this.streamWriter.write(
        fontThickness[bgColor][color]([
            ' ',
            padStart(columns[0] ? columns[0].format('MMM YYYY') : '', 8),
            padStart(columns[1] + ' ' + this.currency, 15),
            padStart(columns[2] + ' ' + this.currency, 17),
            padStart(columns[3] + ' ' + this.currency, 12),
            padStart(columns[4] + ' ' + this.currency, 12),
            padStart(columns[5] + ' ' + this.currency, 16),
            ' '
        ].join(' ')) + "\n"
    );

    this.yearMem = columns[0].format('YYYY')
    this.i++;
}

BaseFormatter.prototype = {
    begin: begin,
    writeHeaderRow: writeHeaderRow,
    writeRow: writeRow,
    end: end
};

module.exports = {
    create: function (stream, currency) {
        return new BaseFormatter(stream, currency)
    }
}
