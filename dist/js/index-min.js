"use strict";window.addEventListener("load",()=>{document.querySelector("body").classList.remove("body_no-load"),/iP(hone|ad)/.test(window.navigator.userAgent)&&document.body.addEventListener("touchstart",()=>{},!1)}),jQuery(document).ready(e=>{const t={name:"plate",id:1,selector:"",canvas:"",crop:{},setImageCanvas:e=>{const a=t.canvas.getContext("2d"),o=new Image(337,295);o.onload=function(){a.drawImage(this,0,0)},o.src=e},init(){this.selector=`#${this.name}_id_${this.id}`,this.canvas=document.querySelector(`${this.selector} canvas`),setTimeout(()=>{e(`${this.selector} canvas`).cropper({autoCropArea:1,viewMode:1,dragMode:"crop",responsive:!0,background:!1,zoomable:!1,guides:!1,crop:e=>{console.log(e.detail.x),console.log(e.detail.y),console.log(e.detail.width),console.log(e.detail.height)}})},175)}};(e=>e.forEach(e=>e.init()))([{name:"panel",selector:"",customizer:{},plateArray:[],init(){}},t,{name:"customizer",options:[{name:"Material 1",src:"././assets/images/image.jpg",thumb_src:"././assets/images/image_32x32.jpg"}],default_src:"",position:"",selector:".material-select",templateSelect:t=>t.id?e('<img src="'+t.element.getAttribute("data-thumb")+'" class="img-thumb" > <span>'+t.text+"</span>"):t.text,eventsSelect(){},init(){this.default_src=this.options[0].src}}]),t.setImageCanvas("./assets/images/image.jpg"),e(".plate .plate__scale").on("click",function(t){const a=e(this).parent(".plate").attr("id"),o=-1==e(".plate canvas").cropper("getData").scaleX?1:-1;e(`#${a} canvas`).cropper("scaleX",o)}),e(".panel-add").on("click",function(t){let a=e(".plate").length+1;e(".plate").clone().attr("id",`plate_id_${a}`).appendTo(".plate-col")}),e(document).on("mouseover",".plate .cropper-container",()=>{e(document).find(".cropper-center").hide()}).on("mouseleave",".plate .cropper-container",()=>{e(document).find(".cropper-center").show()})});