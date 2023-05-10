#!/usr/bin/env ts-node

const puppeteer = require('puppeteer');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .usage("Usage: npx check-sena -n '<numeros>'")
  .option('numbers', {
    alias: 'n',
    describe: 'Os 6 números para comparar com o concurso',
    demandOption: false,
    type: 'string',
    coerce: (numbers: string) => {
      const numberList = numbers.split(',').map((num) => parseInt(num.trim()));

      const isValidRange = (num: number) => num >= 1 && num <= 60; // must return true
      const hasDuplicates = (arr: number[]) => new Set(arr).size !== arr.length; // must return false

      if (numberList.length !== 6)
        throw new Error('Número inválido de elementos. Por favor mande apenas 6 números.');

      if (!numberList.every(isValidRange)) throw new Error('Números precisam ser entre 1 e 60.');

      if (hasDuplicates(numberList))
        throw new Error('Números duplicados encontrados. Por favor mande 6 números únicos.');

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

    const matchingNumbers = numbers.filter((num: number) => senaNumbers.includes(num));

    // for display purposes
    const zerodNumbers = numbers.map((num: number) => num.toString().padStart(2, '0'));
    const zerodSenaNumbers = senaNumbers.map((num: number) => num.toString().padStart(2, '0'));
    const zerodMatchingNumbers = matchingNumbers.map((num: number) => num.toString().padStart(2, '0'));

    console.log(`
    Seus números: ${zerodNumbers.join(' ')}
    Mega Sena ${contest}: ${zerodSenaNumbers.join(' ')}

    Você acertou ${matchingNumbers.length} número${matchingNumbers.length > 1 ? 's' : ''}: ${zerodMatchingNumbers}
    ${matchingNumbers.length >= 4 ? 'Um prêmio está disponível!' : ''}
    `);

    await browser.close();
  } catch (err) {
    console.error(err);
  }
};

scrapeUrl('https://loterias.caixa.gov.br/Paginas/Mega-Sena.aspx');
