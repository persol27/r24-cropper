"use strict";

window.addEventListener('load', () => {
  const el = document.querySelector('body');
  el.classList.remove("body_no-load");
  
  if(/iP(hone|ad)/.test(window.navigator.userAgent)) {
    document.body.addEventListener('touchstart', () => {}, false);
  }
});

jQuery(document).ready(($) => {
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
    const panel = {
        name: 'panel',
        selector: '',
        customizer: {},
        plateArray: [], //array
    
        init() {
            
        },
    };
    const customizer = {
        name: 'customizer',
        options: [
            {name: 'Material 1', src: '././assets/images/image.jpg', thumb_src: '././assets/images/image_32x32.jpg'},
        ],
        default_src: '',
        position: '',
        selector: '.material-select',
    
        templateSelect(state) {
              if (!state.id) {
                return state.text;
              }
    
              var $state = $(
                '<img src="' + state.element.getAttribute('data-thumb') + '" class="img-thumb" > <span>' + state.text + '</span>'
              );
              return $state;
        },
        eventsSelect() {
        },
        init() {
            this.default_src = this.options[0].src;
            /*this.position = position.coords;
    
            for (let $i = 0; $i < this.options.length; $i++) {
                let class_list = 'material-select__item material-option';
                $( this.selector )
                    .append(`<option class="${class_list}" value="${this.options[$i].src}" data-thumb="${this.options[$i].thumb_src}">${this.options[$i].name}</option>`);
            }
    
            $( this.selector ).select2({
                selectionCssClass: 'select2-menu',
                dropdownCssClass: 'select2-menu-dropdown',
                width: 250,
                minimumResultsForSearch: Infinity,
                templateResult: this.templateSelect,
                templateSelection: this.templateSelect
            });
    
            this.eventsSelect(); // Select2 events init*/
        }
    };

    // Script Init
    let objects_arr = [panel, plate, customizer,];
    const init = objects => objects.forEach((el) => el.init());

    init(objects_arr);

    // Script Start
    plate.setImageCanvas('./assets/images/image.jpg');


    // Plate Events
    $( '.plate .plate__scale' ).on('click', function (e) {
      const plate_id = $(this).parent('.plate').attr('id'),
            plate_data = $(`.plate canvas`).cropper('getData'),
            plate_scale = plate_data.scaleX == -1 ? 1 : -1;
      
      $(`#${plate_id} canvas`).cropper('scaleX', plate_scale);
    });

    $( '.panel-add' ).on('click', function (e) {
      let plate_length = $('.plate').length + 1;
      $('.plate').clone().attr('id', `plate_id_${plate_length}`).appendTo('.plate-col');
    });

    // Events
    $( document ).on('mouseover', '.plate .cropper-container', () => {
      $( document ).find('.cropper-center').hide();
    }).on('mouseleave', '.plate .cropper-container', () => {
      $( document ).find('.cropper-center').show();
    });

    /*let plate_html = document.querySelector(".plate .cropper-container");
    plate_html.addEventListener("touchstart", (e) => $( document ).find('.cropper-center').hide(), false);
    plate_html.addEventListener("touchend",   (e) => $( document ).find('.cropper-center').show(), false);*/
});

// obj Crop находится в obj Plate
// obj Plate находится в array Plate_arr в obj Panel
// obj Customizer находится в obj Panel