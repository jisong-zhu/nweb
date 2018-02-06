import gulpLoadPlugin from 'gulp-load-plugins';
import logger from '../lib/utils/logger';
const $ = gulpLoadPlugin();

export const start = (cliOptions) => {

};

export const handleError = (err) => {
    console.log();
    if (err.name === 'AppError') {
        console.error(chalk.red(err.message));
    } else {
        console.error(err.stack.trim());
    }
    $.notify.onError(stripAnsi(err.stack).replace(/^\s+/gm, ''))(err);
    console.log();
    logger.error('Failed to start!');
    console.log();
    process.exit(1);
};