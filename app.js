// 1. 상품 데이터 (9종)
const products = [
    { id: 1, category: "keycap", name: "[시크릿] 커스텀 메탈 키캡 박스", price: 9900, image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80", basic: "70.0%", rare: "25.0%", secret: "5.0%", desc: "수제 감성 아크릴 및 메탈 포인트 키캡입니다.", lineup: [{ name: "파스텔 푸딩", grade: "일반" }, { name: "크리스탈 투명", grade: "레어" }, { name: "골드 메탈", grade: "시크릿" }] },
    { id: 2, category: "keycap", name: "Retro 레트로 타자기 키캡 블라인드", price: 8500, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80", basic: "75.0%", rare: "20.0%", secret: "5.0%", desc: "동글동글 레트로 포인트 타자기 키캡 시리즈.", lineup: [{ name: "클래식 블랙", grade: "일반" }, { name: "빈티지 브라운", grade: "레어" }, { name: "자개 영롱", grade: "시크릿" }] },
    { id: 3, category: "squishy", name: "말랑말랑 모찌 고양이 스트레스볼", price: 4900, image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&q=80", basic: "80.0%", rare: "17.0%", secret: "3.0%", desc: "극강의 쫀득 모찌 촉감형 말랑이.", lineup: [{ name: "삼색이 찹쌀떡", grade: "일반" }, { name: "치즈 젤리", grade: "레어" }, { name: "야광 핑키", grade: "시크릿" }] },
    { id: 4, category: "squishy", name: "치즈 냥이 찹쌀떡 푸딩 말랑이", price: 5900, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&q=80", basic: "78.0%", rare: "19.0%", secret: "3.0%", desc: "귀여운 고양이 디자인의 스트레스 해소 장난감.", lineup: [{ name: "치즈 고양이", grade: "일반" }, { name: "카라멜 푸딩", grade: "레어" }, { name: "레인보우 젤리", grade: "시크릿" }] },
    { id: 5, category: "figure", name: "숲속 아기 동물 미니 피규어 박스", price: 11900, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&q=80", basic: "65.0%", rare: "30.0%", secret: "5.0%", desc: "데스크 위에 오르는 힐링 아기 동물 컬렉션.", lineup: [{ name: "아기 람쥐", grade: "일반" }, { name: "하얀 토끼", grade: "레어" }, { name: "황금 여우", grade: "시크릿" }] },
    { id: 6, category: "figure", name: "사이버펑크 네온 픽셀 아크릴 피규어", price: 12900, image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&q=80", basic: "60.0%", rare: "32.0%", secret: "8.0%", desc: "픽셀 아트 감성의 미니 아크릴 스탠드 피규어.", lineup: [{ name: "픽셀 시티", grade: "일반" }, { name: "네온 바이퍼", 평: "레어" }, { name: "홀로그램 코어", grade: "시크릿" }] },
    { id: 7, category: "photocard", name: "별다꾸 홀로그램 포카 탑로더 패키지", price: 6900, image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&q=80", basic: "70.0%", rare: "26.0%", secret: "4.0%", desc: "포토카드를 안전하고 빛나게 커스텀하는 바인더 소품.", lineup: [{ name: "하트 홀로그램", grade: "일반" }, { name: "스파클 케이스", grade: "레어" }, { name: "커스텀 프레임", grade: "시크릿" }] },
    { id: 8, category: "photocard", name: "투명 아크릴 굿즈 키링 바인더", price: 7900, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80", basic: "72.0%", rare: "23.0%", secret: "5.0%", desc: "다이어리 및 가방 꾸미기용 아크릴 키링 세트.", lineup: [{ name: "투명 아크릴", grade: "일반" }, { name: "글리터 키링", grade: "레어" }, { name: "리미티드 참", grade: "시크릿" }] },
    { id: 9, category: "desk", name: "사이버 픽셀 무드등 & 데스크 소품", price: 14900, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80", basic: "55.0%", rare: "35.0%", secret: "10.0%", desc: "데스크 인테리어 감성을 완성하는 미니 조명.", lineup: [{ name: "미니 하트등", grade: "일반" }, { name: "RGB 사이버웨이브", grade: "레어" }, { name: "네온 사인 홀로그램", grade: "시크릿" }] }
];

let cart = [];
let wishlist = [];
let currentUser = null;
const TOSS_CLIENT_KEY = "test_ck_docs_OxvZ8dOE3dpress";

// 2. 초기 렌더링 (이 부분이 있어야 화면에 뜹니다!)
document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
});

// 3. 상품 카드 렌더링
function renderProducts(items) {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = items.map(p => `
        <div class="p-card" onclick="openDetailModal(${p.id})">
            <div class="p-img"><img src="${p.image}" alt="${p.name}"></div>
            <div class="p-info">
                <div class="p-name">${p.name}</div>
                <div class="p-price">${p.price.toLocaleString()}원</div>
            </div>
        </div>
    `).join('');
}

// 4. 상품 상세 팝업 오픈
function openDetailModal(productId) {
    const p = products.find(item => item.id === productId);
    document.getElementById("recentItemName").innerText = p.name; 

    document.getElementById("detailMainImg").src = p.image;
    document.getElementById("detailName").innerText = p.name;
    document.getElementById("detailPrice").innerText = p.price.toLocaleString();
    document.getElementById("detailTotalPrice").innerText = p.price.toLocaleString();
    document.getElementById("detailDesc").innerText = p.desc;

    document.getElementById("lineupList").innerHTML = p.lineup.map(l => `
        <li><strong>[${l.grade}]</strong> ${l.name}</li>
    `).join('');

    document.getElementById("detailProbBtn").onclick = () => openProbModal(p);
    document.getElementById("detailWishBtn").onclick = () => toggleWishlist(p.id);
    document.getElementById("detailCartBtn").onclick = () => { addToCart(p.id); closeModal('detailModal'); };
    document.getElementById("detailBuyBtn").onclick = () => { closeModal('detailModal'); requestTossPayment(p.name, p.price); };

    document.getElementById("detailModal").style.display = "flex";
}

// 5. 부가 기능 (모달 닫기, 검색, 카테고리 필터)
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
    document.getElementById("probBasic").innerText = p.basic;
    document.getElementById("probRare").innerText = p.rare;
    document.getElementById("probSecret").innerText = p.secret;
    document.getElementById("probModal").style.display = "flex";
}

// 6. 장바구니 / 좋아요
function toggleWishlist(id) {
    const p = products.find(i => i.id === id);
    if (!wishlist.includes(p)) wishlist.push(p);
    document.getElementById("wishBadge").innerText = wishlist.length;
    alert("찜 목록에 추가되었습니다.");
}

function openWishlistModal() { alert(`현재 찜한 상품 갯수: ${wishlist.length}개 (시연용 간이 알림)`); }
function addToCart(id) {
    cart.push(products.find(i => i.id === id));
    document.getElementById("cartBadge").innerText = cart.length;
    alert("장바구니에 담겼습니다.");
}
function openCartModal() { alert(`현재 장바구니 상품 갯수: ${cart.length}개 (시연용 간이 알림)`); }

// 7. 토스페이먼츠 결제 연동
function requestTossPayment(orderName, amount) {
    if (typeof TossPayments === 'undefined') return alert("결제 모듈 로딩 중입니다.");
    const tossPayments = TossPayments(TOSS_CLIENT_KEY);
    tossPayments.requestPayment('카드', {
        amount: amount,
        orderId: "ORDER_" + new Date().getTime(),
        orderName: orderName,
        successUrl: window.location.href,
        failUrl: window.location.href,
    });
}