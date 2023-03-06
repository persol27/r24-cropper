class Stage {
    id;
    name;
    title;
    subtitle;
    selector;
    videos = [];

    constructor(id, name, title, subtitle) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.subtitle = subtitle;
        this.selector = `.${this.name}`;
    }

    addVideo(videoObj) {
        this.videos.push(videoObj);
    }

    removeVideo(videoId) {
        const videoIndex = this.videos.findIndex(x => x.id == videoId);
        
        this.videos[videoIndex].destroy();
        this.videos.splice(videoIndex, 1);
    }

    init() {

        this.initType();
        this.initTemplate();
        this.initEvents();
    }

    initType() {
        this.content = ``;
    }

    initTemplate() {
        const html = `<div class="main__${this.name} ${this.name}" id="stage-${id}">
            <div class="container container_align_start">
                <div class="col col-7${this.type == 'cropper' ? ' plate_col' : ''}"></div>
                <div class="col col-5"></div>
                ${this.content}
            </div>
        </div>`;


    }

    initEvents() {

    }
}