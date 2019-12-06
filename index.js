const puppeteer = require('puppeteer');
const fs = require('fs');
const mainPage = 'https://shengjingzhenli.com/web/book/book_spirit.html';
const css = '<link rel="stylesheet" type="text/css" href="https://shengjingzhenli.com/res/front/css/book_newtestament_conclusion_item_article.css?20180427" media="all">'
const css4A5 = '<link rel="stylesheet" type="text/css" href="./pint.A5.css" media="all">'
const bookId = 710;
const seriesCount = 12;

async function waitFor(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {  
            width: 1100,
            height: 1000
        }
    });
    const page = await browser.newPage();
    let result = [css,  css4A5];
    await page.on('response', async response => {
        if (/publication\/books/.test(response.url())) {
            if (response.status() === 200) {
                const text = await response.text();
                result.push(text);
            }
            return true;
        }
    });
    for (let i = 0; i < seriesCount; i++) {
        try {
            await page.goto(`${mainPage}?id=${bookId + i}`);
            await page.waitFor(200);
            await page.waitForSelector('.book_title .text span');
            await page.waitForSelector('body .center_content  .main_text  .catalog .content .sections');

            let pageTitle = await page.$eval('.book_title .text span', e => e.innerHTML);
            console.log(pageTitle);
            let next;
            do {
                next = await page.$('body .center_content  .main_text  .catalog .content .sections .choose+div');
                if (next) {
                    await next.click();
                    await page.waitForResponse(response => {
                        return /publication\/books/.test(response.url());
                    })  
                }
            } while (next !== null)
            await waitFor(200);
            try {
                fs.unlinkSync(`./${pageTitle}.html`);
            } catch (error) { }
            fs.writeFileSync(`./${pageTitle}.html`, result.join('\n'));
        } catch (error) {
            console.log(`${bookId + i} 下载失败`)
            console.log(error);
        } finally {
            result = [css, css4A5];
        }
    }
})();       