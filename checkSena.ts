#!/usr/bin/env ts-node

const puppeteer = require('puppeteer');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');

const senaUrl = 'https://loterias.caixa.gov.br/Paginas/Mega-Sena.aspx';
const log = console.log;

const argv = yargs(hideBin(process.argv))
  .usage("Usage: npx check-sena -n '<numeros>'")
  .option('numbers', {
    alias: 'n',
    describe: 'Os 6 números para comparar com o concurso',
    demandOption: false,
    type: 'string',
    coerce: (numbers: string): number[] => {
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

const scrapeUrl = async (url: string): Promise<void> => {
  const { numbers } = argv;

  try {
    // setup browser
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('#ulDezenas li'); // this element needs to load

    // get sena numbers
    const senaNumbers = await page.evaluate((): number[] => {
      const liElements: NodeListOf<Element> = document.querySelectorAll('#ulDezenas li');
      const liNumbers: number[] = Array.from(liElements).map((li) => +li.textContent!.trim());
      return liNumbers;
    });

    // get contest number
    // there must be an easier and simpler way
    const contest = await page.evaluate((): string | null => {
      const h2Elements: HTMLHeadingElement[] = Array.from(document.querySelectorAll('h2'));
      const resultadoEl: HTMLHeadingElement | undefined = h2Elements.find((el) =>
        el.innerText.includes('Resultado')
      );
      const spanEl: HTMLHeadingElement | null = resultadoEl!.querySelector('span.ng-binding');
      const text: string | null = spanEl!.textContent;
      return text;
    });

    const zerodSenaNumbers: string[] = senaNumbers.map((num: number) =>
      num.toString().padStart(2, '0')
    );

    const senaNumsColor = chalk.hex('#74c7ec');

    if (!numbers) {
      log(`
      ${chalk.bold(`Mega Sena ${contest}:`)} ${senaNumsColor(zerodSenaNumbers.join(' '))}
      `);
      await browser.close();
      return;
    }

    const matchingNumbers: number[] = numbers.filter((num: number) => senaNumbers.includes(num));

    // for display purposes
    const zerodNumbers: string[] = numbers.map((num: number) => num.toString().padStart(2, '0'));
    const zerodMatchingNumbers: string[] = matchingNumbers.map((num: number) =>
      num.toString().padStart(2, '0')
    );

    const matchingNumsColor =
      matchingNumbers.length <= 3 ? chalk.hex('#89dceb') : chalk.bold.hex('#a6e3a1');
    const ownNumsColor = chalk.hex('#b4befe');
    const prizeColor = chalk.bold.hex('#40a02b');
    const noNumsColor = chalk.hex('#f38ba8');
    const linkColor = chalk.underline.hex('#89b4fa');

    console.log(`
    ${chalk.bold('Seus números: ')}
    ${ownNumsColor(zerodNumbers.join(' '))}

    ${chalk.bold(`Mega Sena ${contest}: `)}
    ${senaNumsColor(zerodSenaNumbers.join(' '))}


    ${
      matchingNumbers.length
        ? `Você acertou ${matchingNumsColor(matchingNumbers.length)} número${
            matchingNumbers.length > 1 ? 's' : ''
          }: ${matchingNumsColor(zerodMatchingNumbers.join(' '))}`
        : `${noNumsColor('Você não acertou nenhum número')}`
    }
    ${matchingNumbers.length >= 4 ? `${prizeColor('Um prêmio está disponível!')}` : ''}

    
    ${linkColor(senaUrl)}
    `);

    await browser.close();
  } catch (err) {
    console.error(err);
  }
};

scrapeUrl(senaUrl);
