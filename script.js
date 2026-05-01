const produtos = [
    { id: 1, nome: "Flores de Plástico Artesanais", preco: 20.00, img: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500", personalizavel: false },
    { id: 2, nome: "Chupeta Luxo Personalizada", preco: 15.50, img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=500", personalizavel: true },
    { id: 3, nome: "Arranjo de Mesa Amor", preco: 35.00, img: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500", personalizavel: false }
];

let carrinho = [];

function mostrarToast(msg, tipo = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${tipo === 'warning' ? 'warning' : ''}`;
    toast.innerHTML = `<span>${tipo === 'warning' ? '⚠️' : '🌸'}</span> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function renderProdutos() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = produtos.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.nome}">
            <h3>${p.nome}</h3>
            <p style="color: #c5a059; font-weight: bold;">${p.preco.toFixed(2)}€</p>
            ${p.personalizavel ? `<input type="text" id="input-${p.id}" placeholder="Nome na chupeta...">` : ''}
            <button class="btn-add" onclick="adicionarAoCarrinho(${p.id})">Adicionar</button>
        </div>
    `).join('');
}

function adicionarAoCarrinho(id) {
    const p = produtos.find(item => item.id === id);
    const input = document.getElementById(`input-${id}`);
    
    if (p.personalizavel && (!input || !input.value.trim())) {
        return mostrarToast("Por favor, escreva o nome para a chupeta!", "warning");
    }

    const obs = input ? input.value : '';
    carrinho.push({ ...p, obs });
    
    document.getElementById('cart-count').innerText = carrinho.length;
    if(input) input.value = '';
    mostrarToast(`${p.nome} adicionado!`);
}

function toggleCart() {
    const m = document.getElementById('cart-modal');
    m.style.display = m.style.display === 'block' ? 'none' : 'block';
    renderCarrinho();
}

function renderCarrinho() {
    const list = document.getElementById('cart-items');
    list.innerHTML = carrinho.map((item, i) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
            <span>${item.nome} ${item.obs ? `(${item.obs})` : ''}</span>
            <button onclick="remover(${i})" style="background:none; border:none; color:red; cursor:pointer;">Remover</button>
        </div>
    `).join('');
    
    const total = carrinho.reduce((acc, curr) => acc + curr.preco, 0);
    document.getElementById('total-price').innerText = total.toFixed(2);
}

function remover(i) {
    carrinho.splice(i, 1);
    document.getElementById('cart-count').innerText = carrinho.length;
    renderCarrinho();
}

function sendToWhatsApp() {
    const nome = document.getElementById('client-name').value;
    if (!nome) return mostrarToast("Diz-nos o teu nome primeiro!", "warning");
    if (carrinho.length === 0) return mostrarToast("O teu carrinho está vazio!", "warning");

    const tel = "351912345678"; // <--- NÚMERO DA TUA CUNHADA
    let texto = `Olá! Sou o/a ${nome}. Gostaria de encomendar:\n\n`;
    carrinho.forEach(item => texto += `• ${item.nome} ${item.obs ? `[${item.obs}]` : ''}\n`);
    
    const total = carrinho.reduce((acc, curr) => acc + curr.preco, 0);
    texto += `\n*Total:* ${total.toFixed(2)}€`;

    window.open(`https://wa.me/${tel}?text=${encodeURIComponent(texto)}`);
}

renderProdutos();