import { Page, expect } from'@playwright/test'; 
import { HelperBase } from './helperBase';

export class DatepickerPage extends HelperBase{

    constructor(page: Page){
        super(page)
    }
//datepicker - select 1 date-all code taken from UI components test
    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number){
        const calenderInputField = this.page.getByPlaceholder('Form Picker')  
        await calenderInputField.click() 
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calenderInputField).toHaveValue(dateToAssert) //refactored dateToAssert
    }

//datepicker - select 2 dates
    async selectDatepickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number){ //need two days- start and end days
        const calenderInputField = this.page.getByPlaceholder('Range Picker')  
        await calenderInputField.click() 
        const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday) //update params
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calenderInputField).toHaveValue(dateToAssert)
    }

    //in-range range-cell day-cell selected ng-star-inserted
        private async selectDateInTheCalendar(numberOfDaysFromToday: number){
            let date = new Date()  
            date.setDate(date.getDate() + numberOfDaysFromToday)  //replace hard coded '7' days to param from our method 'numberOfDaysFromToday'
            const expectedDate = date.getDate().toString()  
            const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'} ) 
            const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'} ) 
            const expectedYear = date.getFullYear()
            const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`  //create const and refactor method
            
            let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent() 
            const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`  
            while(!calendarMonthAndYear.includes(expectedMonthAndYear)) { 
                await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
                calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent() 
            }
            //updated the locator-Since both classes exist in both calendars
            const dayCell = this.page.locator('[class="day-cell ng-star-inserted"]')
            const rangeCell = this.page.locator('[class="range-cell day-cell ng-star-inserted"]')
            if(await dayCell.first().isVisible()){
                await dayCell.getByText(expectedDate, {exact: true}).click()
            } else {
                await rangeCell.getByText(expectedDate, {exact: true}).click()
            }
            return dateToAssert
        }
    }