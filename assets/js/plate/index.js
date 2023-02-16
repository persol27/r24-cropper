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
        const html = `<div class="plate-panel" id="${this.panelSelector}">
            <label for="plate-panel_id_${this.id}_width">Breite</label>
            <input type="number" inputmode="numeric" pattern="[0-9]*" class="input plate-panel__input" name="${this.panelSelector}_width" id="${this.panelSelector}_width" min="10" max="300">

            <label for="plate-panel_id_${this.id}_height">Höhe</label>
            <input type="number" inputmode="numeric" pattern="[0-9]*" class="input plate-panel__input" name="${this.panelSelector}_height" id="${this.panelSelector}_height" min="10" max="150">

            <a href="#" class="button plate-panel__remove">X</a>
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

    setCropperImage(img) {
        $(this.cropperSelector).cropper('replace', this.image, true);
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

    destroy() {
        $(this.selector).remove();
        $(`#${this.panelSelector}`).remove();
    }
}