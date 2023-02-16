class Panel {
    selector; // str
    plates = []; // array

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

    addPlate(plate) {
        //this.plates = [...this.plates, plate];
        this.plates.push(plate);
    }

    removePlate(plateIndex) {
        delete this.plates[plateIndex];
    }
}