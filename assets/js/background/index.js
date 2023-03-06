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
            <a href="#" class="background__scale-button button button_weight_bold button_icon">
                <i class="button__icon icon-r24-reflect"></i>
                <span class="button__text">Mirroring</span>
            </a>
            <img class="background__image${scaled ? ' background__image_scaled' : ''}" src="${this.image}" alt="" >
        </div>`;

        $(this.parentSelector).append(html);

        $(this.selector).css('opacity', 0);
        $(this.selector).animate({opacity: 1}, 375);
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
        $(this.selector).animate(
            {opacity: 0},
            375,
            "linear",
            () => $(this.selector).remove()
        );
    }
}