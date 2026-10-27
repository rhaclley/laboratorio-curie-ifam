(() => {
  'use strict';
  const {objects, timeline, questions, sources, blocks, revision} = window.CURIE;
  const $ = (q) => document.querySelector(q);
  const main = $('#main');
  const modal = $('#modal');
  const KEY = 'laboratorio-curie-v2-blocos';
  const POINTS = 100;
  const COLORS = ['#315b47','#9c674a','#6d6993','#487d8a','#8d7941','#9b5d71','#5b7870','#796d55'];
  let activeObject = 2, selectedYear = 0, viewed = new Set([2]), screen = 'home', clockId = null, toastId;
  let game = readGame();
  let draft = {teams: Array.from({length:4}, (_,i) => ({name:`Equipe ${i+1}`, color:COLORS[i%COLORS.length]})), seconds:45};
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arrow = '<span aria-hidden="true">↗</span>';
  const icon = (type) => {
    const paths = {
      balance:'<path d="M10 28h60M40 14v60M26 74h28M16 28L7 52h18L16 28m48 0L55 52h18L64 28M7 52q9 12 18 0m30 0q9 12 18 0"/><circle cx="40" cy="12" r="3"/>',
      mineral:'<path d="M9 58l9-24 17-15 16 4 18 30-8 13H22zM18 34l17 13 16-24M35 47l-13 19m13-19 26 19M35 19v28l34 6M9 58l26-11"/>',
      electrometer:'<ellipse cx="40" cy="23" rx="24" ry="6"/><path d="M16 23v43q24 12 48 0V23M40 9v17m-6-17h12M21 29v33m38-33v33M40 27v14l-10 17h20L40 41"/><ellipse cx="40" cy="68" rx="26" ry="7"/>',
      flask:'<path d="M29 10h22m-18 0v26L13 66q-4 8 6 8h42q10 0 6-8L47 36V10M22 54h36M30 62h6m13 4h5"/><circle cx="38" cy="47" r="2"/>',
      notebook:'<path d="M40 19Q23 10 7 18v48q17-7 33 2 16-9 33-2V18q-16-8-33 1v49M15 28l16-1m-16 12 16-1m-16 12 16-1m18-22 16 1M49 38l16 1M49 49l16 1"/>',
      bottles:'<path d="M13 14h18m-14 0v13L9 38v33h26V38l-8-11V14M45 23h18m-14 0v12l-8 8v28h26V43l-8-8V23M9 47h26M41 53h26M17 5h10v9H17zm32 9h10v9H49z"/>',
      spark:'<path d="M40 7v66M7 40h66M17 17l46 46M17 63l46-46"/><circle cx="40" cy="40" r="20"/>',
      cursor:'<path d="M14 8l2 53 13-14 12 24 10-5-12-23 19-2z"/>'
    };
    return `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[type]||paths.spark}</svg>`;
  };
  function readGame() {
    try {
      const state = JSON.parse(localStorage.getItem(KEY));
      if (!state || state.version !== 2 || state.revision !== revision ||
          !Array.isArray(state.teams) || state.teams.length < 2 || state.teams.length > 30 ||
          !Array.isArray(state.rounds) || state.rounds.length !== questions.length ||
          !Number.isInteger(state.index) || state.index < 0 || state.index >= questions.length ||
          !['block', 'curiosity', 'question', 'results'].includes(state.stage) ||
          ![0, 30, 45, 60].includes(state.seconds)) return null;
      if (state.rounds.some(round => !Array.isArray(round.answers) ||
          round.answers.length !== state.teams.length ||
          round.answers.some(answer => answer !== null && ![-1, 0, 1, 2, 3].includes(answer)))) return null;
      const complete = state.rounds.every(round => round.answers.every(answer => answer !== null));
      if ((state.stage === 'results' || state.reviewing) && !complete) return null;
      if (state.running) state.remaining = Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000));
      state.remaining = Math.min(state.seconds, Math.max(0, Number(state.remaining) || 0));
      state.running = false;
      state.deadline = null;
      return state;
    } catch { return null; }
  }
  function save() {try {localStorage.setItem(KEY, JSON.stringify(game));} catch {toast('O navegador não permitiu salvar a partida. Mantenha esta aba aberta.');}}
  function toast(text) {clearTimeout(toastId);$('#toast').textContent=text;$('#toast').classList.add('show');toastId=setTimeout(()=>$('#toast').classList.remove('show'),4000);}
  function linkSource(index, label='Consultar fonte ↗') {return `<a class="source-link" href="${sources[index].url}" target="_blank" rel="noopener noreferrer">${label}</a>`;}
  function openModal(title, body) {$('#modal-body').innerHTML=`<h2 id="modal-title">${title}</h2>${body}`;if(!modal.open) modal.showModal();}
  function closeModal(){modal.close();}
  function confirmAction(title, body, action, label='Confirmar') {openModal(title,`<p>${body}</p><div class="actions"><button class="button" data-action="${action}">${label} →</button><button class="button secondary" data-action="close-modal">Cancelar</button></div>`);}
  function render({top=true}={}) {
    clearInterval(clockId);clockId=null;
    main.className='page-enter';
    if(screen==='home') renderHome();
    if(screen==='setup') renderSetup();
    if(screen==='game' && game) renderGame();
    const banner=$('.resume-banner');
    if(banner)banner.insertAdjacentHTML('beforeend','<button class="text-button" data-action="discard">Descartar partida salva</button>');
    const panel=$('#discovery-panel');
    if(panel){panel.setAttribute('aria-live','polite');panel.setAttribute('aria-atomic','true');}
    if(top) {window.scrollTo(0,0);main.focus({preventScroll:true});}
    if(screen==='game' && game?.stage==='question' && game.running) runClock();
  }
  function renderHome() {
    main.innerHTML=`<div class="shell"><section class="hero" aria-labelledby="hero-title"><div><span class="eyebrow"><span class="little-dot"></span> MULHERES NA CIÊNCIA · EXPERIÊNCIA INTERATIVA</span><h1 id="hero-title">Toda descoberta<br>começa com <em>uma pergunta.</em></h1></div><div class="hero-copy"><p>Entre no universo de Marie Curie. Explore seu laboratório, conheça sua trajetória e descubra a ciência que transformou o mundo.</p><div class="actions"><a class="button" href="#laboratorio">Explorar o laboratório <span aria-hidden="true">↓</span></a><button class="text-button" data-action="setup">Iniciar desafio ${arrow}</button></div></div></section><section class="lab-section" id="laboratorio" aria-label="Laboratório interativo de Marie Curie"><div class="section-bar"><span class="eyebrow">01 / O LABORATÓRIO DE DESCOBERTAS</span><span class="hint">${icon('cursor')} Passe o mouse ou toque nos objetos</span></div><div class="lab-layout"><div class="lab-scene"><img src="assets/laboratorio.png" width="1536" height="1024" alt="Recriação artística de uma bancada de laboratório histórico com balança, mineral, eletrômetro, vidrarias, caderno e frascos."><span class="scene-badge">PARIS · VIRADA DO SÉCULO XX</span>${objects.map((o,i)=>`<button class="hotspot ${activeObject===i?'active':''}" data-object="${i}" style="--x:${o.x}%;--y:${o.y}%" aria-label="Explorar ${esc(o.title)}" aria-pressed="${activeObject===i}"><span class="hotspot-dot">0${i+1}</span><span class="hotspot-name">${o.title}</span></button>`).join('')}<span class="scene-caption">Uma bancada. Inúmeras possibilidades.</span></div><aside class="discovery-panel" id="discovery-panel" aria-label="Ficha do objeto selecionado"></aside></div><div class="object-selector" aria-label="Objetos do laboratório">${objects.map((o,i)=>`<button class="object-chip ${i===activeObject?'active':''}" data-object="${i}" aria-pressed="${i===activeObject}"><span>0${i+1}</span>${o.title==='Uma pista no mineral'?'Mineral':o.title.replace(' de precisão','').replace(' de laboratório','').replace(' de pesquisa','').replace(' e reagentes','')}</button>`).join('')}</div><p class="art-note">Recriação artística do laboratório · objetos ilustrativos, com contexto histórico nas fichas.</p></section><section class="timeline-section" id="trajetoria" aria-labelledby="timeline-title"><div class="section-heading"><div><span class="eyebrow">02 / UMA VIDA DE DESCOBERTAS</span><h2 id="timeline-title">A coragem de ir além.</h2></div><p>De Varsóvia aos prêmios Nobel.<br>Escolha um ano e percorra essa história.</p></div><div class="timeline-tabs" role="tablist" aria-label="Anos da trajetória de Marie Curie">${timeline.map((t,i)=>`<button class="year-tab" role="tab" id="year-${i}" aria-selected="${selectedYear===i}" aria-controls="timeline-story" tabindex="${selectedYear===i?0:-1}" data-year="${i}">${t.year}</button>`).join('')}</div><div class="timeline-story" id="timeline-story" role="tabpanel" aria-labelledby="year-${selectedYear}"></div></section><section class="home-end" id="desafio"><div class="challenge-teaser"><div><span class="eyebrow">03 / AGORA É COM A SUA EQUIPE</span><h2>A próxima descoberta<br>pode começar com vocês.</h2><p>Conversem, conectem as pistas e coloquem o conhecimento em jogo.</p><div class="teaser-stats"><span><b>${questions.length}</b> perguntas</span><span><b>${blocks.length}</b> blocos</span><span><b>100</b> pontos por acerto</span><span><b>∞</b> curiosidade</span></div></div><div class="challenge-buttons"><button class="button sand" data-action="setup">Preparar as equipes ${arrow}</button><button class="text-button" data-action="rules">Como funciona o desafio?</button></div></div>${game?`<div class="resume-banner"><span>Há uma partida salva neste navegador. Você pode continuar de onde parou.</span><button class="button" data-action="resume">Continuar partida →</button></div>`:''}</section></div>`;
    updateObject(false);updateTimeline();
  }
  function updateObject(animate=true) {
    const panel=$('#discovery-panel');if(!panel)return;
    const o=objects[activeObject];
    panel.innerHTML=`<div class="panel-top"><span class="eyebrow">CADERNO DE DESCOBERTAS</span><span class="page-number">0${activeObject+1} / 06</span></div><div class="object-illustration">${icon(o.icon)}</div><span class="tag">${o.tag}</span><h3>${o.title}</h3><p>${o.text}</p><div class="curiosity-note"><span>UMA NOVA PERSPECTIVA</span><p>${o.curiosity}</p></div><div class="panel-bottom"><div class="explore-dots" aria-hidden="true">${objects.map((_,i)=>`<span class="explore-dot ${viewed.has(i)?'seen':''}"></span>`).join('')}</div><span>${viewed.size} de 6 explorados</span>${linkSource(o.source,'Fonte ↗')}</div>`;
    if(animate){panel.classList.remove('panel-enter');void panel.offsetWidth;panel.classList.add('panel-enter');}
    document.querySelectorAll('[data-object]').forEach(el=>{el.classList.toggle('active',Number(el.dataset.object)===activeObject);el.setAttribute('aria-pressed',Number(el.dataset.object)===activeObject?'true':'false');});
  }
  function selectObject(i){if(i===activeObject)return;activeObject=i;viewed.add(i);updateObject();}
  function updateTimeline(focus=false){
    const t=timeline[selectedYear],box=$('#timeline-story');if(!box)return;
    box.setAttribute('aria-labelledby',`year-${selectedYear}`);
    box.innerHTML=`<div class="timeline-year">${t.year}<span>${t.detail}</span></div><div class="timeline-text panel-enter"><span class="eyebrow">${t.label}</span><h3>${t.title}</h3><p>${t.text}</p><div class="timeline-bottom">${linkSource(t.source,'Ler mais na fonte ↗')}<div class="timeline-controls"><button class="icon-button" data-action="prev-year" aria-label="Ano anterior" ${selectedYear===0?'disabled':''}>←</button><button class="icon-button" data-action="next-year" aria-label="Próximo ano" ${selectedYear===timeline.length-1?'disabled':''}>→</button></div></div></div>`;
    document.querySelectorAll('[data-year]').forEach(el=>{const on=Number(el.dataset.year)===selectedYear;el.setAttribute('aria-selected',String(on));el.tabIndex=on?0:-1;if(on&&focus)el.focus();});
  }
  function prepareSetup(){pauseClock();if(game)draft={teams:game.teams.map(t=>({...t})),seconds:game.seconds};screen='setup';render();}
  function renderSetup(){
    main.innerHTML=`<div class="play-shell"><button class="back-link" data-action="home">← Voltar ao laboratório</button><div class="page-title"><span class="eyebrow">O DESAFIO · PREPARAÇÃO</span><h1>Ciência se faz em equipe.</h1><p>Organize a turma, escolha o tempo de discussão e prepare-se para ${questions.length} perguntas em ${blocks.length} blocos.</p></div>${game?`<div class="resume-banner"><span>Sua partida anterior está salva.</span><button class="button" data-action="resume">Continuar partida →</button></div>`:''}<div class="setup-layout"><div class="setup-card"><h3>Quem vai investigar?</h3><div class="counter-row"><label for="team-count">Quantidade de equipes</label><div class="counter"><button data-action="fewer-teams" aria-label="Remover uma equipe" ${draft.teams.length<=2?'disabled':''}>−</button><input id="team-count" type="number" inputmode="numeric" min="2" max="30" value="${draft.teams.length}" aria-label="Quantidade de equipes"><button data-action="more-teams" aria-label="Adicionar uma equipe" ${draft.teams.length>=30?'disabled':''}>+</button></div></div><div class="team-editor" id="team-editor">${teamInputs()}</div><label class="field" for="seconds">Tempo de discussão por pergunta</label><select class="select" id="seconds">${[[30,'30 segundos'],[45,'45 segundos'],[60,'60 segundos'],[0,'Sem cronômetro']].map(([n,s])=>`<option value="${n}" ${draft.seconds===n?'selected':''}>${s}</option>`).join('')}</select><button class="button setup-start" data-action="start">Começar o desafio <span>→</span></button></div><aside class="rules-card"><span class="eyebrow" style="color:var(--gold);margin-bottom:12px">ANTES DE COMEÇAR</span><h3>Uma pergunta.<br>Todas as equipes.</h3><ol class="rules-list"><li><b>01</b><span>Leia a curiosidade com a turma e abra a pergunta quando todos estiverem prontos.</span></li><li><b>02</b><span>As equipes discutem e escolhem A, B, C ou D. O professor registra as escolhas.</span></li><li><b>03</b><span>Confirme as escolhas e avance. A classificação e o gabarito serão apresentados somente ao final dos quatro blocos.</span></li></ol><div class="setup-blocks">${blocks.map((block,i)=>`<span><b>0${i+1}</b> ${block.short} <small>${block.end-block.start+1} perguntas</small></span>`).join('')}</div><div class="score-rule"><strong>+100 pontos por acerto.</strong><br>Sem desconto por erro ou bônus de velocidade. Em caso de empate, a colocação é compartilhada.</div></aside></div></div>`;
  }
  function teamInputs(){return draft.teams.map((t,i)=>`<label class="team-input"><span class="team-color" style="--team-color:${t.color}" aria-hidden="true">${i+1}</span><input data-team-name="${i}" value="${esc(t.name)}" maxlength="40" aria-label="Nome da equipe ${i+1}" placeholder="Equipe ${i+1}"></label>`).join('');}
  function resizeTeams(count){count=Math.min(30,Math.max(2,Math.round(Number(count)||2)));while(draft.teams.length<count){const i=draft.teams.length;draft.teams.push({name:`Equipe ${i+1}`,color:COLORS[i%COLORS.length]});}draft.teams.length=count;render({top:false});}
  function startGame() {
    closeModal();
    game = {
      version: 2, revision,
      teams: draft.teams.map((team, index) => ({...team, name: team.name.trim() || `Equipe ${index + 1}`})),
      seconds: draft.seconds, index: 0, stage: 'block', reviewing: false,
      rounds: questions.map(() => ({answers: Array(draft.teams.length).fill(null)})),
      remaining: draft.seconds, running: false, deadline: null
    };
    save(); screen = 'game'; render();
  }
  function currentBlock(index = game.index) {
    return blocks.find(block => index >= block.start && index <= block.end);
  }
  function openQuestion() {
    game.stage = 'question'; game.remaining = game.reviewing ? 0 : game.seconds;
    game.running = game.remaining > 0;
    game.deadline = game.running ? Date.now() + game.remaining * 1000 : null;
    save(); render();
  }
  function scores() {
    return game.teams.map((team, index) => ({...team, id: index,
      score: game.rounds.reduce((total, round, n) => total + (round.answers[index] === questions[n].correct ? POINTS : 0), 0)
    })).sort((a, b) => b.score - a.score || a.id - b.id);
  }
  function scoreMarkup() {
    if (game.stage !== 'results') return '';
    const list = scores(); let rank = 1;
    return `<div class="scoreboard">${list.map((team, index) => {
      if (index && team.score !== list[index - 1].score) rank = index + 1;
      return `<div class="score-row"><span class="rank">${rank}º</span><span class="score-name"><span class="team-color" style="--team-color:${team.color}" aria-hidden="true">${team.id + 1}</span>${esc(team.name)}</span><span class="score-value">${team.score} <small>PTS</small></span><span class="score-delta">${team.score / POINTS}/${questions.length} acertos</span></div>`;
    }).join('')}</div>`;
  }
  function blockProgress() {
    const current = blocks.indexOf(currentBlock());
    return `<ol class="block-progress" aria-label="Percurso do questionário">${blocks.map((block, index) => `<li class="${index === current ? 'current' : index < current ? 'completed' : ''}" ${index === current ? 'aria-current="step"' : ''}><span>${String(index + 1).padStart(2, '0')}</span>${block.short}</li>`).join('')}</ol>`;
  }
  function roundHeader() {
    const block = currentBlock();
    const label = game.reviewing ? 'REVISÃO DE REGISTRO' : game.stage === 'block' ? `BLOCO ${blocks.indexOf(block) + 1} DE ${blocks.length}` : 'DESAFIO CURIE';
    return `<div class="round-header"><span class="eyebrow">${label} · PERGUNTA ${String(game.index + 1).padStart(2, '0')} DE ${questions.length}</span><div class="round-tools"><button class="text-button" data-action="home">Laboratório</button></div></div>${blockProgress()}<div class="round-progress" aria-label="Pergunta ${game.index + 1} de ${questions.length}"><span style="width:${game.index / questions.length * 100}%"></span></div>`;
  }
  function blockIntro(block) {
    const number = blocks.indexOf(block) + 1;
    return `<section class="block-intro"><div class="block-art"><span aria-hidden="true">${String(number).padStart(2, '0')}</span>${icon(block.icon)}</div><div><span class="eyebrow">UM NOVO CAPÍTULO · BLOCO ${number} DE ${blocks.length}</span><h1>${block.title}</h1><p>${block.description}</p><div class="block-range">Perguntas ${block.start + 1} a ${block.end + 1} <span>·</span> ${block.end - block.start + 1} questões</div><button class="button" data-action="start-block">Iniciar bloco ${number} <span>→</span></button><p class="block-note">As escolhas ficam guardadas. Os resultados serão revelados após as ${questions.length} perguntas.</p></div></section>`;
  }
  function renderGame() {
    if (game.stage === 'results') { renderResults(); return; }
    const question = questions[game.index]; let body = '';
    if (game.stage === 'block') body = blockIntro(currentBlock());
    if (game.stage === 'curiosity') body = `<section class="curiosity-page"><div class="curiosity-art">${icon(currentBlock().icon)}</div><div><span class="eyebrow">ANTES DA PERGUNTA · ${esc(question.topic)}</span><h1>Uma pista para<br>a sua curiosidade.</h1><p>${esc(question.curiosity)}</p><button class="button" data-action="open-question">Vamos à pergunta <span>→</span></button><p class="timer-info">${game.seconds ? `O cronômetro de ${game.seconds} segundos começa ao abrir a pergunta.` : 'Esta partida está no modo sem cronômetro.'}</p></div></section>`;
    if (game.stage === 'question') body = questionMarkup(question);
    main.innerHTML = `<div class="play-shell">${roundHeader()}${body}</div>`;
    updateTimer();
  }
  function questionMarkup(question) {
    const answers = game.rounds[game.index].answers;
    const registered = answers.filter(answer => answer !== null).length;
    const last = game.index === questions.length - 1;
    const label = game.reviewing ? 'Salvar correção e ver resultado' : last ? 'Concluir questionário' : game.index === currentBlock().end ? 'Concluir bloco e continuar' : 'Confirmar e continuar';
    return `<div class="question-top"><span class="eyebrow">${esc(currentBlock().title)}</span>${game.seconds && !game.reviewing ? `<div class="timer ${game.remaining === 0 ? 'expired' : ''}" id="timer"><strong><span id="timer-number">${formatTime(game.remaining)}</span><small id="timer-label">${game.remaining === 0 ? 'TEMPO ENCERRADO' : game.running ? 'DISCUSSÃO' : 'PAUSADO'}</small></strong><button class="icon-button" data-action="toggle-timer" id="timer-toggle" aria-label="${game.running ? 'Pausar' : 'Retomar'} cronômetro" ${game.remaining === 0 ? 'disabled' : ''}>${game.running ? 'Ⅱ' : '▶'}</button></div>` : `<span class="hint">${game.reviewing ? 'Correção de registro' : 'Sem cronômetro'}</span>`}</div><h1 class="question-title">${esc(question.question)}</h1><div class="answer-options">${question.options.map((option, index) => `<div class="option"><span class="option-letter">${'ABCD'[index]}</span><span>${esc(option)}</span></div>`).join('')}</div><section class="register-box" aria-label="Registro de respostas"><div class="register-title"><h3>Registre a escolha de cada equipe</h3><span id="register-count">${registered} de ${game.teams.length} registradas</span></div><div class="team-responses">${game.teams.map((team, index) => `<div class="team-answer"><div class="team-answer-name"><span class="team-color" style="--team-color:${team.color}" aria-hidden="true">${index + 1}</span>${esc(team.name)}</div><div class="answer-picks" role="group" aria-label="Resposta de ${esc(team.name)}">${[0, 1, 2, 3, -1].map(answer => `<button class="answer-pick ${answer === -1 ? 'none' : ''} ${answers[index] === answer ? 'selected' : ''}" data-answer="${answer}" data-team="${index}" aria-pressed="${answers[index] === answer}" aria-label="${esc(team.name)}: ${answer === -1 ? 'sem resposta' : 'alternativa ' + 'ABCD'[answer]}">${answer === -1 ? '—' : 'ABCD'[answer]}</button>`).join('')}</div></div>`).join('')}</div></section><div class="game-bottom"><span id="response-help">${registered === game.teams.length ? 'Todas as escolhas registradas. Confirme para continuar.' : 'Marque uma alternativa ou “—” para equipe sem resposta.'}</span><button class="button" id="confirm-button" data-action="confirm-answers" ${registered !== game.teams.length ? 'disabled' : ''}>${label} <span>→</span></button></div>`;
  }
  function chooseAnswer(team, answer) {
    if (screen !== 'game' || game.stage !== 'question') return;
    game.rounds[game.index].answers[team] = answer; save();
    document.querySelectorAll(`[data-team="${team}"]`).forEach(element => {
      const selected = Number(element.dataset.answer) === answer;
      element.classList.toggle('selected', selected); element.setAttribute('aria-pressed', String(selected));
    });
    const registered = game.rounds[game.index].answers.filter(value => value !== null).length;
    $('#register-count').textContent = `${registered} de ${game.teams.length} registradas`;
    $('#confirm-button').disabled = registered !== game.teams.length;
    $('#response-help').textContent = registered === game.teams.length ? 'Todas as escolhas registradas. Confirme para continuar.' : 'Marque uma alternativa ou “—” para equipe sem resposta.';
  }
  function confirmAnswers() {
    if (game.stage !== 'question' || game.rounds[game.index].answers.some(answer => answer === null)) return;
    pauseClock();
    if (game.reviewing || game.index === questions.length - 1) {
      game.index = questions.length - 1; game.stage = 'results'; game.reviewing = false;
    } else {
      const previousBlock = currentBlock(); game.index++;
      game.stage = previousBlock === currentBlock() ? 'curiosity' : 'block';
      game.remaining = game.seconds;
    }
    save(); render();
  }
  function formatTime(seconds) { return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; }
  function updateTimer() {
    if (!game || !$('#timer-number')) return;
    $('#timer-number').textContent = formatTime(game.remaining);
    $('#timer-label').textContent = game.remaining === 0 ? 'TEMPO ENCERRADO' : game.running ? 'DISCUSSÃO' : 'PAUSADO';
    $('#timer-toggle').textContent = game.running ? 'Ⅱ' : '▶';
    $('#timer-toggle').setAttribute('aria-label', `${game.running ? 'Pausar' : 'Retomar'} cronômetro`);
    $('#timer-toggle').disabled = game.remaining === 0;
    $('#timer').classList.toggle('expired', game.remaining === 0);
  }
  function runClock() {
    clearInterval(clockId);
    clockId = setInterval(() => {
      if (!game.running) return;
      game.remaining = Math.max(0, Math.ceil((game.deadline - Date.now()) / 1000));
      if (game.remaining === 0) {
        game.running = false; game.deadline = null; clearInterval(clockId); save();
        toast('Tempo encerrado. Finalize o registro das escolhas e confirme para continuar.');
      }
      updateTimer();
    }, 200);
  }
  function pauseClock() {
    if (game?.running) {
      game.remaining = Math.max(0, Math.ceil((game.deadline - Date.now()) / 1000));
      game.running = false; game.deadline = null; save();
    }
    clearInterval(clockId); updateTimer();
  }
  function teamHistory(team) {
    return `<details class="team-history"><summary><span class="history-team"><span class="team-color" style="--team-color:${team.color}" aria-hidden="true">${team.id + 1}</span><strong>${esc(team.name)}</strong></span><span class="history-total">${team.score / POINTS}/${questions.length} acertos <span aria-hidden="true">⌄</span></span></summary><div class="history-content"><div class="history-scroll" tabindex="0" aria-label="Respostas da equipe ${esc(team.name)}"><table class="history-table"><caption class="sr-only">Histórico de respostas de ${esc(team.name)}</caption><thead><tr><th scope="col">Pergunta</th><th scope="col">Escolha da equipe</th><th scope="col">Resposta correta</th><th scope="col">Resultado</th></tr></thead>${blocks.map((block, blockIndex) => `<tbody><tr class="history-block"><th colspan="4" scope="rowgroup">BLOCO ${blockIndex + 1} · ${esc(block.title)}</th></tr>${questions.slice(block.start, block.end + 1).map((question, offset) => {
      const index = block.start + offset; const answer = game.rounds[index].answers[team.id];
      const status = answer === -1 ? 'empty' : answer === question.correct ? 'right' : 'wrong';
      return `<tr class="history-question" data-history-question="${index + 1}"><th scope="row"><span class="history-number">${String(index + 1).padStart(2, '0')}</span>${esc(question.question)}</th><td>${answer === -1 ? '<span class="history-unanswered">Sem resposta</span>' : `<b>${'ABCD'[answer]}</b> · ${esc(question.options[answer])}`}</td><td><b>${'ABCD'[question.correct]}</b> · ${esc(question.options[question.correct])}</td><td><span class="history-status ${status}">${status === 'right' ? '✓ Acerto' : status === 'wrong' ? '× Erro' : '— Sem resposta'}</span></td></tr>`;
    }).join('')}</tbody>`).join('')}</table></div></div></details>`;
  }
  function finalAnswerKey() {
    return `<details class="answer-key"><summary><span>Gabarito comentado</span><span>${questions.length} explicações <span aria-hidden="true">⌄</span></span></summary><div class="answer-key-body">${blocks.map((block, blockIndex) => `<section><h3>Bloco ${blockIndex + 1} · ${esc(block.title)}</h3>${questions.slice(block.start, block.end + 1).map(question => `<article class="answer-key-question"><span class="eyebrow">PERGUNTA ${String(question.id).padStart(2, '0')}</span><h4>${esc(question.question)}</h4><p class="key-correct">${'ABCD'[question.correct]} · ${esc(question.options[question.correct])}</p><p>${esc(question.explanation)}</p>${linkSource(question.source, 'Consultar fonte ↗')}</article>`).join('')}</section>`).join('')}</div></details>`;
  }
  function renderResults() {
    const list = scores(); const winners = list.filter(team => team.score === list[0].score);
    main.innerHTML = `<div class="play-shell"><button class="back-link" data-action="home">← Voltar ao laboratório</button><section class="result-title"><div class="result-symbol" aria-hidden="true">✳</div><span class="eyebrow">DESAFIO CONCLUÍDO · ${blocks.length} BLOCOS · ${questions.length} PERGUNTAS</span><h1>A curiosidade levou vocês longe.</h1><p>Agora é hora de conhecer o resultado e revisitar o caminho de cada equipe.</p></section><div class="winner-card"><span class="eyebrow">${winners.length > 1 ? 'PRIMEIRO LUGAR COMPARTILHADO' : 'EQUIPE EM PRIMEIRO LUGAR'}</span><h2>${winners.map(team => esc(team.name)).join(' · ')}</h2><p>${list[0].score} pontos · ${list[0].score / POINTS} de ${questions.length} acertos</p></div><div class="result-table">${scoreMarkup()}</div><section class="histories-section" aria-labelledby="histories-title"><div class="history-heading"><div><span class="eyebrow">CADA ESCOLHA CONTA UMA HISTÓRIA</span><h2 id="histories-title">O caminho de cada equipe.</h2></div><p>Abra uma equipe para consultar as ${questions.length} respostas, organizadas por bloco.</p></div>${list.map(teamHistory).join('')}${finalAnswerKey()}<button class="text-button" data-action="review-records">Corrigir um registro de resposta</button></section><div class="reflection"><span class="eyebrow">PARA LEVAR ALÉM DO LABORATÓRIO</span><p>Que barreiras ainda dificultam a participação das mulheres na ciência — e como podemos ajudar a superá-las?</p></div><div class="actions result-actions"><button class="button" data-action="setup">Jogar novamente <span>↗</span></button><button class="button secondary" data-action="home">Explorar o laboratório</button></div></div>`;
  }
  function rules() {
    openModal('Como funciona o desafio?', `<ol><li>Defina a quantidade e os nomes das equipes. Todas respondem às mesmas ${questions.length} perguntas, organizadas em ${blocks.length} blocos.</li><li>Leia a abertura do bloco e a curiosidade antes de cada pergunta. O cronômetro começa apenas ao abrir a pergunta, se ativado.</li><li>Registre A, B, C ou D para cada equipe. Use “—” quando não houver resposta.</li><li>Confirme as escolhas e avance. Durante a partida, não são apresentados gabaritos, acertos ou placares parciais.</li><li>Após a última questão, veja a classificação, o histórico de cada equipe e o gabarito comentado. Cada acerto vale ${POINTS} pontos; empates compartilham a colocação.</li></ol><p>Você conduz tudo no computador. As equipes podem responder com cartões, no papel ou indicando sua escolha ao professor.</p><div class="actions"><button class="button" data-action="close-modal">Entendi →</button></div>`);
  }
  const actions={
    'home':()=>{pauseClock();screen='home';render();},
    'setup':()=>{closeModal();prepareSetup();},
    'resume':()=>{if(!game)return;pauseClock();screen='game';render();},
    'rules':rules,
    'discard':()=>confirmAction('Descartar a partida salva?','As respostas e a pontuação desta partida serão apagadas deste navegador. Você poderá preparar novas equipes a qualquer momento.','confirm-discard','Descartar partida'),
    'confirm-discard':()=>{closeModal();pauseClock();try{localStorage.removeItem(KEY);}catch{}game=null;screen='home';render();toast('Partida descartada. O laboratório está pronto para uma nova turma.');},
    'sources':()=>openModal('Ciência com referências.',`<p>O conteúdo histórico foi elaborado a partir de instituições científicas e acervos. As fichas também distinguem o uso geral dos instrumentos de sua relação com a pesquisa dos Curie.</p><ul class="credits">${sources.map(s=>`<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title} ↗</a></li>`).join('')}</ul><p><b>Imagem do laboratório:</b> recriação artística gerada com ImageGen. A cena e os instrumentos ilustrados não são uma reprodução documental do laboratório original.</p><p><b>Uso em sala:</b> Mulheres na Ciência · turma do IFAM. Esta experiência não representa um site institucional oficial.</p>`),
    'close-modal':closeModal,
    'fullscreen':async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('A tela cheia não está disponível neste navegador.');}},
    'prev-year':()=>{selectedYear=Math.max(0,selectedYear-1);updateTimeline();},
    'next-year':()=>{selectedYear=Math.min(timeline.length-1,selectedYear+1);updateTimeline();},
    'more-teams':()=>resizeTeams(draft.teams.length+1),
    'fewer-teams':()=>resizeTeams(draft.teams.length-1),
    'start':()=>{if(game)confirmAction('Começar uma nova partida?','A partida salva será substituída. Os nomes e o tempo escolhidos nesta tela serão usados no novo desafio.','confirm-start','Começar nova partida');else startGame();},
    'confirm-start':startGame,
    'open-question':openQuestion,
    'toggle-timer':()=>{if(game.running)pauseClock();else if(game.remaining>0){game.running=true;game.deadline=Date.now()+game.remaining*1000;save();runClock();updateTimer();}},
    'start-block':()=>{if(game.stage!=='block')return;game.stage='curiosity';save();render();},
    'confirm-answers':confirmAnswers,
    'review-records':()=>{if(game.stage!=='results')return;openModal('Corrigir um registro',`<p>Escolha a pergunta cujo registro precisa ser ajustado. A correção será aplicada ao histórico e à classificação final.</p><label class="field" for="review-question">Pergunta</label><select class="select" id="review-question">${questions.map((question,index)=>`<option value="${index}">${String(index+1).padStart(2,'0')} · ${esc(question.question)}</option>`).join('')}</select><div class="actions"><button class="button" data-action="open-review">Revisar escolhas →</button><button class="button secondary" data-action="close-modal">Cancelar</button></div>`);},
    'open-review':()=>{if(game.stage!=='results')return;const index=Number($('#review-question').value);if(!Number.isInteger(index)||index<0||index>=questions.length)return;closeModal();game.index=index;game.stage='question';game.reviewing=true;game.running=false;game.remaining=0;game.deadline=null;save();render();}

  };
  document.addEventListener('click',event=>{
    const el=event.target.closest('[data-action],[data-object],[data-year],a[data-nav],.brand,[data-answer]');if(!el||el.disabled)return;
    if(el.matches('.brand,a[data-nav]')){event.preventDefault();pauseClock();screen='home';render();const target=el.dataset.nav==='timeline'?'#trajetoria':el.dataset.nav==='lab'?'#laboratorio':null;if(target)$(target).scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return;}
    if(el.dataset.object!==undefined){selectObject(Number(el.dataset.object));return;}
    if(el.dataset.year!==undefined){selectedYear=Number(el.dataset.year);updateTimeline();return;}
    if(el.dataset.answer!==undefined){chooseAnswer(Number(el.dataset.team),Number(el.dataset.answer));return;}
    actions[el.dataset.action]?.();
  });
  document.addEventListener('pointerover',event=>{if(event.pointerType==='touch')return;const el=event.target.closest('.hotspot');if(el)selectObject(Number(el.dataset.object));});
  document.addEventListener('focusin',event=>{const el=event.target.closest('.hotspot');if(el)selectObject(Number(el.dataset.object));});
  document.addEventListener('keydown',event=>{const el=event.target.closest('[data-year]');if(!el)return;if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();selectedYear=event.key==='Home'?0:event.key==='End'?timeline.length-1:(selectedYear+(event.key==='ArrowRight'?1:-1)+timeline.length)%timeline.length;updateTimeline(true);}});
  document.addEventListener('input',event=>{if(event.target.dataset.teamName!==undefined)draft.teams[Number(event.target.dataset.teamName)].name=event.target.value;});
  document.addEventListener('change',event=>{if(event.target.id==='team-count')resizeTeams(event.target.value);if(event.target.id==='seconds')draft.seconds=Number(event.target.value);});
  document.addEventListener('fullscreenchange',()=>{const button=$('[data-action="fullscreen"]');button.setAttribute('aria-label',document.fullscreenElement?'Sair da tela cheia':'Ativar tela cheia');button.title=document.fullscreenElement?'Sair da tela cheia':'Tela cheia';});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseClock();});
  modal.addEventListener('click',event=>{if(event.target===modal){const b=modal.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)closeModal();}});
  render({top:false});
})();
