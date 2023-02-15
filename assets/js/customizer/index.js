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