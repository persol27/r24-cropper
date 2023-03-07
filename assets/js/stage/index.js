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