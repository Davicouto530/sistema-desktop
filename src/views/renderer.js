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