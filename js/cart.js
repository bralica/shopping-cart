// FIXME[x]: oduzima i proizvode koji nisu u  korpi
// FIXME: modal window se ne zatvara posto se doda proizvod
// TODO[x]: napraviti funkcije za svaki deo koda koji je reusable; razbiti kod na sto manje delove
// TODO: formatirati cene koje stizu sa servera u citljiv oblik.
//{"CategoryID":1,"CategoryName":"Beverages","Description":"Soft drinks, coffees, teas, beers, and ales"}
//PROIZVODI http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json
//example http://stackoverflow.com/questions/10679580/javascript-search-inside-a-json-object
//TODO[x]: Employees - http://services.odata.org/V3/Northwind/Northwind.svc/Employees?$format=json
//FIXME: Problems with EventListeners. Probaj da ih resis tako sto ce postojati f-ja prepareEventListeners koja ce biti zakacena na window.onload event
//document.getElementById('loginButton').addEventListener("click", function () {
//  loginUser(document.getElementById('firstName').value, document.getElementById('lastName').value);
//});

//TODO: Poruka o proizvodima u korpi u p#demo. Probaj kako ce da izgleda
//TODO[x]: Pokusaj da se ukloni proizvod pre nego sto se uopste doda.
//TODO: Definicija funkcija prvo pa tek onda pozivi.
//TODO[x]: Prikaz sadrzaja korpe.
//FIXME: Prosiriti sadrzaj objekta Product koji se cuva u korpi radi prikaza.Dodati jos neke vrednosti, kao sto su categoryID i productNAME i real ProductID
//FIXME: Voditi racuna da se ne pomesa ProductID regularan sa proizvodId-jem koji se koristi za prikupljanje podataka iz html-a

//FIXME: cntProduct, da bude productId. Dodaj proizvod sa cnt
//FIXME: global array products. Da bi proizvod koji mi dodamo bio u pretrazi.
//FIXME: notifikacija za kolicinu u korpi i notifikacija umesto alert-a kada je korpa prazna i kada je broj proizvoda koji se oduzima veci nego broj u korpi.
//TODO: datepicker na formi za unos proizvoda, Proizvod je akuelan od - do datuma
//TODO: File upload koji ce da procita ime slike i da je prikaze.
//TODO: Btter notifications for empty cart and no products in the cart


//---------- ONLOAD ----------
function loadData(){
  showCategoriesInMenu(getAndLoadCategoriesInMenu('http://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json'));
  getData('http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json');
  checkLogin();
}

// -------- LOGIN -------- //
function checkLogin () {
  if (!sessionStorage.getItem("loggedUser")){
    window.location.href = "index.html";
  }
}

function loginUser (firstname, lastname) {

  var users = getServiceData('http://services.odata.org/V3/Northwind/Northwind.svc/Employees?$format=json').value;
  var valid = false;

  for (var user in users) {
    if(users[user].FirstName == firstname && users[user].LastName == lastname) {
      valid = true;
      sessionStorage.setItem("loggedUser", users[user].FirstName);
      break;
    }
  }

  if (valid) {
    redirect();
  } else {
      document.getElementById('errorMessage').innerHTML = "Uneti podaci nisu ispravni. Pokušajte ponovo";
      document.getElementById('errorMessage').className = "errorMessage";
  }

}

function logoutUser() {
  if (sessionStorage.getItem("loggedUser")) {
    sessionStorage.clear();
    window.location.href="index.html";
  }
}

function redirect () {
  window.location.href = "cart.html";
}

var uName = sessionStorage.getItem("loggedUser");

document.getElementById('loggedIn').innerHTML = "Welcome, " + uName + "!";
document.getElementById('logout').innerHTML = "Logout";

// ------- GLOBALS -------
var slike = [{id:1, path: "images/1.jpg"}, {id:2, path: "images/2.jpg"}, {id:3, path: "images/3.jpg"}, {id:4, path: "images/4.jpg"}];
var cntProduct = 0;
var categories = getServiceData('http://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json').value;
//make products global
var products = getServiceData('http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json').value;

var suma = 0;
var shoppingCart = [];

var filter = 0;

//---------- INICIJALIZACIJA PRODUCT OBJEKTA ----------
//konstruktor za novi objekat proizvod. Trebalo bi da se prosiri.
function Product (id, cena, kolicina){
  this.proizvodId   = id;
  this.proizvodCena = cena;
  this.proizvodKolicina = kolicina;
}

//priprema element za dalju obradu i vraca objekat sa setovanim vrednostima
function prepareElement (element) {

  var elementId = element.id;
  var cenaId = "cena" + element.id;
  var kolicinaId = "kolicina" + element.id;
  var cena = document.getElementById(cenaId).outerText;
  var kolicina = document.getElementById(kolicinaId).valueAsNumber;

  cena = Number(cena);
  kolicina = Number(kolicina);

  var productData = new Product (elementId, cena, kolicina);
  return productData;

}

//---------- HELPER Functions for various tasks -------
function takeQuantityFromCart(id, shoppingCart) {
  for(var i in shoppingCart) {
    if(shoppingCart[i].proizvodId == id) {
        return shoppingCart[i].proizvodKolicina;
    }
  }
}

function takeCategory (id, categories) {
  for(var i in categories) {
    if(categories[i].CategoryID == id){
      return categories[i].CategoryName;
    }
  }
}

function takeProductName (id, products) {
  for(var i in products) {
    if(products[i].ProductID == id){
      return products[i].ProductName;
    }
  }
}

function takeProductId (name, products) {
  for(var i in products) {
    if(products[i].ProductName == name){
      return products[i].ProductID;
    }
  }
}

function takeCategoryIdFromProducts (id, products) {
  for(var i in products) {
    if(products[i].ProductID == id){
      return products[i].CategoryID;
    }
  }
}

function takeImage (id, slike) {
  for (var i in slike) {
    if(slike[i].id == id) {
      return slike[i].path;
    }
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function findCategory (categories, filter) {

  for (var category in categories) {
    if (categories[category].CategoryName == filter){
      return categories[category].CategoryID;
    }
    else {
      return false;
    }
  }

}

function getAndLoadCategories (url){

  var categories = getCategoryData(url).value;
  var output = "";
  for (var category in categories) {

    var categoryId   = categories[category].CategoryID;
    var categoryName = categories[category].CategoryName;
    //funkcija koja prikazuje kategorije, odnosno kreira select meni

  for (var category in categories){

     var categoryId   = categories[category].CategoryID;
     var categoryName = categories[category].CategoryName;
     output += '<option value="' + categoryId + '">' + categoryName + '</option>';


  }
  return output;
}

function getAndLoadCategoriesInMenu (url) {

  var categories = getCategoryData(url).value;
  var output = "";
  for (var category in categories) {

     var categoryId   = categories[category].CategoryID;
     var categoryName = categories[category].CategoryName;
     //funkcija koja prikazuje kategorije, odnosno kreira select meni
     output += '<li><a href="#" data-catId="' + categoryId + '">' + categoryName + '</a></li>';

  }
  var allCategories = 0;
  output += '<li><a href="#" data-catId="' + allCategories +'">Svi proizvodi</a></li>';
     var categoryName = categories[category].CategoryName;
     var categoryId   = categories[category].CategoryID;
     output += '<li><a href="#" id="' + categoryId + '"onclick="getData(\'http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json\',' + categoryId + ')">' + categoryName + '</a></li>';

  }
  var allCategories = 0;
  output += '<li><a href="#" id="' + allCategories +'" onclick="getData(\'http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json\',' + allCategories + ')">Svi proizvodi</a></li>';

  return output;

}

function showCategories (output) {
   document.getElementById('categoryName').innerHTML = output;
}

function showCategoriesInMenu (output) {
   document.getElementById('categoryNav').innerHTML = output;
}

//TODO[x]: f-ja za uklanjanje proizvoda, prosledjuje se element(objekat) kao parametar documentGetElementById("");
function removeChildElements (element){
   while (element.hasChildNodes()) {
    element.removeChild(element.firstChild);
   }
}

//dodaj proizvod u korpu, ako ne postoji
function insertProductInCart (id,cena,kolicina) {
  var product = new Product(id, cena, kolicina);
  shoppingCart.push(product);
}
//
function findInArray (id,targetedArray,propertyName) {
  for (var i = 0; i < targetedArray.lenght; i++) {
    if(targetedArray.propertyName == id) {
      return true;
    }
  }
  return false;
}

function maxInArray (targetArray) {
  var max = 0;
  for (var i in targetArray){
    if(targetArray[i].ProductID > max){
      max = targetArray[i].ProductID;
    }
  }
  return max;
}
//TODO: Priprema za upload slike

//var imgPath = document.getElementById("imagePath");
//var files = imgPath.files;
//var file = files.item[0];
//var imgName = file.name;
//var fullPath = "images/" + imgName;

//imagePath.addEventListener("change", handleFiles, false);
//function handleFiles() {
//  var fileList = this.files;
//  var imgName = fileList.name;
//  var fullPath = "images/" + imgName;
//  return fullPath;
//}
//var fullPath = handleFiles();
//debugger;

//NOTE[x]: createProduct
//define productIdFromForm to be 0
var productIdFromForm = 0;
document.getElementById('dodajNovProizvod').addEventListener("click", function(){
  createProduct(productIdFromForm, document.getElementById('imagePath').value, document.getElementById('productPrice').valueAsNumber,document.getElementById("productName").value,document.getElementById("categoryName").value);
});

//NOTE: Ne radi event listener? Proveri!Opis na vrhu
//document.getElementById('searchField').addEventListener("onkeyup", function(){
//  getData('http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json', document.getElementById('searchField').value);
//});


//NOTE: Load Service Data. Ovo je funkcija u koja kreira i prikazuje proizvode u odnosu na filter.
function getData(url, filter) {

  //[x]TODO[x]: Funkcija za uklanjanje proizvoda
  var divAddProduct = document.getElementById('addProduct');

  removeChildElements(divAddProduct);

  //inicijalizuj filter
  //var products = getServiceData(url).value;

  for (var product in products) {

    var imgPath = takeImage(getRandomInt(1,4), slike);
    var catName = takeCategory(products[product].CategoryID, categories);

    //procesiraj filter da se kreiraju samo oni proizvodi koji zadovoljavaju kreiterijum.
    if (filter == undefined || filter == "") {
       filter = 0;
       createProduct(products[product].ProductID, imgPath, products[product].UnitPrice, products[product].ProductName,products[product].CategoryID);
    }
    if (products[product].CategoryID == filter){
      createProduct(products[product].ProductID, imgPath, products[product].UnitPrice, products[product].ProductName,products[product].CategoryID);
    }
    if (typeof filter == 'string') {
      if(products[product].ProductName.toLowerCase().indexOf(filter.toLowerCase()) >= 0 || catName.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
        createProduct(products[product].ProductID, imgPath, products[product].UnitPrice, products[product].ProductName, products[product].CategoryID);
      }
    }
  }
  document.getElementById('itemsInCart').innerHTML = "KATALOG PROIZVODA";
}

function getServiceData(url, username, password) {

  try {
    var result;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          result = JSON.parse(xmlhttp.response);
        } else {
          return false;
        }
      }
    }
    xmlhttp.open("GET", url, false, username, password);
    xmlhttp.send();
    return result;
  }
  catch (err) {
    return err;
  }
}

function getCategoryData (url, username, password) {
  try {
    var result;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if(xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
          result = JSON.parse(xmlhttp.response);
        }
        else {
          return false;
        }
      }
    }
    xmlhttp.open("GET", url, false, username, password);
    xmlhttp.send();
    return result;
  }
  catch (err) {
    return err;
  }
}

function getAndLoadCategoriesInMenu (url) {

  var categories = getCategoryData(url).value;
  var output = "";
  for (var category in categories) {

     var categoryName = categories[category].CategoryName;
     var categoryId   = categories[category].CategoryID;
     output += '<li><a href="#" id="' + categoryId + '"onclick="getData(\'http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json\',' + categoryId + ')">' + categoryName + '</a></li>';

  }
  var allCategories = 0;
  output += '<li><a href="#" id="' + allCategories +'" onclick="getData(\'http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json\',' + allCategories + ')">Svi proizvodi</a></li>';
  return output;
}

function createProduct(productId, imgPath, productPrice, productName, categoryId){

  var divProductRow = document.getElementById('addProduct');
  var numberOfProducts = document.getElementsByClassName('priceTag').length;


  //doda se jos jedan argument proizvodId i pita se da li je undefined ili null i onda se utvrdi da li da zovemo
  if(productId == undefined || productId == 0)  {
    cntProduct = numberOfProducts + 1;
  }
  else {
    //nov proizvod sa forme;
    cntProduct = productId;
  }

  var divColMd3 = document.createElement("div");
  divColMd3.setAttribute("class", "col-md-3 col-sm-6 introFadeIn");
  divProductRow.appendChild(divColMd3);

  var prName = document.createElement("p");
  prName.setAttribute("class", "product-title");
  prName.innerHTML = productName;
  divColMd3.appendChild(prName);

  var categoryName = takeCategory(categoryId, categories);
  var catName = document.createElement("p");
  catName.setAttribute("class", "text-left category-title");
  catName.innerHTML = categoryName;
  divColMd3.appendChild(catName);

  var productImage = document.createElement("img");
  productImage.setAttribute("src", imgPath);
  productImage.setAttribute("alt", "proizvod");
  productImage.setAttribute("class", "img-responsive");
  productImage.setAttribute("width", "200");
  divColMd3.appendChild(productImage);

  var valutaRSD = document.createElement("p");
  valutaRSD.setAttribute("class", "valuta text-left");
  valutaRSD.innerHTML = "rsd";
  divColMd3.appendChild(valutaRSD);

//  if(productId == undefined || productId == 0)  {
//    cntProduct = cntProduct + 1;
//  }
//  else {
//    cntProduct = productId;
//  }

  var productPriceTag = document.createElement("p");
  var idAttribute = "CenaP" + cntProduct; //na primer P6
  productPriceTag.setAttribute("id", "cenaP" + cntProduct);
  productPriceTag.setAttribute("class", "priceTag");
  productPriceTag.innerHTML = productPrice;
  divColMd3.appendChild(productPriceTag);

  var divClear = document.createElement("div");
  divClear.setAttribute("class", "clr");
  divColMd3.appendChild(divClear);

  var inputTag = document.createElement("input");
  inputTag.setAttribute("type", "number");
  inputTag.setAttribute("value", "1");
  inputTag.setAttribute("id", "kolicinaP" + cntProduct);
  divColMd3.appendChild(inputTag);

  var pTagKolicina = document.createElement("p");
  pTagKolicina.setAttribute("class", "text-muted");
  pTagKolicina.innerHTML = "kolicina";
  divColMd3.appendChild(pTagKolicina);

  var buttonTagAdd = document.createElement("button");
  buttonTagAdd.setAttribute("class", "btn btn-success btn-sm");
  buttonTagAdd.setAttribute("id", "P" + cntProduct);
  buttonTagAdd.setAttribute("onclick", "addItem(this)");
  buttonTagAdd.innerHTML = "Dodaj u korpu";
  divColMd3.appendChild(buttonTagAdd);

  var buttonTagRemove = document.createElement("button");
  buttonTagRemove.setAttribute("class", "btn btn-danger btn-sm");
  buttonTagRemove.setAttribute("id", "P" + cntProduct);
  buttonTagRemove.setAttribute("onclick", "removeItem(this)");
  buttonTagRemove.innerHTML = "Ukloni iz korpe";
  divColMd3.appendChild(buttonTagRemove);

}

//TODO[x]: funkcija ukloni sa prepareElement funkcijom
function removeItem(element) {

  var product = prepareElement(element);
  var kolicinaId = "kolicina" + product.proizvodId;
  var propertyName = "proizvodId";

  //obrisati element


  //FIXME: Pronadji nacin da utvrdis da li je element uopste u korpi. Ako se ne nalazi, ne moze ni da se ukloni. Poruka.
  //if(!findInArray(product.proizvodId, shoppingCart, propertyName)){alert("Proizvod se ne nalazi u korpi"); return false;}
  for (var i in shoppingCart) {
    if (shoppingCart[i].proizvodId == product.proizvodId) {
      if (shoppingCart[i].proizvodKolicina >= product.proizvodKolicina) {
        shoppingCart[i].proizvodKolicina = shoppingCart[i].proizvodKolicina - product.proizvodKolicina;
        suma = suma - (product.proizvodKolicina * product.proizvodCena);
        if(suma < 0){suma = 0};
        if (shoppingCart[i].proizvodKolicina == 0) {
          shoppingCart.splice(i, 1);
          $("#" + product.proizvodId).parent().remove();
        }
      } else {
          alert("Uneta kolicina je veca od broja proizvoda u korpi! Broj proizvoda u korpi je: " + shoppingCart[i].proizvodKolicina);
        }
    }  //else {
//      alert("Proizvod se ne nalazi u korpi");
//    }
  }
  document.getElementById("suma").innerHTML = suma + " rsd";

  if (product.proizvodKolicina  != 1) {
    document.getElementById(kolicinaId).value = 1;
  }
  if(shoppingCart.length == 0){alert("Korpa je prazna");redirect();}
  //NOTE: Prikaz, koji su proizvodi u korpi radi pomoci.
  //  for (var j in shoppingCart) {
  //    document.getElementById("demo").innerHTML += j + "-" + shoppingCart[j].proizvodId + "-" + shoppingCart[j].proizvodCena + "-" + shoppingCart[j].proizvodKolicina + "-" + typeof shoppingCart[j].proizvodCena + "-" + shoppingCart.length + "<br>";
  //  }

}

function addItem (element) {

  var product = prepareElement(element);
  var kolicinaId = "kolicina" + product.proizvodId;

  var addItemToCart = false;
  for (var i in shoppingCart){
    if (shoppingCart[i].proizvodId == product.proizvodId) {
      shoppingCart[i].proizvodKolicina += product.proizvodKolicina;

      var totalAmount = shoppingCart[i].proizvodKolicina;
      addItemToCart = true;
      //notification = shoppingCart.length+1
    }
  }
  if(!addItemToCart){
    insertProductInCart(product.proizvodId, product.proizvodCena, product.proizvodKolicina);
    ////notification = shoppingCart.length+1
  }
  suma = suma + (product.proizvodCena * product.proizvodKolicina);
  document.getElementById("suma").innerHTML = suma + " rsd";
  //NOTE: Prikaz, koji su proizvodi u korpi radi pomoci.
  //    for (var j in shoppingCart) {
  //      document.getElementById("demo").innerHTML += j + "-" + shoppingCart[j].proizvodId + "-" + shoppingCart[j].proizvodCena + "-" + shoppingCart[j].proizvodKolicina + "-" + typeof shoppingCart[j].proizvodCena + "-" + shoppingCart.length + "<br>";
  //    }

  //Kolicina se setuje na 1
  if (product.proizvodKolicina == 0) {
    document.getElementById(kolicinaId).value = 1;
  }

}

function showProductsInCart(url) {

  //prvo izbrisi sve elemente
  var divAddProduct = document.getElementById('addProduct');
  removeChildElements(divAddProduct);

  if(shoppingCart.length == 0 || shoppingCart.length == undefined){
    alert("VAŠA KORPA JE PRAZNA"); redirect();
//    $.notify("VAŠA KORPA JE PRAZNA", {position:"top center", autoHide: false, clickToHide: false,  className: "warn"});

  }

  var allProducts = getServiceData(url).value;
  //loop kroz shoppingCart i prikazi proizvode, sa notifikacijom za kolicinu
  for (var i in shoppingCart) {

    //ProizvodID je P1, P2, etc. Napravi ga da ostane samo broj 1,2,3, ...
    var id = shoppingCart[i].proizvodId;
    var regex = /(\d+)/g;
    //ProductID
    var productId = id.match(regex);

    var productName = takeProductName(productId, allProducts);
    var categoryId = takeCategoryIdFromProducts(productId, allProducts);
    //take random image
    var imgPath = takeImage(getRandomInt(1,4), slike);

    //var categoryId = takeCategory();
    createProductInCart(imgPath, shoppingCart[i].proizvodCena, shoppingCart[i].proizvodKolicina, productName, productId, categoryId);
    document.getElementById('itemsInCart').innerHTML = "SADRŽAJ VAŠE KORPE ZA KUPOVINU";

  }


}

function createProductInCart(imgPath, productPrice, productQuantity, productName, productId, categoryId) {

  var divProductRow = document.getElementById('addProduct');
  var numberOfProducts = document.getElementsByClassName('priceTag').length;

  if(numberOfProducts == undefined || numberOfProducts == 0)  {
    cntProduct = cntProduct;
  }
  else {
    cntProduct = numberOfProducts;
  }

  var divColMd3 = document.createElement("div");
  divColMd3.setAttribute("class", "col-md-3 col-sm-6 introFadeIn in-cart");
  divProductRow.appendChild(divColMd3);

  var prName = document.createElement("p");
  prName.setAttribute("class", "product-title");
  prName.innerHTML = productName;
  divColMd3.appendChild(prName);

  var categoryName = takeCategory(categoryId, categories);
  var catName = document.createElement("p");
  catName.setAttribute("class", "text-left category-title");
  catName.innerHTML = categoryName;
  divColMd3.appendChild(catName);

  var productImage = document.createElement("img");
  productImage.setAttribute("src", imgPath);
  productImage.setAttribute("alt", "proizvod");
  productImage.setAttribute("class", "img-responsive");
  productImage.setAttribute("width", "200");
  divColMd3.appendChild(productImage);

  var valutaRSD = document.createElement("p");
  valutaRSD.setAttribute("class", "valuta text-left");
  valutaRSD.innerHTML = "rsd";
  divColMd3.appendChild(valutaRSD);

  cntProduct = cntProduct + 1;
  var productPriceTag = document.createElement("p");
  var idAttribute = "CenaP" + cntProduct; //na primer P6
  productPriceTag.setAttribute("id", "cenaP" + productId);
  productPriceTag.setAttribute("class", "priceTag");
  productPriceTag.innerHTML = productPrice;
  divColMd3.appendChild(productPriceTag);

  var divClear = document.createElement("div");
  divClear.setAttribute("class", "clr");
  divColMd3.appendChild(divClear);

  //Ovo treba da ide u NOTIFIKACIJU, tj. kolicinu proizvoda
  var inputTag = document.createElement("input");
  inputTag.setAttribute("type", "number");
  inputTag.setAttribute("value", "1");
  inputTag.setAttribute("id", "kolicinaP" + productId);
  divColMd3.appendChild(inputTag);

  var pTagKolicina = document.createElement("p");
  pTagKolicina.setAttribute("class", "text-muted");
  pTagKolicina.innerHTML = "kolicina";
  divColMd3.appendChild(pTagKolicina);

//  var buttonTagAdd = document.createElement("button");
//  buttonTagAdd.setAttribute("class", "btn btn-success btn-sm");
//  buttonTagAdd.setAttribute("id", "P" + cntProduct);
//  buttonTagAdd.setAttribute("onclick", "addItem(this)");
//  buttonTagAdd.innerHTML = "Dodaj u korpu";
//  divColMd3.appendChild(buttonTagAdd);

  var buttonTagRemove = document.createElement("button");
  buttonTagRemove.setAttribute("class", "btn btn-danger btn-sm");
  buttonTagRemove.setAttribute("id", "P" + productId);
  buttonTagRemove.setAttribute("onclick", "removeItem(this)");
  buttonTagRemove.innerHTML = "Ukloni iz korpe";
  divColMd3.appendChild(buttonTagRemove);



//    $("#P" + productId).notify(
//      "I'm to the right of this box", { position:"right" }
//);


  //uzmi kolicinu iz korpe
  //ProizvodID je P1, P2, etc. Napravi ga da ostane samo broj 1,2,3, ...
  //var id = shoppingCart[i].proizvodId;
  //var regex = /(\d+)/g;
  //ProductID
  //productId = productId.match(regex);
  var pID = "P" + productId;
  var quantity = takeQuantityFromCart(pID, shoppingCart);
  debugger;

  //Notification for products in cart. Selector is button, position right side.
  $("#P" + productId).parent().notify(
    productQuantity, { position:"top left", autoHide: false, clickToHide: false, className: "success"}
  );


}
