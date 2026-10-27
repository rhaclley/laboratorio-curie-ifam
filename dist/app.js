(() => {
  'use strict';
  const {objects, timeline, questions, sources} = window.CURIE;
  const $ = (q) => document.querySelector(q);
  const main = $('#main');
  const modal = $('#modal');
  const KEY = 'laboratorio-curie-v1';
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
      const s = JSON.parse(localStorage.getItem(KEY));
      if (!s || s.version!==1 || !Array.isArray(s.teams) || !s.teams.length || !Array.isArray(s.rounds) || !Number.isInteger(s.index) || s.index<0 || s.index>=questions.length || !['curiosity','question','reveal','scores','results'].includes(s.stage)) return null;
      if(s.running) s.remaining = Math.max(0, Math.ceil((s.deadline-Date.now())/1000));
      s.running=false;s.deadline=null;
      return s;
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
    main.innerHTML=`<div class="shell"><section class="hero" aria-labelledby="hero-title"><div><span class="eyebrow"><span class="little-dot"></span> MULHERES NA CIÊNCIA · EXPERIÊNCIA INTERATIVA</span><h1 id="hero-title">Toda descoberta<br>começa com <em>uma pergunta.</em></h1></div><div class="hero-copy"><p>Entre no universo de Marie Curie. Explore seu laboratório, conheça sua trajetória e descubra a ciência que transformou o mundo.</p><div class="actions"><a class="button" href="#laboratorio">Explorar o laboratório <span aria-hidden="true">↓</span></a><button class="text-button" data-action="setup">Iniciar desafio ${arrow}</button></div></div></section><section class="lab-section" id="laboratorio" aria-label="Laboratório interativo de Marie Curie"><div class="section-bar"><span class="eyebrow">01 / O LABORATÓRIO DE DESCOBERTAS</span><span class="hint">${icon('cursor')} Passe o mouse ou toque nos objetos</span></div><div class="lab-layout"><div class="lab-scene"><img src="assets/laboratorio.png" width="1536" height="1024" alt="Recriação artística de uma bancada de laboratório histórico com balança, mineral, eletrômetro, vidrarias, caderno e frascos."><span class="scene-badge">PARIS · VIRADA DO SÉCULO XX</span>${objects.map((o,i)=>`<button class="hotspot ${activeObject===i?'active':''}" data-object="${i}" style="--x:${o.x}%;--y:${o.y}%" aria-label="Explorar ${esc(o.title)}" aria-pressed="${activeObject===i}"><span class="hotspot-dot">0${i+1}</span><span class="hotspot-name">${o.title}</span></button>`).join('')}<span class="scene-caption">Uma bancada. Inúmeras possibilidades.</span></div><aside class="discovery-panel" id="discovery-panel" aria-label="Ficha do objeto selecionado"></aside></div><div class="object-selector" aria-label="Objetos do laboratório">${objects.map((o,i)=>`<button class="object-chip ${i===activeObject?'active':''}" data-object="${i}" aria-pressed="${i===activeObject}"><span>0${i+1}</span>${o.title==='Uma pista no mineral'?'Mineral':o.title.replace(' de precisão','').replace(' de laboratório','').replace(' de pesquisa','').replace(' e reagentes','')}</button>`).join('')}</div><p class="art-note">Recriação artística do laboratório · objetos ilustrativos, com contexto histórico nas fichas.</p></section><section class="timeline-section" id="trajetoria" aria-labelledby="timeline-title"><div class="section-heading"><div><span class="eyebrow">02 / UMA VIDA DE DESCOBERTAS</span><h2 id="timeline-title">A coragem de ir além.</h2></div><p>De Varsóvia aos prêmios Nobel.<br>Escolha um ano e percorra essa história.</p></div><div class="timeline-tabs" role="tablist" aria-label="Anos da trajetória de Marie Curie">${timeline.map((t,i)=>`<button class="year-tab" role="tab" id="year-${i}" aria-selected="${selectedYear===i}" aria-controls="timeline-story" tabindex="${selectedYear===i?0:-1}" data-year="${i}">${t.year}</button>`).join('')}</div><div class="timeline-story" id="timeline-story" role="tabpanel" aria-labelledby="year-${selectedYear}"></div></section><section class="home-end" id="desafio"><div class="challenge-teaser"><div><span class="eyebrow">03 / AGORA É COM A SUA EQUIPE</span><h2>A próxima descoberta<br>pode começar com vocês.</h2><p>Conversem, conectem as pistas e coloquem o conhecimento em jogo.</p><div class="teaser-stats"><span><b>10</b> perguntas</span><span><b>100</b> pontos por acerto</span><span><b>∞</b> curiosidade</span></div></div><div class="challenge-buttons"><button class="button sand" data-action="setup">Preparar as equipes ${arrow}</button><button class="text-button" data-action="rules">Como funciona o desafio?</button></div></div>${game?`<div class="resume-banner"><span>Há uma partida salva neste navegador. Você pode continuar de onde parou.</span><button class="button" data-action="resume">Continuar partida →</button></div>`:''}</section></div>`;
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
    main.innerHTML=`<div class="play-shell"><button class="back-link" data-action="home">← Voltar ao laboratório</button><div class="page-title"><span class="eyebrow">O DESAFIO · PREPARAÇÃO</span><h1>Ciência se faz em equipe.</h1><p>Organize a turma, escolha o tempo de discussão e prepare-se para dez descobertas.</p></div>${game?`<div class="resume-banner"><span>Sua partida anterior está salva.</span><button class="button" data-action="resume">Continuar partida →</button></div>`:''}<div class="setup-layout"><div class="setup-card"><h3>Quem vai investigar?</h3><div class="counter-row"><label for="team-count">Quantidade de equipes</label><div class="counter"><button data-action="fewer-teams" aria-label="Remover uma equipe" ${draft.teams.length<=2?'disabled':''}>−</button><input id="team-count" type="number" inputmode="numeric" min="2" max="30" value="${draft.teams.length}" aria-label="Quantidade de equipes"><button data-action="more-teams" aria-label="Adicionar uma equipe" ${draft.teams.length>=30?'disabled':''}>+</button></div></div><div class="team-editor" id="team-editor">${teamInputs()}</div><label class="field" for="seconds">Tempo de discussão por pergunta</label><select class="select" id="seconds">${[[30,'30 segundos'],[45,'45 segundos'],[60,'60 segundos'],[0,'Sem cronômetro']].map(([n,s])=>`<option value="${n}" ${draft.seconds===n?'selected':''}>${s}</option>`).join('')}</select><button class="button setup-start" data-action="start">Começar o desafio <span>→</span></button></div><aside class="rules-card"><span class="eyebrow" style="color:var(--gold);margin-bottom:12px">ANTES DE COMEÇAR</span><h3>Uma pergunta.<br>Todas as equipes.</h3><ol class="rules-list"><li><b>01</b><span>Leia a curiosidade com a turma e abra a pergunta quando todos estiverem prontos.</span></li><li><b>02</b><span>As equipes discutem e escolhem A, B, C ou D. O professor registra as escolhas.</span></li><li><b>03</b><span>Com todas as respostas registradas, revele o gabarito e conversem sobre a explicação.</span></li></ol><div class="score-rule"><strong>+100 pontos por acerto.</strong><br>Sem desconto por erro ou bônus de velocidade. Em caso de empate, a colocação é compartilhada.</div></aside></div></div>`;
  }
  function teamInputs(){return draft.teams.map((t,i)=>`<label class="team-input"><span class="team-color" style="--team-color:${t.color}" aria-hidden="true">${i+1}</span><input data-team-name="${i}" value="${esc(t.name)}" maxlength="40" aria-label="Nome da equipe ${i+1}" placeholder="Equipe ${i+1}"></label>`).join('');}
  function resizeTeams(count){count=Math.min(30,Math.max(2,Math.round(Number(count)||2)));while(draft.teams.length<count){const i=draft.teams.length;draft.teams.push({name:`Equipe ${i+1}`,color:COLORS[i%COLORS.length]});}draft.teams.length=count;render({top:false});}
  function startGame(){
    closeModal();
    game={version:1,teams:draft.teams.map((t,i)=>({...t,name:t.name.trim()||`Equipe ${i+1}`})),seconds:draft.seconds,index:0,stage:'curiosity',rounds:questions.map(()=>({answers:Array(draft.teams.length).fill(null)})),remaining:draft.seconds,running:false,deadline:null};
    save();screen='game';render();
  }
  function openQuestion(){game.stage='question';game.remaining=game.seconds;game.running=game.seconds>0;game.deadline=game.running?Date.now()+game.seconds*1000:null;save();render();}
  function scores(){return game.teams.map((t,i)=>({...t,id:i,score:game.rounds.reduce((sum,r,n)=>sum+((n<game.index || (n===game.index && ['reveal','scores','results'].includes(game.stage))) && r.answers[i]===questions[n].correct?100:0),0)})).sort((a,b)=>b.score-a.score||a.id-b.id);}
  function scoreMarkup(showDelta=false){const list=scores();let rank=1;return `<div class="scoreboard">${list.map((t,i)=>{if(i&&t.score!==list[i-1].score)rank=i+1;return `<div class="score-row"><span class="rank">${rank}º</span><span class="score-name"><span class="team-color" style="--team-color:${t.color}" aria-hidden="true">${t.id+1}</span>${esc(t.name)}</span><span class="score-value">${t.score} <small>PTS</small></span><span class="score-delta">${showDelta?(game.rounds[game.index].answers[t.id]===questions[game.index].correct?'+100':'—'):`${t.score/100} acertos`}</span></div>`;}).join('')}</div>`;}
  function roundHeader(){return `<div class="round-header"><span class="eyebrow">DESAFIO CURIE · PERGUNTA ${String(game.index+1).padStart(2,'0')} DE 10</span><div class="round-tools"><button class="text-button" data-action="score-modal">Ver placar</button><button class="text-button" data-action="home">Laboratório</button></div></div><div class="round-progress" aria-label="Pergunta ${game.index+1} de 10"><span style="width:${(game.index+1)*10}%"></span></div>`;}
  function renderGame(){
    if(game.stage==='results'){renderResults();return;}
    const q=questions[game.index];
    let body='';
    if(game.stage==='curiosity')body=`<section class="curiosity-page"><div class="curiosity-art">${icon(objects[game.index%objects.length].icon)}</div><div><span class="eyebrow">ANTES DA PERGUNTA · ${q.topic}</span><h1>Uma pista para<br>a sua curiosidade.</h1><p>${q.curiosity}</p><button class="button" data-action="open-question">Vamos à pergunta <span>→</span></button><p class="timer-info">${game.seconds?`O cronômetro de ${game.seconds} segundos começa ao abrir a pergunta.`:'Esta partida está no modo sem cronômetro.'}</p></div></section>`;
    if(game.stage==='question'||game.stage==='reveal')body=questionMarkup(q);
    if(game.stage==='scores')body=`<div class="page-title"><span class="eyebrow">RODADA CONCLUÍDA</span><h1>Cada descoberta conta.</h1><p>Este é o placar após a pergunta ${game.index+1}. Todas as equipes continuam no jogo.</p></div>${scoreMarkup(true)}<div class="game-bottom"><button class="text-button" data-action="review-answer">← Rever explicação e respostas</button><button class="button" data-action="next-question">${game.index===9?'Ver resultado final':'Próxima descoberta'} <span>→</span></button></div>`;
    main.innerHTML=`<div class="play-shell">${roundHeader()}${body}</div>`;
    updateTimer();
  }
  function questionMarkup(q){
    const revealed=game.stage==='reveal',answers=game.rounds[game.index].answers,registered=answers.filter(a=>a!==null).length;
    return `<div class="question-top"><span class="eyebrow">${q.topic}</span>${!revealed&&game.seconds?`<div class="timer ${game.remaining===0?'expired':''}" id="timer"><strong><span id="timer-number">${formatTime(game.remaining)}</span><small id="timer-label">${game.remaining===0?'TEMPO ENCERRADO':game.running?'DISCUSSÃO':'PAUSADO'}</small></strong><button class="icon-button" data-action="toggle-timer" id="timer-toggle" aria-label="${game.running?'Pausar':'Retomar'} cronômetro" ${game.remaining===0?'disabled':''}>${game.running?'Ⅱ':'▶'}</button></div>`:`<span class="hint">${revealed?'Gabarito comentado':'Sem cronômetro'}</span>`}</div><h1 class="question-title">${q.question}</h1><div class="answer-options">${q.options.map((opt,i)=>`<div class="option ${revealed?(i===q.correct?'correct':'dimmed'):''}"><span class="option-letter">${'ABCD'[i]}</span><span>${opt}${revealed&&i===q.correct?' <b aria-label="Alternativa correta">✓</b>':''}</span></div>`).join('')}</div>${revealed?`<div class="explanation"><span class="eyebrow">A CIÊNCIA POR TRÁS DA RESPOSTA</span><h3>Resposta ${'ABCD'[q.correct]} · ${q.options[q.correct]}</h3><p>${q.explanation}</p>${linkSource(q.source,'Conhecer a fonte histórica ↗')}</div>${revealedTeams(q)}<div class="game-bottom"><button class="text-button" data-action="edit-answers">Corrigir registro de uma equipe</button><button class="button" data-action="show-scores">Ver placar da rodada <span>→</span></button></div>`:`<section class="register-box" aria-label="Registro de respostas"><div class="register-title"><h3>Registre a escolha de cada equipe</h3><span id="register-count">${registered} de ${game.teams.length} registradas</span></div><div class="team-responses">${game.teams.map((t,i)=>`<div class="team-answer"><div class="team-answer-name"><span class="team-color" style="--team-color:${t.color}" aria-hidden="true">${i+1}</span>${esc(t.name)}</div><div class="answer-picks" role="group" aria-label="Resposta de ${esc(t.name)}">${[0,1,2,3,-1].map(a=>`<button class="answer-pick ${a===-1?'none':''} ${answers[i]===a?'selected':''}" data-answer="${a}" data-team="${i}" aria-pressed="${answers[i]===a}" aria-label="${esc(t.name)}: ${a===-1?'sem resposta':'alternativa '+'ABCD'[a]}">${a===-1?'—':'ABCD'[a]}</button>`).join('')}</div></div>`).join('')}</div></section><div class="game-bottom"><span id="response-help">${registered===game.teams.length?'Todas as escolhas registradas. Pronto para revelar.':'Marque uma alternativa ou “—” para equipe sem resposta.'}</span><button class="button" id="reveal-button" data-action="reveal" ${registered!==game.teams.length?'disabled':''}>Revelar resposta <span>→</span></button></div>`}`;
  }
  function revealedTeams(q){return `<div class="team-responses">${game.teams.map((t,i)=>{const a=game.rounds[game.index].answers[i];return `<div class="team-answer"><div class="team-answer-name"><span class="team-color" style="--team-color:${t.color}" aria-hidden="true">${i+1}</span>${esc(t.name)}</div><span style="font-size:12px;color:${a===q.correct?'#426e35':'#85674d'}">${a===-1?'Sem resposta':`Resposta ${'ABCD'[a]}`} · ${a===q.correct?'✓ +100 pontos':'0 pontos'}</span></div>`;}).join('')}</div>`;}
  function chooseAnswer(team,answer){if(screen!=='game'||game.stage!=='question')return;game.rounds[game.index].answers[team]=answer;save();document.querySelectorAll(`[data-team="${team}"]`).forEach(el=>{const selected=Number(el.dataset.answer)===answer;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',String(selected));});const n=game.rounds[game.index].answers.filter(a=>a!==null).length;$('#register-count').textContent=`${n} de ${game.teams.length} registradas`;$('#reveal-button').disabled=n!==game.teams.length;$('#response-help').textContent=n===game.teams.length?'Todas as escolhas registradas. Pronto para revelar.':'Marque uma alternativa ou “—” para equipe sem resposta.';}
  function formatTime(n){return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;}
  function updateTimer(){if(!game)return;const n=$('#timer-number');if(!n)return;n.textContent=formatTime(game.remaining);$('#timer-label').textContent=game.remaining===0?'TEMPO ENCERRADO':game.running?'DISCUSSÃO':'PAUSADO';$('#timer-toggle').textContent=game.running?'Ⅱ':'▶';$('#timer-toggle').setAttribute('aria-label',`${game.running?'Pausar':'Retomar'} cronômetro`);$('#timer-toggle').disabled=game.remaining===0;$('#timer').classList.toggle('expired',game.remaining===0);}
  function runClock(){clearInterval(clockId);clockId=setInterval(()=>{if(!game.running)return;game.remaining=Math.max(0,Math.ceil((game.deadline-Date.now())/1000));if(game.remaining===0){game.running=false;game.deadline=null;clearInterval(clockId);save();toast('Tempo encerrado. Finalize o registro das respostas para revelar o gabarito.');}updateTimer();},200);}
  function pauseClock(){if(game?.running){game.remaining=Math.max(0,Math.ceil((game.deadline-Date.now())/1000));game.running=false;game.deadline=null;save();}clearInterval(clockId);updateTimer();}
  function reveal(){if(game.rounds[game.index].answers.some(a=>a===null))return;pauseClock();game.stage='reveal';save();render();}
  function renderResults(){const list=scores(),winners=list.filter(t=>t.score===list[0].score);main.innerHTML=`<div class="play-shell"><button class="back-link" data-action="home">← Voltar ao laboratório</button><section class="result-title"><div class="result-symbol" aria-hidden="true">✳</div><span class="eyebrow">DESAFIO CONCLUÍDO · 10 DESCOBERTAS</span><h1>A curiosidade levou vocês longe.</h1><p>Uma celebração para quem pergunta, investiga e aprende junto.</p></section><div class="winner-card"><span class="eyebrow">${winners.length>1?'PRIMEIRO LUGAR COMPARTILHADO':'EQUIPE EM PRIMEIRO LUGAR'}</span><h2>${winners.map(t=>esc(t.name)).join(' · ')}</h2><p>${list[0].score} pontos · ${list[0].score/100} de 10 acertos</p></div><div class="result-table">${scoreMarkup()}</div><div class="reflection"><span class="eyebrow">PARA LEVAR ALÉM DO LABORATÓRIO</span><p>Que barreiras ainda dificultam a participação das mulheres na ciência — e como podemos ajudar a superá-las?</p></div><div class="actions result-actions"><button class="button" data-action="setup">Jogar novamente <span>↗</span></button><button class="button secondary" data-action="home">Explorar o laboratório</button></div></div>`;}
  function rules(){openModal('Como funciona o desafio?',`<ol><li>Defina a quantidade e os nomes das equipes. Todas respondem às mesmas dez perguntas.</li><li>Leia a curiosidade e abra a pergunta. Nesse momento começa o tempo de discussão, se ativado.</li><li>Registre A, B, C ou D para cada equipe. Use “—” quando não houver resposta.</li><li>Revele o gabarito e leia a explicação com a turma. Cada acerto vale 100 pontos.</li><li>Acompanhe o placar. Empates compartilham a mesma colocação.</li></ol><p>Você conduz tudo no computador. As equipes podem responder com cartões, no papel ou indicando sua escolha ao professor.</p><div class="actions"><button class="button" data-action="close-modal">Entendi →</button></div>`);}
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
    'reveal':reveal,
    'show-scores':()=>{game.stage='scores';save();render();},
    'review-answer':()=>{game.stage='reveal';save();render();},
    'score-modal':()=>{pauseClock();openModal('O caminho até aqui.',`${scoreMarkup()}<p>O placar inclui apenas as rodadas já reveladas. O cronômetro fica pausado durante a consulta.</p>`);},
    'edit-answers':()=>confirmAction('Corrigir o registro?','O gabarito já foi apresentado à turma. Use esta opção apenas para corrigir uma escolha que foi registrada incorretamente. A pontuação será recalculada.','confirm-edit','Corrigir registro'),
    'confirm-edit':()=>{closeModal();game.stage='question';game.running=false;game.deadline=null;game.remaining=0;save();render();},
    'next-question':()=>{if(game.index===questions.length-1){game.stage='results';}else{game.index++;game.stage='curiosity';game.remaining=game.seconds;}save();render();}
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
