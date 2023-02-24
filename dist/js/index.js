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
        limit = {
            width: {
                min: 10,
                max: 300,
            },
            height: {
                min: 10,
                max: 150,
            },
        };
        
        constructor(id) {
            this.id = id;
    
            this.selector = `#plate_id_${this.id}`;
            this.cropperSelector = `${this.selector} canvas`;
            this.panelSelector = `plate-panel_id_${this.id}`;
            this.canvas = document.querySelector(this.cropperSelector);
    
            const html = `<div class="plate" id="plate_id_${this.id}">
                <canvas class="plate__canvas"></canvas>
            </div>`;
    
            $('.plate-track').append(html);
        }
    
        init() {
            // Image Init
            //this.setImageCanvas(this.image);
    
            // Cropper Init
            setTimeout(() => this.initCropper(), 225);
    
            // Settings Panel Init
            this.initSettingsPanel();
    
            // Events Init
            this.initEvents();
        }
    
        initEvents() {
            $(this.selector).on('mouseover touchstart', function() {
                $(this).find('.cropper-center').hide();
            }).on('mouseleave touchend', function() {
                $(this).find('.cropper-center').show();
            });
    
            $(`${this.selector} .plate__scale`).on('click', (e) => {
                this.setCropperScaleX();
            });
    
            $(`#${this.panelSelector} .plate-panel__remove`).on('click', (e) => {
                $('.plate-panels').trigger('removePlate', this.id);
            });
        }
    
        initCropper() {
            $(this.cropperSelector).cropper({
                autoCropArea: 1,
                viewMode: 3,
                dragMode: 'none',
                responsive: true,
                background: false,
                zoomable: false,
                cropBoxResizable: false,
                guides: false,
    
                ready: (event) => {
                    /*this.getCoordsPrecent();
    
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
                    }*/
    
                    // Fix container size
                    let imageData = $(this.cropperSelector).cropper('getImageData'),
                        imageHeightString = $(this.selector).height() + "px",
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
            const html = `<div class="plate-panel${this.id == 1 ? ' plate-panel_active' : ''}" id="${this.panelSelector}">
                <div class="plate-panel__index-label label">Panel ${this.id}</div>
    
                <div class="plate-panel__control">
                    <div class="plate-panel__limit icon-text">
                        <i class="icon"></i>
                        <span class="text">${this.limit.width.min} - ${this.limit.width.max} cm</span>
                    </div>
                    <div class="plate-panel__input-body">
                        <label for="plate-panel_id_${this.id}_width">Breite</label>
                        <div class="plate-panel__input-text">
                            <input type="number" inputmode="numeric" pattern="[0-9]*" class="input plate-panel__input width" name="${this.panelSelector}_width" id="${this.panelSelector}_width" min="${this.limit.width.min}" max="${this.limit.width.max}" value="${this.limit.width.max}">
                            <span class="text">cm</span>
                        </div>
                    </div>
                </div>
    
                <div class="plate-panel__separator">X</div>
    
                <div class="plate-panel__control">
                    <div class="plate-panel__limit icon-text">
                        <i class="icon"></i>
                        <span class="text">${this.limit.height.min} - ${this.limit.height.max} cm</span>
                    </div>
                    <div class="plate-panel__input-body">
                        <label for="plate-panel_id_${this.id}_height">Höhe</label>
                        <div class="plate-panel__input-text">
                            <input type="number" inputmode="numeric" pattern="[0-9]*" class="input plate-panel__input height" name="${this.panelSelector}_height" id="${this.panelSelector}_height" min="${this.limit.height.min}" max="${this.limit.height.max}" value="${this.limit.height.max}">
                            <span class="text">cm</span>
                        </div>
                    </div>
                </div>
    
                <a href="#" class="button plate-panel__remove">X</a>
            </div>`;
    
            $('.plate-panels').append(html);
    
            this.initSettingsPanelEvents();
        }
    
        initSettingsPanelEvents() {
            // Input Width & Height
            $(`#${this.panelSelector} input`).on('input propertychange', (e) => {
                let checkInputType = $(e.target).has('.width'),
                    min = checkInputType ? this.limit.width.min : this.limit.height.min,
                    max = checkInputType ? this.limit.width.max : this.limit.height.max;
                
                if ($(e.target).val() < min) {
                    $(e.target).val(min);
                }
    
                if ($(e.target).val() > max) {
                    $(e.target).val(max);
                }
    
                this.setCropperSizes();
                
                // width changed
                if (checkInputType) {
                    $('.plate-panels').trigger('changedWidth');
                }
            });
    
            //Resize not Scroll
            let width = $(window).width();
    
            $(window).resize(() => {
                if ($(window).width() != width) {
                    //Reset cropper
                    $(this.cropperSelector).cropper('destroy');
                    this.initCropper();
                    
                    width = $(window).width();
                }
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
                coord_left = coord_left_crop < 1 ? 1 : null;
    
            if (coord_left === null) {
                coord_left = coord_left_canvas > 0 ? coord_left_crop - coord_left_canvas : coord_left_crop;
                coord_left = roundFloat(coord_left);
            }
    
            coord_left = coord_left < 1 ? 0 : coord_left;
    
            let coord_left_precents = coord_left / image_width_precent;
            coord_left_precents = roundFloat(coord_left_precents);
    
            let coord_top_crop = cropBoxDataObj.top,
                coord_top = coord_top_crop < 1 ? 0 : null;
    
            if (coord_top == null) {
                coord_top = coord_top_canvas > 0 ? coord_top_crop - coord_top_canvas : coord_top_crop;
                coord_top = roundFloat(coord_top);
            }
    
            coord_top = coord_top < 1 ? 0 : coord_top;
    
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
            let plateData = $(this.cropperSelector).cropper('getData');
            plateData.width = Number($(`#${this.panelSelector} .width`).val());
            plateData.height = Number($(`#${this.panelSelector} .height`).val());
    
            console.log(plateData, $(this.cropperSelector));
    
            let cropBoxObject = {
                top:    plateData.y,
                left:   0,
                width:  plateData.width,
                height: plateData.height,
            };
    
            $(this.cropperSelector).cropper('setData', plateData);
            $(this.cropperSelector).cropper('setCropBoxData', cropBoxObject);
            $(`${this.selector} .cropper-container`).css('width', plateData.width + 'px');
            $(`${this.selector} .cropper-crop-box`).css('transform', 'none');
    
            setTimeout(() => document.querySelector(this.cropperSelector).cropper.containerData.width = plateData.width, 200); // Change Width in Container Data obj
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
        platesMax = 20;
        platesActiveIndex = 0;
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
    
        convertPxToCm(px) {
    
        }
    
        convertCmToPx(cm) {
    
        }
    
        backgroundUpdate() {
            let platesWidth = 0;
    
            this.plates.forEach((item) => {
                platesWidth = platesWidth + Number($(`#${item.panelSelector} .width`).val());
            });
    
            let thisBackgroundCount = $('.background__image').length,
                newBackgroundCount = Math.ceil(platesWidth / 300); // 300 - cm
    
            if (thisBackgroundCount !== newBackgroundCount) {
                while (thisBackgroundCount !== newBackgroundCount) {
                    if (thisBackgroundCount > newBackgroundCount) {
                        this.backgroundRemoveLast();
                        thisBackgroundCount--;
                    } else {
                        this.backgroundCreate();
                        thisBackgroundCount++;
                    }
                }
            }
        }
    
        scaleBackground(id) {
            $(`#${id} img`).toggleClass('background__image_scaled');
        }
    
        backgroundCreate() {
            let id = $('.background__item').last().attr('id').split('-')[1],
                scaled = $('.background__item').last().find('.background__image').hasClass('background__image_scaled') ? '' : ' background__image_scaled',
                html = `<div class="background__item" id="background-${Number(id) + 1}">
                    <a href="#" class="background__scale-button button">Mirroring</a>
                    <img class="background__image${scaled}" src="${this.image}" alt="">
                </div>`;
    
            $('.cropper__background').append(html);
    
            // Mirroring Event
            $( `#background-${Number(id) + 1} .background__scale-button` ).on('click', (e) => {
                e.preventDefault();
      
                let thisId = $(e.target).parent('.background__item').attr('id');
                panel.scaleBackground(thisId);
            });
        }
    
        backgroundRemoveLast() {
            $('.background__item').last().remove();
        }
    
        addPlate(plate) {
            // Limit check
            if (this.plates.length >= this.platesMax) {
                alert(`Sorry, limit: ${this.platesMax}`);
                return;
            }
    
            // Left Property Check
            /*if (this.plates.length > 0) {
                let lastPlate = this.plates[this.plates.length - 1],
                    leftProp = (($(lastPlate.selector).width() + 2) * this.plates.length) + 'px';
    
                $(plate.selector).css('left', leftProp);
            }*/
    
            plate.image = this.image;
            plate.init();
            
            this.plates.push(plate);
    
            // Panels recheck
            this.backgroundUpdate();
        }
    
        removePlate(plateIndex) {
            const plateId = this.plates.findIndex(x => x.id == plateIndex);
            
            this.plates[plateId].destroy();
            this.plates.splice(plateId, 1);
    
            // Panels recheck
            this.backgroundUpdate();
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