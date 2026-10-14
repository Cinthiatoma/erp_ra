const ST_FIN=[["Emitir nota","warn"],["Nota emitida","info"],["Pendente pagamento","bad"],["Pagamento recebido","ok"],["Não se aplica","na"]];
const ST_IMP=[["Pendente pagamento","bad"],["Pago","ok"],["Não se aplica","na"]];
const ST_TAR=[["A fazer","gray"],["Em andamento","info"],["Concluída","ok"],["Cancelada","na"]];
const PRIO=["Alta","Média","Baixa"];
const TIPOS=["Mensal","Projeto"];
const brl=v=>(+v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const uid=()=>Math.random().toString(36).slice(2,9);
const fmt=v=>(+v||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
const parse=s=>{const n=parseFloat(String(s).replace(/\./g,"").replace(",","."));return isNaN(n)?0:n};
const dt=s=>s?s.split("-").reverse().map((x,i)=>i===2?x.slice(2):x).join("/"):"";
const MESES=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const hoje=new Date();
const ymd=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");

const NOMES=[["Prefeitura de Alumínio","Mensal"],["Prefeitura de Boituva","Mensal"],["Câmara de Boituva","Mensal"],["Câmara de Hortolândia","Projeto"],["Câmara de Porangaba","Projeto"],["Câmara de Itu","Projeto"],["Câmara de Iperó","Mensal"],["CECAM","Mensal"],["ELO Editora","Mensal"],["Infinity Software","Mensal"],["Infinity Sistem","Mensal"],["Sondotécnica","Projeto"],["Prefeitura de Fartura","Projeto"],["Câmara de Mairinque","Projeto"]];
const padrao=()=>({clientes:NOMES.map(([nome,tipo])=>({id:uid(),nome,tipo,dia:5,valor:10000,pct:8.3})),tarefas:[],fin:{}});
let S=padrao(), tab="tarefas", mes=ymd(hoje), filtroTar="Todas", filtroResp="Todos";
const RESP=["Jesse","Gabriela","Cinthia"];

/* ---------- persistência: banco compartilhado (db) com cópia local ---------- */
const dd=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
function amostra(){
  const c=i=>S.clientes[i%S.clientes.length].id;
  return [
   [0,"Atualizar cadastro de servidores","Importar planilha de servidores e conferir matrículas.","Alta","Em andamento",-6,3,"Jesse"],
   [1,"Corrigir relatório de empenhos","Totais do relatório mensal não batem com o sistema contábil.","Alta","A fazer",-2,-1,"Gabriela"],
   [2,"Treinamento da equipe","Treinamento remoto de 2h para o setor administrativo.","Média","A fazer",1,7,"Cinthia"],
   [3,"Levantamento de requisitos","Reuniões com as áreas para mapear necessidades do projeto.","Alta","Em andamento",-10,12,"Cinthia"],
   [4,"Protótipo das telas","Desenhar telas principais para validação do cliente.","Média","Em andamento",-4,9,"Gabriela"],
   [5,"Migração de dados legados","Migrar base antiga para o novo sistema.","Alta","A fazer",2,20,"Jesse"],
   [6,"Ajuste de permissões de usuários","Revisar perfis de acesso e remover usuários inativos.","Baixa","Concluída",-15,-8,"Jesse"],
   [7,"Integração com sistema de boletos","Gerar arquivo de remessa automaticamente.","Média","A fazer",0,15,"Gabriela"],
   [8,"Publicar nova versão do portal","Deploy da versão 2.3 e testes de aceitação.","Alta","Concluída",-12,-3,"Cinthia"],
   [9,"Documentação do módulo de vendas","Escrever manual de uso com capturas de tela.","Baixa","A fazer",3,25,"Cinthia"],
   [11,"Laudo de monitoramento","Consolidar leituras do trimestre em relatório.","Média","Em andamento",-5,5,"Jesse"],
   [12,"Configurar ambiente de homologação","Servidor de testes e carga inicial de dados.","Média","A fazer",1,10,"Gabriela"]
  ].map(([i,tarefa,desc,prioridade,status,ini,prev,resp])=>({id:uid(),cliente:c(i),tarefa,desc,prioridade,status,inicio:dd(ini),previsao:dd(prev),resp}));
}
function extras(){
  const c=i=>S.clientes[i%S.clientes.length].id;
  return [
   [2,"Enviar proposta de renovação de contrato","Proposta com novos valores aguardando retorno do jurídico.","Alta","Em andamento",-12,-4,"Jesse"],
   [7,"Corrigir falha na geração de folha","Erro de arredondamento nos descontos de INSS.","Alta","A fazer",-9,-7,"Cinthia"],
   [4,"Revisão final do projeto","Conferir entregáveis e preparar termo de aceite.","Alta","Em andamento",-3,2,"Jesse"],
   [10,"Backup e verificação do servidor","Rotina de backup e teste de restauração.","Média","A fazer",-1,2,"Gabriela"],
   [6,"Atualizar manual do usuário","Incluir as novas telas na documentação.","Baixa","A fazer",0,2,"Cinthia"]
  ].map(([i,tarefa,desc,prioridade,status,ini,prev,resp])=>({id:uid(),cliente:c(i),tarefa,desc,prioridade,status,inicio:dd(ini),previsao:dd(prev),resp}));
}
function extras3(){
  const c=i=>S.clientes[i%S.clientes.length].id;
  return [
   [1,"Emitir relatório mensal de atendimentos","Relatório vence hoje e precisa ser enviado ao cliente.","Alta","Em andamento",-5,0,"Gabriela"],
   [9,"Atualizar certificado digital","Renovação do certificado antes do vencimento.","Média","A fazer",-2,0,"Jesse"],
   [13,"Enviar cronograma revisado","Cronograma atualizado para aprovação do cliente.","Alta","A fazer",-1,0,"Cinthia"],
   [3,"Conferir pendências da fatura","Atraso de vários dias aguardando retorno do cliente.","Média","A fazer",-10,-5,"Gabriela"],
   [11,"Preparar apresentação do projeto","Apresentação para a reunião de daqui a 2 dias.","Alta","Em andamento",-4,2,"Cinthia"]
  ].map(([i,tarefa,desc,prioridade,status,ini,prev,resp])=>({id:uid(),cliente:c(i),tarefa,desc,prioridade,status,inicio:dd(ini),previsao:dd(prev),resp}));
}
function seed(){
  if(S.seeded&&S.ex2&&S.ex3)return;
  S.seeded=1;
  if(!S.tarefas.length&&S.clientes.length)S.tarefas=amostra();
  if(!S.ex2&&S.clientes.length){S.ex2=1;S.tarefas.push(...extras())}
  if(!S.ex3&&S.clientes.length){S.ex3=1;S.tarefas.push(...extras3())}
  salvar();
}
let docRef=null;
const setSync=t=>document.getElementById("sync").textContent=t;
async function carregar(){
  try{const l=localStorage.getItem("erp_ra");if(l)S=JSON.parse(l)}catch(e){}
  seed();
  render();
  try{
    const db=await claude.use("db");
    if(db){docRef=db.doc("erp/state");
      const snap=await docRef.get();
      if(snap.exists&&snap.data().json){S=JSON.parse(snap.data().json);seed();render()}else{salvar()}
      docRef.onSnapshot(s=>{if(s.exists&&!s.metadata.hasPendingWrites&&s.data().json){const n=s.data().json;if(n!==JSON.stringify(S)){S=JSON.parse(n);if(!dlg.open)render()}}});
      setSync("Dados salvos na nuvem");return}
  }catch(e){}
  setSync("Dados salvos neste navegador");
}
let tmr;
function salvar(){
  const j=JSON.stringify(S);
  try{localStorage.setItem("erp_ra",j)}catch(e){}
  clearTimeout(tmr);
  tmr=setTimeout(async()=>{if(docRef){try{await docRef.set({json:j})}catch(e){setSync("Erro ao salvar na nuvem")}}},400);
}

/* ---------- financeiro por mês ---------- */
function reg(cid,m=mes){
  S.fin[m]=S.fin[m]||{};
  return S.fin[m][cid]=S.fin[m][cid]||{};
}
function linha(c,m=mes){
  const r=(S.fin[m]||{})[c.id]||{};
  const valor=r.valor??c.valor, pct=r.pct??c.pct;
  const imp=valor*pct/100;
  return {valor,pct,imp,liq:valor-imp,status:r.status||"Emitir nota",impStatus:r.impStatus||"Pendente pagamento"};
}
const cls=(lista,v)=>(lista.find(x=>x[0]===v)||[0,"na"])[1];
const opts=(lista,v)=>lista.map(x=>`<option${x[0]===v?" selected":""}>${x[0]}</option>`).join("");
const optsS=(arr,v)=>arr.map(x=>`<option${x===v?" selected":""}>${x}</option>`).join("");

function vFinanceiro(){
  const [a,m]=mes.split("-").map(Number);
  const L=S.clientes.map(c=>({c,...linha(c)}));
  const ativos=L.filter(l=>l.status!=="Não se aplica");
  const tot=k=>ativos.reduce((s,l)=>s+l[k],0);
  const aReceber=ativos.filter(l=>l.status!=="Pagamento recebido").reduce((s,l)=>s+l.valor,0);
  const impPend=ativos.filter(l=>l.impStatus==="Pendente pagamento").reduce((s,l)=>s+l.imp,0);
  const emitir=ativos.filter(l=>l.status==="Emitir nota").length;
  return `<div class="bar"><h2>Financeiro</h2>
   <div class="mes"><button class="btn" data-a="mes" data-d="-1" aria-label="Mês anterior">‹</button><b>${MESES[m-1]} ${a}</b><button class="btn" data-a="mes" data-d="1" aria-label="Próximo mês">›</button></div>
   <button class="btn" data-a="hoje">Mês atual</button></div>
  <div class="kpis">
   <div class="kpi"><span>Total de notas no mês</span><b>${brl(tot("valor"))}</b></div>
   <div class="kpi"><span>A receber</span><b>${brl(aReceber)}</b></div>
   <div class="kpi"><span>Impostos pendentes</span><b>${brl(impPend)}</b></div>
   <div class="kpi"><span>Notas a emitir</span><b>${emitir}</b></div></div>
  <div class="wrap"><table><thead><tr><th>Cliente</th><th>Emitir nota dia</th><th class="n">Valor da nota</th><th class="n">% imposto</th><th class="n">Vl imposto</th><th class="n">Vl líquido</th><th>Status</th><th>Impostos</th></tr></thead><tbody>
  ${L.map(l=>`<tr><td>${esc(l.c.nome)}</td>
   <td><input class="dia" type="number" min="1" max="31" value="${l.c.dia}" data-a="cdia" data-id="${l.c.id}"></td>
   <td class="n"><input class="num" type="text" inputmode="decimal" value="${fmt(l.valor)}" data-a="fv" data-id="${l.c.id}"></td>
   <td class="n"><input class="pct" type="number" step="0.1" value="${l.pct}" data-a="fp" data-id="${l.c.id}"></td>
   <td class="n">${brl(l.imp)}</td><td class="n">${brl(l.liq)}</td>
   <td><select class="st s-${cls(ST_FIN,l.status)}" data-a="fs" data-id="${l.c.id}">${opts(ST_FIN,l.status)}</select></td>
   <td><select class="st s-${cls(ST_IMP,l.impStatus)}" data-a="fi" data-id="${l.c.id}">${opts(ST_IMP,l.impStatus)}</select></td></tr>`).join("")||`<tr><td colspan="8" class="empty">Cadastre clientes para controlar o financeiro.</td></tr>`}
  </tbody><tfoot><tr><td colspan="2">Total</td><td class="n">${brl(tot("valor"))}</td><td></td><td class="n">${brl(tot("imp"))}</td><td class="n">${brl(tot("liq"))}</td><td colspan="2"></td></tr></tfoot></table></div>
  <p class="note">Status e impostos são guardados separadamente para cada mês. Valor e % de imposto são definidos para ${MESES[m-1]}; o dia de emissão vale para todos os meses. Use "Não se aplica" quando não houver cobrança no mês (comum em projetos).</p>`;
}

/* ---------- clientes ---------- */
function vClientes(){
  return `<div class="bar"><h2>Clientes</h2><button class="btn p" data-a="novoC">Novo cliente</button></div>
  <div class="wrap"><table><thead><tr><th>Nome</th><th>Tipo de contrato</th><th>Emitir nota dia</th><th></th></tr></thead><tbody>
  ${S.clientes.map(c=>`<tr><td><input value="${esc(c.nome)}" data-a="cn" data-id="${c.id}"></td>
   <td><select data-a="ct" data-id="${c.id}">${optsS(TIPOS,c.tipo)}</select></td>
   <td><input class="dia" type="number" min="1" max="31" value="${c.dia}" data-a="cdia" data-id="${c.id}"></td>
   
   
   <td><button class="btn d" data-a="delC" data-id="${c.id}">Excluir</button></td></tr>`).join("")||`<tr><td colspan="4" class="empty">Nenhum cliente. Clique em "Novo cliente".</td></tr>`}
  </tbody></table></div>
  <p class="note">O valor da nota e o % de imposto são definidos mês a mês na aba Financeiro.</p>`;
}

/* ---------- tarefas ---------- */
function dias(t){
  if(!t.previsao)return "";
  const d=Math.round((new Date(t.previsao+"T00:00")-new Date(ymd(hoje)+"-"+String(hoje.getDate()).padStart(2,"0")+"T00:00"))/864e5);
  if(t.status==="Concluída"||t.status==="Cancelada")return `<span class="tag">—</span>`;
  return d<0?`<span class="tag s-bad">${-d} dia(s) de atraso</span>`:d===0?`<span class="tag s-bad">Hoje</span>`:d<=3?`<span class="tag s-warn">${d} dia(s)</span>`:`<span class="tag">${d} dia(s)</span>`;
}
function vTarefas(){
  const nome=id=>(S.clientes.find(c=>c.id===id)||{}).nome||"—";
  const lista=S.tarefas.filter(t=>(filtroTar==="Todas"||t.status===filtroTar)&&(filtroResp==="Todos"||t.resp===filtroResp)).sort((a,b)=>(a.previsao||"9").localeCompare(b.previsao||"9"));
  return `<div class="bar"><h2>Tarefas</h2>
   <select data-a="filtro" aria-label="Filtrar por status"><option>Todas</option>${ST_TAR.map(x=>`<option${filtroTar===x[0]?" selected":""}>${x[0]}</option>`).join("")}</select>
   <button class="btn p" data-a="novaT">Nova tarefa</button></div>
  <div class="chips" style="margin-bottom:12px">${["Todos",...RESP].map(r=>`<button class="chip${filtroResp===r?" on":""}" data-a="resp" data-v="${r}">${r}${r==="Todos"?"":" ("+S.tarefas.filter(t=>t.resp===r).length+")"}</button>`).join("")}</div>
  <div class="wrap"><table><thead><tr><th>Cliente</th><th>Tarefa</th><th>Prioridade</th><th>Status</th><th>Dias para entrega</th><th>Início</th><th>Previsão</th><th>Responsável</th><th></th></tr></thead><tbody>
  ${lista.map(t=>`<tr><td>${esc(nome(t.cliente))}</td><td title="${esc(t.desc)}"><b>${esc(t.tarefa)}</b></td><td class="${t.prioridade==="Alta"?"pa":t.prioridade==="Média"?"pm":""}">${t.prioridade}</td>
   <td><select class="st s-${cls(ST_TAR,t.status)}" data-a="ts" data-id="${t.id}">${opts(ST_TAR,t.status)}</select></td><td>${dias(t)}</td>
   <td class="dt">${dt(t.inicio)}</td><td class="dt">${dt(t.previsao)}</td>
   <td>${esc(t.resp)}</td>
   <td><button class="btn" data-a="editT" data-id="${t.id}">Editar</button></td></tr>`).join("")||`<tr><td colspan="9" class="empty">Nenhuma tarefa${filtroTar!=="Todas"?" com este status":" cadastrada"}.</td></tr>`}
  </tbody></table></div>`;
}

/* ---------- diálogos ---------- */
const dlg=document.getElementById("dlg"), frm=document.getElementById("frm");
frm.addEventListener("click",e=>{const b=e.target.closest("[data-r]");if(!b)return;frm.elements.resp.value=b.dataset.r;frm.querySelectorAll("[data-r]").forEach(x=>x.classList.toggle("on",x===b))});
function formTarefa(t){
  const n=!t;t=t||{cliente:S.clientes[0]?.id,prioridade:"Média",status:"A fazer",inicio:hoje.toISOString().slice(0,10)};
  frm.innerHTML=`<h3>${n?"Nova tarefa":"Editar tarefa"}</h3><div class="f">
   <label>Cliente<select name="cliente">${S.clientes.map(c=>`<option value="${c.id}"${c.id===t.cliente?" selected":""}>${esc(c.nome)}</option>`).join("")}</select></label>
   <div class="w" style="display:flex;flex-direction:column;gap:5px;font-size:12px;color:var(--mute);font-weight:600">Responsável<div class="chips">${RESP.map(r=>`<button type="button" class="chip${t.resp===r?" on":""}" data-r="${r}">${r}</button>`).join("")}</div><input type="hidden" name="resp" value="${esc(t.resp)}"></div>
   <label class="w">Tarefa<input name="tarefa" required value="${esc(t.tarefa)}"></label>
   <label class="w">Descrição<textarea name="desc" rows="3">${esc(t.desc)}</textarea></label>
   <label>Prioridade<select name="prioridade">${optsS(PRIO,t.prioridade)}</select></label>
   <label>Status<select name="status">${opts(ST_TAR,t.status)}</select></label>
   <label>Data de início<input type="date" name="inicio" value="${t.inicio||""}"></label>
   <label>Previsão de entrega<input type="date" name="previsao" value="${t.previsao||""}"></label></div>
   <div class="acts">${n?"":`<button class="btn d" value="del" formnovalidate style="margin-right:auto">Excluir</button>`}<button class="btn" value="x" formnovalidate>Cancelar</button><button class="btn p" value="ok">Salvar</button></div>`;
  frm.onsubmit=e=>{
    const v=e.submitter?.value;
    if(v==="del"){S.tarefas=S.tarefas.filter(x=>x.id!==t.id)}
    else if(v==="ok"){const o=Object.fromEntries(new FormData(frm));if(n)S.tarefas.push({id:uid(),...o});else Object.assign(t,o)}
    else return;
    salvar();render();
  };
  dlg.showModal();
}
function formCliente(){
  frm.innerHTML=`<h3>Novo cliente</h3><div class="f"><label class="w">Nome<input name="nome" required></label>
   <label>Tipo de contrato<select name="tipo">${optsS(TIPOS,"Mensal")}</select></label>
   <label>Emitir nota dia<input type="number" name="dia" min="1" max="31" value="5"></label>
   
   </div>
   <div class="acts"><button class="btn" value="x" formnovalidate>Cancelar</button><button class="btn p" value="ok">Adicionar</button></div>`;
  frm.onsubmit=e=>{
    if(e.submitter?.value!=="ok")return;
    const o=Object.fromEntries(new FormData(frm));
    S.clientes.push({id:uid(),nome:o.nome,tipo:o.tipo,dia:+o.dia,valor:0,pct:8.3});
    salvar();render();
  };
  dlg.showModal();
}

/* ---------- eventos ---------- */
const app=document.getElementById("app");
function mudaMes(d){let [a,m]=mes.split("-").map(Number);m+=d;if(m<1){m=12;a--}if(m>12){m=1;a++}mes=a+"-"+String(m).padStart(2,"0")}
function acao(e){
  const el=e.target.closest("[data-a]");if(!el)return;
  const a=el.dataset.a,id=el.dataset.id,v=el.value;
  const c=S.clientes.find(x=>x.id===id), t=S.tarefas.find(x=>x.id===id);
  if(e.type==="click"){
    if(a==="mes"){mudaMes(+el.dataset.d);render()}
    else if(a==="hoje"){mes=ymd(hoje);render()}
    else if(a==="resp"){filtroResp=el.dataset.v;render()}
    else if(a==="novoC")formCliente();
    else if(a==="novaT"){if(!S.clientes.length)return alert("Cadastre um cliente antes.");formTarefa()}
    else if(a==="editT")formTarefa(t);
    else if(a==="delC"&&confirm(`Excluir "${c.nome}"? O histórico financeiro dele também será removido.`)){
      S.clientes=S.clientes.filter(x=>x.id!==id);Object.values(S.fin).forEach(m=>delete m[id]);S.tarefas=S.tarefas.filter(x=>x.cliente!==id);salvar();render()}
    return;
  }
  if(e.type!=="change")return;
  if(a==="filtro"){filtroTar=v;return render()}
  if(a==="fs")reg(id).status=v;
  else if(a==="fi")reg(id).impStatus=v;
  else if(a==="fv")reg(id).valor=parse(v);
  else if(a==="fp")reg(id).pct=+v||0;
  else if(a==="cdia")c.dia=+v||1;
  else if(a==="cn")c.nome=v;
  else if(a==="ct")c.tipo=v;
  else if(a==="cv")c.valor=parse(v);
  else if(a==="cp")c.pct=+v||0;
  else if(a==="ts")t.status=v;
  salvar();render();
}
app.addEventListener("click",acao);app.addEventListener("change",acao);

function render(){
  const y=window.scrollY;
  document.getElementById("nav").innerHTML=[["tarefas","Tarefas"],["financeiro","Financeiro"],["clientes","Clientes"]].map(([k,n])=>`<button class="${tab===k?"on":""}" data-tab="${k}">${n}</button>`).join("");
  app.innerHTML=tab==="financeiro"?vFinanceiro():tab==="tarefas"?vTarefas():vClientes();
  window.scrollTo(0,y);
}
document.getElementById("nav").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(b){tab=b.dataset.tab;render()}});
carregar();
