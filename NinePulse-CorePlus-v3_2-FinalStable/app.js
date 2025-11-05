const $=s=>document.querySelector(s); const show=e=>e.classList.remove('hidden'); const hide=e=>e.classList.add('hidden');
let USER_PHRASES=[]; fetch('phrases.json').then(r=>r.json()).then(j=>{USER_PHRASES=Array.isArray(j)?j:[]}).catch(()=>{});
let WORDS=[]; fetch('words.json').then(r=>r.json()).then(j=>{WORDS=j});
function hash(s){let h=0;for(let i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))|0;}return Math.abs(h);}
function pick3Words(seedStr){
  if(!WORDS.length) return "-";
  const k=hash(seedStr);
  const a=WORDS[k%WORDS.length];
  const b=WORDS[(k*7+13)%WORDS.length];
  let c=(k*19+29)%WORDS.length, guard=0;
  while((WORDS[c]===a||WORDS[c]===b)&&guard<WORDS.length){c=(c+1)%WORDS.length;guard++;}
  return [a,b,WORDS[c]].join(" • ");
}
const INSP={1:[{t:"Film",v:"Le Fondateur",w:"Décider et lancer simple."},{t:"Citation",v:"« Commencer, c’est déjà la moitié. »",w:"Posez la première pierre."}],2:[{t:"Musique",v:"Debussy — Clair de Lune",w:"Écoute et harmonie."},{t:"Film",v:"Intouchables",w:"La rencontre change tout."}],3:[{t:"Livre",v:"L’Alchimiste",w:"Exprimez vos rêves."},{t:"Musique",v:"Prince — Purple Rain",w:"Créativité flamboyante."}],4:[{t:"Sport",v:"Yoga Hatha",w:"Structure et souffle."},{t:"Film",v:"Le Stratège",w:"Méthode et données."}],5:[{t:"Lieu",v:"Marché local",w:"Découverte et mouvement."},{t:"Film",v:"Into the Wild",w:"Liberté et nature."}],6:[{t:"Musique",v:"Satie — Gymnopédies",w:"Beauté, soin, douceur."},{t:"Film",v:"Little Women",w:"Maison et liens."}],7:[{t:"Livre",v:"Krishnamurti — Se libérer du connu",w:"Intériorité et clarté."},{t:"Musique",v:"Arvo Pärt — Spiegel im Spiegel",w:"Silence fertile."}],8:[{t:"Film",v:"Moneyball",w:"Mesure et cap."},{t:"Livre",v:"Les 48 lois du pouvoir",w:"Responsabilité et stratégie."}],9:[{t:"Film",v:"Gran Torino",w:"Transmission."},{t:"Musique",v:"Nina Simone — Feeling Good",w:"Aboutissement et partage."}]};
const ACTS={1:["lancer un micro‑projet","écrire un objectif simple","prendre une décision"],2:["réparer un lien","proposer une coopération","dire merci"],3:["écrire 8 lignes","tourner une mini‑vidéo","chanter 1 morceau","partager une idée"],4:["organiser un tiroir","structurer un plan","classer 20 fichiers","faire un budget 15 min"],5:["marcher 20 min","tester un outil","changer de décor","appeler quelqu’un loin"],6:["cuisiner quelque chose de beau","ranger une zone","prendre des nouvelles","soigner un détail esthétique"],7:["lire 10 pages","méditer 7 min","marche silencieuse","tenir un carnet d’idées"],8:["réviser un budget","planifier 1 action clé","poser un non utile","mesurer un résultat"],9:["donner 1 coup de main","partager une ressource","finaliser un dossier","libérer un objet inutile"]};
const CONTEXT=["à la maison","au travail","dehors","en ligne","avec un ami","seul"];
const DUR=["5 min","10 min","15 min","20 min","30 min"];
function buildBigPool(){
  const list=[];
  for(let n=1;n<=9;n++){for(const a of ACTS[n]) for(const c of CONTEXT) for(const d of DUR){list.push({n, text:`${a} ${c} • ${d}`});}}
  const P=(Array.isArray(USER_PHRASES)?USER_PHRASES:[]).map(x=>typeof x==='string'?x:(x&&x.text)||"");
  const out=[];
  for(let i=0;i<24000;i++){const b=list[i%list.length]; const extra=P.length?(P[i%P.length] + " • "):""; out.push({n:b.n, text: extra + b.text});}
  return out;
}
let BIG_POOL=null; setTimeout(()=>{BIG_POOL=buildBigPool();},500);
function suggestTask(dn,lp,z,key){
  const pool=(BIG_POOL&&BIG_POOL.length)?BIG_POOL.filter(x=>x.n===dn):[];
  const list=pool.length?pool:(BIG_POOL||[]);
  if(!list.length) return "—";
  const idx = Math.abs(hash(key+'-'+lp+'-'+z)) % list.length;
  return list[idx].text;
}
const SLOT_TIPS={1:["Buvez un verre d’eau.","Écrivez votre priorité.","Rangez un micro‑espace.","Fixez un cap en une phrase."],2:["Envoyez un merci.","Demandez un avis sincère.","Offrez une écoute de 3 min.","Répondez avec douceur."],3:["Notez 3 idées.","Lisez 1 poème.","Partagez une pensée créative.","Souriez à quelqu’un."],4:["Planifiez 30 minutes.","Classez 5 fichiers.","Réglez une broutille.","Respirez en carré 1 min."],5:["Marchez 5 minutes.","Ouvrez la fenêtre.","Étirez‑vous.","Changez de pièce."],6:["Éteignez 1 distraction.","Infusez une tisane.","Rangez un coin visible.","Dites un mot chaleureux."],7:["Fermez les yeux 60 s.","Notez une question.","Respirez profondément.","Étudiez 2 paragraphes."],8:["Vérifiez une dépense.","Barrez une tâche.","Fixez une limite nette.","Décidez du prochain pas."],9:["Partagez une ressource.","Faites un don minime.","Encouragez quelqu’un.","Libérez un objet."]};
function instantTip(dn, date=new Date()){
  const slot=Math.floor((date.getHours()*60+date.getMinutes())/30);
  const arr=SLOT_TIPS[dn]||["Respirez 30 secondes."]; return arr[slot % arr.length];
}
const OSM_TYPES={1:[{amenity:"coworking_space"},{amenity:"library"},{shop:"books"}],2:[{amenity:"cafe"},{amenity:"tea"}],3:[{amenity:"theatre"},{amenity:"cinema"},{amenity:"arts_centre"}],4:[{amenity:"bank"},{amenity:"post_office"},{amenity:"townhall"}],5:[{leisure:"park"},{tourism:"viewpoint"},{leisure:"sports_centre"}],6:[{amenity:"spa"},{amenity:"beauty_salon"},{amenity:"pharmacy"}],7:[{amenity:"library"},{amenity:"place_of_worship"},{tourism:"museum"}],8:[{amenity:"bureau_de_change"},{amenity:"bank"},{shop:"department_store"}],9:[{amenity:"community_centre"},{amenity:"cinema"},{tourism:"gallery"}]};
function distanceKm(a,b,c,d){const R=6371;const toRad=x=>x*Math.PI/180;const dLat=toRad(c-a), dLon=toRad(d-b);
  const A=Math.sin(dLat/2)**2+Math.cos(toRad(a))*Math.cos(toRad(c))*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(A));}
async function findNearby(lat,lon,dn){
  const types=OSM_TYPES[dn]||OSM_TYPES[1];
  const filters=types.map(t=>{const k=Object.keys(t)[0],v=t[k];return `node["${k}"="${v}"](around:2000,${lat},${lon});`}).join("");
  const query=`[out:json][timeout:15];(${filters});out center 10;`;
  try{
    const r=await fetch("https://overpass-api.de/api/interpreter",{method:"POST",headers:{'Content-Type':'text/plain'},body:query});
    const j=await r.json();
    const arr=(j.elements||[]).filter(e=>e.tags&&e.tags.name).map(e=>{
      const la=e.lat||e.center?.lat, lo=e.lon||e.center?.lon;
      return {name:e.tags.name,dist:distanceKm(lat,lon,la,lo)};
    }).sort((a,b)=>a.dist-b.dist).slice(0,3);
    if(!arr.length){$('#placeNote').textContent="Aucun lieu trouvé à proximité (2 km).";$('#nearbyList').innerHTML="";return;}
    $('#placeNote').textContent=`Sélection alignée au chiffre du jour (${dn}).`;
    $('#nearbyList').innerHTML=arr.map(x=>`<li>${x.name} • ${x.dist.toFixed(2)} km</li>`).join("");
  }catch(e){$('#placeNote').textContent="Recherche indisponible pour le moment."; $('#nearbyList').innerHTML="";}
}
function frequencyAdvice(freq){
  const f=n=>freq[n]||0; const out=[];
  if(f(1)>=6) out.push("Beaucoup de 1 : leadership puissant. Veillez à ce que l’ego n’affecte pas vos relations ; privilégiez parfois le travail en équipe.");
  else if(f(1)>=5) out.push("1 très présent : tendance à décider seul. Restez à l’écoute et partagez le terrain.");
  else if(f(1)>=4) out.push("1 fort : tempérament de leader. Canalisez votre volonté, gardez l’ego sous contrôle.");
  else if(f(1)<=1) out.push("Peu de 1 : renforcez la confiance en vous (prise de parole, théâtre, petits défis).");
  else if(f(1)===2) out.push("1 modéré : personnalité équilibrée, ni effacée ni dominante.");
  if(f(2)>=5) out.push("2 très élevé : relations riches ; contrôlez vos limites et soyez fidèle.");
  else if(f(2)===4||f(2)===3) out.push("2 fort : alliances magnifiques ; évitez qu’on profite de votre douceur.");
  else if(f(2)===2) out.push("2 équilibré : terrain favorable au lien durable et à la coopération.");
  else if(f(2)===1) out.push("2 faible : soyez prudent dans les relations ; clarifiez vos attentes.");
  else if(f(2)===0) out.push("Absence de 2 : penchant pour la solitude ; préservez le cœur sans vous isoler.");
  if(f(3)>=5) out.push("3 très élevé : grand potentiel artistique ; simplifiez pour ne pas vous disperser.");
  else if(f(3)===4) out.push("3 fort : talent créatif ; évitez de compliquer inutilement.");
  else if(f(3)===3) out.push("3 équilibré : créativité et expression profitent à votre entourage.");
  else if(f(3)===2) out.push("3 discret : une pratique artistique régulière vous fera du bien.");
  else if(f(3)<=1) out.push("Peu de 3 : réintroduisez le jeu et la spontanéité dans votre quotidien.");
  if(f(4)>=5) out.push("4 très élevé : organisation d’élite ; ménagez des temps de repos.");
  else if(f(4)===4) out.push("4 fort : grande rigueur ; veillez à une juste valorisation.");
  else if(f(4)===3) out.push("4 présent : stabilité et constance au travail.");
  else if(f(4)===2) out.push("4 modéré : base saine ; gardez une routine claire.");
  else if(f(4)<=1) out.push("Peu de 4 : structurez avec des micro‑habitudes pour éviter la dispersion.");
  if(f(5)>=6) out.push("5 très élevé : vie nomade ; transformez les changements en force créative.");
  else if(f(5)===5||f(5)===4) out.push("5 fort : la stagnation vous étouffe ; variez les décors et les expériences.");
  else if(f(5)===3) out.push("5 présent : changements récurrents ; faites‑en un rythme assumé.");
  else if(f(5)===2) out.push("5 modéré : un changement ponctuel vous fera du bien.");
  else if(f(5)<=1) out.push("Peu de 5 : programmez des sorties pour contrer la routine.");
  if(f(6)>=5) out.push("6 très élevé : très entouré ; préservez votre temps personnel et votre santé.");
  else if(f(6)===4||f(6)===3) out.push("6 fort : relationnel chaleureux ; gardez l’équilibre corps‑esprit.");
  else if(f(6)===2) out.push("6 modéré : entretenez quelques amitiés solides ; l’humour vous porte.");
  else if(f(6)===1) out.push("6 faible : risque d’éloignement ; entretenez vos liens et vos bilans de santé.");
  else if(f(6)===0) out.push("Absence de 6 : priorité à l’équilibre et à l’hygiène de vie.");
  if(f(7)>=4) out.push("7 élevé : esprit de recherche ; écrivez, enseignez, partagez.");
  else if(f(7)===3) out.push("7 fort : sens du sacré et de l’étude ; pratique intérieure régulière.");
  else if(f(7)===2) out.push("7 modéré : intuition présente ; lecture et méditation vous soutiennent.");
  else if(f(7)===1) out.push("7 discret : approfondir vous fera grandir.");
  else if(f(7)===0) out.push("Absence de 7 : entraînez l’esprit (lectures, silence, contemplation).");
  if(f(8)>=4) out.push("8 élevé : fibre entrepreneuriale ; sens des responsabilités.");
  else if(f(8)===3) out.push("8 fort : pragmatique ; risques mesurés et éthique.");
  else if(f(8)===2) out.push("8 modéré : réaliste ; construisez votre sécurité pas à pas.");
  else if(f(8)===1) out.push("8 discret : restez terre‑à‑terre sur les engagements financiers.");
  else if(f(8)===0) out.push("Absence de 8 : minimisez les jeux d’argent ; privilégiez les efforts concrets.");
  if(f(9)>=5) out.push("9 très élevé : altruisme puissant ; gardez des limites pour ne pas vous épuiser.");
  else if(f(9)===4||f(9)===3) out.push("9 fort : communication généreuse ; choisissez des causes qui vous portent.");
  else if(f(9)===2) out.push("9 modéré : attention et service ; un terrain d’engagement simple suffit.");
  else if(f(9)===1) out.push("9 discret : développez l’écoute et l’écriture pour partager utilement.");
  else if(f(9)===0) out.push("Absence de 9 : concentrez‑vous d’abord sur votre cercle proche.");
  return out.join(' ');
}
function renderName(fullName){
  const rows=NCore.nameTableData(fullName).map(r=>`<tr><td>${r.ch}</td><td>${r.val||""}</td></tr>`).join("");
  const total=NCore.nameTableData(fullName).reduce((a,r)=>a+(r.val||0),0);
  const reduced=NCore.reduceNum(total,true);
  $('#nameTable').innerHTML=`<table class="table"><thead><tr><th>Lettre</th><th>Valeur</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><th>Total</th><th>${total} → ${reduced}</th></tr></tfoot></table>`;
  const freq=NCore.numberFrequencies(fullName);
  const header=[1,2,3,4,5,6,7,8,9].map(n=>`<th>${n}</th>`).join("");
  const counts=[1,2,3,4,5,6,7,8,9].map(n=>`<td>${freq[n]}</td>`).join("");
  $('#numFreq').innerHTML=`<table class="table"><thead><tr><th>Nombre</th>${header}</tr></thead><tbody><tr><th>Fréquence</th>${counts}</tr></tbody></table>`;
  $('#freqAdvice').textContent = frequencyAdvice(freq);
}
function astroLong(z, asc, dn){
  const base={
    "Bélier":"Élan, franchise et action directe.",
    "Taureau":"Stabilité, sens du concret et plaisir des sens.",
    "Gémeaux":"Curiosité, dialogue et polyvalence.",
    "Cancer":"Protection, mémoire et foyer.",
    "Lion":"Rayonnement, fierté et générosité.",
    "Vierge":"Méthode, service et précision.",
    "Balance":"Harmonie, diplomatie et esthétique.",
    "Scorpion":"Intensité, transformation et lucidité.",
    "Sagittaire":"Cap, exploration et convictions.",
    "Capricorne":"Responsabilité, structure et persévérance.",
    "Verseau":"Originalité, réseaux et vision d’avenir.",
    "Poissons":"Empathie, intuition et imaginaire."
  };
  const tune={
    1:"orientez votre énergie vers un démarrage simple et net.",
    2:"cherchez l’accord juste et laissez venir l’aide.",
    3:"donnez de la voix à vos idées, partagez avec légèreté.",
    4:"consolidez une base concrète, étape par étape.",
    5:"changez d’air et laissez une porte ouverte à l’imprévu.",
    6:"soignez le lien, la maison et la qualité des détails.",
    7:"ménagez un espace de silence et d’étude.",
    8:"fixez une mesure, gérez vos priorités avec calme.",
    9:"finalisez, transmettez et libérez l’inutile."
  };
  const ascPart = (asc && asc !== "—") ? ` • Ascendant ${asc} : ${base[asc]||""}` : "";
  return `${z} : ${base[z]||""} En lien avec le ${dn}, ${tune[dn]||""}${ascPart}`.trim();
}
function compute(){
  const fullName=$('#fullName').value.trim();
  const birthISO=$('#birthISO').value;
  const birthTime=$('#birthTime').value||null;
  const keep=$('#keepMasters').checked;
  if(!fullName||!birthISO){alert('Remplissez le nom complet et la date.');return;}
  const now=new Date(), key=now.toISOString().slice(0,10);
  const lp=NCore.lifePath(birthISO,keep);
  const ex=NCore.expressionNum(fullName,keep);
  const su=NCore.soulUrgeNum(fullName,keep);
  const pe=NCore.personalityNum(fullName,keep);
  const mat=NCore.maturityNum(birthISO,fullName,keep);
  const py=NCore.personalYear(birthISO, now);
  const pm=NCore.monthNumber(birthISO, now);
  const dn=NCore.dayNumber(birthISO, now, birthTime);
  $('#lifePath').textContent=lp; $('#expression').textContent=ex; $('#soulUrge').textContent=su; $('#personality').textContent=pe; $('#maturityNum').textContent=mat;
  $('#yearNum').textContent=py; $('#monthNum').textContent=pm;
  $('#yearTxt').textContent=NCore.YEAR_TEXT[py]||"";
  $('#monthTxt').textContent=NCore.DAY_TEXT[pm]||"";
  $('#todayNumber').textContent=dn;
  $('#color').textContent=NCore.COLOR[dn];
  $('#planet').textContent=NCore.PLANET[dn];
  $('#lucky').textContent=((lp+dn)%9)+1;
  $('#dayDesc').textContent=NCore.DAY_TEXT[dn];
  $('#dayLong').textContent=NCore.DAY_LONG[dn]||"";
  $('#dayNote').textContent=NCore.DAY_NOTE;
  $('#moodWords').textContent=pick3Words(key+fullName+lp);
  $('#lifePathTxt').textContent=EXPLAIN.lifePath[lp]||"";
  $('#expressionTxt').textContent=EXPLAIN.expression[ex]||"";
  $('#soulUrgeTxt').textContent=EXPLAIN.soulUrge[su]||"";
  $('#personalityTxt').textContent=EXPLAIN.personality[pe]||"";
  $('#maturityTxt').textContent=EXPLAIN.maturity[mat]||"";
  const z=NCore.zodiacSign(birthISO), asc=NCore.approxAsc(birthTime);
  $('#zodiac').textContent=z; $('#ascendant').textContent=asc;
  $('#astroTip').textContent=astroLong(z, asc, dn);
  const IN=INSP[dn][ Math.abs(hash(key+z+fullName))%INSP[dn].length ];
  $('#inspireTitle').textContent=`${IN.t} : ${IN.v}`; $('#inspireWhy').textContent=IN.w;
  renderName(fullName);
  $('#taskSuggestion').textContent=suggestTask(dn, lp, z, key);
  $('#instantTip').textContent=instantTip(dn, now);
  show($('#results'));
  if(window.__geo){findNearby(window.__geo.lat, window.__geo.lon, dn);} else{$('#placeNote').textContent="Autorisez la géolocalisation pour suggérer un lieu proche.";}
}
$('#profileForm').addEventListener('submit', e=>{e.preventDefault();compute();});
$('#btnToday')?.addEventListener('click', e=>{e.preventDefault();compute();});
$('#btnClear')?.addEventListener('click', e=>{e.preventDefault();$('#profileForm').reset();hide($('#results'));});
window.addEventListener('load',()=>{
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      pos=>{window.__geo={lat:pos.coords.latitude, lon:pos.coords.longitude};},
      _=>{window.__geo=null;},
      {enableHighAccuracy:true, timeout:8000, maximumAge:60000}
    );
  } else { window.__geo=null; }
});