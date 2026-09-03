/* MeowBTI bilingual copy. Scoring metadata stays language-independent. */
window.MEOW = window.MEOW || {};

(function () {
  function copy(value) { return JSON.parse(JSON.stringify(value)); }

  var zh = {
    axes: MEOW.AXES.map(function (a) { return copy(a); }),
    traits: MEOW.TRAITS.map(function (t) { return { label: t.label }; }),
    furs: MEOW.FURS.map(function (f) { return { name: f.name }; }),
    questions: MEOW.QUESTIONS.map(function (q) {
      return { q: q.q, hint: q.hint, opts: q.opts.map(function (o) { return o.t; }) };
    }),
    types: copy(MEOW.TYPES),
    guidance: copy(MEOW.TYPE_GUIDANCE),
    archetypes: MEOW.ARCHETYPES.map(function (a) { return { name: a.name, desc: a.desc }; }),
    fallback: copy(MEOW.ARCHETYPE_FALLBACK),
    skills: MEOW.SKILLS.map(function (s) { return s.t; }),
    traitSkills: MEOW.TRAIT_SKILLS.map(function (s) { return s.t; }),
    letterSkills: copy(MEOW.LETTER_SKILLS),
    threats: MEOW.THREATS.map(function (t) { return { cn: t.cn }; })
  };

  var ui = {
    zh: {
      documentTitle: 'MeowBTI · 猫格测试｜给你家猫一张性格身份证',
      metaDescription: 'MeowBTI · 猫格测试：24 道行为观察题，结合四个维度解析你家猫的性格，生成一张猫格身份证。',
      switchLabel: '切换到英文', switchText: 'EN',
      homeTitle: '猫格性格测试', homeSubtitle: '用猫猫方式，读懂它的性格',
      questionMeta: '24 道题', timeMeta: '约 5 分钟', reportMeta: '解锁专属猫格报告', start: '开始测试',
      quizCount: '第 {current} / {total} 题', previous: '← 上一题', quizHint: '按最近两周最常见的行为选择；没见过可以选择跳过',
      retake: '再测一只', saveCard: '保存卡片', allPersonas: '查看所有图鉴', saveHint: '长按卡片也可保存图片',
      back: '← 返回', galleryTitle: '猫格图鉴', footer: '娱乐向猫咪性格测试，不构成医疗或行为学诊断',
      modalLabel: '猫格详情', close: '关闭', generating: '正在生成卡片…', saved: '卡片已保存', savedSvg: '已保存为 SVG（当前浏览器不支持转 PNG）',
      catPronoun: '它', catIllustration: '猫咪插画', rarity: '稀有度', rarityCard: '稀有度 {stars} · 全球约 {rarity}% 的猫', galleryRarity: '稀有度 {rarity}%',
      specialSkills: '特殊技能 / SPECIAL SKILLS',
      pendingArchetype: '待观察猫', pendingArchetypeDesc: '目前没有足够的行为记录，先和它一起生活、观察，再回来完成鉴定。',
      axisStable: '跨场景稳定', axisSteady: '倾向较稳', axisEmerging: '倾向初显', axisMiddle: '接近中线', noObservation: '暂无观察',
      overallStable: '稳定', overallSteady: '较稳', overallEmerging: '轮廓初显', overallWatching: '仍在观察',
      fallbackCore: '先继续记录它在不同日常场景中的常见反应，再确认稳定的性格倾向。',
      fallbackStrength: '目前的观察数量还不足以判断它最稳定的优势。',
      fallbackBlind: '一次偶然行为不能代表它的性格，尤其要区分环境影响和长期习惯。',
      fallbackStress: '留意躲藏、食欲变化、过度舔毛或异常攻击；明显改变应优先咨询兽医。',
      signalEmpty: '目前没有足够的日常观察来区分四个方向。',
      signal: '「{strong}」的表现最稳定；「{soft}」更容易随情境变化。整体判断为{stability}。',
      traitSummary: '{name}最突出的是「{high} {highValue}%」，最低的是「{low} {lowValue}%」——{comment}',
      traitLow: '目前可用的日常观察较少，属性高低暂不作为稳定性格结论。',
      typeLow: '目前可用的日常观察还比较少，先把它在不同场景中的常见反应记录下来，再回来看这份画像。',
      lowTags: ['需要更多观察', '暂不定型', '先记录再判断'],
      reportTitle: '猫格性格解析', observing: ' · 观察中', personalityCore: '性格内核',
      motivation: '行动动力', strengths: '日常优势', misread: '容易误读', stress: '压力信号', deepTitle: '深度行为解读',
      axesTitle: '四个维度上的它', archetypeTitle: '猫咪原型', threatTitle: '危险等级', careTitle: '相处建议', keyPoint: '要点：', careLabel: '相处建议：',
      threatBody: '综合捣蛋、好奇和亲人程度，它的破坏力评分是 {score} / 100（{label}）。{advice}',
      personalityLow: '目前可用的日常观察较少，暂时不适合给出稳定的四维画像。',
      personality: '综合四个维度，{name}{social}，{explore}；{bond}，{rhythm}。{note}',
      personalitySoft: '这段画像已经勾勒出方向，但不同场景下仍可能有变化，建议继续用日常表现来确认。',
      personalityStable: '这是一种基于多种日常场景的倾向描述，不代表固定不变的行为，也不替代兽医或行为学评估。',
      socialE: '愿意主动靠近', socialI: '更习惯保留距离', exploreS: '用具体线索确认安全和兴趣', exploreN: '从变化与新组合中寻找刺激',
      bondF: '关系和情绪会明显影响它的回应', bondT: '边界和实际收益会明显影响它的回应', rhythmJ: '稳定流程是它的安全感来源', rhythmP: '临场变化是它的生活节拍',
      emptyDepth: '暂无足够行为资料，先观察一段时间再判断。',
      deepSocial: '社交场景', deepExplore: '探索场景', deepBond: '关系回应', deepRhythm: '生活节奏',
      deepSocialTail: '它与人和家庭活动的距离，通常由当下的回应密度决定。', deepExploreTail: '它面对物品、路线和变化时，会先确认什么，再决定怎样行动。',
      deepBondTail: '它在需求受阻、边界被碰到或气氛变化时，会优先读取哪类信号。', deepRhythmTail: '它如何安排日常顺序，以及在被打断或临时变化后怎样恢复。'
    },
    en: {
      documentTitle: 'MeowBTI · Cat Personality Test',
      metaDescription: 'Discover your cat persona through 24 everyday behavior questions across four personality dimensions.',
      switchLabel: 'Switch to Chinese', switchText: '中',
      homeTitle: 'CAT PERSONALITY TEST', homeSubtitle: 'Understand their personality, the cat way',
      questionMeta: '24 questions', timeMeta: 'About 5 min', reportMeta: 'Unlock a full persona report', start: 'Start Test',
      quizCount: 'Question {current} of {total}', previous: '← Previous', quizHint: 'Choose the behavior seen most often in the past two weeks; skip anything you have not observed.',
      retake: 'Retake', saveCard: 'Save Card', allPersonas: 'All Personas', saveHint: 'Long-press the card to save the image',
      back: '← Back', galleryTitle: 'Cat Persona Gallery', footer: 'For entertainment only. Not a medical or behavioral diagnosis.',
      modalLabel: 'Cat persona details', close: 'Close', generating: 'Creating your card…', saved: 'Card saved', savedSvg: 'Saved as SVG because this browser cannot export PNG',
      catPronoun: 'it', catIllustration: 'Cat illustration', rarity: 'Rarity', rarityCard: 'Rarity {stars} · About {rarity}% of cats', galleryRarity: 'Rarity {rarity}%',
      specialSkills: 'SPECIAL SKILLS',
      pendingArchetype: 'Still Observing', pendingArchetypeDesc: 'There is not enough behavioral information yet. Keep observing everyday life, then return for another reading.',
      axisStable: 'Consistent across settings', axisSteady: 'Fairly consistent', axisEmerging: 'Pattern emerging', axisMiddle: 'Near the midpoint', noObservation: 'Not observed',
      overallStable: 'stable', overallSteady: 'fairly stable', overallEmerging: 'an emerging outline', overallWatching: 'still developing',
      fallbackCore: 'Keep observing its usual responses across different everyday settings before treating any tendency as stable.',
      fallbackStrength: 'There is not enough behavioral coverage yet to identify its most reliable strengths.',
      fallbackBlind: 'One isolated behavior does not define a personality. Separate temporary environmental effects from lasting habits.',
      fallbackStress: 'Watch for hiding, appetite changes, overgrooming, or unusual aggression. A clear behavioral change should be discussed with a veterinarian.',
      signalEmpty: 'There is not enough everyday observation yet to distinguish the four dimensions.',
      signal: '“{strong}” is the most consistent dimension, while “{soft}” changes more with context. Overall, this reading is {stability}.',
      traitSummary: '{name} scores highest in “{high}” at {highValue}% and lowest in “{low}” at {lowValue}% — {comment}',
      traitLow: 'There is not enough everyday observation to treat the highest or lowest attribute as a stable trait.',
      typeLow: 'There is not enough everyday observation yet. Keep noting its usual responses across different settings, then return to this profile.',
      lowTags: ['More observation needed', 'Not fixed yet', 'Observe before labeling'],
      reportTitle: 'Cat Persona Analysis', observing: ' · Still Observing', personalityCore: 'Personality Core',
      motivation: 'What Drives It', strengths: 'Everyday Strengths', misread: 'Easy to Misread', stress: 'Stress Signals', deepTitle: 'Deep Behavior Reading',
      axesTitle: 'Its Four Dimensions', archetypeTitle: 'Cat Archetype', threatTitle: 'Mischief Level', careTitle: 'How to Live Together', keyPoint: 'Key point: ', careLabel: 'Care advice: ',
      threatBody: 'Based on mischief, curiosity, affection, and independence, its disruption score is {score} / 100 ({label}). {advice}',
      personalityLow: 'There is not enough everyday observation yet for a stable four-dimension profile.',
      personality: 'Across all four dimensions, {name} {social}, {explore}; {bond}, and {rhythm}. {note}',
      personalitySoft: 'The outline is visible, but behavior may still shift across settings. Keep using everyday patterns to confirm it.',
      personalityStable: 'This is a tendency profile based on multiple everyday settings. It is not fixed, and it does not replace veterinary or behavioral assessment.',
      socialE: 'tends to approach proactively', socialI: 'usually keeps more distance', exploreS: 'uses concrete clues to check safety and interest', exploreN: 'looks for stimulation in change and new combinations',
      bondF: 'lets relationships and emotional cues shape its response', bondT: 'lets boundaries and practical outcomes shape its response', rhythmJ: 'uses stable routines as a source of safety', rhythmP: 'lets the current situation set its pace',
      emptyDepth: 'There is not enough behavior to interpret yet. Observe for a while before drawing a conclusion.',
      deepSocial: 'Social Settings', deepExplore: 'Exploration', deepBond: 'Relationship Response', deepRhythm: 'Daily Rhythm',
      deepSocialTail: 'Its distance from people and household activity often depends on how much response is available in the moment.', deepExploreTail: 'This shapes what it checks first when facing objects, routes, and change.',
      deepBondTail: 'This shapes which signals it prioritizes when a need is blocked, a boundary is touched, or the atmosphere changes.', deepRhythmTail: 'This shapes how it organizes daily activities and recovers after interruption or sudden change.'
    }
  };

  var english = {
    axes: [
      { title: 'Social Energy', posName: 'Social Charger', negName: 'Solo Recharger', posDesc: 'People add energy; visitors are an event', negDesc: 'Social energy is limited and carefully budgeted' },
      { title: 'Exploration Style', posName: 'Clue Tester', negName: 'Possibility Seeker', posDesc: 'Smell, touch, and test what is actually there', negDesc: 'Drawn to change, combinations, and unexpected uses' },
      { title: 'Interaction Response', posName: 'Boundary Evaluator', negName: 'Emotional Connector', posDesc: 'Checks boundaries and outcomes before cooperating', negDesc: 'Adjusts distance in response to people and mood' },
      { title: 'Daily Rhythm', posName: 'Living Clock', negName: 'Randomizer', posDesc: 'Routine runs on a very precise internal clock', negDesc: 'Today’s plan is to have no fixed plan' }
    ],
    traits: [{ label: 'Social' }, { label: 'Independence' }, { label: 'Curiosity' }, { label: 'Mischief' }, { label: 'Affection' }],
    furs: [{ name: 'Orange' }, { name: 'Tabby' }, { name: 'Calico' }, { name: 'Tuxedo' }, { name: 'Black' }, { name: 'White' }, { name: 'Ragdoll' }, { name: 'Blue' }],
    questions: [
      { q: 'A stranger visits your home. What does your cat do first?', hint: 'The first social checkpoint', opts: ['Rushes over to sniff shoes and rub against their legs', 'Watches from a distance, then approaches once it feels safe', 'Disappears instantly and only returns much later', 'Observes from the doorway and approaches after things quiet down', 'Haven’t seen this / Not sure — skip'] },
      { q: 'When you are focused on work, study, or a show, where is your cat?', hint: 'Preferred social distance', opts: ['On the keyboard or directly in front of the screen', 'In the same room, about a meter away, supervising', 'Sleeping in the next room, with an occasional check-in', 'Nowhere to be found until mealtime', 'Haven’t seen this / Not sure — skip'] },
      { q: 'The moment you or a family member comes home, what does it do?', hint: 'Starting interaction', opts: ['Already waiting by the door, ready to rub and meow', 'Comes out after hearing you and follows once it recognizes you', 'Looks up to confirm, then stays where it is', 'Stays hidden until it decides it wants to see you', 'Haven’t seen this / Not sure — skip'] },
      { q: 'After a play or interaction session ends, what usually happens?', hint: 'Recharging after social time', opts: ['Brings the toy back and asks for another round', 'Stays in the same room to play alone or rest beside you', 'Rests in a familiar nearby spot where it can still see you', 'Retreats to a quiet corner and needs time alone', 'Haven’t seen this / Not sure — skip'] },
      { q: 'Several familiar people are talking or moving around at home. What does it do?', hint: 'Participation in a familiar group', opts: ['Stays at the center and moves between everyone', 'Remains in the same space and joins a few moments', 'Observes from the edge of the room or a high spot', 'Moves to a quieter room and returns after people disperse', 'Haven’t seen this / Not sure — skip'] },
      { q: 'When the house is quiet and nobody approaches it, how does it begin the next interaction?', hint: 'Initiating or waiting', opts: ['Brings a toy, taps you, or calls you directly', 'Comes nearby and tests for a response with looks or small gestures', 'Responds only when you happen to pass its territory', 'Continues its own activity and rarely seeks people out', 'Haven’t seen this / Not sure — skip'] },
      { q: 'An empty cardboard box appears on the floor. What does it do?', hint: 'Concrete clues or invented possibilities', opts: ['Smells, steps on, and enters it to test size and texture', 'Checks the entrance and stability before deciding to enter', 'Pushes or flips it to create a new game', 'Checks whether it can combine the box with nearby objects', 'Haven’t seen this / Not sure — skip'] },
      { q: 'With a familiar toy, what kind of player is it?', hint: 'The target or the changing pattern', opts: ['Needs to see and catch the physical target', 'Remembers the movement path and waits in the best spot', 'Prefers reflections, shadows, and constantly changing movement', 'Loses interest quickly and follows a different stimulus', 'Haven’t seen this / Not sure — skip'] },
      { q: 'A faint sound or small shift of light appears in the room. What does it do?', hint: 'Locating a source or following change', opts: ['Locates the exact source before moving closer', 'Watches the source area and waits for it to happen again', 'Tracks the changing pattern as if following an invisible route', 'Links it to something else and explores another area', 'Haven’t seen this / Not sure — skip'] },
      { q: 'How does it explore a new toy or household object?', hint: 'How it uses something new', opts: ['Smells and touches it, then uses it as intended', 'Observes until it feels safe, then uses a familiar method', 'Immediately turns it into a route, hideout, or puzzle', 'Combines it with old toys or furniture to create a new use', 'Haven’t seen this / Not sure — skip'] },
      { q: 'A treat is hidden in a simple food puzzle. What method does it use?', hint: 'Solving a concrete mechanism', opts: ['Follows scent and openings until it can reach the treat', 'Checks each part in order and remembers what moves the treat', 'Keeps changing angles and actions to invent an unintended solution', 'Uses the floor, corner, or other objects to create another route', 'Haven’t seen this / Not sure — skip'] },
      { q: 'A familiar route is suddenly blocked by an object. What does it do?', hint: 'Approaching a spatial problem', opts: ['Checks distance, gaps, and footholds before going around', 'Waits near the route and uses a detour it already knows', 'Jumps, squeezes, pushes, or climbs to create a new route', 'Follows the change into a completely different area', 'Haven’t seen this / Not sure — skip'] },
      { q: 'Your voice and mood are noticeably different today. How does it respond?', hint: 'Reading emotional cues', opts: ['Approaches and adjusts its distance to stay with you', 'Observes nearby and approaches if you seem to need company', 'Continues as usual unless the daily routine changes', 'Ignores the mood and keeps pursuing what it wants', 'Haven’t seen this / Not sure — skip'] },
      { q: 'You touch a disliked spot or need to trim its nails. What does it do?', hint: 'Boundaries and trust', opts: ['Reads your tone and cooperates briefly when it trusts you', 'Refuses clearly, then returns later to reconnect', 'Follows its own boundary regardless of your reason', 'Studies the process and waits for a chance to escape or counter', 'Haven’t seen this / Not sure — skip'] },
      { q: 'What works best when you need it to stop doing something?', hint: 'Responding to relationship or rules', opts: ['A gentle call, petting, or switching activities together', 'A familiar reward and interaction that redirects it', 'Only a clear and consistent boundary works', 'It tests the consequences and continues if nobody follows through', 'Haven’t seen this / Not sure — skip'] },
      { q: 'Something it wants is temporarily unavailable. What does it do?', hint: 'Seeking connection or solving the problem', opts: ['Comes to you and communicates with sounds, looks, or rubbing', 'Waits nearby and occasionally reminds you', 'Assesses alternatives and chooses another workable target', 'Tests the obstacle until it can get the item while you are distracted', 'Haven’t seen this / Not sure — skip'] },
      { q: 'You accidentally hurt or startle it, then soften your voice and make peace. What happens?', hint: 'Repairing trust after a scare', opts: ['Reads your tone and quickly returns to sniff or approach', 'Keeps some distance, then reconnects once you are gentle', 'Rejects the repair until its physical boundary feels safe again', 'Moves away or finds an exit to prevent the situation recurring', 'Haven’t seen this / Not sure — skip'] },
      { q: 'Its favorite spot is occupied by a bag, clothing, or another object. What does it do?', hint: 'Relationship or boundaries when a resource is blocked', opts: ['Calls, looks, or rubs until you clear the spot', 'Waits nearby and quietly tries to get your attention', 'Assesses the area and chooses a similar alternative spot', 'Steps on, pulls aside, or pushes away the obstacle', 'Haven’t seen this / Not sure — skip'] },
      { q: 'How does it behave around mealtime?', hint: 'Internal clock precision', opts: ['Arrives within five minutes of the usual time to remind you', 'Has a rough schedule but calls when hungry', 'Eats at seemingly random times', 'Requests snacks all day with no sense of schedule', 'Haven’t seen this / Not sure — skip'] },
      { q: 'Where does it usually sleep?', hint: 'Fixed base or changing locations', opts: ['Always in one place and rarely changes', 'Rotates between two or three regular spots', 'Chooses a completely different surprise location each day', 'Sleeps only on the newest or most expensive thing', 'Haven’t seen this / Not sure — skip'] },
      { q: 'At similar times during the week, what does it usually do?', hint: 'How fixed its behavioral rhythm is', opts: ['Repeats almost the same routine at the same time', 'Has a general rhythm with small daily shifts', 'Switches to a different activity as if randomly refreshed', 'Lets the nearest sound, light, or toy decide what happens next', 'Haven’t seen this / Not sure — skip'] },
      { q: 'A normally fixed part of home life suddenly changes. What does it do?', hint: 'Responding to a change of plan', opts: ['Waits at the original time and place until the routine returns', 'Reminds you but accepts a small delay or adjustment', 'Immediately adapts to the new time, bowl, or location', 'Changes its plan and does something else before returning', 'Haven’t seen this / Not sure — skip'] },
      { q: 'After waking up, how consistent is the order of its activities?', hint: 'Whether daily sequences stay fixed', opts: ['Stretching, drinking, patrolling, and greeting happen in the same order', 'The same few activities recur, with occasional changes in order', 'It starts with whatever is most interesting that day', 'It switches among activities without completing a fixed sequence', 'Haven’t seen this / Not sure — skip'] },
      { q: 'It is interrupted while playing, patrolling, or eating. What happens next?', hint: 'Organizing behavior after interruption', opts: ['Handles the interruption, then returns to finish the original task', 'Leaves temporarily but usually resumes the original task later', 'Immediately follows the new event and abandons the old activity', 'Moves repeatedly between several targets', 'Haven’t seen this / Not sure — skip'] }
    ]
  };

  english.types = {
    INFP: { name: 'Poet Meow', tags: ['Slow to warm up', 'Empathetic', 'Spontaneous'], desc: 'This cat is sensitive to its surroundings, sounds, and human emotion. It rarely rushes into activity, preferring to observe from a safe distance first. Once comfortable, it shows trust through quiet company, gentle approaches, and short interactions, while its interests and routines still follow the mood of the moment.', care: 'Offer a reliable retreat and low-pressure ways to connect, such as a quiet corner, short play sessions, and interactions it can end on its own. Do not treat withdrawal as rejection; trust grows faster when it is allowed to return by choice.' },
    INFJ: { name: 'Insight Meow', tags: ['Perceptive', 'Reserved', 'Deep connection'], desc: 'This cat reads the room before deciding whether to engage. It notices changes in voices, scents, routes, and household rhythm, remaining reserved with strangers while giving steady attention to a trusted few. Affection is often quiet: remembering habits, staying nearby, and noticing when something feels different.', care: 'Provide a high observation point, a quiet resting area, and predictable one-on-one time. During prolonged noise or tension, restore a safe route and a sense of control before expecting interaction.' },
    INTJ: { name: 'Mastermind Meow', tags: ['Strategic', 'Goal-driven', 'Efficient'], desc: 'This cat studies routes, resources, and likely outcomes before acting. Faced with a door gap, cabinet, or puzzle, it tests which method reaches the goal with the least effort and rarely needs applause afterward. Independence is not distance; it is a preference for controlling pace and solving problems alone.', care: 'Offer structured challenges with a clear finish, such as layered food puzzles and safe mechanisms. Keep rules few and consistent, and protect uninterrupted focus instead of turning every exploration into a prohibition.' },
    INTP: { name: 'Lab Meow', tags: ['Experimental', 'Focused', 'Brainy'], desc: 'A new problem can absorb this cat completely: why a box works, where a sound comes from, or how a toy can be used differently. It may ignore calls while focused because attention is elsewhere, not because it is deliberately dismissive. Once a system feels understood, it quickly searches for the next subject worth studying.', care: 'Provide safe toys that can be examined, combined, and rotated. Interrupt less and observe what it is testing; an old toy often becomes interesting again after some time away.' },
    ISFP: { name: 'Chill Meow', tags: ['Sensory', 'Easygoing', 'Aesthetic'], desc: 'This cat considers scent, texture, light, and physical comfort before choosing where to rest, whom to approach, or how long to play. It rarely competes for attention and dislikes being pushed by a rigid schedule, yet it has clear preferences about space and touch. Its gentleness is responsive and subtle rather than constantly clingy.', care: 'Offer several soft, sunny resting spots with easy exits and let it choose the distance. Introduce touch, movement, and new objects gradually, following its body language before continuing.' },
    ISFJ: { name: 'Care Meow', tags: ['Supportive', 'Reliable', 'Routine-loving'], desc: 'This cat remembers familiar people, locations, and daily steps, expressing trust by staying nearby over time. It may not create much noise, but it appears when you move, return home, or change the routine. Stability is not boredom for this cat; it is how life stays safe and predictable.', care: 'Keep feeding, litter, rest, and greeting routines consistent. When change is necessary, introduce it in stages and preserve familiar scents so the new arrangement still feels connected to the old one.' },
    ISTP: { name: 'Maker Meow', tags: ['Hands-on', 'Independent', 'Adaptable'], desc: 'This cat prefers to take a problem apart, test the boundary, and find a method that works. Handles, drawers, fountains, and complex toys can hold its attention, and it often walks away quietly after solving them. Affection may appear as working beside you or cooperating in practical moments rather than obvious cuddling.', care: 'Provide safe hands-on challenges and repeatable food puzzles while physically securing wires, cabinets, and risky heights. Let it finish a small experiment before redirecting it with a short interaction.' },
    ISTJ: { name: 'Orderly Meow', tags: ['Structured', 'Punctual', 'Predictable'], desc: 'This cat builds safety through time, place, and repeated sequences. Meals, sleep, and patrol routes often follow a clear pattern, and it notices when a bowl moves or a door opens late. Reliability comes from predictability and follow-through, not simple stubbornness.', care: 'Keep essential resources in consistent locations and introduce necessary changes gradually. Clear, repeatable responses reduce the need to patrol, remind, or protest.' },
    ESFP: { name: 'Vibe Meow', tags: ['Expressive', 'Playful', 'Instant feedback'], desc: 'This cat gains energy from immediate reactions, sound, and movement, becoming especially expressive when someone is watching. It greets, initiates play, and performs new behaviors while adjusting quickly to your response. Its enthusiasm is not constant excitement; it is a desire to be seen and answered.', care: 'Use several short, clearly finished play sessions and respond promptly to healthy bids for attention. Give a consistent closing cue so it does not need to create bigger commotion to restart the interaction.' },
    ESFJ: { name: 'Sweetheart Meow', tags: ['Warm', 'Responsive', 'Ritual-loving'], desc: 'This cat cares about continuity in relationships and turns greetings, meals, companionship, and bedtime into small rituals. When you sit down, feel different, or welcome visitors, it often checks whether everyone is still connected. Affection is direct and consistent, expressed through following, checking in, and reminders.', care: 'Keep familiar greeting, goodbye, and companionship rituals while providing a quiet place to opt out. If following becomes frequent, check for a sudden loss of company and restore security through routine.' },
    ESTP: { name: 'Action Meow', tags: ['Active', 'Daring', 'In the moment'], desc: 'This cat tends to move first and adjust from immediate feedback. A target invites a pounce, a new route invites a test, and one failed attempt quickly becomes another approach. Its energy needs an outlet, but fast action does not mean there is no judgment behind it.', care: 'Provide high-intensity games with a clear beginning and end, and secure windows, wires, and fragile objects in advance. Use short, consistent boundary cues rather than long correction during peak excitement.' },
    ESTJ: { name: 'Manager Meow', tags: ['Organized', 'Clear', 'Gets things done'], desc: 'This cat monitors whether time, resources, and household boundaries are running as expected. Meal, door, and play reminders are direct, and once a routine is learned it expects consistent follow-through. Managing the house is often about getting a clear outcome, not controlling everyone for its own sake.', care: 'Turn feeding, play, and access needs into clear routines used consistently by the whole household. Small jobs and unambiguous finish cues can transform demanding reminders into cooperation.' },
    ENFP: { name: 'Adventure Meow', tags: ['Curious', 'Energetic', 'Imaginative'], desc: 'This cat stays energized through people and novelty, quickly trying new objects and extending one game into another. It is enthusiastic and adaptable, but attention can move rapidly with a new sound, scent, or target. Curiosity works best when guided rather than reduced to a constant “no.”', care: 'Rotate toys, routes, and interaction themes so old objects regain novelty. Offer only a few safe targets at once and close each game clearly to reduce restless stimulus-seeking.' },
    ENFJ: { name: 'Harmony Meow', tags: ['Attentive', 'Empathetic', 'Organizing'], desc: 'This cat tracks the emotions and activities of the household and often approaches anyone who seems left out or unsettled. During conversation or tension it may step in, host, or pull everyone back into one shared space. Sociability here is not just excitement; it includes coordinating and caring for the group.', care: 'Offer regular group interaction and a private retreat so it does not carry the pressure of managing every mood. During prolonged conflict or noise, reduce stimulation and restore a safe area before resuming interaction.' },
    ENTP: { name: 'Breakthrough Meow', tags: ['Problem-solving', 'Clever', 'Boundary-testing'], desc: 'This cat treats rules, obstacles, and human reactions as puzzles that can be tested repeatedly. When one route closes, it changes angle, tool, or timing until it discovers a loophole. Mischief usually has an experimental goal; what it needs is challenge with a clear boundary.', care: 'Create a safe area for pushing, pulling, combining, and taking things apart, while making dangerous boundaries physically secure. Keep rules few and consistent, and refresh challenges before it invents a riskier project.' },
    ENTJ: { name: 'Captain Meow', tags: ['Commanding', 'Goal-driven', 'In control'], desc: 'This cat identifies resources, positions, and control points before directly pursuing the desired result. High places, sofas, food, and your lap may all become part of its territory plan, and requests are usually unmistakable. Strength does not mean a lack of affection; trust is often expressed through ownership, direction, and decisive action.', care: 'Provide several high places, rest areas, and resource points so it has meaningful choices. Keep boundaries firm without turning them into repeated contests; a planned alternative is easier to accept than a last-minute removal.' }
  };

  english.guidance = {
    INFP: { core: 'Protects emotional and physical safety first, then approaches through low-pressure contact.', strengths: 'Notices subtle environmental and emotional shifts and offers quiet, measured company.', blind: 'Quietness is not a lack of affection, and refusing touch is not a lack of trust.', stress: 'Noise, forced contact, or disrupted safety cues may lead to hiding and reduced interaction.' },
    INFJ: { core: 'Reads the overall atmosphere before investing steady attention in a trusted few.', strengths: 'Remembers routes and routines closely and often detects environmental change early.', blind: 'Selective closeness is not coldness; it needs to understand the person and setting first.', stress: 'Ongoing noise, household tension, or blocked escape routes may increase vigilance and withdrawal.' },
    INTJ: { core: 'Treats the environment as a system to plan and optimize before acting.', strengths: 'Finds efficient paths, learns consistent rules quickly, and persists toward clear outcomes.', blind: 'Opening cabinets or moving objects may be method testing rather than random destruction.', stress: 'Too little challenge or inconsistent rules can lead it to create problems for stimulation and control.' },
    INTP: { core: 'Is drawn to researchable objects and problems, tuning out the room while focused.', strengths: 'Explores patiently and discovers unexpected uses for ordinary objects.', blind: 'A slow response does not mean it cannot hear; its attention may simply be elsewhere.', stress: 'Repetition and frequent interruption can rapidly reduce interest or redirect it into mischief.' },
    ISFP: { core: 'Lets scent, texture, light, and immediate comfort guide everyday choices.', strengths: 'Reads physical boundaries and spatial comfort with unusual sensitivity.', blind: 'Ignoring a schedule is not defiance; current comfort matters more than the clock.', stress: 'Harsh light, unfamiliar textures, and forced interaction may trigger a fast retreat.' },
    ISFJ: { core: 'Builds safety from familiar people, places, and steps, then stays reliably nearby.', strengths: 'Remembers care routines and household rhythms and offers consistent companionship.', blind: 'Waiting at the door or staying nearby can be an active expression of attachment.', stress: 'Sudden changes to food, supplies, location, or company may create repeated checking and anxiety.' },
    ISTP: { core: 'Tests a boundary independently, solves the practical problem, then returns to its own pace.', strengths: 'Adapts quickly and finds workable alternatives without needing much guidance.', blind: 'Solitude and limited cuddling do not mean weak attachment; action often carries the message.', stress: 'Constant interference or no safe outlet for exploration can lead to secret cabinet-opening or wire-chewing.' },
    ISTJ: { core: 'Maintains security through concrete, stable, and predictable daily sequences.', strengths: 'Offers consistent habits that make care needs easy to observe and support.', blind: 'Sensitivity to a moved bowl or changed route protects familiar cues; it is not mere stubbornness.', stress: 'Abrupt changes and unclear resource locations may trigger reminders, refusal, or repeated patrols.' },
    ESFP: { core: 'Draws energy from real-time interaction and shares excitement through immediate behavior.', strengths: 'Responds quickly, engages proactively, and can lift the household atmosphere.', blind: 'Big gestures are often communication, not deliberate troublemaking.', stress: 'Long periods without feedback can increase vocalization and attention-seeking activity.' },
    ESFJ: { core: 'Places connection, companionship, and familiar interaction rituals at the center of daily life.', strengths: 'Responds to emotion and builds stable greeting, goodbye, and care routines.', blind: 'Clinginess does not equal helplessness; shared rhythm may simply matter deeply.', stress: 'A sudden loss of company or unusual household atmosphere may cause frequent calling and following.' },
    ESTP: { core: 'Acts first, then adjusts quickly from what happens in the moment.', strengths: 'Combines speed, physical confidence, and fast learning in new routes and games.', blind: 'Impulsiveness does not mean poor learning; this cat learns through action.', stress: 'Unused physical and exploration energy may become ankle-pouncing, chasing, or nighttime activity.' },
    ESTJ: { core: 'Actively organizes time, resources, and boundaries so household events happen predictably.', strengths: 'Communicates needs clearly and learns when expected events should occur.', blind: 'Meal, door, and play reminders are management signals, not random temper.', stress: 'Inconsistent rules, long waits, and blocked resources may lead to persistent pressure.' },
    ENFP: { core: 'Uses people and fresh change to stay energized, extending one interest into the next.', strengths: 'Curious, enthusiastic, and quick to adapt to new corners and activities.', blind: 'Short-lived interests do not mean poor memory; novelty is part of the reward.', stress: 'A flat environment or interrupted interaction may trigger restless searching for another target.' },
    ENFJ: { core: 'Tracks household mood and activity, often pulling people and spaces back together.', strengths: 'Supports relationships and provides proximity or comfort when tension rises.', blind: 'Joining your activity may be a safety check for the group rather than attention-stealing.', stress: 'Ongoing conflict, noise, or separation from family may cause over-monitoring and agitation.' },
    ENTP: { core: 'Treats rules, obstacles, and human reactions as puzzles worth repeated testing.', strengths: 'Generates new solutions quickly and learns loopholes with impressive speed.', blind: 'Destructive-looking behavior often has a goal or feedback loop behind it.', stress: 'Too many restrictions without an alternative challenge may escalate pushing, stealing, or dismantling.' },
    ENTJ: { core: 'Identifies resources and control points, then converts a goal into direct action.', strengths: 'Maintains strong goals, clear territory boundaries, and persistent plans.', blind: 'Direct demands and confident posture do not mean a lack of affection.', stress: 'Resource scarcity, invaded boundaries, or vague rules may produce blocking, occupation, and strong warnings.' }
  };

  english.archetypes = [
    { name: '3 A.M. Parkour Champion', desc: 'Completes a full-house race while every human is asleep.' },
    { name: 'Cardboard Architect', desc: 'Every box is an unfinished property waiting for renovation.' },
    { name: 'Gravity Researcher', desc: 'Runs long-term experiments on what happens when objects leave a table.' },
    { name: 'Human Training Expert', desc: 'Has successfully placed at least one human on its preferred schedule.' },
    { name: 'Snack Alarm System', desc: 'Detects bags, cans, and refrigerator doors faster than physics allows.' },
    { name: 'Tabletop Tactical Unit', desc: 'Specializes in the half-second window when a human looks away.' },
    { name: 'Window Philosopher', desc: 'Spends hours considering the meaning of the bird downstairs.' },
    { name: 'Paranormal Observer', desc: 'Visible objects cannot fully explain where it is looking.' },
    { name: 'Luxury Item Appraiser', desc: 'Finds the most expensive object in the room and sits on it.' },
    { name: 'Mystery Sleep Specialist', desc: 'Today’s sleeping location is randomly generated and impossible to predict.' },
    { name: 'Door Greeter', desc: 'The only household job performed on time in every kind of weather.' },
    { name: 'Living Alarm Clock', desc: 'More accurate than your phone alarm and impossible to snooze.' },
    { name: 'Mood Therapist', desc: 'Often notices that you are unhappy before you do.' },
    { name: 'Midnight Watcher', desc: 'Runs a scheduled observation of sleeping humans.' },
    { name: 'Grudge Archivist', desc: 'Keeps a complete record of tail-stepping incidents for 72 hours.' },
    { name: 'Existential Researcher', desc: 'Extracts far more meaning from a box than its volume should allow.' },
    { name: 'Snack Negotiator', desc: 'Every principle can be reopened at the right price.' }
  ];
  english.fallback = {
    chaos: { name: 'Chaos Generator', desc: 'The source of every household “How did that happen?”' },
    love: { name: 'Professional Cuddler', desc: 'Its main business is attachment; purring is the side job.' },
    indep: { name: 'Independent Living Artist', desc: 'Turns alone time into an enviable lifestyle.' },
    curio: { name: 'Home Inspector', desc: 'Every new object requires a full nose-based inspection.' },
    social: { name: 'Household Social Center', desc: 'Every lively event includes this cat.' }
  };
  english.skills = [
    '3:17 A.M. full-house parkour', 'Precision tabletop gravity testing', 'Instant cardboard-box assembly',
    'Snack-bag detection in 0.3 seconds', 'Food transfer during human distraction', 'Internal clock accurate to ±5 minutes',
    'Predicts the door lock three seconds early', 'Conducts deep conversations with empty air', 'Two-hour window surveillance without blinking',
    'Stores grudge records for 72 hours', 'Automatic low-mood detection radar', 'Identifies and occupies the most expensive object',
    'Sleeps where physics says it should be impossible', 'Scheduled midnight human observation', 'Trades cooperation for exactly two treats',
    'Performs twice-daily landlord patrols', 'Long-term philosophical analysis of a cardboard box'
  ];
  english.traitSkills = [
    'Pretends not to hear its own name', 'Makes biscuits through a blanket', 'Inspects any new object within five seconds',
    'Plans and reroutes household destruction in real time', 'Speed-runs friendship with strangers',
    'Steps on the Enter key at exactly the right moment', 'Arrives within three seconds of you sitting down'
  ];
  english.letterSkills = {
    E: 'Inspects every visitor’s shoes', I: 'Activates invisibility in an impossible corner', S: 'Finds the snack cabinet with eyes closed',
    N: 'Tracks objects that no human can see', T: 'Makes humans reconsider a decision with one look', F: 'Tunes purring to match your mood',
    J: 'Runs every day on a strict schedule', P: 'Generates an unpredictable daily behavior plan'
  };
  english.threats = [{ cn: 'Harmless Softie' }, { cn: 'Occasional Accident' }, { cn: 'Needs Supervision' }, { cn: 'High-Risk Mischief' }, { cn: 'Pure Chaos' }];

  function assignTexts(pack) {
    MEOW.AXES.forEach(function (a, i) { Object.assign(a, pack.axes[i]); });
    MEOW.TRAITS.forEach(function (t, i) { t.label = pack.traits[i].label; });
    MEOW.FURS.forEach(function (f, i) { f.name = pack.furs[i].name; });
    MEOW.QUESTIONS.forEach(function (q, i) {
      q.q = pack.questions[i].q; q.hint = pack.questions[i].hint;
      q.opts.forEach(function (o, k) { o.t = pack.questions[i].opts[k]; });
    });
    Object.keys(MEOW.TYPES).forEach(function (code) {
      var source = pack.types[code];
      ['name', 'tags', 'desc', 'care'].forEach(function (key) { MEOW.TYPES[code][key] = copy(source[key]); });
    });
    Object.keys(MEOW.TYPE_GUIDANCE).forEach(function (code) { Object.assign(MEOW.TYPE_GUIDANCE[code], pack.guidance[code]); });
    MEOW.ARCHETYPES.forEach(function (a, i) { Object.assign(a, pack.archetypes[i]); });
    Object.keys(MEOW.ARCHETYPE_FALLBACK).forEach(function (key) { Object.assign(MEOW.ARCHETYPE_FALLBACK[key], pack.fallback[key]); });
    MEOW.SKILLS.forEach(function (s, i) { s.t = pack.skills[i]; });
    MEOW.TRAIT_SKILLS.forEach(function (s, i) { s.t = pack.traitSkills[i]; });
    Object.keys(MEOW.LETTER_SKILLS).forEach(function (key) { MEOW.LETTER_SKILLS[key] = pack.letterSkills[key]; });
    MEOW.THREATS.forEach(function (t, i) { t.cn = pack.threats[i].cn; });
  }

  MEOW.lang = 'zh';
  MEOW.t = function (key, values) {
    var value = (ui[MEOW.lang] && ui[MEOW.lang][key]) || ui.zh[key] || key;
    if (Array.isArray(value)) return value.slice();
    Object.keys(values || {}).forEach(function (name) { value = value.replace(new RegExp('\\{' + name + '\\}', 'g'), values[name]); });
    return value;
  };
  MEOW.setLanguage = function (lang) {
    MEOW.lang = lang === 'en' ? 'en' : 'zh';
    assignTexts(MEOW.lang === 'en' ? english : zh);
    return MEOW.lang;
  };
})();
