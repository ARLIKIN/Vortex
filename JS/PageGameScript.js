var Byid = function(id){return document.getElementById(id);}
const TorrentSearchApi = require('torrent-search-api');
TorrentSearchApi.enableProvider('Torrent9');
TorrentSearchApi.enableProvider('1337x');
TorrentSearchApi.enableProvider('ThePirateBay'); // использовать magnit
const fs = require('fs');
var TorrentsFiles;
var User_Lib;
var Games_Lib = false;
var data;






function InitScreenshot()
{
  const $slider = document.querySelector('[data-slider="chiefslider"]');
    const slider = new ChiefSlider($slider, {
      loop: false
    });
}


function InitPage()
{
  data = JSON.parse(fs.readFileSync('data.txt','utf8')); // Вся информация по игре
  User_Lib = JSON.parse(fs.readFileSync('Lib_user.json','utf8'));
  
  for(key in User_Lib)  // есть ли игра в библиотеке
  {
    if(key == data.name)
    {
      Games_Lib = true;
    }
  }

  if(Games_Lib)
  {
    Byid('img_lib_button').src = '../img/Lib_button_saved.svg';
  }

  console.log(data);

  Byid('NameTitle').textContent = data.name; // Название игры
  document.title = data.name;


  //видео
  Byid('slider_items').innerHTML = '';
  var OnePart = '<div class="slider__item"><div class="slider__item-container"><div class="slider__item-content">';
  var TwoPart = '</div></div></div>';
  if(data.movies)
  for(var i =0; i < data.movies.length && i<15; i++)
  {
    Byid('slider_items').innerHTML += OnePart +'<video class="video" controls="" name="media" src="'+ data.movies[i].mp4.max +'"></video>'+ TwoPart;
  }

  //Скриншоты
  if(data.screenshots)
  for(var i =0; i < data.screenshots.length; i++)
  {
    Byid('slider_items').innerHTML += OnePart +'<img class="screen" src="'+ data.screenshots[i].path_full+'" alt="">'+ TwoPart;
  }

  //краткое описание 
  Byid('header_image').src = data.header_image;
  Byid('short_description').textContent = data.short_description;
  if(data.metacritic)
  {
    Byid('metacritic').textContent = data.metacritic.score;
  }else
  {
    Byid('metacritic').textContent = 'Нет информации';
  }
  //Жанры
  var strGenres = '';
  for(var i =0; i < data.genres.length; i++)
  {
    strGenres += data.genres[i].description;
    if(i != data.genres.length-1)
    strGenres += ',';
  }

  Byid('metacritic_btn').onclick = function()
  {
    require("electron").shell.openExternal(data.metacritic.url);
  }

  Byid('genres').textContent = strGenres;

  //Описание игры
  Byid('GeneralABOUT').innerHTML = data.about_the_game;

  //Категории
  Byid('categories').innerHTML = '';
  for(var i =0; i < data.categories.length; i++)
  {
    Byid('categories').innerHTML += data.categories[i].description;
    if(i != data.categories.length-1)
    Byid('categories').innerHTML += '<br>';
  }

  //Языки
  var Lang = data.supported_languages.split(',');
  Byid('supported_languages').innerHTML = '';
  for(var i =0; i < Lang.length; i++)
  {
    Byid('supported_languages').innerHTML += Lang[i];
    if(i != Lang.length-1)
    Byid('supported_languages').innerHTML += '<br>';
  }

  //Разработчик
  var develop = "";
  for(var i =0; i < data.publishers.length; i++)
  {
    develop += data.publishers[i] + " <br> ";
  }

  develop += "Релиз: " + data.release_date.date;

  Byid('developer').innerHTML = develop


  //Минимальные системные требования
  Byid('SystemRecMin').innerHTML = data.pc_requirements.minimum;
  if(data.pc_requirements.recommended)
  Byid('SystemRecMax').innerHTML += data.pc_requirements.recommended  
}

InitPage();
InitScreenshot();




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

    function DowloandTorrentFile()
    {
        var id =(this.id).split(':')[1];
        DTF(+id);
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
      showPopup()
    }else
    {
      const magnet = TorrentsFiles[id].magnet;

      require("electron").shell.openExternal(magnet);
    }
    }

    function showPopup() {
      const popup = document.createElement('div');
      popup.className = 'popup';
      popup.textContent = 'Файл загружен';
      document.body.appendChild(popup);
    
      setTimeout(() => {
        document.body.removeChild(popup);
      }, 2000);
    
    }

    Byid('Lib_button').onclick = function()
    {
      if(Games_Lib)
      {
        Byid('img_lib_button').src = '../img/Lib_button_save.svg';
        Games_Lib = false;
        delete User_Lib[data.name]
      }else
      {
        
        User_Lib[data.name] = {};
        User_Lib[data.name]["steam_appid"] =  data.steam_appid;
        User_Lib[data.name]["header_image"] = data.header_image;
        User_Lib[data.name]["release_date"] = data.release_date.date;
        User_Lib[data.name]["publishers"] = data.publishers;
        User_Lib[data.name]["pc_requirements"] = data.pc_requirements;
        User_Lib[data.name]["background_raw"] = data.background_raw;
        User_Lib[data.name]["movies"] = data.movies;
        User_Lib[data.name]["screenshots"] = data.screenshots;
        User_Lib[data.name]["source"] = "steam";
        User_Lib[data.name]["path"] = "";
        Byid('img_lib_button').src = '../img/Lib_button_saved.svg';
        Games_Lib = true;
      }
      fs.writeFileSync('Lib_user.json',JSON.stringify(User_Lib));
    }




   