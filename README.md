# pyret-grading-example

This repository expects to be cloned by https://github.com/jpolitz/pyret-grade-shell, and has code for starting up a web page visiting a local `code.pyret.org` server, loading student submission code into the definitions window, running it, then running the tests in `tests.arr` against it.

The simplest use of this script is to edit `tests.arr`. The grader will report which tests passed and failed with a text representation of the output.

There is work (both design and coding) to do on presenting the output pleasantly in case of various errors (static and dynamic), and in giving nice check block output, calculating an actual score from the output, etc. Some of this is generic and some is assignment-specific.

More instrumentation is possible by editing `puppet.js` to do other kinds of interactions. For example, wheat/chaff grading is possible by loading wheat/chaff implementations, then student tests, and checking the output of those. That code isn't provided, but we could chat about it!
