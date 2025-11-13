(function(){
  const QUESTIONS = [
    {
      t: "Когда ты получаешь новую задачу, что делаешь первым делом?",
      a: [
        {t:"Пробую сразу — вдруг получится «само».", l:1},
        {t:"Смотрю, как это делают «свои»/коллеги.", l:2},
        {t:"Быстро составляю план действий.", l:3},
        {t:"Фиксирую правила и роли (кто что делает).", l:4},
      ]
    },
    {
      t: "Когда правила мешают делу, я…",
      a: [
        {t:"Беру ответственность и действую по ситуации.", l:5},
        {t:"Строю логическую модель и ищу доказательства.", l:6},
        {t:"Предлагаю парадоксальный ход.", l:7},
        {t:"Ищу согласование всех сторон.", l:8},
      ]
    },
    {
      t: "Если коллега не согласен со мной, то…",
      a: [
        {t:"Апеллирую к «справедливости/здравому смыслу».", l:2},
        {t:"Показываю на конкретном примере/результате.", l:3},
        {t:"Излагаю систему аргументов с причинно-следственными связями.", l:6},
        {t:"Собираю позицию, приемлемую для всех.", l:8},
      ]
    },
    {
      t: "Что для тебя важнее всего в работе?",
      a: [
        {t:"Доверять интуиции и не мешать потоку.", l:1},
        {t:"Сохранять человеческое/этичное отношение.", l:2},
        {t:"Делать эффективно и вовремя.", l:3},
        {t:"Поддерживать порядок и процедуры.", l:4},
      ]
    },
    {
      t: "В кризисной ситуации ты в первую очередь…",
      a: [
        {t:"Берёшь риск и запускаешь действие.", l:5},
        {t:"Проводишь анализ причин и просчитываешь последствия.", l:6},
        {t:"Ищешь неожиданный поворот.", l:7},
        {t:"Собираешь участников и координируешь их.", l:4},
      ]
    },
    {
      t: "Как тебе проще воспринимать информацию?",
      a: [
        {t:"Короткий текст/инструкция.", l:4},
        {t:"Схема процесса/таблица.", l:6},
        {t:"История/пример из жизни.", l:3},
        {t:"Общий образ/метафора.", l:8},
      ]
    },
    {
      t: "На встречах ты чаще…",
      a: [
        {t:"Говоришь «давайте по-человечески».", l:2},
        {t:"Двигаешь повестку по плану.", l:3},
        {t:"Следишь, чтобы говорили по правилам.", l:4},
        {t:"Сводишь позиции к общему решению.", l:8},
      ]
    },
    {
      t: "Когда учишься новому, ты…",
      a: [
        {t:"Повторяешь за кем-то, пока «не пойдёт».", l:1},
        {t:"Ищешь «своего» учителя/сообщество.", l:2},
        {t:"Разбиваешь на шаги и тренируешь.", l:3},
        {t:"Ищешь принципы/законы за приёмами.", l:6},
    ]
    },
    {
      t: "С каким типом задач тебе приятнее?",
      a: [
        {t:"Где можно импровизировать и рисковать.", l:5},
        {t:"Где важны чёткие роли и порядок.", l:4},
        {t:"Где нужно найти новую идею.", l:7},
        {t:"Где требуется увязать интересы разных систем.", l:8},
      ]
    },
    {
      t: "Как ты проверяешь, что задача решена?",
      a: [
        {t:"«Чувствую, что всё хорошо».", l:1},
        {t:"«Люди довольны, конфликтов нет».", l:2},
        {t:"«Результат получен в срок и по плану».", l:3},
        {t:"«Есть объяснение причин и стабильная процедура».", l:6},
      ]
    },
  ];

  const LEX = {
    1: {name:"уровень 1 — магическое сознание", tip:"Опираешься на интуицию. Для развития — добавляй шаги и простые правила (ур. 3–4)."},
    2: {name:"уровень 2 — этическое сознание", tip:"Важна справедливость и «свои». Для развития — тренируй план и роль (ур. 3–4)."},
    3: {name:"уровень 3 — эстетическое сознание", tip:"Силен в действии и результате. Рост — через ритуал и делегирование (ур. 4)."},
    4: {name:"уровень 4 — ролевое сознание", tip:"Собираешь порядок и процедуры. Рост — брать выбор и риск (ур. 5)."},
    5: {name:"уровень 5 — свободное сознание", tip:"Принимаешь решения и несёшь риск. Рост — систематизировать опыт (ур. 6)."},
    6: {name:"уровень 6 — теоретическое сознание", tip:"Мыслишь причинно и строишь модели. Рост — допускать парадоксы (ур. 7)."},
    7: {name:"уровень 7 — парадоксальное сознание", tip:"Пересобираешь системы. Рост — делать мосты к людям (ур. 4–5)."},
    8: {name:"уровень 8 — универсальное сознание", tip:"Сводишь системы без разрушения. Рост — выбирать, где действовать (ур. 5–6)."},
  };

  let i = 0;
  const votes = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0};
  const sel = new Array(QUESTIONS.length).fill(null);

  const quizEl = document.getElementById('quiz');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const finishBtn = document.getElementById('finishBtn');
  const resultEl = document.getElementById('result');

  function renderQuestion(idx){
    const q = QUESTIONS[idx];
    quizEl.innerHTML = "";
    const box = document.createElement('div');
    box.className = 'q';

    const h2 = document.createElement('h2');
    h2.textContent = `Вопрос ${idx+1} из ${QUESTIONS.length}: ${q.t}`;
    box.appendChild(h2);

    const opts = document.createElement('div');
    opts.className = 'options';

    q.a.forEach((opt, k)=>{
      const id = `q${idx}_a${k}`;
      const div = document.createElement('label');
      div.className = 'opt' + (sel[idx]===k ? ' selected' : '');
      div.setAttribute('for', id);

      const input = document.createElement('input');
      input.type = 'radio'; input.name = `q${idx}`; input.id = id; input.value = String(k);
      if(sel[idx]===k) input.checked = true;

      const tag = document.createElement('div');
      tag.className = 'tag';
      tag.textContent = `→ Уровень ${opt.l}`;

      const p = document.createElement('div');
      p.textContent = opt.t;

      div.appendChild(input);
      div.appendChild(tag);
      div.appendChild(p);
      div.addEventListener('click', ()=>{
        sel[idx] = k;
        Array.from(opts.children).forEach(ch=>ch.classList.remove('selected'));
        div.classList.add('selected');
        nextBtn.disabled = false;
      });
      opts.appendChild(div);
    });

    box.appendChild(opts);
    quizEl.appendChild(box);

    prevBtn.disabled = (idx===0);
    const selected = sel[idx] !== null;
    nextBtn.disabled = !selected;
    nextBtn.style.display = (idx < QUESTIONS.length-1) ? 'inline-block' : 'none';
    finishBtn.style.display = (idx === QUESTIONS.length-1) ? 'inline-block' : 'none';
  }

  function compute(){
    for (let k in votes){ votes[k]=0; }
    sel.forEach((choice, idx)=>{
      if(choice===null) return;
      const lvl = QUESTIONS[idx].a[choice].l;
      votes[lvl]++;
    });
    const entries = Object.entries(votes).map(([k,v])=>({lvl:parseInt(k,10), count: v}));
    entries.sort((a,b)=> b.count - a.count || a.lvl - b.lvl);
    const top = entries[0];
    const left = Math.max(1, top.lvl-1);
    const right = Math.min(8, top.lvl+1);

    const total = sel.filter(x=>x!==null).length;
    const pct = (n)=> total? Math.round(n*100/total):0;

    const pills = entries
      .filter(e=>e.count>0)
      .map(e=>`<span class="badge">L${e.lvl}: ${e.count} (${pct(e.count)}%)</span>`)
      .join(' ');

    const lex = LEX[top.lvl];
    resultEl.innerHTML = `
      <h3>Твой доминирующий уровень: <span style="color:var(--accent)">${lex.name}</span></h3>
      <p>${lex.tip}</p>
      <p><b>Соседние уровни:</b> L${left} и L${right}. Попробуй решить одну задачу в их стиле.</p>
      <div style="margin:10px 0">${pills}</div>
      <hr style="border-color:#243040">
      <p style="color:var(--muted)">Поделись: какой уровень у тебя получился и где это помогло/мешало сегодня?</p>
    `;
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({behavior:'smooth', block:'start'});
  }

  prevBtn.addEventListener('click', ()=>{ if(i>0){ i--; renderQuestion(i); } });
  nextBtn.addEventListener('click', ()=>{ if(i<QUESTIONS.length-1){ i++; renderQuestion(i); } });
  finishBtn.addEventListener('click', ()=>{ compute(); });

  renderQuestion(i);
})();