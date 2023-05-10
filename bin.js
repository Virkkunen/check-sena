#!/usr/bin/env ts-node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var puppeteer = require('puppeteer');
var yargs = require('yargs/yargs');
var hideBin = require('yargs/helpers').hideBin;
var chalk = require('chalk');
var senaUrl = 'https://loterias.caixa.gov.br/Paginas/Mega-Sena.aspx';
var log = console.log;
var argv = yargs(hideBin(process.argv))
    .usage("Usage: npx check-sena -n '<numeros>'")
    .option('numbers', {
    alias: 'n',
    describe: 'Os 6 números para comparar com o concurso',
    demandOption: false,
    type: 'string',
    coerce: function (numbers) {
        var numberList = numbers.split(',').map(function (num) { return parseInt(num.trim()); });
        var isValidRange = function (num) { return num >= 1 && num <= 60; }; // must return true
        var hasDuplicates = function (arr) { return new Set(arr).size !== arr.length; }; // must return false
        if (numberList.length !== 6)
            throw new Error('Número inválido de elementos. Por favor mande apenas 6 números.');
        if (!numberList.every(isValidRange))
            throw new Error('Números precisam ser entre 1 e 60.');
        if (hasDuplicates(numberList))
            throw new Error('Números duplicados encontrados. Por favor mande 6 números únicos.');
        return numberList;
    },
})
    .help('help')
    .alias('help', 'h').argv;
var scrapeUrl = function (url) { return __awaiter(_this, void 0, void 0, function () {
    var numbers, browser, page, senaNumbers_1, contest, zerodSenaNumbers, senaNumsColor, matchingNumbers, zerodNumbers, zerodMatchingNumbers, matchingNumsColor, ownNumsColor, prizeColor, noNumsColor, linkColor, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                numbers = argv.numbers;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, , 12]);
                return [4 /*yield*/, puppeteer.launch({ headless: 'new' })];
            case 2:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 3:
                page = _a.sent();
                return [4 /*yield*/, page.goto(url)];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.waitForSelector('#ulDezenas li')];
            case 5:
                _a.sent(); // this element needs to load
                return [4 /*yield*/, page.evaluate(function () {
                        var liElements = document.querySelectorAll('#ulDezenas li');
                        var liNumbers = Array.from(liElements).map(function (li) { return +li.textContent.trim(); });
                        return liNumbers;
                    })];
            case 6:
                senaNumbers_1 = _a.sent();
                return [4 /*yield*/, page.evaluate(function () {
                        var h2Elements = Array.from(document.querySelectorAll('h2'));
                        var resultadoEl = h2Elements.find(function (el) {
                            return el.innerText.includes('Resultado');
                        });
                        var spanEl = resultadoEl.querySelector('span.ng-binding');
                        var text = spanEl.textContent;
                        return text;
                    })];
            case 7:
                contest = _a.sent();
                zerodSenaNumbers = senaNumbers_1.map(function (num) {
                    return num.toString().padStart(2, '0');
                });
                senaNumsColor = chalk.hex('#74c7ec');
                if (!!numbers) return [3 /*break*/, 9];
                log("\n      ".concat(chalk.bold("Mega Sena ".concat(contest, ":")), " ").concat(senaNumsColor(zerodSenaNumbers.join(' ')), "\n      "));
                return [4 /*yield*/, browser.close()];
            case 8:
                _a.sent();
                return [2 /*return*/];
            case 9:
                matchingNumbers = numbers.filter(function (num) { return senaNumbers_1.includes(num); });
                zerodNumbers = numbers.map(function (num) { return num.toString().padStart(2, '0'); });
                zerodMatchingNumbers = matchingNumbers.map(function (num) {
                    return num.toString().padStart(2, '0');
                });
                matchingNumsColor = matchingNumbers.length <= 3 ? chalk.hex('#89dceb') : chalk.bold.hex('#a6e3a1');
                ownNumsColor = chalk.hex('#b4befe');
                prizeColor = chalk.bold.hex('#40a02b');
                noNumsColor = chalk.hex('#f38ba8');
                linkColor = chalk.underline.hex('#89b4fa');
                console.log("\n    ".concat(chalk.bold('Seus números: '), "\n    ").concat(ownNumsColor(zerodNumbers.join(' ')), "\n\n    ").concat(chalk.bold("Mega Sena ".concat(contest, ": ")), "\n    ").concat(senaNumsColor(zerodSenaNumbers.join(' ')), "\n\n\n    ").concat(matchingNumbers.length
                    ? "Voc\u00EA acertou ".concat(matchingNumsColor(matchingNumbers.length), " n\u00FAmero").concat(matchingNumbers.length > 1 ? 's' : '', ": ").concat(matchingNumsColor(zerodMatchingNumbers.join(' ')))
                    : "".concat(noNumsColor('Você não acertou nenhum número')), "\n    ").concat(matchingNumbers.length >= 4 ? "".concat(prizeColor('Um prêmio está disponível!')) : '', "\n\n    \n    ").concat(linkColor(senaUrl), "\n    "));
                return [4 /*yield*/, browser.close()];
            case 10:
                _a.sent();
                return [3 /*break*/, 12];
            case 11:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
scrapeUrl(senaUrl);
