var podatki = "{}";
var seznamNakupov = [];

function main() {
    $(document).ready(function () {
        if (window.localStorage.getItem("podatki") == null) {

            $.getJSON('Podatki.json', function (data) {
                podatki = data;
            }) //Zaklju�ek getJSON
                .done(function () {
					saveDataToBrowser();
                    updateOnlineStore("ena_trgovina", 0);
					updateOnlineStore("dva_trgovina", 1);
					updateOnlineStore("tri_trgovina", 2);
                }); //END DONE
        } else {
            podatki = JSON.parse(window.localStorage.getItem("podatki"));
			updateOnlineStore("ena_trgovina", 0);
			updateOnlineStore("dva_trgovina", 1);
			updateOnlineStore("tri_trgovina", 2);
            //updateOnlineStore();
        }

    }); // Zaklju�el dokumenta

}

function updateOnlineStore(trgovina, index) {
    seznamNakupov = [];

    var div = document.getElementById(trgovina);
    div.innerHTML = "";
	var orderC = 0;

var k = 0;
    for (var i = 0; i < podatki["Seznam"].length; i++) {
		var cost = 0;

		for (var j = 0; j < (podatki["Trgovine"][index]["Sestavine"]).length; j++) {

			if (podatki["Trgovine"][index]["Sestavine"][j]["ID"] == podatki["Seznam"][i]["ID"]) {

				cost = parseFloat(podatki["Trgovine"][index]["Sestavine"][j]["Cena"])*parseFloat(podatki["Seznam"][i]["Kolicina"]);

				orderC = orderC+cost;

				var imeSestavine = podatki["Sestavine"][podatki["Seznam"][i]["ID"]]["Ime"];


        seznamNakupov.push(podatki["Seznam"][i]);

				var data =  `
				 <div class="cnt emp" style="padding: 0;">
				 <div class="cnt" style="padding:0; width:100%;">
				   <div class="holder">` + podatki["Seznam"][i]["Kolicina"]  + `x ` + imeSestavine + `</div>
				 </div>
				 <div class="tretja key">` + cost.toFixed(2) + `</div>
				 </div>
				 `;
				 div.innerHTML += data;
			}
		}

    }
	document.getElementById("cena" + (index + 1)).innerHTML = orderC.toFixed(2).toString() + '$';

}

function saveDataToBrowser(){

  var jsonString = JSON.stringify(podatki);
  window.localStorage.setItem("podatki", jsonString);

}

function getDate(){

	var today = new Date();
	var currentDate = (today.getMonth()+1) +'/'+  (today.getDate()) +'/'+ today.getFullYear();
	return currentDate;

}

function addElementToSL(){
/*  var neki = seznamNakupov;
  console.log(neki);
  flag = 0;
    for(id in neki){
      flag = 0;
        for(index in podatki["Hladilnik"]){
          console.log(neki[id]["ID"] + ", "+ neki["Hladilnik"][index]["ID"]);
          if(neki[id]["ID"] == podatki["Hladilnik"][index]["ID"]){
            flag = 1;
            podatki["Hladilnik"][index]["Kolicina"] = (parseInt(podatki["Hladilnik"][index]["Kolicina"]) + parseInt(neki[id]["Kolicina"])).toString();
            break;
        }
      }
      if(flag == 0){
        podatki["Hladilnik"].push({"ID":neki[id]["ID"], "DatumNakupa": getDate(), "Kolicina":neki[id]["Kolicina"]});
      }

      podatki["Seznam"].splice(id,1);
      neki.splice(id,1);


    }

  saveDataToBrowser();*/
  window.location.href = "index.html";
}
