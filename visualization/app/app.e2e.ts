import {CC_URL, puppeteer} from "./puppeteer.helper";

jest.setTimeout(10000);

describe("app",()=>{

    let browser, page;

    function delay(timeout) {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    }

    beforeAll(async ()=>{
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });

    afterAll(async ()=>{
        await browser.close();
    });

    it("should not have errors in console", async ()=>{
        page.on('console', msg => {
            expect(msg._type).not.toBe("error");
        });
        await page.goto(CC_URL);
        await delay(3000);
    });

});