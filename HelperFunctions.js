1 Login Function

const login = async (t) => {
    return t
        .typeText('#user_email', 'jon@demotiatus.com')
        .typeText('#user_password', 'savings1234')
        .click('#new_user input[type="submit"]')
        .expect(getLocation()).contains(origin);
};



2 Go back

const goBack = ClientFunction(() => window.history.back());



3 Clear Cart

const clearCart = async (t) => {
    if (await Selector('#mainModalLabel').exists) {
        await t.click(Selector('.modal-footer input'))
    }

    const items = Selector('.row .cart-product');
    const item_count = await items.count;

    for (let x=0 ; x < item_count ; x++) {
        await t.click(Selector('.cart-product__remove').nth(0));
    }
};


4 Check for Visibility

if (await Selector('.incorrect-browser-modal').visible) {
        await t.click(Selector('button').withText('Close'));
    }
    

5 Generate Random Numbers
const generateRandomNumber = (min , max) => {    
  let random_number = Math.random() * (max-min) + min;
   return Math.floor(random_number).toString();
}
