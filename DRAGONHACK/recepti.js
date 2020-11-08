var podatki = "{}";
var currentRecept = "";

function main(){
    $(document).ready(function(){
      if(window.localStorage.getItem("podatki") == null){

      $.getJSON('Podatki.json', function(data){
        podatki = data;
    }) //Zaključek getJSON
    .done(function(){
      saveDataToBrowser();
      updateRecepti();
    }); //END DONE
  }else{
    podatki = JSON.parse(window.localStorage.getItem("podatki"));

    saveDataToBrowser();
    updateRecepti();
  }

}); // Zaključel dokumenta


var input = document.getElementById("search");
  input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      console.log("SAve");
      getSearchResult();
    }
}); //Zakljucek addEventListener
}

function showRecipe(index){
  var recipeName = document.getElementById("selectedRecipe");
  recipeName.innerHTML = podatki["Recepti"][index]["Ime"];
  currentRecept = podatki["Recepti"][index]["Ime"];


  var allIngridiends = document.getElementById("sestavine");
  allIngridiends.innerHTML = "";

  var postopek = document.getElementById("postopek_polje_id");
  postopek.innerHTML = podatki["Recepti"][index]["Opis"];

  var missing = izpisiRecept(podatki["Recepti"][index]["Ime"]);

  for(ingridiendsIndex in podatki["Recepti"][index]["Sestavine"]){
    var ingridiend = podatki["Recepti"][index]["Sestavine"][ingridiendsIndex]["ID"];


    var missingCurrent = 0;

    for(index1 in missing){
      if(missing[index1]["ID"] == podatki["Recepti"][index]["Sestavine"][ingridiendsIndex]["ID"]){
        missingCurrent = missing[index1]["Kolicina"];
      }
    }


    var data = `<div class="cnt emp" style="padding: 0;">
    <div class="cnt" style="padding:0; width:100%;">
      <div class="holder">` + podatki["Sestavine"][ingridiend]["Ime"] + ` <b><i>(missing: ` + missingCurrent + `)</b></i></div>
    </div>
    <div class="key">` + podatki["Recepti"][index]["Sestavine"][ingridiendsIndex]["Kolicina"]  +  `</div>
    </div>`;

    allIngridiends.innerHTML += data;
  }


}

function updateRecepti(){
  var div = document.getElementById("recepti");
  div.innerHTML="";

  for(index in podatki["Recepti"]){
    var data = `<div class="cnt emp" style="padding: 0;">
    <div class="druga key" type="button" onclick="showRecipe(` + index + `)">` + `</div>
      <div class="cnt" style="padding:0; width:100%;">
        <div class="holder" id="ime_holder">` + podatki["Recepti"][index]["Ime"] +  `</div>
      </div>
    </div>`;

    div.innerHTML += data;
  }


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
  console.log("DSAD");
  var input = document.getElementById("search");
  var matchingRecipe = getSearchData(input.value);
  var div = document.getElementById("recepti");
  div.innerHTML="";

  for(index in matchingRecipe){
    var data = `<div class="cnt emp" style="padding: 0;">
    <div class="key" type="button" onclick="showRecipe(` + matchingRecipe[index]["ID"] + `)">` + `</div>
      <div class="cnt" style="padding:0; width:100%;">
        <div class="holder" id="ime_holder">` + matchingRecipe[index]["Ime"] +  `</div>
      </div>
    </div>`;

    div.innerHTML += data;
  }

}

function saveDataToBrowser(){

  var jsonString = JSON.stringify(podatki);
  window.localStorage.setItem("podatki", jsonString);

}

function izpisiRecept(recept){
  var ingridiends = getIngridiends(recept);

  if(ingridiends == null)
    return;
/*
  var output =  "<h2>" + recept + "</h2>Sestavine, ki jih je potrebno kupiti: <br>";

  for(index in ingridiends["missing"]){
    output += podatki["Sestavine"][ingridiends["missing"][index]["ID"]]["Ime"] + ", kolicina: " + ingridiends["missing"][index]["Kolicina"] + "<br>";
  }
  output += "Sestavin, ki jih imamo: <br>";
  for(index in ingridiends["available"]){
    output += podatki["Sestavine"][ingridiends["available"][index]["ID"]]["Ime"] + ", kolicina: " + ingridiends["available"][index]["Kolicina"] + "<br>";
  }*/

  return ingridiends["missing"];
}

function getRecepieIndex(name){
  for(id in podatki["Recepti"]){
    if(podatki["Recepti"][id]["Ime"] == name){
      return id;
    }
  }
  return -1;
}

function getIngridiends(name){
  var index = getRecepieIndex(name);

  if(index == -1)
    return null;
  var missing = [];
  var available = [];
  var flag = 0;
  for (id in podatki["Recepti"][index]["Sestavine"]){
    flag = 0;
    for(sestavine in podatki["Hladilnik"]){

      if(podatki["Hladilnik"][sestavine]["ID"] == podatki["Recepti"][index]["Sestavine"][id]["ID"]){
        flag=1;

          var kolicinaHladilnik = podatki["Hladilnik"][sestavine]["Kolicina"];
          var kolicinaRecept = podatki["Recepti"][index]["Sestavine"][id]["Kolicina"];
          available.push({"ID":podatki["Hladilnik"][sestavine]["ID"], "Kolicina":kolicinaHladilnik});

          if(kolicinaHladilnik - kolicinaRecept < 0){
              var manjkajocaKolicina = kolicinaRecept - kolicinaHladilnik;
              missing.push({"ID":podatki["Hladilnik"][sestavine]["ID"], "Kolicina":kolicinaRecept-kolicinaHladilnik});
          }
        break;
      }
    }


    if(flag == 0){
      missing.push({"ID":podatki["Recepti"][index]["Sestavine"][id]["ID"], "Kolicina":podatki["Recepti"][index]["Sestavine"][id]["Kolicina"]});
    }
  }

  return { "missing":missing,"available":available};
}

function addElementToSL(){

  var missing = izpisiRecept(currentRecept);
  var flag = 0;
  for(index in missing){
    flag = 0;
    for(id in podatki["Seznam"]){
      if(podatki["Seznam"][id]["ID"] == missing[index]["ID"]){
        flag = 1;
        podatki["Seznam"][id]["Kolicina"] = (parseInt(podatki["Seznam"][id]["Kolicina"]) + parseInt(missing[index]["Kolicina"])).toString();
        break;
      }
    }
    if(flag == 0){
      podatki["Seznam"].push(missing[index]);
    }
  }
  saveDataToBrowser();

}
