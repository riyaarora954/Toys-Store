/**
 * ishiinitialize v1.1
 * JavaScript to initalize various theme components
 */

var opencart_responsive_current_width = window.innerWidth;
var opencart_responsive_min_width = 992;
var opencart_responsive_mobile = opencart_responsive_current_width < opencart_responsive_min_width;
jQuery(document).ready(function( $ ) {
    'use strict';
    $(window).on('resize', function () {
        var _cw = opencart_responsive_current_width;
        var _mw = opencart_responsive_min_width;
        var _w = window.innerWidth;
        var _toggle = _cw >= _mw && _w < _mw || _cw < _mw && _w >= _mw;
        opencart_responsive_current_width = _w;
        opencart_responsive_mobile = opencart_responsive_current_width < opencart_responsive_min_width;
        if (_toggle) {
            toggleMobileStyles();
        }
    });

    if (opencart_responsive_mobile) {
        toggleMobileStyles();
    }

    $('#spin-wrapper').fadeOut();
    $('#siteloader').fadeOut();

    var headerHeight = $('#header').height();
    var navHeight = $('#header .nav-full-width').height();
    $(window).scroll(function(){
        if ($(window).scrollTop() > headerHeight) {
            $('.nav-full-width').addClass('fixed-header');
        }
        else {
            $('.nav-full-width').removeClass('fixed-header');
        }
    });

    adjustTopMenu();

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
	if(!isMobile) {
	    if($(".parallax").length) {
	        $(".parallax").sitManParallex({  invert: false });
	    };
	} else {
	    $(".parallax").sitManParallex({  invert: true });
	}

	$(window).resize(function() {
    	adjustTopMenu();
         
    });

    if ($('#ishiparallaxbanner .parallax').data('deal') == '1') {
        var time = $('#ishiparallaxbanner .parallax').data('counter');
        var container = $('#ishiparallaxbanner .parallax').find('#parallaxcountdown');

        $(container).countdown(time, function (event) {
            $(this).find(".countdown-days .data").html(event.strftime('%D'));
            $(this).find(".countdown-hours .data").html(event.strftime('%H'));
            $(this).find(".countdown-minutes .data").html(event.strftime('%M'));
            $(this).find(".countdown-seconds .data").html(event.strftime('%S'));
            ;
        });
    }    
    
    $('#header .blockcart .product-container').slimScroll({
      height: $('#header .blockcart .product-container .product').length > 1 ? '240px':'100%'
    });

	 // $("#_desktop_top_menu").click(function(){
  //       $("#top-menu").slideToggle();
  //       $('.wrapper-menu').toggleClass('open');
  //   });

    $('#search_widget .search-logo').click(function() {
        $(this).toggleClass('active').parents('#search_widget').find('form').stop(true,true).slideToggle('medium');
    });

    $('#menu-icon').on('click', function () {
        $("#mobile_top_menu_wrapper").animate({
            width: "toggle"
        });
        $('#menu_wrapper').toggleClass('active');
    });

    $('#top_menu_closer i').on('click', function () {
        $("#mobile_top_menu_wrapper").animate({
            width: "toggle"
        });
        $('#menu_wrapper').toggleClass('active');
    });

    $('#menu_wrapper').on('click', function () {
        $("#mobile_top_menu_wrapper").animate({
            width: "toggle"
        });
        $('#menu_wrapper').toggleClass('active');
    });

	$(window).scroll(function() {
        if ($(this).scrollTop() > 500) {
            $('#slidetop').fadeIn(500);
        } else {
            $('#slidetop').fadeOut(500);
        }
    });

    $('#slidetop').click(function(e) {
        e.preventDefault();     
        $('html, body').animate({scrollTop: 0}, 800);
    });

    $("a.scrollLink").click(function(e){
        $('.product-block-information .nav-tabs .nav-item').removeClass('active');
        $('.product-block-information .nav-tabs .nav-item:nth-child(3)').addClass('active');
        $('.product-block-information .tab-pane').removeClass('active');
        $('#tab-review').addClass('active in');
        
        e.preventDefault();
        $('html, body').animate({
             scrollTop: $( $(this).attr('href') ).offset().top
         }, 2000);
        
     });
    
    $(document).on( "click",".product-quantity-selector .button",function() {
        var n = $(".product-quantity-selector .quantity").val();
        if($(this).text() == "+"){
          var r = parseInt(n) + 1
        } else{
          if(n == 1)
            return;
          var r = parseInt(n) - 1
        }
        $('input.quantity').val(r);
      });

    $('#ishi-product-accessories.owl-carousel').owlCarousel({
        loop:false,
        rewind:true,
        nav:true,
        dots:false,
        autoplay:true,
        navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
        responsive:{
            0:{
                items:2
            },
            544:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    }); 

    $('#ishi-left-right-product-accessories.owl-carousel').owlCarousel({
        loop:false,
        rewind:true,
        nav:true,
        dots:false,
        autoplay:true,
        navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
        responsive:{
            0:{
                items:2
            },
            544:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:3
            }
        }
    }); 

    $('.ishiservicesblock .owl-carousel').owlCarousel({
        loop:false,
        nav:false,
        dots:false,   
        autoplay:true, 
        autoplayTimeout: 2000,
        rewind: true,
        navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
        responsive:{
            0:{
                items:1
            },
            544:{
                items:2
            },
            600:{
                items:2
            },
            768:{
                items:1
            },
            992:{
                items:2
            }
        }
    });

    $('.qv-carousel').owlCarousel({
        nav:true,
        margin: 15,
        loop: false,
        rewind: true,
        navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
        responsive:{
            0:{
                items:3
            },
            544:{
                items:4
            },
            768:{
                items:3
            },
            992:{
                items:3
            },
            1100:{
                items:4
            }
        }
    });

    $('#ishislider.owl-carousel').owlCarousel({
        loop:true,
        nav:true,
        autoplay:true,
        animateOut: 'fadeOut',
        autoplayTimeout:5000,
        navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
        responsive:{
            0:{
                items:1
            }
        }
    });

    $('#ishi-featured-products.owl-carousel').owlCarousel({
        loop:false,
        rewind:true,
        nav:true,
        dots:false,        
        navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
        responsive:{
            0:{
                items:2
            },
            544:{
                items:2
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });

    $('#ishi-new-products.owl-carousel').owlCarousel({
        loop:false,
        rewind:true,
        nav:true,
        dots:false,
        autoplay:true,
        navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
        responsive:{
            0:{
                items:2
            },
            544:{
                items:2
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });

    $('#ishi-bestseller-products.owl-carousel').owlCarousel({
        loop:false,
        rewind:true,
        nav:true,
        dots:false,
        autoplay:true,
        navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
        responsive:{
            0:{
                items:2
            },
            544:{
                items:2
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });

    $('#ishi-products-category.owl-carousel').owlCarousel({
        loop:false,
        rewind:true,
        nav:true,
        dots:false,        
        navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
        responsive:{
            0:{
                items:2
            },
            544:{
                items:2
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:3
            }
        }
    });
    
    $('.ishicategoryblock-carousel.owl-carousel').owlCarousel({
        loop:true,
        nav:false,
        dots:false,
        margin: 30,
        autoplay:true,
        autoplayTimeout:2000,
        navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
        rewind: true,
        responsive:{
          0:{
            items:1
          },
          442:{
            items:2
          },
          544:{
            items:2
          },
          768:{
            items:3
          },
          992:{
            items:4
          },
          1299:{
            items:5
          },
          1500:{
            items:6
          }
        }
    });

    $('#manufacturer-carousel').owlCarousel({
        loop:false,
        nav:false,
        rewind: true,
        autoplay:true,
        autoplayTimeout:2000,
        navText: ["<i class='material-icons'></i>","<i class='material-icons'></i>"],
        responsive:{
            0:{
                items:2
            },
            544:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            }
        }
    });

    $('#ishispecialproducts-carousel').owlCarousel({
        loop:false,
        rewind:true,
        nav:true,
        dots:false,
        autoplay:true,
        navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
        responsive:{
            0:{
                items:2
            },
            544:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });

    $('#ishitestimonials-carousel').owlCarousel({
       loop:true,
       center:true,
       nav:true,
       dot:false,
       autoplayTimeout:4000,
       autoplay:0,
       navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
       responsive:{
            0:{
                items:1
            },
            544:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:3
            }
        }
    });

    $('#smartblog-carousel').owlCarousel({
       loop:false,
       rewind: true,
       nav: true,
       margin:30,
       dots:false,
       navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
       autoplay:false, 
       responsive:{
         0:{
           items:1
         },
         544:{
           items:2
         },
         768:{
           items:2
         },
         992:{
           items:2
         },
         1200:{
           items:3
         },
         1600:{
           items:3
         }
       }
    });   
});

function adjustTopMenu() {
	$('#_desktop_top_menu #top-menu > li').each(function( index ) {
	  var li = $(this).find('.sub-menu > ul > li').length;
	  switch(li) {
	  	case 1 : $(this).find('.sub-menu').css('width','230px');
	  	break;
	  	case 2 : $(this).find('.sub-menu').css('width','430px');
	  	break;
	  	default : $(this).find('.sub-menu').css('width','630px');
	  }
    });
}

function convertToMobile(){
 
  $("*[id^='_desktop_']").each(function(index, element) {
        var target = $('#' + element.id.replace('_desktop_', '_mobile_'));
        swapElements($(this), target);
  });
}


function convertToDesktop(){

  $("*[id^='_mobile_']").each(function(index, element) {
        var target = $('#' + element.id.replace('_mobile_', '_desktop_'));
        swapElements($(this), target);
  });
}


function swapElements(source, destination) {
  destination.html(source.html());
  source.html('');
}

function swapChildren(obj1, obj2) {
    var temp = obj2.children().detach();
    obj2.empty().append(obj1.children().detach());
    obj1.append(temp);
}
    
function toggleMobileStyles() {
    if (opencart_responsive_mobile) {
        $("*[id^='_desktop_']").each(function (idx, el) {
            var target = $('#' + el.id.replace('_desktop_', '_mobile_'));
            if (target.length) {
                swapChildren($(el), target);
            }
        });
    } else {
        $("*[id^='_mobile_']").each(function (idx, el) {
            var target = $('#' + el.id.replace('_mobile_', '_desktop_'));
            if (target.length) {
                swapChildren($(el), target);
            }
        });
    }
}
