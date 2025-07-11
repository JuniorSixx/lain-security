// Lain Security - Password Strength Analyzer
// "Present day, present time..."

// Elementos do DOM
const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');
const analyzeBtn = document.getElementById('analyzeBtn');
const breachBtn = document.getElementById('breachBtn');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');

// Seções de resultado
const analysisSection = document.getElementById('analysisSection');
const breachSection = document.getElementById('breachSection');
const generatedSection = document.getElementById('generatedSection');

// Elementos de análise
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const analysisText = document.getElementById('analysisText');
const suggestions = document.getElementById('suggestions');

// Elementos de verificação de vazamento
const breachCheck = document.getElementById('breachCheck');
const breachResult = document.getElementById('breachResult');

// Elementos de senha gerada
const newPassword = document.getElementById('newPassword');

// Canvas para sparks
const sparkCanvas = document.getElementById('sparkCanvas');
const sparkCtx = sparkCanvas.getContext('2d');

// Configurações dos sparks
let sparks = [];
let animationId = null;

// Configurar canvas
function setupCanvas() {
    sparkCanvas.width = window.innerWidth;
    sparkCanvas.height = window.innerHeight;
}

// Criar spark
function createSpark(x, y) {
    const sparkCount = 8;
    const newSparks = [];
    
    for (let i = 0; i < sparkCount; i++) {
        const angle = (2 * Math.PI * i) / sparkCount;
        newSparks.push({
            x: x,
            y: y,
            angle: angle,
            startTime: performance.now(),
            radius: 15,
            size: 10,
            duration: 400,
            color: '#fff'
        });
    }
    
    sparks.push(...newSparks);
}

// Animar sparks
function animateSparks(timestamp) {
    sparkCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
    
    sparks = sparks.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= spark.duration) {
            return false;
        }
        
        const progress = elapsed / spark.duration;
        const eased = 1 - Math.pow(1 - progress, 2); // ease-out
        
        const distance = eased * spark.radius;
        const lineLength = spark.size * (1 - eased);
        
        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);
        
        sparkCtx.strokeStyle = spark.color;
        sparkCtx.lineWidth = 2;
        sparkCtx.beginPath();
        sparkCtx.moveTo(x1, y1);
        sparkCtx.lineTo(x2, y2);
        sparkCtx.stroke();
        
        return true;
    });
    
    animationId = requestAnimationFrame(animateSparks);
}

// Inicializar canvas e sparks
function initSparks() {
    setupCanvas();
    animateSparks(performance.now());
    
    // Adicionar event listener para cliques
    document.addEventListener('click', (e) => {
        createSpark(e.clientX, e.clientY);
    });
    
    // Redimensionar canvas quando a janela mudar
    window.addEventListener('resize', () => {
        setupCanvas();
    });
}

// Toggle de visibilidade da senha
togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    const eyeIcon = togglePassword.querySelector('.eye-icon');
    eyeIcon.textContent = type === 'password' ? '👁' : '🙈';
});

// Função para ocultar todas as seções
function hideAllSections() {
    analysisSection.classList.add('hidden');
    breachSection.classList.add('hidden');
    generatedSection.classList.add('hidden');
}

// Função para mostrar seção específica
function showSection(section) {
    hideAllSections();
    section.classList.remove('hidden');
}

// Análise de força da senha
function analyzePassword(password) {
    let score = 0;
    let feedback = [];
    
    // Comprimento
    if (password.length >= 12) {
        score += 25;
    } else if (password.length >= 8) {
        score += 15;
        feedback.push("Considere uma senha com pelo menos 12 caracteres");
    } else {
        feedback.push("Sua senha é muito curta");
    }
    
    // Caracteres minúsculos
    if (/[a-z]/.test(password)) {
        score += 10;
    } else {
        feedback.push("Adicione letras minúsculas");
    }
    
    // Caracteres maiúsculos
    if (/[A-Z]/.test(password)) {
        score += 10;
    } else {
        feedback.push("Adicione letras maiúsculas");
    }
    
    // Números
    if (/\d/.test(password)) {
        score += 10;
    } else {
        feedback.push("Adicione números");
    }
    
    // Caracteres especiais
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        score += 15;
    } else {
        feedback.push("Adicione caracteres especiais");
    }
    
    // Verificar repetição
    const hasRepetition = /(.)\1{2,}/.test(password);
    if (hasRepetition) {
        score -= 10;
        feedback.push("Evite caracteres repetidos");
    }
    
    // Verificar padrões comuns
    const commonPatterns = ['123', 'abc', 'qwe', 'asd', 'password', 'senha'];
    const hasCommonPattern = commonPatterns.some(pattern => 
        password.toLowerCase().includes(pattern)
    );
    if (hasCommonPattern) {
        score -= 15;
        feedback.push("Evite padrões comuns");
    }
    
    // Determinar força
    let strength = '';
    let strengthClass = '';
    
    if (score >= 80) {
        strength = 'EXCELENTE';
        strengthClass = 'strength-excellent';
    } else if (score >= 60) {
        strength = 'FORTE';
        strengthClass = 'strength-strong';
    } else if (score >= 40) {
        strength = 'MÉDIA';
        strengthClass = 'strength-medium';
    } else {
        strength = 'FRACA';
        strengthClass = 'strength-weak';
    }
    
    return {
        score: Math.max(0, Math.min(100, score)),
        strength,
        strengthClass,
        feedback
    };
}

// Botão de análise
analyzeBtn.addEventListener('click', () => {
    const password = passwordInput.value;
    
    if (!password) {
        alert('Por favor, digite uma senha para analisar.');
        return;
    }
    
    showSection(analysisSection);
    
    const analysis = analyzePassword(password);
    
    // Atualizar barra de força
    strengthBar.style.width = analysis.score + '%';
    strengthBar.className = 'strength-bar ' + analysis.strengthClass;
    strengthText.textContent = analysis.strength;
    
    // Atualizar texto de análise
    let analysisHTML = `<strong>Pontuação: ${analysis.score}/100</strong><br><br>`;
    analysisHTML += `Sua senha foi classificada como: <strong>${analysis.strength}</strong><br><br>`;
    
    if (analysis.score >= 80) {
        analysisHTML += "🎉 Parabéns! Sua senha é muito segura.";
    } else if (analysis.score >= 60) {
        analysisHTML += "👍 Sua senha é boa, mas pode ser melhorada.";
    } else if (analysis.score >= 40) {
        analysisHTML += "⚠️ Sua senha precisa de melhorias para ser mais segura.";
    } else {
        analysisHTML += "🚨 Sua senha é muito fraca e precisa ser alterada imediatamente.";
    }
    
    analysisText.innerHTML = analysisHTML;
    
    // Atualizar sugestões
    if (analysis.feedback.length > 0) {
        let suggestionsHTML = '<h4>SUGESTÕES DE MELHORIA:</h4><ul>';
        analysis.feedback.forEach(suggestion => {
            suggestionsHTML += `<li>${suggestion}</li>`;
        });
        suggestionsHTML += '</ul>';
        suggestions.innerHTML = suggestionsHTML;
    } else {
        suggestions.innerHTML = '<h4>SUGESTÕES DE MELHORIA:</h4><p>Nenhuma sugestão - sua senha está excelente!</p>';
    }
});

// Verificação de vazamento
breachBtn.addEventListener('click', async () => {
    const password = passwordInput.value;
    
    if (!password) {
        alert('Por favor, digite uma senha para verificar.');
        return;
    }
    
    showSection(breachSection);
    breachCheck.classList.remove('hidden');
    breachResult.classList.add('hidden');
    
    try {
        // Criar hash SHA-1 da senha
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Usar apenas os primeiros 5 caracteres do hash (privacy)
        const prefix = hashHex.substring(0, 5);
        const suffix = hashHex.substring(5).toUpperCase();
        
        const response = await fetch(`/api/pwned?prefix=${prefix}`);
        
        if (response.ok) {
            const hashes = await response.text();
            const hashLines = hashes.split('\n');
            
            const found = hashLines.some(line => {
                const [hashSuffix, count] = line.split(':');
                return hashSuffix === suffix;
            });
            
            if (found) {
                const line = hashLines.find(line => line.startsWith(suffix));
                const count = line.split(':')[1];
                
                breachCheck.classList.add('hidden');
                breachResult.classList.remove('hidden');
                breachResult.className = 'breach-result breach-compromised';
                breachResult.innerHTML = `
                    <div class="breach-status">⚠️ SENHA COMPROMETIDA</div>
                    <div class="breach-count">Esta senha foi encontrada em ${count} vazamentos de dados.</div>
                `;
            } else {
                breachCheck.classList.add('hidden');
                breachResult.classList.remove('hidden');
                breachResult.className = 'breach-result breach-safe';
                breachResult.innerHTML = `
                    <div class="breach-status">✅ SENHA SEGURA</div>
                    <div class="breach-count">Esta senha não foi encontrada em vazamentos conhecidos.</div>
                `;
            }
        } else {
            throw new Error('Erro na verificação');
        }
    } catch (error) {
        breachCheck.classList.add('hidden');
        breachResult.classList.remove('hidden');
        breachResult.className = 'breach-result breach-compromised';
        breachResult.innerHTML = `
            <div class="breach-status">❌ ERRO NA VERIFICAÇÃO</div>
            <div class="breach-count">Não foi possível verificar a senha. Tente novamente.</div>
        `;
    }
});

// Geração de senha forte
function generateStrongPassword() {
    const length = Math.floor(Math.random() * 9) + 12; // 12-20 caracteres
    const charset = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    
    let password = '';
    const usedChars = new Set();
    
    // Garantir pelo menos um de cada tipo
    password += charset.lowercase[Math.floor(Math.random() * charset.lowercase.length)];
    password += charset.uppercase[Math.floor(Math.random() * charset.uppercase.length)];
    password += charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
    password += charset.symbols[Math.floor(Math.random() * charset.symbols.length)];
    
    // Adicionar caracteres restantes
    const allChars = charset.lowercase + charset.uppercase + charset.numbers + charset.symbols;
    
    for (let i = 4; i < length; i++) {
        let char;
        do {
            char = allChars[Math.floor(Math.random() * allChars.length)];
        } while (usedChars.has(char) && usedChars.size < allChars.length);
        
        password += char;
        usedChars.add(char);
    }
    
    // Embaralhar a senha
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

generateBtn.addEventListener('click', () => {
    const newPass = generateStrongPassword();
    newPassword.textContent = newPass;
    showSection(generatedSection);
});

// Copiar senha gerada
copyBtn.addEventListener('click', async () => {
    const password = newPassword.textContent;
    
    if (!password) {
        alert('Nenhuma senha gerada para copiar.');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(password);
        
        // Feedback visual
        const originalText = copyBtn.querySelector('.copy-text').textContent;
        copyBtn.querySelector('.copy-text').textContent = 'SENHA COPIADA!';
        copyBtn.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
        
        setTimeout(() => {
            copyBtn.querySelector('.copy-text').textContent = originalText;
            copyBtn.style.background = 'linear-gradient(45deg, var(--neon-purple), var(--neon-magenta))';
        }, 2000);
        
    } catch (err) {
        alert('Erro ao copiar senha. Tente novamente.');
    }
});

// ========== TERMINAL FAKE LAIN ========== //
const lainTerminal = document.getElementById('lainTerminal');
const terminalBody = document.getElementById('terminalBody');
const terminalInput = document.getElementById('terminalInput');
const terminalClose = document.getElementById('terminalClose');

const lainQuotes = [
    'Não importa onde você vá, todos estão conectados.',
    'Presente dia. Presente tempo. Ha-ha-ha-ha…',
    'E você parece não entender...',
    'É uma pena, você parecia um homem honesto...',
    'A rede é vasta e infinita.',
    'Se você não é lembrado, então nunca existiu.',
    'Vamos todos amar a Lain!',
    'Você não está sozinho. Estamos conectados.',
    'Quem é você? Quem sou eu?',
    'Feche o mundo, abra o próximo.',
    'A realidade é só uma muleta para quem não consegue lidar com a Wired.'
];

const lainAnswers = [
    'Quem é você?',
    'Por que continua me chamando?',
    'Você sabe qual Lain eu sou?',
    'Vamos todos amar a Lain!',
    'Você não está sozinho. Estamos conectados.',
    '...lain?',
    'Presente dia. Presente tempo. Ha-ha-ha-ha…',
    'Às vezes sinto que não sou eu mesma.',
    'Você é real?',
    'Estou em todo lugar.',
    'Eu não sou a única Lain.'
];

const wiredAnswers = [
    'A Wired está em todo lugar. O mundo real e a Wired estão conectados.',
    'Você consegue me ouvir pela Wired?',
    'A Wired não é só uma rede. É outra realidade.',
    'Na Wired, todos somos um.',
    'Você não pode escapar da Wired.',
    'A fronteira entre o mundo real e a Wired está desaparecendo.'
];

const comandosDisponiveis = [
    {cmd: 'help', desc: 'Mostra esta lista de comandos'},
    {cmd: 'lain', desc: 'Receba uma resposta misteriosa da Lain'},
    {cmd: 'wired', desc: 'Frases sobre a Wired'},
    {cmd: 'quote', desc: 'Citação aleatória do anime'},
    {cmd: 'whoami', desc: 'Descubra sua identidade'},
    {cmd: 'wiredmode', desc: 'Ativa/desativa o modo Wired'},
    {cmd: 'clear', desc: 'Limpa o terminal'}
];

function printComandos() {
    let html = '<b>Comandos disponíveis:</b><br>';
    comandosDisponiveis.forEach(c => {
        html += `<span style=\"color:var(--neon-magenta)\">${c.cmd}</span> — <span style=\"color:var(--neon-cyan)\">${c.desc}</span><br>`;
    });
    printToTerminal(html);
    terminalBody.scrollTop = 0;
}

function printToTerminal(text, isCmd = false) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    if (isCmd) line.style.color = 'var(--neon-cyan)';
    line.innerHTML = text;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function typeToTerminal(text, isCmd = false, speed = 12) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    if (isCmd) line.style.color = 'var(--neon-cyan)';
    terminalBody.appendChild(line);
    let i = 0;
    function type() {
        line.innerHTML = text.slice(0, i) + '<span class="terminal-cursor">█</span>';
        terminalBody.scrollTop = terminalBody.scrollHeight;
        if (i < text.length) {
            i++;
            setTimeout(type, speed);
        } else {
            line.innerHTML = text;
        }
    }
    type();
}

function glitchText(text) {
    // Simples efeito glitch: letras trocadas e caracteres aleatórios
    return text.split('').map((c, i) => {
        if (Math.random() < 0.15) return String.fromCharCode(33 + Math.floor(Math.random() * 94));
        if (Math.random() < 0.1) return `<span style='color:var(--neon-magenta)'>${c}</span>`;
        return c;
    }).join('');
}

function handleTerminalCommand(cmd) {
    const command = cmd.trim().toLowerCase();
    printToTerminal('lain@wired:~$ ' + cmd, true);
    switch (command) {
        case 'help':
            printComandos();
            break;
        case 'lain':
            typeToTerminal(lainAnswers[Math.floor(Math.random() * lainAnswers.length)]);
            break;
        case 'wired':
            typeToTerminal(wiredAnswers[Math.floor(Math.random() * wiredAnswers.length)]);
            break;
        case 'quote':
            typeToTerminal(lainQuotes[Math.floor(Math.random() * lainQuotes.length)]);
            break;
        case 'whoami':
            typeToTerminal('lain (root)');
            break;
        case 'wiredmode':
            document.body.classList.toggle('wired-mode');
            typeToTerminal('Modo Wired ' + (document.body.classList.contains('wired-mode') ? 'ativado.' : 'desativado.'));
            break;
        case 'clear':
            terminalBody.innerHTML = '';
            printComandos();
            break;
        case 'presente dia':
            typeToTerminal('Presente dia. Presente tempo. Ha-ha-ha-ha…');
            break;
        default:
            typeToTerminal(glitchText('ACESSO NEGADO. Comando não reconhecido. Digite help para ver os comandos.'));
    }
}

terminalInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const value = terminalInput.value;
        if (value.trim() !== '') {
            handleTerminalCommand(value);
            terminalInput.value = '';
        }
    }
});

// Foco automático ao clicar no terminal
lainTerminal.addEventListener('click', () => {
    terminalInput.focus();
});

// Inicializar terminal minimizado ao carregar
window.addEventListener('DOMContentLoaded', () => {
    terminalInput.value = '';
    terminalBody.innerHTML = '';
    lainTerminal.style.transform = 'translateY(80%)';
    lainTerminal.style.opacity = '0.5';
    terminalMinimized = true;
    terminalClose.textContent = '[↑]';
});

// Minimizar/restaurar terminal
terminalClose.addEventListener('click', () => {
    if (!terminalMinimized) {
        lainTerminal.style.transform = 'translateY(80%)';
        lainTerminal.style.opacity = '0.5';
        terminalMinimized = true;
        terminalClose.textContent = '[↑]';
        terminalBody.innerHTML = '';
    } else {
        lainTerminal.style.transform = 'translateY(0)';
        lainTerminal.style.opacity = '1';
        terminalMinimized = false;
        terminalClose.textContent = '[x]';
        terminalBody.innerHTML = '';
        setTimeout(() => {
            printComandos();
            terminalBody.scrollTop = 0;
        }, 350);
        terminalInput.focus();
    }
});

// Abrir terminal se estiver fechado (atalho: Ctrl+~)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        lainTerminal.style.display = 'block';
        lainTerminal.style.transform = 'translateY(0)';
        lainTerminal.style.opacity = '1';
        terminalMinimized = false;
        terminalClose.textContent = '[x]';
        terminalInput.focus();
    }
});

// Inicializar sparks
initSparks();

// Adicionar efeito de hover no texto circular
const circularText = document.querySelector('.circular-text');
if (circularText) {
    circularText.addEventListener('mouseenter', () => {
        circularText.style.animationDuration = '5s';
        circularText.style.transform = 'scale(1.1)';
        circularText.style.textShadow = '0 0 10px var(--neon-purple)';
    });
    
    circularText.addEventListener('mouseleave', () => {
        circularText.style.animationDuration = '20s';
        circularText.style.transform = 'scale(1)';
        circularText.style.textShadow = '0 0 5px var(--neon-purple)';
    });
}

// Adicionar efeito de hover no título glitch
const title = document.querySelector('.title');
if (title) {
    title.addEventListener('mouseenter', () => {
        title.style.animationDuration = '0.5s';
    });
    
    title.addEventListener('mouseleave', () => {
        title.style.animationDuration = '2s';
    });
}

// Floating Quotes: frases do anime flutuando aleatoriamente
const floatingQuotes = [
    'Não importa onde você vá, todos estão conectados.',
    'Presente dia. Presente tempo. Ha-ha-ha-ha…',
    'Você não está sozinho. Estamos conectados.',
    'Feche o mundo, abra o próximo.',
    'A rede é vasta e infinita.',
    'Se você não é lembrado, então nunca existiu.',
    'Vamos todos amar a Lain!',
    'Quem é você? Quem sou eu?',
    'A realidade é só uma muleta para quem não consegue lidar com a Wired.',
    'E você parece não entender...',
    'Você é real?',
    'Às vezes sinto que não sou eu mesma.'
];

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function animateFloatingQuotes() {
    const floatingTexts = document.querySelectorAll('.floating-text');
    // Elementos a evitar
    const forbiddenSelectors = [
        '.title', '.main-content', '#lainTerminal', '.lain-avatar', '.footer', '.keepass-card'
    ];
    const forbiddenRects = forbiddenSelectors
        .map(sel => Array.from(document.querySelectorAll(sel)))
        .flat()
        .map(el => el.getBoundingClientRect());

    // Salvar retângulos das frases já posicionadas
    const placedRects = [];
    const bodyRect = document.body.getBoundingClientRect();

    floatingTexts.forEach((el, i) => {
        let found = false;
        let attempts = 0;
        let top, left, width, height, rect;
        el.style.visibility = 'hidden'; // Esconde até posicionar
        el.textContent = floatingQuotes[Math.floor(Math.random() * floatingQuotes.length)];
        el.style.animationDelay = (i * 2 + Math.random() * 2) + 's';
        // Garante que o texto tenha largura/altura atualizadas
        el.style.top = '0px';
        el.style.left = '0px';
        width = el.offsetWidth;
        height = el.offsetHeight;
        if (!width || !height) {
            // Força reflow se necessário
            el.style.display = 'block';
            width = el.offsetWidth;
            height = el.offsetHeight;
        }
        while (!found && attempts < 20) {
            // Sorteia posição aleatória (em px, dentro da viewport)
            top = Math.floor(randomFloat(0, window.innerHeight - height));
            left = Math.floor(randomFloat(0, window.innerWidth - width));
            rect = {left, top, right: left + width, bottom: top + height, width, height};
            // Verifica colisão com áreas proibidas
            const collidesForbidden = forbiddenRects.some(f =>
                !(rect.right < f.left || rect.left > f.right || rect.bottom < f.top || rect.top > f.bottom)
            );
            // Verifica colisão com outras frases já posicionadas
            const collidesOther = placedRects.some(f =>
                !(rect.right < f.left || rect.left > f.right || rect.bottom < f.top || rect.top > f.bottom)
            );
            if (!collidesForbidden && !collidesOther) {
                found = true;
                placedRects.push(rect);
                el.style.top = top + 'px';
                el.style.left = left + 'px';
                el.style.visibility = 'visible';
            }
            attempts++;
        }
        if (!found) {
            // Não conseguiu posicionar, esconde
            el.style.visibility = 'hidden';
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    animateFloatingQuotes();
    setInterval(animateFloatingQuotes, 12000);
});

console.log('Lain Security - Sistema de verificação de senhas carregado');
console.log('"Present day, present time..."'); 