const DB = {

    currentUser: "",


    inStart: function () {
        if (localStorage.getItem('users') == null) {
            localStorage.setItem('users', '[]');
            localStorage.setItem('currentUsers', '[]');
            localStorage.setItem('numberOfUsers', '0');
        }
    },

    getUser: function (user, password, securityCodeNow) {
        let users = JSON.parse(localStorage.getItem('users'));
        console.log(users);
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === user && users[i].password === password) {
                addSecuretyCode(user, securityCodeNow);
                return users[i];

            }
        }
        throw "user not found";
    },

    getProduct: function (securityCodeNow, productName) {
        checkSecuretyCode(securityCodeNow);
        let allProudct = JSON.parse(localStorage.getItem(DB.currentUser))
        for (let i = 0; i < allProudct.length; i++) {
            if (allProudct[i].name === productName) {
                return allProudct[i];
            }
        }
        //לבדוק שגיאות כתיב 
        throw "product not found"
    },

    getlistProduct: function (securityCodeNow) {
        checkSecuretyCode(securityCodeNow);
        let currentDuobt = JSON.parse(localStorage.getItem(DB.currentUser));
        let list = []
        currentDuobt.forEach(element => {
            list.push(element);
        })
        return list;
    },

    addUser: function (user, securityCodeNow) {
        let users = [];
        users = JSON.parse(localStorage.getItem('users'));
        for (let i = 0; i < localStorage.getItem('numberOfUsers'); i++) {
            if (users[i].email === user.email) {
                throw "exsisting user";
            }
        }
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        let numberOfUsers = localStorage.getItem('numberOfUsers');
        numberOfUsers++;
        localStorage.setItem('numberOfUsers', numberOfUsers);
        localStorage.setItem(user.email, '[]');
        addSecuretyCode(user.email, securityCodeNow)
    },

    addProduct: function (securityCodeNow, product) {
        checkSecuretyCode(securityCodeNow);
        let allProudct = JSON.parse(localStorage.getItem(DB.currentUser));
        for (let i = 0; i < allProudct.length; i++) {
            if (allProudct[i].name === product.name) {
                throw "exsisting product"
            }
        }
        product.sku = product.QuntityInWerehouse + product.price;
        allProudct.push(product);
        localStorage.setItem(DB.currentUser, JSON.stringify(allProudct))
    },

    deleteProduct: function (securityCodeNow, product) {
        checkSecuretyCode(securityCodeNow);
        let allProudct = JSON.parse(localStorage.getItem(DB.currentUser));
        for (let i = 0; i < allProudct.length; i++) {
            if (allProudct[i].name === product) {
                allProudct.splice(i, 1);
                localStorage.setItem(DB.currentUser, JSON.stringify(allProudct))
                return;
            }

        }

    },

    signOut: function (securityCodeNow) {
        let currentUsers = JSON.parse(localStorage.getItem('currentUsers'));
        for (let i = 0; i < currentUsers.length; i++) {
            if(currentUsers[i].securityCode==securityCodeNow){
                currentUsers.splice(i, 1);
            }
        }
        localStorage.setItem('currentUsers', JSON.stringify(currentUsers));
    },

    putProduct: function (securityCodeNow, product, detailes) {
        checkSecuretyCode(securityCodeNow);
        let allProudct = JSON.parse(localStorage.getItem(DB.currentUser));
        for (let i = 0; i < allProudct.length; i++) {
            if (allProudct[i].name === product) {
                allProudct[i].QuntityInWerehouse = detailes.updateQuantity;
                allProudct[i].price=detailes.price;
                localStorage.setItem(DB.currentUser, JSON.stringify(allProudct))
                return;
            }

        }
    }
    ,
}


function addSecuretyCode(user, securityCodeNow) {
    let currentUser = {
        user: user,
        securityCode: securityCodeNow,
    }
    let currentUsers = JSON.parse(localStorage.getItem('currentUsers'));
    currentUsers.push(currentUser);
    localStorage.setItem('currentUsers', JSON.stringify(currentUsers));
}


function checkSecuretyCode(securityCodeNow) {
    let currentUsers = JSON.parse(localStorage.getItem('currentUsers'));
    for (let i = 0; i < currentUsers.length; i++) {
        if (currentUsers[i].securityCode == securityCodeNow) {
            DB.currentUser = currentUsers[i].user;
            return;
        }
    }
    alert("You are a hacker, we won't allow you to break our website")
}
DB.inStart();