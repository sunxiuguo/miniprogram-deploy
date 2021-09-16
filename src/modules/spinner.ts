import ora, { Ora } from 'ora';

export class Spinner {
    private spinner: Ora;
    constructor(initText: string) {
        this.spinner = ora(initText).start();
    }

    setText(text: string, persist?: boolean) {
        if (persist) {
            this.succeed(text);
        } else {
            this.spinner.text = text;
        }
        
    }

    succeed(text: string) {
        this.spinner.succeed(text);
    }

    fail(text: string) {
        this.spinner.fail(text);
    }
}