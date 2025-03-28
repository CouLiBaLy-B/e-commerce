document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const cartIcon = document.querySelector('.cart-icon a');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.total-amount');
    const cartCount = document.querySelector('.cart-count');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const contactForm = document.getElementById('contactForm');
    
    let currentTestimonial = 0;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Menu mobile
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Fermer le menu mobile au clic sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Changement de couleur de la navbar au scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('nav').classList.add('scrolled');
        } else {
            document.querySelector('nav').classList.remove('scrolled');
        }
    });
    
    // Panier
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });
    
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    cartOverlay.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    // Ajouter au panier
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImg = productCard.querySelector('img').src;
            
            // Vérifier si le produit est déjà dans le panier
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    img: productImg,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Animation d'ajout au panier
            const btnRect = this.getBoundingClientRect();
            const cartIconRect = cartIcon.getBoundingClientRect();
            
            const flyingItem = document.createElement('div');
            flyingItem.className = 'flying-item';
            flyingItem.innerHTML = `<img src="${productImg}" alt="${productName}">`;
            
            flyingItem.style.position = 'fixed';
            flyingItem.style.left = `${btnRect.left}px`;
            flyingItem.style.top = `${btnRect.top}px`;
            flyingItem.style.width = '40px';
            flyingItem.style.height = '40px';
            flyingItem.style.borderRadius = '50%';
            flyingItem.style.backgroundColor = 'white';
            flyingItem.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
            flyingItem.style.display = 'flex';
            flyingItem.style.justifyContent = 'center';
            flyingItem.style.alignItems = 'center';
            flyingItem.style.zIndex = '10000';
            flyingItem.style.transition = 'all 0.5s ease-in-out';
            
            document.body.appendChild(flyingItem);
            
            setTimeout(() => {
                flyingItem.style.left = `${cartIconRect.left}px`;
                flyingItem.style.top = `${cartIconRect.top}px`;
                flyingItem.style.width = '10px';
                flyingItem.style.height = '10px';
                flyingItem.style.opacity = '0';
            }, 0);
            
            setTimeout(() => {
                flyingItem.remove();
            }, 500);
        });
    });
    
    // Mettre à jour le panier
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
    
    // Afficher les articles du panier
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
            cartTotal.textContent = '0 FCFA';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const priceNumber = parseFloat(item.price.replace(/\D/g, ''));
            const itemTotal = priceNumber * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase" data-id="${item.id}">+</button>
                    </div>
                </div>
                <i class="fas fa-times remove-item" data-id="${item.id}"></i>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        cartTotal.textContent = `${total.toLocaleString()} FCFA`;
        
        // Gestion des boutons de quantité
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cart = cart.filter(item => item.id !== id);
                }
                
                updateCart();
            });
        });
        
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                item.quantity += 1;
                updateCart();
            });
        });
        
        // Gestion de la suppression d'article
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                updateCart();
            });
        });
    }
    
    // Mettre à jour le compteur du panier
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
    }
    
    // Filtrage des produits par catégorie
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            categoryBtns.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            productCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Témoignages slider
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    prevBtn.addEventListener('click', function() {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    });
    
    nextBtn.addEventListener('click', function() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    });
    
    // Auto-rotation des témoignages
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Formulaire de contact
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Ici, vous pourriez ajouter une requête AJAX pour envoyer le formulaire
        alert(`Merci ${name} pour votre message! Nous vous contacterons bientôt à l'adresse ${email}.`);
        
        contactForm.reset();
    });
    
    // Initialisation
    updateCartCount();
    renderCartItems();
    showTestimonial(currentTestimonial);
});
