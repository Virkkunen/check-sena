#!/usr/bin/env ts-node

const puppeteer = require('puppeteer');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .usage("Usage: npx check-sena -n '<numbers>'")
  .option('numbers', {
    alias: 'n',
    describe: 'The six numbers, comma separated',
    demandOption: false,
    type: 'string',
    coerce: (numbers: string) => {
      const numberList = numbers.split(',').map((num) => parseInt(num.trim()));

      const isValidRange = (num: number) => num >= 1 && num <= 60; // must return true
      const hasDuplicates = (arr: number[]) => new Set(arr).size !== arr.length; // must return false

      if (numberList.length !== 6)
        throw new Error('Invalid number of elements. Please provide exacly 6 numbers.');

      if (!numberList.every(isValidRange)) throw new Error('Numbers must be between 1 and 60.');

      if (hasDuplicates(numberList))
        throw new Error('Duplicate numbers found. Please provide 6 unique numbers.');

      return numberList;
    },
  })
  .help('help')
  .alias('help', 'h').argv;

const scrapeUrl = async (url: string) => {
  const { numbers } = argv;

  try {
    // setup browser
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('#ulDezenas li'); // this element needs to load 

    // get sena numbers
    const senaNumbers = await page.evaluate((): number[] => {
      const liElements = document.querySelectorAll('#ulDezenas li');
      const liNumbers = Array.from(liElements).map((li) => +li.textContent!.trim());
      return liNumbers;
    });

    // get contest number
    // there must be an easier and simpler way
    const contest = await page.evaluate(() => {
      const h2Elements = Array.from(document.querySelectorAll('h2'));
      const resultadoEl = h2Elements.find((el) => el.innerText.includes('Resultado'));
      const spanEl = resultadoEl!.querySelector('span.ng-binding');
      const text = spanEl!.textContent;
      return text;
    });

    if (!numbers) {
      console.log(`Mega Sena XXXX: ${senaNumbers.join(' ')}`);
      await browser.close();
      return;
    }

    // for display purposes
    const zerodNumbers = numbers.map((num: number) => num.toString().padStart(2, '0'));
    const zerodSenaNumbers = senaNumbers.map((num: number) => num.toString().padStart(2, '0'));

    console.log(`
    Seus números: ${zerodNumbers.join(' ')}
    Mega Sena ${contest}: ${zerodSenaNumbers.join(' ')}
    `);

    await browser.close();
  } catch (err) {
    console.error(err);
  }
};

scrapeUrl('https://loterias.caixa.gov.br/Paginas/Mega-Sena.aspx');
