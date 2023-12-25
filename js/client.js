let m_name;
let securityCodeClient;
let list;
//כל הפונקציות והפעולות הקשורות במשתמשים
const users = {

    // שמירת פרטי המשתמש החדש ועידכנו כמשתמש נוכחי פעיל
    checkAndSaveSignUp: function (e) {
        let user = {
            name: document.getElementById('nameL').value,
            email: document.getElementById('emailL').value,
            password: document.getElementById('passwordL').value,
        };
        e.preventDefault();
        if (user.name !== "" && user.email !== "" && user.password !== "") {
            const xhrUser = new FXMLHttpRequest();
            xhrUser.f_open('POST', `https://PMTC.co.il/?user`);
            xhrUser.f_setRequestHeader('Content-Type', 'application/json');
            xhrUser.f_onload = function () {
                if (xhrUser.f_status == 200 && xhrUser.f_readyState == 4) {
                    securityCodeClient = xhrUser.f_header.security;
                    m_name = user.name;
                    creatList();
                    storeSPA.template(e);
                }
                else if (xhrUser.f_status == 420) {
                    alert("we could not connect you to the system pleas try again");
                }
                else
                    alert("oppssss.... something went worng");
            }
            xhrUser.f_send(JSON.stringify(user));
        }
    },
    //חיבור המשתמש ועידכונו כמשתמש פעיל
    checkAndSaveLogIn: function (e) {
        e.preventDefault();
        let saveEmail = document.getElementById('emailS').value;
        let savePassword = document.getElementById('passwordS').value;
        if (saveEmail !== '' && savePassword !== '') {
            let xhrGetUser = new FXMLHttpRequest();
            xhrGetUser.f_open('GET', `https://PMTC.co.il/?user/${saveEmail}`);
            xhrGetUser.f_send(JSON.stringify(savePassword));
            xhrGetUser.f_onload = function () {
                if (xhrGetUser.f_status == 200 && xhrGetUser.f_readyState == 4) {
                    let user = JSON.parse(xhrGetUser.f_responseText);
                    securityCodeClient = xhrGetUser.f_header.security
                    m_name = user.name;
                    creatList();
                    storeSPA.template(e);
                } else if (xhrGetUser.f_status == 480) {
                    alert("wrong username or password");
                } else {
                    alert("oppssss.... somthig went worng");
                }
            }
        }

    },
}
const storeSPA = {
    init: function () {
        exitUser();
        window.addEventListener('popstate', storeSPA.history);
        history.replaceState({}, 'entrance', '#entrance');
        storeSPA.showTemplate('entrance')
        storeSPA.entrance();

    },
    remove: function () {
        let main = document.querySelector('main');
        let pageSection = document.getElementById('page');
        if (pageSection)
            pageSection.remove();
    },
    template: function (e) {
        storeSPA.remove();
        let target = e.target.getAttribute('data-target');
        storeSPA.showTemplate(target);
        storeSPA.makeItWork(target);
        storeSPA.name(e);
    },
    makeItWork: function (target) {
        switch (target) {
            case 'entrance':
                storeSPA.entrance();
                break;

            case 'homePage':
                storeSPA.homePage();
                break;

            case 'pageProductUpdate':
                document.getElementById('updatebtn').addEventListener('click', actions.update);
                showProductList();
                let products = document.querySelectorAll(".product").forEach(btn => btn.addEventListener('dblclick', inputProduct));
                document.getElementById('updatebtn').addEventListener('click', actions.update);
                break;

            case 'pageProductdeletion':
                showProductList();
                let product = document.querySelectorAll(".product").forEach(btn => btn.addEventListener('dblclick', inputProduct));
                document.getElementById('deletebtn').addEventListener('click', actions.delete);
                break;

            case 'pageAddungAProduct':
                document.getElementById('addbtn').addEventListener('click', actions.add);
                hideProductList();
                break;

            case 'pageProductSearch':
                document.getElementById('searchbtn').addEventListener('click', actions.search);
                hideProductList();
                break;


        }
    },

    showTemplate: function (target) {
        let main = document.querySelector('body');
        let mewPageSection = document.createElement('section');
        mewPageSection.id = 'page';
        let template = document.getElementById(target);
        mewPageSection.append(template.content.cloneNode(true));
        main.append(mewPageSection);
    },

    entrance: function () {
        document.getElementById('signUp').addEventListener('click', removeRight);
        document.getElementById('signIn').addEventListener('click', removeLeft);
        document.getElementById('logInButton').addEventListener('click', users.checkAndSaveSignUp);
        document.getElementById('signUpButton').addEventListener('click', users.checkAndSaveLogIn);
        document.querySelector('nav').style.display = "none";
    },

    homePage: function () {
        let btnactions = document.querySelectorAll(".btnaction")
        for (let index = 0; index < btnactions.length; index++) {
            btnactions[index].addEventListener('click', storeSPA.template)
        }
        nav();
    },

    name: function (e) {
        currentPage = e.target.getAttribute('data-target');
        history.pushState({}, currentPage, `#${currentPage}`);

    },
    history: function () {
        storeSPA.remove();
        let hash = location.hash.replace('#', '');
        storeSPA.showTemplate(hash);
        storeSPA.makeItWork(hash);
    },

};



//פונקציה המגלה את החלק של ההתחברות
function removeRight() {
    container.classList.add("right-panel-active");
}
//פונקציה המגלה את החלק של ההרשמה 
function removeLeft() {
    container.classList.remove("right-panel-active");
}
function showProductList() {
    let productList = document.getElementById("divProductPlace");
    productList.style.display = "block";
}
function hideProductList() {
    changeColorToRegularColor();
    let productList = document.getElementById("divProductPlace");
    productList.style.display = "none";

}
function nav() {
    document.getElementById("hello").innerText = ` hello ${m_name} `
    document.querySelector('nav').style.display = "block";
    document.getElementById("productList").addEventListener('click', showProductList);
    document.getElementById("close").addEventListener('click', hideProductList);
    document.getElementById('exit').addEventListener('click', exitBtn);
    document.getElementById('newSearch').addEventListener('click', goToHmePage)
}
function exitBtn(e) {
    const xhrDeleteUser = new FXMLHttpRequest();
    xhrDeleteUser.f_open('DELETE', `https://PMTC.co.il/?${securityCodeClient}/user`);
    xhrDeleteUser.f_onload = function () {
        if (xhrDeleteUser.f_status == 200 && xhrDeleteUser.f_readyState == 4) {
            storeSPA.template(e);
        } else {
            alert("oppssss.... somthig went worng");
        }
    }
    xhrDeleteUser.f_send();

}
function exitUser() {
    const xhrDeleteUser = new FXMLHttpRequest();
    xhrDeleteUser.f_open('DELETE', `https://PMTC.co.il/?${securityCodeClient}/user`);
    xhrDeleteUser.f_onload = function () {
        if (xhrDeleteUser.f_status == 200 && xhrDeleteUser.f_readyState == 4) {
        } else {
            alert("oppssss.... somthig went worng");
        }
    }
    xhrDeleteUser.f_send();
}

function inputProduct(e) {
    let text = e.target.getAttribute('data-product');
    changeColors(text);
    document.getElementById('productText').innerHTML = `${text}`
    document.getElementById('productName').value = text;
    console.log(document.getElementById('productName').value);
}
function changeColors(id) {
    changeColorToRegularColor();
    document.getElementById(id).style.background = "#DA582E";
}
function changeColorToRegularColor() {
    document.querySelectorAll(".product").forEach(element => {
        element.style.background = "##ABAE93";
    });
}

function creatList() {
    let listProductPlace = document.getElementById("listProductPlace")
    const xhrList = new FXMLHttpRequest();
    xhrList.f_open('GET', `https://PMTC.co.il/?${securityCodeClient}/products/`);
    xhrList.f_onload = function () {
        if (xhrList.f_status == 200 && xhrList.f_readyState == 4) {
            list = JSON.parse(xhrList.f_responseText);
            innerHTMLList()
        }
    }
    xhrList.f_send();

}
function innerHTMLList() {
    listProductPlace.innerHTML = "";
    list.forEach(element => {
        listProductPlace.insertAdjacentHTML('beforeend', `<li class="product"id="${element.name}" data-product="${element.name}">${element.name}</li>`)
    });
    console.log(list);
    hideProductList();
}
function myfindIndex(productName) {
    for (let i = 0; i < list.length; i++) {
        if (productName == list[i].name) {
            return i;
        }
    }
}

const actions = {
    delete: function (e) {
        e.preventDefault();
        let saveName = document.getElementById('productName');
        if (saveName === null) {
            saveName = e.target.getAttribute('data-product');
        }
        else
            saveName = saveName.value;
        if (saveName !== "") {
            const xhrDelete = new FXMLHttpRequest();
            xhrDelete.f_open('DELETE', `https://PMTC.co.il/?${securityCodeClient}/product/${saveName}`);
            xhrDelete.f_onload = function () {
                if (xhrDelete.f_status == 200 && xhrDelete.f_readyState == 4) {
                    list.splice(myfindIndex(saveName), 1);
                    innerHTMLList();
                    goToHmePage();
                } else {
                    alert("oppssss.... somthig went worng");
                }
            }
            xhrDelete.f_send();
        }
    },
    add: function (e) {
        e.preventDefault();
        let product = {
            name: document.getElementById('addName').value,
            price: document.getElementById('addPrice').value,
            MinimumAmount: document.getElementById('addMinimumAmount').value,
            QuntityInWerehouse: document.getElementById('addQuntityInWerehouse').value,
            ProductDescription: document.getElementById('addProductDescription').value,
        };
        if (product.name !== "" && product.price !== "" && product.QuntityInWerehouse !== "" && product.MinimumAmount !== "" && product.ProductDescription !== "") {
            const xhrAdd = new FXMLHttpRequest();
            xhrAdd.f_open('POST', `https://PMTC.co.il/?${securityCodeClient}`);
            xhrAdd.f_setRequestHeader('Content-Type', 'application/json');
            xhrAdd.f_onload = function () {
                if (xhrAdd.f_status == 200 && xhrAdd.f_readyState == 4) {
                    console.log("a my state is 400");
                    console.log();
                    list.unshift(product);
                    innerHTMLList();
                    goToHmePage();
                } else {
                    alert("oppssss.... somthig went worng");
                }
            }
            xhrAdd.f_send(JSON.stringify(product));
        }
    },
    update: function (e) {
        e.preventDefault();
        let saveName = document.getElementById('productName').value;
        let saveDetails ={
            updateQuantity:document.getElementById('updateQuantity').value,
            price:document.getElementById('updatePrice').value
        } 
        if (saveName !== "") {
            const xhrUpdate = new FXMLHttpRequest();
            xhrUpdate.f_open('PUT', `https://PMTC.co.il/?${securityCodeClient}/product/${saveName}`);
            xhrUpdate.f_onload = function () {
                if (xhrUpdate.f_status == 200 && xhrUpdate.f_readyState == 4) {
                    console.log();
                    let i=myfindIndex(saveName)
                    list[i].QuntityInWerehouse = saveDetails.updateQuantity;
                    list[i].price=saveDetails.price;
                    innerHTMLList();
                    goToHmePage();
                } else {
                    alert("oppssss.... somthig went worng");
                }
            }
            xhrUpdate.f_send(JSON.stringify(saveDetails));

        }
    },

    search: function (e) {
        e.preventDefault();
        let saveName = document.getElementById('ptoductName').value;
        if (saveName !== "") {
            const xhrSearch = new FXMLHttpRequest();
            xhrSearch.f_open('GET', `https://PMTC.co.il/?${securityCodeClient}/product/${saveName}`);
            xhrSearch.f_send();
            xhrSearch.f_onload = function () {

                if (xhrSearch.f_status == 200 && xhrSearch.f_readyState == 4) {
                    let product = JSON.parse(xhrSearch.f_responseText);
                    let found = document.getElementById('found');
                    found.insertAdjacentHTML('beforeend', `<div>name:${product.name}</div><div>price:${product.price}</div><div>SKU:${product.sku}</div><div >minimum amount:${product.MinimumAmount}</div><div >quntity in werehouse:${product.QuntityInWerehouse}</div><div >description:${product.ProductDescription}</div><i id="trash" data-product="${product.name}" class="fa-solid fa-trash"></i><i id="pen" data-product="${product.name}"  data-target="pageProductUpdate"class="fa-solid fa-pen-to-square"></i>`);
                    found.style.display = 'block';
                    document.querySelector('#trash').addEventListener('click', actions.delete);
                    document.querySelector('#pen').addEventListener('click', updateAfterSearch);
                } else if (xhrSearch.f_status == 410) {
                    document.getElementById('notFound').style.display = 'block'
                } else {
                    alert("oppssss.... somthig went worng");
                }
            }
            document.getElementById('searchInput').style.display = 'none'
        }

    }
}

function goToHmePage() {

    storeSPA.remove();
    storeSPA.showTemplate('homePage');
    storeSPA.makeItWork('homePage');
    let currentPage = 'homePage';
    history.pushState({}, currentPage, `#${currentPage}`);
    hideProductList();
}
function updateAfterSearch(e) {
    storeSPA.template(e)
    inputProduct(e);
}
document.addEventListener('DOMContentLoaded', storeSPA.init);