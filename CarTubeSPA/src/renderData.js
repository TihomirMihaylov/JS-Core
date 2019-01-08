async function renderAllListings(){
    let mainDiv = $('#listings');
    mainDiv.empty();
    let carsInDb = await kinveyRequester.getAllListingInDb();
    if(carsInDb.length === 0){
        mainDiv.append($('<p class="no-cars">No cars in database.</p>'));
    } else{
        for (const car of carsInDb) {
            let div0 = $('<div class="listing"></div>');
            let title = $('<p></p>');
            title.text(`${car.title}`);
            let image = $(`<img src="${car.imageUrl}">`);
            let brand = $('<h2>');
            brand.text(`Brand: ${car.brand}`);
            let div1 = $('<div class="info"></div>');
            let div1a =   $('<div id="data-info"></div>');
            let seller = $('<h3>');
            seller.text(`Seller: ${car.seller}`)
            let fuel = $('<h3>');
            fuel.text(`Fuel: ${car.fuel}`)
            let year = $('<h3>');
            year.text(`Year: ${car.year}`);
            let price = $('<h3>');
            price.text(`Price: ${car.price} $`);
            let div1b =   $('<div id="data-buttons"></div>');
            let ul = $('<ul>');
            let detailsBtn = $('<li class="action"><a href="#" class="button-carDetails">Details</a></li>');
            detailsBtn.on('click', function(event) {
                event.preventDefault();
                renderDetails(car);
            });
            let editBtn = $('<li class="action"><a href="#" class="button-carDetails">edit</a></li>');
            editBtn.on('click', () => renderEditLising(car));
            let deleteBtn = $('<li class="action"><a href="#" class="button-carDetails">delete</a></li>');
            deleteBtn.on('click', () => kinveyRequester.removeListing(car._id));

            ul.append(detailsBtn);
            if(sessionStorage.getItem('username') === car.seller){
                ul.append(editBtn).append(deleteBtn);
            }

            div1b.append(ul);
            div1a.append(seller).append(fuel).append(year).append(price);
            div1.append(div1a).append(div1b);
            div0.append(title).append(image).append(brand).append(div1);
            mainDiv.append(div0);
        }
    }

    $('#car-listings').show();
}

function renderDetails(car){
    hideAllViews();
    $('div.listing-details').empty();
    let mainDiv = $('<div class="my-listing-details"></div>');
    let title = $('<p id="auto-title"></p>');
    title.text(`${car.title}`);
    let image = $(`<img src="${car.imageUrl}">`);
    let div1 = $('<div class="listing-props"></div>');
    let brand = $('<h2>');
    brand.text(`Brand: ${car.brand}`);
    let model = $('<h3>');
    model.text(`Model: ${car.model}`);
    let year = $('<h3>');
    year.text(`Year: ${car.year}`);
    let fuel = $('<h3>');
    fuel.text(`Fuel: ${car.fuel}`);
    let price = $('<h3>');
    price.text(`Price: ${car.price} $`);
    let div2 = $('<div class="listings-buttons"></div>');
    let editBtn = $('<a href="#" class="button-list">Edit</a>');
    editBtn.on('click', () => renderEditLising(car));
    let deleteBtn = $('<a href="#" class="button-list">Delete</a>');
    deleteBtn.on('click', () => kinveyRequester.removeListing(car._id));
    let p1 = $('<p id="description-title">Description:</p>');
    let p2 = $('<p id="description-para"></p>');
    p2.text(`${car.description}`);
    if(sessionStorage.getItem('username') === car.seller){
        div2.append(editBtn).append(deleteBtn);
    }

    div1.append(brand).append(model).append(year).append(fuel).append(price);
    mainDiv.append(title).append(image).append(div1).append(div2).append(p1).append(p2);
    $('div.listing-details').append(mainDiv);
    $('div.listing-details').show();
}

function renderEditLising(car){
    hideAllViews();
    $('#edit-listing > form > div > input[name=carId]').val(car._id);
    $('#edit-listing > form > div > input[name=title]').val(car.title);
    $('#edit-listing > form > div > input[name=description]').val(car.description);
    $('#edit-listing > form > div > input[name=brand]').val(car.brand);
    $('#edit-listing > form > div > input[name=model]').val(car.model);
    $('#edit-listing > form > div > input[name=year]').val(car.year);
    $('#edit-listing > form > div > input[name=imageUrl]').val(car.imageUrl);
    $('#edit-listing > form > div > input[name=fuelType]').val(car.fuel);
    $('#edit-listing > form > div > input[name=price]').val(car.price);
    $('#edit-listing').show();
}

async function renderMyListings(){
    let mainDiv = $('div.my-listings');
    mainDiv.empty();
    let h1 =$('<h1>My car listings</h1>');
    let div0 = $('<div class="car-listings"></div>');
    let myCarListings = await kinveyRequester.getMyListings();
    if(myCarListings.length === 0){
        div0.append($('<p class="no-cars"> No cars in database.</p>'));
    } else{
        for (const car of myCarListings) {
            let div1 = $('<div class="my-listing"></div>');
            let title = $('<p id="listing-title"></p>');
            title.text(`${car.title}`);
            let image = $(`<img src="${car.imageUrl}">`);
            let div1a = $('<div class="listing-props"></div>');
            let brand = $('<h2>');
            brand.text(`Brand: ${car.brand}`);
            let model = $('<h3>');
            model.text(`Model: ${car.model}`);
            let year = $('<h3>');
            year.text(`Year: ${car.year}`);
            let price = $('<h3>');
            price.text(`Price: ${car.price} $`);
            let div1b = $('<div class="my-listing-buttons"></div>');
            let detailsBtn = $('<a href="#" class="button-list">Details</a>');
            detailsBtn.on('click', () => renderDetails(car));
            let editBtn = $('<a href="#" class="button-list">Edit</a>');
            editBtn.on('click', () => renderEditLising(car));
            let deleteBtn = $('<a href="#" class="button-list">Delete</a>');
            deleteBtn.on('click', () => kinveyRequester.removeListing(car._id));
            
            div1b.append(detailsBtn).append(editBtn).append(deleteBtn);
            div1a.append(brand).append(model).append(year).append(price);
            div1.append(title).append(image).append(div1a).append(div1b);
            div0.append(div1);
        }
    }

    mainDiv.append(h1).append(div0);
    mainDiv.show();
}