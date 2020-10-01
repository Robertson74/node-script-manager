#!/usr/bin/env node
const fs = require('fs');
const inquirer = require('inquirer');
const { spawn } = require('child_process');
inquirer.registerPrompt('search-list', require('inquirer-search-list'));

const targetDir = '/' + process.argv[1].split('\/').slice(1, -1).join('/') + '/package.json';
const spaceBufferCount = 5;

const isYarn = process.argv.some((arg) => {
  return arg === '-y' || arg === '--yarn';
})
fs.readFile('package.json', 'utf8' , (err, data) => {
  if (err) {
    console.error(`No package.json found at '${targetDir}' found`);
    return;
  }

  const scripts = JSON.parse(data).scripts;
  const longestScriptNameCount = Object.keys(scripts).reduce((accum, value) => {
    return value.length > accum ? value.length : accum;
  }, 0)
  const scriptQuestions = Object.keys(scripts).map((scriptKey) => {
    const scriptName = `${scriptKey}`;
    let spaceBuffer = '';
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
  ]).then((res) => {
    let spacesSplit = '';
    while (spacesSplit.length < spaceBufferCount) {
      spacesSplit += ' ';
    }
    const scriptToRun = res.scriptName.split(spacesSplit)[0];
    const npmOrYarn = isYarn ? 'yarn' : 'npm';
    const runningScript = spawn(npmOrYarn, ['run', scriptToRun]);

    runningScript.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    runningScript.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    runningScript.on('close', () => {
      // console.log(`child process exited with code ${code}`);
    });
  });

})
