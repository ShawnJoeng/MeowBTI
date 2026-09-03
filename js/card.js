/* ===========================================================
 * MeowBTI · 猫格身份证卡片
 * 整张卡片就是一段 SVG：页面上显示的和导出的 PNG 完全一致
 * =========================================================== */
window.MEOW = window.MEOW || {};

(function () {
  var W = 720, H = 1110;
  var FONT = 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, sans-serif';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function stars(n) {
    return new Array(n + 1).join('★') + new Array(5 - n + 1).join('☆');
  }

  /* 一行属性条：10 个圆角小方块 */
  function traitRow(t, y, color) {
    var x0 = 196, bw = 33, gap = 6, filled = Math.round(t.value / 10);
    var blocks = '';
    for (var i = 0; i < 10; i++) {
      blocks += `<rect x="${x0 + i * (bw + gap)}" y="${y - 13}" width="${bw}" height="26" rx="9"
        fill="${i < filled ? color : '#000'}" fill-opacity="${i < filled ? 1 : 0.07}"/>`;
    }
    return `<text x="72" y="${y + 9}" font-size="27" fill="#4A4353" font-family="${FONT}">${t.emoji} ${t.label}</text>
      ${blocks}
      <text x="648" y="${y + 9}" font-size="25" font-weight="600" fill="#4A4353" text-anchor="end"
        font-family="${FONT}">${t.value}%</text>`;
  }

  function paws(color) {
    var pts = [[54, 420, 1, .07], [660, 570, -1, .06], [78, 930, 1, .05], [640, 300, -1, .05], [600, 1058, 1, .06]];
    return pts.map(function (p) {
      return `<g transform="translate(${p[0]} ${p[1]}) scale(${0.9 * p[2]} 0.9) rotate(${p[2] * 12})" fill="${color}" opacity="${p[3]}">
        <ellipse cx="0" cy="8" rx="15" ry="12"/><circle cx="-14" cy="-9" r="5.5"/><circle cx="-5" cy="-15" r="5.5"/>
        <circle cx="5" cy="-15" r="5.5"/><circle cx="14" cy="-9" r="5.5"/></g>`;
    }).join('');
  }

  /* ---------- 主函数：生成整张卡片的 SVG ---------- */
  MEOW.cardSVG = function (r, opts) {
    opts = opts || {};
    var c1 = r.type.theme[0], c2 = r.type.theme[1];
    var avatar = r.photo
      ? `<image href="${r.photo}" xlink:href="${r.photo}" x="262" y="152" width="196" height="196"
           preserveAspectRatio="xMidYMid slice" clip-path="url(#avaClip)"/>`
      : `<image href="${opts.catAsset || MEOW.catAsset(r.code)}" xlink:href="${opts.catAsset || MEOW.catAsset(r.code)}"
           x="262" y="152" width="196" height="196" preserveAspectRatio="xMidYMid slice" clip-path="url(#avaClip)"/>`;

    var rows = r.traits.map(function (t, i) { return traitRow(t, 600 + i * 58, c1); }).join('');
    var skills = r.skills.map(function (s, i) {
      return `<circle cx="80" cy="${950 + i * 44}" r="4.5" fill="${c1}"/>
        <text x="98" y="${958 + i * 44}" font-size="23" fill="#5A5266" font-family="${FONT}">${esc(s)}</text>`;
    }).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 ${W} ${H}" width="${opts.width || W}" height="${opts.height || H}" class="card-svg">
      <defs>
        <linearGradient id="cardBg" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stop-color="${c2}"/><stop offset="0.55" stop-color="#FFFDF9"/><stop offset="1" stop-color="${c2}" stop-opacity=".55"/>
        </linearGradient>
        <linearGradient id="ringG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
        </linearGradient>
        <clipPath id="avaClip"><circle cx="360" cy="250" r="98"/></clipPath>
        <clipPath id="avaClip2"><circle cx="100" cy="84" r="93.3"/></clipPath>
      </defs>
      <rect width="${W}" height="${H}" rx="44" fill="url(#cardBg)"/>
      <rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="36" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>
      ${paws(c1)}
      <text x="360" y="66" font-size="23" letter-spacing="4.5" text-anchor="middle" fill="#8A8194"
        font-family="${FONT}">🐈 MEOWBTI · CAT PERSONALITY CARD</text>
      <path d="M240 88 H480" stroke="${c1}" stroke-opacity=".45" stroke-width="2.5"/>
      <circle cx="360" cy="250" r="104" fill="#fff" opacity=".92"/>
      <circle cx="360" cy="250" r="104" fill="none" stroke="url(#ringG)" stroke-width="7"/>
      ${avatar}
      <circle cx="360" cy="250" r="98" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="4"/>
      <text x="360" y="430" font-size="74" font-weight="800" letter-spacing="10" text-anchor="middle"
        fill="${c1}" font-family="${FONT}">${r.code}</text>
      <text x="360" y="478" font-size="31" font-weight="600" text-anchor="middle" fill="#4A4353"
        font-family="${FONT}">${r.type.emoji}「${esc(r.type.name)}」</text>
      <text x="360" y="518" font-size="22" text-anchor="middle" fill="#8A8194" font-family="${FONT}"
        >稀有度 ${stars(r.stars)} · 全球约 ${r.rarity}% 的猫</text>
      <path d="M72 558 H648" stroke="#000" stroke-opacity=".08" stroke-width="2"/>
      ${rows}
      <path d="M72 864 H648" stroke="#000" stroke-opacity=".08" stroke-width="2"/>
      <text x="72" y="908" font-size="24" font-weight="700" letter-spacing="2" fill="#8A8194"
        font-family="${FONT}">特殊技能 / SPECIAL SKILLS</text>
      ${skills}
    </svg>`;
  };

  /* ---------- 导出 ---------- */
  function triggerDownload(url, filename) {
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
  }

  function fileName(r, ext) {
    var n = (r.name + '-' + r.code).replace(/[^\w一-龥-]+/g, '_');
    return 'MeowBTI-' + n + '.' + ext;
  }

  function saveSVG(markup, r) {
    var url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }));
    triggerDownload(url, fileName(r, 'svg'));
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  /* 先尝试导出 PNG，浏览器不支持时自动降级为 SVG，返回实际格式 */
  function inlineCatAsset(code) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        try {
          var cv = document.createElement('canvas');
          cv.width = img.naturalWidth; cv.height = img.naturalHeight;
          cv.getContext('2d').drawImage(img, 0, 0);
          resolve(cv.toDataURL('image/png'));
        } catch (e) { resolve(MEOW.catAsset(code)); }
      };
      img.onerror = function () { resolve(MEOW.catAsset(code)); };
      img.src = MEOW.catAsset(code);
    });
  }

  MEOW.downloadCard = function (r, scale) {
    scale = scale || 2;
    return inlineCatAsset(r.code).then(function (catAsset) {
      var markup = MEOW.cardSVG(r, { width: W, height: H, catAsset: catAsset });
      return new Promise(function (resolve) {
        var url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }));
        var img = new Image();
        img.onload = function () {
          try {
            var cv = document.createElement('canvas');
            cv.width = W * scale; cv.height = H * scale;
            cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
            URL.revokeObjectURL(url);
            if (cv.toBlob) {
              cv.toBlob(function (b) {
                if (!b) { saveSVG(markup, r); return resolve('svg'); }
                var u = URL.createObjectURL(b);
                triggerDownload(u, fileName(r, 'png'));
                setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
                resolve('png');
              }, 'image/png');
            } else {
              triggerDownload(cv.toDataURL('image/png'), fileName(r, 'png'));
              resolve('png');
            }
          } catch (e) { saveSVG(markup, r); resolve('svg'); }
        };
        img.onerror = function () { URL.revokeObjectURL(url); saveSVG(markup, r); resolve('svg'); };
        img.src = url;
      });
    });
  };

})();
