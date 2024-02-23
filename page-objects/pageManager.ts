import { Page } from'@playwright/test';  //move all imports here from the test file
import {NavigationPage} from '../page-objects/navigationPage'
import {FormLayoutsPage} from '../page-objects/formLayoutsPage'
import { DatepickerPage } from '../page-objects/datepickerPage'

export class PageManager{
//need a field for every page object
    private readonly page: Page 
    private readonly navigationPage: NavigationPage
    private readonly formLayoutsPage: FormLayoutsPage
    private readonly datepickerPage: DatepickerPage

//need to call all pages inside the the constructor-including the page fixture
    constructor(page: Page) {  
        this.page = page //page fixture into the PageManager
        this.navigationPage = new NavigationPage(this.page) //we initialize the page objects-pass the page fixture inside the page objects
        this.formLayoutsPage = new FormLayoutsPage(this.page)
        this.datepickerPage = new DatepickerPage(this.page)

    }
//need to create methods that willreturn for us all instances of the page objects
    navigateTo(){
            return this.navigationPage
    }  

    onFormLayoutsPage(){
            return this.formLayoutsPage
    }

    onDatepickerPage(){
            return this.datepickerPage
    }
//When ready-call this page manager inside of the test
}
