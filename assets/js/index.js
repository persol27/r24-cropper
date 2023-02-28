"use strict";

window.addEventListener('load', () => {
  const el = document.querySelector('body');
  el.classList.remove("body_no-load");
  
  if(/iP(hone|ad)/.test(window.navigator.userAgent)) {
    document.body.addEventListener('touchstart', () => {}, false);
  }
});

function roundFloat(num) {
    const round_result = Math.floor(num * 100) / 100;
    
    return round_result;
}

jQuery(document).ready(($) => {
    //=include plate/index.js
    //=include panel/index.js
    //=include customizer/index.js
    //=include modal/index.js


    // Panel Class Init
    const panel = new Panel();
    
    // Add plate object
    panel.addPlate(new Plate(1));

    const modals = [
      new Modal(1, "Preview", "preview", ".cropper__preview-button"),
    ];

    // Add new plate event
    $( '.panel-add' ).on('click', function(e) {
      let plate_new_id = $('.plate:last').attr('id');
      plate_new_id = Number(plate_new_id.split('_')[2]) + 1;

      panel.addPlate(new Plate(plate_new_id));
    });

    // Remove plate event
    $( '.plate-panels' ).on('removePlate', function(e, id) {
      panel.removePlate(id);
    });

    // Changed input width
    $( '.plate-panels' ).on('changedWidth', function() {
      panel.backgroundUpdate();
    });

    // Replace Image Event
    $( '.panel-replace' ).on('click', function(e) {
      panel.image = './assets/images/image.jpg';
      
      panel.plates.forEach((item) => {
        item.image = panel.image;
        item.setCropperImage();
      });
    });

    // Mirroring
    $( `.background__scale-button` ).on('click', (e) => {
      e.preventDefault();

      let thisId = $(e.target).parent('.background__item').attr('id');
      panel.scaleBackground(thisId);
    });


    // Draggable Plates Track plate-track

    dragElement(document.querySelector('.plate-track'), '.cropper__background');

    function dragElement(elmnt, container) {
      let pos1 = 0,
          pos3 = 0,
          pos4 = 0;
      
      elmnt.ontouchstart = dragTouchStart;
      elmnt.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        let limit = {min: 1, max: $(container).width() - elmnt.clientWidth - 1},
            pos_x = elmnt.offsetLeft - pos1;

        pos_x = pos_x < limit.min ? limit.min : pos_x;
        pos_x = pos_x > limit.max ? limit.max : pos_x;
        elmnt.style.left = pos_x + "px";
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }


      function dragTouchStart(e) {
        console.log(e);
        
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;

        document.ontouchend = closeTouchDragElement;
        // call a function whenever the cursor moves:
        document.ontouchmove = elementTouchDrag;
      }

      function elementTouchDrag(e) {
        e = e || window.event;
        
        // calculate the new cursor position:
        pos1 = pos3 - e.touches[0].clientX;
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        // set the element's new position:
        let limit = {min: 1, max: $(container).width() - elmnt.clientWidth - 1},
            pos_x = elmnt.offsetLeft - pos1;

        pos_x = pos_x < limit.min ? limit.min : pos_x;
        pos_x = pos_x > limit.max ? limit.max : pos_x;
        elmnt.style.left = pos_x + "px";
      }

      function closeTouchDragElement() {
        // stop moving when mouse button is released:
        document.ontouchend = null;
        document.ontouchmove = null;
      }
    }

});