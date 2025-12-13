// === FAQ ===
document.querySelectorAll('.faq-question').forEach(q => {
    if(q.nextElementSibling) {
        q.addEventListener('click', () => {
            const answer = q.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        });
    }
});

// === Chatbot ===
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

if(chatBox && userInput && sendBtn){
    sendBtn.addEventListener('click', () => {
        const msg = userInput.value.trim();
        if(msg){
            chatBox.innerHTML += <p><strong>أنت:</strong> ${msg}</p>;
            userInput.value = '';
            const reply = "هذا رد تجريبي"; 
            chatBox.innerHTML += <p><strong>البوت:</strong> ${reply}</p>;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });

    userInput.addEventListener('keypress', e => {
        if(e.key === 'Enter') sendBtn.click();
    });
}

// === تغيير اللغة ===
const langToggle = document.getElementById('lang-toggle');
if(langToggle){
    langToggle.addEventListener('click', () => {
        if(langToggle.innerText === 'EN'){
            langToggle.innerText = 'AR';
            // ضع هنا الكود لتغيير النصوص للإنجليزية
        } else {
            langToggle.innerText = 'EN';
            // ضع هنا الكود لتغيير النصوص للعربية
        }
    });
}

// === مودل المشرف ===
const adminBtn = document.getElementById('admin-login-btn');
const modal = document.getElementById('admin-login-modal');
const closeModal = modal.querySelector('.close');

if(adminBtn && modal){
    adminBtn.addEventListener('click', () => modal.style.display = 'block');
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => {
        if(e.target === modal) modal.style.display = 'none';
    });
}

// تسجيل دخول المشرف تجريبي
const adminSubmit = document.getElementById('admin-submit');
if(adminSubmit){
    adminSubmit.addEventListener('click', () => {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        if(username === 'admin' && password === '1234'){
            alert('تم تسجيل الدخول كمشرف');
            modal.style.display = 'none';
            window.location.href = 'admin.html';
        } else {
            alert('اسم المستخدم أو كلمة المرور خاطئة');
        }
    });
}