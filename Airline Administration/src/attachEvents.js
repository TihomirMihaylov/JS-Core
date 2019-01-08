function showHideLinks(){
    hideAllLinks();
    if(sessionStorage.getItem('authToken')){
        $('#linkHome').show();
        $('#linkFlights').show();
        $('#linkLogout').show();
        $('#linkAdd').show();
    } else{
        $('#linkLogin').show();
        $('#linkRegister').show();
    }
}

async function showHomeView(){
    $('#linkLogout > span').text('Welcome, ' + sessionStorage.getItem('username') + '!')
    hideAllViews();
    $('#viewCatalog > div > a').remove();
    if(sessionStorage.getItem('username')){
        let flights = await kinveyRequester.getAllPublicFlight();
        renderHomeView(flights);
        $('#viewCatalog').show();
    }
}

function hideAllViews(){
    $('#container > section').hide();
}

function hideAllLinks(){
    $('#linkFlights').hide();
    $('#linkLogin').hide();
    $('#linkRegister').hide();
    $('#linkLogout').hide();
    $('#linkAdd').hide();
}

function attachLinkEvents(){ //Дефолтното поведение на линка е да ни пренасочи. Вариантите са два: event.preventDefault() или href="#"
    $('#linkHome').on('click', async function(){
        hideAllViews();
        let flights = await kinveyRequester.getAllPublicFlight();
        renderHomeView(flights);
        $('#viewCatalog').show();
    });
    $('#linkFlights').on('click', async function(){
        hideAllViews();
        let flights = await kinveyRequester.getMyFlights();
        renderMyFlights(flights);
        $('#viewMyFlights').show();
    });
    $('#linkLogin').on('click', function(){
        hideAllViews();
        $('#viewLogin').show();
    });
    $('#linkRegister').on('click', function(){
        hideAllViews();
        $('#viewRegister').show();
    });
    $('#linkAdd').on('click', function(){
        hideAllViews();
        $('#viewAddFlight').show();
    });
}