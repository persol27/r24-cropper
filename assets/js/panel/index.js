class Panel {
    selector; // str
    plates = []; // array
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

    addPlate(plate) {
        //this.plates = [...this.plates, plate];
        plate.image = this.image;
        plate.init();
        
        this.plates.push(plate);
    }

    removePlate(plateIndex) {
        console.log(this.plates);
        const plateId = this.plates.findIndex(x => x.id == plateIndex);
        
        this.plates[plateId].destroy();
        this.plates.splice(plateId, 1);

        console.log(this.plates);
    }
}