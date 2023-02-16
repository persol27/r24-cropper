"use strict";

window.addEventListener('load', () => {
  const el = document.querySelector('body');
  el.classList.remove("body_no-load");
  
  if(/iP(hone|ad)/.test(window.navigator.userAgent)) {
    document.body.addEventListener('touchstart', () => {}, false);
  }
});

jQuery(document).ready(($) => {
    //=include plate/index.js
    //=include panel/index.js
    //=include customizer/index.js
    

    // Panel Class Init
    const panel = new Panel();
    
    // Add plate object
    panel.addPlate(new Plate(1));

    // Add new plate event
    $( '.panel-add' ).on('click', function(e) {
      let plate_new_id = $('.plate').length + 1;
      panel.addPlate(new Plate(plate_new_id));
    });
});