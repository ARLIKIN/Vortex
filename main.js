// Modules to control application life and create native browser window
// Модули для управления жизнью приложения и создания собственного окна браузера
const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  // Создаем окно браузера.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title:'Vortex',
    backgroundColor:'#051a27',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    } 
  })

  // and load the index.html of the app.
  // и загрузите index.html приложения.
  
  mainWindow.loadFile('HTML/MainScreen.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// Этот метод будет вызван, когда Электрон закончит работу
// инициализация и готова к созданию окон браузера.
// Некоторые API можно использовать только после того, как произойдет это событие.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // В macOS обычно повторно создают окно в приложении, когда
     // щелчок по значку в доке, и другие окна не открыты.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// Выйти, когда все окна закрыты, кроме macOS. Там это обычное дело
// чтобы приложения и их строка меню оставались активными, пока пользователь не выйдет
// явно с помощью Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// В этот файл вы можете включить остальную часть конкретного основного процесса вашего приложения
// код. Вы также можете поместить их в отдельные файлы и потребовать их здесь.