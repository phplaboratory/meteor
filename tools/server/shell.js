var assert = require("assert");
var fs = require("fs");
var tty = require("tty");
var chalk = require("chalk");
var EOL = require("os").EOL;

function getTerminalWidth() {
  try {
    // Inspired by https://github.com/TooTallNate/ttys/blob/master/index.js
    var fd = fs.openSync("/dev/tty", "r");
    assert.ok(tty.isatty(fd));
    var ws = new tty.WriteStream(fd);
    ws.end();
    return ws.columns;
  } catch (fancyApproachWasTooFancy) {
    return 80;
  }
}

function startChildSide() {
  var input = process.stdin;
  var output = process.stdout;

  if (!output.columns) {
    // The REPL's tab completion logic assumes process.stdout is a TTY,
    // and while that isn't technically true here, we can get tab
    // completion to behave correctly if we fake the .columns property.
    output.columns = getTerminalWidth();
  }

  var repl = require("repl").start({
    prompt: "> ",
    input: input,
    output: output,
    terminal: true,
    useColors: true,
    useGlobal: true,
    ignoreUndefined: true
  });

  repl.on("exit", function(code) {
    process.exit(code|0);
  });
}

function startParentSide(childProcess) {
  process.stdout.write(chalk.green([
    "",
    "Welcome to the server-side interactive shell! Type .help for help.",
    EOL
  ].join(EOL)));

  childProcess.on("exit", function(code) {
    process.exit(code|0);
  });

  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);

  process.stdin.resume();
  process.stdin.setRawMode(true);
  process.stdin.pipe(childProcess.stdin);
}

exports.startChildSide = startChildSide;
exports.startParentSide = startParentSide;
