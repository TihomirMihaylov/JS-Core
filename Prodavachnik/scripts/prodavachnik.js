function startApp() {
    $('header').find('a').show();

    function showView(view){
        $('section').hide();
        switch(view){
            case 'home': $('#viewHome').show(); break;
            case 'login': $('#viewLogin').show(); break;
            case 'register': $('#viewRegister').show(); break;
            case 'ads': 
                $('#viewAds').show(); 
                loadAds();
                break;
            case 'create': $('#viewCreateAd').show(); break;
            case 'edit': $('#viewEditAd').show(); break;
            case 'details': $('#viewDetailsAd').show(); break;
        }
    }


    //Attach event listeners
    $('#linkHome').click(() => showView('home'));
    $('#linkListAds').click(() => showView('ads'));
    $('#linkLogin').click(() => showView('login'));
    $('#linkRegister').click(() => showView('register'));
    $('#linkCreateAd').click(() => showView('create'));
    $('#linkLogout').click(logout)

    $('#buttonLoginUser').click(login); //Ако беше submit бутон трябва да му кажем preventDefault иначе страницата ще се рифрешне  
    $('#buttonRegisterUser').click(register);
    $('#buttonCreateAd').click(createAd);


    //Notifications
    $(document).on({
        ajaxStart: () => $('#loadingBox').show(),
        ajaxStop: () => $('#loadingBox').fadeOut(),
    })

    $('#infoBox').click((event) => $(event.target).hide());
    $('#errorBox').click((event) => $(event.target).hide());

    function showInfo(message){
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(() => $('#infoBox').fadeOut(), 3000);
    }

    function showError(message){
        $('#errorBox').text(message);
        $('#errorBox').show();
    }

    function handleError(error){
        showError(error.responseJSON.description);

    }


    let requester = (() => { //Тая простотия повече ме убърква отколкото да помага. Има нещо дето не работи. Заявките ще си ги пиша директно във функциите
        const baseUrl = 'https://baas.kinvey.com/';
        const appKey = 'kid_r1p7ZF3Vm';
        const appSecret = 'ab5338b7d3b4472393f38cac9b450f34';

        function makeAuth(type){
            if(type === 'basic'){
                return 'Basic ' + btoa(appKey + ':' + appSecret);
            } else{
                return 'Kinvey ' + localStorage.getItem('authToken');
            }
        }
    
        function makeRequest(method, module, url, auth){
            return {
                method,
                url: baseUrl + module + '/' + appKey + '/' + url,
                headers: {
                    'Authorization': makeAuth(auth)
                }
            }
        }
    
        function get(module, url, auth){
            return $.ajax(makeRequest('GET', module, url, auth));
        }
    
        function post(module, url, data, auth){
            let req = makeRequest('POST', module, url, auth);
            req.data = JSON.stringify(data);
            req.headers['Content-Type'] = 'application/json';
            return $.ajax(req);         
        }
    
        function update(module, url, data, auth){
            let req = makeRequest('PUT', module, url, auth);
            req.data = JSON.stringify(data);
            return $.ajax(req);         
        }
    
        function remove(module, url, auth){
            let req = makeRequest('DELETE', module, url, auth);
            return $.ajax(req);  
        }

        return {get, post , update, remove}
    }) ();

    
    if(sessionStorage.getItem('authToken') !== null && sessionStorage.getItem('username') !== null){
        userLoggedIn();
    } else{
        userLoggedOut();
    }
    showView('home');


    function userLoggedIn(){
        $('#loggedInUser').text(`Welcome, ${sessionStorage.getItem('username')}!`);
        $('#loggedInUser').show();
        $('#linkLogin').hide();
        $('#linkRegister').hide();
        $('#linkLogout').show();
        $('#linkListAds').show();
        $('#linkCreateAd').show();
        showView('ads');
    }

    function userLoggedOut(){
        $('#loggedInUser').text('');
        $('#loggedInUser').hide();
        $('#linkLogin').show();
        $('#linkRegister').show();
        $('#linkLogout').hide();
        $('#linkListAds').hide();
        $('#linkCreateAd').hide();
        sessionStorage.clear()
        showView('home');
    }

    function saveSession(data){
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('id', data._id);
        sessionStorage.setItem('authToken', data._kmd.authtoken);
        userLoggedIn();
    }

    async function login(){
        let form = $('#formLogin');
        let username = form.find('input[name="username"]').val();
        let password = form.find('input[name="passwd"]').val();

        try {
            let res = await requester.post('user','login', {username, password}, 'basic');
            saveSession(res);
            userLoggedIn();
            form.trigger('reset');
            showInfo('Login successful!');
        } catch (error) {
            handleError(error);
        }
    }

    async function register(){
        let form = $('#formRegister');
        let username = form.find('input[name="username"]').val();
        let password = form.find('input[name="passwd"]').val();

        try {
            let res = await requester.post('user','', {username, password}, 'basic');
            saveSession(res);
            userLoggedIn();
            form.trigger('reset');
            showInfo('Registration successful!');
        } catch (error) {
            handleError(error);          
        }
    }

    async function logout(){
        try {
            //let res = await requester.post('user','_logout', {authtoken: sessionStorage.getItem('authToken')}); // Тука нещо не сработи
            let res = await $.ajax({
                method: 'POST',
                url: 'https://baas.kinvey.com/user/kid_r1p7ZF3Vm/_logout', 
                headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')}
            });

            userLoggedOut();
            showInfo('Logout successful!')
        } catch (error) {
            handleError(error);           
        }
    }

    async function loadAds(){
        let data = await $.ajax({
            method: 'GET',
            url: 'https://baas.kinvey.com/appdata/kid_r1p7ZF3Vm/adverts', 
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')}
        });

        $('#ads > table tr').each((index, element) => {
            if(index > 0){ //Не искам да махам първия ред (заглавния)
                $(element).remove()
            }
        })

        if(data.length === 0){
            $('#ads').append('<p>No ads in database</p>');
            return;
        }

        for (const ad of data) {
            let tr = $(`<tr><td>${ad.title}</td><td>${ad.publisher}</td><td>${ad.description}</td><td>${Number(ad.price).toFixed(2)}</td><td>${ad.date}</td>`);
            let td = $('<td>');
            let readMoreBtn = $('<a href="#">[Read more]</a>');
            readMoreBtn.click(() => displayAdvert(ad))
            td.append(readMoreBtn).append(' ');
            if(ad._acl.creator === sessionStorage.getItem('id')){
                let delBtn = $('<a href="#">[Delete]</a>');
                delBtn.click(() => deleteAd(ad._id));
                let editBtn = $('<a href="#">[Edit]</a>');
                editBtn.click(() => loadAdForEditting(ad));
                td.append(delBtn).append(' ').append(editBtn);
            }
            
            tr.append(td);
            $('#ads > table').append(tr);
        }
    }

    async function createAd(){
        let form = $('#formCreateAd');
        let title = form.find('input[name="title"]').val();
        let description = form.find('textarea[name="description"]').val();
        let price = Number(form.find('input[name="price"]').val());
        let imageUrl = form.find('input[name="image"]').val();
        let date = (new Date()).toString('yyyy-MM-dd');
        let publisher = sessionStorage.getItem('username');
        if(title.length === 0 ){
            showError('Title cannot be empty!');
            return;
        }

        let newAd = {title, description, price, imageUrl, date, publisher};
        $.ajax({
            method: 'POST',
            url: 'https://baas.kinvey.com/appdata/kid_r1p7ZF3Vm/adverts', 
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')},
            data: newAd
        }).then((result) => {
            showView('ads');
            form.trigger('reset');
            showInfo('Add created successfully!');
        }).catch((err) => {
            handleError(err);
        });
    }

    async function deleteAd(id){
        $.ajax({
            method: 'DELETE',
            url: 'https://baas.kinvey.com/appdata/kid_r1p7ZF3Vm/adverts/' + id, 
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')}
        }).then((result) => {
            showView('ads');
            showInfo('Ad deleted!');
        }).catch((err) => {
            handleError(err);
        });
    }

    function loadAdForEditting(ad){
        let form = $('#formEditAd');
        form.find('input[name="title"]').val(ad.title);
        form.find('textarea[name="description"]').val(ad.description);
        form.find('input[name="price"]').val(Number(ad.price));
        form.find('input[name="image"]').val(ad.imageUrl);
        form.find('#buttonEditAd').click(() => editAd(ad._id, ad.date, ad.publisher));
        showView('edit');
    }

    async function editAd(id, date, publisher){
        let form = $('#formEditAd');
        let title = form.find('input[name="title"]').val();
        let description = form.find('textarea[name="description"]').val();
        let price = form.find('input[name="price"]').val();
        let imageUrl = form.find('input[name="image"]').val();

        if(title.length === 0 ){
            showError('Title cannot be empty!');
            return;
        }

        let edittedAd = {title, description, price, imageUrl, date, publisher};
        $.ajax({
            method: 'PUT',
            url: 'https://baas.kinvey.com/appdata/kid_r1p7ZF3Vm/adverts/' + id, 
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')},
            data: edittedAd
        }).then((result) => {
            showView('ads');
            showInfo('Ad editted!');
        }).catch((err) => {
            handleError(err);
        });
    }

    function displayAdvert(ad){
        showView('details');
        $('#viewDetailsAd').empty();
        let picDiv = $(`<div><img src="${ad.imageUrl}"></div>`);
        let adBody = $('<div>').append(
            picDiv,
            $('<br>'),
            $('<label>').text('Title: '),
            $('<h1>').text(ad.title),
            $('<label>').text('Description: '),
            $('<h1>').text(ad.description),            
            $('<label>').text('Publisher: '),
            $('<h1>').text(ad.publisher),
            $('<label>').text('Date: '),
            $('<h1>').text(ad.date));

        $('#viewDetailsAd').append(adBody);
    }
}