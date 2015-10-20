//unos proizvoda u korpu
//function insertProduct (product) {
  //ako postoji proizvod updateProduct(product)
  //ako ne postoji dodaj proizvod u korpu

  //shoppingCart.push(new product(id,kolicina,cena));

//}

//function updateProduct (product) {
  //pristupamo globalnoj promenljivoj shoppingCart, ne prosledjujemo funkciji kao parametar
  //(for var i in shoppingCart) {

    //if(shoppingCart[i].productId == product.id) {
      //shoppingCart[i].productQuantity += product.kolicina;

      //return true;

    //}
//}
  //return false;

//}

//prosledi se id proizvoda
//function isProductExistsInCart (shoppingCart, productInfo) {
  //deo u funkciji if
//}

//konstruktor, kreiraj proizvod
function Product (id, price, quantity) {
  this.proizvodId = id;
  this.proizvodKolicina = quantity;
  this.proizvodCena = price;
}

//inicijalizuje sledeci objekat
var productData  = new Product(id, price, quantity);
//novProizvod = {id: id, cena: price}


//updateProduct
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


