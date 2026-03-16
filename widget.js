(function() {
  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz52PULk_pBx61eKuBRSTQcEygKfjFXH-MHd7dHeOuUdRBbx3Hdss7BCwvS7nBJcfFW/exec';
  var SUPPORT_EMAIL = 'support@wistore.dk';
  var THRESHOLD = 0.35;

  // Inject CSS
  var css = '#wsc-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:#1a1a2e;border:none;cursor:pointer;z-index:99999;box-shadow:0 4px 16px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center}' +
    '#wsc-btn svg{width:26px;height:26px;fill:#fff}' +
    '#wsc-win{position:fixed;bottom:90px;right:24px;width:340px;max-height:500px;background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,0.15);display:none;flex-direction:column;z-index:99998;font-family:Arial,sans-serif;overflow:hidden}' +
    '#wsc-head{background:#1a1a2e;color:#fff;padding:14px 18px;display:flex;align-items:center;gap:10px}' +
    '#wsc-head-text{flex:1}' +
    '#wsc-head-title{font-size:15px;font-weight:bold}' +
    '#wsc-head-sub{font-size:11px;opacity:0.7;margin-top:2px}' +
    '#wsc-close{background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:0;line-height:1}' +
    '#wsc-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#f7f7f5;min-height:200px}' +
    '.wsc-bot{background:#fff;border:1px solid #e5e5e0;border-radius:14px;padding:10px 13px;font-size:13px;line-height:1.5;color:#1a1a2e;max-width:88%;align-self:flex-start}' +
    '.wsc-user{background:#1a1a2e;color:#fff;border-radius:14px;padding:10px 13px;font-size:13px;line-height:1.5;max-width:88%;align-self:flex-end}' +
    '.wsc-wait{background:#fff;border:1px solid #e5e5e0;border-radius:14px;padding:12px 16px;align-self:flex-start;font-size:13px;color:#999}' +
    '#wsc-inp-area{padding:10px 14px;background:#fff;border-top:1px solid #e5e5e0;display:flex;gap:8px;align-items:center}' +
    '#wsc-inp{flex:1;border:1px solid #ddd;border-radius:10px;padding:8px 11px;font-size:13px;outline:none;font-family:Arial,sans-serif;color:#1a1a2e;background:#fafaf8}' +
    '#wsc-send{width:36px;height:36px;border-radius:10px;background:#1a1a2e;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}' +
    '#wsc-send svg{width:16px;height:16px;fill:#fff}' +
    '#wsc-email-area{padding:12px 14px;background:#fff;border-top:1px solid #e5e5e0;display:none;flex-direction:column;gap:8px}' +
    '#wsc-email-info{font-size:12px;color:#666;margin:0}' +
    '#wsc-email-inp{border:1px solid #ddd;border-radius:10px;padding:8px 11px;font-size:13px;outline:none;font-family:Arial,sans-serif;color:#1a1a2e}' +
    '#wsc-email-btn{background:#1a1a2e;color:#fff;border:none;border-radius:10px;padding:9px;font-size:13px;font-weight:bold;cursor:pointer}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Build HTML
  var btn = document.createElement('button');
  btn.id = 'wsc-btn';
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>';
  document.body.appendChild(btn);

  var win = document.createElement('div');
  win.id = 'wsc-win';
  win.innerHTML =
    '<div id="wsc-head">' +
      '<div id="wsc-head-text">' +
        '<div id="wsc-head-title">Wistore Support</div>' +
        '<div id="wsc-head-sub">Svar inden for 5 hverdage</div>' +
      '</div>' +
      '<button id="wsc-close">&#x2715;</button>' +
    '</div>' +
    '<div id="wsc-msgs">' +
      '<div class="wsc-bot">Hej! Hvad kan jeg hj\u00e6lpe dig med?</div>' +
    '</div>' +
    '<div id="wsc-inp-area">' +
      '<input type="text" id="wsc-inp" placeholder="Skriv dit sp\u00f8rgsm\u00e5l..." />' +
      '<button id="wsc-send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>' +
    '</div>' +
    '<div id="wsc-email-area">' +
      '<p id="wsc-email-info">Jeg fandt ikke et svar. Indtast din email, s\u00e5 kontakter vi dig inden for 5 hverdage.</p>' +
      '<input type="email" id="wsc-email-inp" placeholder="din@email.dk" />' +
      '<button id="wsc-email-btn">Send til support</button>' +
    '</div>';
  document.body.appendChild(win);

  // Wire up logic
  var closeBtn = document.getElementById('wsc-close');
  var msgs = document.getElementById('wsc-msgs');
  var inp = document.getElementById('wsc-inp');
  var sendBtn = document.getElementById('wsc-send');
  var emailArea = document.getElementById('wsc-email-area');
  var emailInp = document.getElementById('wsc-email-inp');
  var emailBtn = document.getElementById('wsc-email-btn');
  var inpArea = document.getElementById('wsc-inp-area');
  var lastQ = '';

  btn.onclick = function() {
    win.style.display = win.style.display === 'flex' ? 'none' : 'flex';
  };
  closeBtn.onclick = function() {
    win.style.display = 'none';
  };

  function addMsg(text, cls) {
    var d = document.createElement('div');
    d.className = cls;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showWait() {
    var d = document.createElement('div');
    d.className = 'wsc-wait';
    d.id = 'wsc-wait';
    d.textContent = '...';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideWait() {
    var w = document.getElementById('wsc-wait');
    if (w) { w.parentNode.removeChild(w); }
  }

  function ask(q) {
    lastQ = q;
    addMsg(q, 'wsc-user');
    inp.value = '';
    showWait();
    sendBtn.disabled = true;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', SCRIPT_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        hideWait();
        sendBtn.disabled = false;
        if (xhr.status === 200) {
          try {
            var data = JSON.parse(xhr.responseText);
            if (data.found && data.confidence >= THRESHOLD) {
              addMsg(data.answer, 'wsc-bot');
            } else {
              addMsg('Jeg er ikke sikker. Vil du have os til at kontakte dig?', 'wsc-bot');
              inpArea.style.display = 'none';
              emailArea.style.display = 'flex';
            }
          } catch(e) {
            addMsg('Der opstod en fejl. Kontakt os pa ' + SUPPORT_EMAIL, 'wsc-bot');
          }
        } else {
          addMsg('Der opstod en fejl. Kontakt os pa ' + SUPPORT_EMAIL, 'wsc-bot');
        }
      }
    };
    xhr.send(JSON.stringify({ action: 'search', question: q }));
  }

  sendBtn.onclick = function() {
    var q = inp.value.replace(/^\s+|\s+$/g, '');
    if (q) { ask(q); }
  };

  inp.onkeydown = function(e) {
    if (e.keyCode === 13) {
      var q = inp.value.replace(/^\s+|\s+$/g, '');
      if (q) { ask(q); }
    }
  };

  emailBtn.onclick = function() {
    var email = emailInp.value.replace(/^\s+|\s+$/g, '');
    if (!email || email.indexOf('@') === -1) {
      emailInp.style.borderColor = '#cc0000';
      return;
    }
    emailBtn.textContent = 'Sender...';
    emailBtn.disabled = true;

    var xhr2 = new XMLHttpRequest();
    xhr2.open('POST', SCRIPT_URL, true);
    xhr2.setRequestHeader('Content-Type', 'application/json');
    xhr2.onreadystatechange = function() {
      if (xhr2.readyState === 4) {
        emailArea.innerHTML = '<p style="color:#3b6d11;font-size:13px;padding:4px 0;">Tak! Vi vender tilbage inden for 5 hverdage.</p>';
      }
    };
    xhr2.send(JSON.stringify({ action: 'escalate', question: lastQ, customerEmail: email }));
  };
})();
