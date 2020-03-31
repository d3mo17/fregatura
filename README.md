# fregatura

Generates a repayment plan from command line arguments


## Install

```sh
npm i -g fregatura
```


## Usage

![Screenshot displays execution in terminal](./screenshot.png "CLI Screen")


```shell
command: fregatura [OPTIONS]...

Arguments:
  -b, --balance   Balance to start with. Default: 185000
  -c, --currency  Currency, default: €
  -f, --from      Date from which to start (format: "YYYY-MM-DD", default: [today])
  -h, --help      This help text
  -i, --interest  Interest in percent per annum. Default: 2.5
  -r, --rate      Fixed rate to pay monthly. Default: 750
  -t, --to        Date to end (format: "YYYY-MM-DD", default: [current year] + 100)
```


## License

The MIT License (MIT)

Copyright (c) 2020 Daniel Moritz

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
