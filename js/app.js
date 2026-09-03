/* ===========================================================
 * MeowBTI · 交互主控
 * 首页 → 24 题 → 猫格身份证 → 图鉴
 * =========================================================== */
(function () {
  var Q = MEOW.QUESTIONS;

  var state = { name: '', fur: MEOW.FURS[0].key, photo: '', idx: 0, answers: [], result: null };

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

  function tr(key, values) { return MEOW.t(key, values); }

  function applyStaticText() {
    var isEn = MEOW.lang === 'en';
    document.documentElement.lang = isEn ? 'en' : 'zh-CN';
    document.title = tr('documentTitle');
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', tr('metaDescription'));
    $('#langToggle').textContent = tr('switchText');
    $('#langToggle').setAttribute('aria-label', tr('switchLabel'));
    $('#coverTitleSub').textContent = tr('homeTitle');
    $('#coverSubtitle').textContent = tr('homeSubtitle');
    $('#coverMetaQuestions').textContent = tr('questionMeta');
    $('#coverMetaTime').textContent = tr('timeMeta');
    $('#coverMetaReport').textContent = tr('reportMeta');
    $('#startQuiz').textContent = tr('start');
    $('#prevQ').textContent = tr('previous');
    $('#quizHint').textContent = tr('quizHint');
    $('#retake').textContent = tr('retake');
    $('#saveCard').textContent = tr('saveCard');
    $('[data-go="gallery"]').textContent = tr('allPersonas');
    $('#saveHint').textContent = tr('saveHint');
    $('#galleryBack').textContent = tr('back');
    $('#galleryTitle').textContent = tr('galleryTitle');
    $('#footerText').textContent = tr('footer');
    $('#modalBox').setAttribute('aria-label', tr('modalLabel'));
    $('#modalClose').setAttribute('aria-label', tr('close'));
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
    state.name = '';
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
    $('#quizCount').textContent = tr('quizCount', { current: i + 1, total: Q.length });
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
    $('#cardHost').innerHTML = MEOW.cardSVG(r, { lang: MEOW.lang });
    renderReport(r);
    go('result');
  }

  function renderReport(r) {
    var t = r.type;
    var guidance = r.observed >= 12 && r.overallStability >= 58 ? (MEOW.TYPE_GUIDANCE[r.code] || {}) : {
      core: tr('fallbackCore'),
      strengths: tr('fallbackStrength'),
      blind: tr('fallbackBlind'),
      stress: tr('fallbackStress')
    };
    var sorted = r.traits.slice().sort(function (a, b) { return b.value - a.value; });
    var hi = sorted[0], lo = sorted[sorted.length - 1];
    var axisRank = r.axisInfo.slice().sort(function (a, b) { return b.stability - a.stability || b.strength - a.strength; });
    var strongestAxis = axisRank[0];
    var softestAxis = axisRank[axisRank.length - 1];
    var signalText = r.observed === 0
      ? tr('signalEmpty')
      : tr('signal', { strong: strongestAxis.title, soft: softestAxis.title, stability: r.overallStabilityLabel });

    var axisRows = r.axisInfo.map(function (a) {
      var isPos = a.letter === a.pos;
      var confidence = a.observed === 0 ? tr('noObservation') : a.stabilityLabel;
      return '<div class="axis-row">' +
        '<div class="ar-top"><span class="ar-title">' + a.title + '</span>' +
        '<span class="ar-tag">' + a.letter + ' · ' + a.name + ' ' + a.strength + '%</span></div>' +
        '<div class="ar-track"><i style="width:' + a.posPct + '%"></i></div>' +
        '<div class="ar-poles"><s class="' + (isPos ? 'on' : '') + '">' + a.pos + ' ' + a.posName + '</s>' +
        '<s class="' + (isPos ? '' : 'on') + '">' + a.neg + ' ' + a.negName + '</s></div>' +
        '<p class="ar-desc">' + axisReading(a) + ' <span class="confidence-note">' + confidence + '</span></p></div>';
    }).join('');

    var traitSummary = r.observed >= 6
      ? '<p>' + tr('traitSummary', { name: esc(r.name), high: hi.label, highValue: hi.value, low: lo.label, lowValue: lo.value, comment: traitComment(hi, lo) }) + '</p>'
      : '<p>' + tr('traitLow') + '</p>';
    var typeDescription = r.observed >= 8 ? t.desc : tr('typeLow');
    var typeTags = r.observed >= 8 ? t.tags : tr('lowTags');

    $('#report').innerHTML =
      '<section class="block"><h3 class="block-title">' + t.emoji + ' ' + tr('reportTitle') + (r.overallStability < 58 ? tr('observing') : '') + '</h3>' +
      '<div class="tags">' + typeTags.map(function (x) { return '<span>#' + x + '</span>'; }).join('') + '</div>' +
      '<p class="report-overview">' + signalText + '</p>' +
      '<p>' + typeDescription + '</p>' + traitSummary +
      '<div class="personality-read"><b>' + tr('personalityCore') + '</b><p>' + personalitySummary(r) + '</p></div>' +
      '<div class="depth-grid">' +
      depthItem(tr('motivation'), guidance.core) + depthItem(tr('strengths'), guidance.strengths) +
      depthItem(tr('misread'), guidance.blind) + depthItem(tr('stress'), guidance.stress) +
      '</div>' +
      '<div class="deep-read"><h4>' + tr('deepTitle') + '</h4>' + deepReading(r) + '</div></section>' +

      '<section class="block"><h3 class="block-title">🧬 ' + tr('axesTitle') + '</h3>' + axisRows + '</section>' +

      '<section class="block"><h3 class="block-title">🏅 ' + tr('archetypeTitle') + '</h3><div class="arch-box">' +
      '<span class="arch-emoji">' + r.archetype.emoji + '</span><div><p><b>' + r.archetype.name + '</b></p>' +
      '<p>' + r.archetype.desc + '</p></div></div></section>' +

      '<section class="block"><h3 class="block-title">⚠️ ' + tr('threatTitle') + ' ' + r.threat.dot + ' ' + r.threat.en + '</h3>' +
      '<p>' + tr('threatBody', { score: r.threatScore, label: r.threat.cn, advice: threatAdvice(r) }) +
      '</p></section>' +

      '<section class="block"><h3 class="block-title">🥰 ' + tr('careTitle') + '</h3>' +
      '<div class="tip"><b>' + tr('keyPoint') + '</b>' + t.care + '</div></section>';
  }

  var HI_TIP = {
    zh: {
      social: '它需要的是热闹，别让它一个人待太久。', indep: '给它足够的独处空间，它会用自己的方式回报你。',
      curio: '多准备新玩具和新路线，它靠好奇心活着。', chaos: '家里的易碎品，建议今晚就收进柜子。', love: '它的幸福来源非常简单：你在旁边。'
    },
    en: {
      social: 'It thrives on company, so try not to leave it alone for too long.', indep: 'Give it enough space to recharge; it will return in its own way.',
      curio: 'Rotate toys and routes; curiosity is how it experiences the world.', chaos: 'Put fragile items away before tonight.', love: 'Its happiness is simple: you being nearby is enough.'
    }
  };
  var LO_TIP = {
    zh: {
      social: '社交这块就别勉强它了。', indep: '独立性偏低，长时间独处容易不安。',
      curio: '对新事物比较谨慎，换东西请慢一点。', chaos: '基本不拆家，是个省心的类型。', love: '亲人度不算高，别急着抱抱。'
    },
    en: {
      social: 'Do not force the social part; it prefers a smaller circle.', indep: 'Long stretches alone may leave it unsettled.',
      curio: 'It is cautious with novelty, so introduce changes slowly.', chaos: 'It is unlikely to dismantle the house, which is a relief.', love: 'Affection is more understated; let it choose when to cuddle.'
    }
  };

  function traitComment(hi, lo) { return HI_TIP[MEOW.lang][hi.key] + ' ' + LO_TIP[MEOW.lang][lo.key]; }

  var LETTER_READ = {
    zh: {
      E: '它更容易从互动中获得能量，会主动把人或家里人拉进自己的活动。', I: '它更需要自己的恢复空间，亲近通常发生在它准备好的时候。',
      S: '它会先处理气味、触感、位置等具体线索，再决定下一步。', N: '它容易被变化、组合和新玩法吸引，常常自己扩展物品的用途。',
      T: '它做回应时更看重边界、规则和实际结果，不会只因为气氛改变就配合。', F: '它会读取关系和情绪线索，再调整距离、语气和互动方式。',
      J: '它依赖稳定的时间、地点和流程，规律被打乱时会先要求恢复秩序。', P: '它对临时变化适应较快，常由当下的刺激决定下一步行动。'
    },
    en: {
      E: 'It gains energy from interaction and often pulls people into its activity.', I: 'It needs recovery space, and closeness usually happens on its terms.',
      S: 'It checks scent, texture, position, and other concrete clues before acting.', N: 'It is drawn to change, combinations, and expanding an object’s possible uses.',
      T: 'It weighs boundaries, rules, and outcomes instead of changing course for atmosphere alone.', F: 'It reads relationship and emotional cues, then adjusts distance and approach.',
      J: 'It relies on stable time, place, and process, restoring order when a routine is disrupted.', P: 'It adapts quickly to temporary change and lets the current stimulus set the next move.'
    }
  };

  function axisReading(a) {
    return LETTER_READ[MEOW.lang][a.letter] + ' ' + a.desc;
  }

  function personalitySummary(r) {
    if (r.observed < 8) return tr('personalityLow');
    var letters = r.axisInfo.map(function (a) { return a.letter; });
    var social = letters[0] === 'E' ? tr('socialE') : tr('socialI');
    var explore = letters[1] === 'S' ? tr('exploreS') : tr('exploreN');
    var bond = letters[2] === 'F' ? tr('bondF') : tr('bondT');
    var rhythm = letters[3] === 'J' ? tr('rhythmJ') : tr('rhythmP');
    var note = r.overallStability < 58 ? tr('personalitySoft') : tr('personalityStable');
    return tr('personality', { name: esc(r.name), social: social, explore: explore, bond: bond, rhythm: rhythm, note: note });
  }

  function depthItem(label, text) {
    return '<div class="depth-item"><b>' + label + '</b><p>' + esc(text || tr('emptyDepth')) + '</p></div>';
  }

  var DEEP_AXIS = {
    zh: {
      E: '它通常会把自己放进事件中心，通过靠近、跟随、叫声或带玩具来确认关系。互动结束后，如果环境仍有回应，它可能继续参与；连续没有反馈时则会主动提高存在感。',
      I: '它更需要先保留退路，再决定是否加入。它的亲近常表现为在附近观察、短暂靠近和按自己的节奏回来，强行拉近距离反而会让它更快撤退。',
      S: '它更信任可闻、可触、可定位的线索，会先确认物品、路线和位置，再选择行动。面对变化时，熟悉的步骤能帮助它保持稳定。',
      N: '它容易被变化、组合和意外结果吸引，常把物品和空间重新组合成新玩法。限制一个方法后，它可能转向另一个角度，兴趣重点在可能性而非固定用途。',
      T: '它更先判断边界、后果和替代方案，再决定要不要配合。情绪安抚未必马上奏效，但清楚、稳定、可预期的规则通常能让它更快调整。',
      F: '它会把语气、距离和关系状态纳入回应，可能先靠近确认你，再决定是否继续。对它来说，温和且一致的关系反馈比单次命令更有用。',
      J: '它把可预测的顺序当作安全线索，熟悉的时间、地点和流程会让它更放松。流程改变时，它往往先确认原来的秩序是否会回来。',
      P: '它对临时刺激和环境变化的适应更快，下一步常由当下最有趣或最有回报的目标决定。过度固定反而会降低参与度，给它安全的选择空间更有效。'
    },
    en: {
      E: 'It often places itself at the center of an event, using proximity, following, sounds, or toys to confirm connection. When the room keeps responding, it stays involved; when feedback disappears, it may raise its presence until someone notices.',
      I: 'It prefers to keep an exit available before deciding whether to join. Affection may look like observing nearby, approaching briefly, and returning on its own schedule; forcing closeness usually makes it withdraw sooner.',
      S: 'It trusts tangible clues such as scent, texture, position, and distance, checking what is actually there before acting. Familiar steps help it stay settled when the environment changes.',
      N: 'It is energized by change, combinations, and unexpected outcomes, often turning objects and spaces into new games. When one method is blocked, it looks for another angle because possibility matters more than intended use.',
      T: 'It checks boundaries, consequences, and alternatives before deciding whether to cooperate. Reassurance may not work immediately, but clear, consistent, predictable rules usually help it adjust faster.',
      F: 'It includes tone, distance, and relationship in its response, often approaching to check on you before deciding what to do next. Gentle, consistent feedback is more useful than a single command.',
      J: 'It uses predictable sequences as safety cues, relaxing into familiar times, places, and processes. When a routine changes, it often checks whether the original order will return.',
      P: 'It adapts quickly to temporary stimuli and environmental change, letting the most interesting or rewarding target set the next move. Safe choice is more effective than excessive rigidity.'
    }
  };

  function deepReading(r) {
    var rows = [
      [tr('deepSocial'), r.axisInfo[0].letter, tr('deepSocialTail')],
      [tr('deepExplore'), r.axisInfo[1].letter, tr('deepExploreTail')],
      [tr('deepBond'), r.axisInfo[2].letter, tr('deepBondTail')],
      [tr('deepRhythm'), r.axisInfo[3].letter, tr('deepRhythmTail')]
    ];
    return rows.map(function (row) {
      return '<div class="deep-row"><div><b>' + row[0] + '</b><span>' + row[1] + '</span></div><p>' + DEEP_AXIS[MEOW.lang][row[1]] + ' ' + row[2] + '</p></div>';
    }).join('');
  }

  var THREAT_TIP = {
    zh: {
      HARMLESS: '基本可以放心把家交给它（它也不太想管）。', LOW: '偶尔翻个垃圾桶，属于可接受范围。',
      MODERATE: '出门前记得收好数据线、耳机和桌上的水杯。', HIGH: '建议：窗户护栏、桌面清空、易碎品上锁，以及大量耐心。',
      CHAOTIC: '你家已经不完全属于你了，它只是允许你继续住。'
    },
    en: {
      HARMLESS: 'You can safely leave the house to it (it did not ask for the job).', LOW: 'An occasional bin raid is within acceptable limits.',
      MODERATE: 'Put away cables, earbuds, and open drinks before leaving.', HIGH: 'Use window guards, clear the counters, secure fragile items, and bring patience.',
      CHAOTIC: 'Your home is no longer entirely yours; it simply permits you to stay.'
    }
  };
  function threatAdvice(r) { return THREAT_TIP[MEOW.lang][r.threat.en]; }

  /* ---------- 图鉴 ---------- */
  function renderGallery() {
    $('#gallery').innerHTML = MEOW.TYPE_ORDER.map(function (code) {
      var t = MEOW.TYPES[code];
      return '<button type="button" class="g-item family-' + MEOW.typeFamily(code) + '" data-code="' + code + '">' +
        MEOW.catSVG({ fur: MEOW.typeFur(code), code: code, size: 110, id: 'g' + code, label: t.name, bg: true }) +
        '<span class="g-code">' + code + '</span>' +
        '<span class="g-name">' + t.emoji + ' ' + t.name + '</span>' +
        '<span class="g-rare">' + tr('galleryRarity', { rarity: t.rarity }) + '</span></button>';
    }).join('');
  }

  function openType(code) {
    var t = MEOW.TYPES[code];
    $('#modalBody').innerHTML =
      '<div class="modal-cat">' + MEOW.catSVG({ fur: MEOW.typeFur(code), code: code, size: 150, id: 'mo', label: t.name, bg: true }) + '</div>' +
      '<p class="m-code">' + code + '</p><h3>' + t.emoji + ' ' + t.name + '</h3>' +
      '<div class="tags" style="justify-content:center">' + t.tags.map(function (x) { return '<span>#' + x + '</span>'; }).join('') + '</div>' +
      '<p>' + t.desc + '</p><div class="tip"><b>' + tr('careLabel') + '</b>' + t.care + '</div>';
    $('#modal').hidden = false;
  }

  function setLanguage(lang) {
    var active = document.querySelector('.screen.is-active');
    MEOW.setLanguage(lang);
    state.name = '';
    applyStaticText();
    try { localStorage.setItem('meowbti-language', MEOW.lang); } catch (e) {}
    renderHome();
    if (active && active.id === 'screen-quiz') renderQuestion();
    if (active && active.id === 'screen-result' && state.result) {
      state.result = MEOW.computeResult(state.answers, { name: state.name, fur: state.fur, photo: state.photo });
      showResult(state.result);
    }
    if (active && active.id === 'screen-gallery') renderGallery();
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
    $('#langToggle').addEventListener('click', function () {
      setLanguage(MEOW.lang === 'en' ? 'zh' : 'en');
    });
    $('#galleryBack').addEventListener('click', function () {
      go(state.result ? 'result' : 'home');
    });
    $('#prevQ').addEventListener('click', function () {
      if (state.idx > 0) { state.idx--; renderQuestion(); }
    });

    $('#saveCard').addEventListener('click', function () {
      if (!state.result) return;
      toast(tr('generating'));
      MEOW.downloadCard(state.result, 2, MEOW.lang).then(function (fmt) {
        toast(fmt === 'png' ? tr('saved') : tr('savedSvg'));
      });
    });

    $('#retake').addEventListener('click', function () {
      state.photo = '';
      state.answers = [];
      state.idx = 0;
      state.name = '';
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
  var initialLang = 'zh';
  try { initialLang = localStorage.getItem('meowbti-language') === 'en' ? 'en' : 'zh'; } catch (e) {}
  MEOW.setLanguage(initialLang);
  applyStaticText();
  renderHome();
  bind();
})();
