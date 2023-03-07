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