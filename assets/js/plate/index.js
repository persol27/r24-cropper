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

        const plateWidth = $('#background-1').width() - 2 + 'px';
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

        return newPixels - 2;
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

        console.log('res: w' + this.getCropperPxByCm(plateData.width, 'width') + ', h' + this.getCropperPxByCm(plateData.height, 'height'))

        $(this.cropperSelector).cropper('setData', plateData);
        $(this.cropperSelector).cropper('setCropBoxData', cropBoxObject);
        $(this.selector).css('width', plateData.width + 'px');
        $(`${this.selector} .cropper-container`).css('width', plateData.width + 'px');
        $(`${this.selector} .cropper-crop-box`).css('transform', 'none');

        $('.plate-track').trigger('checkPosition');

        setTimeout(() => document.querySelector(this.cropperSelector).cropper.containerData.width = plateData.width, 200); // Change Width in Container Data obj

        // Plate Track Position check
        $('.plate-track').trigger('onmousedown');
        $(document).trigger('onmousemove').trigger('onmouseup');
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