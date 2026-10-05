#!/usr/bin/env node
const { program } = require('commander');
const { COMMAND_CONFIG }= require('./command-config.js');
const packageJson = require('../package.json');
const { ConsoleOutput } = require('../dist/modules/console.js');

program.version(packageJson.version);

for (let item of COMMAND_CONFIG) {
    program.command(item.command).description(item.description).action(item.action);
}

program.parseAsync(process.argv).catch(error => {
    ConsoleOutput.error(error && error.message ? error.message : String(error));
    process.exitCode = 1;
});
