var Byid = function(id)
{
  return document.getElementById(id);
}
const $slider = document.querySelector('[data-slider="chiefslider"]');
    const slider = new ChiefSlider($slider, {
      loop: false
    });



    Byid('BTNDowloand').onclick = function()
    {
      
    }


    Byid('Lib_button').onclick = function()
    {
      Byid('img_lib_button').src = '../img/Lib_button_saved.svg';
    }






