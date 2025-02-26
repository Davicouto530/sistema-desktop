console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain } = require('electron')

//Esta linha está relacionado ao preload.js
const path = require('node:path')

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
    ipcMain.on ('cliente-window', () => {
        clienteWindow()
    })

    ipcMain.on ('os-window', () => {
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

function clienteWindow(){
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if(main){
        client = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            parent: main,
            modal: true
        })
    }
    client.loadFile('./src/views/cliente.html')
    client.center()//centralizar a tela
}

//Janela os
let os

function osWindow(){
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if(main){
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