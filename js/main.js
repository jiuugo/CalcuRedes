const btnCalcular = document.getElementById("btnCalcular");
const btnIpDefecto = document.getElementById("btnIpDefecto");

const ip = document.getElementById("ip");
const idBits = document.getElementById("idBits");

const idCompleta = document.getElementById("idCompleta");
const claseRed = document.getElementById("claseRed");
const mascaraRed = document.getElementById("mascaraRed");
const tipoRed = document.getElementById("tipoRed");
const wildcard = document.getElementById("wildcard");
const dirRed = document.getElementById("dirRed");
const dirBroadcast = document.getElementById("dirBroadcast");

const idBinario = document.getElementById("idBinario");
const binarioSubred = document.getElementById("binarioSubred");
const binarioWild = document.getElementById("binarioWild");
const binarioDirRed = document.getElementById("binarioDirRed");
const binarioDirBroadcast = document.getElementById("binarioDirBroadcast");

const numHost = document.getElementById("numHost");
const numSubredes = document.getElementById("numSubredes");


const tblInfo = document.getElementById("tblInfo");
const tblInfo2 = document.getElementById("tblInfo2");

let octetosIp = [];
let ipCompleta = "";
let mascara = "";

btnCalcular.addEventListener("click", () => {
    accionCalcular();
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    btnCalcular.click();
  }
});

btnIpDefecto.addEventListener("click", () => {
    const ipInput = document.querySelector(".octeto");
 
    // Llamada a la API de ipify para obtener la IP pública
    fetch("https://api.ipify.org?format=json")
        .then(response => response.json())
        .then(data => {
            ipInput.value = data.ip; // Coloca la IP pública en el input
        })
        .catch(error => {
            console.error("Error al obtener la IP pública:", error);
        });
});

function colorearBinario(ipBinario, cidr, claseIP) {
    const bitsRedClase = calculaCidrDefecto(claseIP); // p. ej., A → 8, B → 16, etc.
    const bitsSubred = cidr - bitsRedClase;
 
    let html = "";
    let bitIndex = 0;
 
    for (let i = 0; i < ipBinario.length; i++) {
        const char = ipBinario[i];
 
        if (char === ".") {
            html += "<span style='color:gray;'>.</span>";
            continue;
        }
 
        let color = "black";
 
        if (bitIndex < bitsRedClase) {
            color = "red"; // Parte de red
        } else if (bitIndex < cidr) {
            color = "orange"; // Parte de subred
        } else {
            color = "blue"; // Parte de host
        }
 
        html += `<span style="color:${color}">${char}</span>`;
        bitIndex++;
    }
 
    return html;
}

function accionCalcular() {
    ipCompleta = ip.value;

    if (!validarIP()) return;

    octetosIp = obtieneOctetos(ipCompleta);




    muestraResultado();

    tblInfo.style.display = "table";
    tblInfo2.style.display = "table";

}

//aqui irá la función que valida el input y le da el color correspondiente
ip.addEventListener("input", (e) => {

});


function obtieneOctetos(direccion) {
    let octetos = [];

    for (let i = 0; i < direccion.length; i++) {
        if (direccion[i] == ".") {
            octetos.push(direccion.substring(0, i));
            direccion = direccion.substring(i + 1);
            i = 0;
        }
    }
    octetos.push(direccion);
    return octetos;
}




function validarIP() {

    const regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

    if (regex.test(ipCompleta)) {
        return true;

    } else {
        alert("La dirección IP no es válida. Asegúrate de que cada octeto esté entre 0 y 255.");
        return false;
    }

}

let usandoPorDefecto = false;
function muestraResultado() {

    let claseIP = calculaClaseIP();

    if(!validaCidr()){
        idBits.value = calculaCidrDefecto(claseIP);
        usandoPorDefecto = true;
    }
    usandoPorDefecto = false;


    let mascaraBinario = calculaMascaraCidrBinario(idBits.value);
    mascara = direccionADecimal(mascaraBinario);
    
    let tipo = calculaTipoRed(claseIP);
    let wildcardValor = calculaWildcard();


    let ipABinario = direccionABinario(ipCompleta);
    let wildcardABinario = direccionABinario(wildcardValor);


    let direccionRedBinario = calculaDireccionRed(ipABinario, mascaraBinario);
    let direccionDecimal = direccionADecimal(direccionRedBinario);

    let broadcastBinario = calculaBroadcast(direccionRedBinario, mascaraBinario);
    let broadcastDecimal = direccionADecimal(broadcastBinario);


    idCompleta.innerHTML = ipCompleta;
    claseRed.innerHTML = claseIP;
    mascaraRed.innerHTML = mascara;
    tipoRed.innerHTML = tipo;
    wildcard.innerHTML = wildcardValor;
    dirRed.innerHTML = direccionDecimal;
    dirBroadcast.innerHTML = broadcastDecimal;

    idBinario.innerHTML = colorearBinario(ipABinario, parseInt(idBits.value), claseIP);
    binarioSubred.innerHTML = mascaraBinario;
    binarioWild.innerHTML = wildcardABinario;
    binarioDirRed.innerHTML = direccionRedBinario;
    binarioDirBroadcast.innerHTML = broadcastBinario;

    numHost.innerHTML = Math.pow(2, 32 - idBits.value)-2;
    //arreglar el número de subredes
    numSubredes.innerHTML = Math.pow(2, idBits.value -calculaCidrDefecto(claseIP));
}

function validaCidr(){
    let regex = /^(3[0-2]|[1-2]?[0-9])$/;

    if( !regex.test(idBits.value)||usandoPorDefecto){
        return false;
    }

    return true;
}

function calculaCidrDefecto(claseIP){
        switch (claseIP) {
        case "A":
            return 8;
        case "B":
            return 16;
        case "C":
            return 24;
        default:
            return "No aplica";
    }
}

function calculaBroadcast(direccionRedBinario, mascaraBinario) {
    let dirBroadcast = "";

    for (let i = 0; i < mascaraBinario.length; i++) {
        if (mascaraBinario[i] === "0") {
            dirBroadcast += "1";
        }else dirBroadcast += direccionRedBinario[i];

    }


    return dirBroadcast;
}

function calculaDireccionRed(ipABinario, mascaraBinario) {
    let direccionRed = "";

    for (let i = 0; i < ipABinario.length; i++) {
        if (ipABinario[i] === ".") {
            direccionRed += ".";
            continue;
        }

        if (ipABinario[i] & mascaraBinario[i]) {
            direccionRed += "1";
        } else {
            direccionRed += "0";
        }
    }
    return direccionRed;
}

function direccionABinario(direccion) {
    let octetosDireccion = obtieneOctetos(direccion);
    let octetosBinario = [];

    for (octeto of octetosDireccion) {
        let binario = decimalABinario(parseInt(octeto, 10));
        let binarioNuevo = "";

        if (binario.length < 8) {
            for (let i = 0; i < 8 - binario.length; i++) {
                binarioNuevo += "0";
            }
            binarioNuevo += binario;
            binario = binarioNuevo;
        }


        octetosBinario.push(binario);
    }
    return convierteArrayADireccion(octetosBinario);
}

function direccionADecimal(direccion) {
    let octetosDireccion = obtieneOctetos(direccion);
    let octetosDecimal = [];

    for (octeto of octetosDireccion) {
        let decimal = binarioADecimal(parseInt(octeto, 2));

        octetosDecimal.push(decimal);
    }
    return convierteArrayADireccion(octetosDecimal);
}

function calculaWildcard() {
    let octetosMascara = obtieneOctetos(mascara);
    let wildcard = [];

    for (octeto of octetosMascara) {
        wildcard.push(255 - octeto);
    }
    return convierteArrayADireccion(wildcard);
}

function convierteArrayADireccion(array) {
    let direccion = "";
    for (cadena of array) {
        direccion += cadena;
        direccion += "."
    }
    direccion = direccion.substring(0, direccion.length - 1);
    return direccion;
}

function calculaClaseIP() {
    if (octetosIp[0] < 128) {
        return "A";
    }
    if (octetosIp[0] < 192) {
        return "B";
    }
    if (octetosIp[0] < 224) {
        return "C";
    }
    if (octetosIp[0] < 240) {
        return "D";
    }
    if (octetosIp[0] < 256) {
        return "E";
    }
}

function calculaMascaraCidrBinario(cidr){
    contadorBits = 0;
    dirBlank = direccionABinario("0.0.0.0");
    mascara = "";

    for(let i=0; i<dirBlank.length;i++){
        if(dirBlank[i]==="."){
            mascara += ".";
            continue;
        }
        if(contadorBits<cidr){
            mascara += "1";
            contadorBits++;
        }else mascara += "0";
    }

    return mascara;
}

function calculaMascara(claseIP) {
    switch (claseIP) {
        case "A":
            return "255.0.0.0";
        case "B":
            return "255.255.0.0";
        case "C":
            return "255.255.255.0";
        default:
            return "No aplica";
    }
}

function calculaTipoRed(claseIP) {
    switch (claseIP) {
        case "A":
            return "Red pública";
        case "B":
            return "Red privada";
        case "C":
            return "Red pública";
        default:
            return "No aplica";
    }
}

function calculaCidr() {
    let octetosMascara = obtieneOctetos(mascara);

    let mascaraBinaria = "";
    let cidr = 0;

    for (octeto of octetosMascara) {
        mascaraBinaria += decimalABinario(parseInt(octeto, 10));
    }

    for (let i = 0; i < mascaraBinaria.length; i++) {
        if (mascaraBinaria[i] == 1) {
            cidr++;
        }
    }

    return cidr;
}

function decimalABinario(decimal) {
    return decimal.toString(2);
}
function binarioADecimal(binario) {
    return binario.toString(10);
}