chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF',
  })
})

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
    // 检索动作标记，检查扩展状态是否为“ON”或“OFF”
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id })
    // 下一个状态总是相反的
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'

    // 将动作标记设置为下一个状态
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    })
    // ...
    if (nextState === 'ON') {
      // 当用户打开扩展时插入CSS文件
      await chrome.scripting.insertCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id },
      })
    } else if (nextState === 'OFF') {
      // 当用户关闭扩展时，删除CSS文件
      await chrome.scripting.removeCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id },
      })
    }
  }
})
