class Panel {
    selector; // str
    plates = []; // array
    platesMax = 20;
    platesActiveIndex = 0;
    backgroundActiveId = 1;
    image = './assets/images/image_2.jpg'; // default image

    constructor(type) {
        this.type = type;

        this.init();
    }

    init() {

        // Events Init
        this.initEvents();

        // Add Background
        this.backgroundCreate();
    }

    initEvents() {
        $(".cropper__area").on("scroll", () => {
            this.detectPlateVisibleWidth();
        });
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

    scaleBackground() {
        let id = document.getElementById(`background-${this.backgroundActiveId}`) === null ? 1 : this.backgroundActiveId;

        $(`#background-${id} img`).toggleClass('background__image_scaled');
    }

    backgroundCreate() {
        const cropperWidth = $('.cropper__area').width();
        let id = $('.cropper__background .background__item').length < 1 ? 0 : $('.cropper__background .background__item').last().attr('id').split('-')[1],
            scaled = $('.cropper__background .background__item').last().find('.background__image').hasClass('background__image_scaled') ? '' : ' background__image_scaled',
            html = `<div class="background__item" id="background-${Number(id) + 1}" style="width: ${cropperWidth * 0.8}px; height: ${(cropperWidth * 0.8) / 2}px;">
                <img class="background__image${scaled}" src="${this.image}" alt="" >
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
        $('.cropper__background .background__item').last().remove();
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

    detectPlateVisibleWidth() {
        const scrollbarContainer = '.cropper__area',
              backgroundContainer = '.cropper__background',
              backgroundItemWidh = $(`${backgroundContainer} .background__item:nth-child(1)`).width(),
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

        const previewContainerSelector = '.preview';
        const backgroundSelector = '.background__item';
        const trackSelector = '.plate-track';

        const backgroundCount = $(backgroundSelector).length;
        const backgroundPlateWidth = $(backgroundSelector).first().innerWidth();

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

            $('.preview__background').css('left', -(backgroundOffsetLeft) + 'px').css('width', ($('.modal__preview').width() + backgroundOffsetLeft) + 'px');

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
    
            console.log(platesWidthArray);
        };

        setTimeout(backgroundInit, 5);
        setTimeout(platesInit, 50);

    }
}