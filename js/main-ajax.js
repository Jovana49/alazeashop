//callback f-ja
function ajaxCB(imeFajla, rezultat){ 
    $.ajax({
        url: "data/" + imeFajla,
        method: "get",
        dataType: "json",
        success: rezultat,
        error: function(xhr, error, status){
            console.log(xhr)  
        }
    });
}

window.onload = function () {
    //ajax zahtev - meni
    ajaxCB("meni.json", function(rezultat) {
        kreirajMeni(rezultat);
    })

    //ajax zahtev - proizvodi
    ajaxCB("proizvodi.json", function(rezultat) {
        localStorage.setItem("nizProizvoda", JSON.stringify(rezultat));
        ispisProizvoda(rezultat);
    })

    //ajax zahtev - kategorije
    ajaxCB("kategorije.json", function(rezultat) {
        kreirajCheckBoxKat(rezultat);
    })

    //ajax zahtev - sortiranje
    ajaxCB("sortiranje.json", function(rezultat) {
        kreirajPadajucuListu("Sort by", "sortiraj", "#sortiranje", rezultat);
    })
    
}
   

//f-ja za kreiranje menija
function kreirajMeni(nizMeni){
    let html = 
    `<nav class="classy-navbar justify-content-between" id="alazeaNav">
        <a href="index.html" class="nav-brand"><img src="img/core-img/logo.png" alt="Logo image"></a>
        <div class="classy-navbar-toggler">
            <span class="navbarToggler"><span></span><span></span><span></span></span>
        </div>
        <div class="classy-menu">
            <div class="classycloseIcon">
                <div class="cross-wrap"><span class="top"></span><span class="bottom"></span></div>
            </div>
            <div class="classynav">
                <ul>`;
    
    for(let stavkaMenija of nizMeni)
        html+=`<li><a href="${stavkaMenija.href}">${stavkaMenija.tekst}</a></li>`;
    
    html +=`    </ul>
                <div id="searchIcon">
                    <i class="fa fa-search" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    </nav>
    <div class="search-form">
        <form action="#" method="get">
            <input type="search" name="search" id="search" placeholder="Type keywords &amp; press enter..." />
            <button type="submit" class="d-none"></button>
        </form>
        <div class="closeIcon"><i class="fa fa-times" aria-hidden="true"></i></div>
    </div>`;
    $("#meni").html(html);
}
//f-ja za ispis proizvoda
function ispisProizvoda(nizProizvoda) {
    let html = '';
   
    if(nizProizvoda.length == 0){
        html = `<div class="row">
                    <div class="col-12">
                        <p class="alert alert-danger">Trenutno nema proizvoda.</p>
                    </div>
                </div>`;
    }
    else {
        for(let proizvod of nizProizvoda){
            html += `<div class="col-12 col-sm-6 col-lg-4">
        <div class="single-product-area mb-50">
            <!-- Product Image -->
            <div class="product-img">
                <img src="${proizvod.slika}" alt="${proizvod.naziv}">
                <!-- Product Tag -->
                <div class="product-tag">
                    <a href="#">Hot</a>
                </div>
                <div class="product-meta d-flex">
                    <a href="cart.html" class="add-to-cart-btn">Add to cart</a>
                </div>
            </div>
            <!-- Product Info -->
            <div class="product-info mt-15 text-center">
                    <p>${proizvod.naziv}</p>
                <h6>${proizvod.cena}</h6>
            </div>
        </div>
    </div>`;
        }
    }
    $("#proizvodi").html(html);
}
//f-ja za kreiranje check box - kategorije
function kreirajCheckBoxKat(nizKategorija) {
    let html = '';
   
    if(nizKategorija.length == 0){
        html = `<div class="row">
                    <div class="col-12">
                        <p class="alert alert-danger">Trenutno nema proizvoda.</p>
                    </div>
                </div>`;
    }
    else {
        for(let kategorija of nizKategorija){
            html += `<div class="custom-control custom-checkbox d-flex align-items-center mb-2">
            <input type="checkbox" class="custom-control-input kategorija" id="customCheck${kategorija.id}">
            <label class="custom-control-label" for="customCheck${kategorija.id}">${kategorija.naziv} <span class="text-muted">(72)</span></label>
        </div>`;
        }
    }
    $("#kategorije").html(html);
}


 // filtriranje po kategoriji
    
 $(document).on("click", ".kategorija", function(){
    let idKat = this.value;
    console.log(idKat)

    let filtriraniProizvodi = proizvodi.filter(objProizvod => objProizvod.idKat == idKat);

    console.log(filtriraniProizvodi)
    if(idKat == 0){
        ispisProizvoda(proizvodi);
    }
    else{
        ispisProizvoda(filtriraniProizvodi);
    }

})


// f-ja za kreiranje dinamicke padajuce liste
function kreirajPadajucuListu(labela, id, divIspis, niz){
    let html = `<div class="form-group">
        <label>${labela}</label>
        <select id = "sort" class="custom-select widget-title" id="${id}">
            <option value="0">Select</option>`;
            for(let objekat of niz){
                html += `<option value="${objekat.id}">${objekat.naziv}</option>`
            }
    
    html += `</select>
    </div>`;
  
    $(divIspis).html(html);
}




    $(document).on("change", "#sort", function(){
        let tipSortiranja = $(this).val();

    //console.log(tipSortiranja)
    var proizvodi = JSON.parse(localStorage.getItem("nizProizvoda"));
    //console.log(proizvodi)
    
    proizvodi.sort(function(a, b){
        // cena rastuce
        if(tipSortiranja == 1)
            return a.cena - b.cena;

        // cena opadajuce
        if(tipSortiranja == 2)
           return b.cena - a.cena;

        // naziv rastuce
        if(tipSortiranja == 3){
            if(a.naziv < b.naziv){
                return -1;
            }
            else if(a.naziv > b.naziv){
                return 1;
            }
            else{
                return 0;
            }
        }

        // naziv opadajuce
        if(tipSortiranja == 4){
            if(a.naziv > b.naziv){
                return -1;
            }
            else if(a.naziv < b.naziv){
                return 1;
            }
            else{
                return 0;
            }
        }
    })

    ispisProizvoda(proizvodi);
    
})
//FORMA
var inputi = [
    {
        "type": "text",
        "id": "contact-name",
        "placeholder": "Your name"
    },
    {
        "type": "email",
        "id": "contact-email",
        "placeholder": "Your Email"
    },
    {
        "type": "text",
        "id": "contact-subject",
        "placeholder": "Subject"
    }
];
var lista = [
    {
        "value": 0,
        "text": "Choose country"
    },
    {
        "value": 1,
        "text": "New York"
    },
    {
        "value": 2,
        "text": "France"
    },
    {
        "value": 3,
        "text": "England"
    },
    {
        "value": 4,
        "text": "Serbia"
    },
];

var poruka = {
    "name": "message",
    "id": "message",
    "cols": "30",
    "rows": "10",
    "placeholder": "Message"
};
var taster = {
    "type": "submit",
    "class": "btn alazea-btn mt-15",
    "text": "Send Message"
};

ispisForme(inputi, poruka, lista, taster);
    //ispis forme
    function ispisForme(inputi, poruka, lista, taster){
        var divIspisForme = document.getElementById("forma");
        let html = '';
        for(let i of inputi){
            html += `<div class="col-12 col-md-6">
            <div class="form-group">
                <input type="${i.type}" class="form-control" id="${i.id}" placeholder="${i.placeholder}"><p></p>
            </div>
        </div>`;
        console.log(html);
        }
        html += `<div id = "contact-country" class = "col-12 col-md-6">
        <select name = "dryava" id = "drzava" class = "form-control">`;
        for(let l of lista){
            html+=`<option value = ${l.value}>${l.text}</option>`
        }
        html += `</select><p></p>
        </div>
        <div class="col-12">
            <div class="form-group">
                <textarea class="form-control" name="${poruka.name}" id="${poruka.id}" cols="${poruka.cols}" rows="${poruka.rows}" placeholder="${poruka.placeholder}"></textarea> <p></p>
            </div>
        </div>
        <div class="col-12">
            <button type="${taster.type}" class="${taster.class}" onclick = "validacijaForme()">${taster.text}</button>
        </div>`;
        $(divIspisForme).html(html);
    
    }

    //VALIDACIJA FORME
    function validacijaForme() {
        let kontaktForma = document.getElementById("forma");
        let imePrezime = document.querySelector("#contact-name");
        let vrednostImena = imePrezime.value;
        let mejl = document.querySelector("#contact-email");
        let vrednostMejl = mejl.value;
        let naslov = document.getElementById("contact-subject");
        let drzava = document.querySelector("#country");
        let poruka = document.querySelector("#message");
        let vrednostPoruka = poruka.value;
    
        // Ime i prezime
    
        let regExIme = /^[A-ZČĆŠĐŽ]{1}[a-zčćšđž]{2,15}\s[A-ZČĆŠĐŽ]{1}[a-zčćšđž]{2,15}$/;
        if (regExIme.test(vrednostImena)) {
            document.querySelector("#contact-name > p").classList.remove("text-danger");
            document.querySelector("#contact-name > p").innerHTML = "You have successfully completed the form!";
            document.querySelector("#contact-name > p").classList.add("text-success");
        }
        else {
            document.querySelector("#contact-name > p").innerHTML = "Name and surname are not entered correctly. (Example: Ann Martin)";
            document.querySelector("#contact-name > p").classList.add("text-danger");
        }
    
        // E-mail adresa
        
        let regExMejl = /^\w([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
        if(regExMejl.test(vrednostMejl)) {
            document.querySelector("#contact-email > p").classList.remove("text-danger");
            document.querySelector("#contact-email > p").innerHTML = "You have successfully filled in the field!";
            document.querySelector("#contact-email > p").classList.add("text-success");
        }
        else {
            document.querySelector("#contact-email > p").innerHTML = "Email address not entered correctly. (Example: ann.Martin00@gmail.com)";	
            document.querySelector("#contact-email > p").classList.add("text-danger");
        }

        // Drzava
	
	if (drzava.options[city.options.selectedIndex].value == 0) {
		document.querySelector("contact-country > p").innerHTML = "You have to choose a country!";
		document.querySelector("contact-country > p").classList.add("text-danger");
	}
	else {
		document.querySelector("contact-country > p").classList.remove("text-danger");
		document.querySelector("contact-country > p").innerHTML = "You have successfully chosen a country!";
		document.querySelector("contact-country > p").classList.add("text-success");
	}
        // Poruka
	
	if (vrednostPoruka.length <= 0) {
		document.querySelector("#message > p").innerHTML = "You did not enter a message!";
		document.querySelector("#message > p").classList.add("text-danger");
	}
	else {
		document.querySelector("#message > p").classList.remove("text-danger");
		document.querySelector("#message > p").innerHTML = "The message has been forwarded!";
		document.querySelector("#message > p").classList.add("text-success");
	}
    }