import { Page } from'@playwright/test'; 
import { HelperBase } from './helperBase';

export class FormLayoutsPage extends HelperBase{

        constructor(page: Page){
            super(page)
        }
        
        async submitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string){
            const usingTheGridForm = this.page.locator('nb-card', {hasText: "Using the Grid"})
            await usingTheGridForm.getByRole('textbox', {name: "Email"}) .fill(email)
            await usingTheGridForm.getByRole('textbox', {name: "Password"}) .fill(password)
            await usingTheGridForm.getByRole('radio', {name: optionText}).check({force: true}) 
            await usingTheGridForm.getByRole("button").click()
        }

        // enter to comment good dewscriptive names with annotations about whatthose methods are doing- and help wile navigating
        /**
         * This method will fillout the inline form with user details
         * @param name - should be frst and last name
         * @param email  - should be valid email for the test user
         * @param rememberMe  - trye or false if use session to be save
         */
        async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean){ 
            const inlineForm = this.page.locator('nb-card', {hasText: "Inline form"})
            await inlineForm.getByRole('textbox', {name: "Jane Doe"}) .fill(name)
            await inlineForm.getByRole('textbox', {name: "Email"}) .fill(email)
            if(rememberMe )
                await inlineForm.getByRole('checkbox').check({force: true})
                await inlineForm.getByRole("button").click()
        }  
}