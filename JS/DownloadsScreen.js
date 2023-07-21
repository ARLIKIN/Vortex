var Byid = function(id){return document.getElementById(id);}
const fs = require('fs');
const gl = require('glob');
const { error } = require('console');
const { exec } = require('child_process');



function InitPage()
{
    const torrentFiles = gl.globSync('./Downloads/*.torrent');
    console.log(torrentFiles);
    var title;
    var tempid;
    for(var i =0; i < torrentFiles.length; i++)
    {
        title = torrentFiles[i].split('\\');
        title = title[1];
        tempid = title.split('.')[0].replace(/\s+/g, '');
        
        

        Byid('Content_div').innerHTML += ' <div class="elemtorent" id="Div_'+tempid+'"><p class="elemtorent_text" id="P_'+tempid+'">'+title+'</p><div class="elemtorent_BTN">'+
        '<span class="BTNOpen" onclick=OpenT("'+tempid+'") id="Open_'+title+'">Открыть</span><span class="BTNDelete" onclick=DeletT("'+tempid+'") id="Del_'+title+'">🗑️</span></div></div>';




    }
}


function OpenT(i)
{
    
    try
    {
            exec('start "" "./Downloads/'+Byid('P_'+i).textContent+'"', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            });
    }catch{alert('Что то пошло не так' + error)}
    
}

function DeletT(i)
{
    var path = './Downloads/' + Byid('P_'+i).textContent;

    fs.unlink(path, (err) => {
        if (err) throw err;
        console.log('file.txt was deleted');
      });

    var Div = Byid('Div_'+i)
    Div.parentNode.removeChild(Div);
}






