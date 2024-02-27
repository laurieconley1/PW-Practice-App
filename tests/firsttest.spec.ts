import {test, expect} from'@playwright/test' 

test.beforeEach (async({page}) => {
    await page.goto('/')  
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})
          
test('Locator syntax rules',async({page}) => {
    //find locator by tag name
    await page.locator('input').first().click()
    
    //by Id - use # ('')
    page.locator('#inputEmail1')
    
    // by class value--use ('.dot notation')
    page.locator('.shape-rectangle')      
     
    //by attribute--use square { [] }
    page.locator('[placeholder="Email"]')

    //by class value (full with [] )
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different selectors, web element by tag and attribute, .shape-rectangle, NO spaces in between 2 attributes
    page.locator('input[placeholder="Email][nbinput]')

    //by XPath (Not Recommended-NOT a good practice!!!)
    page.locator('//*[@id="inputEmail1"]')

    //find partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')

})

test('User Facing Locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()  //method should be user-facing, getByRole -67 + role types
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').click()
    await page.getByText('Using the Grid').click()
    await page.getByTestId('SignIn').click()   //Search Source-HTML FOrms page -Not User facing but helps app resilient
    await page.getByTitle('IoT Dashboard').click() //HTML Attribute
    
})
//locating a child locator
test('locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click() //one way
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")') .click() //alter way- chain together
    await page.locator('nb-card').getByRole('button', {name: "Sign In"}).first().click()  //make combination of the reg locator method
    //can mix the usage of teh reg loctor method when searching for child elements/nb-card not needed here for Sign In button.
    //Can also use in different order-find parent then find child
    await page.locator('nb-card').nth(3).getByRole('button').click()   //least pref-Avoid this with changing elements Index .nth(3)-always starts with 0, 
})

//locating a parent locator
test('locating parent elements', async({page}) => {
    await page.locator('nb-card', {hasText:"Using the Grid"}).getByRole('textbox', {name: "Email"}).click() //approach 1:add 2nd arg hasText: located anywhere inside of the DOM fo rthis end card
    await page.locator ('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click() //approach 2: 2nd attribute added- can filter by text or by locator
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click() //filter method-similare capabilities as teh 2nd arg above ^, but independent of teh other
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click() //.class --Password field
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign In"}).getByRole('textbox', {name: "Email"}).click()
    //Xpath - not recommended but can do
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()

})
//Reusing the locators-replace to a const and use the child elements in our code, remove the dup locator methods
test('Reusing the locators', async({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    //Could also create another const for emailField, remove dup 
    const emailField = basicForm.getByRole('textbox', {name: "Email"}) 
    
    await emailField.fill('test@test.com') 
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click() 

    //Write an assertion for email field-import 'expect'from the Playwright library at the top of test
    await expect(emailField).toHaveValue('test@test.com')
})

//extract values from the DOM 
//Get the single text value of the button-validate button is from Basic Form section, reuse the const locator 

test('extracting values', async({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"}) //Single text-create a new const -button-grab single text and assign it to the context
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')  //make an assertion 'toEqual'

//How to get ALL text values 
    const allRadioButtonLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonLabels).toContain("Option 1")  //validate the array contains 'Option1'

//How to find and validate input value--which is an inputField value -not text, 
    const emailField = basicForm.getByRole('textbox', {name: "Email"}) //connst>locator emailField
    await emailField.fill('test@test.com') //fill the field
    const emailValue = await emailField.inputValue() //assertion with const to grab the value from this input field - use method 'inputValue'
    expect(emailValue).toEqual('test@test.com')

//How to grap and validate an Attribute value
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

//Assertions/methods-different between await expect, expect- 2 types: General Assertions/Locator Assertions
test('assertions', async({page}) => {
//General assertion
//expect(value).toEqual(5) //compare LEFT value of dot to the RIGHT value
    //LEFT inside expect method provide the argument to assert/RIGHT choose the method and provide teh expectation
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
    const value = 5  //cont value = property
    expect(value).toEqual
    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

//Locator Assertion-intead of expect(text)-use a expect(locator)
    await expect(basicFormButton).toHaveText('Submit')

//Soft assertion - .soft --test continues even if it fails--Not a good practice
    //await expect.soft(basicFormButton).toHaveText('Submit5') 
    //await expect.basicFormButton.toHaveText('Submit5') //remove soft and braces-test will stop-will not click thebutton
    await expect.soft(basicFormButton).toHaveText('Submit') //remove soft and braces-test will stop-will not click thebutton
    await basicFormButton.click()
})

//test(' ', async({page}) => {})

    