/**
 * Processo de renderização
 * Tela principal
 */

console.log('Processo de renderização')

//Envio de uma mensagem para o main abrir a janela OS
function cliente(){
    console.log('Teste do botão cliente')
    //Uso da api(autorizada no preload.js)
    api.clientWindow()
}

//Envio de uma mensagem para o main abrir a janela OS
function os(){
    console.log('Teste do botão OS')
    //Uso da api(autorizada no preload.js)
    api.osWindow()
}

//troca de icone do banco de dados (usando a api do preload.js)
api.dbStatus((event,message) => {
    //Teste do recebimento da mensagem
    console.log(message)
    if(message == 'Conectado'){
        document.getElementById('statusdb').src="../public/img/dbon.png"
    }else {
        document.getElementById('statusdb').src="../public/img/dboff.png"
    }
})