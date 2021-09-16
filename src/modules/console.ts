/**
 * https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json 已提供的spinner类型
 */
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { SpinnerName } from '../types/spinner';

export class ConsoleOutput {
    private static get spinner() {
        if (!this._spinner) {
            this._spinner = ora('').start();
        }
        return this._spinner;
    }

    public static pending(msg: string) {
        this.spinner.spinner = 'dots';
        this.spinner.start(`${chalk.white(msg)}`);
    }

    public static info(msg: string) {
        this.stopAndPersist(`${chalk.white(msg)}`, '🎄');
    }

    public static warn(msg: string) {
        this.spinnerWarn(`${chalk.yellow(msg)}`)
    }

    public static ok(msg: string) {
        this.spinnerSucceed(msg);
    }

    public static error(msg: string) {
        this.spinnerFail(`${chalk.red(msg)}`)
    }

    private static _spinner: Ora | null = null;

    private static setSpinnerText(text: string) {
        this.spinner.text = text;
    }

    private static stopAndPersist(text: string, symbol?: string) {
        this.spinner.stopAndPersist({
            text,
            symbol
        })
    }

    private static spinnerSucceed(text: string) {
        this.spinner.succeed(text);
    }

    private static spinnerFail(text: string) {
        this.spinner.fail(text);
    }

    private static spinnerWarn(text: string) {
        this.spinner.warn(text);
    }
}