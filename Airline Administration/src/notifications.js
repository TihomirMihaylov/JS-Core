$(document).on('ajaxStart', function(){
    $('#loadingBox').show()
})

$(document).on('ajaxStop', function(){
    $('#loadingBox').hide()
})

// $(document).on({
//     ajaxStart: () => $('#loadingBox').show(),
//     ajaxStop: () => $('#loadingBox').fadeOut(),
// })

function showInfo(message){
    $('#infoBox > span').text(message);
    $('#infoBox').show();
    setTimeout(function(){
        $('#infoBox').hide();
    }, 3000);
}

function showError(message){
    $('#errorBox > span').text(message);
    $('#errorBox').show();
}

function attachBoxesEvents(){
    $('#infoBox').on('click', function(){
        $(this).hide();
    })

    $('#errorBox').on('click', function(){
        $(this).hide();
    })
}