import {test, expect} from'@playwright/test' 
import { PageManager } from '../page-objects/pageManager' //Need to import from PageManager
import {base, faker} from '@faker-js/faker'

test.beforeEach(async({page}) => {
    await page.goto('/') 
})

test('parametrized methods', async({page}) => { 
    //create an instance of the PageManager (pm)
    const pm = new PageManager(page) 
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 2')
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
})