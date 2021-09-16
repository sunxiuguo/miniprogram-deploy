#!/usr/bin/env node
const { program } = require('commander');
const { COMMAND_CONFIG }= require('./command-config.js');
const packageJson = require('../package.json');

program.version(packageJson.version);

for (let item of COMMAND_CONFIG) {
    program.command(item.command).description(item.description).action(item.action);
}

program.parse(process.argv);

