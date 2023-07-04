var Byid = function(id)
{
    return document.getElementById(id);
}
alert("good")
const TorrentSearchApi = require('torrent-search-api');
const fs = require('fs');
const { title } = require('process');

TorrentSearchApi.enableProvider('Torrent9');
TorrentSearchApi.enableProvider('Torrentz2');
TorrentSearchApi.enableProvider('1337x');
TorrentSearchApi.enableProvider('ThePirateBay');
TorrentSearchApi.enableProvider('KickassTorrents');
TorrentSearchApi.enableProvider('Rarbg');
TorrentSearchApi.enableProvider('TorrentProject');
TorrentSearchApi.enableProvider('Yts');
TorrentSearchApi.enableProvider('Limetorrents');
TorrentSearchApi.enableProvider('Eztv');
const activeProviders = TorrentSearchApi.getActiveProviders();
console.log(activeProviders);

var torrentsResult;

Byid('btnSearch').onclick = function()
{
    var query = Byid('TextSearch').value;
    console.log(query);
    var category = 'Games';
    var countResult = 20;
    Byid('header').textContent = 'Идет Поиск'
    search(query,category,countResult);

}

async function search(query,category,countResult)
{
    const torrents = await TorrentSearchApi.search(query, category, countResult);
    torrentsResult = torrents;

    var str = '';
    Byid('ResultSearch').innerHTML = str;
    for(var i =0; i < torrents.length; i++)
    {
        for(let key in torrents[i])
        {
            str += key + ' ' + torrents[i][key] + '<br>';
        }
        str += '<button id="ButtSearchTorrent:'+i+'">Открыть торент</button>'
        str += '<br>' + '<br>'; 
        Byid('ResultSearch').innerHTML += str;
        str = '';
    }
    

    for(var i =0; i < torrents.length; i++)
    {
        str = 'ButtSearchTorrent:'+i;
        Byid(str).addEventListener("click",Open);
    }
    
    console.log(torrents);
    




    Byid('header').textContent = 'Найдено ' + torrents.length + ' результатов';
    
}


function Open()
{
    var id =(this.id).split(':')[1];
    OpenT(+id);
}

async function OpenT(id)
{
    var nameFile = 'Default.html'
    const torrentHtmlDetail = await TorrentSearchApi.getTorrentDetails(torrentsResult[id]);
    if((torrentsResult[id].title).length <223)
     nameFile= torrentsResult[id].title + ".html";
    fs.writeFile(  nameFile,torrentHtmlDetail, function(err, data){
        alert('Файл создан!');
    })

}





