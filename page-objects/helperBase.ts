import { Page } from'@playwright/test'; //page fixture

export class HelperBase{  //create a HelperBase class

    readonly page: Page  // create a field

    constructor(page: Page) {   //create a constructor
        this.page = page
    }

    //Create a function to wait for number of seconds- Hard coded wait method
    async waitForNumberOfSeconds(timeInSeconds: number){
        await this.page.waitForTimeout(timeInSeconds * 1000)
    } 
}
