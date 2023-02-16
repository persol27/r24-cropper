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
    class Plate {
        id; // int
        selector; // str
        cropperSelector; // str
        panelSelector;
        canvas;
        image; // default image
        
        constructor(id) {
            this.id = id;
    
            const html = `<div class="plate" id="plate_id_${this.id}">
                <canvas class="plate__canvas"></canvas>
                <div class="plate__overlay"></div>
                <span class="plate__crop"></span>
                <a href="#" class="button plate__scale">Spiegeln</a>
            </div>`;
    
            $('.plate_col').append(html);
        }
    
        init() {
            this.selector = `#plate_id_${this.id}`;
            this.cropperSelector = `${this.selector} canvas`;
            this.panelSelector = `plate-panel_id_${this.id}`;
            this.canvas = document.querySelector(this.cropperSelector);
    
            // Image Init
            this.setImageCanvas(this.image);
    
            // Cropper Init
            setTimeout(() => this.initCropper(), 225);
    
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
    
            $( `#${this.panelSelector} .plate-panel__remove` ).on('click', (e) => {
                $('.plate-panels').trigger('removePlate', this.id);
            });
    
              /*let plate_html = document.querySelector(".plate .cropper-container");
              plate_html.addEventListener("touchstart", (e) => $( document ).find('.cropper-center').hide(), false);
              plate_html.addEventListener("touchend",   (e) => $( document ).find('.cropper-center').show(), false);*/
        }
    
        initCropper() {
            $(this.cropperSelector).cropper({
                autoCropArea: 1,
                viewMode: 1,
                dragMode: 'none',
                responsive: true,
                background: false,
                zoomable: false,
                cropBoxResizable: false,
                guides: false,
    
                ready: (event) => {
                    this.getCoordsPrecent();
    
                    // Fix cropper when resize
                    if (typeof this.coords_obj != "undefined") {
                        if (typeof this.coords_obj.coord_left_precents != "undefined" || typeof this.coords_obj.coord_top_precents != "undefined") {
    
                            let new_crop_data;
    
                            //Get coords from precent 
                            let cropImageDataObj = $(this.cropperSelector).cropper('getCanvasData', new_crop_data),
                                image_width = roundFloat(cropImageDataObj.width),
                                image_height = roundFloat(cropImageDataObj.height),
                                image_width_precent = image_width/100,
                                image_height_precent = image_height/100,
                                coord_left_precents = this.coords_obj.coord_left_precents,
                                coord_top_precents = this.coords_obj.coord_top_precents,
                                coord_left = coord_left_precents * image_width_precent,
                                coord_top = coord_top_precents * image_height_precent;
    
                            //Set new croppers coords
                            new_crop_data = {
                                "left": coord_left,
                                "top": coord_top,
                            };
    
                            $(this.cropperSelector).cropper('setCropBoxData', new_crop_data);
                        }
                    }
                    // Fix container size
                    let imageData = $(this.cropperSelector).cropper('getImageData'),
                        imageHeightString = imageData.height+"px",
                        canvasTransform = $(`${this.selector} .cropper-container .cropper-wrap-box .cropper-canvas`).css("transform");
                    $(`${this.selector} .cropper-container .cropper-drag-box`).css({"height":imageHeightString, "transform": canvasTransform });
                },
    
                crop: (event) => {
                    console.log(event.detail.x);
                    console.log(event.detail.y);
                    console.log(event.detail.width);
                    console.log(event.detail.height);
                }
            });
        }
    
        initSettingsPanel() {
            const html = `<div class="plate-panel" id="${this.panelSelector}">
                <label for="plate-panel_id_${this.id}_width">Breite</label>
                <input type="number" inputmode="numeric" pattern="[0-9]*" class="input plate-panel__input width" name="${this.panelSelector}_width" id="${this.panelSelector}_width" min="10" max="300" value="20">
    
                <label for="plate-panel_id_${this.id}_height">Höhe</label>
                <input type="number" inputmode="numeric" pattern="[0-9]*" class="input plate-panel__input height" name="${this.panelSelector}_height" id="${this.panelSelector}_height" min="10" max="150" value="10">
    
                <a href="#" class="button plate-panel__remove">X</a>
            </div>`;
    
            $('.plate-panels').append(html);
    
            this.initSettingsPanelEvents();
        }
    
        initSettingsPanelEvents() {
            // Input Width & Height
            $(`#${this.panelSelector} input`).on('input propertychange', () => {
                this.setCropperSizes();
            });
        }
    
        getCoordsPrecent() {
            //Get cropped image coordinates & image data
            let cropImageDataObj = $(this.cropperSelector).cropper('getCanvasData');
    
            let coord_left_canvas = cropImageDataObj.left,
                coord_top_canvas = cropImageDataObj.top;
    
            let image_width = roundFloat(cropImageDataObj.width),
                image_height = roundFloat(cropImageDataObj.height);
    
            let image_width_precent = image_width / 100,
                image_height_precent = image_height / 100;
            
            let cropBoxDataObj = $(this.cropperSelector).cropper('getCropBoxData'),
                coord_left_crop = cropBoxDataObj.left,
                coord_left;
    
            if (coord_left_crop < 1) {
                coord_left = 0;
            } else {
                if (coord_left_canvas > 0) {
                    coord_left = coord_left_crop - coord_left_canvas;
                } else {
                    coord_left = coord_left_crop;
                }
    
                coord_left = roundFloat(coord_left);
            }
    
            if (coord_left < 1) {
                coord_left = 0;
            }
    
            let coord_left_precents = coord_left / image_width_precent;
            coord_left_precents = roundFloat(coord_left_precents);
    
    
            let coord_top_crop = cropBoxDataObj.top,
                coord_top;
    
            if (coord_top_crop < 1) {
                coord_top = 0;
            } else {
                if (coord_top_canvas > 0) {
                    coord_top = coord_top_crop - coord_top_canvas;
                } else{
                    coord_top = coord_top_crop;
                }
    
                coord_top = roundFloat(coord_top);
            }
    
            if (coord_top < 1) {
                coord_top = 0;
            }
    
            let coord_top_precents = coord_top / image_height_precent;
            coord_top_precents = roundFloat(coord_top_precents);
    
            let coord_width = roundFloat(cropBoxDataObj.width),
                coord_width_precents = coord_width/image_width_precent;
    
            coord_width_precents = roundFloat(coord_width_precents);
            let coord_width_half = coord_width / 2;
    
            let coord_height = roundFloat(cropBoxDataObj.height),
                coord_height_precents = coord_height / image_height_precent;
    
            coord_height_precents = roundFloat(coord_height_precents);
            let coord_height_half = coord_height / 2;
    
            // Count center
            let center_x = coord_left + coord_width_half;
            center_x = roundFloat(center_x);
    
            let center_x_precents = center_x / image_width_precent;
            center_x_precents = roundFloat(center_x_precents);
    
            let center_y = coord_top + coord_height_half;
            center_y = roundFloat(center_y);
    
            let center_y_precents = center_y / image_height_precent;
            center_y_precents = roundFloat(center_y_precents);
    
            
            //Get cropped image coordinates END
            this.coords_obj = {
              "coord_left_precents": coord_left_precents,
              "coord_top_precents": coord_top_precents,
              "center_x_precents": center_x_precents,
              "center_y_precents": center_y_precents,
              "coord_width_precents": coord_width_precents,
              "coord_height_precents": coord_height_precents
            };
    
            return this.coords_obj;
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
    
        setCropperImage(img) {
            $(this.cropperSelector).cropper('replace', this.image, true);
        }
    
        setCropperSizes() {
            let aspect_ratio = $(`#${this.panelSelector} .width`).val() / $(`#${this.panelSelector} .height`).val();
    
            $(this.cropperSelector).cropper('setAspectRatio', aspect_ratio);
        }
    
        setCropperScaleX() {
            const plate_data = $(this.cropperSelector).cropper('getData'),
                  plate_scale = plate_data.scaleX == -1 ? 1 : -1;
                  
            $(this.cropperSelector).cropper('scaleX', plate_scale);
        }
    
        destroy() {
            $(this.selector).remove();
            $(`#${this.panelSelector}`).remove();
        }
    }
    class Panel {
        selector; // str
        plates = []; // array
        image = './assets/images/image_2.jpg'; // default image
    
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
            plate.image = this.image;
            plate.init();
            
            this.plates.push(plate);
        }
    
        removePlate(plateIndex) {
            console.log(this.plates);
            const plateId = this.plates.findIndex(x => x.id == plateIndex);
            
            this.plates[plateId].destroy();
            this.plates.splice(plateId, 1);
    
            console.log(this.plates);
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
      let plate_new_id = $('.plate:last').attr('id');
      plate_new_id = Number(plate_new_id.split('_')[2]) + 1;

      panel.addPlate(new Plate(plate_new_id));
    });

    // Remove plate event
    $( '.plate-panels' ).on('removePlate', function(e, id) {
      panel.removePlate(id);
    });

    // Replace Image Event
    $( '.panel-replace' ).on('click', function(e) {
      panel.image = './assets/images/image.jpg';
      
      panel.plates.forEach((item) => {
        item.image = panel.image;
        item.setCropperImage();
      });
    });
});