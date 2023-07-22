
const steam = require('steamstoreapi');
const fs = require('fs');
var Byid = function(id)
{
  return document.getElementById(id);
}

var PaintElement = function(data)
{
  console.log(data);
  if(data.length == 0)
  {
    showPopup("По вашему запросу ничего не найдено")
    return;
  }
  RecomendGames = data;
  var GameDiv = "";
  for(var i =0; i < data.length; i++)
  {
    if(i%3 ==0 || i==0)
    {
      if(i!=0){GameDiv += '</div>';}
      GameDiv += '<div class="GameBlock">';
    }
    GameDiv += '<div id="Obj:' + data[i].appid+'"><img id="'+data[i].appid+'_img" class="GameIMG" src="'+data[i].headerImage+'" alt="'+data[i].smallImage
    +'"><p id="'+data[i].appid+'_p" class="GameP">'+data[i].title+'</p></div>'
  }
  if(data.length %3 ==0)
  {
    GameDiv += '</div>';
  }
  Byid('Content_div').innerHTML = GameDiv;

  var temp1 = "";
  var temp2 = "";
  for(var i =0; i < data.length; i++)
  {
    temp1 = data[i].appid+'_img';
    temp2 = data[i].appid+'_p';
    Byid(temp1).addEventListener("click",OpenGame);
    Byid(temp2).addEventListener("click",OpenGame);
  }
}

var GetRecomendGames = function()
{
  var searchData = {
    "onlyGames": true,
    "term": "", // Search text
    "tags": ['4182'],//Singl Player
    "untags": [],
    "category1": [],
    "category2": [],
    "category3": [],
    "special_categories": [],
    "onlySpecials": false,
    "maxprice": -1,
    "cc": "us",
    "deck_compatibility": [], //2=Verified & 3=Playable
    "os": [], //win, mac, linux
    "supportedlang": [],
    "vrsupport": [],
    "excluldeVRonlyTitles": false,
    "page": 1,
  }
  steam.search(searchData,function(data) {PaintElement(data)})
 
}


var OpenGame = function()
{
  OpenPageGame(this.id.split('_')[0])
}


var OpenPageGame = function(id)
{
  var idData = {
    appid:id,
    cc:'us'
  }

  steam.getByID(idData,function(data){CreateNewPage(data)})
    function CreateNewPage(data)
    {
      //var FinalHTML = fs.readFileSync('JS/CreateList1.txt','utf8');
      //console.log(FinalHTML);
      console.log(data);
      fs.writeFileSync('data.txt',JSON.stringify(data));
      //var sample =  fs.readFileSync('HTML/Temp_0.txt','utf-8'); //Неизвестно зачем это было написано удалить после тестов
      //fs.writeFileSync('HTML/Temp_2.html',sample);
      document.location.href = "GameScreen.html"; 
    }
}
GetRecomendGames();


var SearchBTN = function()
{
  var ReqestGame = Byid('text-field__input').value;
  if(ReqestGame == '')
  {
    document.location.href = "MainScreen.html"; 
  }

  var searchData = {
    "onlyGames": true,
    "term": ReqestGame, // Search text
    "tags": [],// All Category
    "untags": [],
    "category1": [],
    "category2": [],
    "category3": [],
    "special_categories": [],
    "onlySpecials": false,
    "maxprice": -1,
    "cc": "us",
    "deck_compatibility": [], //2=Verified & 3=Playable
    "os": [], //win, mac, linux
    "supportedlang": [],
    "vrsupport": [],
    "excluldeVRonlyTitles": false,
    "page": 1,
  }
  steam.search(searchData,function(data) {PaintElement(data)})
}



var input = document.getElementById("text-field__input");
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        SearchBTN();
    }
});

function showPopup(text) {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.textContent = text;
  document.body.appendChild(popup);

  setTimeout(() => {
    document.body.removeChild(popup);
  }, 2000);

}