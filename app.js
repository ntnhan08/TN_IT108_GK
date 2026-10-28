(() => {
  'use strict';
  const bank = window.STUDIUM_BANK;
  const KEY = 'hoc-duong-it101-v1';
  const $ = id => document.getElementById(id);
  const roman = n => ['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][n];
  const letters = ['A','B','C','D'];
  const fresh = () => ({version:bank.version,answers:{},current:1,chapter:0,filter:'all'});
  let state = fresh(), ids = [], canSave = true;
  function validAnswer(a) { return a && Number.isInteger(a.selected) && a.selected >= 0 && a.selected < 4 && typeof a.confirmed === 'boolean'; }
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && saved.version === bank.version && saved.answers && typeof saved.answers === 'object') {
      for (const q of bank.questions) if (validAnswer(saved.answers[q.id])) state.answers[q.id] = {selected:saved.answers[q.id].selected,confirmed:saved.answers[q.id].confirmed};
      if (bank.questions.some(q => q.id === saved.current)) state.current = saved.current;
      if (Number.isInteger(saved.chapter) && saved.chapter >= 0 && saved.chapter <= 12) state.chapter = saved.chapter;
      if (['all','unanswered','wrong','correct'].includes(saved.filter)) state.filter = saved.filter;
    }
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (_) { canSave = false; }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); canSave = true; }
    catch (_) { canSave = false; }
    $('save-message').textContent = canSave ? '◈  Tiến độ được lưu tự động trên trình duyệt này.' : '◈  Trình duyệt đang chặn lưu tiến độ. Bài làm chỉ được giữ trong lần mở này.';
  }
  function correct(q) { const a=state.answers[q.id]; return Boolean(a?.confirmed && a.selected === q.answer); }
  function matches(q) {
    if (state.chapter && q.chapter !== state.chapter) return false;
    const a=state.answers[q.id];
    return state.filter === 'all' || (state.filter === 'unanswered' && !a?.confirmed) || (state.filter === 'wrong' && a?.confirmed && !correct(q)) || (state.filter === 'correct' && correct(q));
  }
  function recalculate(keepCurrent=false) {
    ids=bank.questions.filter(matches).map(q=>q.id);
    if (!keepCurrent && !ids.includes(state.current)) state.current=ids[0] || 0;
  }
  function currentQuestion() { return bank.questions.find(q=>q.id===state.current); }
  function renderChapters() {
    const nav=$('chapters');nav.replaceChildren();
    const picker=$('mobile-chapter');picker.replaceChildren();
    const all={id:0,title:'Toàn bộ giáo trình',count:200};
    for (const ch of [all,...bank.chapters]) {
      const option=document.createElement('option');option.value=String(ch.id);option.textContent=ch.id?`${roman(ch.id)}. ${ch.title}`:ch.title;picker.append(option);
      const btn=document.createElement('button');btn.type='button';btn.className='chapter-btn'+(state.chapter===ch.id?' active':'');
      btn.setAttribute('aria-pressed',String(state.chapter===ch.id));
      const num=document.createElement('span');num.className='roman';num.textContent=ch.id?roman(ch.id):'∞';
      const title=document.createElement('span');title.textContent=ch.title;
      const count=document.createElement('span');count.className='chapter-done';
      const done=bank.questions.filter(q=>(!ch.id||q.chapter===ch.id)&&state.answers[q.id]?.confirmed).length;
      count.textContent=done===ch.count?'✓':ch.count;btn.title=`${ch.title}: ${done}/${ch.count} câu đã xác nhận`;
      btn.append(num,title,count);btn.addEventListener('click',()=>{
        state.chapter=ch.id;state.filter='all';$('filter').value='all';state.current=0;recalculate();save();render();
      });nav.append(btn);
    }
    picker.value=String(state.chapter);
  }
  function renderStats() {
    const done=bank.questions.filter(q=>state.answers[q.id]?.confirmed).length;
    const right=bank.questions.filter(correct).length;
    $('done-count').textContent=done;$('right-count').textContent=right;$('wrong-count').textContent=done-right;
    $('progress-fill').style.width=(done/2)+'%';$('progress').setAttribute('aria-valuenow',String(done));
    $('completion').hidden=done!==200;
    $('completion-text').textContent=`Bạn trả lời đúng ${right}/200 câu (${Math.round(right/2)}%). Hãy mở bộ lọc “Câu trả lời sai” để ôn lại, hoặc làm lại một lượt mới.`;
  }
  function renderNav() {
    const index=ids.indexOf(state.current);
    $('previous').disabled=index<=0;$('next').disabled=index<0 || index>=ids.length-1;
    $('position').textContent=ids.length?`${index+1} / ${ids.length} câu trong danh sách`:'0 câu trong danh sách';
    $('map-count').textContent='200';
  }
  function renderFeedback(q) {
    const a=state.answers[q.id], box=$('feedback');box.replaceChildren();
    if (!a?.confirmed) {box.hidden=true;return;}
    const isRight=correct(q);box.className='feedback'+(isRight?'':' wrong');box.hidden=false;
    const heading=document.createElement('h3');heading.className='feedback-title';heading.textContent=isRight?'✓  Chính xác. Bạn đã hiểu đúng!':'✕  Chưa chính xác. Cùng xem lại nhé.';box.append(heading);
    if (!isRight) {
      const label=document.createElement('span');label.className='explanation-label';label.textContent=`VÌ SAO ĐÁP ÁN ${letters[a.selected]} SAI?`;
      const why=document.createElement('p');why.textContent=q.options[a.selected].reason;box.append(label,why);
    }
    const label=document.createElement('span');label.className='explanation-label';label.textContent=isRight?'GIẢI THÍCH':'ĐÁP ÁN ĐÚNG';
    const summary=document.createElement('p');summary.className='answer-summary';summary.textContent=`${letters[q.answer]}. ${q.options[q.answer].text}`;
    const explanation=document.createElement('p');explanation.textContent=q.explanation;
    const reference=document.createElement('a');reference.className='reference';reference.href=`./tai-lieu.pdf#page=${q.page}`;reference.target='_blank';reference.rel='noopener';reference.textContent=`Đối chiếu tài liệu · trang ${q.page} ↗`;
    box.append(label,summary,explanation,reference);
  }
  function renderQuestion() {
    const q=currentQuestion();
    const show=Boolean(q && ids.length);
    $('question-card').hidden=!show;$('empty-state').hidden=show;$('question-nav').hidden=!show;
    if (!show) {
      const ch=bank.chapters.find(c=>c.id===state.chapter);
      $('chapter-number').textContent=ch?`CHƯƠNG ${roman(ch.id)}`:'TOÀN BỘ GIÁO TRÌNH';
      $('chapter-title').textContent=ch?.title || 'Nhập môn Công nghệ thông tin';$('chapter-pages').textContent=ch?`Trang ${ch.pages}`:'100 trang tài liệu';
      const empty={wrong:['Chưa có câu sai trong mục này','Kết quả sai sẽ xuất hiện ở đây sau khi bạn xác nhận đáp án.'],correct:['Chưa có câu đúng trong mục này','Hãy làm bài và xác nhận để xem các câu đã trả lời đúng.'],unanswered:['Đã xác nhận hết các câu trong mục này','Bạn có thể đọc lại lời giải hoặc chuyển sang một chương khác.'],all:['Không có câu hỏi phù hợp','Chọn toàn bộ giáo trình để tiếp tục học.']};
      $('empty-title').textContent=empty[state.filter][0];$('empty-text').textContent=empty[state.filter][1];return;
    }
    const a=state.answers[q.id];const ch=bank.chapters[q.chapter-1];
    $('chapter-number').textContent=`CHƯƠNG ${roman(q.chapter)}`;$('chapter-title').textContent=ch.title;$('chapter-pages').textContent=`Trang ${ch.pages}`;
    $('question-number').textContent=`CÂU ${String(q.id).padStart(3,'0')}`;$('question-text').textContent=q.question;
    const status=$('question-status');status.className='status';
    status.textContent=a?.confirmed?(correct(q)?'Đã trả lời đúng':'Đã trả lời sai'):(a?'Đã chọn · Chưa xác nhận':'Chưa trả lời');
    if(a?.confirmed)status.classList.add(correct(q)?'correct':'wrong');else if(a)status.classList.add('pending');
    $('choice-hint').textContent=a?.confirmed?'Đã xác nhận. Xem lời giải bên dưới để ghi nhớ.':'Chọn một đáp án, rồi nhấn xác nhận.';
    $('options').replaceChildren();
    q.options.forEach((option,index)=>{
      const label=document.createElement('label');label.className='option';
      const input=document.createElement('input');input.type='radio';input.name=`q-${q.id}`;input.value=String(index);input.checked=a?.selected===index;input.disabled=Boolean(a?.confirmed);
      const badge=document.createElement('span');badge.className='option-letter';badge.textContent=letters[index];badge.setAttribute('aria-hidden','true');
      const text=document.createElement('span');text.className='option-text';text.textContent=option.text;
      input.setAttribute('aria-label',`${letters[index]}. ${option.text}`);
      label.append(input,badge,text);
      if(a?.selected===index)label.classList.add('selected');
      if(a?.confirmed) {
        label.classList.add('locked');
        if(index===q.answer) {label.classList.add('correct-answer');const mark=document.createElement('span');mark.className='option-result';mark.textContent='✓';mark.setAttribute('aria-label','Đáp án đúng');label.append(mark);}
        else if(a.selected===index) {label.classList.add('wrong-answer');const mark=document.createElement('span');mark.className='option-result';mark.textContent='✕';mark.setAttribute('aria-label','Đáp án sai');label.append(mark);}
      }
      input.addEventListener('change',()=>{
        if(state.answers[q.id]?.confirmed)return;
        state.answers[q.id]={selected:index,confirmed:false};save();
        // Preserve the focused radio so keyboard arrow navigation remains native.
        document.querySelectorAll('#options .option').forEach((el,i)=>el.classList.toggle('selected',i===index));
        status.textContent='Đã chọn · Chưa xác nhận';status.className='status pending';$('confirm').disabled=false;
      });
      $('options').append(label);
    });
    $('confirm').disabled=!a || a.confirmed;
    $('confirm').textContent=a?.confirmed?'✓ Đã xác nhận':'Xác nhận đáp án →';
    $('answer-note').textContent=a?.confirmed?'◇ Kết quả được giữ đến khi làm lại':'◇ Mỗi câu có một đáp án đúng';
    renderFeedback(q);
  }
  function render() {renderChapters();renderStats();renderQuestion();renderNav();}
  $('confirm').addEventListener('click',()=>{
    const q=currentQuestion();if(!q)return;const a=state.answers[q.id];if(!a||a.confirmed)return;
    a.confirmed=true;save();render();
    // Focus the feedback, without automatically moving to the next question.
    const title=$('feedback').querySelector('h3');if(title){title.tabIndex=-1;title.focus({preventScroll:true});if(window.innerWidth<761)$('feedback').scrollIntoView({block:'nearest',behavior:'smooth'});}
  });
  function move(delta) {const index=ids.indexOf(state.current);const target=ids[index+delta];if(!target)return;state.current=target;save();render();$('question-card').focus({preventScroll:true});if(window.innerWidth<761)$('question-card').scrollIntoView({block:'start',behavior:'smooth'});}
  $('previous').addEventListener('click',()=>move(-1));$('next').addEventListener('click',()=>move(1));
  $('mobile-chapter').addEventListener('change',()=>{state.chapter=Number($('mobile-chapter').value);state.filter='all';$('filter').value='all';state.current=0;recalculate();save();render();});
  $('filter').value=state.filter;
  $('filter').addEventListener('change',()=>{state.filter=$('filter').value;recalculate();save();render();});
  $('show-all').addEventListener('click',()=>{state.filter='all';$('filter').value='all';recalculate();save();render();});
  function renderMap() {
    $('question-map').replaceChildren();
    for(const ch of bank.chapters) {
      const section=document.createElement('section');section.className='map-section';
      const h=document.createElement('h3');h.textContent=`${roman(ch.id)}. ${ch.title}`;const grid=document.createElement('div');grid.className='map-grid';
      for(const q of bank.questions.filter(q=>q.chapter===ch.id)) {
        const a=state.answers[q.id],btn=document.createElement('button');btn.type='button';btn.className='map-item';btn.textContent=String(q.id).padStart(3,'0');
        const status=a?.confirmed?(correct(q)?'Đúng':'Sai'):(a?'Đã chọn, chưa xác nhận':'Chưa trả lời');
        btn.setAttribute('aria-label',`Câu ${q.id}: ${status}`);btn.title=`Câu ${q.id}: ${status}`;
        if(a)btn.classList.add(a.confirmed?(correct(q)?'correct':'wrong'):'pending');
        if(q.id===state.current){btn.classList.add('current');btn.setAttribute('aria-current','true');}
        btn.addEventListener('click',()=>{state.chapter=0;state.filter='all';$('filter').value='all';state.current=q.id;recalculate();save();render();$('map-dialog').close();$('question-card').focus({preventScroll:true});if(innerWidth<761)$('question-card').scrollIntoView({block:'start'});});grid.append(btn);
      }
      section.append(h,grid);$('question-map').append(section);
    }
  }
  for(const id of ['map-open','map-open-mobile']) $(id).addEventListener('click',()=>{renderMap();$('map-dialog').showModal();});
  $('mobile-controls-toggle').addEventListener('click',()=>{const open=$('mobile-controls-toggle').getAttribute('aria-expanded')!=='true';$('mobile-controls-toggle').setAttribute('aria-expanded',String(open));$('study-controls').dataset.expanded=String(open);});
  document.querySelectorAll('.close-map').forEach(b=>b.addEventListener('click',()=>$('map-dialog').close()));
  $('reset-top').addEventListener('click',()=>$('reset-dialog').showModal());
  ['reset-close','reset-cancel'].forEach(id=>$(id).addEventListener('click',()=>$('reset-dialog').close()));
  $('reset-confirm').addEventListener('click',()=>{state=fresh();$('filter').value='all';recalculate();save();render();$('reset-dialog').close();$('question-card').focus({preventScroll:true});});
  // Escape closes native dialogs; clicking outside their bounds closes them too.
  for(const id of ['map-dialog','reset-dialog']) $(id).addEventListener('click',e=>{if(e.target!==$(id))return;const r=$(id).getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$(id).close();});
  window.addEventListener('storage',event=>{
    if(event.key===KEY && event.newValue) $('save-message').textContent='◈  Tiến độ vừa thay đổi ở tab khác. Tải lại trang để dùng bản lưu mới nhất.';
  });
  recalculate();render();save();
})();
