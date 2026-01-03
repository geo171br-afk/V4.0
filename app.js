// Configuração inicial
let notificationInterval;
let notificationCount = 0;
let isRunning = false;

// Mapeamento de apps fake
const apps = {
    whatsapp: { name: "WhatsApp", icon: "💚" },
    instagram: { name: "Instagram", icon: "🌈" },
    tinder: { name: "Tinder", icon: "🔥" },
    nubank: { name: "Nubank", icon: "💜" },
    picpay: { name: "PicPay", icon: "💛" },
    telegram: { name: "Telegram", name: "✈️" }
};

// Elementos DOM
const appSelector = document.getElementById('appSelector');
const customAppDiv = document.getElementById('customApp');
const customName = document.getElementById('customName');
const customIcon = document.getElementById('customIcon');
const notifTitle = document.getElementById('notifTitle');
const notifBody = document.getElementById('notifBody');
const notifCount = document.getElementById('notifCount');
const testBtn = document.getElementById('testBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const status = document.getElementById('status');

// Mostrar/ocultar campos personalizados
appSelector.addEventListener('change', function() {
    customAppDiv.style.display = this.value === 'custom' ? 'block' : 'none';
});

// Testar uma notificação
testBtn.addEventListener('click', async () => {
    if (!("Notification" in window)) {
        status.innerHTML = "❌ Seu navegador não suporta notificações";
        return;
    }
    
    if (Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            status.innerHTML = "❌ Permissão negada! Sem notificações pra você.";
            return;
        }
    }
    
    sendNotification();
    status.innerHTML = "✅ Notificação de teste enviada!";
});

// Iniciar bombardeio
startBtn.addEventListener('click', async () => {
    if (isRunning) return;
    
    if (!("Notification" in window)) {
        status.innerHTML = "❌ Navegador não suporta notificações";
        return;
    }
    
    if (Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            status.innerHTML = "❌ Sem permissão, arrombado!";
            return;
        }
    }
    
    const count = parseInt(notifCount.value) || 10;
    if (count > 100) {
        status.innerHTML = "❌ Máximo 100 notificações, seu louco!";
        return;
    }
    
    isRunning = true;
    notificationCount = 0;
    status.innerHTML = `🚀 Iniciando ${count} notificações...`;
    
    for (let i = 0; i < count; i++) {
        const delay = document.getElementById('randomTime').checked 
            ? Math.floor(Math.random() * 25000) + 5000 
            : i * 3000;
        
        setTimeout(() => {
            if (isRunning) {
                sendNotification();
                notificationCount++;
                status.innerHTML = `📱 ${notificationCount}/${count} notificações enviadas`;
                
                if (notificationCount >= count) {
                    isRunning = false;
                    status.innerHTML = `✅ Concluído! ${count} notificações enviadas.`;
                }
            }
        }, delay);
    }
});

// Parar tudo
stopBtn.addEventListener('click', () => {
    isRunning = false;
    status.innerHTML = "⏹️ Bombardeio interrompido!";
});

// Função para enviar notificação
function sendNotification() {
    const selectedApp = appSelector.value;
    let appName, appIcon;
    
    if (selectedApp === 'custom') {
        appName = customName.value || "App do Sistema";
        appIcon = customIcon.value || "📱";
    } else {
        appName = apps[selectedApp].name;
        appIcon = apps[selectedApp].icon;
    }
    
    // Títulos e mensagens aleatórias (se quiser misturar)
    const titles = [
        notifTitle.value,
        "Alerta importante",
        "Mensagem não lida",
        "Atualização disponível",
        "Novo acesso detectado"
    ];
    
    const bodies = [
        notifBody.value,
        "Toque para visualizar",
        "Confira agora mesmo",
        "Não perca esta oportunidade",
        "Ação necessária"
    ];
    
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomBody = bodies[Math.floor(Math.random() * bodies.length)];
    
    // Criar notificação
    const notification = new Notification(randomTitle, {
        body: `${randomBody}\n\nDe: ${appName}`,
        icon: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${appIcon}</text></svg>`,
        badge: '/icon-192.png',
        tag: `fake-notif-${Date.now()}`,
        requireInteraction: false,
        silent: !document.getElementById('soundEnable').checked
    });
    
    // Fechar automaticamente se configurado
    if (document.getElementById('autoClose').checked) {
        setTimeout(() => {
            notification.close();
        }, 5000);
    }
    
    // Clique na notificação (abrir fake URL)
    notification.onclick = () => {
        window.open(`https://${appName.toLowerCase().replace(/\s/g, '')}.com`, '_blank');
        notification.close();
    };
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registrado:', reg))
            .catch(err => console.log('Falha no Service Worker:', err));
    });
}
