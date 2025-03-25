/**
 * Processo de renderização
 */

console.log("Processor de renderização")

// envio de uma mensagem para o main abrir a janela cliente
function client() {
    console.log("teste")
    //uso da api(autorizada no preload.js)
    api.clientWindow()
}

function os() {
    //console.log("teste")
    //uso da api(autorizada no preload.js)
    api.osWindow()
}

// troca do icone do banco de dados (usando a api do preload.js)
api.dbStatus((event, message) => {
    // teste do recebimento da mensagem
    console.log(message)
    if (message === "conectado") {
        document.getElementById('statusdb').src = "../public/img/dbon.png"
    } else {
        document.getElementById('statusdb').src = "../public/img/dboff.png"
    }
}
)