function attachButtonEvents(){ //Ивенти, които правят заявка
    $('#formRegister').on('submit', function(event){ //.on('submit'
        event.preventDefault(); //Когато имаме събмит бутон във форма страницата се рифрешва.Ще ни трябва preventDefault
        let username = $('#formRegister > input[name="username"]').val();
        let password = $('#formRegister > input[name="pass"]').val();
        let checkPass = $('#formRegister > input[name="checkPass"]').val();

        //Validations
        if(username.length < 5){
            showInfo('Username should be at least 5 characters long!');
        } else if(password !== checkPass){
            showInfo('Passwords do not match!');
        } else if(password === ''){ 
            showInfo('Password cannot be empty!');            
        } else{
            kinveyRequester.registerUser(username, password);
        }
    })

    $('#formLogin').on('submit', function(event){
        event.preventDefault();
        let username = $('#formLogin > input[name="username"]').val();
        let password = $('#formLogin > input[name="pass"]').val();
        kinveyRequester.loginUser(username, password);
    })

    $('#linkLogout').on('click', function(){
        kinveyRequester.logoutUser()
    });

    $('#formAddFlight').on('submit', function(event){
        event.preventDefault();
        let destination = $('#formAddFlight input[name=destination]').val(); //Може и без кавички [name=destination]
        let origin = $('#formAddFlight input[name=origin]').val();
        let departureDate = $('#formAddFlight input[name=departureDate]').val();
        let departureTime = $('#formAddFlight input[name=departureTime]').val();
        let seats = $('#formAddFlight input[name=seats]').val();
        let cost = $('#formAddFlight input[name=cost]').val();
        let img = $('#formAddFlight input[name=img]').val();
        let isPublic = $('#formAddFlight input[type=checkbox]').is(':checked'); //true/false
       
        //Validations
        if(destination === '' || origin === ''){
            showInfo('Destination and origin cannot be empty!');
        } else if(seats <= 0 || cost <= 0){
            showInfo('Number and cost must be positive integers!');
        } else{
            kinveyRequester.postFlight(destination, origin, departureDate, departureTime, seats, cost, img, isPublic)
        }
    });

    $("#formEditFlight").on('submit', function (event) {
        event.preventDefault();
        let id = $('#viewEditFlight').attr('flightId');
        let destination = $('#formEditFlight input[name=destination]').val(); //Може и без кавички [name=destination]
        let origin = $('#formEditFlight input[name=origin]').val();
        let departureDate = $('#formEditFlight input[name=departureDate]').val();
        let departureTime = $('#formEditFlight input[name=departureTime]').val();
        let seats = $('#formEditFlight input[name=seats]').val();
        let cost = $('#formEditFlight input[name=cost]').val();
        let img = $('#formEditFlight input[name=img]').val();
        let isPublic = $('#formEditFlight input[type=checkbox]').is(':checked'); //true/false
       
        //Validations
        if(destination === '' || origin === ''){
            showInfo('Destination and origin cannot be empty!');
        } else if(seats <= 0 || cost <= 0){
            showInfo('Number and cost must be positive integers!');
        } else{
            kinveyRequester.editFlight(id, destination, origin, departureDate, departureTime, seats, cost, img, isPublic)
        }
    });
}