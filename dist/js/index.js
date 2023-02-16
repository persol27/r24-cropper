"use strict";

window.addEventListener('load', () => {
  const el = document.querySelector('body');
  el.classList.remove("body_no-load");
  
  if(/iP(hone|ad)/.test(window.navigator.userAgent)) {
    document.body.addEventListener('touchstart', () => {}, false);
  }
});

jQuery(document).ready(($) => {
    class Plate {
        id; // int
        selector; // str
        cropperSelector; // str
        canvas;
        image = './assets/images/image.jpg'; // default image
        
        constructor(id) {
            this.id = id;
    
            const html = `<div class="plate" id="plate_id_${this.id}">
                <canvas class="plate__canvas"></canvas>
                <div class="plate__overlay"></div>
                <span class="plate__crop"></span>
                <a href="#" class="button plate__scale">Spiegeln</a>
            </div>`;
    
            $('.plate_col').append(html);
    
            this.init();
        }
    
        init() {
            this.selector = `#plate_id_${this.id}`;
            this.cropperSelector = `${this.selector} canvas`;
            this.canvas = document.querySelector(this.cropperSelector);
    
            // Image Init
            this.setImageCanvas(this.image);
    
            // Cropper Init
            setTimeout(() => this.initCropper(), 150);
    
            // Settings Panel Init
            this.initSettingsPanel();
    
            // Events Init
            this.initEvents();
        }
    
        initEvents() {
            $(this.selector).on('mouseover', function() {
                $(this).find('.cropper-center').hide();
            }).on('mouseleave', function() {
                $(this).find('.cropper-center').show();
            });
    
            $( `${this.selector} .plate__scale` ).on('click', (e) => {
                this.setCropperScaleX();
            });
    
              /*let plate_html = document.querySelector(".plate .cropper-container");
              plate_html.addEventListener("touchstart", (e) => $( document ).find('.cropper-center').hide(), false);
              plate_html.addEventListener("touchend",   (e) => $( document ).find('.cropper-center').show(), false);*/
        }
    
        initCropper() {
            $(this.cropperSelector).cropper({
                autoCropArea: 1,
                viewMode: 1,
                dragMode: 'crop',
                responsive: true,
                background: false,
                zoomable: false,
                guides: false,
    
                crop: (event) => {
                    console.log(event.detail.x);
                    console.log(event.detail.y);
                    console.log(event.detail.width);
                    console.log(event.detail.height);
                }
            });
        }
    
        initSettingsPanel() {
            const html = `<div class="plate-panel" id="plate-panel_id_${this.id}">
                <label for="plate-panel_id_${this.id}_width">Breite</label>
                <input type="number" inputmode="numeric" pattern="[0-9]*" class="input plate-panel__input" name="plate-panel_id_${this.id}_width" id="plate-panel_id_${this.id}_width" min="10" max="300">
    
                <label for="plate-panel_id_${this.id}_height">Höhe</label>
                <input type="number" inputmode="numeric" pattern="[0-9]*" class="input plate-panel__input" name="plate-panel_id_${this.id}_height" id="plate-panel_id_${this.id}_height" min="10" max="150">
            </div>`;
    
            $('.plate-panels').append(html);
        }
    
        setId(id) {
            this.id = id;
        }
    
        setImageCanvas(src) {
            const ctx = this.canvas.getContext("2d");
            
            const image = new Image(337, 295);
    
            image.onload = function() {
                ctx.drawImage(this, 0, 0);
            };
    
            image.src = src;
        }
    
        setCropperWidth() {
    
        }
    
        setCropperHeight() {
    
        }
    
        setCropperScaleX() {
            const plate_data = $(this.cropperSelector).cropper('getData'),
                  plate_scale = plate_data.scaleX == -1 ? 1 : -1;
                  
            $(this.cropperSelector).cropper('scaleX', plate_scale);
        }
    }
    class Panel {
        selector; // str
        plates = []; // array
    
        constructor() {
    
            this.init();
        }
    
        init() {
    
            // Events Init
            this.initEvents();
        }
    
        initEvents() {
    
            //
            /*let plate_html = document.querySelector(".plate .cropper-container");
            plate_html.addEventListener("touchstart", (e) => $( document ).find('.cropper-center').hide(), false);
            plate_html.addEventListener("touchend",   (e) => $( document ).find('.cropper-center').show(), false);*/
        }
    
        addPlate(plate) {
            //this.plates = [...this.plates, plate];
            this.plates.push(plate);
        }
    
        removePlate(plateIndex) {
            delete this.plates[plateIndex];
        }
    }
    // Class Customizer
    class Customizer {
        constructor() {
    
            this.init();
        }
    
        init() {
    
            // Events Init
            this.initEvents();
        }
    
        initEvents() {
    
        }
    
        addPlateSettings() {
            
        }
    }
    

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