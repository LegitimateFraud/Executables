var podatki = "{}";

function main(){
    $(document).ready(function(){
      if(window.localStorage.getItem("podatki") == null){
      startF();
  }else{

    podatki = JSON.parse(window.localStorage.getItem("podatki"));
    saveDataToBrowser();
    updateFridge(false);
	  loadShoppingList();
    console.log(podatki["Seznam"]);


    //izpisiRecept();
  }

}); // Zaključel dokumenta

}

function startF() {
  $.getJSON('Podatki.json', function(data){
    podatki = data;
    saveDataToBrowser();
    saveDataToBrowser();
    updateFridge(false);
    loadShoppingList();

    //izpisiRecept();
}); //Zaključek getJSON
}

function getSearchData(keyword){

  var matchingRecipe = [];
  for(index in podatki["Recepti"]){
    var name = podatki["Recepti"][index]["Ime"];

    if(podatki["Recepti"][index]["Ime"].toUpperCase().includes(keyword.toUpperCase())){
        matchingRecipe.push({"Ime":podatki["Recepti"][index]["Ime"],"ID":index });
    }
  }

  return matchingRecipe;

}

function getSearchResult(){
  var input = document.getElementById("search");
  var data = getSearchData(input.value);
  //Return data
}

function getDate(){

	var today = new Date();
	var currentDate = (today.getMonth()+1) +'/'+  (today.getDate()) +'/'+ today.getFullYear();
	return currentDate;

}

function getIngridiendStatus(element){

  var purchasedDate = element["DatumNakupa"];
  var uporabnost = podatki["Sestavine"][element["ID"]]["Uporabnost"];
  var today = new Date();
  var currentDate = (today.getMonth()+1) +'/'+  (today.getDate()) +'/'+ today.getFullYear();
  var milis = Date.parse(currentDate)-Date.parse(purchasedDate);
  var days = milis/1000/60/60/24;

  if(uporabnost >  days && uporabnost - 4 < days){
      return 1; //Rumena
  }else if(days >= uporabnost){
      return 2; //Rdeca
  }else{
      return 0; //Zelena
  }
}

function checkIfExistInFridge(id,kolicina){
	var i;

	for(index in podatki["Hladilnik"]){

		if(podatki["Hladilnik"][index]["ID"] == id){
			podatki["Hladilnik"][index]["Kolicina"] = (parseInt(podatki["Hladilnik"][index]["Kolicina"]) + parseInt(kolicina)).toString();
			return;
		}
		i = index;
	}

	podatki["Hladilnik"].push({"ID": id.toString(), "DatumNakupa":getDate(), "Kolicina":kolicina});

}

function removeE(id, idSestavine) {
	checkIfExistInFridge(idSestavine,podatki["Seznam"][id]["Kolicina"]);

	document.getElementById(id).remove();
	podatki["Seznam"].splice(id,1);
	saveDataToBrowser();
  loadShoppingList();
  updateFridge(false);
}

function loadShoppingList() {

	var div = document.getElementById("nakupovalni_listek_polje_id");
	div.innerHTML = "";

	for(var i = 0; i < podatki["Seznam"].length; i++) {
		 var idSestavine = podatki['Seznam'][i]['ID'];
         var imeSestavine = podatki["Sestavine"][idSestavine]["Ime"];
         var kolicina = podatki['Seznam'][i]["Kolicina"];
		 var idElementa = i;

         var data =  `
         <div class="cnt emp" style="padding: 0;" id="` + idElementa + `">
					<div class="cnt" style="padding:0; width:100%;">
					  <div class="holder">` + kolicina + `x ` + imeSestavine + `</div>
					</div>
					<div type="button" onclick="removeE('` + idElementa + `',` + idSestavine + `)" class="key blue_button" style="min-width: 24px; font-size: 24px; text-align: center;">x</div>
				  </div>
         `;
         div.innerHTML =  div.innerHTML + data;
	}


}

function updateFridge(flag){

  var div = document.getElementById("Hladilnik");
  div.innerHTML = "";

  color = ["#6fa832","#F8B307", "#E04837"];


  for(var index in podatki["Hladilnik"]) {
         var idSestavine = podatki['Hladilnik'][index]['ID'];
         var imeSestavine = podatki["Sestavine"][idSestavine]["Ime"];
         var kolicina = podatki['Hladilnik'][index]["Kolicina"];
         var i = getIngridiendStatus(podatki['Hladilnik'][index]);
         var data =  `
         <div class="cnt emp" style="padding: 0;">
         <div class="cnt" style="padding:0; width:100%;">
           <div class="holder">` + imeSestavine + `</div>
         </div>
         <div class="key" style = 'background-color:` + color[i] + `'>` + kolicina + `</div>
         </div>
         `;
         div.innerHTML = div.innerHTML + data;

     }

     if(flag == 1){
       alert("Your fridge has been updated!")
     }
}

function saveDataToBrowser(){

  var jsonString = JSON.stringify(podatki);
  window.localStorage.setItem("podatki", jsonString);

}
