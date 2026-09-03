/* ===========================================================
 * MeowBTI · Low-poly cat character renderer
 * 16 distinct MBTI costumes on one reusable 200 x 200 SVG rig.
 * =========================================================== */
window.MEOW = window.MEOW || {};

(function () {
  var INK = '#332F38';
  var CREAM = '#FFF8EE';

  var CHARACTERS = {
    INTJ: { family: 'analyst', fur: 'blue',    eyes: 'sharp',  wear: 'architect', prop: 'chess' },
    INTP: { family: 'analyst', fur: 'tabby',   eyes: 'wide',   wear: 'scientist', prop: 'flask', head: 'glasses' },
    ENTJ: { family: 'analyst', fur: 'black',   eyes: 'sharp',  wear: 'commander', prop: 'trophy', back: 'cape' },
    ENTP: { family: 'analyst', fur: 'tabby',   eyes: 'squint', wear: 'debater',   prop: 'plane', pose: 'wave' },

    INFJ: { family: 'diplomat', fur: 'white',  eyes: 'half',   wear: 'oracle',    prop: 'staff', back: 'hood' },
    INFP: { family: 'diplomat', fur: 'calico', eyes: 'round',  wear: 'poet',      prop: 'flower', head: 'flowers' },
    ENFJ: { family: 'diplomat', fur: 'orange', eyes: 'round',  wear: 'guardian',  prop: 'heart', back: 'cape', pose: 'wave' },
    ENFP: { family: 'diplomat', fur: 'calico', eyes: 'star',   wear: 'adventurer',prop: 'leaf', back: 'pack', pose: 'wave' },

    ISTJ: { family: 'sentinel', fur: 'ragdoll',eyes: 'round',  wear: 'logistics', prop: 'clipboard', head: 'glasses' },
    ISFJ: { family: 'sentinel', fur: 'orange', eyes: 'round',  wear: 'nurse',     prop: 'medbag', head: 'nurse' },
    ESTJ: { family: 'sentinel', fur: 'cow',    eyes: 'sharp',  wear: 'manager',   prop: 'megaphone' },
    ESFJ: { family: 'sentinel', fur: 'cow',    eyes: 'wide',   wear: 'host',      prop: 'cake' },

    ISTP: { family: 'explorer', fur: 'tabby',  eyes: 'half',   wear: 'engineer',  prop: 'wrench', head: 'goggles' },
    ISFP: { family: 'explorer', fur: 'orange', eyes: 'round',  wear: 'artist',    prop: 'palette', head: 'beret' },
    ESTP: { family: 'explorer', fur: 'orange', eyes: 'squint', wear: 'sprinter',  prop: 'spark', head: 'sunglasses', pose: 'wave' },
    ESFP: { family: 'explorer', fur: 'calico', eyes: 'star',   wear: 'performer', prop: 'mic', head: 'fringe', pose: 'wave' }
  };

  var FAMILY = {
    analyst:  { main: '#70427C', dark: '#432A50', mid: '#8F5A96', light: '#D9B6D8', bg: '#F2E7F2' },
    diplomat: { main: '#4E8D5F', dark: '#285B3C', mid: '#75A85F', light: '#CBE4B7', bg: '#EDF6E9' },
    sentinel: { main: '#3B8FB5', dark: '#245D7C', mid: '#6EB6D3', light: '#CBE8F2', bg: '#EAF6FA' },
    explorer: { main: '#D79A20', dark: '#80551D', mid: '#E7B94C', light: '#F7DEA0', bg: '#FFF5D9' }
  };

  MEOW.TYPE_FUR = {};
  Object.keys(CHARACTERS).forEach(function (code) { MEOW.TYPE_FUR[code] = CHARACTERS[code].fur; });
  MEOW.FUR_PREVIEW = {
    orange: 'ISFJ', tabby: 'INTP', calico: 'INFP', cow: 'ESFJ',
    black: 'ENTJ', white: 'INFJ', ragdoll: 'ISTJ', blue: 'INTJ'
  };
  MEOW.TYPE_ORDER = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];
  MEOW.typeFur = function (code) { return MEOW.TYPE_FUR[code] || 'orange'; };
  MEOW.typeFamily = function (code) { return (CHARACTERS[code] && CHARACTERS[code].family) || 'explorer'; };
  MEOW.catAsset = function (code, transparent) {
    var name = String(code || 'intj').toLowerCase();
    return 'assets/cats/' + name + '.png?v=20260903-30';
  };

  MEOW.getFur = function (key) {
    for (var i = 0; i < MEOW.FURS.length; i++) if (MEOW.FURS[i].key === key) return MEOW.FURS[i];
    return MEOW.FURS[0];
  };

  function shade(hex, amount) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var out = '#';
    for (var i = 0; i < 3; i++) {
      var v = Math.max(0, Math.min(255, Math.round(parseInt(h.substr(i * 2, 2), 16) * amount)));
      out += (v < 16 ? '0' : '') + v.toString(16);
    }
    return out;
  }

  function poly(points, fill, extra) {
    return '<polygon points="' + points + '" fill="' + fill + '"' + (extra || '') + '/>';
  }

  function star(x, y, r, color) {
    return poly(
      x + ',' + (y - r) + ' ' + (x + r * .28) + ',' + (y - r * .28) + ' ' + (x + r) + ',' + y + ' ' +
      (x + r * .28) + ',' + (y + r * .28) + ' ' + x + ',' + (y + r) + ' ' + (x - r * .28) + ',' +
      (y + r * .28) + ' ' + (x - r) + ',' + y + ' ' + (x - r * .28) + ',' + (y - r * .28), color
    );
  }

  function faceEye(cx, sign, kind, eyeColor) {
    if (kind === 'squint') {
      return '<path d="M' + (cx - 9) + ' 73 Q' + cx + ' 64 ' + (cx + 9) + ' 73" fill="none" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round"/>';
    }
    if (kind === 'half') {
      return '<path d="M' + (cx - 10) + ' 69 Q' + cx + ' 78 ' + (cx + 10) + ' 69 Q' + cx + ' 65 ' + (cx - 10) + ' 69Z" fill="' + eyeColor + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<path d="M' + (cx - 10) + ' 68 L' + (cx + 10) + ' 68" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>';
    }
    var ry = kind === 'wide' || kind === 'star' ? 10.8 : 9.3;
    var iris = '<ellipse cx="' + cx + '" cy="70" rx="9.5" ry="' + ry + '" fill="#FFFDF8" stroke="' + INK + '" stroke-width="2"/>' +
      '<ellipse cx="' + (cx + sign) + '" cy="71" rx="5.2" ry="7" fill="' + eyeColor + '"/>' +
      '<ellipse cx="' + (cx + sign * 1.4) + '" cy="71" rx="2.2" ry="5.4" fill="' + INK + '"/>' +
      '<circle cx="' + (cx - 1.5) + '" cy="67" r="2.3" fill="#fff"/>';
    if (kind === 'star') iris += star(cx + sign, 71, 3.7, '#FFF0A7');
    if (kind === 'sharp') iris += '<path d="M' + (cx - 10) + ' 64 L' + (cx + 9) + ' 67" stroke="' + INK + '" stroke-width="3.1" stroke-linecap="round"/>';
    return iris;
  }

  function furPattern(fur, prefix) {
    if (fur.pattern === 'stripes') {
      return '<g clip-path="url(#' + prefix + 'headClip)" fill="' + fur.patch + '" opacity=".9">' +
        poly('96,27 100,45 104,27', fur.patch) +
        poly('82,31 89,48 94,34', fur.patch) +
        poly('118,31 111,48 106,34', fur.patch) +
        poly('50,62 71,64 57,73', fur.patch) +
        poly('150,62 129,64 143,73', fur.patch) + '</g>';
    }
    if (fur.pattern === 'patches') {
      return '<g clip-path="url(#' + prefix + 'headClip)">' +
        poly('49,54 66,32 96,28 93,66 73,80 52,73', fur.patch) +
        poly('124,84 151,69 144,97 121,109', shade(fur.patch, .78)) + '</g>';
    }
    if (fur.pattern === 'points') {
      return '<g clip-path="url(#' + prefix + 'headClip)" opacity=".78">' +
        poly('76,74 89,58 111,58 125,75 114,98 100,108 86,98', fur.patch) + '</g>';
    }
    return '';
  }

  function head(fur, prefix, eyes) {
    var edge = shade(fur.base, .72);
    var dark = shade(fur.base, .82);
    var light = shade(fur.base, 1.09);
    return '<g>' +
      poly('57,49 61,8 95,32', fur.base, ' stroke="' + edge + '" stroke-width="2.3" stroke-linejoin="round"') +
      poly('143,49 139,8 105,32', dark, ' stroke="' + edge + '" stroke-width="2.3" stroke-linejoin="round"') +
      poly('68,42 70,20 89,35', fur.inner) + poly('132,42 130,20 111,35', shade(fur.inner, .92)) +
      poly('54,51 75,32 100,25 126,32 146,51 151,73 143,95 123,109 100,114 77,109 57,95 49,73', fur.base,
        ' stroke="' + edge + '" stroke-width="2.7" stroke-linejoin="round"') +
      '<g clip-path="url(#' + prefix + 'headClip)">' +
        poly('49,51 75,32 78,70 57,95 44,73', dark) +
        poly('75,32 100,25 100,61 78,70', shade(fur.base, .94)) +
        poly('100,25 126,32 122,70 100,61', light) +
        poly('126,32 151,54 151,75 122,70', shade(fur.base, .88)) +
        poly('57,95 78,70 100,89 77,109', shade(fur.base, .9)) +
        poly('143,95 122,70 100,89 123,109', light) +
      '</g>' +
      furPattern(fur, prefix) +
      poly('67,84 87,78 100,89 88,105 72,101', CREAM) +
      poly('133,84 113,78 100,89 112,105 128,101', '#FFFDF7') +
      faceEye(80, 1, eyes, fur.eye) + faceEye(120, -1, eyes, fur.eye) +
      poly('94,85 106,85 100,92', fur.nose) +
      '<path d="M100 92 L100 96 M100 96 Q94 101 89 97 M100 96 Q106 101 111 97" fill="none" stroke="' + shade(fur.nose, .66) + '" stroke-width="2" stroke-linecap="round"/>' +
      '<g stroke="' + edge + '" stroke-width="1.7" stroke-linecap="round" opacity=".7">' +
        '<path d="M64 89 L29 82 M64 95 L26 97 M136 89 L171 82 M136 95 L174 97"/>' +
      '</g></g>';
  }

  function backLayer(kind, p) {
    if (kind === 'cape') {
      return poly('89,103 127,101 158,154 132,176 105,146', p.dark) +
        poly('112,104 129,103 154,151 136,156', p.main);
    }
    if (kind === 'hood') {
      return poly('44,77 52,47 75,23 100,18 126,24 148,49 156,80 143,109 126,99 144,75 137,51 119,37 100,32 80,37 62,53 56,78 73,102 57,110', p.dark) +
        poly('46,76 56,49 78,27 100,21 99,34 76,42 60,61 58,83', p.main) +
        poly('63,103 51,124 56,173 82,181 100,145 82,110', p.main) +
        poly('137,103 149,124 144,173 118,181 100,145 118,110', p.dark);
    }
    if (kind === 'pack') {
      return '<rect x="57" y="113" width="25" height="51" rx="7" fill="' + p.dark + '"/>' +
        '<rect x="52" y="126" width="13" height="28" rx="5" fill="' + p.mid + '"/>' +
        '<path d="M61 126 H78 M61 137 H78" stroke="' + p.light + '" stroke-width="2"/>';
    }
    return '';
  }

  function bodyBase(fur) {
    var edge = shade(fur.base, .72);
    return poly('77,103 63,123 61,161 75,184 100,190 125,184 139,161 137,123 123,103 100,99', fur.base,
      ' stroke="' + edge + '" stroke-width="2.5" stroke-linejoin="round"') +
      poly('63,123 77,103 100,115 75,184 61,161', shade(fur.base, .85)) +
      poly('123,103 137,123 139,161 125,184 100,115', shade(fur.base, 1.06));
  }

  function suit(p, main, dark, shirt, detail) {
    return poly('70,112 84,103 100,112 116,103 130,112 136,167 120,182 80,182 64,167', main) +
      poly('70,112 84,103 100,115 80,181 64,167', dark) +
      poly('116,103 130,112 136,167 120,182 100,115', shade(main, 1.1)) +
      poly('84,103 100,113 116,103 109,137 100,151 91,137', shirt) + (detail || '');
  }

  function costume(code, p) {
    switch (code) {
      case 'INTJ': return suit(p, p.main, p.dark, '#F8F2F6',
        poly('84,104 100,115 91,135 76,112', p.mid) + poly('116,104 100,115 109,135 124,112', p.dark) +
        poly('96,114 104,114 102,139 98,139', '#49344F') + '<circle cx="104" cy="153" r="2.4" fill="' + p.light + '"/>');
      case 'INTP': return suit(p, '#756977', '#514A55', '#FBF7F2',
        poly('88,109 100,118 112,109 106,126 94,126', p.main) +
        poly('88,119 99,126 88,133', p.main) + poly('112,119 101,126 112,133', p.dark) +
        '<circle cx="100" cy="127" r="4" fill="' + p.mid + '"/>');
      case 'ENTJ': return suit(p, '#302D36', '#211E26', '#F8F4EE',
        poly('82,104 100,116 90,138 73,112', p.main) + poly('118,104 100,116 110,138 127,112', p.dark) +
        '<rect x="72" y="154" width="57" height="9" fill="' + p.dark + '"/><rect x="96" y="153" width="9" height="11" fill="' + p.mid + '"/>');
      case 'ENTP': return suit(p, '#6E6965', '#4F4A48', '#FCF7EE',
        poly('87,112 99,120 87,130', '#7F2948') + poly('113,112 101,120 113,130', '#67223A') +
        '<circle cx="100" cy="121" r="4" fill="#A33E61"/>');

      case 'INFJ': return suit(p, p.main, p.dark, '#EFF5E9',
        poly('70,112 100,128 130,112 127,130 100,144 73,130', p.mid) +
        poly('98,127 102,127 104,169 96,169', p.light));
      case 'INFP': return suit(p, p.mid, p.main, '#FFF8E9',
        poly('72,111 100,132 128,111 123,131 100,147 77,131', p.light) +
        '<circle cx="100" cy="147" r="3" fill="#E6B63B"/><circle cx="100" cy="158" r="3" fill="#E6B63B"/>');
      case 'ENFJ': return suit(p, '#506D32', '#344B24', '#F3F1DD',
        poly('75,108 100,126 125,108 121,132 100,144 79,132', p.main) +
        '<circle cx="100" cy="148" r="3" fill="' + p.light + '"/><circle cx="100" cy="158" r="3" fill="' + p.light + '"/>');
      case 'ENFP': return suit(p, '#347651', '#23523B', '#F7F3E7',
        poly('82,104 100,116 92,132 74,111', p.mid) + poly('118,104 100,116 108,132 126,111', p.dark) +
        poly('96,115 104,115 102,143 98,143', '#C94C42') + '<rect x="75" y="151" width="51" height="8" fill="' + p.dark + '"/>');

      case 'ISTJ': return suit(p, '#EDF5F5', '#BFD6DE', '#FFFFFF',
        poly('92,108 100,117 108,108 104,126 96,126', p.dark) +
        poly('96,124 104,124 107,151 100,158 93,151', '#327BA1') +
        poly('73,163 98,163 98,183 78,181', '#376D88') + poly('102,163 128,163 122,181 102,183', '#2D607A'));
      case 'ISFJ': return suit(p, p.mid, p.dark, '#FFFDF8',
        poly('77,117 100,128 123,117 127,169 100,180 73,169', '#FFF5EF') +
        '<rect x="89" y="145" width="22" height="17" rx="3" fill="#F39DB1"/><path d="M100 149 V158 M95 153.5 H105" stroke="#fff" stroke-width="2.5"/>');
      case 'ESTJ': return suit(p, '#397FA1', '#24566F', '#F9F8F1',
        poly('90,106 100,116 110,106 105,129 95,129', p.light) +
        poly('96,126 104,126 106,153 100,159 94,153', '#2C546D') +
        '<rect x="74" y="158" width="53" height="7" fill="' + p.dark + '"/>');
      case 'ESFJ': return suit(p, '#80B8CD', '#407F9B', '#FFFFFF',
        poly('74,119 100,130 126,119 130,173 100,183 70,173', '#FFFDF8') +
        poly('69,169 100,178 131,169 126,181 100,187 74,181', '#DCEEF4') +
        '<rect x="91" y="146" width="19" height="14" rx="3" fill="' + p.light + '"/>');

      case 'ISTP': return suit(p, '#9A6B2C', '#62431F', '#EFE0B8',
        poly('80,110 100,123 120,110 116,144 84,144', '#5D5947') +
        '<rect x="69" y="151" width="62" height="11" fill="#443B2F"/><rect x="94" y="150" width="13" height="13" fill="' + p.mid + '"/>' +
        '<rect x="74" y="164" width="17" height="13" fill="#6C5530"/><rect x="109" y="164" width="17" height="13" fill="#6C5530"/>');
      case 'ISFP': return suit(p, '#C88C29', '#7D5724', '#FFF3D7',
        poly('72,109 100,133 128,109 123,126 100,143 77,126', '#317052') +
        poly('94,131 106,131 103,160 97,160', '#285A43'));
      case 'ESTP': return suit(p, '#E0A121', '#25262A', '#FFF8E7',
        poly('71,112 82,104 96,118 83,135', '#23252A') + poly('129,112 118,104 104,118 117,135', '#23252A') +
        '<rect x="69" y="159" width="62" height="9" fill="#24262A"/><path d="M88 108 L100 120 L112 108" fill="none" stroke="#fff" stroke-width="3"/>');
      case 'ESFP': return suit(p, '#B77A28', '#634522', '#FFF3D8',
        poly('72,111 100,128 128,111 123,135 100,146 77,135', p.mid) +
        '<rect x="71" y="157" width="58" height="10" fill="#302D31"/><rect x="96" y="156" width="9" height="12" fill="' + p.light + '"/>');
      default: return '';
    }
  }

  function headwear(kind, p) {
    switch (kind) {
      case 'glasses':
        return '<g fill="none" stroke="' + p.dark + '" stroke-width="4" stroke-linejoin="round"><polygon points="63,61 94,61 91,82 69,82"/><polygon points="106,61 137,61 131,82 109,82"/><path d="M94 66 H106"/></g>';
      case 'flowers':
        return '<g>' + flowerAt(67, 43, '#F4C74D') + flowerAt(83, 35, '#F8D45D') + flowerAt(100, 32, '#E9B83D') +
          flowerAt(117, 35, '#F8D45D') + '<path d="M61 46 Q95 26 139 43" fill="none" stroke="' + p.dark + '" stroke-width="3"/></g>';
      case 'nurse':
        return poly('69,43 84,28 116,28 132,43 116,49 84,49', '#F8FBFA', ' stroke="' + p.dark + '" stroke-width="2"') +
          '<path d="M100 31 V44 M94 37.5 H106" stroke="' + p.main + '" stroke-width="4"/>';
      case 'goggles':
        return '<g transform="rotate(-3 100 51)"><path d="M61 49 H139" stroke="' + p.dark + '" stroke-width="7"/>' +
          poly('64,42 94,42 90,60 69,60', '#86C7E0', ' stroke="#3C3B38" stroke-width="4"') +
          poly('106,42 136,42 131,60 110,60', '#9DDBED', ' stroke="#3C3B38" stroke-width="4"') +
          poly('68,45 82,45 72,54', '#DFF6FB') + poly('110,45 124,45 114,54', '#EAFBFD') + '</g>';
      case 'beret':
        return poly('58,47 68,27 94,19 125,26 135,43 111,48 80,47', '#4C4031') +
          '<path d="M102 21 Q100 12 107 13" fill="none" stroke="#3B342D" stroke-width="4" stroke-linecap="round"/>';
      case 'sunglasses':
        return '<g fill="#25353A" stroke="#2D4E49" stroke-width="4"><polygon points="61,59 94,59 90,78 69,78"/><polygon points="106,59 139,59 131,78 110,78"/></g>' +
          '<path d="M94 64 H106" stroke="#2D4E49" stroke-width="4"/><path d="M67 62 L78 62 L69 70" fill="#77BFC4" opacity=".8"/>';
      case 'fringe':
        return poly('53,52 68,31 96,23 119,30 140,48 125,52 113,72 103,51 89,72 80,49 64,62', '#363238') +
          poly('93,25 118,30 140,48 120,48', '#4A4144');
      default: return '';
    }
  }

  function flowerAt(x, y, color) {
    return '<g fill="' + color + '"><circle cx="' + x + '" cy="' + (y - 4) + '" r="4"/><circle cx="' + (x + 4) + '" cy="' + y + '" r="4"/><circle cx="' + x + '" cy="' + (y + 4) + '" r="4"/><circle cx="' + (x - 4) + '" cy="' + y + '" r="4"/><circle cx="' + x + '" cy="' + y + '" r="2.5" fill="#FFF0A3"/></g>';
  }

  function propArt(kind, p) {
    switch (kind) {
      case 'chess':
        return '<ellipse cx="22" cy="40" rx="16" ry="3" fill="#000" opacity=".1"/>' +
          poly('10,39 15,31 17,22 27,22 29,31 34,39', '#67738A') + '<circle cx="22" cy="15" r="7" fill="#8490A5"/>' +
          poly('17,11 22,7 27,11 25,16 19,16', '#94A0B5');
      case 'flask':
        return poly('18,7 27,7 27,20 37,40 8,40 18,20', '#E7F5F6', ' stroke="#718C97" stroke-width="2"') +
          poly('12,32 33,30 37,40 8,40', '#C05A9A') + '<circle cx="20" cy="28" r="2" fill="#fff"/><circle cx="28" cy="34" r="2" fill="#fff"/>';
      case 'trophy':
        return '<path d="M10 9 H34 L31 23 Q22 32 13 23Z" fill="#F2C94C" stroke="#B8801E" stroke-width="2"/>' +
          '<path d="M11 11 Q2 10 7 22 Q9 26 15 25 M33 11 Q42 10 37 22 Q35 26 29 25" fill="none" stroke="#B8801E" stroke-width="2"/>' +
          '<rect x="19" y="27" width="6" height="8" fill="#B8801E"/>' + poly('10,41 15,34 29,34 34,41', '#D8A82E');
      case 'plane':
        return poly('2,29 42,8 27,39 20,28', '#FFFDF8', ' stroke="' + p.dark + '" stroke-width="2" stroke-linejoin="round"') +
          '<path d="M2 29 L20 28 L42 8 M20 28 L27 39" fill="none" stroke="' + p.dark + '" stroke-width="2"/>';
      case 'staff':
        return '<path d="M17 85 L29 9" stroke="#6A5133" stroke-width="5" stroke-linecap="round"/>' + star(30, 10, 9, '#83B76D') + star(30, 10, 4, '#EAF3B8');
      case 'flower':
        return '<path d="M18 42 Q20 25 31 14" fill="none" stroke="#4C8A52" stroke-width="4"/>' +
          '<path d="M19 31 Q9 25 9 36 Q15 40 19 31 M24 25 Q33 20 31 30 Q27 34 24 25" fill="#75A85F"/>' + flowerAt(32, 13, '#F1B82E');
      case 'heart':
        return '<path d="M22 37 Q2 22 7 9 Q13 0 22 12 Q31 0 37 9 Q42 22 22 37Z" fill="#EF8EA1"/>' +
          poly('10,12 17,8 14,19', '#FFC1CB');
      case 'leaf':
        return '<path d="M8 39 Q20 20 38 9 Q36 31 15 39Z" fill="#6CA84F" stroke="#3F743D" stroke-width="2"/>' +
          '<path d="M12 37 L34 14 M20 31 L18 22 M27 24 L34 23" fill="none" stroke="#D7E9A4" stroke-width="2"/>';
      case 'clipboard':
        return '<rect x="6" y="6" width="32" height="38" rx="3" fill="#F9F6EE" stroke="#607885" stroke-width="2"/>' +
          '<rect x="14" y="3" width="16" height="7" rx="2" fill="#607885"/>' +
          '<path d="M12 20 H31 M12 28 H31 M12 36 H26" stroke="#9DB6C1" stroke-width="2.5"/>';
      case 'medbag':
        return '<rect x="5" y="17" width="36" height="26" rx="5" fill="#F3A5B5" stroke="#B7687C" stroke-width="2"/>' +
          '<path d="M15 17 Q15 8 23 8 Q31 8 31 17" fill="none" stroke="#B7687C" stroke-width="3"/>' +
          '<path d="M23 23 V36 M16.5 29.5 H29.5" stroke="#fff" stroke-width="4"/>';
      case 'megaphone':
        return '<g transform="rotate(-16 23 24)">' + poly('8,17 34,8 34,34 8,27', '#5CA5C7', ' stroke="#245D7C" stroke-width="2"') +
          '<rect x="4" y="17" width="8" height="11" rx="2" fill="#E9F5F8"/>' + poly('14,27 24,29 20,43 12,41', '#245D7C') + '</g>';
      case 'cake':
        return '<ellipse cx="22" cy="42" rx="21" ry="3" fill="#7094A0"/>' +
          '<rect x="7" y="20" width="30" height="20" rx="3" fill="#FFF6E5" stroke="#CE9D80" stroke-width="2"/>' +
          '<path d="M8 26 Q13 33 18 26 Q23 33 28 26 Q33 33 37 26" fill="#F5A9B7"/>' +
          '<path d="M22 20 V10" stroke="#E0A42B" stroke-width="2"/><path d="M22 11 Q17 7 22 3 Q27 7 22 11" fill="#F3B72B"/>';
      case 'wrench':
        return '<g transform="rotate(-32 22 24)"><path d="M15 15 Q10 3 22 3 Q34 3 29 15 L25 14 L25 38 Q25 43 20 43 Q15 43 15 38 L19 14Z" fill="#8F989D" stroke="#555F65" stroke-width="2"/>' +
          '<circle cx="20" cy="37" r="3" fill="#D6D9D7"/></g>';
      case 'palette':
        return '<path d="M3 24 Q4 4 24 4 Q42 4 42 20 Q42 29 32 28 Q25 27 25 35 Q24 44 14 42 Q2 38 3 24Z" fill="#F8EEDB" stroke="#8E6C3B" stroke-width="2"/>' +
          '<circle cx="13" cy="16" r="4" fill="#E96D71"/><circle cx="25" cy="12" r="4" fill="#E9B436"/><circle cx="34" cy="20" r="4" fill="#5B9D69"/><circle cx="13" cy="29" r="4" fill="#4A91B7"/>';
      case 'spark':
        return star(21, 21, 17, '#E7B533') + star(21, 21, 8, '#FFF0A1');
      case 'mic':
        return '<g transform="rotate(-20 22 24)"><rect x="18" y="19" width="9" height="26" rx="4" fill="#4C4D53"/><circle cx="22.5" cy="16" r="10" fill="#777A82"/>' +
          '<path d="M16 12 H29 M14 17 H31 M17 21 H28" stroke="#B8BCC0" stroke-width="1.7"/></g>';
      default: return '';
    }
  }

  var PROP_POS = {
    chess: [18, 136, 1], flask: [151, 130, .92], trophy: [150, 126, .9], plane: [151, 16, .95],
    staff: [13, 72, 1], flower: [150, 128, .95], heart: [153, 34, .82], leaf: [151, 124, .92],
    clipboard: [17, 129, .9], medbag: [18, 134, .9], megaphone: [147, 104, .92], cake: [147, 113, .92],
    wrench: [16, 127, .95], palette: [148, 129, .92], spark: [157, 32, .75], mic: [18, 121, .95]
  };

  function prop(kind, p) {
    var at = PROP_POS[kind];
    if (!at) return '';
    return '<g transform="translate(' + at[0] + ' ' + at[1] + ') scale(' + at[2] + ')">' + propArt(kind, p) + '</g>';
  }

  function arms(fur, p, pose) {
    var paw = shade(fur.base, 1.04);
    var edge = shade(fur.base, .72);
    var left = poly('74,113 63,116 48,139 54,150 68,136 82,123', p.main) +
      poly('48,139 43,146 51,154 59,147', paw, ' stroke="' + edge + '" stroke-width="2"');
    var right;
    if (pose === 'wave') {
      right = poly('118,114 130,108 146,93 153,76 162,80 158,100 135,125', shade(p.main, 1.07)) +
        poly('153,76 153,68 162,65 168,74 162,85', paw, ' stroke="' + edge + '" stroke-width="2"') +
        '<path d="M158 70 L156 62 M162 71 L165 63" stroke="' + edge + '" stroke-width="1.8" stroke-linecap="round"/>';
    } else {
      right = poly('118,114 130,116 145,139 139,151 124,136 112,123', shade(p.main, 1.07)) +
        poly('145,139 151,146 143,154 135,147', paw, ' stroke="' + edge + '" stroke-width="2"');
    }
    return '<g>' + left + right + '</g>';
  }

  function feet(fur) {
    var edge = shade(fur.base, .72);
    var left = poly('70,175 94,175 97,186 89,192 69,190 64,184', fur.base, ' stroke="' + edge + '" stroke-width="2"') +
      '<path d="M75 181 L74 188 M84 181 L84 190" stroke="' + edge + '" stroke-width="1.5"/>';
    var right = poly('106,175 130,175 136,184 131,190 111,192 103,186', shade(fur.base, 1.05), ' stroke="' + edge + '" stroke-width="2"') +
      '<path d="M116 181 L116 190 M125 181 L126 188" stroke="' + edge + '" stroke-width="1.5"/>';
    return left + right;
  }

  function tail(fur) {
    var edge = shade(fur.base, .72);
    return '<path d="M127 172 L151 179 L170 166 L176 145 L170 126" fill="none" stroke="' + edge + '" stroke-width="16" stroke-linecap="square" stroke-linejoin="bevel"/>' +
      '<path d="M127 172 L151 179 L170 166 L176 145 L170 126" fill="none" stroke="' + fur.base + '" stroke-width="11" stroke-linecap="square" stroke-linejoin="bevel"/>';
  }

  function decor(code, p) {
    if (code === 'ESFP') return star(174, 58, 5, p.mid) + star(34, 41, 4, p.light);
    if (code === 'ENFP') return star(174, 51, 5, p.mid) + star(31, 61, 4, p.light);
    if (code === 'INFJ') return star(168, 52, 4, p.light) + star(42, 32, 3, p.mid);
    if (code === 'ENTP') return '<path d="M162 74 Q181 84 179 102" fill="none" stroke="' + p.mid + '" stroke-width="3" stroke-linecap="round" opacity=".7"/>';
    return '';
  }

  MEOW.catInner = function (opts) {
    opts = opts || {};
    var code = opts.code || '';
    if (code && opts.vector !== true) {
      var href = opts.asset || MEOW.catAsset(code, opts.transparent);
      return '<image href="' + href + '" xlink:href="' + href + '" x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMid meet"/>';
    }
    var c = CHARACTERS[code] || { family: 'explorer', fur: 'orange', eyes: 'round', wear: '', prop: 'none' };
    var fur = MEOW.getFur(opts.fur || c.fur);
    var p = FAMILY[c.family] || FAMILY.explorer;
    var prefix = (opts.id || 'cat') + '-';
    var propKind = opts.prop === 'none' ? 'none' : (opts.prop || c.prop || 'none');
    var pose = opts.pose || c.pose || 'hold';
    var eyes = opts.eyes || c.eyes || 'round';
    var headKind = opts.acc === 'none' ? 'none' : (opts.head || c.head || 'none');

    var defs = '<defs><clipPath id="' + prefix + 'headClip"><polygon points="54,51 75,32 100,25 126,32 146,51 151,73 143,95 123,109 100,114 77,109 57,95 49,73"/></clipPath></defs>';
    var bg = opts.bg ? '<rect x="2" y="2" width="196" height="196" rx="18" fill="' + p.bg + '"/>' +
      poly('2,128 76,72 198,106 198,198 2,198', '#fff', ' opacity=".28"') : '';

    var sleeve = code ? p : { main: fur.base };
    return defs + bg + '<ellipse cx="101" cy="191" rx="52" ry="6" fill="#2D2930" opacity=".1"/>' + decor(code, p) +
      backLayer(c.back, p) + tail(fur) + bodyBase(fur) + feet(fur) + costume(code, p) + arms(fur, sleeve, pose) +
      prop(propKind, p) + head(fur, prefix, eyes) + headwear(headKind, p);
  };

  MEOW.catSVG = function (opts) {
    opts = opts || {};
    var size = opts.size || 200;
    var o = opts;
    if (size < 96 && !opts.prop) {
      o = {};
      for (var k in opts) if (Object.prototype.hasOwnProperty.call(opts, k)) o[k] = opts[k];
      o.prop = 'none';
    }
    var label = String(opts.label || '猫咪插画').replace(/[<>"&]/g, '');
    return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="' + size + '" height="' + size + '" role="img" aria-label="' + label + '">' + MEOW.catInner(o) + '</svg>';
  };
})();
