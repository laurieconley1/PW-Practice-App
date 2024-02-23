import {test, expect} from'@playwright/test' 
import { PageManager } from '../page-objects/pageManager' //Need to import from PageManager

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/') 
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
    const pm = new PageManager(page) //remove all const instances
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'Welcome1', 'Option 2')
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('John Smith', 'John@test.com', false)
    await pm.navigateTo().datepickerPage() 
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(10)
    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6, 15)   
})