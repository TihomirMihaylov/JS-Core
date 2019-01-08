const kinveyRequester = (function () {

    const BASE_URL = 'https://baas.kinvey.com/'
    const APP_KEY = 'kid_B1fcX3pBm';
    const APP_SECRET = 'cf4e4cbf3f504406a1d4a666e58b9247';
    const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)}

    function registerUser(username, password) {
        $.ajax({
            method: "POST",
            url: BASE_URL + 'user/' + APP_KEY + '/',
            headers: AUTH_HEADERS,
            data: {username, password}
        }).then(function (res) {
            signInUser(res, 'User registration successful.');
            showHideLinks()
            $('#linkAllListings').trigger('click');
            $('#register > form').trigger('reset');
        }).catch(handleError)
    }

    function loginUser(username, password) {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/' + APP_KEY + '/login',
            headers: AUTH_HEADERS,
            data: {username, password}
        }).then(function (res) {
            signInUser(res, 'Login successful.');
            showHomeView();
            $('#login > form').trigger('reset');
        }).catch(handleError)
    }

    function logoutUser() {
        $.ajax({
            method: 'POST',
            url: BASE_URL +  'user/' + APP_KEY + '/_logout',
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')}
        }).catch(function (err){
            console.log(err);
        })

        sessionStorage.clear()
        showInfo("Logout successful");
        showHideLinks();
        $('#btnLogin').trigger('click');
    }

    //CREATE
    function postListing(brand, description, fuel, imageUrl, model, price, seller, title, year) {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'appdata/' + APP_KEY +  '/' + 'cars',
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')},
            data: {brand, description, fuel, imageUrl, model, price, seller, title, year}
        }).then(function () {
            showInfo("Listing created.");
            $('#create-listing > form').trigger("reset");
            $('#linkAllListings').trigger('click');
        }).catch(handleError)
    }

    //READ ALL
    async function getAllListingInDb() { 
        return await $.ajax({
            method: 'GET',
            url: BASE_URL + 'appdata/' + APP_KEY + '/cars?query={}&sort={"_kmd.ect": -1}',
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')},
        }).then(function (res) {
            return res;
        }).catch(handleError)
    }

    async function getMyListings() {
        return await $.ajax({
            method: 'GET',
            url: BASE_URL + 'appdata/' + APP_KEY + `/cars?query={"seller":"${sessionStorage.getItem('username')}"}&sort={"_kmd.ect": -1}`,
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')},
        }).then(function (res) {
            return res;
        }).catch(handleError)
    }

    //DELETE
    function removeListing(id) {
        $.ajax({
            method: 'DELETE',
            url: BASE_URL + 'appdata/' + APP_KEY +  '/' + 'cars' + '/' + id,
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')},
        }).then(function () {
            showInfo("Listing deleted.");
            $("#linkAllListings").trigger('click');
        }).catch(handleError)
    }

    //EDIT
    function editListing(id, brand, description, fuel, imageUrl, model, price, seller, title, year) {
        $.ajax({
            method: 'PUT',
            url: BASE_URL + 'appdata/' + APP_KEY + '/' + 'cars' + '/' + id,
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')},
            data: {brand, description, fuel, imageUrl, model, price, seller, title, year}
        }).then(function (res) {
            showInfo(`Listing ${title} updated.`);
            $("#linkAllListings").trigger('click');
        }).catch(handleError)
    }

    function signInUser(res, message) {
        saveUserSession(res);
        showInfo(message);
    }

    function saveUserSession(userInfo) {
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
        sessionStorage.setItem('username', userInfo.username);
        sessionStorage.setItem('userId', userInfo._id);
    }

    function handleError(err) {
        showError(err.responseJSON.description);
    }

    return {registerUser, loginUser, logoutUser, postListing, getAllListingInDb, editListing, removeListing, getMyListings}
}())