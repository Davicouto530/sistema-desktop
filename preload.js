/**
 * Arquivo de pré carregamento e reforço de segurança na
 * comunicação entre processos (IPC)
 */

//Importação dos recursos do framework electron 
//contextBridge (segurança) | ipcRenderer (comunicação)
const { contextBridge, ipcRenderer } = require('electron')

//Enviar ao main o pedido de conexão com o banco de dados e troca do icone no processo de renderização

//Expor (autorizar a comunicação entre processos)
contextBridge.exposeInMainWorld('api', {
    clientWindow: () => ipcRenderer.send('cliente-window'),
    osWindow: () => ipcRenderer.send('os-window'),
    dbStatus: (message) => ipcRenderer.on('db-status',message)
})

function dbStatus(message){
    ipcRenderer.on('db-status',message)
}