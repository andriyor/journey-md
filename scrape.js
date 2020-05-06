#!/usr/bin/env node

const fs = require("fs");

const cheerio = require('cheerio');
const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch({headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    const data = fs.readFileSync("export.json", "utf8");
    let cookies = JSON.parse(data);
    await context.addCookies(cookies);
    await page.goto('https://journey.cloud/timeline');
  } catch (e) {
    if (e.code === "ENOENT") {
      console.log('no cookies');
    }
  }
  
  const LOAD_MORE_SELECTOR = '#cardFooterLoaded button';
  await page.click(LOAD_MORE_SELECTOR);
  await page.waitForTimeout(5000);
  const CLOSE_MODAL_SELECTOR = '.sellModal .close';
  await page.waitForSelector(CLOSE_MODAL_SELECTOR);
  await page.click(CLOSE_MODAL_SELECTOR);
  
  async function parse() {
    const result = [];
    const pageContent = await page.content();
    const $page = cheerio.load(pageContent);
    const CARD_SELECTOR = '.timelinex-card.share';
    $page(CARD_SELECTOR).each(async function() {
      //  https://github.com/cheeriojs/cheerio/issues/839
      $page(this).find(".cardText").find('br').replaceWith('\n')
      const text = $page(this).find(".cardText").text().trim();
      const time = $page(this).find(".time > div:nth-child(1)").text().trim();
      const metadata = $page(this).find(".time .metadata").text().trim();
      result.push({text, time, metadata});
    });
    fs.writeFileSync('./data.json', JSON.stringify(result, null, 2) , 'utf-8');
  }
  
  async function loadMore() {
    const loadMoreButton = await page.$(LOAD_MORE_SELECTOR);
    if (loadMoreButton) {
      await loadMoreButton.scrollIntoViewIfNeeded();
      await page.click(LOAD_MORE_SELECTOR);
      await page.waitForTimeout(10000);
      try {
        await loadMore();
      } catch (e) {
        // console.log(e);
        await parse();
      }
    } else {
      console.log('scrolled to end');
    }
  }
  
  await loadMore()
  await parse();
 
  // await browser.close();
})();
