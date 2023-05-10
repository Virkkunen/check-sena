# check-sena
<img alt="GitHub Package.json Version" src="https://img.shields.io/github/package-json/v/virkkunen/check-sena" /> <img alt="Github License" src="https://img.shields.io/github/license/virkkunen/check-sena" />
<img alt="GitHub Issues" src="https://img.shields.io/github/issues/virkkunen/check-sena" />
<img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/virkkunen/check-sena" />

A package that checks if the numbers passed as parameter match Brazil's lottery "Mega Sena" numbers

## Usage
```sh
npx check-sena --numbers '<numbers>'
```

### Options

|    Command     |              Description             |  Type  | Required  | Example                  |
|:--------------:|------------------------------------  |:------:|:---------:|:------------------------:|
| -n, --numbers  | 6 numbers, comma separated           | string | Yes       | '01, 02, 03, 04, 05, 06' |
| -h, --help     | Show help                            |        |           |                          |
| --version      | Show version                         |        |           |                          |

### Output
```sh
npx check-sena -n '01, 02, 3, 4, 55, 60'
```

```md
    Seus números: 01 02 03 04 55 60
    Mega Sena Concurso 0001 (09/05/2023): 01 02 03 04 33 44

    Você acertou 4 números: 01, 02, 03, 04
    Um prêmio está disponível!

    https://loterias.caixa.gov.br/Paginas/Mega-Sena.aspx
```

---

## Authors

- [@Virkkunen](https://www.github.com/Virkkunen)