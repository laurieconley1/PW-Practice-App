import { EmailValidator } from '@angular/forms'
import {test, expect} from'@playwright/test' 
import { circle } from 'leaflet'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/') 

})

test.describe.only('Form Layouts page', () => {
    test.describe.configure({retries: 2})

    test.beforeEach( async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })


    test('input fields', async({page}) => { 
       
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})  //write new locator for Email field- Using the Grid form
        
        await usingTheGridEmailInput.fill('test@test.com')   // command  > use a method .fill then add argument you want to do (write something in the field)
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com') //, {delay: 500}


        //Example 1-How to make assertions of the input field
        //generic assertions - grab text from the input field
        const inputvalue = await usingTheGridEmailInput.inputValue()
        expect(inputvalue).toEqual('test2@test.com')

        //Example2: locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com') //call await expect('locator')>call method toHave Value- toHaveText-= WILL NOT WORK

    })

    //to select Radio buttons (.getByLabel or .getByRole)

    
    test('radio buttons', async({page}) => { 
        //example to select-need a locator  .getByLabel
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})
        //await usingTheGridForm.getByLabel('Option 1').check({force: true}) 
        //visually-hidden - the .check command will not pass validation
        //to bypass, need to pass a param with.check({force: true}) --> disables the verification of different statuses taht check
    

        //example 2- using another type of locator using .getByRole
        await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force: true}) 
        
        //Validations
        //Assertion 1-validate if successful-check status- radio button selected or not? 
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked() // make const + locator + type .isChecked() boolean T/F
        expect(radioStatus).toBeTruthy()      //make the validation

        //Assertion 2 - locator assertion
        await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked() // await + locator + method type .toBeChecked()
        
        //Validate Select Option2-Option 1 is not selected
        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true}) 
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()  //generic assertion
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })
        
})

//checkboxes
test('checkboxes', async({page}) => { 
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()
    //Checkbox Hide on Click - visiually-hidden, can use selected .getByRole or by imput
    await page.getByRole('checkbox', {name:"Hide on click"}).uncheck({force: true}) //checkbox-visually-hidden-must provide flag '{force: true}'
    //check method will only check the status of a checkbox-If selected already, it will not unselect it
    //click method will select/unselect but does not validate the status of the checkbox
    //uncheck method will uncheck the checkbox
    await page.getByRole('checkbox', {name:"Prevent arising of duplicate toast"}).check({force: true})

    //Want to select/Unselect all checkboxes
    //approach> take the locator of all checkboxes on the page, then loop through them to check or uncheck the boxes

    const allBoxes = page.getByRole('checkbox') //create const locator to get all checkbox list
    for(const box of await allBoxes.all()){   //use JS forLoop, .all has a promise-must use await
        await box.check({force: true}) //
        expect(await box.isChecked()).toBeTruthy() 
    }   
    for(const box of await allBoxes.all()){   
        await box.uncheck({force: true}) 
        expect(await box.isChecked()).toBeFalsy() 
    }   
})

test('lists and dropdowns ', async({page}) => { 
    const dropDownMenu = page.locator('ngx-header nb-select')  //parent locator then child locator
    await dropDownMenu.click()  //click performed on the dropdown menu
    //select items fromthe list .getByRole
    page.getByRole('list')  //use List when the list has a UL tag - parentcontainer for the entire list
    page.getByRole('listitem') //use Listitem when teh list has a LI tag-gets all list items-array from the list of elements

    //const optionList = page.getByRole('List').locator('nb-option') //finds page first,then child locator and elements '.nb-option'
//above works but alternative approach preferred
    const optionList = page.locator('nb-option-list nb-option')
    //make an assertion the list contains expected items
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])

//Select any items in the list
    await optionList.filter({hasText: "Cosmic"}).click() 
//Validate background color propoerty matches
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color','rgb(50, 50, 89)') //nb-layout-header-Styles-Cackground color ><, CSS values (50,50,89)
//Validate to select all values from the list, one by one
    const colors = {   //list color object - array values
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }
    //make a loop for colors, when selected, the color matches each expected color
    await dropDownMenu.click()
    for(const color in colors) {  //color=color text value "Light"
        await optionList.filter({hasText: color}).click()   
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != "Corporate")
            await dropDownMenu.click()
    }

})

//tooltops
//Inspect> Sources . Hover mouse tools shows tooltip-click combination

test('tooltips', async({page}) => { 
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    //interact with the button
    await toolTipCard.getByRole('button', {name: "Top"}).hover()

//to identify the toltip using .getByRole-has a special role
    page.getByRole('tooltip')  //only works if you have the role 'tooltip' created
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')

})


//Dialog boxes - 2 types 
//Web dialog - simple- inspect element>find teh locator>craete a locator and interact/click with the dialog box
//Table- browser dialog- tricky

test('dialog box', async({page}) => { 
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {  //create a listener
        expect(dialog.message()).toEqual('Are you sure you want to delete?') // validate assertion
        dialog.accept() //accept value
    }) 
    //identify the row then locate the class id, then perform the click()
    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click() 
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

//web tables 1- How to navigate - scenario- 3rd user , by email-unique identifyer, modify age 18 - 35
test('web tables ', async({page}) => { 
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()
    //how to get the row by any text in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"}) //Find unique identifier i.e. email
    await targetRow.locator('.nb-edit').click()       //perform operations- click on pencil to edit
    await page.locator('input-editor').getByPlaceholder('Age').clear() //Clear old value '18'
    await page.locator('input-editor').getByPlaceholder('Age').fill('35') //Type value
    await page.locator('.nb-checkmark').click() //validate checkmark 
    
    //2 get row base don the value in a specific colum.ID column-unique-nav to page 2
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row', {name:"11"}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()
    
    //Tricky part- find a locator for our page 2-tr 1, by ID 11
    //need to use a filter method-filter output of 2 rows, filter is a page.locator, td and index of column 1
    //once column is found, getByText  

    await page.locator('input-editor').getByPlaceholder('E-mail').clear() //clear old value
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com') //fillnew value
    await page.locator('.nb-checkmark').click() //validate checkmark 
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')  //add assertion of click


    //Web Tables 2- scenario3
    const ages = ["20", "30", "40", "200"]
//validate result of each 
    for( let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear() //clear old value
        await page.locator('input-filter').getByPlaceholder('Age').fill(age) 
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')
        
        for(let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent()

            if(age == "200"){ 
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else {
                expect(cellValue).toEqual(age)
            }

        }

    }

})

// Datepicker 1: Date hard coded
// test('datepicker ', async({page}) => {   //first navigate to the datepicker page
//     await page.getByText('Forms').click()
//     await page.getByText('Datepicker').click()

//     const calenderInputField = page.getByPlaceholder('Form Picker')   //find the Form Picker (placeholder) locator
//     await calenderInputField.click() //first verify we cn click on it, but not open
// //look at calendar inspect for correct month, specific locator, + text '14'
//     await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', {exact: true}).click() //.getByText- PW search'1'-partial match, add flag {exact: true}
//     await expect(calenderInputField).toHaveValue('Feb 1, 2024') //Assertion - to validate date passes - CURRENT MONTH


//Datepicker 2: want to select future, tomorrow, next month, etc - JS date object
test('datepicker ', async({page}) => {   
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calenderInputField = page.getByPlaceholder('Form Picker')  
    await calenderInputField.click() //first verify we cn click on it, but not open
    
    let date = new Date()  //Date=operation date/time, new=keyword to create an instance of an object, assign it to a date variable
    date.setDate(date.getDate() + 200)  //This is a 'date object' from practice JavaScript in modzilla 'Date' console
    const expectedDate = date.getDate().toString()  //new const then call Date object date.getDate (returns date of month) then convert a number to a String
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'} ) //value of the month
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'} ) //value of the month
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`  //const for the new date value = between backticks-not quotes, build expected date format
    
    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent() //create variable with Let - will reuse later in our logic
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`  // create new const
    //need a new loop - while > condition > code
    //compare the expected month and year and the calendar month and year. I fthe calendar is not the same, repeat until th eexpected month is selected
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)) { 
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent() 

    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click() //replace aas a variable dynamic value expectedDate object
    await expect(calenderInputField).toHaveValue(dateToAssert) //replace new const for date value created above for hard coded date
  

    //If this month is not what we expect, then click on the next month and make a validation, if not, click on the next month and so on...
})

//option 1- SHORTCUT-update a slider attribute x-y coordinates pixel for the location, max position- validate celesius
test('sliders', async({page}) => { 
    // const tempGuage = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle') // slider attribute tabtitle="Temperature" and child
    // await tempGuage.evaluate( node => { //access x - y coordinates- perform JS evaluation expression await temp guage
    //     node.setAttribute('cx', '228.441')
    //     node.setAttribute('cy', '228.441')
    // })
    // //we changed the property but did not trigger the event of the change
    // await tempGuage.click()      //single click>trigger a web element command to change the slider ui

//Option 2 - Better to simulate the mouse movement on the page-define box area of mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded() //call method to scroll down/into box and entore box is displayed on th epage
           // need to define the method- bounding box 300 x 300, x-y top left corner-coordinate 0, 0, X=horizontal, y=vertical, (X=0, Y=100)
           //you can go outside of the bounding box-no limitations-except browser view (X-100, Y=-50)
    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2  //trick-use center as starting point of bounding box-math formula
    const y = box.y + box.height / 2
    await page.mouse.move(x, y) //put mouse near location where I want to begin
    await page.mouse.down()  //click the left key button on mouse on coordinates x, y
    // await page.mouse.move(x -100, y) //move mouse to Zero/13
    // await page.mouse.move(x-100, y+100) //move mouse to Zero/13
    await page.mouse.move(x +100, y) //move mouse to 30
    await page.mouse.move(x+100, y+100) //moves mouse to 30
    await page.mouse.up() // relase the mouse button

    await expect(tempBox).toContainText('30') // make an assertion

})









