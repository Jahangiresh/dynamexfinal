// Window size
const width = $(window).width();

if (width > 990) {
    $(".content").mCustomScrollbar();
}

// Remove preloader after page load
$(window).ready(function() {
    $('.preloader').fadeOut('slow');
    $('body').show();
});


$(document).ready(function() {
        
    const calculateParcelDebtAmount = function() {
        var total = 0;
        var usd_rate = parseFloat($('.parcel-item-check-input').attr('data-usd-rate'));
        $('.parcel-item-check-input:checked').each(function() {
            total += parseFloat($(this).attr('data-total'));
        })

        $('.amount-tag-usd').html(total.toFixed(2))
        $('.amount-tag-azn').html((total * usd_rate).toFixed(2))
    }

    $(document).on('change','.parcel-item-check-input',function() {
        calculateParcelDebtAmount()
    })


    $(document).on('click','.pay-parcel-total-amount',function() {
        if(!$('.parcel-item-check-input:checked').length) {
            alert('Zəhmət olmasa əməliyyatdan öncə ödəniş etmək istədiyiniz bağlamaları işarələyin.')
            return false;
        }

        var parcel_id = $('.parcel-item-check-input:checked').map(function(i, el) { return $(el).val(); }).get()

        var ajaxPromise = sendAjax('/payment/pay-bulk-parcel-debts',{'parcel_id': parcel_id},'POST');

        ajaxPromise.then(function(data)
        {
            if(data.redirect_url !==undefined) {
                window.top.location = data.redirect_url;
                return false;
            }

            if(!data.success) {
                showNotification(data.response, 'error')
            }               
        })

        return false;
    })


    $(document).on('click','.pay-odd-parcel',function() {

        var t = $(this);

        var parcel_id = [t.attr('data-id')]

        var ajaxPromise = sendAjax('/payment/pay-bulk-parcel-debts',{'parcel_id': parcel_id},'POST');

        ajaxPromise.then(function(data)
        {
            if(data.redirect_url !==undefined) {
                window.top.location = data.redirect_url;
                return false;
            }

            if(data.success) {
                if(t.attr('data-replace') !== undefined) {
                    t.parent().html(t.attr('data-replace'))
                }

                showNotification(data.response, 'success')
            }
        })

        return false;
    })

    // Account inside table show more
    $('.parcel-control').click(function() {
        $(this).parents('.parcel-item-i').find('.parcel-add-op').toggleClass('d-none');
    });

    $(document).on('change','.news-select', function() {
        if($(this).val()) {
            window.top.location = $(this).val()
        }
    })

    $(function () {
        $('.selectpicker').selectpicker();
    });

    $(".chosen-select").each(function(){
        var tags =  $(this).attr('data-tags') !== undefined && $(this).attr('data-tags') == true ? true : false;
        var searchbar = $(this).attr('data-search') !== undefined ? 1 : Infinity;
        var dropdownCssClass = $(this).attr('data-dropdown-class') !== undefined ? $(this).attr('data-dropdown-class') : '';
        // alert(containerClass)
        $(this).select2({
            tags: tags,
            minimumResultsForSearch: searchbar,
            dropdownCssClass: dropdownCssClass
        })
    })
    
    $(document).on('change','.registration_form_type input', function() {
        if($(this).val() == 'user') {
            $('.company-fields').hide();
            $('.user-fields').show();
        } else {
            $('.user-fields').hide();
            $('.company-fields').show();
        }
    })

    // Home page tariff tabs
    $('.tarif_tab_links  a').on('click', function(e) {
        var currentNewsValue = $(this).attr('href');
        $('.tarif_tab').hide();
        $(currentNewsValue).fadeIn(500);
        $(this).parent().addClass('active').siblings().removeClass('active');
        e.preventDefault();
    });

    $(document).on('click','.yt-arrows a', function() {
        if($(this).is('.yt-prev')) {
            $('.yt-slider-carousel .owl-prev').trigger('click')
        } else {
            $('.yt-slider-carousel .owl-next').trigger('click')
        }

        return false;
    })
   

    // Home page news slider
    $('.news_slider.owl-carousel').owlCarousel({
        margin: 30,
        loop: true,
        nav: true,
        autoWidth: true,
        items: 1,
    });

    $('.partner_list.owl-carousel').owlCarousel({
        margin: 40,
        loop: true,
        nav: false,
        autoWidth: false,
        items: 10,
        autoplay: true,
        autoplayTimeout: 3000,
        smartSpeed: 3000,
        animateIn: 'linear',
        animateOut: 'linear',
        responsive: {
            0: {
                items: 3
            },
            700: {
                items: 3
            },
            1000: {
                items: 7,
                dots: false
            }
        }
    });


    // Faq tab control
    var $tabs = $('.faq_open').click(function(event) {
        $(this).next('.faq_desc').stop().slideToggle(300);
        var $parent = $(this);
        if ($parent.is('.active')) {
            $parent.removeClass('active');
            return false;
        }
        $parent.addClass("active");
    });

    $(document).on('click','.tab-navs a', function(){
        var t = $(this);
        if(!t.hasClass('active')) {
            t.parents('.tab-navs').find('a').removeClass('active');
            t.addClass('active');
            $('.tab-content').hide();
            $(t.attr('href')).fadeIn();
        }
        return false;
    })

    $('.dr_links_slider.owl-carousel').owlCarousel({
        margin: 20,
        loop: false,
        nav: true,
        autoWidth: true,
        items: 5,
    });


    $('.table_more,.active_shop_menu, .show_menu_dropdown,.active_lang,.lang_list,.active_count').click(function(e) {
        e.stopPropagation();
    });


    // Control language panel
    $('.active_lang').click(function(e) {
        $('.lang_list').toggle();
    });

    $(document).click(function(e) {
        $('.lang_list').hide();
    });
    

    $('.order_me_countries_list').click(function(e) {
        e.stopPropagation();
    });

    $(document).click(function() {
        $('.order_me_countries_list').hide();
        $('.active_count').removeClass('active');
    });




    // Account address tabs
    $('.address_tabs li  a').on('click', function(e) {
        var currentNewsValue = $(this).attr('href');
        $('.address_tab').hide();
        $(currentNewsValue).fadeIn(500);
        $(this).parent().addClass('active').siblings().removeClass('active');
        e.preventDefault();
    });

    // Copy address text
    $(document).on('click', '.copy_text', function() {
        var t = $(this);
        t.addClass('copied')
        copyToClipboard(t.parent().children('p').text());
        setTimeout(function() {
            t.removeClass('copied')
        }, 300);
    });

    // Copy sub-account url
    $(document).on('click', '.link_copy', function() {
        var t = $(this);
        copyToClipboard(t.parent().children('p').text());
        alert('link copied');
    });


    // Parcel consolidation table
    var $tabs = $('.bb_showall').click(function(event) {
        $(this).parents('li').children('.bb_table').stop().toggle();
        var $parent = $(this);
        if ($parent.is('.active')) {
            $parent.removeClass('active');
            $tabs.removeClass('active');
            return;
        }
        $tabs.removeClass('active');
        $parent.addClass("active");
    });


    // magnificPopup conf
    $('.popup_btn').magnificPopup({
        // removalDelay: 300,
        callbacks: {
            beforeOpen: function() {
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
        midClick: true
    });

    // $('.bmc_more').click(function() {
    //     $('.parcel-add-op').hide();
    //     $('.bmc_more').removeClass('active')
    //     $(this).parents('.bmc_bottom').children('.parcel-add-op').toggle();
    // });


    // Control password  visibility of password fields
    $(".show_pass, .hide_pass").on('click', function() {
        var passwordId = $(this).parents('.form-group').find('input');
        if ($(this).hasClass('show_pass')) {
            passwordId.attr("type", "text");
            $(this).parent().find(".show_pass").hide();
            $(this).parent().find(".hide_pass").show();
        } else {
            passwordId.attr("type", "password");
            $(this).parent().find(".hide_pass").hide();
            $(this).parent().find(".show_pass").show();
        }
    });

    // Add active class to declaration country inputs
    $('.declaration_radios ul li label').click(function() {
        $('.declaration_radios ul li').removeClass('active');
        $(this).parent('li').addClass('active');
        $('.country-input').val( $(this).find('input').val() )
    });

    // User dashboard control main links
    $('.active_count').click(function() {
        $('.order_me_countries_list').toggle();
        $(this).toggleClass('active');
    });



    // Tablet version
    if(width < 990) {
        $('.tarif_tab_list li').hide();
        $('.tarif_tab_list li:lt(4)').show();
        $('.show_all_t').click(function() {
            $('.tarif_tab_list li:not(:visible)').fadeIn(500);
            $('.show_all_t').hide();
            return false;
        });
    }


    // Mobile version
    if(width <= 767) 
    {
        // Home page how it works carousel
        $('.how_work_mobile .owl-carousel').owlCarousel({
            margin: 0,
            loop: true,
            dots: true,
            nav: false,
            autoWidth: false,
            items: 1,
        });

        // Mobile menu control
        $('.menu_open').click(function() {
            $('.mobile_menu').addClass('opened');
            $('.layer').fadeIn(300);
        });

        $('.menu_close').click(function() {
            $('.mobile_menu').removeClass('opened');
            $('.layer').fadeOut(300);
        })

         // Control store category
        $('.active_shop_menu').click(function() {
            $(this).toggleClass('active');
            $(this).next('ul').slideToggle();
        });

        // Parcel consolidation page show more
        $('.bmc_card .bb_showall').click(function() {
            $('.bb_mobile_table').hide();
            $(this).parents('.bmc_card').children('.bb_mobile_table').show();
            $('.bmc_card .bb_showall').removeClass('active');
            $(this).addClass('active');
        });
    }
});

const copyToClipboard = function(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
    } catch (err) {
        console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
}


// Should optimize on next stage
$('.sv_select select').change(function() {
    var bu = $(this);

    if (bu.val() == 0) {
        $('.show_fin').addClass('aze');
        $('.sv_img').addClass('aze_img');

    } else {
        $('.show_fin').removeClass('aze');
        $('.sv_img').removeClass('aze_img');
    }
    if (bu.val() == 1) {
        $('.show_fin').addClass('aa');
        $('.sv_img').addClass('aa_img');

    } else {
        $('.show_fin').removeClass('aa');
        $('.sv_img').removeClass('aa_img');
    }

    if (bu.val() == 2) {
        $('.show_fin').addClass('myi');
        $('.sv_img').addClass('myi_img');

    } else {
        $('.show_fin').removeClass('myi');
        $('.sv_img').removeClass('myi_img');
    }
});


$('.show_fin').click(function() {
    $('.sv_img').toggle();
    $(this).toggleClass('active');
});


$(document).on('click','.select-links span', function(){
    $(this).toggleClass('active');
    $(this).siblings('ul').fadeToggle(100)
})

$('.datepicker').datepicker({
    format: "dd.mm.yyyy",
    language: "az",
    autoclose: true,
    todayHighlight: true
});



$('.main_banner_section .owl-carousel').owlCarousel({
    margin:0,
    loop:true,
    nav:true,
    autoWidth:false,
    items:1,
    animateOut: 'fadeOut',
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive:{
      0:{
            items:1,
            nav:false
      },
      1200:{
            items:1,
            nav:true,
            loop:false
      }
   }
});


$(document).on('change','#user-citizenship', function(){
    var citizenship = $(this).val()
    switch(citizenship) {
        case 'az': 
            $('.sv_img').css('background-image', 'url(/css/images/aze.svg)');
        break;
        case 'other': 
            $('.sv_img').css('background-image', 'url(/css/images/other.png)');
        break;
    }
})


$(document).on('change','.citizenship-select',function() {
    var options = $.parseJSON($(this).find('option:selected').attr('data-options'));

    $('.document-series option').remove()

    $.each(options, function(key, value) {   
         $('.document-series')
             .append($("<option></option>")
                        .attr("value", key)
                        .text(value)); 
    });

    $('.document-series').selectpicker();
})
