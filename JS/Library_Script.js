var Byid = function(id){return document.getElementById(id);}
const TorrentSearchApi = require('torrent-search-api');
TorrentSearchApi.enableProvider('Torrent9');
TorrentSearchApi.enableProvider('1337x');
TorrentSearchApi.enableProvider('ThePirateBay'); // использовать magnit
const dialog = require('node-file-dialog')
const fs = require('fs');
const { execFile } = require('child_process');
const { time } = require('console');
const { title } = require('process');
var TorrentsFiles;
var User_Lib;
var NameTitle;


//инициализация 
function InitLib()
{
  
    User_Lib =  JSON.parse(fs.readFileSync('Lib_user.json','utf8'));
    if(Object.keys(User_Lib).length ==0)
    {
        Byid('Content_Game').innerHTML = '<h1>У вас нет игр</h1>';
        Byid('Content_Game').style = 'text-align: center; margin-top: 50px;'
        //Byid('Head_Game_Lib').innerHTML = ''; удалена шапака
        return;
    }

    for(key in User_Lib)
    {
        Byid('Games_lib').innerHTML += '<div id="'+key+'" class="Game"><img class="Game_img" src="'+User_Lib[key].header_image+'" alt=""><p class="Game_text">'+key+'</p></div>';
    }

    for(key in User_Lib)
    {
        Byid(key).addEventListener("click",OpenLibGame);
    }

    NewGameLib(Object.keys(User_Lib)[0]);
    InitScreenshot();
    
    Byid('General_block').style.display = 'flex';
}
//обработка открытия страницы
function NewGameLib(title)
{
    Byid('20Torrents').innerHTML = '';
    Byid('Torrent_fon1').hidden = true;
    Byid('Torrent_fon2').hidden = true;
    Byid('Setting').textContent = "⋮";
    NameTitle = title

    if(User_Lib[title].source == "steam")
    {
      SteamSource();
    }else
    {
      AnotherSource();
    }
    // Игра из стима
    function SteamSource()
    {
          try
        {
          Byid('HeadIMG').style= "background-image: url('"+User_Lib[title].background_raw+"');" 
        }catch
        {
          Byid('HeadIMG').style= "background-image: url(../img/BG1.jpg);" 
        }
        
        Byid('NameTitle').textContent = title;
        Byid('release_date').textContent = 'Дата выхода:' + User_Lib[title].release_date;
        
        var text = 'Разработчики: ';
        for(var i =0; i < User_Lib[title].publishers.length; i++)
        {
            text += User_Lib[title].publishers[i] + '<br>';
        }

        Byid('vendor').innerHTML = text;


        Byid('PCrecomend_min').innerHTML = User_Lib[title].pc_requirements.minimum;
        if(User_Lib[title].pc_requirements.recommended)
        {
            Byid('PCrecomend_max').innerHTML = User_Lib[title].pc_requirements.recommended;
        }else
        {
            Byid('PCrecomend_max').innerHTML = '';
        }

        if(User_Lib[title].path != "")
        Byid('Setting').textContent = '✓'

        //Видео
        Byid('slider_items').innerHTML = '';
        var OnePart = '<div class="slider__item"><div class="slider__item-container"><div class="slider__item-content">';
        var TwoPart = '</div></div></div>';
        if(User_Lib[title].movies)
        for(var i =0; i < User_Lib[title].movies.length; i++)
        {
          Byid('slider_items').innerHTML += OnePart +'<video class="video" controls="" name="media" src="'+ User_Lib[title].movies[i].mp4.max +'"></video>'+ TwoPart;
        }

        //Скриншоты
        if(User_Lib[title].screenshots)
        for(var i =0; i < User_Lib[title].screenshots.length; i++)
        {
          Byid('slider_items').innerHTML += OnePart +'<img class="screen" src="'+ User_Lib[title].screenshots[i].path_full+'" alt="">'+ TwoPart;
        }
        Byid('Content_Video_Rec').hidden = false;
        Byid('release_date').hidden = false;
        Byid('vendor').hidden = false;
        
    }
    // Добавленная игра
    function AnotherSource()
    {
    
      Byid('HeadIMG').style= "background-image: url(../img/BG1.jpg);" 
      Byid('NameTitle').textContent = title;
      if(User_Lib[title].path != "")
      Byid('Setting').textContent = '✓';
      Byid('release_date').hidden = true;
      Byid('vendor').hidden = true;
      Byid('Content_Video_Rec').hidden = true;

    }
}
// Open Page Game
function OpenLibGame()
{
    NewGameLib(this.id)
}

// Слайдер изображений
function InitScreenshot()
{
  const $slider = document.querySelector('[data-slider="chiefslider"]');
    const slider = new ChiefSlider($slider, {
      loop: false
    });
}

//Кнопка загрузки
Byid('BTNDowloand').onclick = function()
    {
      var query = Byid('NameTitle').textContent;
      console.log(query);
      var category = 'Games';
      var countResult = 20;
      search(query,category,countResult);
    }

    async function search(query,category,countResult)
    {
        const torrents = await TorrentSearchApi.search(query, category, countResult);
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

//Кнопки играть и настройка
Byid('BTNPlay').onclick = function()
{
    var path = User_Lib[NameTitle].path;
    if(path != "")
    {
      const child = execFile(path, [], (error, stdout, stderr) => {
        if (error) {
          throw error;
        }
        console.log(stdout);
      });
    }else
    {
      alert("Настройте запуск");
    }
}

Byid('Setting').onclick = function()
{
  function Lib(dir)
  {
    User_Lib[NameTitle].path = dir;
    fs.writeFileSync('Lib_user.json',JSON.stringify(User_Lib));
    Byid('Setting').textContent = '✓'
  }

  const config={type:'open-file'}
  dialog(config)
    .then(dir => Lib(dir[0]))
    .catch(err => alert(err))
}

Byid('BTNDelete').onclick = function()
{
  delete User_Lib[NameTitle];
  fs.writeFileSync('Lib_user.json',JSON.stringify(User_Lib));
  newInit();
}

function newInit()
{
  Byid('Games_lib').innerHTML = '';
  InitLib();
}

//Кнопка добавить игру
Byid('Game_fon_div').onclick = function()
{
  var Path;
  var name;
 
  
    function Path(dir)
    {
      Path = dir;
      var temp = dir.split('/');
      name = temp[temp.length-1].split('.')[0];
      Save();
    }

    function Save()
    {
      User_Lib[name] = {};
        User_Lib[name]["steam_appid"] =  undefined;
        User_Lib[name]["header_image"] = "../img/Default_Libary.png";
        User_Lib[name]["release_date"] = undefined;
        User_Lib[name]["publishers"] = undefined;
        User_Lib[name]["pc_requirements"] = undefined;
        User_Lib[name]["background_raw"] = undefined;
        User_Lib[name]["movies"] = undefined;
        User_Lib[name]["screenshots"] = undefined;
        User_Lib[name]["source"] = "another";
        User_Lib[name]["path"] = Path;
        fs.writeFileSync('Lib_user.json',JSON.stringify(User_Lib));
        newInit();
    }
  
    const config={type:'open-file'}
    dialog(config)
      .then(dir => Path(dir[0]))
      .catch(err => alert(err))
  
}
//✓⋮


