var Byid = function(id){return document.getElementById(id);}

const TorrentSearchApi = require('torrent-search-api');
const fs = require('fs');
const { title } = require('process');

TorrentSearchApi.enableProvider('Torrent9');
TorrentSearchApi.enableProvider('1337x');
TorrentSearchApi.enableProvider('ThePirateBay'); // использовать magnit
TorrentSearchApi.enableProvider('TorrentProject'); 
var TorrentsFiles;

//TorrentSearchApi.enablePublicProviders(); 


function TestTorent()
{
    return TorrentSearchApi.isProviderActive('Torrent9') + " " + TorrentSearchApi.isProviderActive('Torrentz2') + " " + TorrentSearchApi.isProviderActive('1337x') + " " +
    TorrentSearchApi.isProviderActive('ThePirateBay') + " " + TorrentSearchApi.isProviderActive('KickassTorrents') + " " + TorrentSearchApi.isProviderActive('Rarbg') + " " + 
    TorrentSearchApi.isProviderActive('TorrentProject') + " " + TorrentSearchApi.isProviderActive('Yts') + " " + TorrentSearchApi.isProviderActive('Limetorrents') + " " +
    TorrentSearchApi.isProviderActive('Eztv');

}

Byid('Search_li_buttton').onclick = function()
    {
      var query = Byid('text-field__input').value;
      if(query == "") return;
      var category = 'All';
      var countResult = +(Byid('filter_input').value);
      Byid('Torrent_fon1').hidden = true;
      Byid('Torrent_fon2').hidden = true;
      Byid('Load').style.display = "block";
      searchTorrent(query,category,countResult);
    }


async function searchTorrent(query,category,size)
{
    const torrents = await TorrentSearchApi.search(query, category, size);
    TorrentsFiles = torrents;
    var Table = '<table id="TableTorrents"><tr class="TableStroka"><td>Название</td><td>Дата</td><td class="TablePeers">Peers</td><td class="TableSeed">Seeds</td><td>размер</td><td>провайдер</td><td>Страница</td></tr></table>';
    Byid('20Torrents').innerHTML = Table;
    var FinalHtml ="";
    var title,data,peers,seeds,size,link,dowloand,provaider;
    for(var i =0; i < torrents.length; i++)
    {
      
      title = '<td class="TableTitle" >'+torrents[i].title+'</td>';
      data = '<td>'+torrents[i].time+'</td>';
      peers = '<td class="TablePeers">'+torrents[i].peers+'</td>';
      seeds = '<td class="TableSeed">'+torrents[i].seeds+'</td>';
      size = '<td>'+torrents[i].size+'</td>';
      provaider = '<td>'+torrents[i].provider+'</td>';
      link = '<td><a class="TableLink" id="Link:'+i+'" href="#">Открыть</a></td>';
      dowloand = '<td><a id="Dowloand:'+i+'" class="TableDowloand" href="#">Скачать</a></td>'
      FinalHtml += '<tr class="TableStroka">'+title + data + peers + seeds + size + provaider+ link + dowloand+'</tr>';
    }
    Byid('TableTorrents').innerHTML += FinalHtml; 

    for(var i =0; i < torrents.length; i++)
    {
    strDow = 'Dowloand:'+i;
    strLink = 'Link:'+i;
    Byid(strDow).addEventListener("click",DowloandTorrentFile);
    Byid(strLink).addEventListener("click",OpenLink);
    }
    
    console.log(torrents);

    Byid('Load').style.display = "none";
    Byid('Torrent_fon1').hidden = false;
    Byid('Torrent_fon2').hidden = false;
    
}
function DowloandTorrentFile()
    {
        var id =(this.id).split(':')[1];
        DTF(+id);
    }

    function OpenLink()
    {
      var id =(this.id).split(':')[1];
      if(TorrentsFiles[id].provider != "ThePirateBay")
      {
        require("electron").shell.openExternal(TorrentsFiles[id].desc);
      }else
      {
        require("electron").shell.openExternal(TorrentsFiles[id].magnet);
      }
      
    }
    async function DTF(id)
    {
      //const magnet = await TorrentSearchApi.getMagnet(torrent[id]);
      if(TorrentsFiles[id].provider != "ThePirateBay")
      {
      var buffer = await TorrentSearchApi.downloadTorrent(TorrentsFiles[id]);
      var LehgthNameFile;
      var NameFile = '';
      if(TorrentsFiles[id].title.length > 100)
      {
        LehgthNameFile =  100;
      }else
      {
        LehgthNameFile = TorrentsFiles[id].title.length;
      }

      for(var i =0; i < LehgthNameFile; i++)
      {
        if(TorrentsFiles[id].title[i] != '/' 
        && TorrentsFiles[id].title[i] != ':' 
        && TorrentsFiles[id].title[i] != '*' 
        && TorrentsFiles[id].title[i] != '?' 
        && TorrentsFiles[id].title[i] != '"'
        && TorrentsFiles[id].title[i] != '<'
        && TorrentsFiles[id].title[i] != '>'
        && TorrentsFiles[id].title[i] != '|'
        && TorrentsFiles[id].title[i] != '.')
        {
          NameFile += TorrentsFiles[id].title[i];
        }else
        {
          NameFile +='_';
        }
      }

      NameFile += '.torrent';
      fs.writeFileSync('./Downloads/'+NameFile,buffer);
    }else
    {
      const magnet = TorrentsFiles[id].magnet;

      require("electron").shell.openExternal(magnet);
    }
    } 

console.log("Result test: " + TestTorent());

