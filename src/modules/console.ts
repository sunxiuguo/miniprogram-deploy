import chalk from 'chalk';
export class ConsoleOutput {
    public static info(msg: string) {
        console.log(`${chalk.white(`[INFO] ${msg}`)}`)
    }

    public static warn(msg: string) {
        console.log(`${chalk.yellow(`[WARING] ${msg}`)}`)
    }

    public static ok(msg: string) {
        console.log(`${chalk.green(`[SUCCEED] ${msg}`)}`)
    }

    public static error(msg: string) {
        console.log(`${chalk.red(`[ERROR] ${msg}`)}`)

    }

    // public static getChalkMsg(fontColor: string, label: string, msg: string) {
    //     const bgColor = `bg${fontColor[0].toUpperCase()}${fontColor.slice(1)}`;
    //     return `${chalk[bgColor].bold.inverse(label)} ${chalk[fontColor](msg)}`
    // }
}