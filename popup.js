document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');
  let jsDisabled = false; // 현재 탭의 자바스크립트 실행 상태 (false: 활성화, true: 중단)

  toggleBtn.addEventListener('click', () => {
    // 현재 활성 탭 찾기
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const activeTab = tabs[0];
      jsDisabled = !jsDisabled;
      // background 스크립트로 메시지 전달하여 자바스크립트 실행 중단/재개
      chrome.runtime.sendMessage({ tabId: activeTab.id, disable: jsDisabled });
      toggleBtn.textContent = jsDisabled ? "Enable JavaScript" : "Disable JavaScript";
    });
  });
});
