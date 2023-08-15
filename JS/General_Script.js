const steam = require('steamstoreapi');
const fs = require('fs');
var pages;
let recommendationsLoaded = false;
var Tags = ['4182']; //Singl Player
var Byid = function(id)
{
  return document.getElementById(id);
}

var PaintElement = function(data,search)
{
  console.log(data);
  if(data.length == 0)
  {
    showPopup("По вашему запросу ничего не найдено")
    return;
  }
  if(search)
  Byid('Content_div').innerHTML = '';
  var GameDiv = "";
  for(var i =0; i < data.length; i++)
  {
    if(i%3 ==0 || i==0)
    {
      if(i!=0){GameDiv += '</div>';}
      GameDiv += '<div class="GameBlock">';
    }
    GameDiv += '<div onclick="OpenPageGame('+data[i].appid+')" id="Obj:' + data[i].appid+'"><img id="'+data[i].appid+'_img" class="GameIMG" src="'+data[i].headerImage+'" alt="'+data[i].smallImage
    +'"><p id="'+data[i].appid+'_p" class="GameP">'+data[i].title+'</p></div>'
  }
  if(data.length %3 ==0)
  {
    GameDiv += '</div>';
  }
  Byid('Content_div').innerHTML += GameDiv;
  recommendationsLoaded = false;
}

var GetRecomendGames = function(page)
{
  if(recommendationsLoaded)return
  recommendationsLoaded = true;
  pages = page
  var searchData = {
    "onlyGames": true,
    "term": "", // Search text
    "tags": Tags,
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
    "page": page,
  }
  steam.search(searchData,function(data) {PaintElement(data,false)})
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
      console.log(data);
      fs.writeFileSync('data.txt',JSON.stringify(data));
      document.location.href = "GameScreen.html"; 
    }
}
GetRecomendGames(1);


var SearchBTN = function(search_Text)
{
  var ReqestGame = Byid('text-field__input').value;
  var TagsS
  if(search_Text && ReqestGame != ''){TagsS = []}
  else{TagsS = Tags}
  var searchData = {
    "onlyGames": true,
    "term": ReqestGame, // Search text
    "tags": TagsS,// All Category
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
  steam.search(searchData,function(data) {PaintElement(data,true)})
}


//Поиск по нажатию клавиши Enther
var input = document.getElementById("text-field__input");
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        SearchBTN(true);
    }
});

//Сообщение
function showPopup(text) {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.textContent = text;
  document.body.appendChild(popup);

  setTimeout(() => {
    document.body.removeChild(popup);
  }, 2000);

}

//Загрузка страницы при Scroll
function isBottom30Percent() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.body.offsetHeight;
  const scrollPosition = window.scrollY;
  const remainingScroll = documentHeight - (scrollPosition + windowHeight);
  return remainingScroll < (0.4 * windowHeight);
}

// Обработчик события прокрутки страницы
window.onscroll = function() {
  if (isBottom30Percent()) {
      GetRecomendGames(pages+1);
  }
};

//Дроп теги поиска

function Add_Teg(Teg)
{
  if(!Tags.includes(Teg))
    {
      Tags.push(Teg);
      SearchBTN(false);
    }
}

function Remove_Teg(Teg)
{
  if(Tags.includes(Teg))
    {
      Tags.splice(Tags.indexOf(Teg),1);
      SearchBTN(false);
    }
}


document.addEventListener("DOMContentLoaded", function () {
  const selectBox = document.querySelector(".select-box");
  const dropdownContent = document.querySelector(".dropdown-content");
  const searchInput = selectBox.querySelector("input[type='text']");

  selectBox.addEventListener("click", function (event) {
      event.stopPropagation();
      dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
  });

  dropdownContent.addEventListener("click", function (event) {
      event.stopPropagation();
  });

  document.addEventListener("click", function () {
      dropdownContent.style.display = "none";
  });

  searchInput.addEventListener("input", function () {
      const query = searchInput.value.toLowerCase();
      const labels = dropdownContent.querySelectorAll("label");

      labels.forEach(function (label) {
          const labelText = label.textContent.toLowerCase();
          if (labelText.includes(query)) {
              label.style.display = "block";
          } else {
              label.style.display = "none";
          }
      });
  });

  const checkboxes = dropdownContent.querySelectorAll("input[type='checkbox']");

  checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
          const label = checkbox.parentNode;
          if (checkbox.checked) {
              label.classList.add("selected");
              Add_Teg(checkbox.value);
          } else {
              label.classList.remove("selected");
              Remove_Teg(checkbox.value);
          }

          const selectedLabels = dropdownContent.querySelectorAll(".selected");
          selectedLabels.forEach(function (selectedLabel) {
              dropdownContent.prepend(selectedLabel);
          });
      });
  });
});


window.addEventListener('pageshow', function(event) {
  var historyTraversal = event.persisted || 
   (typeof window.performance != 'undefined' && 
  window.performance.navigation.type === 2);
  
  if (historyTraversal) {
    location.reload();
  }
});


