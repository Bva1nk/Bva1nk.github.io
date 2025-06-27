document.addEventListener('DOMContentLoaded', function() {
    // --- WINDOWS 11 DESKTOP SIMULATION CORE LOGIC ---
    // Taskbar, Start menu, Desktop icons, Apps, Lockscreen, Terminal with crash

    // Taskbar and Start menu logic
    const startBtn = document.getElementById('win11-start-btn');
    const startMenu = document.getElementById('win11-start-menu');
    const taskbarTray = document.getElementById('win11-taskbar-tray');
    const desktop = document.getElementById('win11-desktop');

    // Start menu apps
    const apps = [
        { name: 'Edge', icon: 'https://img.icons8.com/color/48/000000/ms-edge-new.png', action: () => window.open('https://www.microsoft.com/edge', '_blank') },
        { name: 'Calculator', icon: 'https://img.icons8.com/fluency/48/000000/calculator.png', action: openCalculator },
        { name: 'Notepad', icon: 'https://img.icons8.com/fluency/48/000000/notepad.png', action: openNotepad },
        { name: 'Paint', icon: 'https://img.icons8.com/fluency/48/000000/paint.png', action: openPaint },
        { name: 'Terminal', icon: 'https://img.icons8.com/fluency/48/000000/console.png', action: openTerminal },
        { name: 'Settings', icon: 'https://img.icons8.com/fluency/48/000000/settings.png', action: openSettings },
        { name: 'Camera', icon: 'https://img.icons8.com/fluency/48/000000/camera.png', action: openCamera },
        { name: 'App Store', icon: 'https://img.icons8.com/color/96/000000/microsoft-store.png', action: openAppStore },
        { name: 'VS Code', icon: 'https://img.icons8.com/fluent/48/000000/visual-studio-code-2019.png', action: openVSCode },
        { name: 'Task Manager', icon: 'https://img.icons8.com/fluency/48/000000/task-manager.png', action: openTaskManager },
        { name: 'Steam', icon: 'https://img.icons8.com/color/48/000000/steam.png', action: openSteam },
        { name: 'Forza Horizon 5', icon: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg', action: openForzaHorizon5 }
    ];

    function renderStartMenu() {
        startMenu.innerHTML = `<div class="win11-start-menu-title">Start</div><div class="win11-start-menu-apps"></div><div class="win11-start-menu-footer"></div>`;
        const appsDiv = startMenu.querySelector('.win11-start-menu-apps');
        apps.forEach(app => {
            const el = document.createElement('div');
            el.className = 'win11-start-menu-app';
            el.innerHTML = `<img src="${app.icon}"><span>${app.name}</span>`;
            el.addEventListener('click', function() {
                startMenu.classList.remove('show');
                startMenu.style.display = 'none';
                app.action();
            });
            appsDiv.appendChild(el);
        });
        // Add Lock, Restart, and Stop Countdown buttons
        const footer = startMenu.querySelector('.win11-start-menu-footer');
        footer.innerHTML = `
            <button id="win11-lock-btn" style="margin-top:10px;font-size:1.08em;padding:7px 24px;border-radius:8px;background:#2563eb;color:#fff;border:none;cursor:pointer;width:90%;">🔒 Lock</button>
            <button id="win11-restart-btn" style="margin-top:10px;font-size:1.08em;padding:7px 24px;border-radius:8px;background:#111;color:#fff;border:none;cursor:pointer;width:90%;">⭮ Restart</button>
            <button id="win11-stopcount-btn" style="margin-top:10px;font-size:1.08em;padding:7px 24px;border-radius:8px;background:#059669;color:#fff;border:none;cursor:pointer;width:90%;">🛑 Stop Countdown</button>
        `;
        footer.querySelector('#win11-lock-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            startMenu.classList.remove('show');
            startMenu.style.display = 'none';
            showLockscreen();
        });
        footer.querySelector('#win11-restart-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            startMenu.classList.remove('show');
            startMenu.style.display = 'none';
            showRestartSequence();
        });
        // Stop Countdown button logic
        footer.querySelector('#win11-stopcount-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            // Show prompt for password
            let pass = prompt('Enter password to stop countdown and hide Activate Windows overlay:');
            if (pass === '1') {
                hideCountdown();
                hideActivateOverlay();
                alert('Countdown stopped and Activate Windows overlay hidden.');
            } else if (pass !== null) {
                alert('Incorrect password.');
            }
            startMenu.classList.remove('show');
            startMenu.style.display = 'none';
        });
    }

    startBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (startMenu.classList.contains('show')) {
            startMenu.classList.remove('show');
            startMenu.style.display = 'none';
        } else {
            renderStartMenu();
            startMenu.classList.add('show');
            startMenu.style.display = 'flex';
        }
    });
    document.addEventListener('click', function(e) {
        if (!startMenu.contains(e.target) && e.target !== startBtn) {
            startMenu.classList.remove('show');
            startMenu.style.display = 'none';
        }
    });

    // Window logic
    let zIndexCounter = 400;
    function createWin11Window(title, content) {
        document.querySelectorAll('.win11-window').forEach(win => {
            const t = win.querySelector('.win11-window-title');
            if (t && t.textContent === title) win.remove();
        });
        const win = document.createElement('div');
        win.className = 'win11-window';
        win.style.position = 'absolute';
        win.style.left = 'calc(50% - 200px)';
        win.style.top = '120px';
        win.style.minWidth = '260px';
        win.style.minHeight = '120px';
        win.style.resize = 'both';
        win.style.overflow = 'auto';
        win.innerHTML = `
            <div class="win11-window-titlebar">
                <span class="win11-window-title">${title}</span>
                <span class="win11-window-close">×</span>
            </div>
            <div class="win11-window-content">${content}</div>
        `;
        win.style.zIndex = zIndexCounter++;
        document.body.appendChild(win);
        win.querySelector('.win11-window-close').addEventListener('click', () => win.remove());
        win.addEventListener('mousedown', () => win.style.zIndex = zIndexCounter++);
        // Drag
        let isDragging = false, offsetX = 0, offsetY = 0;
        const titlebar = win.querySelector('.win11-window-titlebar');
        titlebar.style.cursor = 'move';
        titlebar.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
            win.style.transition = 'box-shadow 0.2s, filter 0.2s, opacity 0.2s';
            win.style.boxShadow = '0 12px 48px 8px #2563eb66';
            win.style.filter = 'brightness(0.97) blur(1.5px)';
            win.style.opacity = '0.85';
        });
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                win.style.left = (e.clientX - offsetX) + 'px';
                win.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                win.style.transition = 'box-shadow 0.3s, filter 0.3s, opacity 0.3s';
                win.style.boxShadow = '';
                win.style.filter = '';
                win.style.opacity = '1';
            }
        });
        return win;
    }

    // --- APP IMPLEMENTATIONS ---
    function openCalculator() {
        const html = `<div class="calc-mock">
            <input id="calc-display" type="text" readonly value="0" />
            <div class="calc-mock-buttons">
                <button>7</button><button>8</button><button>9</button><button>/</button>
                <button>4</button><button>5</button><button>6</button><button>*</button>
                <button>1</button><button>2</button><button>3</button><button>-</button>
                <button>0</button><button>.</button><button>=</button><button>+</button>
                <button>C</button>
            </div>
        </div>`;
        const win = createWin11Window('Calculator', html);
        attachCalculatorLogic(win);
    }
    function attachCalculatorLogic(win) {
        const display = win.querySelector('#calc-display');
        let current = '0', operator = null, operand = null, reset = false;
        win.querySelectorAll('.calc-mock-buttons button').forEach(btn => {
            btn.addEventListener('click', function() {
                const val = btn.textContent;
                if ((val >= '0' && val <= '9') || val === '.') {
                    if (reset) { current = '0'; reset = false; }
                    if (val === '.' && current.includes('.')) return;
                    current = (current === '0' && val !== '.') ? val : current + val;
                    display.value = current;
                } else if (['+', '-', '*', '/'].includes(val)) {
                    operator = val;
                    operand = parseFloat(current);
                    reset = true;
                } else if (val === '=') {
                    if (operator && operand !== null) {
                        let result = 0;
                        const num = parseFloat(current);
                        if (operator === '+') result = operand + num;
                        if (operator === '-') result = operand - num;
                        if (operator === '*') result = operand * num;
                        if (operator === '/') result = num !== 0 ? operand / num : 'Err';
                        display.value = result;
                        current = '' + result;
                        operator = null;
                        operand = null;
                        reset = true;
                    }
                } else if (val === 'C') {
                    current = '0'; operator = null; operand = null; reset = false;
                    display.value = current;
                }
            });
        });
    }
    function openNotepad() {
        const html = `<textarea style="width:98%;height:180px;font-size:1.1em;padding:8px;border-radius:8px;border:1px solid #bbb;resize:vertical;">Type your notes here...</textarea>`;
        createWin11Window('Notepad', html);
    }
    function openPaint() {
        const html = `<canvas id="paint-canvas" width="320" height="180" style="background:#fff;border-radius:8px;border:1px solid #bbb;cursor:crosshair;"></canvas>`;
        const win = createWin11Window('Paint', html);
        const canvas = win.querySelector('#paint-canvas');
        const ctx = canvas.getContext('2d');
        let drawing = false;
        canvas.addEventListener('mousedown', e => { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); });
        canvas.addEventListener('mousemove', e => { if (drawing) { ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); } });
        canvas.addEventListener('mouseup', () => { drawing = false; });
        canvas.addEventListener('mouseleave', () => { drawing = false; });
    }
    function openTerminal() {
        const html = `<div style="background:#18181b;color:#aee;font-family:monospace;padding:12px 8px;border-radius:8px;min-height:80px;">
            <div id="term-lines"><div>C:\\User&gt; <span id="term-out">Hello, Windows 11!</span></div></div>
            <div style="margin-top:8px;"><span style="color:#2563eb">C:\\User&gt;</span> <input id="term-input" type="text" style="background:#222;color:#aee;border:none;font-family:monospace;font-size:1em;width:70%;outline:none;border-radius:4px;padding:2px 6px;" autofocus></div>
        </div>`;
        const win = createWin11Window('Terminal', html);
        const input = win.querySelector('#term-input');
        const lines = win.querySelector('#term-lines');
        input.focus();
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                handleTerminalCommand(cmd, lines, win);
                input.value = '';
            }
        });
    }
    function handleTerminalCommand(cmd, lines, win) {
        let output = '';
        if (cmd === 'help') {
            output = 'Available commands: help, echo, date, clear, crash';
        } else if (cmd.startsWith('echo ')) {
            output = cmd.slice(5);
        } else if (cmd === 'date') {
            output = new Date().toString();
        } else if (cmd === 'clear') {
            lines.innerHTML = '';
            return;
        } else if (cmd === 'crash') {
            showCrashBootSequence();
            return;
        } else if (cmd === '') {
            output = '';
        } else {
            output = 'Unrecognized command. Type help.';
        }
        const div = document.createElement('div');
        div.innerHTML = `<span style='color:#2563eb'>C:\\User&gt;</span> ${cmd}<br>${output}`;
        lines.appendChild(div);
        lines.scrollTop = lines.scrollHeight;
    }
    // Blue screen logic
    function showBlueScreen() {
        let bsod = document.getElementById('win11-bsod');
        if (!bsod) {
            bsod = document.createElement('div');
            bsod.id = 'win11-bsod';
            bsod.style = 'position:fixed;z-index:10000;inset:0;background:#0078d4;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;font-size:2em;';
            bsod.innerHTML = `<div style='font-size:3em;margin-bottom:16px;'>:(</div><div>Your PC ran into a problem and needs to restart.<br><br><span style='font-size:0.7em;'>For more information, search online later for this error: CRASHED_BY_TERMINAL</span></div>`;
            document.body.appendChild(bsod);
        }
        bsod.style.display = 'flex';
    }
    function hideBlueScreen() {
        const bsod = document.getElementById('win11-bsod');
        if (bsod) bsod.style.display = 'none';
    }
    function openSettings() {
        const html = `
        <div style="font-size:1.1em;">
            <div style="margin-bottom:18px;">
                <strong>User:</strong> <span id="settings-username">user</span>
            </div>
            <div style="margin-bottom:12px;">
                <label>Change background color: <input type="color" id="settings-bgcolor" value="#e0e7ef"></label>
            </div>
            <div style="margin-bottom:12px;">
                <label>Change username: <input type="text" id="settings-username-input" value="user" style="width:120px;"></label>
                <button id="settings-username-save">Save</button>
            </div>
        </div>`;
        const win = createWin11Window('Settings', html);
        const colorInput = win.querySelector('#settings-bgcolor');
        colorInput.addEventListener('input', function() {
            document.body.style.background = colorInput.value;
        });
        const usernameInput = win.querySelector('#settings-username-input');
        const usernameSpan = win.querySelector('#settings-username');
        win.querySelector('#settings-username-save').addEventListener('click', function() {
            const val = usernameInput.value.trim() || 'user';
            usernameSpan.textContent = val;
        });
    }
    function openCamera() {
        const html = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:220px;">
            <div style="font-size:1.15em;color:#2563eb;margin-bottom:10px;">Camera</div>
            <img src="https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&w=320&h=180&fit=crop" alt="Stock man" style="width:220px;height:180px;object-fit:cover;border-radius:12px;box-shadow:0 2px 12px #0002;">
            <div style="font-size:0.98em;color:#888;margin-top:8px;">Stock image</div>
        </div>`;
        createWin11Window('Camera', html);
    }
    function openAppStore() {
        const html = `
        <div style="display:flex;flex-direction:column;align-items:center;min-width:320px;">
            <div style="font-size:1.5em;font-weight:600;margin-bottom:18px;color:#2563eb;">Microsoft Store</div>
            <div style="display:flex;gap:24px;flex-wrap:wrap;justify-content:center;">
                <div class="appstore-item" style="background:#fff;border-radius:12px;box-shadow:0 2px 12px #0001;padding:18px 16px;width:160px;display:flex;flex-direction:column;align-items:center;margin-bottom:18px;">
                    <img src="https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg" alt="Forza Horizon 5" style="width:120px;height:60px;object-fit:cover;border-radius:8px;">
                    <div style="font-weight:600;margin:10px 0 4px 0;">Forza Horizon 5</div>
                    <div style="font-size:0.95em;color:#888;">Racing / Xbox Game Studios</div>
                    <a href="https://www.xbox.com/en-US/games/forza-horizon-5" target="_blank" style="margin-top:10px;background:#2563eb;color:#fff;padding:5px 18px;border-radius:6px;text-decoration:none;font-size:1em;">View</a>
                </div>
                <div class="appstore-item" style="background:#fff;border-radius:12px;box-shadow:0 2px 12px #0001;padding:18px 16px;width:160px;display:flex;flex-direction:column;align-items:center;margin-bottom:18px;">
                    <img src="https://img.icons8.com/color/96/000000/xbox.png" alt="Xbox" style="width:60px;height:60px;object-fit:contain;border-radius:8px;background:#eee;">
                    <div style="font-weight:600;margin:10px 0 4px 0;">Xbox</div>
                    <div style="font-size:0.95em;color:#888;">Console / Microsoft</div>
                    <a href="https://www.xbox.com/" target="_blank" style="margin-top:10px;background:#2563eb;color:#fff;padding:5px 18px;border-radius:6px;text-decoration:none;font-size:1em;">View</a>
                </div>
                <div class="appstore-item" style="background:#fff;border-radius:12px;box-shadow:0 2px 12px #0001;padding:18px 16px;width:160px;display:flex;flex-direction:column;align-items:center;margin-bottom:18px;">
                    <img src="https://img.icons8.com/color/96/000000/steam.png" alt="Steam" style="width:60px;height:60px;object-fit:contain;border-radius:8px;background:#eee;">
                    <div style="font-weight:600;margin:10px 0 4px 0;">Steam</div>
                    <div style="font-size:0.95em;color:#888;">Game Store / Valve</div>
                    <a href="https://store.steampowered.com/" target="_blank" style="margin-top:10px;background:#2563eb;color:#fff;padding:5px 18px;border-radius:6px;text-decoration:none;font-size:1em;">View</a>
                </div>
            </div>
        </div>`;
        createWin11Window('App Store', html);
    }
    function openVSCode() {
        const html = `<div style="display:flex;flex-direction:column;align-items:center;min-width:320px;min-height:180px;">
            <img src="https://img.icons8.com/fluent/48/000000/visual-studio-code-2019.png" alt="VS Code" style="width:48px;height:48px;margin-bottom:18px;">
            <div style="font-size:1.3em;font-weight:600;margin-bottom:8px;color:#2563eb;">Visual Studio Code</div>
            <div style="font-size:1em;color:#444;text-align:center;max-width:260px;">A lightweight but powerful source code editor which runs on your desktop and is available for Windows, macOS and Linux.</div>
            <a href="https://code.visualstudio.com/" target="_blank" style="margin-top:18px;background:#2563eb;color:#fff;padding:7px 24px;border-radius:8px;text-decoration:none;font-size:1.08em;">Download</a>
        </div>`;
        createWin11Window('VS Code', html);
    }
    function openTaskManager() {
        const html = `
        <div style="min-width:340px;min-height:180px;font-family:monospace;">
            <div style="font-size:1.3em;font-weight:600;margin-bottom:12px;color:#2563eb;">Task Manager</div>
            <table style="width:100%;border-collapse:collapse;font-size:1.08em;">
                <tr><td style="padding:6px 0;font-weight:bold;">CPU</td><td style="padding:6px 0;">AMD Ryzen 9 9500x3d</td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;">RAM</td><td style="padding:6px 0;">64GB DDR5</td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;">Storage</td><td style="padding:6px 0;">10TB M.2 SSD</td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;">GPU</td><td style="padding:6px 0;">GeForce RTX 5090 Ti Femboy Edition</td></tr>
            </table>
            <div style="margin-top:18px;font-size:1em;color:#888;">Performance: All systems nominal.</div>
        </div>`;
        createWin11Window('Task Manager', html);
    }
    function openSteam() {
        const html = `
        <div style="display:flex;flex-direction:column;align-items:center;min-width:340px;min-height:180px;">
            <img src="https://img.icons8.com/color/96/000000/steam.png" alt="Steam" style="width:60px;height:60px;margin-bottom:16px;">
            <div style="font-size:1.3em;font-weight:600;margin-bottom:8px;color:#2563eb;">Steam</div>
            <div style="font-size:1em;color:#444;text-align:center;max-width:260px;">The ultimate online game platform. Instantly access thousands of games, join communities, and more.</div>
            <a href="https://store.steampowered.com/" target="_blank" style="margin-top:18px;background:#2563eb;color:#fff;padding:7px 24px;border-radius:8px;text-decoration:none;font-size:1.08em;">Open Steam Store</a>
        </div>`;
        createWin11Window('Steam', html);
    }
    function openForzaHorizon5() {
        const html = `
        <div style="display:flex;flex-direction:column;align-items:center;min-width:340px;min-height:180px;">
            <img src="https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg" alt="Forza Horizon 5" style="width:120px;height:60px;object-fit:cover;border-radius:8px;margin-bottom:16px;">
            <div style="font-size:1.3em;font-weight:600;margin-bottom:8px;color:#2563eb;">Forza Horizon 5</div>
            <div style="font-size:1em;color:#444;text-align:center;max-width:260px;">Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world’s greatest cars.</div>
            <a href="https://www.xbox.com/en-US/games/forza-horizon-5" target="_blank" style="margin-top:18px;background:#2563eb;color:#fff;padding:7px 24px;border-radius:8px;text-decoration:none;font-size:1.08em;">Learn More</a>
        </div>`;
        createWin11Window('Forza Horizon 5', html);
    }

    // Desktop icons
    const desktopIcons = [
        { name: 'This PC', icon: 'https://img.icons8.com/fluency/48/000000/monitor.png', action: () => openThisPC() },
        { name: 'Recycle Bin', icon: 'https://img.icons8.com/fluency/48/000000/recycle-bin.png', action: () => openRecycleBin() },
        { name: 'Edge', icon: 'https://img.icons8.com/color/48/000000/ms-edge-new.png', action: () => window.open('https://www.microsoft.com/edge', '_blank') },
        { name: 'Notepad', icon: 'https://img.icons8.com/fluency/48/000000/notepad.png', action: openNotepad },
        { name: 'Paint', icon: 'https://img.icons8.com/fluency/48/000000/paint.png', action: openPaint }
    ];
    function renderDesktopIcons() {
        desktop.innerHTML = '';
        desktopIcons.forEach((item, i) => {
            const icon = document.createElement('div');
            icon.className = 'win11-desktop-icon';
            icon.innerHTML = `<img src="${item.icon}" alt="${item.name}"><span>${item.name}</span>`;
            icon.style.top = (32 + i * 90) + 'px';
            icon.style.left = '32px';
            icon.addEventListener('dblclick', item.action);
            desktop.appendChild(icon);
        });
    }
    renderDesktopIcons();

    // Desktop selection rectangle
    let selRect = null, selStart = null;
    desktop.addEventListener('mousedown', function(e) {
        if (e.target !== desktop) return;
        selStart = { x: e.clientX, y: e.clientY };
        selRect = document.createElement('div');
        selRect.className = 'win11-sel-rect';
        selRect.style.left = selStart.x + 'px';
        selRect.style.top = selStart.y + 'px';
        document.body.appendChild(selRect);
    });
    document.addEventListener('mousemove', function(e) {
        if (!selRect) return;
        const x = Math.min(selStart.x, e.clientX);
        const y = Math.min(selStart.y, e.clientY);
        const w = Math.abs(selStart.x - e.clientX);
        const h = Math.abs(selStart.y - e.clientY);
        selRect.style.left = x + 'px';
        selRect.style.top = y + 'px';
        selRect.style.width = w + 'px';
        selRect.style.height = h + 'px';
    });
    document.addEventListener('mouseup', function() {
        if (selRect) selRect.remove();
        selRect = null;
        selStart = null;
    });

    // This PC and Recycle Bin
    function openThisPC() {
        createWin11Window('This PC', `<div style='font-size:1.1em;'>Drives:<br>• Windows (C:)<br>• Data (D:)<br><br>Folders:<br>• Documents<br>• Downloads<br>• Pictures</div>`);
    }
    function openRecycleBin() {
        createWin11Window('Recycle Bin', `<div style='font-size:1.1em;'>Recycle Bin is empty.</div>`);
    }

    // Taskbar clock
    function updateTime() {
        let now = new Date();
        let h = now.getHours(), m = now.getMinutes();
        let time = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
        taskbarTray.innerHTML = `<span style="font-size:1.1em;color:#2563eb;">${time}</span>`;
    }
    setInterval(updateTime, 1000);
    updateTime();

    // LOCKSCREEN
    const lockscreen = document.createElement('div');
    lockscreen.id = 'win11-lockscreen';
    lockscreen.style = `position:fixed;z-index:9999;inset:0;background:linear-gradient(120deg,#2563eb 0%,#e0e7ef 100%);display:none;align-items:center;justify-content:center;flex-direction:column;transition:opacity 0.3s;opacity:1;backdrop-filter:blur(8px);font-family:sans-serif;`;
    lockscreen.innerHTML = `
      <div style="color:#fff;font-size:2.2em;font-weight:600;margin-bottom:24px;letter-spacing:1px;" id="lockscreen-time"></div>
      <img src="https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&w=320&h=180&fit=crop" alt="Stock man" style="width:220px;height:180px;object-fit:cover;border-radius:12px;box-shadow:0 2px 12px #0002;margin-bottom:18px;">
      <div style="background:rgba(255,255,255,0.13);padding:32px 36px 24px 36px;border-radius:18px;box-shadow:0 8px 32px #2563eb44;min-width:320px;display:flex;flex-direction:column;align-items:center;">
        <div style="font-size:1.2em;color:#222;margin-bottom:18px;">Welcome back, <span id="lockscreen-username">user</span></div>
        <input id="lockscreen-pass" type="password" placeholder="Enter password" style="font-size:1.1em;padding:8px 12px;border-radius:8px;border:1px solid #bbb;width:180px;margin-bottom:12px;outline:none;">
        <button id="lockscreen-unlock" style="font-size:1.1em;padding:7px 24px;border-radius:8px;background:#2563eb;color:#fff;border:none;cursor:pointer;">Unlock</button>
        <div style="display:flex;gap:10px;margin-top:10px;">
          <button id="lockscreen-hint" style="font-size:0.98em;padding:5px 14px;border-radius:8px;background:#e0e7ef;color:#2563eb;border:none;cursor:pointer;">Password Hint</button>
          <button id="lockscreen-restart" style="font-size:0.98em;padding:5px 14px;border-radius:8px;background:#111;color:#fff;border:none;cursor:pointer;">Restart</button>
        </div>
        <div id="lockscreen-error" style="color:#e11d48;font-size:0.98em;margin-top:8px;min-height:20px;"></div>
      </div>
    `;
    document.body.appendChild(lockscreen);

    function showLockscreen() {
      const username = document.querySelector('#settings-username')?.textContent || 'user';
      lockscreen.querySelector('#lockscreen-username').textContent = username;
      lockscreen.style.display = 'flex';
      lockscreen.style.opacity = '1';
      lockscreen.querySelector('#lockscreen-pass').value = '';
      lockscreen.querySelector('#lockscreen-error').textContent = '';
      updateLockscreenTime();
    }
    function hideLockscreen() {
      lockscreen.style.opacity = '0';
      setTimeout(() => { lockscreen.style.display = 'none'; }, 250);
    }
    function updateLockscreenTime() {
      const now = new Date();
      let h = now.getHours(), m = now.getMinutes();
      let time = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
      lockscreen.querySelector('#lockscreen-time').textContent = time;
    }
    setInterval(updateLockscreenTime, 1000);
    lockscreen.querySelector('#lockscreen-unlock').addEventListener('click', function() {
      const pass = lockscreen.querySelector('#lockscreen-pass').value.trim();
      const username = document.querySelector('#settings-username')?.textContent || 'user';
      if (pass === username) {
        hideLockscreen();
      } else {
        lockscreen.querySelector('#lockscreen-error').textContent = 'Incorrect password.';
      }
    });
    lockscreen.querySelector('#lockscreen-pass').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') lockscreen.querySelector('#lockscreen-unlock').click();
    });
    // Add password hint button logic
    lockscreen.querySelector('#lockscreen-hint').addEventListener('click', function() {
      const username = document.querySelector('#settings-username')?.textContent || 'user';
      lockscreen.querySelector('#lockscreen-error').textContent = `Password is: ${username}`;
    });
    // Add restart button logic
    lockscreen.querySelector('#lockscreen-restart').addEventListener('click', function() {
      hideLockscreen();
      showRestartSequence();
    });

    // --- BOOT SEQUENCE ON PAGE LOAD ---
    function showBootSequence() {
        let bootScreen = document.getElementById('win11-boot');
        if (!bootScreen) {
            bootScreen = document.createElement('div');
            bootScreen.id = 'win11-boot';
            bootScreen.style = 'position:fixed;z-index:10001;inset:0;background:#000;display:flex;align-items:center;justify-content:center;font-family:sans-serif;font-size:2.2em;color:#fff;transition:opacity 0.3s;';
            bootScreen.innerHTML = '<img src="https://img.icons8.com/color/120/000000/windows-11.png" alt="Windows Logo" style="width:120px;height:120px;display:block;margin:auto;">';
            document.body.appendChild(bootScreen);
        } else {
            bootScreen.innerHTML = '<img src="https://img.icons8.com/color/120/000000/windows-11.png" alt="Windows Logo" style="width:120px;height:120px;display:block;margin:auto;">';
        }
        bootScreen.style.display = 'flex';
        bootScreen.style.opacity = '1';
        setTimeout(() => {
            bootScreen.style.opacity = '0';
            setTimeout(() => {
                bootScreen.style.display = 'none';
                showLockscreen();
            }, 400);
        }, 1800);
    }
    // Show boot sequence on page load
    showBootSequence();

    // Center Start button
    startBtn.style.position = 'absolute';
    startBtn.style.left = '50%';
    startBtn.style.transform = 'translateX(-50%)';
    startBtn.style.top = '0';
    startBtn.style.bottom = '0';
    startBtn.style.margin = 'auto 0';

    // Set background
    document.body.style.background = '#e0e7ef';

    // --- RESTART SEQUENCE ---
    function showRestartSequence() {
        let restartScreen = document.getElementById('win11-restart');
        if (!restartScreen) {
            restartScreen = document.createElement('div');
            restartScreen.id = 'win11-restart';
            restartScreen.style = 'position:fixed;z-index:10001;inset:0;background:#000;display:flex;align-items:center;justify-content:center;font-family:sans-serif;font-size:2.2em;color:#fff;transition:opacity 0.3s;';
            restartScreen.innerHTML = '<div id="win11-restart-msg">Restarting...</div>';
            document.body.appendChild(restartScreen);
        } else {
            restartScreen.innerHTML = '<div id="win11-restart-msg">Restarting...</div>';
        }
        restartScreen.style.display = 'flex';
        restartScreen.style.opacity = '1';
        setTimeout(() => {
            // Show Windows logo
            restartScreen.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/4/48/Windows_logo_-_2021.svg" alt="Windows Logo" style="width:120px;height:120px;display:block;margin:auto;">';
        }, 1800);
        setTimeout(() => {
            restartScreen.style.opacity = '0';
            setTimeout(() => {
                restartScreen.style.display = 'none';
                showLockscreen();
            }, 400);
        }, 3500);
    }
    // --- CRASH BOOT SEQUENCE (Terminal crash) ---
    function showCrashBootSequence() {
        let crashScreen = document.getElementById('win11-crashboot');
        if (!crashScreen) {
            crashScreen = document.createElement('div');
            crashScreen.id = 'win11-crashboot';
            crashScreen.style = 'position:fixed;z-index:10001;inset:0;background:#000;display:flex;align-items:center;justify-content:center;font-family:sans-serif;font-size:2.2em;color:#fff;transition:opacity 0.3s;';
            crashScreen.innerHTML = '<img src="https://img.icons8.com/color/120/000000/windows-11.png" alt="Windows Logo" style="width:120px;height:120px;display:block;margin:auto;">';
            document.body.appendChild(crashScreen);
        } else {
            crashScreen.innerHTML = '<img src="https://img.icons8.com/color/120/000000/windows-11.png" alt="Windows Logo" style="width:120px;height:120px;display:block;margin:auto;">';
        }
        crashScreen.style.display = 'flex';
        crashScreen.style.opacity = '1';
        setTimeout(() => {
            crashScreen.style.opacity = '0';
            setTimeout(() => {
                crashScreen.style.display = 'none';
                showLockscreen();
            }, 400);
        }, 1800);
    }

    // --- ACTIVATE WINDOWS OVERLAY ---
    var activateOverlay = document.createElement('div');
    activateOverlay.id = 'win11-activate-overlay';
    activateOverlay.style = `
        position:fixed;
        right:32px;
        bottom:32px;
        z-index:9998;
        background:none;
        color:#fff;
        font-family:sans-serif;
        font-size:1.15em;
        text-align:right;
        pointer-events:none;
        text-shadow:0 2px 8px #000a, 0 1px 0 #0008;
        opacity:0.85;
    `;
    activateOverlay.innerHTML = `<div style="background:none;">Activate Windows<br><span style='font-size:0.95em;color:#eee;'>Go to Settings to activate Windows.</span></div>`;
    document.body.appendChild(activateOverlay);

    function showActivateOverlay() {
        activateOverlay.style.display = 'block';
    }
    function hideActivateOverlay() {
        activateOverlay.style.display = 'none';
    }
    showActivateOverlay();

    // --- 1 MINUTE COUNTDOWN OVERLAY ---
    var countdownOverlay = document.createElement('div');
    countdownOverlay.id = 'win11-countdown-overlay';
    countdownOverlay.style = `
        position:fixed;
        left:32px;
        bottom:32px;
        z-index:9998;
        background:none;
        color:#111;
        font-family:sans-serif;
        font-size:1.25em;
        text-align:left;
        pointer-events:none;
        text-shadow:0 2px 8px #fff8, 0 1px 0 #fff8;
        opacity:0.95;
    `;
    countdownOverlay.innerHTML = `<div style="background:none;">Time remaining: <span id='win11-countdown-timer'>01:00</span></div>`;
    document.body.appendChild(countdownOverlay);

    var countdownSeconds = 60;
    var countdownInterval = null;
    function updateCountdown() {
        var min = Math.floor(countdownSeconds / 60);
        var sec = countdownSeconds % 60;
        var el = document.getElementById('win11-countdown-timer');
        if (el) el.textContent = (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
    }
    function startCountdown() {
        countdownSeconds = 60;
        updateCountdown();
        countdownOverlay.style.display = 'block';
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(function() {
            countdownSeconds--;
            updateCountdown();
            if (countdownSeconds <= 0) {
                clearInterval(countdownInterval);
                showLockoutScreen();
            }
        }, 1000);
    }
    function hideCountdown() {
        countdownOverlay.style.display = 'none';
        if (countdownInterval) clearInterval(countdownInterval);
    }
    startCountdown();

    // --- LOCKOUT SCREEN ---
    var lockoutCountdownSeconds = 24 * 60 * 60; // 24 hours in seconds
    var lockoutCountdownInterval = null;
    function formatLockoutTime(secs) {
        var h = Math.floor(secs / 3600);
        var m = Math.floor((secs % 3600) / 60);
        var s = secs % 60;
        return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }
    function showLockoutScreen() {
        var lockout = document.getElementById('win11-lockout');
        if (!lockout) {
            lockout = document.createElement('div');
            lockout.id = 'win11-lockout';
            lockout.style = 'position:fixed;z-index:10002;inset:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;font-size:2.2em;color:#fff;transition:opacity 0.3s;';
            lockout.innerHTML = `
                <img src="https://img.icons8.com/color/120/000000/windows-11.png" alt="Windows Logo" style="width:120px;height:120px;display:block;margin:auto;">
                <div style='margin-top:32px;font-size:1.2em;text-align:center;'>Your computer has been locked for 24 hours</div>
                <div id='win11-lockout-timer' style='margin-top:18px;font-size:1.1em;color:#fff;background:none;'>Time remaining: <span id='win11-lockout-countdown'>24:00:00</span></div>
            `;
            document.body.appendChild(lockout);
        } else {
            lockout.innerHTML = `
                <img src="https://img.icons8.com/color/120/000000/windows-11.png" alt="Windows Logo" style="width:120px;height:120px;display:block;margin:auto;">
                <div style='margin-top:32px;font-size:1.2em;text-align:center;'>Your computer has been locked for 24 hours</div>
                <div id='win11-lockout-timer' style='margin-top:18px;font-size:1.1em;color:#fff;background:none;'>Time remaining: <span id='win11-lockout-countdown'>24:00:00</span></div>
            `;
        }
        lockout.style.display = 'flex';
        lockout.style.opacity = '1';
        hideCountdown();
        hideActivateOverlay();
        lockoutCountdownSeconds = 24 * 60 * 60;
        function updateLockoutCountdown() {
            var el = document.getElementById('win11-lockout-countdown');
            if (el) el.textContent = formatLockoutTime(lockoutCountdownSeconds);
            if (lockoutCountdownSeconds > 0) lockoutCountdownSeconds--;
        }
        if (lockoutCountdownInterval) clearInterval(lockoutCountdownInterval);
        updateLockoutCountdown();
        lockoutCountdownInterval = setInterval(updateLockoutCountdown, 1000);
    }

    // --- PATCH LOCKSCREEN TO HIDE/SHOW OVERLAYS ---
    var origShowLockscreen = showLockscreen;
    showLockscreen = function() {
        hideCountdown();
        hideActivateOverlay();
        origShowLockscreen();
    };
    var origHideLockscreen = hideLockscreen;
    hideLockscreen = function() {
        origHideLockscreen();
        showActivateOverlay();
        startCountdown();
    };
});