//NOTE: Pomocni u kome se nalaze sve funkcije.

//NOTE: Ne koristi se.
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
  //alert(element.id);

  if (kolicina != 1) {
    document.getElementById(kolicinaId).value = 1;
  }

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
        suma  = suma - (kolicina * cena);
        if(suma < 0){suma = 0};
        if (shoppingCart[i].proizvodKolicina <= 0) {
          shoppingCart.splice(i, 1);
        }
    }
  }

  document.getElementById("suma").innerHTML = suma + " rsd";

  if (kolicina != 1) {
    document.getElementById(kolicinaId).value = 1;
  }

  //NOTE: Prikaz, koji su proizvodi u korpi radi pomoci.
  for (var j in shoppingCart) {
    //ispisi sta je u korpi
    document.getElementById("demo").innerHTML += j + "-" + shoppingCart[j].proizvodId + "-" + shoppingCart[j].proizvodCena + "-" + shoppingCart[j].proizvodKolicina + "-" + typeof shoppingCart[j].proizvodCena + "-" + shoppingCart.length + "<br>";

  }
}

//NOTE: Ne koristi se
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

//NOTE: Ne koristi se
function getRandomNumber (max, min){
    return Math.round(Math.random() * (max - min)) + min;
}
//NOTE: Ne koristi se.Pronadji element u nizu objekata
function findInArray (id) {
  for (var i = 0; i < shoppingCart.lenght; i++) {
    if(shoppingCart[i].proizvodId == id) {
     return true;
    }
  }
  return false;
}

//konstruktor, kreiraj proizvod
function Product (id, price, quantity) {
  this.proizvodId = id;
  this.proizvodKolicina = quantity;
  this.proizvodCena = price;
}

//inicijalizuje sledeci objekat
var productData  = new Product(id, price, quantity);
//novProizvod = {id: id, cena: price}

//updateProduct, proslediti niz objekata cart i objekat product
function updateProduct (cart, product) {
  for (var i in cart) {
    if(cart[i].proizvodId == product.proizvodId){
      cart[i].proizvodId += product.proizvodKolicina;
      return true;
    }
  }
  return false;
}

//TODO: funkcija insertProduct.
function insertProduct (cart, product) {
  for (var i in cart) {
    if (cart[i].proizvodId == product.proizvodId){
      updateProduct(cart, product);
    }
    else {
      cart.push(new Product(product.proizvodId, product.proizvodCena, product.proizvodKolicina));
    }
  }
}

//sve ove funkcije operisu sa dva parametra.
//Prvi je objekat productData, koji se odnosi na tekuci ili trenutni proizvod
//Drugi parametar je shoppingCart, niz objekata.
//U kontinuitetu se vrsi uporedjivanje vrednosti iz niza shoppingCart sa tekucim(izabranim proizvodom).


