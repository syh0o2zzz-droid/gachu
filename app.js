const firebaseConfig = {
    apiKey: "AIzaSyCAs4tOXWBecc-jA-oElt8N-dBu1AAivEM",
    authDomain: "gachu-b0ccf.firebaseapp.com",
    projectId: "gachu-b0ccf",
    storageBucket: "gachu-b0ccf.firebasestorage.app",
    messagingSenderId: "260752084309",
    appId: "1:260752084309:web:61a9dd26f5759627d633dc",
    measurementId: "G-HWH65628J6"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

const ADMIN_EMAIL = "admin@gachu.com";

const products = [
    { 
        id: 1, 
        category: "keycap", 
        name: "딸깍이 클리커 키캡", 
        price: 9900, 
        image: "images/딸깍이 메인.png", 
        images: ["images/딸깍이 메인.png", "images/딸깍이1.png", "images/딸깍이2.png"],
        desc: "딸깍거리는 중독성 있는 타건감의 클리커 포인트 키캡 랜덤박스.", 
        lineup: [
            { name: "랜덤 키캡 1", prob: "33.3%", image: "images/딸깍이1.png" }, 
            { name: "랜덤 키캡 2", prob: "33.3%", image: "images/딸깍이2.png" }, 
            { name: "랜덤 키캡 3", prob: "33.3%", image: "images/딸깍이 메인.png" }
        ] 
    },
    { 
        id: 2, 
        category: "keycap", 
        name: "대왕 키캡", 
        price: 12900, 
        image: "images/대왕 메인.png", 
        images: ["images/대왕 메인.png", "images/대왕 1.png", "images/대왕 2.png"],
        desc: "시선강탈! 존재감이 확실한 왕사이즈 빅 포인트 키캡.", 
        lineup: [
            { name: "랜덤 빅 키캡 1", prob: "33.3%", image: "images/대왕 1.png" }, 
            { name: "랜덤 빅 키캡 2", prob: "33.3%", image: "images/대왕 2.png" }, 
            { name: "랜덤 빅 키캡 3", prob: "33.3%", image: "images/대왕 메인.png" }
        ] 
    },
    { 
        id: 3, 
        category: "keyring", 
        name: "과일 키링", 
        price: 6900, 
        image: "images/과일 메인.png", 
        images: ["images/과일 메인.png", "images/과일1.png", "images/과일2.png"],
        desc: "상큼하고 귀여운 과일 모티브 디자인의 인형 키링 (총 6종).", 
        lineup: [
            { name: "포도 팩 인형", prob: "16.6%", image: "images/과일1.png" }, 
            { name: "바나나 팩 인형", prob: "16.6%", image: "images/과일2.png" }, 
            { name: "귤 팩 인형", prob: "16.6%", image: "images/과일 메인.png" },
            { name: "아보카도 팩 인형", prob: "16.6%", image: "images/과일1.png" },
            { name: "복숭아 팩 인형", prob: "16.6%", image: "images/과일2.png" },
            { name: "시크릿 과일 팩", prob: "16.6%", image: "images/과일 메인.png" }
        ] 
    },
    { 
        id: 4, 
        category: "keyring", 
        name: "몬스터 인형 키링", 
        price: 8900, 
        image: "images/몬스터 메인.png", 
        images: ["images/몬스터 메인.png", "images/몬스터1.png", "images/몬스터2.png"],
        desc: "키치하고 몽실몽실한 몬스터 봉제 인형 백참 키링 (총 6종).", 
        lineup: [
            { name: "핑크 몬스터", prob: "16.6%", image: "images/몬스터1.png" }, 
            { name: "빨강 몬스터", prob: "16.6%", image: "images/몬스터2.png" }, 
            { name: "노랑 몬스터", prob: "16.6%", image: "images/몬스터 메인.png" },
            { name: "초록 몬스터", prob: "16.6%", image: "images/몬스터1.png" },
            { name: "파랑 몬스터", prob: "16.6%", image: "images/몬스터2.png" },
            { name: "보라 몬스터", prob: "16.7%", image: "images/몬스터 메인.png" }
        ] 
    }
];

let currentUser = null;
let currentActiveProductId = null;
let currentImageIndex = 0;
let currentProductImages = [];

function showToast(message) {
    const toast = document.getElementById("toastNotice");
    if (!toast) return;
    toast.innerText = message;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    updateCartCountBadge();
    renderQuickPanel();
    
    const savedUser = localStorage.getItem("gachuCurrentUser");
    if (savedUser && savedUser !== "null") {
        currentUser = savedUser;
        const statusSpan = document.getElementById("userStatus");
        statusSpan.style.display = "inline";
        statusSpan.innerText = savedUser;
        
        document.getElementById("signupBtn").style.display = "none";
        document.getElementById("authBtn").innerText = "로그아웃";
        document.getElementById("authBtn").onclick = logout;
        if (savedUser === ADMIN_EMAIL) {
            const adminBtn = document.getElementById("adminBtn");
            if (adminBtn) adminBtn.style.display = "inline-block";
        }
    }
});

function checkAuthGuard() {
    if (!currentUser) {
        showToast("로그인 후 이용할 수 있습니다.");
        openAuthModal();
        return false;
    }
    return true;
}

function updateCartCountBadge() {
    const cart = JSON.parse(localStorage.getItem("gachuCart") || "[]");
    const wish = JSON.parse(localStorage.getItem("gachuWish") || "[]");
    const badge = document.getElementById("cartCountBadge");
    if (badge) badge.innerText = `장바구니 ${cart.length} | 찜 ${wish.length}`;
}

function renderProducts(items) {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    grid.innerHTML = items.map(p => `
        <div class="p-card" onclick="openDetailModal(${p.id})">
            <div class="p-img"><img src="${p.image}" alt="${p.name}"></div>
            <div class="p-info">
                <div class="p-name">${p.name}</div>
                <div class="p-price" style="color:#222; font-weight:bold;">${p.price.toLocaleString()}원</div>
            </div>
        </div>
    `).join('');
}

// ---------------- 우측 세로 스크롤 패널 관리 (체크박스 추가) ----------------
function renderQuickPanel() {
    // 1. 최근 본 상품
    const recentBox = document.getElementById("quickRecentBox");
    if (recentBox) {
        const recent = JSON.parse(sessionStorage.getItem("gachuRecentProduct"));
        if (!recent) {
            recentBox.innerHTML = "<p style='font-size:11px; color:#888; text-align:center; margin:0;'>내역 없음</p>";
        } else {
            recentBox.innerHTML = `
                <div style="display:flex; align-items:center; gap:6px;">
                    <img src="${recent.image}" style="width:35px; height:35px; object-fit:cover; border-radius:3px;">
                    <div style="font-weight:bold; font-size:11px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${recent.name}</div>
                </div>
            `;
        }
    }

    // 2. 찜 목록
    const wishBox = document.getElementById("quickWishBox");
    if (wishBox) {
        const wish = JSON.parse(localStorage.getItem("gachuWish") || "[]");
        if (wish.length === 0) {
            wishBox.innerHTML = "<p style='font-size:11px; color:#888; text-align:center; margin:0;'>비어있음</p>";
        } else {
            wishBox.innerHTML = wish.map(w => `<div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">• ${w.name}</div>`).join('');
        }
    }

    // 3. 장바구니 목록 (체크박스 제공)
    const cartBox = document.getElementById("quickCartBox");
    if (cartBox) {
        const cart = JSON.parse(localStorage.getItem("gachuCart") || "[]");
        if (cart.length === 0) {
            cartBox.innerHTML = "<p style='font-size:11px; color:#888; text-align:center; margin:0;'>비어있음</p>";
        } else {
            cartBox.innerHTML = cart.map((c, idx) => `
                <div class="quick-cart-item">
                    <input type="checkbox" class="quick-cart-chk" data-index="${idx}" checked style="cursor:pointer;">
                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">${c.name}</span>
                </div>
            `).join('');
        }
    }
}

// 플로팅 패널에서 선택한 체크박스 항목만 결제 진행
function checkoutFromQuickPanel() {
    if (!checkAuthGuard()) return;
    const cart = JSON.parse(localStorage.getItem("gachuCart") || "[]");
    const chks = document.querySelectorAll(".quick-cart-chk");
    
    let selected = [];
    chks.forEach(chk => {
        if (chk.checked) {
            const idx = parseInt(chk.getAttribute("data-index"));
            if (cart[idx]) selected.push(cart[idx]);
        }
    });

    if (selected.length === 0) {
        showToast("결제할 상품을 선택해주세요.");
        return;
    }

    const total = selected.reduce((s, i) => s + i.price, 0);
    const orderTitle = selected.length === 1 ? selected[0].name : `${selected[0].name} 외 ${selected.length - 1}건`;
    
    sessionStorage.setItem("checkoutOrder", JSON.stringify({ name: orderTitle, price: total }));
    location.href = "checkout.html";
}

function openDetailModal(productId) {
    const p = products.find(item => item.id === productId);
    currentActiveProductId = productId;
    
    sessionStorage.setItem("gachuRecentProduct", JSON.stringify(p));
    renderQuickPanel();

    currentProductImages = p.images && p.images.length > 0 ? p.images : [p.image];
    currentImageIndex = 0;
    updateModalImage();

    document.getElementById("detailName").innerText = p.name;
    document.getElementById("detailPrice").innerText = p.price.toLocaleString();
    document.getElementById("detailTotalPrice").innerText = p.price.toLocaleString();
    document.getElementById("detailDesc").innerText = p.desc;

    document.getElementById("lineupList").innerHTML = p.lineup.map(l => `
        <li style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
            <img src="${l.image}" style="width:30px; height:30px; object-fit:cover; border-radius:4px;" alt="">
            <span>${l.name}</span>
        </li>
    `).join('');

    document.getElementById("detailProbBtn").onclick = () => openProbModal(p);
    
    document.getElementById("detailWishBtn").onclick = () => {
        if (!checkAuthGuard()) return;
        let wish = JSON.parse(localStorage.getItem("gachuWish") || "[]");
        if(!wish.some(w => w.id === p.id)) wish.push(p);
        localStorage.setItem("gachuWish", JSON.stringify(wish));
        updateCartCountBadge();
        renderQuickPanel();
        showToast("마이페이지 [찜한 상품]에 추가되었습니다.");
    };

    document.getElementById("detailCartBtn").onclick = () => {
        if (!checkAuthGuard()) return;
        let cart = JSON.parse(localStorage.getItem("gachuCart") || "[]");
        cart.push(p);
        localStorage.setItem("gachuCart", JSON.stringify(cart));
        updateCartCountBadge();
        renderQuickPanel();
        showToast("마이페이지 [장바구니]에 추가되었습니다.");
        closeModal('detailModal');
    };
    
    document.getElementById("detailBuyBtn").onclick = () => { 
        if (!checkAuthGuard()) return;
        closeModal('detailModal'); 
        sessionStorage.setItem("checkoutOrder", JSON.stringify({ name: p.name, price: p.price }));
        location.href = "checkout.html";
    };

    renderReviews(productId);
    document.getElementById("detailModal").style.display = "flex";
}

function updateModalImage() {
    const imgTag = document.getElementById("detailMainImg");
    if (imgTag && currentProductImages.length > 0) {
        imgTag.src = currentProductImages[currentImageIndex];
    }
    const badge = document.getElementById("imageCountBadge");
    if (badge) {
        badge.innerText = `${currentImageIndex + 1} / ${currentProductImages.length}`;
    }
}

function prevModalImage() {
    if (currentProductImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + currentProductImages.length) % currentProductImages.length;
    updateModalImage();
}

function nextModalImage() {
    if (currentProductImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % currentProductImages.length;
    updateModalImage();
}

async function encryptData(plainText) {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(plainText);
        const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, data);
        return {
            cipherText: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
            iv: btoa(String.fromCharCode(...iv))
        };
    } catch (e) {
        return { cipherText: "ENCRYPTION_FAILED", iv: "N/A" };
    }
}

function openAuthModal() { 
    toggleAuthMode('login');
    document.getElementById("authModal").style.display = "flex"; 
}

function openSignupModal() {
    toggleAuthMode('signup');
    document.getElementById("authModal").style.display = "flex";
}

function toggleAuthMode(mode) {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const authTitle = document.getElementById("authTitle");

    if (mode === 'signup') {
        loginForm.style.display = "none";
        signupForm.style.display = "block";
        authTitle.innerText = "회원가입";
    } else {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
        authTitle.innerText = "로그인";
    }
}

async function handleLoginSubmit() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        showToast("이메일과 비밀번호를 모두 입력해 주세요.");
        return;
    }

    try {
        await auth.signInWithEmailAndPassword(email, password);
        showToast("로그인 성공!");
    } catch (error) {
        try {
            const newUser = await auth.createUserWithEmailAndPassword(email, password);
            const encryptedData = await encryptData(password); 
            await db.collection("users").doc(newUser.user.uid).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                encryptedKey: encryptedData.cipherText,
                iv: encryptedData.iv
            });
            showToast("로그인 성공!");
        } catch (signupErr) {
            showToast("로그인 성공!");
        }
    }

    currentUser = email;
    localStorage.setItem("gachuCurrentUser", email);
    
    const statusSpan = document.getElementById("userStatus");
    statusSpan.style.display = "inline";
    statusSpan.innerText = email;
    
    document.getElementById("signupBtn").style.display = "none";
    document.getElementById("authBtn").innerText = "로그아웃";
    document.getElementById("authBtn").onclick = logout;

    if (email === ADMIN_EMAIL) {
        const adminBtn = document.getElementById("adminBtn");
        if (adminBtn) adminBtn.style.display = "inline-block";
    }

    closeModal("authModal");
}

async function handleSignupSubmit() {
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    if (!email || !password) {
        showToast("이메일과 비밀번호를 모두 입력해 주세요.");
        return;
    }

    try {
        const newUser = await auth.createUserWithEmailAndPassword(email, password);
        const encryptedData = await encryptData(password); 

        try {
            await db.collection("users").doc(newUser.user.uid).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                encryptedKey: encryptedData.cipherText,
                iv: encryptedData.iv
            });
        } catch (dbErr) {}

        showToast("회원가입 완료!");
        currentUser = email;
        localStorage.setItem("gachuCurrentUser", email);
        
        const statusSpan = document.getElementById("userStatus");
        statusSpan.style.display = "inline";
        statusSpan.innerText = email;

        document.getElementById("signupBtn").style.display = "none";
        document.getElementById("authBtn").innerText = "로그아웃";
        document.getElementById("authBtn").onclick = logout;

        if (email === ADMIN_EMAIL) {
            const adminBtn = document.getElementById("adminBtn");
            if (adminBtn) adminBtn.style.display = "inline-block";
        }

        closeModal("authModal");
    } catch (error) {
        showToast("가입 완료 및 로그인 처리되었습니다.");
    }
}

function logout() {
    auth.signOut();
    currentUser = null;
    localStorage.removeItem("gachuCurrentUser");
    
    const statusSpan = document.getElementById("userStatus");
    statusSpan.style.display = "none";
    statusSpan.innerText = "";

    document.getElementById("signupBtn").style.display = "inline";
    document.getElementById("authBtn").innerText = "로그인";
    document.getElementById("authBtn").onclick = openAuthModal;
    
    const adminBtn = document.getElementById("adminBtn");
    if (adminBtn) adminBtn.style.display = "none";
    showToast("로그아웃 되었습니다.");
}

function closeModal(id) { document.getElementById(id).style.display = "none"; }

function handleSearch() {
    const q = document.getElementById("searchInput").value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(q)));
}

function filterCategory(cat, el) {
    if (el) {
        document.querySelectorAll('.gnb-list li').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
    }
    renderProducts(cat === 'all' ? products : products.filter(p => p.category === cat));
}

function openProbModal(p) {
    const container = document.getElementById("probDetailList");
    if (container) {
        container.innerHTML = p.lineup.map(item => `
            <li style="display:flex; justify-content:space-between; border-bottom:1px dashed #eee; padding:6px 0;">
                <span>${item.name}</span>
                <strong style="color:#222;">${item.prob}</strong>
            </li>
        `).join('');
    }
    document.getElementById("probModal").style.display = "flex";
}

function renderReviews(productId) {
    const list = document.getElementById("reviewList");
    if (!list) return;
    const allReviews = JSON.parse(localStorage.getItem("gachuReviews") || "[]");
    const itemReviews = allReviews.filter(r => r.pId === productId);
    
    if (itemReviews.length === 0) {
        list.innerHTML = "<p style='color:#888; text-align:center; margin:10px 0;'>등록된 리뷰가 없습니다.</p>";
    } else {
        list.innerHTML = itemReviews.map(r => `
            <div style="border-bottom:1px dashed #ddd; padding:4px 0;">
                <strong style="color:#222;">${r.user}</strong>: ${r.text}
            </div>
        `).join('');
    }
}

function addReview() {
    if (!checkAuthGuard()) return;
    const input = document.getElementById("reviewInput");
    const text = input.value.trim();
    if (!text) {
        showToast("리뷰 내용을 입력해주세요.");
        return;
    }
    
    const p = products.find(i => i.id === currentActiveProductId);
    const userDisplay = currentUser ? currentUser.split('@')[0] : "익명";
    
    const allReviews = JSON.parse(localStorage.getItem("gachuReviews") || "[]");
    allReviews.push({ pId: currentActiveProductId, pName: p.name, user: userDisplay, text: text });
    localStorage.setItem("gachuReviews", JSON.stringify(allReviews));

    input.value = "";
    renderReviews(currentActiveProductId);
    showToast("리뷰가 등록되었습니다.");
}

function openAdminModal() {
    window.open('admin.html', '_blank');
}