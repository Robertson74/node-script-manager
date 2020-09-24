# Node Script Manager

1. [Why](#why)
1. [Installation](#install)
1. [How To Use](#howto)
1. [Coming Features](#coming)

<a name="why"></a>
## Why
Who wants to spend all their time typing out long, easy to mess up, package.json scripts?

Not me. Here's a cli tool to do it instead.

![node source manager demo](node-script-manager.gif)

Just think of how much more productive you will be with those precious saved seconds.

<a name="install"></a>
## Installation

```shell
$ npm i @michaelrobertson74/nsm -g
```

<a name="howto"></a>
## How To Use
Just run
```shell
$ nsm
```
from the root of any directory that has been npm initialized. You will be presented with a command line prompt to enter a script name. Enter partial script names until you see the one you would like to run.

Tips:
* You can enter either a parial script name or the script commands to find a script
* Use the arrow keys to move up and down to select your script

<a name="coming"></a>
## Coming Features
* Yarn Support
* Support for scripts that require user import
* Support for non ES6 environments
* Fuzzy Searches for scripts

