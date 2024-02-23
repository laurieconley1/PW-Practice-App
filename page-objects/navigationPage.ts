import { Page } from'@playwright/test'; 
import { HelperBase } from './helperBase';

//to call HelperBase method, add keyword: extends HelperBase, PW imports for you
export class NavigationPage extends HelperBase{  //body of class-must be exported to be visible to files inside the framework 

//new field inside of the class-REMOVED : readonly page: Page when super(page) constructor added below
//create a constructor, import Page PW library, TS syntax-define param/type of variable use colon (page: Page)  
//the constructor expects a page param to be passed inside of this class 'this' want to use a field, variable or property related to this particular class 
    constructor(page: Page){   //extends HelperBase-inheritance broken, update constuctor: super(page) , remove field readonly page:Page above
        super(page) 
    } 
//methods
    async formLayoutsPage(){ 
        await this.selectGroupMenuItem('Forms') 
        await this.page.getByText('Form Layouts').click() 
        await this.waitForNumberOfSeconds(2)  //call HelperBase method 
    } 
    async datepickerPage(){ 
        await this.selectGroupMenuItem('Forms') 
        await this.page.getByText('Datepicker').click() 
    } 
    async smartTablePage(){ 
        await this.selectGroupMenuItem('Tables & Data') 
        await this.page.getByText('Smart Table').click() 
    } 
    async toastrPage() { 
        await this.selectGroupMenuItem('Modal & Overlays') 
        await this.page.getByText('Toastr').click() 
    } 
    async tooltipPage(){ 
        await this.selectGroupMenuItem('Modal & Overlays') 
        await this.page.getByText('Tooltip').click() 
    } 
    //helper method- private-not visible to all methods 
    private async selectGroupMenuItem(groupItemTitle: string){ 
        const groupMenuItem = this.page.getByTitle(groupItemTitle) 
        //need value of this Forms property aria-expanded="true" 
        const expandedState = await groupMenuItem.getAttribute('aria-expanded') 
        //need to create a condition based on expandedState "false" to click on Forms 
        if(expandedState == "false") 
            await groupMenuItem.click() 
    } 
} 