//<<<<<<< HEAD:js/main.js
//function takeImage (id) {
//=======
// FIXME: oduzima i proizvode koji nisu u  korpi
// FIXME: modal window se ne zatvara posto se doda proizvod
// [x]FIXME: button za dodavanje proizvoda je ruzan

// [x]TODO: u formi za dodavanje proizvoda dodati dropdown sa kategorijama; to je novi file sa web service url-a
// TODO: napraviti funkcije za svaki deo koda koji je reusable; razbiti kod na sto manje delove
// [x]TODO: kreirati new branch
// TODO: formatirati cene koje stizu sa servera u citljiv oblik
// [x]TODO: HTTP pozivom adrese http://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json dobija se spisak kategorija proizvoda.
// [x]TODO: Za svaki proizvod odrediti ime kategorije kojoj pripada prikazati ga uz proizvod.
// Format kategorija u json file-u:
//{"CategoryID":1,"CategoryName":"Beverages","Description":"Soft drinks, coffees, teas, beers, and ales"}
//Prosiriti funkciju dodajProizvod, da se doda i kategorija proizvoda.
//PROIZVODI http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json
//[x]TODO: dodajProizvod dobija jos dva argumenta, categoryName, productName

//TODO: search field - full text search
//example http://stackoverflow.com/questions/10679580/javascript-search-inside-a-json-object
//login forma, posebna HTML strana, firstname i lastname employees table
//TODO: onclick, nekako obrisati sve proizvode i prikazati samo iz odabrane kategorije?

var slike = [{id:1, path: "images/1.jpg"}, {id:2, path: "images/2.jpg"}, {id:3, path: "images/3.jpg"}, {id:4, path: "images/4.jpg"}];
var cntProduct = 0;
var categories = getServiceData('http://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json').value;
var suma = 0;
var shoppingCart = [];

var filter = 0;
function loadData(){
  showCategoriesInMenu(getAndLoadCategoriesInMenu('http://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json'));
  getData('http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json');
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

  dodajProizvod(document.getElementById('imagePath').value, document.getElementById('productPrice').valueAsNumber,document.getElementById("productName").value,document.getElementById("categoryName").value)

});

document.getElementById('searchField').addEventListener("onkeyup", function(){
  getData('http://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json', document.getElementById('searchField').value);

});
//LOAD SERVICE DATA
function getData(url, filter) {

  //prvo ukloni sve proizvode
  var divAddProduct = document.getElementById('addProduct');
  while (divAddProduct.hasChildNodes()){
    divAddProduct.removeChild(divAddProduct.firstChild);
  }

  var products = getServiceData(url).value;
  for (var product in products) {

    var imgPath = takeImage(getRandomInt(1,4), slike);
    var catName = takeCategory(products[product].CategoryID, categories);
    if (filter == undefined || filter == "") {
       filter = 0;
       dodajProizvod(imgPath, products[product].UnitPrice, products[product].ProductName,products[product].CategoryID);
    }

    if (products[product].CategoryID == filter){

      dodajProizvod(imgPath, products[product].UnitPrice, products[product].ProductName,products[product].CategoryID);

    }
    if (typeof filter == 'string') {

      //alert(document.getElementById('searchField').value);
      //break;
      //[x]TODO: ukoliko je filter typeof string, tj. ukoliko je stigao sa dogadjaja onkeyup sa search forme
      //[x]TODO: proveri da li ima match u kategorijama(categories) ili proizvodima products[product]
      //[x]TODO: ukoliko postoji match prikazi te proizvode, odnosno kreiraj te proizvode
      //[x]TODO: eventu onkeyup se prosledjuje getData(url, filter)
      //[x]TODO: ukoliko ime proizvoda ili ime kategorije pocinje upisanim karakterima u form, prikazi te proizvode

      if(products[product].ProductName.toLowerCase().indexOf(filter.toLowerCase()) >= 0 || catName.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {

        dodajProizvod(imgPath, products[product].UnitPrice, products[product].ProductName, products[product].CategoryID);
      }

    }
  }

}
//match category
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

  for (var category in categories){

     var categoryId   = categories[category].CategoryID;
     var categoryName = categories[category].CategoryName;
     //funkcija koja prikazuje kategorije, odnosno kreira select meni
     output += '<option value="' + categoryId + '">' + categoryName + '</option>';

  }

  return output;

}

function getAndLoadCategoriesInMenu (url) {

  var categories = getCategoryData(url).value;
  var output = "";
  for (var category in categories) {

     //var categoryId   = categories[category].CategoryID;
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

function dodajProizvod(imgPath, productPrice, productName, categoryId){

  var divProductRow = document.getElementById('addProduct');
  //var cntProduct = document.getElementsByClassName('priceTag').length;
  var numberOfProducts = document.getElementsByClassName('priceTag').length;

  if(numberOfProducts == undefined || numberOfProducts == 0)  {
    cntProduct = cntProduct;
  }
  else {
    cntProduct = numberOfProducts;
  }

  var divColMd3 = document.createElement("div");
  divColMd3.setAttribute("class", "col-md-3 col-sm-6");
  divProductRow.appendChild(divColMd3);

  //TODO: dodatak za elemente koji ce prikazivati naziv proizvoda i kategoriju proizvoda
  //TODO: za pocetak p tagovi pa ga ulepsaj
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

  // FIXME: funkcija ispitaj da li je proizvod u korpi
  // FIXME: funkcija za kreiranje objekta productData
  // [x]FIXME: umesto uklanjanja elementa, ukloni kolicinu

  for (var i in shoppingCart) {

    //ukoliko proizvod postoji u korpi, ukloni ga, ukoliko ne postoji izbaci obavestenje
    if (shoppingCart[i].proizvodId == elementId) {

      //ukloni element
      //shoppingCart.splice(i,1);
      //[x]CHANGES: umesto proizvoda uklanja kolicinu

      shoppingCart[i].proizvodKolicina = shoppingCart[i].proizvodKolicina - kolicina;
      if (shoppingCart[i].proizvodKolicina <= 0) {
        shoppingCart.splice(i, 1);
      }
      break;
    }
  }
  if (suma > 0) {

    suma = suma - (cena * kolicina);

  } else {
    suma = 0;
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

  //Ukoliko je prazan niz, dodaj element u vidu objekta
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
    //Ukoliko proizvod nije u korpi dodaj ga
    if (shoppingCart[i].proizvodId == elementId) {
      flag = true;
      break;
    }

  }
  if (flag == false) {
    shoppingCart.push(productData);
  }

  suma = suma + (cena * kolicina);


  //NOTE: dodavanje proizvoda u korpu. Proizvod je predstavljem kao objekat sa svojim atributima -> imgPath?, cena, kolicina, naziv, ...
  //za pocetak; id->element.id, cena->document.getElementById(cenaId), kolicina, imgPath?

  //[x]NOTE: Ukoliko postoji proizvod u nizu shoppingCart, tj. u korpi, uvecava se kolicina
  //ukoliko ne postoji proizvod u korpi, dodaje se ceo proizvod u korpu.


  document.getElementById("suma").innerHTML = suma + " rsd";


  //ispis proizvoda u korpi
  for (var j in shoppingCart) {
    //ispisi sta je u korpi
    document.getElementById("demo").innerHTML += j + "-" + shoppingCart[j].proizvodId + "-" + shoppingCart[j].proizvodCena + "-" + shoppingCart[j].proizvodKolicina + "-" + typeof shoppingCart[j].proizvodCena + "-" + shoppingCart.length + "<br>";

  }
  alert(element.id);

  if (kolicina != 1) {
    document.getElementById(kolicinaId).value = 1;
  }

}

//TODO: display categories
//NOTE: filter za odredjenu kategoriju, dodajProizvod sa kojim parametrima?
