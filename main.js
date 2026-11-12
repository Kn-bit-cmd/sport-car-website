document.addEventListener('DOMContentLoaded', function () {
/* ===== Nền lấp lánh: sao nhấp nháy + bụi vàng bay + sao băng ===== */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var cv = document.createElement('canvas'); cv.id = 'sparkle-bg';
  document.body.insertBefore(cv, document.body.firstChild);
  var ctx = cv.getContext('2d'), W, H, stars = [], shooters = [], dpr = Math.min(window.devicePixelRatio || 1, 2);
  var COLORS = ['255,255,255', '255,217,138', '190,170,255', '255,255,255'];
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.min(160, Math.round(W * H / 9000));
    stars = [];
    for (var i = 0; i < n; i++) stars.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.6 + .4, c: COLORS[(Math.random() * COLORS.length) | 0],
      ph: Math.random() * 6.28, sp: Math.random() * 1.6 + .5,
      vy: Math.random() * .12 + .02, big: Math.random() < .12
    });
  }
  function star4(x, y, s, a, c) { // ngôi sao 4 cánh
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(' + c + ',' + a + ')'; ctx.beginPath();
    ctx.moveTo(0, -s); ctx.quadraticCurveTo(s * .12, -s * .12, s, 0); ctx.quadraticCurveTo(s * .12, s * .12, 0, s);
    ctx.quadraticCurveTo(-s * .12, s * .12, -s, 0); ctx.quadraticCurveTo(-s * .12, -s * .12, 0, -s); ctx.fill(); ctx.restore();
  }
  function frame(t) {
    ctx.clearRect(0, 0, W, H); t /= 1000;
    stars.forEach(function (s) {
      var a = .25 + .75 * Math.pow((Math.sin(t * s.sp + s.ph) + 1) / 2, 2);
      s.y -= s.vy; if (s.y < -5) { s.y = H + 5; s.x = Math.random() * W; }
      if (s.big) { star4(s.x, s.y, s.r * 5 + a * 4, a, s.c); }
      else {
        ctx.beginPath(); ctx.fillStyle = 'rgba(' + s.c + ',' + a + ')';
        ctx.shadowColor = 'rgba(' + s.c + ',.8)'; ctx.shadowBlur = 6;
        ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0;
      }
    });
    if (Math.random() < .004 && shooters.length < 2) shooters.push({ x: Math.random() * W * .8 + W * .2, y: Math.random() * H * .4, l: 0, v: 9 + Math.random() * 5 });
    shooters = shooters.filter(function (m) {
      m.x -= m.v; m.y += m.v * .55; m.l += 1;
      var g = ctx.createLinearGradient(m.x, m.y, m.x + 90, m.y - 50);
      g.addColorStop(0, 'rgba(255,230,170,.95)'); g.addColorStop(1, 'rgba(255,230,170,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x + 90, m.y - 50); ctx.stroke();
      return m.l < 70 && m.x > -100 && m.y < H + 50;
    });
    requestAnimationFrame(frame);
  }
  resize(); window.addEventListener('resize', resize); requestAnimationFrame(frame);
})();

});

document.addEventListener('DOMContentLoaded', function () {
  // Đổ bóng header khi cuộn
  var header = document.querySelector('header');
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll); onScroll();

  // Menu mobile
  var toggle = document.querySelector('.menu-toggle'), menu = document.getElementById('menu');
  if (toggle) toggle.addEventListener('click', function () { menu.classList.toggle('open'); });

  var params = new URLSearchParams(window.location.search);

  // Hiệu ứng xuất hiện khi cuộn
  var items = document.querySelectorAll('.car-card, .brand-tile, .section-title, .c-card, .faq-block details, .product-info, .product-gallery');
  items.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  // Banner trang chủ: tự chuyển slide, mũi tên, chấm, vuốt trên điện thoại
  var banner = document.querySelector('.banner');
  if (banner) {
    var slides = banner.querySelectorAll('.banner-slide'), dots = banner.querySelectorAll('.banner-dots button');
    var cur = 0, timer = null;
    var bar = banner.querySelector('.banner-progress i');
    var runBar = function () { if (!bar) return; bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run'); };
    var go = function (n) {
      slides[cur].classList.remove('active'); dots[cur].classList.remove('active');
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('active'); dots[cur].classList.add('active');
      runBar();
    };
    var start = function () { stop(); runBar(); banner.classList.remove('paused'); timer = setInterval(function () { go(cur + 1); }, 5500); };
    var stop = function () { if (timer) clearInterval(timer); timer = null; banner.classList.add('paused'); };
    banner.querySelector('.prev').addEventListener('click', function () { go(cur - 1); start(); });
    banner.querySelector('.next').addEventListener('click', function () { go(cur + 1); start(); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); start(); }); });
    banner.addEventListener('mouseenter', stop); banner.addEventListener('mouseleave', start);
    var x0 = null;
    banner.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    banner.addEventListener('touchend', function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); start(); } x0 = null;
    });
    start();
  }

  // ===== Hiệu ứng bổ sung =====
  var fine = window.matchMedia && window.matchMedia('(pointer:fine)').matches;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // Thanh tiến trình cuộn + nút lên đầu trang
  var bar2 = document.createElement('div'); bar2.id = 'scroll-progress'; document.body.appendChild(bar2);
  var topBtn = document.createElement('button'); topBtn.className = 'to-top'; topBtn.type = 'button'; topBtn.setAttribute('aria-label', 'Lên đầu trang'); topBtn.textContent = '↑'; document.body.appendChild(topBtn);
  topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  var onScroll2 = function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar2.style.width = (h > 0 ? window.scrollY / h * 100 : 0) + '%';
    topBtn.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll2, { passive: true }); onScroll2();

  // Ánh sáng vàng đi theo chuột (máy tính)
  if (fine && !reduce) {
    var spot = document.createElement('div'); spot.className = 'spotlight'; document.body.appendChild(spot);
    var sx = 0, sy = 0, ticking = false;
    window.addEventListener('mousemove', function (e) {
      sx = e.clientX; sy = e.clientY;
      if (!ticking) { ticking = true; requestAnimationFrame(function () { spot.style.transform = 'translate(' + sx + 'px,' + sy + 'px)'; ticking = false; }); }
    });
  }

  // Nghiêng 3D thẻ xe
  if (fine && !reduce) {
    document.querySelectorAll('.car-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.classList.add('tilt');
        card.style.setProperty('--ry', ((x - .5) * 10).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((.5 - y) * 8).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.classList.remove('tilt');
        card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg');
      });
    });
  }

  // Xuất hiện lần lượt trong lưới
  document.querySelectorAll('.car-grid, .brand-grid, .contact-cards').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.animationDelay = ((i % 4) * 90) + 'ms'; });
  });

  // Đếm số ở dải thống kê
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return; co.unobserve(e.target);
        var el = e.target, end = parseInt(el.dataset.count, 10), t0 = null;
        if (reduce) return;
        var step = function (ts) {
          if (!t0) t0 = ts; var k = Math.min((ts - t0) / 1400, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step);
        };
        el.textContent = '0'; requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { co.observe(c); });
  }

  // Nút sao chép
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var old = btn.textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = 'Đã sao chép ✓';
      setTimeout(function () { btn.textContent = old; }, 1600);
    });
  });

  // Bộ sưu tập: lọc, sắp xếp, tìm kiếm (?hang=ferrari, ?q=revuelto)
  var brandSel = document.getElementById('brand-filter');
  if (brandSel) {
    var priceSel = document.getElementById('price-filter'), sortSel = document.getElementById('sort-filter');
    var grid = document.querySelector('.car-grid'), countEl = document.getElementById('car-count');
    var noResult = document.getElementById('no-result'), resetBtn = document.getElementById('filter-reset');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.car-card'));
    var q = (params.get('q') || '').trim().toLowerCase();
    if (params.get('hang')) brandSel.value = params.get('hang');
    var searchInput = document.querySelector('.search-box input');
    if (q && searchInput) searchInput.value = params.get('q');

    var inRange = function (p, r) {
      if (isNaN(p)) return r === '';
      if (r === '1') return p < 500000;
      if (r === '2') return p >= 500000 && p <= 2000000;
      if (r === '3') return p > 2000000;
      return true;
    };
    var apply = function () {
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (!brandSel.value || c.dataset.brand === brandSel.value) &&
                 inRange(parseInt(c.dataset.price, 10), priceSel.value) &&
                 (!q || c.dataset.name.indexOf(q) !== -1);
        c.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      var sorted = cards.slice();
      var pv = function (c, dir) { var v = parseInt(c.dataset.price, 10); return isNaN(v) ? (dir > 0 ? Infinity : -Infinity) : v; };
      if (sortSel.value === 'price-asc') sorted.sort(function (a, b) { var x = pv(a, 1), y = pv(b, 1); return x === y ? 0 : (x < y ? -1 : 1); });
      if (sortSel.value === 'price-desc') sorted.sort(function (a, b) { var x = pv(a, -1), y = pv(b, -1); return x === y ? 0 : (x > y ? -1 : 1); });
      sorted.forEach(function (c) { grid.appendChild(c); });
      countEl.textContent = 'Hiển thị ' + shown + ' trong số ' + cards.length + ' mẫu xe' + (q ? ' cho "' + params.get('q') + '"' : '');
      noResult.classList.toggle('show', shown === 0);
    };
    [brandSel, priceSel, sortSel].forEach(function (s) { s.addEventListener('change', apply); });
    resetBtn.addEventListener('click', function () {
      brandSel.value = priceSel.value = sortSel.value = ''; q = '';
      if (searchInput) searchInput.value = '';
      apply();
    });
    apply();
  }

  // Form liên hệ (bản demo) + điền sẵn từ ?xe= và ?chu-de=
  var form = document.getElementById('lh-form');
  if (form) {
    var xe = params.get('xe'), topic = params.get('chu-de');
    if (xe) { document.getElementById('lh-xe').value = xe; }
    if (topic) { var r = form.querySelector('input[name="topic"][value="' + topic + '"]'); if (r) r.checked = true; }
    var ta = form.querySelector('textarea'), counter = form.querySelector('.counter');
    ta.addEventListener('input', function () { counter.textContent = ta.value.length + '/500'; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.style.display = 'none';
      document.querySelectorAll('.form-block > h2, .form-block > p').forEach(function (n) { n.style.display = 'none'; });
      document.getElementById('lh-success').classList.add('show');
    });
    document.getElementById('lh-again').addEventListener('click', function () {
      form.reset(); counter.textContent = '0/500'; form.style.display = '';
      document.querySelectorAll('.form-block > h2, .form-block > p').forEach(function (n) { n.style.display = ''; });
      document.getElementById('lh-success').classList.remove('show');
    });
  }
});
