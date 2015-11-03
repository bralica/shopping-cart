//poziva se na klik dugmeta za pretragu
function search(){

	//pretpostavljamo da imamo sve proizvode u globalnoj promenljivoj products
	// ako nemamo onda pozovemo servis kako bismo dobili sve proizvode u products


	var searchCategoryId = vrednost izabrana u drop-down-u za pretragu po kategorijama;
	var searchValue = vrednost ukucana u ptext box za search;

	if(searchCategoryId != "all"){
		clearAllProducts();
		categoryName = nadjiKategoruju(searchCategoryId);
		products = getProductsByCategoryId(searchCategoryId, products);
		if(searchValue != ""){
			products = getProductsBySearchValue(searchValue, categoryName, products)
			for petlja po products{
				nadjisliku();
				dodajProizvod(...);
			}
		}
		else{
			for petlja po products{
				nadjisliku();
				dodajProizvod(...);
			}
		}
	}
	else{
		if(searchValue != ""){
			clearAllProducts();
			products = getProductsBySearchValue(searchValue, categoryName, products)
			for petlja po products{
				nadjisliku();
				dodajProizvod(...);
			}
		}
	}

}

function getProductsBySearchValue(searchParam, categoryName, products)
	var result = []
	for petlja po products{
		if(ime proizvoda sadrzi searchParam ili categoryName sadrzi searchParam){
			result.push(product);
		}
	}

	return result;
}

function getProductsByCategoryId(categoryId, products)
	var result = []
	for petlja po products{
		if(id kategorije jednak categoryId){
			result.push(product);
		}
	}

	return result;
}

function clearAllProducts(){
	$("#idTagaUKomeSuSviProizvodi").empty();
}
