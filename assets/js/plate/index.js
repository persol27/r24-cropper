const plate = {
    name: 'plate',
    id: 1,
    selector: '',
    canvas: '',
    crop: {}, // obj
    setImageCanvas: (src) => {
        const ctx = plate.canvas.getContext("2d");
        
        const image = new Image(337, 295);
        image.onload = drawImageActualSize;
        image.src = src;

        function drawImageActualSize() {
            ctx.drawImage(this, 0, 0);
        };
    },

    init() {
        this.selector = `#${this.name}_id_${this.id}`;
        this.canvas = document.querySelector(`${this.selector} canvas`);
        
        setTimeout(() => {
            $(`${this.selector} canvas`).cropper({
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

            //$(`${this.selector} canvas`).cropper('rotate', 90);
        }, 175);
    },
};

// method rotateCanvas --> this.canvas.scale(1, -1)