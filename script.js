const texts={
  easy:[
    {display:"今日はいい天気です。",html:"<ruby>今日<rt>きょう</rt></ruby>はいい<ruby>天気<rt>てんき</rt></ruby>です。",romaji:"kyou wa ii tenki desu."},
    {display:"毎日少しずつ練習します。",html:"<ruby>毎日<rt>まいにち</rt></ruby><ruby>少<rt>すこ</rt></ruby>しずつ<ruby>練習<rt>れんしゅう</rt></ruby>します。",romaji:"mainichi sukoshi zutsu renshuu shimasu."},
    {display:"ゆっくり正確に打ちましょう。",html:"ゆっくり<ruby>正確<rt>せいかく</rt></ruby>に<ruby>打<rt>う</rt></ruby>ちましょう。",romaji:"yukkuri seikaku ni uchimashou."}
  ],
  normal:[
    {display:"新しいことを学ぶ時間は、いつも楽しいものです。",html:"<ruby>新<rt>あたら</rt></ruby>しいことを<ruby>学<rt>まな</rt></ruby>ぶ<ruby>時間<rt>じかん</rt></ruby>は、いつも<ruby>楽<rt>たの</rt></ruby>しいものです。",romaji:"atarashii koto wo manabu jikan wa, itsumo tanoshii mono desu."},
    {display:"正確なタイピングを続けると、自然に速くなります。",html:"<ruby>正確<rt>せいかく</rt></ruby>なタイピングを<ruby>続<rt>つづ</rt></ruby>けると、<ruby>自然<rt>しぜん</rt></ruby>に<ruby>速<rt>はや</rt></ruby>くなります。",romaji:"seikaku na taipingu wo tsuzukeru to, shizen ni hayaku narimasu."},
    {display:"小さな努力の積み重ねが、大きな自信につながります。",html:"<ruby>小<rt>ちい</rt></ruby>さな<ruby>努力<rt>どりょく</rt></ruby>の<ruby>積<rt>つ</rt></ruby>み<ruby>重<rt>かさ</rt></ruby>ねが、<ruby>大<rt>おお</rt></ruby>きな<ruby>自信<rt>じしん</rt></ruby>につながります。",romaji:"chiisana doryoku no tsumikasane ga, ookina jishin ni tsunagarimasu."}
  ],
  hard:[
    {display:"好奇心を持って挑戦すれば、日常の景色も少し違って見えてきます。",html:"<ruby>好奇心<rt>こうきしん</rt></ruby>を<ruby>持<rt>も</rt></ruby>って<ruby>挑戦<rt>ちょうせん</rt></ruby>すれば、<ruby>日常<rt>にちじょう</rt></ruby>の<ruby>景色<rt>けしき</rt></ruby>も<ruby>少<rt>すこ</rt></ruby>し<ruby>違<rt>ちが</rt></ruby>って<ruby>見<rt>み</rt></ruby>えてきます。",romaji:"koukishin wo motte chousen sureba, nichijou no keshiki mo sukoshi chigatte miete kimasu."},
    {display:"完璧を目指すよりも、失敗から学びながら前へ進むことが大切です。",html:"<ruby>完璧<rt>かんぺき</rt></ruby>を<ruby>目指<rt>めざ</rt></ruby>すよりも、<ruby>失敗<rt>しっぱい</rt></ruby>から<ruby>学<rt>まな</rt></ruby>びながら<ruby>前<rt>まえ</rt></ruby>へ<ruby>進<rt>すす</rt></ruby>むことが<ruby>大切<rt>たいせつ</rt></ruby>です。",romaji:"kanpeki wo mezasu yorimo, shippai kara manabinagara mae e susumu koto ga taisetsu desu."},
    {display:"集中力と継続する力を身につければ、難しい課題にも落ち着いて取り組めます。",html:"<ruby>集中力<rt>しゅうちゅうりょく</rt></ruby>と<ruby>継続<rt>けいぞく</rt></ruby>する<ruby>力<rt>ちから</rt></ruby>を<ruby>身<rt>み</rt></ruby>につければ、<ruby>難<rt>むずか</rt></ruby>しい<ruby>課題<rt>かだい</rt></ruby>にも<ruby>落<rt>お</rt></ruby>ち<ruby>着<rt>つ</rt></ruby>いて<ruby>取<rt>と</rt></ruby>り<ruby>組<rt>く</rt></ruby>めます。",romaji:"shuuchuuryoku to keizoku suru chikara wo mi ni tsukereba, muzukashii kadai ni mo ochitsuite torikumemasu."}
  ]
};
const $=selector=>document.querySelector(selector);const prompt=$("#prompt"),japanese=$("#japanese"),box=$("#typebox"),hint=$("#hint"),bar=$("#bar"),wpm=$("#wpm"),accuracy=$("#accuracy"),timer=$("#timer"),modal=$("#modal");
let mode="easy",letterCase="lower",passage=null,text="",targets=[],typed=[],attempts=0,started=0,clock,last="",mistakeTimer=null;
function choose(){let pool=texts[mode].filter(item=>item.display!==last);if(!pool.length)pool=texts[mode];passage=pool[Math.floor(Math.random()*pool.length)];last=passage.display;return passage}
function draw(){prompt.replaceChildren(...[...text].map((character,index)=>{const span=document.createElement("span");span.textContent=character;if(index<typed.length)span.className=typed[index]===character?"correct":"wrong";if(index===typed.length)span.classList.add("current");return span}))}
function seconds(){return started?Math.max(1,Math.floor((Date.now()-started)/1000)):0}
function update(){const elapsed=seconds(),correct=typed.length;accuracy.textContent=attempts?Math.round(correct/attempts*100):100;wpm.textContent=started?Math.round(correct/5/(elapsed/60)):0;timer.textContent=elapsed;bar.style.width=typed.length/text.length*100+"%"}
function begin(){if(started)return;started=Date.now();hint.classList.add("hide");clock=setInterval(update,1000)}
function finish(){clearInterval(clock);update();$("#rw").textContent=wpm.textContent;$("#ra").textContent=accuracy.textContent+"%";$("#rt").textContent=timer.textContent+"s";setTimeout(()=>{modal.hidden=false;$("#again").focus()},250)}
function applyLetterCase(value){return letterCase==="upper"?value.toUpperCase():value.toLowerCase()}
function generateTargets(base){const patterns=[["cha","tya"],["chu","tyu"],["cho","tyo"],["chi","ti"],["shi","si"],["tsu","tu"],["ja","zya"],["ju","zyu"],["jo","zyo"],["ji","zi"]],results=new Set();function walk(index,current){if(index>=base.length){results.add(current);return}for(const group of patterns){const hit=group.find(value=>base.startsWith(value,index));if(hit){group.forEach(value=>walk(index+hit.length,current+value));return}}const character=base[index],next=base[index+1]||"";if(character==="n"&&!/[aiueony]/.test(next))walk(index+1,current+"nn");walk(index+1,current+character)}walk(0,"");return [...results].map(applyLetterCase)}
function typedText(){return typed.join("")}
function setTextForInput(input=typedText()){text=targets.find(target=>target.startsWith(input))||targets[0]}
function showMistake(){box.classList.add("mistake");clearTimeout(mistakeTimer);mistakeTimer=setTimeout(()=>box.classList.remove("mistake"),180)}
function reset(){clearInterval(clock);clearTimeout(mistakeTimer);choose();targets=generateTargets(passage.romaji);text=targets[0];japanese.innerHTML=passage.html;typed=[];attempts=0;started=0;modal.hidden=true;box.classList.remove("mistake");hint.classList.remove("hide");wpm.textContent=0;accuracy.textContent=100;timer.textContent=0;bar.style.width=0;draw();box.focus()}
document.addEventListener("keydown",event=>{if(!modal.hidden||event.ctrlKey||event.metaKey||event.altKey)return;if(event.key==="Escape"){reset();return}if(event.key==="Backspace"){event.preventDefault();typed.pop();setTextForInput();draw();update();return}if(event.key.length!==1)return;event.preventDefault();begin();const key=applyLetterCase(event.key),nextInput=typedText()+key;if(targets.some(target=>target.startsWith(nextInput))){attempts++;typed.push(key);setTextForInput(nextInput);box.classList.remove("mistake");draw();update();if(targets.includes(nextInput))finish();return}attempts++;showMistake();update()});
document.querySelectorAll(".mode").forEach(button=>button.addEventListener("click",()=>{document.querySelector(".mode.on").classList.remove("on");button.classList.add("on");mode=button.dataset.mode;last="";reset()}));
document.querySelectorAll(".case-button").forEach(button=>button.addEventListener("click",()=>{if(letterCase===button.dataset.case)return;document.querySelector(".case-button.on").classList.remove("on");document.querySelectorAll(".case-button").forEach(item=>item.setAttribute("aria-pressed",String(item===button)));button.classList.add("on");letterCase=button.dataset.case;targets=generateTargets(passage.romaji);typed=typed.map(applyLetterCase);setTextForInput();draw();update();box.focus()}));
box.addEventListener("click",()=>box.focus());$("#reset").addEventListener("click",reset);$("#again").addEventListener("click",reset);reset();
