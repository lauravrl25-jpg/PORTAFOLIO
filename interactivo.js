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
