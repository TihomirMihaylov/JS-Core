function attachButtonEvents(){ 
    $('#register > form').on('submit', function(event){ 
        event.preventDefault();
        let username = $('#register > form > div > input[name=username]').val();
        let password = $('#register > form > div > input[name=password]').val();
        let repeatPass = $('#register > form > div > input[name=repeatPass]').val();
        
        //Validations
        if(!(/[A-Za-z]{3,}/.test(username))){
            showInfo('Username must be at least 3 characters long and contain only English alphabet letters!');
        } else if(!(/[A-Za-z0-9]{6,}/.test(password)) || !(/[A-Za-z0-9]{6,}/.test(repeatPass))){
            showInfo('Passwords must be at least 6 characters long and contain only English alphabet letters or numbers!');
        } else if(password !== repeatPass){
            showInfo('Passwords do not match!');
        }else {
            kinveyRequester.registerUser(username, password);
        }
    })


    $('#login > form').on('submit', function(event){
        event.preventDefault();
        let username = $('#login > form > div > input[name=username]').val();
        let password = $('#login > form > div > input[name=password]').val();

        //Validations
        if(!(/[A-Za-z]{3,}/.test(username))){
            showInfo('Username must be at least 3 characters long and contain only English alphabet letters!');
        } else if(!(/[A-Za-z0-9]{6,}/.test(password))){
            showInfo('Password must be at least 6 characters long and contain only English alphabet letters or numbers!');
        }else {
            kinveyRequester.loginUser(username, password);
        }
    })

    $('#linkLogout').on('click', function(){
        kinveyRequester.logoutUser()
    });

    $('#create-listing > form').on('submit', function(event){
        event.preventDefault();
        let title = $('#create-listing > form > div > input[name=title]').val();
        let description = $('#create-listing > form > div > input[name=description]').val();
        let brand = $('#create-listing > form > div > input[name=brand]').val();
        let model = $('#create-listing > form > div > input[name=model]').val();
        let year = $('#create-listing > form > div > input[name=year]').val();
        let imageUrl = $('#create-listing > form > div > input[name=imageUrl]').val();
        let fuel = $('#create-listing > form > div > input[name=fuelType]').val();
        let price =Number($('#create-listing > form > div > input[name=price]').val());
        let seller = sessionStorage.getItem('username');

        //Validations
        if(title === '' || title.length > 33){
            showInfo('Title cannot be ampty and cannot exceed 33 cahracters');
        } else if(description.length < 30 || description.length > 450){
            showInfo('Description must be between 30 and 450 cahracters');
        } else if(brand === '' || brand.length > 11){
            showInfo('Brand cannot be ampty and cannot exceed 11 cahracters');
        } else if(fuel === '' || fuel.length > 11){
            showInfo('Fuel type cannot me ampty and cannot exceed 11 cahracters');
        } else if(model === '' || model.length > 11){
            showInfo('Model cannot be ampty and cannot exceed 11 cahracters');
        } else if( year.length !== 4){
            showInfo('Year must be 4 characters long');
        } else if(price > 1000000){
            showInfo('Maximum price is $1 million');
        } else if(!imageUrl.startsWith('http')){
            showInfo('Invalid URL');
        } else if(imageUrl === ''){
            showInfo('URL cannot be empty');
        } else if(price === 0){
            showInfo('Price cannot be empty');
        } else{
            kinveyRequester.postListing(brand, description, fuel, imageUrl, model, price, seller, title, year);
        }
    });

    $('#edit-listing > form').on('submit', function(event){
        event.preventDefault();        
        let carId = $('#edit-listing > form > div > input[name=carId]').val();
        let title = $('#edit-listing > form > div > input[name=title]').val();
        let description = $('#edit-listing > form > div > input[name=description]').val();
        let brand = $('#edit-listing > form > div > input[name=brand]').val();
        let model = $('#edit-listing > form > div > input[name=model]').val();
        let year = $('#edit-listing > form > div > input[name=year]').val();
        let imageUrl = $('#edit-listing > form > div > input[name=imageUrl]').val();
        let fuel = $('#edit-listing > form > div > input[name=fuelType]').val();
        let price = $('#edit-listing > form > div > input[name=price]').val();
        let seller = sessionStorage.getItem('username');

        //Validations
        if(title === '' || title.length > 33){
            showInfo('Title cannot be ampty and cannot exceed 33 cahracters');
        } else if(description.length < 30 || description.length > 450){
            showInfo('Description must be between 30 and 450 cahracters');
        } else if(brand === '' || brand.length > 11){
            showInfo('Brand cannot be ampty and cannot exceed 11 cahracters');
        } else if(fuel === '' || fuel.length > 11){
            showInfo('Fuel type cannot me ampty and cannot exceed 11 cahracters');
        } else if(model === '' || model.length > 11){
            showInfo('Model cannot be ampty and cannot exceed 11 cahracters');
        } else if( year.length !== 4){
            showInfo('Year must be 4 characters long');
        } else if(price > 1000000){
            showInfo('Maximum price is $1 million');
        } else if(!imageUrl.startsWith('http')){
            showInfo('Invalid URL');
        } else if(imageUrl === ''){
            showInfo('URL cannot be empty');
        } else if(price === 0){
            showInfo('Price cannot be empty');
        } else{
            kinveyRequester.editListing(carId, brand, description, fuel, imageUrl, model, price, seller, title, year);
        }
    });
}