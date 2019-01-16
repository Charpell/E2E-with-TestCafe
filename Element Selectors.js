1 Options

await t
      .click(Selector('#address_id'))
      .click(Selector('#address_id option').nth(2));


2 Navbar

.click(Selector('div.course-list > nav > ul > li').nth(5).find('a'))


3 Tables
.click(Selector('div').nth(1).find('div > table > tbody > tr').find('span').withText('Northwestern University'))
.click(Selector('table > tbody > tr').nth(1).find('td').nth(4).find('a'))
.click(Selector('div').nth(1).find('div > table > tbody > tr').nth(0).find('td').nth(0).find('span'))


4 Delete with alert
.setNativeDialogHandler(()=> true)
.click(Selector('a').withAttribute('href', /#delete\d+/).find('button').filterVisible())


5 Filter Date from a dropdown
.click(Selector('#filterSessionByMonth'))
.click(Selector('#filterSessionByMonth option').withText('Feb 2019'))
.click(Selector('div > div.bcs-calendar').find('a').withText('Test 2 Session'))
.expect(getLocation()).match(/\/sessions\/\d+/);


6 Click on a NavBar Link
.click(Selector('a').withAttribute('href', /\/sessions/).filterVisible())
OR
.click(Selector('div.course-list > nav > ul > li').nth(4).find('a'))

// expect
.expect(getLocation()).match(/\/sessions/)


7 Expect a div to Exist
const divTagSuccess = Selector('div.context-success.margin-b-3');

.expect(divTagSuccess.exists).ok();


8 Form with Date and Description
.click('a[href="/sessions/create"]')  // Click on Create new

.click(Selector('input#sessionName'))
.typeText(Selector('input#sessionName'),'Title',{replace:true})

// Select a Date from Modal
.click(Selector('div.react-datepicker__input-container > input'))
.typeText(Selector('div.react-datepicker__input-container > input'), '02-02-2019', { replace: true })

// Click to close the Modal'
.click(Selector('label[for="sessionStartTime"]'))

// Click from a dropdown
.click(Selector('select').withAttribute('id','sessionStartTime').filterVisible().nth(0))
.click(Selector('select').withAttribute('id','sessionStartTime').filterVisible().nth(0).find('option').withAttribute('value','8:00').filterVisible())

// Description
.typeText(Selector('textarea#sessionShortDescription'), 'This is a test session', { replace: true })
.click(Selector('textarea#sessionDescription'))

// Submit
.expect(getLocation()).match(/\/sessions\/create/)



9 ID Selectors
.click(Selector('#residential-rent-roll').find('div').withText('Rent Roll').filterVisible())
.click(Selector('#residential-rent-roll > div').nth(1))


10 Generate Uniqe names
import { v4 } from 'uuid';

//     const username = v4().replace(/-/g, '');
//     const email = v4().replace(/-/g, '') + '@prodperfect.com';
//     const password = v4().replace(/-/g, '');


11 Search and Input
await setProdPerfectTracking(t);
await t
    .click(Selector('div[class="SidebarItem"]').nth(2).find('a'))
    .expect(getLocation()).match(/apps\/prodperfecttestapplication\/customers/);

    await t
    .click(Selector('input[placeholder="Search customers"]'))
    .typeText(Selector('input[placeholder="Search customers"]'), customerName,{replace:true} )
    .expect(Selector('span').withText(customerName).exists).ok();


12 Uploading docs
await t
    .click(Selector('.js-upload-button')) // upload button
    .setFilesToUpload('input[type="file"]', './upload/test-docs/pptest2.pdf')


12b Asserting upload was successful
const fileDoc = await Selector('.js-doc-row')
const fileDocCount = await fileDoc.count;

.expect(Selector('.js-doc-row').count).eql(fileDocCount + 1)





13 Click on Login Button 
    await t
        .click(Selector('a').withAttribute('href',/.*\/login.*/i).filterVisible().nth(0))
        .expect(getLocation()).match(/.buildout\.com\/login/);

    await setProdPerfectTracking(t);
    await login(t)    


14 Login Function 
const login = async (t) => {
    // Login steps
    await t
       .click(Selector('input').withAttribute('id','login'))
       .typeText(Selector('input').withAttribute('id','login'),'buildout-user@prodperfect.com',{replace:true})  //class : login_field email w-input , element_cursor : text , data-name : login , name : login , element_node_name : INPUT , element_selector : body > div > div > div > div:eq(2) > form#login_form > input#login , element_tag_name : INPUT , element_type : text , element_value : buildout-user@prodperfect.com
       .click(Selector('input').withAttribute('id','password'))  //class : login_field w-input , element_cursor : text , data-name : password , name : password , element_node_name : INPUT , element_selector : body > div > div > div > div:eq(2) > form#login_form > input#password , element_tag_name : INPUT , element_type : password
       .click(Selector('input').withAttribute('id','password'))
       .typeText(Selector('input').withAttribute('id','password'),'Bu1ld0uT+Pr0dP3rf3cT',{replace:true})  //class : login_field w-input , element_cursor : text , data-name : password , name : password , element_node_name : INPUT , element_selector : body > div > div > div > div:eq(2) > form#login_form > input#password , element_tag_name : INPUT , element_type : password , element_value : Bu1ld0uT+Pr0dP3rf3cT
       .click(Selector('#login_form > input').nth(2))  //class : login_button w-button , element_cursor : pointer , data-wait : Please wait... , element_node_name : INPUT , element_tag_name : INPUT , element_type : submit , element_value : Log In > , value : Log In >
       .expect(getLocation()).match(/staging\.buildout\.com\/properties/);
};



15 Select from a dropdown
.click(Selector('.js-context-menu-button').nth(0))
click(Selector('li.context-menu-item > span').withText('Rename'), {replace: true})
.typeText(Selector('input.bootbox-input-text'), 'filName')
.click(Selector('button').withText('OK'))


16 Check if element exists
await setProdPerfectTracking(t);
if (await Selector('a').withText('show advanced financials').exists) {
    await t.click(Selector('a').withText('show advanced financials'))
}

await setProdPerfectTracking(t);
if (await Selector('.attribute-row.incomes.hide').exists) {
    await t.click(Selector('label').withAttribute('for','property_financial_statements_attributes_0_include_income_breakdown').filterVisible())
}


17 Assertion after routing to another Page 
.click(Selector('a').withAttribute('href',/.*\/properties\/\d+\/edit.*/i).filterVisible().nth(0))
.expect(getLocation()).match(/buildout\.com\/properties\/\d+\/edit/)
.expect(Selector('input[name="property[photo_attachments_attributes][0][description]"]').value).eql(filName);