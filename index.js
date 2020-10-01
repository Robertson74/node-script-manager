#!/usr/bin/env node
"use strict";
var fs = require('fs');
var inquirer = require('inquirer');
var spawn = require('child_process').spawn;
inquirer.registerPrompt('search-list', require('inquirer-search-list'));
var targetDir = '/' + process.argv[1].split('\/').slice(1, -1).join('/') + '/package.json';
var spaceBufferCount = 5;
var isYarn = process.argv.some(function (arg) {
    return arg === '-y' || arg === '--yarn';
});
fs.readFile('package.json', 'utf8', function (err, data) {
    if (err) {
        console.error("No package.json found at '" + targetDir + "' found");
        return;
    }
    var scripts = JSON.parse(data).scripts;
    var longestScriptNameCount = Object.keys(scripts).reduce(function (accum, value) {
        return value.length > accum ? value.length : accum;
    }, 0);
    var scriptQuestions = Object.keys(scripts).map(function (scriptKey) {
        var scriptName = "" + scriptKey;
        var spaceBuffer = '';
        while (scriptName.length + spaceBuffer.length < longestScriptNameCount + spaceBufferCount) {
            spaceBuffer += ' ';
        }
        return {
            name: scriptName + spaceBuffer + scripts[scriptKey],
            value: scriptName,
        };
    });
    inquirer.prompt([
        {
            name: 'scriptName',
            choices: scriptQuestions,
            type: 'search-list',
            message: 'Which script to run?',
        },
    ]).then(function (res) {
        var spacesSplit = '';
        while (spacesSplit.length < spaceBufferCount) {
            spacesSplit += ' ';
        }
        var scriptToRun = res.scriptName.split(spacesSplit)[0];
        var npmOrYarn = isYarn ? 'yarn' : 'npm';
        var runningScript = spawn(npmOrYarn, ['run', scriptToRun]);
        runningScript.stdout.on('data', function (data) {
            process.stdout.write(data);
        });
        runningScript.stderr.on('data', function (data) {
            process.stderr.write(data);
        });
        runningScript.on('close', function () {
            // console.log(`child process exited with code ${code}`);
        });
    });
});
