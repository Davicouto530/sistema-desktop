console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain } = require('electron')

//Esta linha está relacionado ao preload.js
const path = require('node:path')

//Importação dos métodos conectar o e desconecatr (do modulo de conexão)
const { conectar, desconectar } = require("./database.js")

//Importação do schema cliente conectar e desconectar (módulo de conexão)
const clientModel = require("./src/models/Clientes.js")

//Janela principal
let win
const createWindow = () => {
    //A linha abaixo define o tema (claro ou escuro)
    nativeTheme.themeSource = 'dark' //Duas opções para deixar a tela (escuro(dark) / claro(light))
    win = new BrowserWindow({
        width: 800,
        height: 600,
        // autoHideMenuBar: true,
        // minimizabl: false,
        resizable: false,

        //Ativação do preload.js
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    //Menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')

    //Recebimento dos pedidos do renderizador para abertura da janelas (botões), autorizados no preload.js
    ipcMain.on('client-window', () => {
        clienteWindow()
    })

    ipcMain.on('os-window', () => {
        osWindow()
    })

}

//Janela sobre
function aboutWindow() {
    nativeTheme.themeSource = 'light'

    //A linha abaixo obtem a janela principal
    const main = BrowserWindow.getFocusedWindow()

    let about

    //Estabelecer uma relação hierarquica sobre janela
    if (main) {
        //Criar a janela sobre
        about = new BrowserWindow({
            width: 360,
            height: 220,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: main,
            modal: true
        })
    }
    //Carreegar o documento HTML na janela
    about.loadFile('./src/views/sobre.html')
}

//Janela clientes
let client

function clienteWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        client = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            parent: main,
            modal: true,
            //Ativação do preload.js
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    client.loadFile('./src/views/cliente.html')
    client.center()//centralizar a tela
}

//Janela os
let os

function osWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        os = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            parent: main,
            modal: true
        })
    }
    os.loadFile('./src/views/OS.html')
    os.center()
}

//Iniciar aplicativo
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//Reduzir logs não criticos
app.commandLine.appendSwitch('log-level', '3')


// iniciar a conexão com o banco de dados (pedido direto do preload.js)
ipcMain.on('db-connect', async (event) => {
    let conectado = await conectar()
    // se conectado for igual a true
    if (conectado) {
        // enviar uma mensagem para o renderizador trocar o ícone
        setTimeout(() => {
            event.reply('db-status', "conectado")
        }, 500)
    }
})

// IMPORTANTE! Desconectar do banco de dados quando a aplicação for encerrada
app.on('before-quit', () => {
    desconectar()
})

//Templete do menu
const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Clientes',
                click: () => clienteWindow()
            },
            {
                label: 'OS',
                click: () => osWindow()
            },
            {
                label: 'Nome completo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'Alt+F4'
            }
        ]
    },
    {
        label: 'Relatório',
        submenu: [
            {
                label: 'Clientes'
            },
            {
                label: 'OS aberta'
            },
            {
                label: 'OS concluídas'
            }
        ]
    },
    {
        label: 'Ferramentas',
        submenu: [
            {
                label: 'Aplicar zoom',
                role: 'zoomin'
            },
            {
                label: 'Reduzidir',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            },
            {
                type: 'separator'
            },
            {
                label: 'Recarregar',
                role: 'reload'
            },
            {
                label: 'Ferramenta do desenvolvedor',
                role: 'toggleDevTools'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]

// ===========================================================
//Clientes - CRUD CREATE

// Recebimento do objeto que contem os dados do cliente 
ipcMain.on('new-client', async (event, client) => {
    //Importante! Teste de recebimento dos dados do cliente
    console.log(client)
    // Cadastrar a  estrtura de dados no banco de dados no mongodb
    try{
        //Criar uma nova estrutura de dados usando a classe modelo
        //Atenção! OS atributos precisam ser identicos ao modelo de dados clientes.js
        //e os valores são definidos pelo conteúdo ao objeto client
        const newClient = new clientModel({
            nomeCliente: client.nameCli,
            cpfCliente: client.cpfCli,
            emailCliente: client.emailCli,
            foneCliente: client.foneCli,
            cepCliente: client.cepCli,
            logradouroCliente: client.logfCli,
            numeroCliente: client.numCli,
            complementoCliente: client.complementoCli,
            bairroCliente: client.bairroCli,
            cidadeCliente: client.cidadeCli,
            ufCliente: client.ufCli
        })
        //Salvar os dados dos clientes no banco de dados
        await newClient.save()
    }catch (error){
        console.log(error)
    }
})

//Fim - Clientes - CRUD CREATE==============================