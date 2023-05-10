#!/usr/bin/env ts-node

const puppeteer = require("puppeteer");


const scrapeUrl = async (url: string) => {
  try {
    // setup browser
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('#ulDezenas li');

    const numbers = await page.evaluate(() => {
      const liElements = document.querySelectorAll('#ulDezenas li');
      const liNumbers = Array.from(liElements).map((li) => li.textContent?.trim());
      return liNumbers
    });
    console.log(numbers);
    await browser.close();

  } catch (err) {
    console.error(err)
  }

}

scrapeUrl('https://loterias.caixa.gov.br/Paginas/Mega-Sena.aspx');