import {test, expect} from'@playwright/test' 
import { PageManager } from '../page-objects/pageManager' //Need to import from PageManager
import {base, faker} from '@faker-js/faker'

test.beforeEach(async({page}) => {
    await page.goto('/') 
})

test('navigate to form page', async({page}) => { 
    //create an instance of the PageManager (pm)
    const pm = new PageManager(page) //remove: const navigateTo = new NavigationPage(page)
    await pm.navigateTo().formLayoutsPage() //replace with pm. method + with () on each test
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async({page}) => { 
    //create an instance of the PageManager (pm)
    const pm = new PageManager(page) 
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 2')
    await page.screenshot({path: 'screenshots/formsLayoutsPage.png'})   //screenshot-create a new folder
    const buffer = await page.screenshot()                              //save as binary image
    console.log(buffer.toString('base64'))  //print screenshot binary string

    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
    await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inlineForm.png'})
    await pm.navigateTo().datepickerPage() 
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(10)
    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6, 15)   
})