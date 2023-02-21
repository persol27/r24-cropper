class Panel {
    selector; // str
    plates = []; // array
    platesMax = 20;
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
                    $('.background__item').last().remove();
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

    backgroundRemove() {

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