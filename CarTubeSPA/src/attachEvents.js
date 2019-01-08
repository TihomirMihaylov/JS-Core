function showHideLinks(){
    hideAllLinks();

    if(sessionStorage.getItem('authToken')){
        $('#linkAllListings').show();
        $('#linkMyListings').show();
        $('#linkCreate').show();
        $('#profile > a').first().text('Welcome, ' + sessionStorage.getItem('username'));
        $('#profile').show();
        $('#welcome-container > h2').hide();
        $('#button-div').hide();
    } else{
        $('#welcome-container > h2').show();
        $('#button-div').show();
    }
}

function showHomeView(){
    hideAllViews();
    showHideLinks();
    if(sessionStorage.getItem('authToken')){
        renderAllListings();
    } else{
        $('#main').show();
    }
}

function hideAllViews(){
    $('#container > div').hide();
    $('div.footer').show();
}

function hideAllLinks(){
    $('#linkAllListings').hide();
    $('#linkMyListings').hide();
    $('#linkCreate').hide();
    $('#profile').hide();
}

function attachLinkEvents(){
    $('#linkHome').on('click', function(){
        showHomeView();
    });

    $('#linkRegister').on('click', function(){
        hideAllViews();
        $('#register').show();
    });

    $('#btnRegister').on('click', function(){
        hideAllViews();
        $('#register').show();
    });

    $('#linkLogin').on('click', function(){
        hideAllViews();
        $('#login').show();
    });

    $('#btnLogin').on('click', function(){
        hideAllViews();
        $('#login').show();
    });

    $('#linkAllListings').on('click', function(){
        hideAllViews();
        renderAllListings();
    });

    $('#linkMyListings').on('click', function(){
        hideAllViews();
        renderMyListings();
    });

    $('#linkCreate').on('click', function(){
        hideAllViews();
        $('#create-listing').show();
    });
}