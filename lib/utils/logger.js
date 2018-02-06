'use strict';
import chalk from 'chalk';

export const success = (msg, log = true) => {
    msg = `${chalk.reset.inverse.bold.green(' DONE ')} ${msg}`;
    return log ? console.log(msg) : msg;
};

export const error = (msg, log = true) => {
    msg = `${chalk.reset.inverse.bold.red(' FAIL ')} ${msg}`;
    return log ? console.log(msg) : msg;
};

export const warn = (msg, log = true) => {
    msg = `${chalk.reset.inverse.bold.yellow(' WARN ')} ${msg}`;
    return log ? console.log(msg) : msg;
};

export const tip = (msg, log = true) => {
    msg = `${chalk.reset.inverse.bold.cyan(' TIP ')} ${msg}`;
    return log ? console.log(msg) : msg;
};

export const title = (label, msg, color = 'blue', log = true) => {
    msg = `${chalk.reset.inverse.bold[color](` ${label} `)} ${msg}`;
    return log ? console.log(msg) : msg;
};