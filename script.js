// Referencias a los tres <tbody> vacíos del HTML, donde iremos insertando filas
const tbodyAmerica = document.querySelector("#america");
const tbodyEuropa = document.querySelector("#europa");
const tbodyOtros = document.querySelector("#otros");

// Dirección desde donde vamos a pedir los datos (JSON).
const ENDPOINT = "https://api.myjson.online/v1/records/3d1ca52c-1450-4cff-bf21-33785f24b59b";

// Listas de países para clasificar cada universidad por continente.
const paisesAmerica = ["Argentina", "Brazil", "Canada", "Chile", "Colombia", "Mexico", "United States"];
const paisesEuropa = ["Austria", "Belgium", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Ireland", "Italy", "Netherlands", "Sweden", "Switzerland", "United Kingdom"];

// Contadores para el resumen final
var cuenta_america = 0;
var cuenta_europa = 0;
var cuenta_otros = 0;

// 1) Pedimos los datos
fetch(ENDPOINT)
    // 2) Primera respuesta (cruda)
    .then((respuesta) => {
        if (!respuesta.ok) {
            throw new Error("Error HTTP: " + respuesta.status);
        }
        return respuesta.json();
    })
    // 3) Datos ya convertidos en objeto/array de JavaScript
    .then((datos) => {
        // Si "data" ya es la lista la usa; si hay un "data" dentro de otro "data", entra un nivel más
        const universidades = Array.isArray(datos.data) ? datos.data : datos.data.data;
        console.log("Datos recibidos:", universidades);

        // 4) Recorremos cada universidad y decidimos en qué tabla va
        universidades.forEach((u) => {
            const esAmericana = paisesAmerica.some((pais) => u.location.includes(pais));
            const esEuropea = paisesEuropa.some((pais) => u.location.includes(pais));

            // location viene como "Ciudad, País": separamos las dos partes
            const partes = u.location.split(", ");
            const pais = partes.pop();
            const ciudad = partes.join(", ");

            // 5) Agregamos una fila al <tbody> que corresponde
            if (esAmericana) {
                tbodyAmerica.innerHTML += `<tr><td>${u.rank}</td><td>${u.name}</td><td>${ciudad}</td><td>${pais}</td></tr>`;
                cuenta_america = cuenta_america + 1;
            } else if (esEuropea) {
                tbodyEuropa.innerHTML += `<tr><td>${u.rank}</td><td>${u.name}</td><td>${ciudad}</td><td>${pais}</td></tr>`;
                cuenta_europa = cuenta_europa + 1;
            } else {
                tbodyOtros.innerHTML += `<tr><td>${u.rank}</td><td>${u.name}</td><td>${ciudad}</td><td>${pais}</td></tr>`;
                cuenta_otros = cuenta_otros + 1;
            }
        });

        // 6) Resumen con bolitas
       document.querySelector("#puntos_americanos").innerHTML = bolitas(cuenta_america, "🔴");
document.querySelector("#puntos_europeos").innerHTML = bolitas(cuenta_europa, "🔵");
document.querySelector("#puntos_otros").innerHTML = bolitas(cuenta_otros, "🟢");
    })
    // 7) Si algo falla, lo muestra en la consola (F12)
    .catch((error) => {
        console.error("Algo salió mal:", error);
    });

// Muestra x bolitas. Por ejemplo: bolitas(3) => " ● ● ● "
function bolitas(x, simbolo = "●") {
    var visual = "";
    for (let i = 0; i < x; i++) {
       visual += '<span class="cuadrado"></span>';
    }
    return "<span>" + visual + "</span>";
}