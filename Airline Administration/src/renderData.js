function renderHomeView(flights){
    hideAllViews();
    $('#viewCatalog > div').empty();
    for (const flight of flights) {
        let a = $('<a href="#" class="added-flight"></a>');
        a.on('click', function(){
            renderDetailsView(flight);
        })

        let img = $(`<img src="${flight.img}" alt="" class="picture-added-flight">`)
        let h3 = $(`<h3>${flight.destination}</h3>`);
        let spans = $(`<span>from ${flight.origin}</span><span>${flight.departureDate}</span>`);
        a.append(img).append(h3).append(spans);
        $('#viewCatalog > div').append(a);
    }
}

function renderDetailsView(flight){
    hideAllViews();
    $('#viewFlightDetails').empty();
    let mainDiv = $('<div class="ticket-area"></div>');
    let div1 = $(`<div class="ticket-area-left"><img src="${flight.img}" alt=""></div>`);
    let div2 = $('<div class="ticket-area-right"></div>');
    let h3 = $(`<h3>${flight.destination}</h3>`);
    let div2a = $(`<div>from ${flight.origin}</div>`);
    let div2b = $(`<div class="data-and-time">${flight.departureDate} ${flight.departureTime}</div>`);
    let div2c = $(`<div>${flight.seats} Seats (${flight.cost} per seat)</div>`); 
    if(sessionStorage.getItem('userId') === flight._acl.creator){
        let editBtn = $('<a href="#" class="edit-flight-detail"></a>');
        editBtn.on('click', function(){
            renderEditView(flight);
        });
        
        div2b.append(editBtn);
    }

    div2.append(h3).append(div2a).append(div2b).append(div2c);
    mainDiv.append(div1).append(div2);
    $('#viewFlightDetails').append(mainDiv);
    $('#viewFlightDetails').show();
}

function renderEditView(flight){
    hideAllViews()
    $('#viewEditFlight').show()
    $('#viewEditFlight').attr('flightId', flight._id)  //Слагам си ИД-то в атрибут в самата форма!!!
    //Само риплейсвам стойностите в полетата 
    $("#formEditFlight input[name=destination]").val(flight.destination)
    $("#formEditFlight input[name=origin]").val(flight.origin)
    $("#formEditFlight input[name=departureDate]").val(flight.departureDate)
    $("#formEditFlight input[name=departureTime]").val(flight.departureTime)
    $("#formEditFlight input[name=seats]").val(Number(flight.seats))
    $("#formEditFlight input[name=cost]").val(Number(flight.cost))
    $("#formEditFlight input[name=img]").val(flight.img)
    $("#formEditFlight input[type=checkbox]").val(flight.isPublic)
}

function renderMyFlights(flights){
    hideAllViews();
    $('#viewMyFlights > div').remove();
    for (const flight of flights) {
        let mainDiv = $('<div class="flight-ticket"></div>')
        let div1 = $(`<div class="flight-left"><img src="${flight.img}" alt=""></div>`);
        let div2 = $('<div class="flight-right">');
        let div2a = $(`<div><h3>${flight.destination}</h3><span>${flight.departureDate}</span></div>`);
        let div2b = $(`<div>from ${flight.origin} <span>${flight.departureTime}</span></div>`);
        let p =$(`<p>55 Seats (${flight.cost}$ per seat) </p>`);
        let delBtn = $('<a href="#" class="remove">REMOVE</a>');
        delBtn.on('click', function(){
            kinveyRequester.removeFlight(flight._id);
        })
        let detailsBtn = $('<a href="#" class="details">Details</a>');
        detailsBtn.on('click', function(){
            renderDetailsView(flight);
        })

        div2.append(div2a).append(div2b).append(p).append(delBtn).append(detailsBtn);
        mainDiv.append(div1).append(div2);
        $('#viewMyFlights').append(mainDiv);
    }

    $('#viewMyFlights').show();
}