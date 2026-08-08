// ============================================================
// EFECTOS INTERACTIVOS — 100% JavaScript, autocontenido.
// Solo agrega: <script src="interactivo.js"></script> antes de </body>
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  const estilos = document.createElement("style");
  estilos.textContent = `
    #js-scroll-progress-track{
      position:fixed; top:0; left:0; width:100%; height:3px;
      background:rgba(255,255,255,0.08); z-index:9999;
    }
    #js-scroll-progress{
      height:100%; width:0%;
      background:linear-gradient(90deg,#8B3DFF,#FF3D7A,#FF7A3D);
      transition:width 0.1s ease;
    }
    #js-volver-arriba{
      position:fixed; right:24px; bottom:24px;
      width:48px; height:48px; border-radius:50%;
      background:linear-gradient(135deg,#8B3DFF,#FF3D7A);
      color:#fff; display:flex; align-items:center; justify-content:center;
      font-size:1.1rem; border:none; cursor:pointer;
      opacity:0; visibility:hidden; transform:translateY(10px);
      transition:opacity .25s ease, transform .25s ease, visibility .25s;
      z-index:9998;
    }
    #js-volver-arriba.visible{ opacity:1; visibility:visible; transform:translateY(0); }

    .js-reveal{
      opacity:0; transform:translateY(30px);
      transition:opacity .7s ease, transform .7s ease;
    }
    .js-reveal.visible{ opacity:1; transform:translateY(0); }

    .nav-link.js-active{
      color:#F5F3FB !important;
      background:rgba(255,255,255,0.08);
    }

    @media (prefers-reduced-motion: reduce){
      .js-reveal{ opacity:1 !important; transform:none !important; transition:none !important; }
    }
  `;
  document.head.appendChild(estilos);

  // 1. BARRA DE PROGRESO
  const track = document.createElement("div");
  track.id = "js-scroll-progress-track";
  const fill = document.createElement("div");
  fill.id = "js-scroll-progress";
  track.appendChild(fill);
  document.body.prepend(track);

  window.addEventListener("scroll", () => {
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    const porcentaje = alto > 0 ? (window.scrollY / alto) * 100 : 0;
    fill.style.width = porcentaje + "%";
  });

  // 2. BOTÓN "VOLVER ARRIBA"
  const botonArriba = document.createElement("button");
  botonArriba.id = "js-volver-arriba";
  botonArriba.setAttribute("aria-label", "Volver arriba");
  botonArriba.textContent = "↑";
  document.body.appendChild(botonArriba);

  window.addEventListener("scroll", () => {
    botonArriba.classList.toggle("visible", window.scrollY > 500);
  });
  botonArriba.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ------------------------------------------------------------
  // 3. MENÚ RESALTA LA SECCIÓN ACTUAL
  //    "Inicio" vinculado a .hero (no a <main>, que envuelve todo)
  // ------------------------------------------------------------
  const enlacesNav = document.querySelectorAll(".nav-link");
  const mapaNav = [];

  const hero = document.querySelector(".hero");
  const enlaceInicio = document.querySelector('.nav-link[href="#top"]');
  if (hero && enlaceInicio) {
    mapaNav.push({ elemento: hero, enlace: enlaceInicio });
  }

  document.querySelectorAll("section[id]").forEach((seccion) => {
    const enlace = document.querySelector('.nav-link[href="#' + seccion.id + '"]');
    if (enlace) {
      mapaNav.push({ elemento: seccion, enlace: enlace });
    }
  });

  if (mapaNav.length) {
    const observadorNav = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            const coincidencia = mapaNav.find((m) => m.elemento === entrada.target);
            if (coincidencia) {
              enlacesNav.forEach((enlace) => enlace.classList.remove("js-active"));
              coincidencia.enlace.classList.add("js-active");
            }
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    mapaNav.forEach((m) => observadorNav.observe(m.elemento));
  }

  // Si el usuario llegó al final de la página, fuerza que se resalte
  // el último enlace del menú (Contacto), sin depender de que la
  // franja de detección del centro llegue a tocarlo.
  window.addEventListener("scroll", () => {
    const llegoAlFinal =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (llegoAlFinal && enlacesNav.length) {
      enlacesNav.forEach((enlace) => enlace.classList.remove("js-active"));
      enlacesNav[enlacesNav.length - 1].classList.add("js-active");
    }
  });

  // ------------------------------------------------------------
  // 4. APARICIÓN AL HACER SCROLL
  // ------------------------------------------------------------
  const objetivosReveal = document.querySelectorAll(
    "section, .servicio-card, .card, .proceso-step"
  );

  const observadorReveal = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observadorReveal.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  objetivosReveal.forEach((el) => {
    el.classList.add("js-reveal");
    if (el.closest(".grid, .servicios-grid, .proceso-steps")) {
      const hermanos = Array.from(el.parentElement.children);
      const posicion = hermanos.indexOf(el);
      el.style.transitionDelay = (posicion * 90) + "ms";
    }
    observadorReveal.observe(el);
  });

  // 5. INCLINACIÓN 3D EN TARJETAS
  document.querySelectorAll(".card, .servicio-card").forEach((tarjeta) => {
    tarjeta.style.transition = "transform 0.1s ease";
    tarjeta.addEventListener("mousemove", (e) => {
      const rect = tarjeta.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
      const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
      tarjeta.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    tarjeta.addEventListener("mouseleave", () => {
      tarjeta.style.transform = "perspective(700px) rotateX(0) rotateY(0) translateY(0)";
    });
  });

  // 6. BOTONES "MAGNÉTICOS"
  document.querySelectorAll(".btn-solid").forEach((boton) => {
    boton.addEventListener("mousemove", (e) => {
      const rect = boton.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      boton.style.transform = `translate(${x * 0.15}px, ${y * 0.3}px)`;
    });
    boton.addEventListener("mouseleave", () => {
      boton.style.transform = "translate(0,0)";
    });
  });

  // 7. COPIAR CORREO AL PORTAPAPELES
  const regexCorreo = /[\w.+-]+@[\w-]+\.[\w.-]+/;
  document.querySelectorAll(".footer-col p, .footer-brand p").forEach((el) => {
    const match = el.textContent.match(regexCorreo);
    if (match) {
      const correo = match[0];
      el.style.cursor = "pointer";
      el.title = "Clic para copiar";
      el.addEventListener("click", () => {
        navigator.clipboard.writeText(correo).then(() => {
          const original = el.textContent;
          el.textContent = "✔ ¡Correo copiado!";
          setTimeout(() => (el.textContent = original), 1500);
        });
      });
    }
  });

});



// ============================================================
// ICONOS DE REDES SOCIALES MÁS INTERACTIVOS — autocontenido.
// Solo agrega: <script src="redes-interactivas.js"></script>
// junto a tus otros <script> antes de </body>
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  const iconos = document.querySelectorAll(".hero-social a, .footer-social a");
  if (!iconos.length) return;

  const estilos = document.createElement("style");
  estilos.textContent = `
    .hero-social a, .footer-social a{
      position:relative !important;
      overflow:hidden !important;
      transition:transform 0.25s cubic-bezier(.34,1.56,.64,1),
                 border-color 0.25s ease,
                 background 0.25s ease,
                 color 0.25s ease,
                 box-shadow 0.25s ease !important;
      animation:js-red-pulso 2.6s ease-in-out infinite;
    }

    .hero-social a:hover, .footer-social a:hover{
      transform:scale(1.18) translateY(-3px) !important;
      border-color:transparent !important;
      background:linear-gradient(135deg, #8B3DFF, #FF3D7A, #FF7A3D) !important;
      color:#fff !important;
      box-shadow:0 6px 18px rgba(255,61,122,0.45) !important;
      animation:none !important;
    }

    .hero-social a:active, .footer-social a:active{
      transform:scale(0.94) !important;
    }

    @keyframes js-red-pulso{
      0%, 100%{ box-shadow:0 0 0 0 rgba(139,61,255,0.35); }
      50%{ box-shadow:0 0 0 6px rgba(139,61,255,0); }
    }

    .hero-social a:nth-child(1), .footer-social a:nth-child(1){ animation-delay:0s; }
    .hero-social a:nth-child(2), .footer-social a:nth-child(2){ animation-delay:0.2s; }
    .hero-social a:nth-child(3), .footer-social a:nth-child(3){ animation-delay:0.4s; }
    .hero-social a:nth-child(4), .footer-social a:nth-child(4){ animation-delay:0.6s; }

    @keyframes js-ripple-anim-red{
      to{ transform:scale(2.4); opacity:0; }
    }

    @media (prefers-reduced-motion: reduce){
      .hero-social a, .footer-social a{ animation:none !important; }
    }
  `;
  document.head.appendChild(estilos);

  iconos.forEach((icono) => {
    icono.addEventListener("click", (e) => {
      const rect = icono.getBoundingClientRect();
      const onda = document.createElement("span");
      const tamano = Math.max(rect.width, rect.height);
      onda.style.position = "absolute";
      onda.style.borderRadius = "50%";
      onda.style.background = "rgba(255,255,255,0.55)";
      onda.style.width = onda.style.height = tamano + "px";
      onda.style.left = (e.clientX - rect.left - tamano / 2) + "px";
      onda.style.top = (e.clientY - rect.top - tamano / 2) + "px";
      onda.style.transform = "scale(0)";
      onda.style.animation = "js-ripple-anim-red 0.5s ease-out";
      onda.style.pointerEvents = "none";
      icono.appendChild(onda);
      setTimeout(() => onda.remove(), 500);
    });
  });

});



// ============================================================
// GALERÍA DE PORTAFOLIO — imagen grande a un lado, info al otro.
// Protegido contra duplicados: si este script (o uno igual) ya
// se ejecutó, no vuelve a crear nada.
// ============================================================

(function () {
  if (window.__portafolioModalInit) return;
  window.__portafolioModalInit = true;

  // Por si quedó algún modal viejo creado antes de este candado,
  // los elimina todos antes de crear el nuevo (limpieza de seguridad)
  document.querySelectorAll("#js-modal-fondo").forEach((el) => el.remove());

  function iniciar() {
    const todasLasTarjetas = document.querySelectorAll(".card");
    if (!todasLasTarjetas.length) return;

    const estilos = document.createElement("style");
    estilos.textContent = `
      #js-modal-fondo{
        position:fixed; inset:0;
        background:rgba(10,7,18,0.9);
        backdrop-filter:blur(6px);
        display:flex; align-items:center; justify-content:center;
        padding:24px;
        opacity:0; visibility:hidden;
        transition:opacity 0.25s ease, visibility 0.25s;
        z-index:10000;
      }
      #js-modal-fondo.js-abierto{ opacity:1; visibility:visible; }

      #js-modal-caja{
        background:#130D1F;
        border:1px solid #2A2240;
        border-radius:16px;
        max-width:1200px;
        width:95%;
        overflow:hidden;
        position:relative;
        display:flex;
        flex-direction:row;
        height:min(680px, 90vh);
        transform:scale(0.94) translateY(10px);
        transition:transform 0.3s cubic-bezier(.34,1.56,.64,1);
      }
      #js-modal-fondo.js-abierto #js-modal-caja{ transform:scale(1) translateY(0); }

      #js-modal-thumb{
  flex:1 1 60%;
  height:100%;
  overflow:hidden;
}
#js-modal-thumb img{
  width:100%;
  height:100%;
  object-fit:cover;
  object-position:center;
  display:block;
}
      #js-modal-info{
        flex:1 1 40%;
        height:100%;
        padding:32px 30px;
        display:flex;
        flex-direction:column;
        justify-content:center;
        overflow-y:auto;
      }
      #js-modal-tag{
        display:inline-block;
        font-family:'IBM Plex Mono', monospace;
        font-size:0.7rem;
        text-transform:uppercase;
        letter-spacing:0.05em;
        padding:4px 10px;
        border-radius:20px;
        color:#fff;
        margin-bottom:16px;
        width:fit-content;
      }
      #js-modal-titulo{
        font-family:'Space Grotesk', sans-serif;
        font-size:1.5rem; font-weight:700;
        color:#F5F3FB; margin:0 0 14px;
        line-height:1.25;
      }
      #js-modal-desc{
        font-size:0.95rem; color:#A79FC0; margin:0; line-height:1.7;
      }
      #js-modal-contador{
        font-family:'IBM Plex Mono', monospace;
        font-size:0.72rem;
        color:#6E6690;
        margin-top:22px;
      }

      #js-modal-cerrar{
        position:absolute; top:14px; right:14px;
        width:34px; height:34px; border-radius:50%;
        background:rgba(0,0,0,0.45);
        border:1px solid rgba(255,255,255,0.2);
        color:#fff; font-size:1rem; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        z-index:2;
      }

      .js-modal-flecha{
        position:absolute; top:50%; transform:translateY(-50%);
        width:44px; height:44px; border-radius:50%;
        background:rgba(19,13,31,0.85);
        border:1px solid #2A2240;
        color:#F5F3FB; font-size:1.1rem; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        z-index:10001;
        transition:background 0.2s ease;
      }
      .js-modal-flecha:hover{
        background:linear-gradient(135deg,#8B3DFF,#FF3D7A);
      }
      #js-flecha-izq{ left:-60px; }
      #js-flecha-der{ right:-60px; }

      @media (max-width:760px){
        #js-modal-caja{
          flex-direction:column;
          height:auto;
          max-height:90vh;
          overflow-y:auto;
        }
        #js-modal-thumb{ height:220px; flex:none; }
        #js-modal-info{ height:auto; }
        #js-flecha-izq{ left:8px; }
        #js-flecha-der{ right:8px; }
        .js-modal-flecha{ background:rgba(10,7,18,0.7); }
      }

      .card{ cursor:pointer; }
    `;
    document.head.appendChild(estilos);

    const fondo = document.createElement("div");
    fondo.id = "js-modal-fondo";
    fondo.innerHTML = `
      <button id="js-flecha-izq" class="js-modal-flecha" aria-label="Anterior">❮</button>
      <div id="js-modal-caja">
        <button id="js-modal-cerrar" aria-label="Cerrar">✕</button>
        <div id="js-modal-thumb"></div>
        <div id="js-modal-info">
          <span id="js-modal-tag"></span>
          <h3 id="js-modal-titulo"></h3>
          <p id="js-modal-desc"></p>
          <p id="js-modal-contador"></p>
        </div>
      </div>
      <button id="js-flecha-der" class="js-modal-flecha" aria-label="Siguiente">❯</button>
    `;
    document.body.appendChild(fondo);

    const modalThumb = document.getElementById("js-modal-thumb");
    const modalTag = document.getElementById("js-modal-tag");
    const modalTitulo = document.getElementById("js-modal-titulo");
    const modalDesc = document.getElementById("js-modal-desc");
    const modalContador = document.getElementById("js-modal-contador");
    const botonCerrar = document.getElementById("js-modal-cerrar");
    const flechaIzq = document.getElementById("js-flecha-izq");
    const flechaDer = document.getElementById("js-flecha-der");

    let listaVisible = [];
    let indiceActual = 0;

    function tarjetasVisiblesAhora() {
      return Array.from(todasLasTarjetas).filter(
        (t) => getComputedStyle(t).display !== "none"
      );
    }

    function mostrarTarjeta(indice) {
      const tarjeta = listaVisible[indice];
      if (!tarjeta) return;

      const thumbOriginal = tarjeta.querySelector(".card-thumb");
      modalThumb.innerHTML = thumbOriginal ? thumbOriginal.innerHTML : "";
      modalThumb.style.background = thumbOriginal ? getComputedStyle(thumbOriginal).background : "";

      const etiqueta = tarjeta.querySelector(".card-tool-tag");
      if (etiqueta) {
        modalTag.textContent = etiqueta.textContent;
        modalTag.style.background = getComputedStyle(etiqueta).background;
        modalTag.style.color = getComputedStyle(etiqueta).color;
        modalTag.style.display = "inline-block";
      } else {
        modalTag.style.display = "none";
      }

      const titulo = tarjeta.querySelector(".card-info h3");
      const desc = tarjeta.querySelector(".card-info p");
      modalTitulo.textContent = titulo ? titulo.textContent : "";
      modalDesc.textContent = desc ? desc.textContent : "";
      modalContador.textContent = (indice + 1) + " / " + listaVisible.length;

      indiceActual = indice;
    }

    function abrirModal(tarjeta) {
      listaVisible = tarjetasVisiblesAhora();
      const posicion = listaVisible.indexOf(tarjeta);
      mostrarTarjeta(posicion >= 0 ? posicion : 0);
      fondo.classList.add("js-abierto");
      document.body.style.overflow = "hidden";
    }

    function cerrarModal() {
      fondo.classList.remove("js-abierto");
      document.body.style.overflow = "";
    }

    function siguiente() {
      mostrarTarjeta((indiceActual + 1) % listaVisible.length);
    }

    function anterior() {
      mostrarTarjeta((indiceActual - 1 + listaVisible.length) % listaVisible.length);
    }

    todasLasTarjetas.forEach((tarjeta) => {
      tarjeta.addEventListener("click", () => abrirModal(tarjeta));
    });

    botonCerrar.addEventListener("click", cerrarModal);
    flechaDer.addEventListener("click", siguiente);
    flechaIzq.addEventListener("click", anterior);

    fondo.addEventListener("click", (e) => {
      if (e.target === fondo) cerrarModal();
    });

    document.addEventListener("keydown", (e) => {
      if (!fondo.classList.contains("js-abierto")) return;
      if (e.key === "Escape") cerrarModal();
      if (e.key === "ArrowRight") siguiente();
      if (e.key === "ArrowLeft") anterior();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();


(function(){
  const LIMIT = 6; // cuántas tarjetas se ven "de entrada"
  const cards = document.querySelectorAll('.grid .card');
  const btn = document.getElementById('btn-ver-todo');
  let expanded = false;

  const filtroClaseMap = {
    'f-ph':   'ph',
    'f-ai':   'ai',
    'f-id':   'id',
    'f-pr':   'pr',
    'f-ae':   'ae',
    'f-foto': 'foto'
  };

  function pasaFiltroActual(card){
    const checked = document.querySelector('input[name="filtro"]:checked');
    if(!checked || checked.id === 'f-todos') return true;
    const clase = filtroClaseMap[checked.id];
    return card.classList.contains(clase);
  }

  function aplicarLimite(){
    if(expanded){
      cards.forEach(c => c.classList.remove('js-hidden'));
      return;
    }
    let mostradas = 0;
    cards.forEach(card => {
      const pasa = pasaFiltroActual(card);
      if(pasa && mostradas < LIMIT){
        card.classList.remove('js-hidden');
        mostradas++;
      } else if(pasa){
        card.classList.add('js-hidden');
      } else {
        card.classList.remove('js-hidden');
      }
    });
  }

  document.querySelectorAll('input[name="filtro"]').forEach(radio => {
    radio.addEventListener('change', () => {
      expanded = false;
      btn.textContent = 'Ver todo el portafolio';
      aplicarLimite();
    });
  });

  btn.addEventListener('click', () => {
    expanded = !expanded;
    btn.textContent = expanded ? 'Ver menos' : 'Ver todo el portafolio';
    aplicarLimite();
  });

  aplicarLimite();
})();




        

  
    
 
    
    
  


   
