import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const FIRST = 180122;
    const LAST = 180622;
    const FRAME_COUNT = LAST - FIRST + 1;

    const images = [];
    let loaded = 0;

    const state = { frame: 0 };

    function resizeCanvas() {
      const ratio = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);
    }

    resizeCanvas();
    window.addEventListener("resize", () => {
      resizeCanvas();
      render();
      ScrollTrigger.refresh();
    });

    function frameSrc(i) {
      return `/assets/frames/frame_${FIRST + i}.jpg`;
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameSrc(i);

      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === FRAME_COUNT) initialize();
      };

      images.push(img);
    }

    function render() {
      const img = images[state.frame];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvas.width / window.devicePixelRatio;
      const ch = canvas.height / window.devicePixelRatio;

      const ia = img.naturalWidth / img.naturalHeight;
      const ca = cw / ch;

      let w, h, x, y;

      if (ia > ca) {
        h = ch;
        w = h * ia;
        x = (cw - w) / 2;
        y = 0;
      } else {
        w = cw;
        h = w / ia;
        x = 0;
        y = (ch - h) / 2;
      }

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, w, h);
    }

    function update(progress) {
      let p = Math.min(progress * 2, 1);
      let frame = Math.floor(p * (FRAME_COUNT - 1));

      frame = Math.max(0, Math.min(frame, FRAME_COUNT - 1));

      state.frame = frame;
      render();
    }

    function initialize() {
      state.frame = 0;
      render();

      ScrollTrigger.create({
        trigger: canvas,
        start: "top top",
        end: "+=1500",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        inertia: false,
        onUpdate: (self) => update(self.progress),
      });

      ScrollTrigger.refresh();
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas"></canvas>;
}
