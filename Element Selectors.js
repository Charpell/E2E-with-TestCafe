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
