// This code will send csrf-token every ajax request
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});


$(document).ready(function(){
    if($('.popup_msg').length)
    {
        var title = null;

        if($('.popup_msg').attr('data-title') !==undefined) {
            title = $('.popup_msg').attr('data-title');
        }

        setTimeout(function(){
            showNotification($('.popup_msg').text(), $('.popup_msg').attr('data-type'),title)
        },300)
    }

    if($('#delivery-type').length) {
        $.magnificPopup.open({
            items: {
                src: $('#delivery-type'),
                type: 'inline'
            },
            // closeOnBgClick: false,
            mainClass: 'mfp-zoom-in',
            // removalDelay: 100, //delay removal by X to allow out-animation
            midClick: false,
        });
    }
})


const handleSuccessFunc = function() {

}

const handleErrorFunc = function() {

}


// Ajax Request
const sendAjax = function(url,data,type='POST',data_type='json',handleSuccessFunc)
{
    var ajaxPromise = new Promise(function(resolve,reject){
        $.ajax({
            url: url,
            type: type,
            data: data,
            dataType: data_type,
            success: function(data) {
                resolve(data);
            },
            error: function(error) {
                reject(error);
            }
        });
    });

    return ajaxPromise;
}


// Scroll to element
const scrollToElement = function(el = false){

    if(typeof $('.has-error').first().offset() !== 'undefined') {

        if($('.has-error').parents('#colorbox_content').length) {
            $.colorbox.resize();
        }

        var scrollOffset = $('.has-error').first().offset().top-200;

        $('html, body').animate({
            scrollTop: scrollOffset
        }, 400);

    } else {
        if(el.length) {
            var scrollOffset = el.first().offset().top-200;

            $('html, body').animate({
                scrollTop: scrollOffset
            }, 400);
        }
    }
}

// Scroll to element when form submit with errors
$('form').on('afterValidate', function (event, messages) {
    scrollToElement();
});


// Function for custom notifications
const showNotification = function(message, notifyType,title = null) {

    var el = $('#' + notifyType + '_popup');

    el.find('.main-message').html(message)

    if(title) {
        el.find('.main-message-title').html(title)
    }

    $.magnificPopup.open({
        items: {
            src: el,
            type: 'inline'
        },
        mainClass: 'mfp-zoom-in',
        // removalDelay: 100, //delay removal by X to allow out-animation
        midClick: true,
    });
}


// Submit custom form
$(document).on('beforeSubmit','#custom-form,#custom-form-2,#links-form', function(event, jqXHR, settings)
{
    var form = $(this);

    if(form.find('.has-error').length > 0)
    	return false;

    $('body').addClass('loading');

    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        dataType: 'json',
        success: function(data) {
            if(data.success) {

                if(form.hasClass('activate-sub-account')) {

                    $('body').removeClass('loading');

                    $.magnificPopup.open({
                        items: {
                            src: $('#confirm-sub-account'),
                            type: 'inline'
                        },
                        mainClass: 'mfp-zoom-in',
                        // removalDelay: 100, //delay removal by X to allow out-animation
                        midClick: true,
                    });

                    return false;
                }

                if(form.hasClass('reset-form'))
                {
                    form[0].reset();
                }

                showNotification(data.response, 'success')

            } else {
                showNotification(data.response, 'error')
            }

            $('body').removeClass('loading');
        }
    });

    return false;
});



// Submit custom form
$(document).on('beforeSubmit','.chat-btm form', function(event, jqXHR, settings)
{
    var form = $(this);

    if(form.find('.has-error').length > 0)
        return false;

    $('body').addClass('loading');

    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        dataType: 'json',
        success: function(data) {
            if(data.success) {
                $('.ticket-chat-container').html(data.chat)
                form[0].reset();
            } else {
                showNotification(data.response, 'error')
            }

            $('body').removeClass('loading');
        }
    });

    return false;
});



$(document).on('beforeSubmit','#custom-payment-form', function(event, jqXHR, settings)
{
    var form = $(this);

    if(form.find('.has-error').length > 0)
        return false;

    $('body').addClass('loading');

    $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: form.serialize(),
        dataType: 'json',
        success: function(data) {
            if(data.success) {

                if(form.hasClass('reset-form'))
                {
                    form[0].reset();
                }

                showNotification(data.response, 'success')

            } else {
                showNotification(data.response, 'error')
            }

            $('body').removeClass('loading');
        }
    });

    return false;
});


// Delete parcel
$(document).on('click','.btn-trash', function()
{
    var t = $(this);

    if(!confirm(t.attr('data-confirm-msg')))
        return false;

    $('body').addClass('loading');

    var ajaxPromise = sendAjax(t.attr('href'),{'id': t.attr('data-id')},'POST');

    ajaxPromise.then(function(data)
    {
        if(data.success) {
            var p = width <= 767 ? t.parents('.mobile-parcel-item') : t.parents('tr')
            p.fadeOut(200, function() { $(this).remove(); });
            showNotification(data.response, 'success')
        } else {
            showNotification(data.response, 'error')
        }

        $('body').removeClass('loading');

    },handleErrorFunc)

    return false;
});




$(document).on('click','.ajax-link', function()
{
    var t = $(this);

    $('body').addClass('loading');

    var ajaxPromise = sendAjax(t.attr('href'),{},'GET');

    ajaxPromise.then(function(data)
    {
        if(data.success) {
            if(t.attr('data-replace') !== undefined) {
                t.parent().html(t.attr('data-replace'))
            }

            showNotification(data.response, 'success')
        } else {

            if(data.redirect_url !== undefined)
            {
                window.top.location = data.redirect_url;
                return false;
            }

            showNotification(data.response, 'error')
        }

        $('body').removeClass('loading');

    },handleErrorFunc)

    return false;
});


$(document).on('click','.popup_ajax', function(){

    var ajaxPromise = sendAjax($(this).attr('data-url'),{},'GET');

    var popup = $(this).attr('href');

    ajaxPromise.then(function(data)
    {
        if(data.success) {
            $(popup).html(data.response)
            callPopover()
            return false;
        }
    })
})



$(document).on('click', '.add-new-product', function(){
    var t = $(this);

    $(".declaration_card").each(function(i,el){
        var el = $(this).find('.category-select');
        $(el).select2('destroy')
    })

    var form_block = $('.declaration_card:last').clone();
    form_block.find('input,textarea').val('')
    form_block.find('.p-count').val(1)
    form_block.find('.p-cargo-price').val(0)
    form_block.find('.category-select').val('')
    form_block.find('.bct_left span').html('#' + ($('.declaration_card').length + 1))
    $('.declaration_cards').append(form_block)
    controlProductsBtns()

    $(".declaration_card").each(function(i,el){
        var el = $(this).find('.category-select');
        var val = el.val()
        el.attr('id','declaration-category' + i)
        el.select2({
            minimumResultsForSearch: 5,
        })
        el.val( val ).trigger('change')
    })

    return false;
})

$(document).on('click', '.delete-declaration', function(){
    var t = $(this);
    var form_block = t.parents('.declaration_card');

    if($('.declaration_card').length > 1) {
        form_block.remove();
    }
    controlProductsBtns()
    return false;
})

const controlProductsBtns = function() {
    if($('.declaration_card').length === 1) {
        $('.delete-declaration').hide();
    } else {
        $('.delete-declaration').show();
    }

}



// Submit sign form
$(document).on('beforeSubmit','#declaration-form', function(event, jqXHR, settings) {

    var form = $(this);

    if(form.find('.has-error').length > 0)
    {
        return false;
    }

    var storedFiles = $('#fine-uploader-gallery').fineUploader('getUploads', { status: qq.status.SUBMITTED }).length;

    if(!storedFiles && !$('.img-list li').length)
    {
        alert($('.file-count').text())
        return false;
    }

    $('body').addClass('loading')

    var ajaxPromise = sendAjax(form.attr('action'),form.serialize(),'POST');

    ajaxPromise.then(function(data){

        if(data.success) {

            $('#redirect').attr('data-redirect', 1);

            if(storedFiles)
            {
                $('#fine-uploader-gallery').fineUploader("uploadStoredFiles");

            } else {
                window.top.location = '/account/parcel-list';
            }

        } else {
            showNotification(data.response, 'error')
        }

        $('body').removeClass('loading')

    },handleErrorFunc)

    return false;
});

if($('#fine-uploader-gallery').length>0)
{
    var imagesList = [];
    $('#fine-uploader-gallery').fineUploader({
        debug: true,
        button: document.getElementsByClassName('add-invoice-file')[0],
        autoUpload: false,
        template: 'qq-template-gallery',
        // form: {
        //     interceptSubmit: false
        // },
        session : {
            endpoint: '/ajax/get-initial-files',
            params: {
                'tracking_id': $('#parcel-tracking_id').val(),
            }
        },
        request: {
            endpoint: '/ajax/upload',
            customHeaders: {
                'X-CSRFToken': $('meta[name="csrf-token"]').attr('content')
            },
            params: {
                'upload': true,
                '_csrf': $('meta[name="csrf-token"]').attr('content'),
            }
        },
        deleteFile: {
            enabled: true,
            method: 'POST',
            endpoint: '/ajax/upload',
            customHeaders: {
                'X-CSRFToken': $('meta[name="csrf-token"]').attr('content')
            },
            params: {
                'delete': true,
                '_csrf': $('meta[name="csrf-token"]').attr('content')
            }
        },
        editFilename: {
            enabled: false
        },
        thumbnails: {
            placeholders: {
                notAvailablePath: '/fine-uploader/placeholders/not_available-generic.png'
            }
        },
        validation: {
            itemLimit: 2,
            sizeLimit: 1024*1024*10,
            allowedExtensions: ['pdf', 'jpg', 'png','docx','jpeg'],
        },
        text: {
            defaultResponseError: $('.default-error').text()
        },
        messages: {
            typeError: $('.file-error').text(),
            tooManyItemsError: $('.file-count').text(),
            sizeError: $('.file-volume').text(),
            retryFailTooManyItemsError: $('.upload-error').text(),
            onLeave: 'If you are leave upload will be canceled',
            noFilesError: $('.file-not-selected').text(),
            minWidthImageError: $('.file-size-error').text(),
            minHeightImageError: $('.file-size-error').text(),
            emptyError: '{file} is empty, please select files again without it.'
        },
        showMessage: function(message) {
            showNotification(message, 'error')
            return false;
        },
        callbacks: {
            onError: function(id, name, errorReason, xhrOrXdr) {

            },
            onDelete: function(id) {

            },
            onDeleteComplete: function(id, xhr, isError) {
                var index = imagesList.indexOf(id);
                imagesList.splice(index, 1);
            },
            onComplete: function(id, name, responseJSON, xhr) {

            },
            onAllComplete: function(succeeded, failed) {
                // imagesList = [];
                // if(parseInt($('#redirect').attr('data-redirect'))) {
                //     window.top.location = '/account/parcel-list';
                // }
            },
            onSubmit: function(id, name) {

            },
            onStatusChange: function(id, oldStatus, newStatus) {

                if($('.img-list').length) {
                    $('.invoys_upload_box').removeClass('invoys_upload_box').addClass('invoys_upload_selected_file')
                } else {
                    $('.invoys_upload_selected_file').removeClass('invoys_upload_selected_file with-error').addClass('invoys_upload_box')
                }
            }
        }
    });
}


$('#current-gallery .qq-upload-trash').on('click', function() {
    var t = $(this);
    var confirm_message = t.attr('data-confirm-message');
    var uuid = t.attr('data-uuid');

    if (!confirm(confirm_message)) return false;

    var ajaxPromise = sendAjax('/ajax/upload',{ qquuid: uuid, delete: true },'POST');

    ajaxPromise.then(function(data){

        if(data.success)
        {
            t.closest('.qq-upload-item').remove();
            if(!$('#uploaded-list li').length){
                $('#uploaded-list').fadeOut(200);
            }
        }

    },handleErrorFunc)

    return false;
})


$(document).on('change','.city-dropdown select', function(){


    if($('#delivery-type-main').length) {
        if($(this).val() == 2) {
            $(this).parents('.main-row').find('.col-md-12').removeClass('col-md-12').addClass('col-md-6')
            $('.target-dropdown').removeClass('d-none')
        } else {
            $(this).parents('.main-row').find('.col-md-6').removeClass('col-md-6').addClass('col-md-12')
            $('.target-dropdown').addClass('d-none')
        }

        return false;
    }

    if($(this).val() == 2) {
        $(this).parents('.main-row').find('.col-md-6').removeClass('col-md-6').addClass('col-md-4')
        $('.target-dropdown').removeClass('d-none')
    } else {
        $(this).parents('.main-row').find('.col-md-4').removeClass('col-md-4').addClass('col-md-6')
        $('.target-dropdown').addClass('d-none')
    }
})

$(document).on('click','.photo-icon', function(){
    $('#change-img').trigger('click')
})

$(document).on('change','#change-img', function(){

    setTimeout(function(){
        if($('.field-change-img').hasClass('has-error')) {
            showNotification($('.field-change-img .help-block').text(), 'error')
            return false;
        }
        previewImg(this);
    }.bind(this),200)
})


const previewImg = function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.settings_img img').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$(document).on('change','.ticket-file-input',function(e){
    $('.ticket-choose-file').html(this.files.length + ' fayl seçilib')
})


const calculateTariff = function() {
    var country_el = $('#calculator-country :selected');
    var tariff_list = $.parseJSON(country_el.attr('data-price'));

    var weight_el       =  $('#calculator-weight-type').val();
    var actual_weight   = parseFloat( $('#calculator-weight-value').val() );
    var delivery_type   = $('#calculator-delivery-type').val();
    var actual_weight   = !isNaN(actual_weight)  ? actual_weight : 0;
    var actual_weight   = weight_el == 'kq' ? actual_weight : actual_weight / 1000;
    var width           = parseFloat( $('#calculator-width').val() )
    var height          = parseFloat( $('#calculator-height').val() )
    var length          = parseFloat( $('#calculator-length').val() )
    var volume_weight   = 0;
    var currency        = country_el.attr('data-currency');

    if(!isNaN(width) && !isNaN(height) && !isNaN(length))
    {
        volume_weight =  (width * height * length / 6000) ;
    }


    if(country_el.val() == 2 && ( width >= 60 || height >= 60 || length >= 60 ) && volume_weight > actual_weight) {
        actual_weight = volume_weight;
    } else if(country_el.val() == 1 && ( width >= 80 || height >= 80 || length >= 80 ) && volume_weight > actual_weight) {
        actual_weight = volume_weight;
    } else if( country_el.val() == 3  && ( ( volume_weight - actual_weight )  >=15 ) ) {
        actual_weight = volume_weight;
    }

    if(!actual_weight) {
        actual_weight = volume_weight;
    }

    var price = 0;

    var options = {
        useEasing: false,
        useGrouping: true,
        separator: '',
        decimal: '.',
    };

    tariff_list.forEach(function(tariff) {

        if(actual_weight !=0 && actual_weight >= tariff.from_weight && actual_weight <= tariff.to_weight)
        {
            if(parseFloat(tariff.discounted_price) > 0 && $('#calculator-parcel-type').val() != 'liquid') {
                var t_price = tariff.discounted_price
            } else {
                var t_price = $('#calculator-parcel-type').val() === 'liquid' ? tariff.liquid_price : tariff.price
            }

            if(delivery_type == 'address') {
                t_price += tariff.delivery_to_address_add_price;
            }

            if(tariff.to_weight > 1) {
                t_price = t_price * actual_weight;
            }

            var countUp = new CountUp('calculator-result-amount', 0, t_price, 2, 0.3, options);
            countUp.start();
            return false;

        } else if(actual_weight !=0 && actual_weight >= tariff.from_weight && tariff.to_weight == 0) {

            if(parseFloat(tariff.discounted_price) > 0 && $('#calculator-parcel-type').val() != 'liquid') {
                var t_price = tariff.discounted_price
            } else {
                var t_price = $('#calculator-parcel-type').val() === 'liquid' ? tariff.liquid_price : tariff.price
            }

            if(delivery_type == 'address') {
                t_price += tariff.delivery_to_address_add_price;
            }

            var w_price = actual_weight*t_price;

            if(delivery_type == 'address') {
                w_price += tariff.delivery_to_address_add_price;
            }

            var countUp = new CountUp('calculator-result-amount', 0, w_price, 2, 0.3, options);
            countUp.start();
            return false;
        }

    })
}

$(document).on('click','.calc_btn button', function() {
    calculateTariff();
})

$(document).on('change','#calculator-country,#calculator-parcel-type,#calculator-weight-type,#calculator-delivery-type', function() {

    var currency = $('#calculator-country :selected').attr('data-currency');

    if(currency == '$')
    {
        $('#calculator-currency').html(currency).insertBefore('#calculator-result-amount')
    } else {
        $('#calculator-currency').html(currency).insertAfter('#calculator-result-amount')
    }

    calculateTariff();
})



$(document).on('change','#parcel-country_id input', function(){
    var t = $(this);

    var country_id = t.val();

    var ajaxPromise = sendAjax( $('#parcel-country_id').attr('data-params-url') ,{ country_id: country_id },'GET');

    ajaxPromise.then(function(data){

        if(data.success)
        {
            $('#parcel-service_id').html(data.response.services)
            $('#parcel-store_name').html(data.response.stores)

            $("#parcel-store_name").select2({
                tags: true,
                minimumResultsForSearch: 10
            })
        }

    },handleErrorFunc)
})



$(document).on('change', '.p-price,.p-count,.p-cargo-price', function(){
    calculateLinksPrice()
})


if($('.calculate-order-price').length) {
    calculateLinksPrice()
}


const getCartCount = function()
{

    var ajaxPromise = sendAjax('/account/get-basket-count',{},'GET');

    ajaxPromise.then(function(data)
    {
       if(data.success)
       {
            $('.basket').attr('data-txt',data.response)
       }

    },handleErrorFunc)
}

if($('.logged-user').length) {
    getCartCount()
}



$(document).on('change','.basket-product-check', function(){
    var t = $(this);

    var total = 0;

    var currency = $('.basket-main').attr('data-currency')

    $('.basket-main input:not(#check-all-input,#agreement):checked').each(function(){
        total += parseFloat($(this).parents('.b-item').find('.total-amount-td').attr('data-price'));
    })

    if(currency == '$')
    {
        t.parents('form').find('.sum-amount').html('$'+total.toFixed(2))
    } else {
        t.parents('form').find('.sum-amount').html(total.toFixed(2) + currency)
    }
})

const callPopover = function() {
    if($('.popover-el').length) {
        $(".popover-el").popover({
        container: "body",
        html: true,
        template: '<div class="popover popover-td-last popover-sp"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
      })
    }
}

callPopover();


$(document).on('change', '.checkbox-all input', function(){
    var t = $(this)
    if(t.is(':checked')) {
        $('table tbody input[type="checkbox"]').prop('checked', true).trigger('change')
    } else {
        $('table tbody input[type="checkbox"]').prop('checked', false).trigger('change')
    }
})


$(document).on('click','.m-notify-btn', function(){
    showNotification($(this).attr('data-message'), 'error')
    return false;
})


$(document).on('keyup','.p-link', function(){

    var url = $(this).val()

    var p = $(this).parents('.order_me_card');

    var ajaxPromise = sendAjax('/account/fetch-url',{'url': url},'GET');

    p.addClass('loading');

    ajaxPromise.then(function(data){

        console.log(data)

        if(data.success) {
            p.find('.p-price').val(data.response.price)
            p.find('.p-title').val(data.response.title)
            p.find('.p-note').val(data.response.category)
            p.find('.p-img').val(data.response.img)
            calculateLinksPrice();
        }
        p.removeClass('loading');

    },handleErrorFunc)
})


function calculateLinksPrice()
{
    var total_price = 0;
    var form        = $('#links-form');
    var percent     = parseFloat( form.attr('data-percent') )
    var currency    = form.attr('data-currency')

    var total_price = 0;
    var p_total = 0;

    $('.order_me_card').each(function(i,t)
    {
        var product_price = parseFloat( $(t).find('.p-price').val() );
        var product_count =  parseInt( $(t).find('.p-count').val() ) ;
        var cargo_price =  parseFloat( $(t).find('.p-cargo-price').val() ) ;

        p_total += product_price * product_count + cargo_price;;
    })

    $('.order_me_card').each(function(i,t)
    {
        var product_price = parseFloat( $(t).find('.p-price').val() );
        var product_count =  parseInt( $(t).find('.p-count').val() ) ;
        var cargo_price =  parseFloat( $(t).find('.p-cargo-price').val() ) ;

        if(!isNaN(product_price) && !isNaN(product_count))
        {
            var product_total_price = product_price * product_count + cargo_price;

            if(!isNaN(percent)) {

                if(p_total <= 777) {
                    product_total_price =  product_total_price;
                } else {
                    product_total_price =  product_total_price + product_total_price * percent /100;
                }

                //product_total_price =  product_total_price + product_total_price * percent /100;
            }

            console.log(product_total_price)

            $(t).find('.total-price').val(product_total_price.toFixed(2) +  currency)

            total_price += product_total_price;
        }
    })

    if(p_total <= 777) {
        $('.kommisiya p').html('0%');
        $('.urgent-order-price').html('2$');
        total_price = p_total;
    } else {
        $('.kommisiya p').html('5%');
        $('.urgent-order-price').html('2$');
    }

    // $('.kommisiya p').html('5%');
    // $('.urgent-order-price').html('2$');

    $('#total-amount').html( total_price.toFixed(2)  + currency )
}

$(document).on('change','.balans_table tbody input[type="checkbox"]', function(){
    calculateCheckDebts();
})

const calculateCheckDebts = function() {
    var amount = 0;

    $('.balans_table tbody tr input[type="checkbox"]:checked').each(function(i,el) {
        amount += parseFloat($(el).attr('data-amount'))
    })

    $('.debt-amount').html(amount.toFixed(2))
}

if($('.balans_table tbody input[type="checkbox"]').length) {
    calculateCheckDebts()
}

$(document).on('change','#urgent-order', function(){
    if($(this).is(':checked')) {
        showNotification($(this).attr('data-notify'), 'notify')
    }
})

$(document).on('click','.delivery-tab-nav a',function() {

    var index = $(this).parent().index();

    console.log(index)
    $('.delivery-tab-content').hide();
    $('.delivery-tab-nav a').removeClass('active');

    $('.tarif_tab').each(function() {
        $(this).find('.delivery-tab-content:eq('+index+')').removeClass('active');
        $(this).find('.delivery-tab-content:eq('+index+')').show();
    })

    $($(this).attr('href')).fadeIn();
    $(this).addClass('active');
    return false;
})

// $(document).on('keyup','.convert-currency input', function(){
//     var amount = ( $('.convert-currency input').val().replace(',','.') / $('.convert-currency').attr('data-rate') ).toFixed(2)
//     $('.currency-conversion-amount').text(amount)
// })


$(document).on('click','.branch-select-btn',function() {
    window.top.location = $('#delivery-type input:checked').attr('data-url')
})

$(document).on('change','#delivery-type-main input',function() {
    $('.delivery-tab-content').removeClass('active')

    if($('#delivery-type-main input:checked').val() == 0) {
        $('#delivery-to-branch').addClass('active')
    } else {
        $('#delivery-to-address').addClass('active')
    }
})


$(window).load(function() {

    if($('.youtube-videos').length)
    {
        setTimeout(function(){
            var ajaxPromise = sendAjax('/get-videos.html',{},'GET');
            ajaxPromise.then(function(data) {
                if(data.success) {
                    $('.yt-slider').html(data.response);
                    $('.yt-slider-carousel').owlCarousel({
                        margin: 10,
                        loop: false,
                        nav: false,
                        autoWidth:true,
                        items: 3,
                    });

                } else {
                    $('.yt-section').hide();
                }

            },handleErrorFunc)
        },2000)
    }
})
