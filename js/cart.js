// FIXME: oduzima i proizvode koji nisu u  korpi
// FIXME: modal window se ne zatvara posto se doda proizvod
// TODO: napraviti funkcije za svaki deo koda koji je reusable; razbiti kod na sto manje delove
// TODO: formatirati cene koje stizu sa servera u citljiv oblik.
//{"CategoryID":1,"CategoryName":"Beverages","Description":"Soft drinks, coffees, teas, beers, and ales"}
//PROIZVODI http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json
//example http://stackoverflow.com/questions/10679580/javascript-search-inside-a-json-object
//TODO[x]: Employees - http://services.odata.org/V3/Northwind/Northwind.svc/Employees?$format=json
//FIXME: Problems with EventListeners

// --- LOGIN ---

//document.getElementById('loginButton').addEventListener("click", function () {
//  loginUser(document.getElementById('firstName').value, document.getElementById('lastName').value);
//});

function checkLogin () {

  if (!sessionStorage.getItem("loggedUser")){

    window.location.href= "index.html";

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
document.getElementById('loggedIn').innerHTML = "Welcome " + uName + "!";
document.getElementById('logout').innerHTML = "Logout";

var slike = [{id:1, path: "images/1.jpg"}, {id:2, path: "images/2.jpg"}, {id:3, path: "images/3.jpg"}, {id:4, path: "images/4.jpg"}];
var cntProduct = 0;
var categories = getServiceData('http://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json').value;

var suma = 0;
var shoppingCart = [];

var filter = 0;

function loadData(){
  showCategoriesInMenu(getAndLoadCategoriesInMenu('http://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json'));
  getData('http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json');
  checkLogin();
}

function takeCategory (id, categories) {

  for(var i in categories) {
    if(categories[i].CategoryID == id){
      return categories[i].CategoryName;
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

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomNumber (max, min){

    return Math.round(Math.random() * (max - min)) + min;

}

document.getElementById('dodajNovProizvod').addEventListener("click", function(){
  dodajProizvod(document.getElementById('imagePath').value, document.getElementById('productPrice').valueAsNumber,document.getElementById("productName").value,document.getElementById("categoryName").value);

});

//NOTE: Ne radi event listener? Proveri!
//document.getElementById('searchField').addEventListener("onkeyup", function(){
//  getData('http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json', document.getElementById('searchField').value);
//});

//LOAD SERVICE DATA
function getData(url, filter) {

  //TODO: Funkcija za uklanjanje proizvoda
  var divAddProduct = document.getElementById('addProduct');
  while (divAddProduct.hasChildNodes()){
    divAddProduct.removeChild(divAddProduct.firstChild);
  }

  //inicijalizuj filter
  var products = getServiceData(url).value;

  for (var product in products) {

    var imgPath = takeImage(getRandomInt(1,4), slike);
    var catName = takeCategory(products[product].CategoryID, categories);
    //procesiraj filter da se kreiraju samo oni proizvodi koji zadovoljavaju kreiterijum.

    if (filter == undefined || filter == "") {
       filter = 0;
       dodajProizvod(imgPath, products[product].UnitPrice, products[product].ProductName,products[product].CategoryID);
    }

    if (products[product].CategoryID == filter){

      dodajProizvod(imgPath, products[product].UnitPrice, products[product].ProductName,products[product].CategoryID);

    }
    if (typeof filter == 'string') {

      if(products[product].ProductName.toLowerCase().indexOf(filter.toLowerCase()) >= 0 || catName.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {

        dodajProizvod(imgPath, products[product].UnitPrice, products[product].ProductName, products[product].CategoryID);
      }

    }
  }

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
    output += '<option value="' + categoryId + '">' + categoryName + '</option>';


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

function dodajProizvod(imgPath, productPrice, productName, categoryId){

  var divProductRow = document.getElementById('addProduct');
  var numberOfProducts = document.getElementsByClassName('priceTag').length;

  if(numberOfProducts == undefined || numberOfProducts == 0)  {
    cntProduct = cntProduct;
  }
  else {
    cntProduct = numberOfProducts;
  }

  //TODO: filter by category
  //TODO: filter by ull text search

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

  cntProduct = cntProduct + 1;
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
  buttonTagAdd.setAttribute("onclick", "dodaj(this)");
  buttonTagAdd.innerHTML = "Dodaj u korpu";
  divColMd3.appendChild(buttonTagAdd);

  var buttonTagRemove = document.createElement("button");
  buttonTagRemove.setAttribute("class", "btn btn-danger btn-sm");
  buttonTagRemove.setAttribute("id", "P" + cntProduct);
  buttonTagRemove.setAttribute("onclick", "ukloni(this)");
  buttonTagRemove.innerHTML = "Ukloni iz korpe";
  divColMd3.appendChild(buttonTagRemove);

}

function ukloni(element) {

  var elementId = element.id;
  var cenaId = "cena" + element.id;
  var kolicinaId = "kolicina" + element.id;
  var cena = document.getElementById(cenaId).outerText;
  var kolicina = document.getElementById(kolicinaId).valueAsNumber;

  cena = Number(cena);
  kolicina = Number(kolicina);

  //TODO: ispitaj da li se proizvod nalazi u korpi. Ako ga nema ne azurriraj sumu.
  for (var i in shoppingCart) {

    if (shoppingCart[i].proizvodId == elementId) {

      shoppingCart[i].proizvodKolicina = shoppingCart[i].proizvodKolicina - kolicina;
      suma  = suma - (shoppingCart[i].proizvodKolicina * cena);

      if (shoppingCart[i].proizvodKolicina <= 0) {

        shoppingCart.splice(i, 1);
        break;

      }
    }
  }

  document.getElementById("suma").innerHTML = suma + " rsd";

  if (kolicina != 1) {
    document.getElementById(kolicinaId).value = 1;
  }

  for (var j in shoppingCart) {

    //ispisi sta je u korpi
    document.getElementById("demo").innerHTML += j + "-" + shoppingCart[j].proizvodId + "-" + shoppingCart[j].proizvodCena + "-" + shoppingCart[j].proizvodKolicina + "-" + typeof shoppingCart[j].proizvodCena + "-" + shoppingCart.length + "<br>";

  }
}

function dodaj(element) {

  var elementId = element.id;
  var cenaId = "cena" + element.id;
  var kolicinaId = "kolicina" + element.id;
  var cena = document.getElementById(cenaId).outerText;
  var kolicina = document.getElementById(kolicinaId).valueAsNumber;

  cena = Number(cena);
  kolicina = Number(kolicina);

  //kreiraj objekat productData
  var productData = {
    proizvodId: elementId,
    proizvodCena: cena,
    proizvodKolicina: kolicina
  };

  if (shoppingCart == undefined || shoppingCart.length == 0) {
    shoppingCart.push(productData);
  }

  for (var i in shoppingCart) {

    //ukoliko postoje elementi u korpi
    if (shoppingCart.length > 0) {

      if (shoppingCart[i].proizvodId == elementId && shoppingCart.length != 1) {

        //[x]FIXME: dupliranje
        //ovde ga duplira(vec postoji kolicina iz productData ubacenog gore, dodati neki uslov koji iskljucuje prvi proizvod)
        shoppingCart[i].proizvodKolicina += kolicina;
      }
    }

    var flag = false;
    if (shoppingCart[i].proizvodId == elementId) {
      flag = true;
      break;
    }

  }
  if (flag == false) {
    shoppingCart.push(productData);
  }

  suma = suma + (cena * kolicina);

  document.getElementById("suma").innerHTML = suma + " rsd";

  for (var j in shoppingCart) {

    document.getElementById("demo").innerHTML += j + "-" + shoppingCart[j].proizvodId + "-" + shoppingCart[j].proizvodCena + "-" + shoppingCart[j].proizvodKolicina + "-" + typeof shoppingCart[j].proizvodCena + "-" + shoppingCart.length + "<br>";

  }
  alert(element.id);

  if (kolicina != 1) {
    document.getElementById(kolicinaId).value = 1;
  }

}
