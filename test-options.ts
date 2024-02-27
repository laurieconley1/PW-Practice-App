import {test as base} from '@playwright/test'   //file to keep test URL options

export type TestOptions = {
    globalsQaURL: string

}

export const test = base.extend<TestOptions>({
    globalsQaURL: ['', {option: true}]

})