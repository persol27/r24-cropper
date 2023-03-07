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
    //=include panel/index.js
    //=include stage/index.js
    //=include stage/cropper.js

    //=include modal/index.js
    //=include video/index.js

    //=include plate/index.js
    //=include background/index.js

    const panel = new PanelNew('.main', 'ss', 'ss3');
    panel.addStage(
      new CropperStage(
        'cropper',
        'Wähle Deine Maße',
        'Wie findest Du die richtigen Maße?',
      )
    );

    // Add background
    panel.stages[0].addBackground(new Background(1));

    // Add plate object
    setTimeout(panel.stages[0].addPlate(new Plate(1)), 75);

    // Panel Modal Init
    panel.addModal(
      new Modal("Preview", "preview", ".cropper__preview-button")
    );
    
    // Add background
    //panel.addBackground(new Background(1));

    // Add plate object
    //setTimeout(panel.addPlate(new Plate(1)), 75);

    

    // Add new plate event
    $( '.panel-add' ).on('click', function(e) {
      let plate_new_id = panel.stages[0].plates[panel.stages[0].plates.length - 1].id;
      plate_new_id = plate_new_id + 1;

      panel.stages[0].addPlate(new Plate(plate_new_id));
    });

    // Remove plate event
    $( '.plate-panels' ).on('removePlate', function(e, id) {
      if (panel.stages[0].plates[panel.stages[0].platesActiveIndex].id === id) {
        panel.stages[0].platesActiveIndex = 0;
        panel.stages[0].setActivePlate(0);
      }
      panel.stages[0].removePlate(id);
    });

    // Add new background
    $(".cropper__area").on('backgroundCreate', function(e, id) {
      panel.stages[0].addBackground(new Background(id + 1));
    });

    // Changed input width
    $( '.plate-panels' ).on('changedWidth', function() {
      panel.stages[0].backgroundUpdate();
    });
    
    // Check active plate
    $( '.plate-panels' ).on('checkActivePlate', function(e, id) {
      if (panel.stages[0].plates[panel.stages[0].platesActiveIndex].id !== id) {
        panel.stages[0].setActivePlate(id);

        let offsetLeft = document.querySelector('.plate_active').offsetLeft;
        $('.cropper__area').scrollLeft(offsetLeft);
      }
    });

    // Replace Image Event
    $( '.panel-replace' ).on('click', function(e) {
      panel.stages[0].image = './assets/images/image.jpg';
      
      panel.stages[0].plates.forEach((item) => {
        item.image = panel.stages[0].image;
        item.setCropperImage();
      });
    });

    // Plate Track position check
    $( '.plate-track' ).on('checkPosition', () => {
      panel.stages[0].plateTrackCheck();
    });

    // Preview Generate
    $( '.cropper' ).on('previewGenerate', () => {
      panel.stages[0].previewInit();
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
        let limit = {min: 1, max: $(container).width() - elmnt.clientWidth},
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
        let limit = {min: 1, max: $(container).width() - elmnt.clientWidth},
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