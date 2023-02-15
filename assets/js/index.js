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

    // Script Init
    let objects_arr = [panel, plate, customizer,];
    const init = objects => objects.forEach((el) => el.init());

    init(objects_arr);

    // Script Start
    plate.setImageCanvas('./assets/images/test-image.png');


    // Plate Events
    $( '.plate .plate__scale' ).on('click', function (e) {
      const plate_id = $(this).parent('.plate').attr('id'),
            plate_data = $(`.plate canvas`).cropper('getData'),
            plate_scale = plate_data.scaleX == -1 ? 1 : -1;
      
      $(`#${plate_id} canvas`).cropper('scaleX', plate_scale);
    });

    $( '.panel-add' ).on('click', function (e) {
      let plate_length = $('.plate').length + 1;
      $('.plate').clone().attr('id', `plate_id_${plate_length}`).appendTo('.plate-col');
    });

    // Events
    $( document ).on('mouseover', '.plate .cropper-container', () => {
      $( document ).find('.cropper-center').hide();
    }).on('mouseleave', '.plate .cropper-container', () => {
      $( document ).find('.cropper-center').show();
    });

    /*let plate_html = document.querySelector(".plate .cropper-container");
    plate_html.addEventListener("touchstart", (e) => $( document ).find('.cropper-center').hide(), false);
    plate_html.addEventListener("touchend",   (e) => $( document ).find('.cropper-center').show(), false);*/
});

// obj Crop находится в obj Plate
// obj Plate находится в array Plate_arr в obj Panel
// obj Customizer находится в obj Panel