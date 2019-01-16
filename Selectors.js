1 Select elements with filter visible 
.click(Selector('label').withAttribute('for','q_search_on_market').filterVisible().nth(0))
.click(Selector('div').withAttribute('data-url', '/properties/347916'))
.expect(getLocation()).match(/tab\=docs/);


2 Assert that email has been sent 
const sentEmails = await Selector('.table > tbody > tr');
const emailCount = await sentEmails.count

.expect(Selector('.table > tbody > tr').count).eql(emailCount + 1);


3 Drag and Drop 
await setProdPerfectTracking(t)
const dest = Selector('ul.js-connected-lists.ui-sortable').nth(1)

await t
    .dragToElement('li.ui-sortable-handle', dest)
    .click(Selector('input').withAttribute('value', 'Next Step'))


4 Find an element 
await t
.click(Selector('.reports table').find('thead').find('tr').nth(1).find('th').nth(0).find('input').filterVisible())
.typeText(Selector('.reports table').find('thead').find('tr').nth(1).find('th').nth(0).find('input').filterVisible(), 'ny180116', {
    replace: true
})
.wait(1000)
.click(Selector('a').withAttribute('href', /\/report\/[A-Za-z0-9]+/).filterVisible().nth(0))
.expect(getLocation()).match(/\/report\/[A-Za-z0-9]+\/review\-and\-export/);


5 Resize Window 
await setProdPerfectTracking(t);
await t
    .resizeWindow(1200, 730);


6 Origin 
await t
        .expect(getLocation()).contains(origin);


7 NavBar 
.click(Selector('a[href="/webcam/cam-girls-age-18"]').filterVisible().nth(0))
.expect(getLocation()).match(/\/webcam\/cam-girls-age-18/);