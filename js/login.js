function redirect () {
  //var currentPath = window.location.pathname;
  //window.location.href = "file:///C:/Users/bralica/PROJECTS/project-shopping-cart-github/cart.html";
  window.location.href = "cart.html";
}

function loginUser (firstname, lastname) {

  var users = getServiceData('http://services.odata.org/V3/Northwind/Northwind.svc/Employees?$format=json').value;
  var valid = false;
    for (var user in users) {

      if(users[user].FirstName == firstname || users[user].LastName == lastname) {
        valid = true;
        break;
      }
    }
  if (valid) {
    redirect();
    //self.location = 'cart.html';
  }
  else {
    return alert("Something is wrong!");
  }

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
//document.getElementById('mainLoginForm').addEventListener("onsubmit", function () {
//  loginUser(document.mainLoginForm.firstName.value,document.mainLoginForm.lastName.value);
//});
