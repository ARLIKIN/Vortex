# TorrentSearchApi

[![npm](https://img.shields.io/npm/dm/torrent-search-api.svg?maxAge=2592000)](https://npm-stat.com/charts.html?package=torrent-search-api)

Yet another node torrent search api based on x-ray.

## Install

```bash
npm install torrent-search-api
```

## Supported providers

- TorrentLeech: cookie authentification
- IpTorrents: credentials and cookie authentification
- Torrent9
- Torrentz2
- 1337x
- ThePirateBay
- YggTorrent : credentials and cookie authentification
- KickassTorrents
- Rarbg
- TorrentProject
- Yts
- Limetorrents
- Eztv

## Features

- **Search:** search torrents on multiples providers.

- **Torrent details:** get details about torrents (raw scraped html).

- **Download:** download torrents files.

- **Easily extensible:** you can easily add new providers and enjoy built-in features like cloudfare bypass.
 
## Функции

- **Поиск:** поиск торрентов у нескольких провайдеров.

- **Информация о торрентах:** получить подробную информацию о торрентах (необработанный HTML-код).

- **Скачать:** скачивать торрент-файлы.

- **Легко расширяется:** вы можете легко добавлять новых поставщиков и пользоваться встроенными функциями, такими как обход облачных тарифов.


## Quick Example
## Быстрый пример

```js
const TorrentSearchApi = require('torrent-search-api');

TorrentSearchApi.enableProvider('Torrent9');

// Search '1080' in 'Movies' category and limit to 20 results
const torrents = await TorrentSearchApi.search('1080', 'Movies', 20);
```

# Torrent Search API
# API торрент-поиска

### Get providers
### Получить провайдеров

```js
// Get providers
//Получить провайдеров
const providers = TorrentSearchApi.getProviders();

// Get active providers
//Получить активных поставщиков
const activeProviders = TorrentSearchApi.getActiveProviders();

// providers
// провайдеры
{
    {
        name: 'Torrent9',
        public: true,
        categories: ['All', 'Movies', 'TV', 'Music', 'Apps', 'Books', 'Top100']
    },
    {
        name: 'IpTorrents',
        public: false,
        categories: ['All', 'Movies', 'TV', 'Games', 'Music']
    },
    ...
}

```

### Enable provider
### Включить провайдера

```js

// Enable public providers
// Включить публичных провайдеров
TorrentSearchApi.enablePublicProviders();

// Enable public provider
// Включить публичных провайдеров
TorrentSearchApi.enableProvider('Torrent9');

// Enable private provider with cookies
// Включить приватный провайдер с куками
TorrentSearchApi.enableProvider('IpTorrents', ['uid=XXX;', 'pass=XXX;']);

// Enable private provider with credentials
// Включить частного провайдера с учетными данными
TorrentSearchApi.enableProvider('IpTorrents', 'USERNAME', 'PASSWORD');

// Enable private provider with token
// Включить частного провайдера с токеном
TorrentSearchApi.enableProvider('xxx', 'TOKEN');

```

### Disable provider
### Отключить провайдера

```js

// Disable provider
// Отключить провайдера
TorrentSearchApi.disableProvider('TorrentLeech');

// Disable all enabled providers
// Отключаем всех включенных провайдеров
TorrentSearchApi.disableAllProviders();

```

### Check if a provider exists and is active
### Проверяем, существует ли провайдер и активен ли он

```js

TorrentSearchApi.isProviderActive('1337x');

```

### Search torrent
### Поиск торрента

The result is an array of torrents sorted by seeders with more or less properties depending on the provider.
В результате получается массив торрентов, отсортированных по раздатчикам с теми или иными свойствами в зависимости от провайдера.

```js

// Search on actives providers
// Query: 1080
// Category: Movies (optional)
// Limit: 20 (optional)

// Поиск по активам провайдеров
// Запрос: 1080
// Категория: Фильмы (необязательно)
// Ограничение: 20 (необязательно)
const torrents = await TorrentSearchApi.search('1080', 'Movies', 20);

// Search with given providers
// query: 1080
// category: Movies (optional)
// limit: 20 (optional)
const torrents = await TorrentSearchApi.search(['IpTorrents', 'Torrent9'], '1080', 'Movies', 20);

```

### Torrent details
### Детали торрента

```js

// Get details (raw scraped html)
// torrent: taken from a search result
// Получить подробности (чистый HTML-код)
// торрент: взято из результатов поиска
const torrentHtmlDetail = await TorrentSearchApi.getTorrentDetails(torrent);

```

### Torrent magnet
### Торрент-магнит

```js

// Get magnet url
// torrent: taken from a search result
// Получить URL-адрес магнита
// торрент: взято из результатов поиска
const magnet = await TorrentSearchApi.getMagnet(torrent);

```

### Download torrent
### Скачать торрент

```js

// Download a buffer
// torrent: taken from a search result
// Загрузка буфера
// торрент: взято из результатов поиска
const buffer = await TorrentSearchApi.downloadTorrent(torrent);

// Download torrent and write it to the disk
// torrent: taken from a search result
// Скачиваем торрент и записываем на диск
// торрент: взято из результатов поиска
await TorrentSearchApi.downloadTorrent(torrent, filnamePath);
```

### Load custom providers
### Загрузка пользовательских провайдеров

You can code and add your custom providers (see provider definition format in existing providers)
Don't forget to enable your provider if you intend to use it.
Вы можете кодировать и добавлять своих пользовательских провайдеров (см. формат определения провайдера в существующих провайдерах).
Не забудьте включить своего провайдера, если собираетесь его использовать.

```js

// load multipe providers
// from a TorrentProvider custom class definition or instance
// загружаем несколько провайдеров
// из определения или экземпляра пользовательского класса Torrent Provider
const MyCustomProvider = require('./MyCustomProvider');
TorrentSearchApi.loadProvider(MyCustomProvider);

// from a provider object definition
// из определения объекта провайдера
TorrentSearchApi.loadProvider( {/*  определение объекта поставщика */});

// from an absolute path to class definition or json object definition
// от абсолютного пути к определению класса или определению объекта json
const path = require('path');
const providerFullPath = path.join(__dirname, './lib/providers/MyCustomProvider');
TorrentSearchApi.loadProviders(providerFullPath);

// load multipe providers within a directory
// only absolute path are allowed
// it loads every *.json and *.js file
// загружаем несколько провайдеров в директорию
// разрешен только абсолютный путь
// он загружает каждый файл *.json и *.js
const path = require('path');
const providerDirFullPath = path.join(__dirname, './lib/providers/');
TorrentSearchApi.loadProviders(providerDirFullPath);

// load multipe providers
// загружаем несколько провайдеров
const MyCustomProvider = require('./MyCustomProvider');
TorrentSearchApi.loadProviders(MyCustomProvider, {/*  определение объекта поставщика */}, ...);

```

### Remove provider
### Удалить провайдера

```js

// Remove provider
// Удалить провайдера
TorrentSearchApi.removeProvider('MyCustomProvider');

```

### Create TorrentSearchApi instance
### Создать экземпляр TorrentSearchApi

If you want to create an instance of the api without loading all the default providers and only load the ones that you want
Если вы хотите создать экземпляр API без загрузки всех провайдеров по умолчанию и загружать только те, которые вам нужны

```js

// create instance
// создать экземпляр
const createApi = require('torrent-search-api/createApi');
const TorrentSearchApi = createApi(/* те же аргументы, что и у метода loadProviders */)

```

### Create a new provider
### Создать нового провайдера

Check "test/createProvider.test.js" file if you want to create a new provider.

Running tests command

```bash
npm run test:watch
```

Отметьте файл «test/createProvider.test.js», если хотите создать нового провайдера.

Команда запуска тестов

``` ударить
Тест запуска npm: смотреть
```

### Override provider config
### Переопределить конфигурацию провайдера
 ```js
 // Fully or partial override of the provider config
 // Полное или частичное переопределение конфигурации провайдера
TorrentSearchApi.overrideConfig(providerName, newConfig);
 ```

## License
## Лицензия

MIT © 2020 [Jimmy Laurent](https://github.com/JimmyLaurent)
