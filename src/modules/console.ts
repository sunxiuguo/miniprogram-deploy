import chalk from 'chalk';
export class ConsoleOutput {
    public static info(msg: string) {
        console.log(`${chalk.bgBlack.bold.inverse('Info')} ${chalk.white(msg)}`)
    }

    public static warn(msg: string) {
        console.log(`${chalk.bgYellow.bold.inverse('Warning')} ${chalk.yellow(msg)}`)
    }

    public static ok(msg: string) {
        console.log(`${chalk.bgGreen.bold.inverse('MileStone')} ${chalk.green(msg)}`)
    }

    public static error(msg: string) {
        console.log(`${chalk.bgRed.bold.inverse('Error')} ${chalk.red(msg)}`)

    }

    // public static getChalkMsg(fontColor: string, label: string, msg: string) {
    //     const bgColor = `bg${fontColor[0].toUpperCase()}${fontColor.slice(1)}`;
    //     return `${chalk[bgColor].bold.inverse(label)} ${chalk[fontColor](msg)}`
    // }
}