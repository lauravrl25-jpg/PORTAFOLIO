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
// Aplica a .hero-social a y .footer-social a (los círculos
// de TikTok, Instagram, WhatsApp, Facebook).
// Solo agrega: <script src="redes-interactivas.js"></script>
// junto a tus otros <script> antes de </body>
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  const iconos = document.querySelectorAll(".hero-social a, .footer-social a");
  if (!iconos.length) return;

  // Inyecta el CSS necesario para el efecto
  const estilos = document.createElement("style");
  estilos.textContent = `
    .hero-social a, .footer-social a{
      position:relative;
      transition:transform 0.25s cubic-bezier(.34,1.56,.64,1),
                 border-color 0.25s ease,
                 background 0.25s ease,
                 color 0.25s ease,
                 box-shadow 0.25s ease;
      overflow:hidden;
    }

    .hero-social a:hover, .footer-social a:hover{
      transform:scale(1.18) translateY(-3px);
      border-color:transparent;
      background:linear-gradient(135deg, #8B3DFF, #FF3D7A, #FF7A3D);
      color:#fff;
      box-shadow:0 6px 18px rgba(255,61,122,0.45);
    }

    .hero-social a:active, .footer-social a:active{
      transform:scale(0.94);
    }

    /* Pulso suave constante para llamar la atención, se detiene al pasar el mouse */
    @keyframes js-red-pulso{
      0%, 100%{ box-shadow:0 0 0 0 rgba(139,61,255,0.35); }
      50%{ box-shadow:0 0 0 6px rgba(139,61,255,0); }
    }
    .hero-social a, .footer-social a{
      animation:js-red-pulso 2.6s ease-in-out infinite;
    }
    .hero-social a:hover, .footer-social a:hover{
      animation:none;
    }

    /* Retraso escalonado para que el pulso no sea idéntico en los 4 al mismo tiempo */
    .hero-social a:nth-child(1), .footer-social a:nth-child(1){ animation-delay:0s; }
    .hero-social a:nth-child(2), .footer-social a:nth-child(2){ animation-delay:0.2s; }
    .hero-social a:nth-child(3), .footer-social a:nth-child(3){ animation-delay:0.4s; }
    .hero-social a:nth-child(4), .footer-social a:nth-child(4){ animation-delay:0.6s; }

    @media (prefers-reduced-motion: reduce){
      .hero-social a, .footer-social a{ animation:none; }
    }
  `;
  document.head.appendChild(estilos);

  // Pequeño efecto ripple al hacer clic, igual que en los botones
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

  const keyframesRipple = document.createElement("style");
  keyframesRipple.textContent = `
    @keyframes js-ripple-anim-red{
      to{ transform:scale(2.4); opacity:0; }
    }
  `;
  document.head.appendChild(keyframesRipple);

});




