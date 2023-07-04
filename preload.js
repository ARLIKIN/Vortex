// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// Все API-интерфейсы Node.js доступны в процессе предварительной загрузки.
// Он имеет ту же песочницу, что и расширение Chrome.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
