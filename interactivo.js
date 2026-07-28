// ============================================================
// EFECTOS INTERACTIVOS — 100% JavaScript, autocontenido.
// No requiere tocar el HTML ni el CSS: este script crea todo
// lo que necesita (elementos y estilos) por su cuenta.
// Solo agrega: <script src="interactivo.js"></script> antes de </body>
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // Inyecta el CSS que necesitan los efectos, sin tocar tu style.css
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

  // ------------------------------------------------------------
  // 1. BARRA DE PROGRESO DE SCROLL (creada por JS)
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // 2. BOTÓN "VOLVER ARRIBA" (creado por JS)
  // ------------------------------------------------------------
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
  //    (usa las clases que ya existen: .nav-link y section[id])
  // ------------------------------------------------------------
  const secciones = document.querySelectorAll("section[id]");
  const enlacesNav = document.querySelectorAll(".nav-link");

  if (secciones.length && enlacesNav.length) {
    const observadorNav = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            const id = entrada.target.getAttribute("id");
            enlacesNav.forEach((enlace) => {
              enlace.classList.toggle("js-active", enlace.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    secciones.forEach((s) => observadorNav.observe(s));
  }

  // ------------------------------------------------------------
  // 4. APARICIÓN AL HACER SCROLL
  //    (aplica automáticamente a secciones y tarjetas que YA existen,
  //    sin necesitar que agregues ninguna clase nueva)
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
    // pequeño retraso progresivo si está dentro de una cuadrícula
    if (el.closest(".grid, .servicios-grid, .proceso-steps")) {
      const hermanos = Array.from(el.parentElement.children);
      const posicion = hermanos.indexOf(el);
      el.style.transitionDelay = (posicion * 90) + "ms";
    }
    observadorReveal.observe(el);
  });

  // ------------------------------------------------------------
  // 5. INCLINACIÓN 3D EN TARJETAS al mover el mouse
  //    (usa las clases .card y .servicio-card que ya tienes)
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // 6. BOTONES "MAGNÉTICOS" — usa la clase .btn-solid que ya tienes
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // 7. COPIAR CORREO AL PORTAPAPELES
  //    (detecta automáticamente el texto que parezca un correo,
  //    sin que tengas que marcar nada en el HTML)
  // ------------------------------------------------------------
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
// ANIMACIONES EXTRA PARA BOTONES — 100% JavaScript, autocontenido.
// No requiere tocar el HTML ni el CSS existente.
// Solo agrega: <script src="botones-animados.js"></script>
// justo después de tu otro <script src="interactivo.js"></script>
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  const estilos = document.createElement("style");
  estilos.textContent = `
    .btn, .btn-footer{
      position:relative;
      overflow:hidden;
      transition:transform 0.15s ease, box-shadow 0.25s ease;
    }
    .btn::after, .btn-footer::after{
      content:"";
      position:absolute;
      top:0; left:-75%;
      width:50%; height:100%;
      background:linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent);
      transform:skewX(-20deg);
      transition:left 0.6s ease;
      pointer-events:none;
    }
    .btn:hover::after, .btn-footer:hover::after{
      left:125%;
    }
    .btn-solid:hover{
      box-shadow:0 8px 24px rgba(255,61,122,0.45);
    }
    .js-pressed{
      transform:scale(0.94);
    }
    .js-ripple{
      position:absolute;
      border-radius:50%;
      background:rgba(255,255,255,0.55);
      transform:scale(0);
      animation:js-ripple-anim 0.6s ease-out;
      pointer-events:none;
    }
    @keyframes js-ripple-anim{
      to{ transform:scale(3); opacity:0; }
    }
    @keyframes js-pulso-glow{
      0%, 100%{ box-shadow:0 0 0 0 rgba(255,61,122,0.35); }
      50%{ box-shadow:0 0 0 8px rgba(255,61,122,0); }
    }
    .js-pulso{
      animation:js-pulso-glow 2.4s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce){
      .btn::after, .btn-footer::after{ display:none; }
      .js-pulso{ animation:none; }
      .js-ripple{ display:none; }
    }
  `;
  document.head.appendChild(estilos);

  // Selecciona TODOS los botones del sitio, incluyendo los del footer (.btn-footer)
  const botones = document.querySelectorAll(".btn, .btn-footer");

  botones.forEach((boton) => {
    boton.addEventListener("mousedown", () => boton.classList.add("js-pressed"));
    boton.addEventListener("mouseup", () => boton.classList.remove("js-pressed"));
    boton.addEventListener("mouseleave", () => boton.classList.remove("js-pressed"));

    boton.style.position = boton.style.position || "relative";
    boton.addEventListener("click", (e) => {
      const rect = boton.getBoundingClientRect();
      const onda = document.createElement("span");
      const tamano = Math.max(rect.width, rect.height);
      onda.className = "js-ripple";
      onda.style.width = onda.style.height = tamano + "px";
      onda.style.left = (e.clientX - rect.left - tamano / 2) + "px";
      onda.style.top = (e.clientY - rect.top - tamano / 2) + "px";
      boton.appendChild(onda);
      setTimeout(() => onda.remove(), 600);
    });
  });

  const botonPrincipal = document.querySelector(".btn-solid");
  if (botonPrincipal) {
    botonPrincipal.classList.add("js-pulso");
  }

});
