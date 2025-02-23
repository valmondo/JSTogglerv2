let disabledTabs = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.tabId !== undefined && request.disable !== undefined) {
    const tabId = request.tabId;
    if (request.disable) {
      // 자바스크립트 실행 중단: 탭에 디버거를 attach하고 스크립트 실행을 disable
      chrome.debugger.attach({ tabId: tabId }, "1.3", () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          return;
        }
        chrome.debugger.sendCommand({ tabId: tabId }, "Debugger.setScriptExecutionDisabled", { value: true }, () => {
          disabledTabs[tabId] = true;
          console.log(`JavaScript disabled on tab ${tabId}`);
        });
      });
    } else {
      // 자바스크립트 실행 재개: 스크립트 실행을 enable한 후 디버거를 detach
      chrome.debugger.sendCommand({ tabId: tabId }, "Debugger.setScriptExecutionDisabled", { value: false }, () => {
        chrome.debugger.detach({ tabId: tabId }, () => {
          delete disabledTabs[tabId];
          console.log(`JavaScript enabled on tab ${tabId}`);
        });
      });
    }
  }
});
