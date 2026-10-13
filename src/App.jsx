import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Heart,
  LogOut,
  Menu,
  MapPin,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  Star,
  ShoppingBag,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { brandAssets, categories, collections, formatPrice, products } from "./data";

const navigation = ["Novidades", "Joias", "Coleções", "Anéis", "Presentes"];
const handleImageError = (event) => {
  if (event.currentTarget.src !== brandAssets.stillLife) {
    event.currentTarget.src = brandAssets.stillLife;
  }
};

function Header({ cartCount, onCart, favorites, onSearch, user, onAccount, onCatalog }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const goHome = () => {
    window.location.hash = "";
    setMenuOpen(false);
  };

  const handleNavigation = (item) => {
    if (item === "Joias") return onCatalog("Todos");
    if (item === "Anéis") return onCatalog("Anéis");
    if (item === "Coleções") {
      goHome();
      return setTimeout(() => document.querySelector("#colecoes")?.scrollIntoView({ behavior: "smooth" }), 50);
    }
    return goHome();
  };

  return (
    <>
      <div className="announcement">
        <span className="announcement-side">NOSSAS LOJAS</span>
        <span>FRETE GRÁTIS PARA TODO O BRASIL EM COMPRAS ACIMA DE R$ 900</span>
        <span className="announcement-side">ATENDIMENTO · WHATSAPP</span>
      </div>
      <header className="header">
        <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
          <Menu size={21} />
        </button>
        <button className="logo" onClick={goHome} aria-label="Ir para a página inicial">
          <span>LIMA</span>
          <small>JOALHERIA</small>
        </button>
        <nav className="nav">
          {navigation.map((item) => (
            <div className={`nav-item ${item === "Joias" ? "has-mega" : ""}`} key={item}>
              <button onClick={() => handleNavigation(item)}>
                {item}
                {item === "Joias" && <ChevronDown size={12} />}
              </button>
              {item === "Joias" && (
                <div className="mega-menu">
                  <div className="mega-inner">
                    <div className="mega-column">
                      <b>COMPRE POR CATEGORIA</b>
                      {["Anéis", "Colares", "Brincos", "Pulseiras"].map((category) => (
                        <button key={category} onClick={() => onCatalog(category)}>{category}<ChevronRight /></button>
                      ))}
                      <button onClick={() => onCatalog("Todos")}>Ver todas as joias<ChevronRight /></button>
                    </div>
                    <div className="mega-column">
                      <b>COLEÇÕES LIMA</b>
                      {collections.map((collection) => (
                        <button key={collection.name} onClick={() => onCatalog(collection.name)}>{collection.name}<ChevronRight /></button>
                      ))}
                    </div>
                    <div className="mega-editorial">
                      <img src={brandAssets.stillLife} alt="Seleção de joias Lima" />
                      <div><span>NOVA CURADORIA</span><h3>Essenciais que permanecem.</h3><button onClick={() => onCatalog("Lima Essence")}>EXPLORAR ESSENCE →</button></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button" onClick={onSearch} aria-label="Buscar">
            <Search size={19} strokeWidth={1.5} />
          </button>
          <button className="icon-button desktop-only" aria-label="Minha conta" onClick={onAccount}>
            <UserRound size={19} strokeWidth={1.5} />
            {user && <i className="online-dot" />}
          </button>
          <button className="icon-button desktop-only favorite-header" aria-label="Favoritos">
            <Heart size={19} strokeWidth={1.5} />
            {favorites > 0 && <span>{favorites}</span>}
          </button>
          <button className="icon-button bag-button" onClick={onCart} aria-label="Sacola">
            <ShoppingBag size={19} strokeWidth={1.5} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
        </div>
      </header>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-head">
          <span>MENU</span>
          <button className="icon-button" onClick={() => setMenuOpen(false)}><X /></button>
        </div>
        {navigation.map((item) => (
          <button key={item} onClick={() => { handleNavigation(item); setMenuOpen(false); }}>{item}<ChevronRight size={17} /></button>
        ))}
        <button className="mobile-account" onClick={onAccount}>{user ? `Olá, ${user.name}` : "Entrar na minha conta"}<UserRound size={17} /></button>
        <div className="mobile-menu-bottom">Atendimento · Favoritos</div>
      </div>
      {menuOpen && <button className="overlay" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" />}
    </>
  );
}

function ProductCard({ product, onFavorite, isFavorite }) {
  const openProduct = () => {
    window.location.hash = `produto/${product.id}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {product.badge && <span className="badge">{product.badge}</span>}
        <button
          className={`favorite ${isFavorite ? "active" : ""}`}
          onClick={() => onFavorite(product.id)}
          aria-label="Favoritar produto"
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <button className="product-image-button" onClick={openProduct}>
          <img src={product.image} alt={product.name} onError={handleImageError} />
        </button>
      </div>
      <button className="product-info" onClick={openProduct}>
        <span className="product-category">{product.collection} · {product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <span className="product-rating"><Star size={10} fill="currentColor" /> {product.rating} <i>({product.stock + 7})</i></span>
        <strong>{formatPrice(product.price)}</strong>
        <small>{product.installments} sem juros</small>
      </button>
    </article>
  );
}

function Home({ favorites, onFavorite }) {
  const [filter, setFilter] = useState("Todos");
  const scrollProducts = () => document.querySelector("#destaques")?.scrollIntoView({ behavior: "smooth" });
  const openCatalog = (value = "Todos") => {
    window.location.hash = value === "Todos" ? "joias" : `joias/${encodeURIComponent(value)}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const visibleProducts = filter === "Todos"
    ? products
    : products.filter((product) => product.category === filter || product.collection === filter);

  return (
    <main>
      <section className="hero">
        <img
          src={brandAssets.hero}
          alt="Modelo usando joias Lima"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="eyebrow">LIMA JOALHERIA</span>
          <h1>O valor do que<br />permanece.</h1>
          <p>Joias criadas para marcar histórias,<br />preservar memórias e atravessar gerações.</p>
          <button className="button light" onClick={scrollProducts}>DESCUBRA A LIMA</button>
        </div>
        <div className="hero-counter"><span>01</span><i /><span>03</span></div>
      </section>

      <section className="categories section">
        <div className="section-heading">
          <span className="eyebrow dark">EXPLORE</span>
          <h2>Joias para cada história</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <button className="category-card" key={category.name} onClick={() => openCatalog(category.name)}>
              <img src={category.image} alt={category.name} onError={handleImageError} />
              <div><span>{category.name}</span><ChevronRight size={18} /></div>
            </button>
          ))}
        </div>
      </section>

      <section className="collections section" id="colecoes">
        <div className="section-heading">
          <span className="eyebrow dark">UNIVERSO LIMA</span>
          <h2>Quatro formas de permanecer</h2>
          <p>Coleções organizadas por material, ocasião e significado.</p>
        </div>
        <div className="collections-grid">
          {collections.map((collection, index) => (
            <button className="collection-card" key={collection.name} onClick={() => openCatalog(collection.name)}>
              <div className="collection-card-image">
                <img src={collection.image} alt={collection.name} onError={handleImageError} />
                <span>0{index + 1}</span>
              </div>
              <div className="collection-card-copy">
                <span>{collection.subtitle}</span>
                <h3>{collection.name}</h3>
                <p>{collection.description}</p>
                <i>CONHECER A LINHA →</i>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="collection-banner">
        <div className="collection-copy">
          <span className="eyebrow dark">LIMA SIGNATURE</span>
          <h2>A beleza de ser única.</h2>
          <p>Linhas marcantes, metais nobres e pedras naturais em peças que transformam o cotidiano.</p>
          <button className="text-link" onClick={scrollProducts}>DESCUBRA A COLEÇÃO <span>→</span></button>
        </div>
        <img
          src={brandAssets.stillLife}
          alt="Composição de joias douradas Lima"
        />
      </section>

      <section className="products-section section" id="destaques">
        <div className="section-heading products-heading">
          <div><span className="eyebrow dark">SELEÇÃO LIMA</span><h2>Mais desejados</h2></div>
          <button className="text-link" onClick={() => openCatalog()}>VER TODAS AS JOIAS <span>→</span></button>
        </div>
        <div className="catalog-filters" aria-label="Filtrar produtos">
          {["Todos", "Anéis", "Colares", "Brincos", "Pulseiras"].map((item) => (
            <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>
          ))}
        </div>
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              onFavorite={onFavorite}
              isFavorite={favorites.includes(product.id)}
            />
          ))}
        </div>
      </section>

      <section className="story">
        <div className="story-image">
          <img
            src={brandAssets.stationery}
            alt="Identidade e embalagens Lima Joalheria"
          />
        </div>
        <div className="story-copy">
          <span className="eyebrow">NOSSA ESSÊNCIA</span>
          <h2>Feitas à mão.<br />Pensadas para sempre.</h2>
          <p>Cada joia Lima nasce do encontro entre a tradição da alta joalheria e um olhar contemporâneo. Nosso propósito é criar peças que se tornam parte de quem você é.</p>
          <button className="text-link light-link">CONHEÇA NOSSA HISTÓRIA <span>→</span></button>
        </div>
      </section>

      <section className="service-strip">
        <div><Truck size={22} strokeWidth={1.3} /><span><b>ENTREGA SEGURA</b><small>Para todo o Brasil</small></span></div>
        <div><ShieldCheck size={22} strokeWidth={1.3} /><span><b>GARANTIA LIMA</b><small>Autenticidade certificada</small></span></div>
        <div><MapPin size={22} strokeWidth={1.3} /><span><b>ATENDIMENTO EXCLUSIVO</b><small>Online e em nosso atelier</small></span></div>
      </section>

      <Newsletter />
    </main>
  );
}

function CatalogPage({ initialFilter, favorites, onFavorite }) {
  const [category, setCategory] = useState(initialFilter?.startsWith("Lima ") ? "Todos" : initialFilter || "Todos");
  const [collection, setCollection] = useState(initialFilter?.startsWith("Lima ") ? initialFilter : "Todas");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState("destaques");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setCategory(initialFilter?.startsWith("Lima ") ? "Todos" : initialFilter || "Todos");
    setCollection(initialFilter?.startsWith("Lima ") ? initialFilter : "Todas");
  }, [initialFilter]);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) =>
      (category === "Todos" || product.category === category) &&
      (collection === "Todas" || product.collection === collection) &&
      product.price <= maxPrice
    );
    return [...result].sort((a, b) => {
      if (sort === "menor") return a.price - b.price;
      if (sort === "maior") return b.price - a.price;
      if (sort === "avaliacoes") return b.rating - a.rating;
      return Number(Boolean(b.badge)) - Number(Boolean(a.badge));
    });
  }, [category, collection, maxPrice, sort]);

  const clearFilters = () => {
    setCategory("Todos");
    setCollection("Todas");
    setMaxPrice(5000);
  };

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <span className="eyebrow dark">CURADORIA LIMA</span>
        <h1>Todas as joias</h1>
        <p>Peças concebidas para acompanhar histórias e permanecer por gerações.</p>
      </section>
      <div className="catalog-toolbar">
        <button className="filter-mobile" onClick={() => setFiltersOpen(!filtersOpen)}>FILTROS <Plus size={15} /></button>
        <span>{filteredProducts.length} JOIAS</span>
        <label>ORDENAR POR
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="destaques">Destaques</option>
            <option value="menor">Menor preço</option>
            <option value="maior">Maior preço</option>
            <option value="avaliacoes">Melhor avaliados</option>
          </select>
        </label>
      </div>
      <section className="catalog-layout">
        <aside className={`catalog-sidebar ${filtersOpen ? "open" : ""}`}>
          <div className="filter-head"><b>FILTRAR POR</b><button onClick={clearFilters}>Limpar</button></div>
          <div className="filter-group">
            <b>CATEGORIA</b>
            {["Todos", "Anéis", "Colares", "Brincos", "Pulseiras"].map((item) => (
              <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>
                <span />{item}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <b>COLEÇÃO</b>
            {["Todas", ...collections.map((item) => item.name)].map((item) => (
              <button key={item} className={collection === item ? "active" : ""} onClick={() => setCollection(item)}>
                <span />{item}
              </button>
            ))}
          </div>
          <div className="filter-group price-filter">
            <b>FAIXA DE PREÇO</b>
            <input type="range" min="1000" max="5000" step="250" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} />
            <small>Até {formatPrice(maxPrice)}</small>
          </div>
        </aside>
        <div className="catalog-products">
          {filteredProducts.length ? filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onFavorite={onFavorite} isFavorite={favorites.includes(product.id)} />
          )) : (
            <div className="no-products"><h2>Nenhuma joia encontrada.</h2><p>Ajuste os filtros para descobrir outras peças.</p><button onClick={clearFilters}>LIMPAR FILTROS</button></div>
          )}
        </div>
      </section>
    </main>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    if (!email.includes("@")) return;
    const subscribers = JSON.parse(localStorage.getItem("lima-newsletter") || "[]");
    localStorage.setItem("lima-newsletter", JSON.stringify([...new Set([...subscribers, email])]));
    setSent(true);
    setEmail("");
  };

  return (
    <section className="newsletter section">
      <span className="eyebrow dark">FIQUE POR DENTRO</span>
      <h2>Novidades Lima, primeiro para você.</h2>
      <p>Receba lançamentos, histórias e condições especiais.</p>
      {sent ? (
        <div className="success-message">Obrigada! Seu e-mail foi cadastrado com sucesso.</div>
      ) : (
        <form onSubmit={submit}>
          <input type="email" placeholder="Digite seu melhor e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit">CADASTRAR <ArrowLeft className="arrow-right" size={16} /></button>
        </form>
      )}
    </section>
  );
}

function ProductPage({ product, onAdd, onFavorite, isFavorite }) {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [size, setSize] = useState("16");
  const [openDetail, setOpenDetail] = useState("description");
  const [cep, setCep] = useState("");
  const [delivery, setDelivery] = useState("");

  const back = () => {
    window.location.hash = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const calculateShipping = (event) => {
    event.preventDefault();
    if (cep.replace(/\D/g, "").length !== 8) {
      setDelivery("Digite um CEP válido com 8 números.");
      return;
    }
    setDelivery("Entrega expressa grátis · 3 a 5 dias úteis");
  };

  return (
    <main className="product-page">
      <div className="breadcrumb">
        <button onClick={back}>Home</button><span>/</span><span>{product.category}</span><span>/</span><b>{product.name}</b>
      </div>
      <section className="product-detail">
        <div className="gallery">
          <div className="thumbnails">
            {[product.image, product.imageAlt].map((image, index) => (
              <button className={selectedImage === image ? "selected" : ""} onClick={() => setSelectedImage(image)} key={image}>
                <img src={image} alt={`${product.name} vista ${index + 1}`} onError={handleImageError} />
              </button>
            ))}
          </div>
          <div className="main-product-image">
            {product.badge && <span className="badge">{product.badge}</span>}
            <img src={selectedImage} alt={product.name} onError={handleImageError} />
          </div>
        </div>
        <div className="detail-info">
          <button className={`favorite detail-favorite ${isFavorite ? "active" : ""}`} onClick={() => onFavorite(product.id)}>
            <Heart size={21} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <span className="eyebrow dark">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="material">{product.description}</p>
          <div className="detail-rating"><Star size={12} fill="currentColor" /> {product.rating} · {product.stock + 7} avaliações</div>
          <div className="detail-price">{formatPrice(product.price)}</div>
          <p className="installments">{product.installments} sem juros</p>
          <p className="stock-status">● Em estoque · {product.stock} unidades disponíveis</p>
          <div className="divider" />
          <div className="size-title"><b>SELECIONE O ARO</b><button>Guia de medidas</button></div>
          <div className="sizes">
            {["14", "16", "18", "20", "22"].map((item) => (
              <button key={item} className={size === item ? "selected" : ""} onClick={() => setSize(item)}>{item}</button>
            ))}
          </div>
          <button className="add-button" onClick={() => onAdd(product, size)}>ADICIONAR À SACOLA</button>
          <div className="shipping"><ShoppingBag size={17} /><span><b>Frete grátis</b> para todo o Brasil</span></div>
          <form className="shipping-calculator" onSubmit={calculateShipping}>
            <MapPin size={17} />
            <input
              value={cep}
              onChange={(event) => setCep(event.target.value)}
              placeholder="Calcule o frete pelo CEP"
              maxLength={9}
              inputMode="numeric"
            />
            <button type="submit">CALCULAR</button>
          </form>
          {delivery && <div className={`delivery-result ${delivery.startsWith("Digite") ? "error" : ""}`}>{delivery}</div>}
          <div className="detail-accordions">
            <button onClick={() => setOpenDetail(openDetail === "description" ? "" : "description")}>
              DESCRIÇÃO <Plus size={17} className={openDetail === "description" ? "rotated" : ""} />
            </button>
            {openDetail === "description" && <p>{product.details}</p>}
            <button onClick={() => setOpenDetail(openDetail === "care" ? "" : "care")}>
              CUIDADOS COM A JOIA <Plus size={17} className={openDetail === "care" ? "rotated" : ""} />
            </button>
            {openDetail === "care" && <p>Guarde sua joia separadamente e evite contato com cosméticos, perfumes e produtos químicos.</p>}
          </div>
        </div>
      </section>
      <section className="product-promise">
        <div><b>OURO 18K</b><span>Qualidade certificada</span></div>
        <div><b>FEITO À MÃO</b><span>Por nossos especialistas</span></div>
        <div><b>GARANTIA LIMA</b><span>Cuidado para sempre</span></div>
      </section>
      <section className="recommendations section">
        <div className="section-heading"><span className="eyebrow dark">COMPLETE SEU ESTILO</span><h2>Você também pode gostar</h2></div>
        <div className="product-grid">
          {products.filter((item) => item.id !== product.id).slice(0, 3).map((item) => (
            <ProductCard product={item} key={item.id} onFavorite={onFavorite} isFavorite={false} />
          ))}
        </div>
      </section>
    </main>
  );
}

function SearchPanel({ open, onClose }) {
  const [query, setQuery] = useState("");
  const results = query.length > 1
    ? products.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase()))
    : [];

  const openProduct = (id) => {
    window.location.hash = `produto/${id}`;
    onClose();
  };

  return (
    <div className={`search-panel ${open ? "open" : ""}`}>
      <div className="search-inner">
        <div className="search-field"><Search size={21} /><input autoFocus={open} placeholder="O que você procura?" value={query} onChange={(e) => setQuery(e.target.value)} /><button onClick={onClose}><X /></button></div>
        {query.length > 1 && (
          <div className="search-results">
            {results.length ? results.map((item) => (
              <button key={item.id} onClick={() => openProduct(item.id)}>
                <img src={item.image} alt="" onError={handleImageError} /><span><b>{item.name}</b><small>{formatPrice(item.price)}</small></span><ChevronRight />
              </button>
            )) : <p>Nenhuma joia encontrada.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function Cart({ open, onClose, items, setItems, onCheckout }) {
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const changeQty = (index, delta) => {
    setItems((current) => current
      .map((item, itemIndex) => itemIndex === index ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  };

  return (
    <>
      {open && <button className="overlay cart-overlay" onClick={onClose} aria-label="Fechar sacola" />}
      <aside className={`cart ${open ? "open" : ""}`}>
        <div className="cart-head"><div><span>SUA SACOLA</span><small>{items.length} {items.length === 1 ? "item" : "itens"}</small></div><button onClick={onClose}><X /></button></div>
        <div className="cart-body">
          {!items.length ? (
            <div className="empty-cart"><ShoppingBag size={38} strokeWidth={1} /><h3>Sua sacola está vazia</h3><p>Descubra joias que contam a sua história.</p><button className="button dark-button" onClick={onClose}>CONTINUAR COMPRANDO</button></div>
          ) : items.map((item, index) => (
            <div className="cart-item" key={`${item.id}-${item.size}-${index}`}>
              <img src={item.image} alt={item.name} onError={handleImageError} />
              <div><b>{item.name}</b><span>Aro: {item.size}</span><strong>{formatPrice(item.price)}</strong><div className="qty"><button onClick={() => changeQty(index, -1)}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => changeQty(index, 1)}><Plus size={13} /></button></div></div>
            </div>
          ))}
        </div>
        {!!items.length && <div className="cart-footer"><div><span>Subtotal</span><b>{formatPrice(total)}</b></div><small>Frete grátis aplicado · compra protegida</small><button onClick={onCheckout}>FINALIZAR COMPRA</button></div>}
      </aside>
    </>
  );
}

function AccountModal({ open, onClose, user, onLogin, onLogout }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = (event) => {
    event.preventDefault();
    onLogin({ name: name.trim().split(" ")[0], email });
    setName("");
    setEmail("");
  };

  if (!open) return null;

  return (
    <>
      <button className="overlay account-overlay" onClick={onClose} aria-label="Fechar conta" />
      <section className="account-modal" role="dialog" aria-modal="true" aria-label="Minha conta">
        <button className="account-close" onClick={onClose}><X /></button>
        <span className="eyebrow dark">ÁREA LIMA</span>
        {user ? (
          <div className="account-welcome">
            <div className="account-avatar">{user.name.charAt(0)}</div>
            <h2>Olá, {user.name}.</h2>
            <p>{user.email}</p>
            <div className="account-links"><button>Meus pedidos <ChevronRight /></button><button>Meus favoritos <ChevronRight /></button><button>Dados pessoais <ChevronRight /></button></div>
            <button className="logout-button" onClick={onLogout}><LogOut size={15} /> SAIR DA CONTA</button>
          </div>
        ) : (
          <>
            <h2>Bem-vinda à Lima.</h2>
            <p>Entre para acompanhar pedidos, salvar favoritos e receber atendimento personalizado.</p>
            <form onSubmit={submit}>
              <label>Nome<input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Seu nome" /></label>
              <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="voce@email.com" /></label>
              <button type="submit">CRIAR ACESSO</button>
            </form>
            <small>Ambiente demonstrativo: nenhum dado é enviado.</small>
          </>
        )}
      </section>
    </>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand"><div className="logo footer-logo"><span>LIMA</span><small>JOALHERIA</small></div><p>Joias que atravessam o tempo<br />e celebram histórias.</p></div>
        <div><b>ATENDIMENTO</b><a href="#">Fale conosco</a><a href="#">Entregas e prazos</a><a href="#">Trocas e devoluções</a></div>
        <div><b>INSTITUCIONAL</b><a href="#">Nossa história</a><a href="#">Nossas lojas</a><a href="#">Trabalhe conosco</a></div>
        <div><b>SIGA A LIMA</b><a href="#">Instagram</a><a href="#">Pinterest</a><a href="#">WhatsApp</a></div>
      </div>
      <div className="footer-bottom"><span>© 2026 Lima Joalheria. Todos os direitos reservados.</span><span>Política de privacidade · Termos de uso</span></div>
    </footer>
  );
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem("lima-cart") || "[]"));
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("lima-favorites") || "[]"));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("lima-user") || "null"));

  useEffect(() => {
    const updateRoute = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  useEffect(() => localStorage.setItem("lima-cart", JSON.stringify(cartItems)), [cartItems]);
  useEffect(() => localStorage.setItem("lima-favorites", JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem("lima-user", JSON.stringify(user)), [user]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const productId = Number(route.match(/produto\/(\d+)/)?.[1]);
  const selectedProduct = products.find((item) => item.id === productId);
  const catalogMatch = route.match(/joias(?:\/(.+))?/);
  const catalogFilter = catalogMatch?.[1] ? decodeURIComponent(catalogMatch[1]) : "Todos";

  const openCatalog = (filter = "Todos") => {
    window.location.hash = filter === "Todos" ? "joias" : `joias/${encodeURIComponent(filter)}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = (id) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const addToCart = (product, size) => {
    setCartItems((current) => [...current, { ...product, size, quantity: 1 }]);
    setToast(`${product.name} foi adicionado à sacola.`);
    setCartOpen(true);
  };

  const checkout = () => {
    if (!user) {
      setCartOpen(false);
      setAccountOpen(true);
      setToast("Entre na sua conta para continuar a compra.");
      return;
    }
    setCartOpen(false);
    setCartItems([]);
    setToast(`Pedido demonstrativo criado para ${user.name}.`);
  };

  return (
    <>
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCart={() => setCartOpen(true)}
        favorites={favorites.length}
        onSearch={() => setSearchOpen(true)}
        user={user}
        onAccount={() => setAccountOpen(true)}
        onCatalog={openCatalog}
      />
      {selectedProduct ? (
        <ProductPage product={selectedProduct} onAdd={addToCart} onFavorite={toggleFavorite} isFavorite={favorites.includes(selectedProduct.id)} />
      ) : catalogMatch ? (
        <CatalogPage initialFilter={catalogFilter} favorites={favorites} onFavorite={toggleFavorite} />
      ) : (
        <Home favorites={favorites} onFavorite={toggleFavorite} />
      )}
      <Footer />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} setItems={setCartItems} onCheckout={checkout} />
      <AccountModal
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        user={user}
        onLogin={(customer) => {
          setUser(customer);
          setToast(`Bem-vinda à Lima, ${customer.name}.`);
        }}
        onLogout={() => {
          setUser(null);
          setAccountOpen(false);
          setToast("Você saiu da sua conta.");
        }}
      />
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
