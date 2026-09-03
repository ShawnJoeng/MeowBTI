/* ===========================================================
 * MeowBTI · 计分引擎
 * 输入：answers（每题所选序号）+ meta（名字/花色/照片）
 * 输出：猫格 / 四维百分比 / 五项属性 / 原型 / 技能 / 危险等级
 * =========================================================== */
window.MEOW = window.MEOW || {};

(function () {
  var TIE = { EI: 'I', SN: 'S', TF: 'F', JP: 'P' }; // 平票时偏向「猫味」更浓的一极

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  /* 把 0~1 的原始比例映射成好看的百分比（避免全都挤在 30% 附近） */
  function curve(ratio) {
    return clamp(Math.round(6 + 93 * Math.pow(clamp(ratio, 0, 1), 0.72)), 5, 99);
  }

  function serial(seed) {
    var h = 2166136261;
    for (var i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h.toString(36).toUpperCase().slice(-4).padStart(4, 'M');
  }

  MEOW.computeResult = function (answers, meta) {
    meta = meta || {};
    var axis = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    var raw = {}, max = {}, flags = {}, votes = {}, observed = {};
    MEOW.TRAITS.forEach(function (t) { raw[t.key] = 0; max[t.key] = 0; });

    MEOW.QUESTIONS.forEach(function (q, i) {
      var o = q.opts[answers[i]];
      if (!o || o.neutral) return;
      // 只用实际观察到的题目计算分母；跳过题不会把属性值无故拉低。
      MEOW.TRAITS.forEach(function (t) {
        var m = 0;
        q.opts.forEach(function (o) { m = Math.max(m, (o.tr && o.tr[t.key]) || 0); });
        max[t.key] += m;
      });
      observed[q.axis] = (observed[q.axis] || 0) + 1;
      votes[q.axis] = votes[q.axis] || [];
      var voteLetter = Object.keys(o.ax || {})[0] || '';
      if (voteLetter) votes[q.axis].push({ letter: voteLetter, weight: o.ax[voteLetter] || 0 });
      Object.keys(o.ax || {}).forEach(function (k) { axis[k] += o.ax[k]; });
      Object.keys(o.tr || {}).forEach(function (k) { raw[k] += o.tr[k]; });
      (o.f || []).forEach(function (f) { flags[f] = (flags[f] || 0) + 1; });
    });
    var observedTotal = Object.keys(observed).reduce(function (n, k) { return n + observed[k]; }, 0);

    /* --- 猫格四个字母 + 每个维度的倾向百分比 --- */
    var code = '', axisInfo = [];
    MEOW.AXES.forEach(function (ax) {
      var p = axis[ax.pos], n = axis[ax.neg], sum = p + n;
      var ev = votes[ax.key] || [];
      var posVotes = ev.filter(function (x) { return x.letter === ax.pos; }).length;
      var negVotes = ev.filter(function (x) { return x.letter === ax.neg; }).length;
      // 分数相同时先参考行为次数；连行为次数也相同，才使用稳定的猫味兜底。
      var letter = p === n ? (posVotes === negVotes ? TIE[ax.key] : (posVotes > negVotes ? ax.pos : ax.neg)) : (p > n ? ax.pos : ax.neg);
      code += letter;
      var pct = sum === 0 ? 50 : Math.round((p / sum) * 100);
      var expected = MEOW.QUESTIONS.filter(function (q) { return q.axis === ax.key; }).length;
      var answered = observed[ax.key] || 0;
      var coverage = expected ? answered / expected : 0;
      var voteMargin = answered ? Math.abs(posVotes - negVotes) / answered : 0;
      var weightedMargin = sum ? Math.abs(p - n) / sum : 0;
      var stability = Math.round(100 * (coverage * .35 + voteMargin * .35 + weightedMargin * .30));
      var stabilityLabel = stability >= 78 && coverage >= .75 ? MEOW.t('axisStable') : (stability >= 58 && coverage >= .5 ? MEOW.t('axisSteady') : (stability >= 38 ? MEOW.t('axisEmerging') : MEOW.t('axisMiddle')));
      axisInfo.push({
        key: ax.key, title: ax.title, letter: letter,
        posPct: pct, negPct: 100 - pct,
        pos: ax.pos, neg: ax.neg, posName: ax.posName, negName: ax.negName,
        strength: Math.max(pct, 100 - pct),
        gap: Math.abs(p - n),
        posScore: p,
        negScore: n,
        posVotes: posVotes,
        negVotes: negVotes,
        observed: answered,
        coverage: coverage,
        stability: stability,
        stabilityLabel: stabilityLabel,
        name: letter === ax.pos ? ax.posName : ax.negName,
        desc: letter === ax.pos ? ax.posDesc : ax.negDesc
      });
    });

    var overallStability = Math.round(axisInfo.reduce(function (total, a) { return total + a.stability; }, 0) / axisInfo.length);
    var overallCoverage = axisInfo.reduce(function (total, a) { return total + a.coverage; }, 0) / axisInfo.length;
    var overallStabilityLabel = overallStability >= 78 && overallCoverage >= .75 ? MEOW.t('overallStable') : (overallStability >= 58 && overallCoverage >= .5 ? MEOW.t('overallSteady') : (overallStability >= 38 ? MEOW.t('overallEmerging') : MEOW.t('overallWatching'))); 

    /* --- 五项属性 --- */
    var traits = MEOW.TRAITS.map(function (t) {
      return {
        key: t.key, label: t.label, emoji: t.emoji,
        value: curve(max[t.key] ? raw[t.key] / max[t.key] : 0)
      };
    });
    var tv = {};
    traits.forEach(function (t) { tv[t.key] = t.value; });

    /* --- 危险等级 --- */
    var threatScore = Math.round(
      tv.chaos * 0.55 + tv.curio * 0.2 + (100 - tv.love) * 0.15 + tv.indep * 0.1
    );
    var threat = MEOW.THREATS.find(function (t) { return threatScore < t.max; });

    /* --- 原型：出现次数最多的行为标签优先，同分按数据表顺序 --- */
    var arch = null, best = 0;
    function supportsType(item) {
      return !item.requires || code.indexOf(item.requires) !== -1;
    }
    MEOW.ARCHETYPES.forEach(function (a) {
      if (!supportsType(a)) return;
      var c = flags[a.flag] || 0;
      if (c > best) { best = c; arch = a; }
    });
    if (!arch && observedTotal === 0) {
      arch = { emoji: '📝', name: '待观察猫', desc: '目前没有足够的行为记录，先和它一起生活、观察，再回来完成鉴定。' };
    }
    if (!arch) {
      var top = traits.slice().sort(function (a, b) { return b.value - a.value; })[0];
      arch = MEOW.ARCHETYPE_FALLBACK[top.key];
    }

    /* --- 特殊技能：标签技能 → 属性技能 → 字母兜底，取前三条 --- */
    var skills = [];
    function add(t) { if (t && skills.indexOf(t) === -1 && skills.length < 3) skills.push(t); }
    MEOW.SKILLS.forEach(function (s) { if (flags[s.on] && supportsType(s)) add(s.t); });
    MEOW.TRAIT_SKILLS.forEach(function (s) { if (tv[s.trait] >= s.min) add(s.t); });
    code.split('').forEach(function (l) { add(MEOW.LETTER_SKILLS[l]); });

    var type = MEOW.TYPES[code];
    var rarity = type.rarity;
    var stars = rarity < 2 ? 5 : rarity < 4 ? 4 : rarity < 7 ? 3 : rarity < 11 ? 2 : 1;

    return {
      code: code,
      type: type,
      name: (meta.name || '').trim() || MEOW.t('catPronoun'),
      fur: meta.fur || MEOW.FURS[0].key,
      photo: meta.photo || '',
      axisInfo: axisInfo,
      traits: traits,
      traitMap: tv,
      flags: flags,
      archetype: arch,
      skills: skills,
      threat: threat,
      threatScore: threatScore,
      observed: observedTotal,
      observedByAxis: observed,
      overallStability: overallStability,
      overallCoverage: overallCoverage,
      overallStabilityLabel: overallStabilityLabel,
      rarity: rarity,
      stars: stars,
      serial: 'MB-' + serial((meta.name || 'cat') + code + JSON.stringify(tv)),
      date: new Date().toISOString().slice(0, 10),
      answers: answers.slice()
    };
  };

  /* 分享文案 */
  MEOW.shareText = function (r) {
    var bars = r.traits.map(function (t) {
      return t.label + ' ' + MEOW.bar(t.value) + ' ' + t.value + '%';
    }).join('\n');
    return '🐈 MeowBTI 猫格鉴定报告\n' +
      r.name + ' · ' + r.code + '「' + r.type.name + '」\n' +
      r.archetype.emoji + ' ' + r.archetype.name + '\n\n' + bars +
      '\n\n特殊技能\n• ' + r.skills.join('\n• ') +
      '\n\nThreat Level ' + r.threat.dot + ' ' + r.threat.en + '（' + r.threat.cn + '）\n' +
      '稀有度 ' + r.rarity + '% · 编号 #' + r.serial + '\n' +
      '快来测测你家猫 → MeowBTI';
  };

  /* 文本版进度条（分享文案里用） */
  MEOW.bar = function (v) {
    var full = Math.round(v / 10);
    return new Array(full + 1).join('█') + new Array(10 - full + 1).join('░');
  };
})();
