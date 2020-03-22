const Page = require('./helpers/page');

let page;
beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    await page.close();
});

test('the header has correct text', async () => {
    //const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    const text = await page.getContentsOf('a.brand-logo');
    expect(text).toEqual('Blogster');
});

test('clicking login start oauth flow', async () => {
    await page.click('.right a');
    const url = await page.url();
    console.log(url);
});

// test('when signed in, shows logout button', async () => {
//     await page.login();
//     // const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
//     const text = await page.getContentsOf('a[href="/auth/logout"]');
//     expect(text).toEqual('Logout');
// });
