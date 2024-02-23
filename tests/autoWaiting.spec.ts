import {test, expect} from'@playwright/test' 

test.beforeEach (async({page}, testInfo) => {    //Modify Timeout for a particular test suite---add 2nd arg inside beforeEach hook , testInfo
    await page.goto('http://uitestingplayground.com/ajax')  
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000) //ALT OPTION-Modify Default-add arugment--time value +2000- will be applied for every test 
})

// test('auto-waiting', async({page}) => {
//     const successButton = page.locator('.bg-success') //Find locator for the section-success message to interact with 
//     //await successButton.click()

//     const text = await successButton.textContent()
//     expect(text).toEqual('Data loaded with AJAX get request.')
// }) 


test('auto-waiting', async({page}) => {
    const successButton = page.locator('.bg-success') 
    //await successButton.click()
    //const text = await successButton.textContent()
    
    // await successButton.waitFor({state: "attached"}) //Need a different assertion toEqual changeto toContain
    // const text = await successButton.allTextContents()  //allTextContents does NOT wait and expects to fail-returns empty.
    // expect(text).toContain('Data loaded with AJAX get request.') 

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000}) 
    // locator Assertion type works without waiting.
    //Comment out above since the locator assertion timeout is 5 seconds and EXPECTS it to fail-element not visible "".
    //increase timeout form 5 > 20 seconds, it loads in 15 seconds and Assertion passes. 
}) 

//Alternatives in PW WHEN commands do NOT have auto-waiting feature implemented i.e.'allTextContents', 
test('alternative waits', async({page}) => { 
    const successButton = page.locator('.bg-success') //locator
    //______wait for element
    //await page.waitForSelector('.bg-success') //selector-.bg-success

    //______wait for a particular response-usually fromthe BE server-From API-in Network tab
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata') //Network request URL wait for success load. 

    //______wait for Network calls to be completed (NOT RECOMMENDED-if APIs are stuck,teh test willbe stuck)
    await page.waitForLoadState('networkidle')

    //Other Alternatives
    //await page.waitForTimeout(5000)---> NOT RECOMMENDED
    //await page.waitFor('')  //Event, Function, request, URL (helpful to navigate/wait for URL to be available), etc. 

    const text = await successButton.allTextContents()  //method without auto-wait
    expect(text).toContain('Data loaded with AJAX get request.') //assertion 

})

test('timeouts', async({page}) => { 
    //test.setTimeout(10000) //PW sillchecl setTimeout first and ignore the click timeout
    test.slow() //will increase the default time out to 3 times - configed at 10000 x 3 = 30000
    const successButton = page.locator('.bg-success') 
    await successButton.click({timeout: 18000})
//expected error
})
