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
    class Panel {
        selector; // str
        plates = []; // array
        platesMax = 20;
        platesActiveIndex = 0;
        backgrounds = []; // array
        backgroundActiveId = 1;
        image = './assets/images/image_2.jpg'; // default image
    
        constructor(type) {
            this.type = type;
    
            this.init();
        }
    
        init() {
    
            // Events Init
            this.initEvents();
        }
    
        initEvents() {
            $(".cropper__area").on("scroll", () => {
                //this.detectPlateVisibleWidth();
            });
        }
    
        backgroundUpdate() {
            let platesWidth = 0;
    
            this.plates.forEach((item) => {
                platesWidth = platesWidth + Number($(`#${item.panelSelector} .width`).val());
            });
    
            let thisBackgroundCount = this.backgrounds.length,
                newBackgroundCount = Math.ceil(platesWidth / 300); // 300 - cm
    
            if (thisBackgroundCount !== newBackgroundCount) {
                while (thisBackgroundCount !== newBackgroundCount) {
                    if (thisBackgroundCount > newBackgroundCount) {
                        this.removeBackgroundLast();
                        thisBackgroundCount--;
                    } else {
                        this.triggerBackgroundCreate();
                        thisBackgroundCount++;
                    }
                }
            }
        }
    
        triggerBackgroundCreate() {
            $(".cropper__area").trigger('backgroundCreate', this.backgrounds.length);
        }
    
        addBackground(background) {
            const cropperWidth = $('.cropper__area').width();
    
            // Limit check
            if (this.backgrounds.length >= this.platesMax) {
                alert(`Sorry, limit: ${this.platesMax}`);
                return;
            }
    
            let scaled = false;
    
            if (this.backgrounds.length > 0) {
                scaled = $(this.backgrounds[this.backgrounds.length - 1].selectorImage).hasClass('background__image_scaled') === false ? true : false;
            }
    
            background.init(cropperWidth, this.image, scaled);
            
            this.backgrounds.push(background);
        }
    
        removeBackgroundLast() {
            const backgroundId = this.backgrounds.length - 1;
            
            this.backgrounds[backgroundId].destroy();
            this.backgrounds.splice(backgroundId, 1);
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
              
                $(plate.selector).css('left', leftProp);
            }*/
            plate.image = this.image;
            plate.init();
            
            this.plates.push(plate);
    
            if (this.plates.length == 1) {
                $(plate.selector).addClass('plate_active');
                $(`#${plate.panelSelector}`).addClass('plate-panel_active');
            }
    
            // Panels recheck
            this.backgroundUpdate();
            // Plate Track Position check
            this.plateTrackCheck();
        }
    
        removePlate(plateIndex) {
            const plateId = this.plates.findIndex(x => x.id == plateIndex);
            
            this.plates[plateId].destroy();
            this.plates.splice(plateId, 1);
    
            // Panels recheck
            this.backgroundUpdate();
            // Plate Track Position check
            this.plateTrackCheck();
        }
    
        unsetThisActivePlate() {
            const oldActivePlate = $('.plate.plate_active'),
                  oldActivePlatePanel = $('.plate-panel.plate-panel_active');
    
            oldActivePlate.removeClass('plate_active');
            oldActivePlatePanel.removeClass('plate-panel_active');
        }
    
        setActivePlate(id) {
            this.unsetThisActivePlate();
    
            let plateIndex = id == 0 ? this.platesActiveIndex : this.plates.findIndex(x => x.id == id);
            this.platesActiveIndex = plateIndex;
    
            $(this.plates[plateIndex].selector).addClass('plate_active');
            $(`#${this.plates[plateIndex].panelSelector}`).addClass('plate-panel_active');
        }
    
        plateTrackCheck() {
            $('.plate-track').trigger('onmousedown');
            $(document).trigger('onmousemove').trigger('onmouseup');
        }
    
        detectPlateVisibleWidth() {
            const scrollbarContainer = '.cropper__area',
                  backgroundContainer = '.cropper__background',
                  backgroundItemWidth = $(`${backgroundContainer} .background__item`).first().innerWidth(),
                  scrollbar = {
                    scrollbarWidthIn:   $(backgroundContainer).innerWidth(),
                    scrollLeft:         $(scrollbarContainer).scrollLeft()
                };
    
            let width_array = [];
    
            const backgroundLength = $(`${backgroundContainer} .background__item`).length;
    
            for (let $i = 0; $i < backgroundLength; $i++) {
                let this_width = $(`${backgroundContainer} .background__item`).width(),
                    this_plate_width = this_width * ($i + 1),
                    this_scroll_left = $(scrollbarContainer).scrollLeft();
    
                let width_limit = {
                    min: this_plate_width - this_width,
                    max: this_plate_width,
                };
                let visible_width = width_limit.max - this_scroll_left;
                    visible_width = this_scroll_left < width_limit.min ? 0 : width_limit.max - this_scroll_left;
    
                if ($i > 0) {
                    this_scroll_left = $(scrollbarContainer).scrollLeft() + this_width;
    
                    if (this_scroll_left >= width_limit.min && this_scroll_left < width_limit.max) {
                        visible_width = this_scroll_left - width_limit.min;
                    } else if (this_scroll_left > width_limit.max) {
                        visible_width = this_width + (width_limit.max - this_scroll_left);
                    } else {
                        visible_width = 0;
                    }
                }
    
                visible_width = visible_width < 0 ? 0 : Math.round(visible_width);
    
                width_array.push({id: $i+1, width: visible_width});
            }
    
            let active_background = width_array.reduce((acc, curr) => acc.width > curr.width ? acc : curr);
    
            // // debug
            let debug = false;
    
            if (debug) {
                width_array.forEach((el) => {
                    console.log(`id: ${el.id}, width: ${el.width}`);
                });
            }
            // //
    
            // set active background
            this.backgroundActiveId = active_background.id;
        }
        
        previewDestroy() {
            $('.preview__background').empty();
            $('.preview__plates').empty();
        }
    
        previewInit() {
            this.previewDestroy();
    
            const trackSelector = '.plate-track';
    
            const backgroundCount = this.backgrounds.length;
            const backgroundPlateWidth = $(this.backgrounds[0].selector).innerWidth();
    
            const trackOffsetLeft = Math.round($(trackSelector).css( "left" ).slice(0, -2));
            const platesWidthArray = [];
            
            const backgroundInit = () => {
                // Generate background
                for (let $i = 0; $i < backgroundCount; $i++) {
                    let id = $i + 1,
                        scaled = $(`#background-${id}`).find('.background__image').hasClass('background__image_scaled') ? ' background__image_scaled' : '',
                        html = `<div class="background__item preview__background-item" id="preview-background-${id}">
                        <img class="background__image${scaled}" src="${this.image}" alt="" >
                    </div>`;
    
                    $('.preview__background').append(html);
                }
            };
    
            const platesInit = () => {
                // bg move
                let backgroundWidth = $('.preview__background-item').first().innerWidth();
                let percentage = trackOffsetLeft / (backgroundPlateWidth / 100),
                    backgroundOffsetLeft = Math.round(percentage * (backgroundWidth / 100));
    
                    console.log('left', trackOffsetLeft);
                    console.log('plate-width', backgroundWidth);
    
                $('.preview__background').css('left', -(backgroundOffsetLeft) + 'px').css('width', ($('.modal__preview').width()) + 'px');
    
                // Plates init
                for (let $i = 0; $i < this.plates.length; $i++) {
                    let this_plate_width = $(this.plates[$i].selector).innerWidth(),
                        this_percentage = this_plate_width / (backgroundPlateWidth / 100);
    
                    let plate_obj = {
                        index: $i,
                        width: Math.round(this_percentage * (backgroundWidth / 100)),
                    };
        
                    platesWidthArray.push(plate_obj);
                    
                    // //
                    console.log('plates l ', this.plates.length);
                    console.log('offset l ', backgroundOffsetLeft);
                    console.log((backgroundOffsetLeft / this.plates.length));
                    let html = `<div class="preview__plate" style="width: ${plate_obj.width}px">
                        <div class="preview__plate-name">Panel ${plate_obj.index + 1}</div>
                    </div>`;
        
                    $('.preview__plates').append(html);
                }
                
                // preview container
                const preview_offset_right = $('.modal__content').width() - $('.preview__plates').width();
                $('.modal__preview').css('max-width', `calc(100% - ${preview_offset_right}px)`);
            };
    
            setTimeout(backgroundInit, 50);
            setTimeout(platesInit, 125);
    
        }
    }
    
    class PanelNew {
        title;
        subtitle;
        selector;
        modals = [];
        stages = [];
    
        constructor(selector, title, subtitle) {
            this.selector = selector;
            this.title = title;
            this.subtitle = subtitle;
        }
    
        addStage(stage) {
            const id = this.stages.length + 1;
    
            stage.parentSelector = this.selector;
    
            if (stage.name == 'cropper') {
                stage.type = 'cropper';
            }
    
            stage.init(id);
            
            this.stages.push(stage);
        }
    
        removeStage(stageId) {
            const stageIndex = this.stages.findIndex(x => x.id == stageId);
            
            this.stages[stageIndex].destroy();
            this.stages.splice(stageIndex, 1);
        }
    
        addModal(modal) {
            const id = this.modals.length + 1;
            modal.init(id);
            
            this.modals.push(modal);
        }
    
        removeModal(modalId) {
            const modalIndex = this.modals.findIndex(x => x.id == modalId);
            
            this.modals[modalIndex].destroy();
            this.modals.splice(modalIndex, 1);
        }
    }
    class Stage {
        id;
        name;
        title;
        subtitle;
        parentSelector = '.main';
        selector;
        selectorClass;
        videos = [];
    
        constructor(name, title, subtitle) {
            this.name = name;
            this.title = title;
            this.subtitle = subtitle;
            this.selectorClass = `.${this.name}`;
        }
    
        addVideo(videoObj) {
            this.videos.push(videoObj);
        }
    
        removeVideo(videoId) {
            const videoIndex = this.videos.findIndex(x => x.id == videoId);
            
            this.videos[videoIndex].destroy();
            this.videos.splice(videoIndex, 1);
        }
    
        init(id) {
            this.id = id;
            this.selector = `#stage-${id}`;
    
            this.initType();
            this.initTemplate();
            this.initEvents();
        }
    
        initType() {
            if (this.type == 'cropper') {
                this.content = `<div class="cropper__buttons buttons-group">
                    <a href="#" class="cropper__preview-button button button_weight_bold button_icon">
                        <i class="button__icon icon-r24-fullscreen"></i>
                        <span class="button__text">Preview</span>
                    </a>
                </div>
    
                <div class="cropper__area">
                    <div class="cropper__background background"></div>
                    <div class="plate-track">
    
                    </div>
                </div>`;
    
                this.panelContent = `<div class="cropper__customizer customizer">
                    <div class="plate-panels"></div>
    
                    <a href="#" class="button button_width_100 button_color_green panel-add customizer__button">+ Add new plate</a>
                    <a href="#" class="button panel-replace" style="display: none;">Replace image</a>
    
                </div>`;
            }
        }
    
        initTemplate() {
            const html = `<section class="stage main__${this.name} ${this.name}" id="stage-${this.id}">
                <div class="container container_align_start">
                    <div class="col col-7${this.type == 'cropper' ? ' plate_col' : ''}">
                        ${this.content}
                    </div>
                    <div class="col col-5 stage__panel">
                        <div class="stage__information">
                            <span class="stage__index">${this.id}</span>
                            <h2 class="stage__title title">${this.title}:</h2>
                            <h3 class="stage__subtitle subtitle">${this.subtitle}</h3>
                        </div>
                        ${this.panelContent}
                        <div class="stage__videos videos"></div>
                    </div>
                </div>
            </section>`;
    
            $(this.parentSelector).append(html);
    
        }
    
        initEvents() {
    
        }
    }
    class CropperStage extends Stage {
        backgrounds = [];
        plates = [];
        platesMax = 20;
        platesActiveIndex = 0;
        image = './assets/images/image_2.jpg';
    
        constructor(name, title, subtitle) {
            super(name, title, subtitle);
        }
    
        backgroundUpdate() {
            let platesWidth = 0;
    
            this.plates.forEach((item) => {
                platesWidth = platesWidth + Number($(`#${item.panelSelector} .width`).val());
            });
    
            let thisBackgroundCount = this.backgrounds.length,
                newBackgroundCount = Math.ceil(platesWidth / 300); // 300 - cm
    
            if (thisBackgroundCount !== newBackgroundCount) {
                while (thisBackgroundCount !== newBackgroundCount) {
                    if (thisBackgroundCount > newBackgroundCount) {
                        this.removeBackgroundLast();
                        thisBackgroundCount--;
                    } else {
                        this.triggerBackgroundCreate();
                        thisBackgroundCount++;
                    }
                }
            }
        }
    
        triggerBackgroundCreate() {
            $(".cropper__area").trigger('backgroundCreate', this.backgrounds.length);
        }
    
        addBackground(background) {
            const cropperWidth = $('.cropper__area').width();
    
            // Limit check
            if (this.backgrounds.length >= this.platesMax) {
                alert(`Sorry, limit: ${this.platesMax}`);
                return;
            }
            // First check
    
    
            let scaled = false;
    
            if (this.backgrounds.length > 0) {
                scaled = $(this.backgrounds[this.backgrounds.length - 1].selectorImage).hasClass('background__image_scaled') === false ? true : false;
            }
    
            background.init(cropperWidth, this.image, scaled);
            
            this.backgrounds.push(background);
    
            if (this.backgrounds.length == 1) {
                $('.plate-track').height( $('.cropper__background').height() );
            }
        }
    
        removeBackgroundLast() {
            const backgroundId = this.backgrounds.length - 1;
            
            this.backgrounds[backgroundId].destroy();
            this.backgrounds.splice(backgroundId, 1);
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
              
                $(plate.selector).css('left', leftProp);
            }*/
            plate.image = this.image;
            plate.init();
            
            this.plates.push(plate);
    
            if (this.plates.length == 1) {
                $(plate.selector).addClass('plate_active');
                $(`#${plate.panelSelector}`).addClass('plate-panel_active');
            }
    
            // Panels recheck
            this.backgroundUpdate();
            // Plate Track Position check
            this.plateTrackCheck();
        }
    
        removePlate(plateIndex) {
            const plateId = this.plates.findIndex(x => x.id == plateIndex);
            
            this.plates[plateId].destroy();
            this.plates.splice(plateId, 1);
    
            // Panels recheck
            this.backgroundUpdate();
            // Plate Track Position check
            this.plateTrackCheck();
        }
    
        unsetThisActivePlate() {
            const oldActivePlate = $('.plate.plate_active'),
                  oldActivePlatePanel = $('.plate-panel.plate-panel_active');
    
            oldActivePlate.removeClass('plate_active');
            oldActivePlatePanel.removeClass('plate-panel_active');
        }
    
        setActivePlate(id) {
            this.unsetThisActivePlate();
    
            let plateIndex = id == 0 ? this.platesActiveIndex : this.plates.findIndex(x => x.id == id);
            this.platesActiveIndex = plateIndex;
    
            console.log(plateIndex);
    
            $(this.plates[plateIndex].selector).addClass('plate_active');
            $(`#${this.plates[plateIndex].panelSelector}`).addClass('plate-panel_active');
        }
    
        plateTrackCheck() {
            $('.plate-track').trigger('onmousedown');
            $(document).trigger('onmousemove').trigger('onmouseup');
        }
    
        previewDestroy() {
            $('.preview__background').empty();
            $('.preview__plates').empty();
        }
    
        previewInit() {
            this.previewDestroy();
    
            const trackSelector = '.plate-track';
    
            const backgroundCount = this.backgrounds.length;
            const backgroundPlateWidth = $(this.backgrounds[0].parentSelector).innerWidth();
    
            const trackOffsetLeft = Math.round($(trackSelector).css( "left" ).slice(0, -2));
            const trackOffsetRight = Math.round(backgroundPlateWidth - ($(trackSelector).width() + Number(trackOffsetLeft)));
            const platesWidthArray = [];
    
            let platesWidth = 0;
            
            // Generate background
            const backgroundInit = () => {
                for (let $i = 0; $i < backgroundCount; $i++) {
                    let id = $i + 1,
                        scaled = $(`#background-${id}`).find('.background__image').hasClass('background__image_scaled') ? ' background__image_scaled' : '',
                        html = `<div class="background__item preview__background-item" id="preview-background-${id}">
                        <img class="background__image${scaled}" src="${this.image}" alt="" >
                    </div>`;
    
                    $('.preview__background').append(html);
                }
            };
    
            const platesInit = () => {
                // bg move
                let backgroundWidth = $('.modal__content').first().innerWidth();
                let percentage = {
                    left: trackOffsetLeft / (backgroundPlateWidth / 100),
                    right: trackOffsetRight / (backgroundPlateWidth / 100),
                },
                    backgroundOffsetLeft = Math.round(percentage.left * (backgroundWidth / 100)),
                    backgroundOffsetRight = Math.round(percentage.right * (backgroundWidth / 100));
    
                    console.log('left', trackOffsetLeft);
                    console.log('plate-width', backgroundWidth);
    
                //$('.preview__background').css('right', `${-(backgroundOffsetLeft)}px`).css('margin-left', `${-(backgroundOffsetRight)}px`);
                console.log(backgroundOffsetRight, backgroundOffsetLeft);
    
                // Left
                $('.preview__background-item').first().css('margin-left', `${-(backgroundOffsetLeft)}px`)
    
                // Right
                $('.preview__background-item').last().css('margin-right', `${-(backgroundOffsetRight)}px`)
    
                // Plates init
                for (let $i = 0; $i < this.plates.length; $i++) {
                    let this_plate_width = $(this.plates[$i].selector).innerWidth(),
                        this_percentage = this_plate_width / (backgroundPlateWidth / 100);
    
                    let plate_obj = {
                        index: $i,
                        width: Math.round(this_percentage * (backgroundWidth / 100)),
                    };
        
                    platesWidthArray.push(plate_obj);
                    platesWidth = platesWidth + plate_obj.width;
                    
                    // //
                    console.log('plates l ', this.plates.length);
                    console.log('offset l ', backgroundOffsetLeft);
                    console.log((backgroundOffsetLeft / this.plates.length));
                    let html = `<div class="preview__plate" style="width: ${plate_obj.width}px">
                        <div class="preview__plate-name">Panel ${plate_obj.index + 1}</div>
                    </div>`;
        
                    $('.preview__plates').append(html);
                }
                
                // preview container
                const preview_offset_right = $('.modal__content').width() - platesWidth;
                $('.modal__preview').css('max-width', `calc(100% - ${preview_offset_right}px)`);
            };
    
            setTimeout(backgroundInit, 50);
            setTimeout(platesInit, 125);
    
        }
    }

    class Modal {

        id;

        activeClass = 'modal_open';

        trigger;

        selector;

        title;

    

        constructor(title, type, trigger) {

            this.title = title;

            this.trigger = trigger;

            this.type = type;

        }

    

        init(id) {

            this.id = id;

            this.selector = `#modal-${this.id}`;

    

            const html = `<div class="modal" id="${this.selector.slice(1)}">

                <div class="modal__body">

                    <h2 class="modal__title">${this.title}</h2>

                    <div class="modal__content"></div>

    

                    <div class="modal__close">

                        <i class="modal__close-icon icon-r24-multiply plate-panel__separator-icon"></i>

                    </div>

                </div>

    

                <div class="modal__overlay"></div>

            </div>`;

    

            $('body').append(html);

    

            // check type

            if (this.type == 'preview') {

                const html_preview = `<div class="modal__preview preview">

                    <div class="preview__background background"></div>

                    <div class="preview__plates plates"></div>

                </div>`

                this.addContent(html_preview);

            }

    

            this.initEvents();

        }

    

        initEvents() {

            // Modal trigger click

            $(this.trigger).on('click', () => {

                if (this.type == 'preview') {

                    $('.cropper').trigger('previewGenerate');

                }

                

                this.openModal(), 600;

            });

    

            // Overlay Click

            $(`${this.selector} .modal__overlay`).on('click', () => {

                this.closeModal();

            });

    

            // Close modal button click

            $(`${this.selector} .modal__close`).on('click', () => {

                this.closeModal();

            });

        }

    

        addContent(html) {

            $(`${this.selector} .modal__content`).append(html);

        }

    

        openModal() {

            $(this.selector).addClass(this.activeClass);

        }

    

        closeModal() {

            $(this.selector).removeClass(this.activeClass);

        }

    

        destroy() {

            $(this.selector).remove();

        }

    }
    

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

    

            const plateWidth = $('#background-1').width() + 'px';

            const html = `<div class="plate" id="plate_id_${this.id}" style="width: ${plateWidth}">

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

                    console.log(`Plate #${this.id}, x: ${event.detail.x}`);

                    console.log(`Plate #${this.id}, x: ${event.detail.y}`);

                    console.log(`Plate #${this.id}, x: ${event.detail.width}`);

                    console.log(`Plate #${this.id}, x: ${event.detail.height}`);

                }

            });

        }

    

        initSettingsPanel() {

            const html = `<div class="plate-panel" id="${this.panelSelector}">

                <div class="plate-panel__index-label label">Panel ${this.id}</div>

    

                <div class="plate-panel__control">

                    <div class="plate-panel__limit icon-text">

                        <i class="icon icon-r24-high-priority"></i>

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

    

                <div class="plate-panel__separator">

                    <i class="icon-r24-multiply plate-panel__separator-icon"></i>

                </div>

    

                <div class="plate-panel__control">

                    <div class="plate-panel__limit icon-text">

                        <i class="icon icon-r24-high-priority"></i>

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

    

                <a href="#" class="button plate-panel__remove">

                    <i class="icon-r24-trash plate-panel__remove-icon"></i>

                </a>

            </div>`;

    

            $('.plate-panels').append(html);

    

            this.initSettingsPanelEvents();

        }

    

        initSettingsPanelEvents() {

            // Set Active

            $(`#${this.panelSelector}`).on('click', (e) => {

                $('.plate-panels').trigger('checkActivePlate', this.id);

            });

    

            // Input Width & Height

            $(`#${this.panelSelector} input`).on('input propertychange', (e) => {

                let checkInputType = $(e.target).has('.width'),

                    min = checkInputType ? this.limit.width.min : this.limit.height.min,

                    max = checkInputType ? this.limit.width.max : this.limit.height.max;

                

                if ($(e.target).val() < min || $(e.target).val() > max) {

                    return;

                }

    

                this.setCropperSizes();

                

                // width changed

                if (checkInputType) {

                    $('.plate-panels').trigger('changedWidth');

                }

    

                $('.plate-panels').trigger('checkActivePlate', this.id)

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

    

        getCropperPxByCm(cm, type) {

            let pixelsMax = type == 'width' ? $('#background-1').width() : $('#background-1').outerHeight(),

                cmMax = type == 'width' ? this.limit.width.max : this.limit.height.max;

          

            let percentage = cm / (cmMax / 100);

            let newPixels = (pixelsMax / 100) * percentage;

    

            return newPixels;

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

            plateData.width = this.getCropperPxByCm(

                Number($(`#${this.panelSelector} .width`).val()),

                'width',

            );

            plateData.height = this.getCropperPxByCm(

                Number($(`#${this.panelSelector} .height`).val()),

                'height',

            );

    

            let cropBoxObject = {

                top:    plateData.y,

                left:   0,

                width:  plateData.width,

                height: plateData.height,

            };

    

            console.log('res: w' + plateData.width + ', h' + plateData.height)

    

            $(this.cropperSelector).cropper('setData', plateData);

            $(this.cropperSelector).cropper('setCropBoxData', cropBoxObject);

            $(this.selector).css('width', plateData.width + 'px');

            $(`${this.selector} .cropper-container`).css('width', plateData.width + 'px');

            $(`${this.selector} .cropper-crop-box`).css('transform', 'none');

    

            $('.plate-track').trigger('checkPosition');

    

            setTimeout(() => document.querySelector(this.cropperSelector).cropper.containerData.width = plateData.width, 150); // Change Width in Container Data obj

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
    class Background {
        id;
        image;
        width;
        widthCoef = 0.561;
        height;
        parentSelector = '.cropper__background';
        selector;
        selectorImage;
    
        constructor(id) {
            this.id = id;
    
            this.selector = `#background-${this.id}`;
            this.selectorImage = `${this.selector} .background__image`;
        }
    
        init(width, image, scaled) {
            this.image = image;
            this.setWidth(width);
    
            this.initTemplate(scaled);
            this.initEvents();
        }
    
        initTemplate(scaled) {
            const html = `<div class="background__item" id="${this.selector.slice(1)}" style="width: ${Math.floor(this.width)}px; height: ${Math.floor(this.height)}px;">
                <a href="#" class="background__scale-button button button_weight_bold button_icon" style="opacity: 0;">
                    <i class="button__icon icon-r24-reflect"></i>
                    <span class="button__text">Mirroring</span>
                </a>
                <img class="background__image_hidden background__image${scaled ? ' background__image_scaled' : ''}" src="${this.image}" alt="" >
            </div>`;
    
            $(this.parentSelector).append(html);
    
            //
            $(`${this.selector} .background__scale-button`).animate(
                {opacity: 1}, 150,'linear',
            );
            
            //
            setTimeout(() => {
                $(this.selectorImage).removeClass('background__image_hidden');
            }, 150);
        }
    
        initEvents() {
            // Mirroring Event
            $( `${this.selector} .background__scale-button` ).on('click', (e) => {
                e.preventDefault();
      
                this.scaleX();
            });
        }
        
        scaleX() {
            $(this.selectorImage).toggleClass('background__image_scaled');
        }
    
        setWidth(width) {
            this.width = width * this.widthCoef;
            this.height = this.width / 2;
        }
    
        destroy() {
            $(this.selectorImage).addClass('background__image_hidden');
            $(`${this.selector} .background__scale-button`).animate({opacity: 0}, 150, 'linear', () =>  $(`${this.selector} .background__scale-button`).remove());
    
            setTimeout(() => {
                $(this.selector).remove();
            }, 250);
        }
    }

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