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