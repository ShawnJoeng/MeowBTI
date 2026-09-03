/* ===========================================================
 * MeowBTI · 交互主控
 * 首页 → 24 题 → 猫格身份证 → 图鉴
 * =========================================================== */
(function () {
  var Q = MEOW.QUESTIONS;

  var state = { name: '它', fur: MEOW.FURS[0].key, photo: '', idx: 0, answers: [], result: null };

  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var toastTimer;
  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, 2200);
  }

  /* ---------- 屏幕切换 ---------- */
  function go(name) {
    $$('.screen').forEach(function (s) { s.classList.toggle('is-active', s.id === 'screen-' + name); });
    window.scrollTo(0, 0);
    if (name === 'gallery') renderGallery();
  }

  /* ---------- 首页 ---------- */
  function renderHome() {
    function shuffle(list) {
      return list.slice().sort(function () { return Math.random() - 0.5; });
    }

    function randomFeatured() {
      var families = ['analyst', 'diplomat', 'sentinel', 'explorer'];
      var chosen = [];
      families.forEach(function (family) {
        var pool = MEOW.TYPE_ORDER.filter(function (code) {
          return MEOW.typeFamily(code) === family;
        });
        chosen = chosen.concat(shuffle(pool).slice(0, 2));
      });
      return shuffle(chosen);
    }

    function coverTile(code, idPrefix) {
      var t = MEOW.TYPES[code];
      return '<div class="cover-tile family-' + MEOW.typeFamily(code) + '">' +
        '<img src="' + MEOW.catAsset(code) + '" alt="" draggable="false">' +
        '<span><b>' + code + '</b>' + t.name + '</span></div>';
    }

    var mosaicOrder = MEOW.TYPE_ORDER.concat(MEOW.TYPE_ORDER);
    $('#heroMosaic').innerHTML = mosaicOrder.map(function (code) {
      return coverTile(code, 'mosaic-');
    }).join('');

    var featured = randomFeatured();
    $('#coverFeatureCats').innerHTML = featured.map(function (code) {
      var t = MEOW.TYPES[code];
      return '<div class="cover-feature family-' + MEOW.typeFamily(code) + '">' +
        MEOW.catSVG({ fur: MEOW.typeFur(code), code: code, size: 132, id: 'feature-' + code, label: t.name, bg: true }) +
        '<div><b>' + code + '</b><span>' + t.name + '</span></div></div>';
    }).join('');
  }

  /* ---------- 答题 ---------- */
  function startQuiz() {
    state.name = '它';
    state.fur = MEOW.FURS[0].key;
    state.photo = '';
    state.idx = 0;
    state.answers = [];
    renderQuestion();
    go('quiz');
  }

  function renderQuestion() {
    var i = state.idx, q = Q[i];
    $('#progressBar').style.width = Math.round(((i + 1) / Q.length) * 100) + '%';
    $('#quizCount').textContent = '第 ' + (i + 1) + ' / ' + Q.length + ' 题';
    $('#qHint').textContent = q.hint;
    $('#qText').textContent = q.q;
    $('#prevQ').disabled = i === 0;
    $('#prevQ').style.visibility = i === 0 ? 'hidden' : 'visible';
    $('#opts').innerHTML = q.opts.map(function (o, k) {
      return '<button type="button" class="opt' + (state.answers[i] === k ? ' is-on' : '') +
        '" data-k="' + 'ABCDE'[k] + '" data-i="' + k + '">' + esc(o.t) + '</button>';
    }).join('');
    var card = $('#qcard');
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';
  }

  function answer(k) {
    state.answers[state.idx] = k;
    $$('#opts .opt').forEach(function (b) { b.classList.toggle('is-on', +b.dataset.i === k); });
    setTimeout(function () {
      if (state.idx < Q.length - 1) { state.idx++; renderQuestion(); } else { finish(); }
    }, 240);
  }

  /* ---------- 结果 ---------- */
  function finish() {
    var r = MEOW.computeResult(state.answers, { name: state.name, fur: state.fur, photo: state.photo });
    state.result = r;
    showResult(r);
  }

  function showResult(r) {
    $('#cardHost').innerHTML = MEOW.cardSVG(r);
    renderReport(r);
    go('result');
  }

  function renderReport(r) {
    var t = r.type;
    var guidance = r.observed >= 12 && r.overallStability >= 58 ? (MEOW.TYPE_GUIDANCE[r.code] || {}) : {
      core: '先继续记录它在不同日常场景中的常见反应，再确认稳定的性格倾向。',
      strengths: '目前的观察数量还不足以判断它最稳定的优势。',
      blind: '一次偶然行为不能代表它的性格，尤其要区分环境影响和长期习惯。',
      stress: '留意躲藏、食欲变化、过度舔毛或异常攻击；明显改变应优先咨询兽医。'
    };
    var sorted = r.traits.slice().sort(function (a, b) { return b.value - a.value; });
    var hi = sorted[0], lo = sorted[sorted.length - 1];
    var axisRank = r.axisInfo.slice().sort(function (a, b) { return b.stability - a.stability || b.strength - a.strength; });
    var strongestAxis = axisRank[0];
    var softestAxis = axisRank[axisRank.length - 1];
    var signalText = r.observed === 0
      ? '目前没有足够的日常观察来区分四个方向。'
      : '「' + strongestAxis.title + '」的表现最稳定；「' + softestAxis.title + '」更容易随情境变化。整体判断为' + r.overallStabilityLabel + '。';

    var axisRows = r.axisInfo.map(function (a) {
      var isPos = a.letter === a.pos;
      var confidence = a.observed === 0 ? '暂无观察' : a.stabilityLabel;
      return '<div class="axis-row">' +
        '<div class="ar-top"><span class="ar-title">' + a.title + '</span>' +
        '<span class="ar-tag">' + a.letter + ' · ' + a.name + ' ' + a.strength + '%</span></div>' +
        '<div class="ar-track"><i style="width:' + a.posPct + '%"></i></div>' +
        '<div class="ar-poles"><s class="' + (isPos ? 'on' : '') + '">' + a.pos + ' ' + a.posName + '</s>' +
        '<s class="' + (isPos ? '' : 'on') + '">' + a.neg + ' ' + a.negName + '</s></div>' +
        '<p class="ar-desc">' + axisReading(a) + ' <span class="confidence-note">' + confidence + '</span></p></div>';
    }).join('');

    var traitSummary = r.observed >= 6
      ? '<p><b>' + esc(r.name) + '</b> 最突出的是<b>「' + hi.label + ' ' + hi.value + '%」</b>，' +
        '最低的是「' + lo.label + ' ' + lo.value + '%」——' + traitComment(hi, lo) + '</p>'
      : '<p>目前可用的日常观察较少，属性高低暂不作为稳定性格结论。</p>';
    var typeDescription = r.observed >= 8 ? t.desc : '目前可用的日常观察还比较少，先把它在不同场景中的常见反应记录下来，再回来看这份画像。';
    var typeTags = r.observed >= 8 ? t.tags : ['需要更多观察', '暂不定型', '先记录再判断'];

    $('#report').innerHTML =
      '<section class="block"><h3 class="block-title">' + t.emoji + ' 猫格性格解析' + (r.overallStability < 58 ? ' · 观察中' : '') + '</h3>' +
      '<div class="tags">' + typeTags.map(function (x) { return '<span>#' + x + '</span>'; }).join('') + '</div>' +
      '<p class="report-overview">' + signalText + '</p>' +
      '<p>' + typeDescription + '</p>' + traitSummary +
      '<div class="personality-read"><b>性格内核</b><p>' + personalitySummary(r) + '</p></div>' +
      '<div class="depth-grid">' +
      depthItem('行动动力', guidance.core) + depthItem('日常优势', guidance.strengths) +
      depthItem('容易误读', guidance.blind) + depthItem('压力信号', guidance.stress) +
      '</div>' +
      '<div class="deep-read"><h4>深度行为解读</h4>' + deepReading(r) + '</div></section>' +

      '<section class="block"><h3 class="block-title">🧬 四个维度上的它</h3>' + axisRows + '</section>' +

      '<section class="block"><h3 class="block-title">🏅 猫咪原型</h3><div class="arch-box">' +
      '<span class="arch-emoji">' + r.archetype.emoji + '</span><div><p><b>' + r.archetype.name + '</b></p>' +
      '<p>' + r.archetype.desc + '</p></div></div></section>' +

      '<section class="block"><h3 class="block-title">⚠️ 危险等级 ' + r.threat.dot + ' ' + r.threat.en + '</h3>' +
      '<p>综合捣蛋、好奇和亲人程度，它的破坏力评分是 <b>' + r.threatScore + ' / 100</b>（' + r.threat.cn + '）。' +
      threatAdvice(r) + '</p></section>' +

      '<section class="block"><h3 class="block-title">🥰 相处建议</h3>' +
      '<div class="tip"><b>要点：</b>' + t.care + '</div></section>';
  }

  var HI_TIP = {
    social: '它需要的是热闹，别让它一个人待太久。',
    indep: '给它足够的独处空间，它会用自己的方式回报你。',
    curio: '多准备新玩具和新路线，它靠好奇心活着。',
    chaos: '家里的易碎品，建议今晚就收进柜子。',
    love: '它的幸福来源非常简单：你在旁边。'
  };
  var LO_TIP = {
    social: '社交这块就别勉强它了。',
    indep: '独立性偏低，长时间独处容易不安。',
    curio: '对新事物比较谨慎，换东西请慢一点。',
    chaos: '基本不拆家，是个省心的类型。',
    love: '亲人度不算高，别急着抱抱。'
  };

  function traitComment(hi, lo) { return HI_TIP[hi.key] + LO_TIP[lo.key]; }

  var LETTER_READ = {
    E: '它更容易从互动中获得能量，会主动把人或家里人拉进自己的活动。',
    I: '它更需要自己的恢复空间，亲近通常发生在它准备好的时候。',
    S: '它会先处理气味、触感、位置等具体线索，再决定下一步。',
    N: '它容易被变化、组合和新玩法吸引，常常自己扩展物品的用途。',
    T: '它做回应时更看重边界、规则和实际结果，不会只因为气氛改变就配合。',
    F: '它会读取关系和情绪线索，再调整距离、语气和互动方式。',
    J: '它依赖稳定的时间、地点和流程，规律被打乱时会先要求恢复秩序。',
    P: '它对临时变化适应较快，常由当下的刺激决定下一步行动。'
  };

  function axisReading(a) {
    return LETTER_READ[a.letter] + ' ' + a.desc;
  }

  function personalitySummary(r) {
    if (r.observed < 8) return '目前可用的日常观察较少，暂时不适合给出稳定的四维画像。';
    var letters = r.axisInfo.map(function (a) { return a.letter; });
    var social = letters[0] === 'E' ? '愿意主动靠近' : '更习惯保留距离';
    var explore = letters[1] === 'S' ? '用具体线索确认安全和兴趣' : '从变化与新组合中寻找刺激';
    var bond = letters[2] === 'F' ? '关系和情绪会明显影响它的回应' : '边界和实际收益会明显影响它的回应';
    var rhythm = letters[3] === 'J' ? '稳定流程是它的安全感来源' : '临场变化是它的生活节拍';
    var note = r.overallStability < 58 ? '这段画像已经勾勒出方向，但不同场景下仍可能有变化，建议继续用日常表现来确认。' : '这是一种基于多种日常场景的倾向描述，不代表固定不变的行为，也不替代兽医或行为学评估。';
    return '综合四个维度，' + esc(r.name) + ' ' + social + '，' + explore + '；' + bond + '，' + rhythm + '。' + note;
  }

  function depthItem(label, text) {
    return '<div class="depth-item"><b>' + label + '</b><p>' + esc(text || '暂无足够行为资料，先观察一段时间再判断。') + '</p></div>';
  }

  var DEEP_AXIS = {
    E: '它通常会把自己放进事件中心，通过靠近、跟随、叫声或带玩具来确认关系。互动结束后，如果环境仍有回应，它可能继续参与；连续没有反馈时则会主动提高存在感。',
    I: '它更需要先保留退路，再决定是否加入。它的亲近常表现为在附近观察、短暂靠近和按自己的节奏回来，强行拉近距离反而会让它更快撤退。',
    S: '它更信任可闻、可触、可定位的线索，会先确认物品、路线和位置，再选择行动。面对变化时，熟悉的步骤能帮助它保持稳定。',
    N: '它容易被变化、组合和意外结果吸引，常把物品和空间重新组合成新玩法。限制一个方法后，它可能转向另一个角度，兴趣重点在可能性而非固定用途。',
    T: '它更先判断边界、后果和替代方案，再决定要不要配合。情绪安抚未必马上奏效，但清楚、稳定、可预期的规则通常能让它更快调整。',
    F: '它会把语气、距离和关系状态纳入回应，可能先靠近确认你，再决定是否继续。对它来说，温和且一致的关系反馈比单次命令更有用。',
    J: '它把可预测的顺序当作安全线索，熟悉的时间、地点和流程会让它更放松。流程改变时，它往往先确认原来的秩序是否会回来。',
    P: '它对临时刺激和环境变化的适应更快，下一步常由当下最有趣或最有回报的目标决定。过度固定反而会降低参与度，给它安全的选择空间更有效。'
  };

  function deepReading(r) {
    var rows = [
      ['社交场景', r.axisInfo[0].letter, '它与人和家庭活动的距离，通常由当下的回应密度决定。'],
      ['探索场景', r.axisInfo[1].letter, '它面对物品、路线和变化时，会先确认什么，再决定怎样行动。'],
      ['关系回应', r.axisInfo[2].letter, '它在需求受阻、边界被碰到或气氛变化时，会优先读取哪类信号。'],
      ['生活节奏', r.axisInfo[3].letter, '它如何安排日常顺序，以及在被打断或临时变化后怎样恢复。']
    ];
    return rows.map(function (row) {
      return '<div class="deep-row"><div><b>' + row[0] + '</b><span>' + row[1] + '</span></div><p>' + DEEP_AXIS[row[1]] + ' ' + row[2] + '</p></div>';
    }).join('');
  }

  var THREAT_TIP = {
    HARMLESS: '基本可以放心把家交给它（它也不太想管）。',
    LOW: '偶尔翻个垃圾桶，属于可接受范围。',
    MODERATE: '出门前记得收好数据线、耳机和桌上的水杯。',
    HIGH: '建议：窗户护栏、桌面清空、易碎品上锁，以及大量耐心。',
    CHAOTIC: '你家已经不完全属于你了，它只是允许你继续住。'
  };
  function threatAdvice(r) { return THREAT_TIP[r.threat.en]; }

  /* ---------- 图鉴 ---------- */
  function renderGallery() {
    $('#gallery').innerHTML = MEOW.TYPE_ORDER.map(function (code) {
      var t = MEOW.TYPES[code];
      return '<button type="button" class="g-item family-' + MEOW.typeFamily(code) + '" data-code="' + code + '">' +
        MEOW.catSVG({ fur: MEOW.typeFur(code), code: code, size: 110, id: 'g' + code, label: t.name, bg: true }) +
        '<span class="g-code">' + code + '</span>' +
        '<span class="g-name">' + t.emoji + ' ' + t.name + '</span>' +
        '<span class="g-rare">稀有度 ' + t.rarity + '%</span></button>';
    }).join('');
  }

  function openType(code) {
    var t = MEOW.TYPES[code];
    $('#modalBody').innerHTML =
      '<div class="modal-cat">' + MEOW.catSVG({ fur: MEOW.typeFur(code), code: code, size: 150, id: 'mo', label: t.name, bg: true }) + '</div>' +
      '<p class="m-code">' + code + '</p><h3>' + t.emoji + ' ' + t.name + '</h3>' +
      '<div class="tags" style="justify-content:center">' + t.tags.map(function (x) { return '<span>#' + x + '</span>'; }).join('') + '</div>' +
      '<p>' + t.desc + '</p><div class="tip"><b>相处建议：</b>' + t.care + '</div>';
    $('#modal').hidden = false;
  }

  /* ---------- 事件 ---------- */
  function bind() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-go],.opt,.g-item,[data-close]');
      if (!el) return;
      if (el.dataset.go) { e.preventDefault(); return go(el.dataset.go); }
      if (el.classList.contains('opt')) return answer(+el.dataset.i);
      if (el.classList.contains('g-item')) return openType(el.dataset.code);
      if (el.dataset.close) { $('#modal').hidden = true; return; }
    });

    $('#startQuiz').addEventListener('click', startQuiz);
    $('#galleryBack').addEventListener('click', function () {
      go(state.result ? 'result' : 'home');
    });
    $('#prevQ').addEventListener('click', function () {
      if (state.idx > 0) { state.idx--; renderQuestion(); }
    });

    $('#saveCard').addEventListener('click', function () {
      if (!state.result) return;
      toast('正在生成卡片…');
      MEOW.downloadCard(state.result).then(function (fmt) {
        toast(fmt === 'png' ? '卡片已保存' : '已保存为 SVG（当前浏览器不支持转 PNG）');
      });
    });

    $('#retake').addEventListener('click', function () {
      state.photo = '';
      state.answers = [];
      state.idx = 0;
      state.name = '它';
      renderQuestion();
      go('quiz');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { $('#modal').hidden = true; return; }
      if (!$('#screen-quiz').classList.contains('is-active')) return;
      var n = parseInt(e.key, 10);
      if (n >= 1 && n <= 5) {
        var btn = $$('#opts .opt')[n - 1];
        if (btn) btn.click();
      } else if (e.key === 'ArrowLeft' && state.idx > 0) {
        state.idx--; renderQuestion();
      }
    });
  }

  /* ---------- 启动 ---------- */
  renderHome();
  bind();
})();
