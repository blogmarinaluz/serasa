
"use client";
import React, { useMemo, useState } from "react";

const onlyDigits = (s: string = "") => s.replace(/[^0-9]/g, "");
function maskCPF(v: string){ const d = onlyDigits(v).slice(0,11); let r=d; if(r.length>3) r = r.slice(0,3)+"."+r.slice(3); if(r.length>7) r = r.slice(0,7)+"."+r.slice(7); if(r.length>11) r = r.slice(0,11)+"-"+r.slice(11); return r; }
function maskPhone(v: string){ const d = onlyDigits(v).slice(0,11); if(d.length<=2) return `(${d}`; if(d.length<=6) return `(${d.slice(0,2)}) ${d.slice(2)}`; if(d.length<=10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`; return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7,11)}`; }

function classNames(...cls: (string|false|undefined)[]) { return cls.filter(Boolean).join(" "); }
function formatBRL(value: number){ if (Number.isNaN(value) || value == null) return "R$ 0,00"; return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value); }

function Section({ title, children, right }:{ title:string; children:React.ReactNode; right?:React.ReactNode }) {
  return (<div className="bg-white shadow-sm rounded-2xl border border-gray-100">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <h2 className="text-lg font-semibold" style={{ color: "var(--serasa-blue)" }}>{title}</h2>{right}
    </div><div className="p-6">{children}</div></div>);
}

function StepBadge({ index, active, done }:{ index:number; active?:boolean; done?:boolean }){
  return (<div className={classNames("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold", done ? "bg-[var(--serasa-blue)] text-white" : active ? "ring-2 ring-[var(--serasa-magenta)] text-[var(--serasa-blue)] bg-white" : "bg-gray-100 text-gray-500")}>
    {done ? (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>) : index}
  </div>);
}

function TopBar(){
  return (<header className="w-full bg-white/90 backdrop-blur sticky top-0 z-40 border-b border-gray-100">
    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
      <img src="/prostore-logo.png" alt="proStore" className="h-8 w-auto" />
      <div className="ml-auto flex items-center gap-2 text-sm">
        <span className="hidden sm:inline text-gray-500">Cores SERASA</span>
        <div className="flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded" style={{ background: "var(--serasa-blue)" }} />
          <span className="inline-block w-4 h-4 rounded" style={{ background: "var(--serasa-blue-2)" }} />
          <span className="inline-block w-4 h-4 rounded" style={{ background: "var(--serasa-magenta)" }} />
          <span className="inline-block w-4 h-4 rounded" style={{ background: "var(--serasa-purple)" }} />
        </div>
      </div>
    </div>
  </header>);
}

export default function ProStoreApp(){
  const [step, setStep] = useState(1);
  const [cliente, setCliente] = useState({ nome: "", cpf: "", email: "", telefone: "" });
  const [produto, setProduto] = useState({ marca: "iPhone", aparelho: "", capacidade: "128 GB", preco: 0 });
  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [entrada, setEntrada] = useState(0);
  const [parcelas, setParcelas] = useState(6);

  const saldo = useMemo(() => Math.max(0, Number(produto.preco || 0) - Number(entrada || 0)), [produto.preco, entrada]);
  const valorParcela = useMemo(() => (parcelas > 0 ? saldo / parcelas : 0), [saldo, parcelas]);

  const canGoNextFromStep1 = Boolean(cliente.nome && cliente.cpf && cliente.telefone && cliente.cpf.length >= 14);
  const canGoNextFromStep2 = Boolean(produto.aparelho && Number(produto.preco) > 0);
  const canGenerate = aceitoTermos && canGoNextFromStep1 && canGoNextFromStep2;

  function next(){ setStep(s => Math.min(s+1, 4)); }
  function back(){ setStep(s => Math.max(s-1, 1)); }
  function gerarAnalise(){ setStep(4); if(entrada===0 && produto.preco>0){ setEntrada(Number((Number(produto.preco)*0.1).toFixed(2))); } }

  return (<div className="min-h-screen bg-gray-50">
    <TopBar />
    <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="grid grid-cols-4 items-center text-xs sm:text-sm">
            <div className="flex items-center gap-3"><StepBadge index={1} active={step===1} done={step>1} /><span className={classNames(step===1 ? "text-[var(--serasa-blue)]" : "text-gray-500")}>Cliente</span></div>
            <div className="flex items-center gap-3"><StepBadge index={2} active={step===2} done={step>2} /><span className={classNames(step===2 ? "text-[var(--serasa-blue)]" : "text-gray-500")}>Produto</span></div>
            <div className="flex items-center gap-3"><StepBadge index={3} active={step===3} done={step>3} /><span className={classNames(step===3 ? "text-[var(--serasa-blue)]" : "text-gray-500")}>Segurança</span></div>
            <div className="flex items-center gap-3"><StepBadge index={4} active={step===4} /><span className={classNames(step===4 ? "text-[var(--serasa-blue)]" : "text-gray-500")}>Análise</span></div>
          </div>
        </div>

        {step===1 && (<Section title="1) Dados do Cliente">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-700 mb-1">Nome completo *</label>
              <input className="w-full rounded-xl border-gray-300 focus:ring-[var(--serasa-magenta)] focus:border-[var(--serasa-magenta)]" placeholder="Digite o nome" value={cliente.nome} onChange={(e)=> setCliente({...cliente, nome: e.target.value})} /></div>
            <div><label className="block text-sm text-gray-700 mb-1">CPF *</label>
              <input className="w-full rounded-xl border-gray-300 focus:ring-[var(--serasa-magenta)] focus:border-[var(--serasa-magenta)]" placeholder="000.000.000-00" value={cliente.cpf} onChange={(e)=> setCliente({...cliente, cpf: maskCPF(e.target.value)})} /></div>
            <div><label className="block text-sm text-gray-700 mb-1">Telefone *</label>
              <input className="w-full rounded-xl border-gray-300 focus:ring-[var(--serasa-magenta)] focus:border-[var(--serasa-magenta)]" placeholder="(00) 00000-0000" value={cliente.telefone} onChange={(e)=> setCliente({...cliente, telefone: maskPhone(e.target.value)})} /></div>
            <div><label className="block text-sm text-gray-700 mb-1">E-mail</label>
              <input className="w-full rounded-xl border-gray-300 focus:ring-[var(--serasa-magenta)] focus:border-[var(--serasa-magenta)]" placeholder="email@exemplo.com" value={cliente.email} onChange={(e)=> setCliente({...cliente, email: e.target.value})} /></div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">Campos marcados com * são obrigatórios</div>
            <button disabled={!canGoNextFromStep1} onClick={next} className={classNames("px-5 py-2 rounded-xl btn-primary disabled:opacity-50 disabled:cursor-not-allowed")}>Continuar</button>
          </div>
        </Section>)}

        {step===2 && (<Section title="2) Dados do Produto">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-700 mb-1">Marca</label>
              <select className="w-full rounded-xl border-gray-300 focus:ring-[var(--serasa-magenta)] focus:border-[var(--serasa-magenta)]" value={produto.marca} onChange={(e)=> setProduto({...produto, marca: e.target.value})}><option>iPhone</option><option>Samsung</option></select></div>
            <div><label className="block text-sm text-gray-700 mb-1">Nome do aparelho / modelo *</label>
              <input className="w-full rounded-xl border-gray-300 focus:ring-[var(--serasa-magenta)] focus:border-[var(--serasa-magenta)]" placeholder="Ex.: iPhone 15 Pro" value={produto.aparelho} onChange={(e)=> setProduto({...produto, aparelho: e.target.value})} /></div>
            <div><label className="block text-sm text-gray-700 mb-1">Capacidade</label>
              <select className="w-full rounded-xl border-gray-300 focus:ring-[var(--serasa-magenta)] focus:border-[var(--serasa-magenta)]" value={produto.capacidade} onChange={(e)=> setProduto({...produto, capacidade: e.target.value})}><option>128 GB</option><option>256 GB</option><option>512 GB</option><option>1 TB</option></select></div>
            <div><label className="block text-sm text-gray-700 mb-1">Valor do aparelho (R$) *</label>
              <input type="number" min={0} step={0.01} className="w-full rounded-xl border-gray-300 focus:ring-[var(--serasa-magenta)] focus:border-[var(--serasa-magenta)]" placeholder="0,00" value={produto.preco} onChange={(e)=> setProduto({...produto, preco: Number(e.target.value)})} /></div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={back} className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700">Voltar</button>
            <button disabled={!canGoNextFromStep2} onClick={next} className={classNames("px-5 py-2 rounded-xl btn-primary disabled:opacity-50 disabled:cursor-not-allowed")}>Continuar</button>
          </div>
        </Section>)}

        {step===3 && (<Section title="3) Segurança, Leis e Transparência" right={<span className="chip px-2 py-1 rounded-full text-xs">LGPD</span>}>
          <div className="space-y-3 text-sm leading-relaxed text-gray-700">
            <p>• Seus dados são tratados conforme a Lei Geral de Proteção de Dados (LGPD). Utilizamos somente o necessário para a análise e proposta.</p>
            <p>• A análise por boleto pode não ser autorizada. Nesses casos, sugerimos alternativa com <strong>Entrada + pagamento do restante no boleto</strong>, mantendo a previsibilidade e a segurança.</p>
            <p>• Emissão de boletos por instituição financeira parceira. Vencimentos e condições serão exibidos com total clareza antes da confirmação.</p>
            <label className="flex items-start gap-3 mt-4"><input type="checkbox" checked={aceitoTermos} onChange={(e)=> setAceitoTermos(e.target.checked)} className="mt-1" /><span>Declaro que li e concordo com os termos acima e autorizo o uso dos meus dados para a análise de crédito e emissão de proposta.</span></label>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={back} className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700">Voltar</button>
            <button disabled={!canGenerate} onClick={gerarAnalise} className={classNames("px-5 py-2 rounded-xl btn-accent disabled:opacity-50 disabled:cursor-not-allowed")}>Gerar análise</button>
          </div>
        </Section>)}

        {step===4 && (<Section title="4) Resultado da Análise & Proposta ao Cliente">
          <div className="rounded-xl p-4 mb-6 border card-ring bg-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#FFF0F6", color: "var(--serasa-magenta)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              </div>
              <div><div className="text-sm uppercase tracking-wide font-semibold text-gray-500">Status da análise</div>
                <div className="text-xl font-semibold text-gray-900">Não autorizado no boleto</div>
                <div className="text-sm text-gray-600 mt-1">Mas encontramos uma alternativa segura para viabilizar a compra:</div></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="text-sm uppercase tracking-wide font-semibold text-gray-500">Configurar alternativa</div>
              <h3 className="text-lg font-semibold mt-1" style={{ color: "var(--serasa-blue)" }}>Entrada + restante no boleto</h3>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Valor de entrada (R$)</label>
                  <input type="number" min={0} step={0.01} className="w-full rounded-xl border-gray-300 focus:ring-[var(--serasa-magenta)] focus:border-[var(--serasa-magenta)]" value={entrada} onChange={(e)=> setEntrada(Number(e.target.value))} />
                  <p className="text-xs text-gray-500 mt-1">Dica: recomendamos a partir de {formatBRL(Number(produto.preco || 0) * 0.1)} (10%).</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Quantidade de parcelas</label>
                  <select className="w-full rounded-xl border-gray-300 focus:ring-[var(--serasa-magenta)] focus:border-[var(--serasa-magenta)]" value={parcelas} onChange={(e)=> setParcelas(Number(e.target.value))}>
                    {Array.from({length:12}, (_,i)=>i+1).map(n => <option key={n} value={n}>{n}x</option>)}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Defina entre 1x e 12x.</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs chip">Sem consulta adicional</span>
                <span className="px-3 py-1 rounded-full text-xs chip">Boleto bancário</span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="text-sm uppercase tracking-wide font-semibold text-gray-500">Resumo da proposta</div>
              <h3 className="text-lg font-semibold mt-1" style={{ color: "var(--serasa-blue)" }}>{produto.marca} {produto.aparelho} • {produto.capacidade}</h3>
              <dl className="mt-4 space-y-3">
                <div className="flex items-center justify-between"><dt className="text-gray-600">Valor do aparelho</dt><dd className="font-medium">{formatBRL(Number(produto.preco || 0))}</dd></div>
                <div className="flex items-center justify-between"><dt className="text-gray-600">Entrada</dt><dd className="font-medium">{formatBRL(Number(entrada || 0))}</dd></div>
                <div className="flex items-center justify-between"><dt className="text-gray-600">Saldo a pagar no boleto</dt><dd className="font-semibold" style={{ color: "var(--serasa-magenta)" }}>{formatBRL(saldo)}</dd></div>
                <div className="flex items-center justify-between"><dt className="text-gray-600">Quantidade de parcelas</dt><dd className="font-medium">{parcelas}x</dd></div>
                <div className="flex items-center justify-between"><dt className="text-gray-600">Valor por parcela</dt><dd className="font-semibold" style={{ color: "var(--serasa-blue)" }}>{formatBRL(valorParcela)}</dd></div>
              </dl>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <button onClick={()=> window.print()} className="px-4 py-3 rounded-xl btn-primary w-full">Imprimir / PDF</button>
                <button onClick={()=> navigator.clipboard?.writeText(`Proposta: ${produto.marca} ${produto.aparelho} ${produto.capacidade} — Preço ${formatBRL(Number(produto.preco||0))} — Entrada ${formatBRL(Number(entrada||0))} — ${parcelas}x de ${formatBRL(valorParcela)} no boleto.`)} className="px-4 py-3 rounded-xl btn-accent w-full">Copiar Proposta</button>
              </div>
              <p className="text-xs text-gray-500 mt-4">* Valores calculados automaticamente com base no preço informado do aparelho. Sujeito à validação e disponibilidade.</p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={()=> setStep(1)} className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700">Refazer</button>
            <div className="text-sm text-gray-500">Cliente: <span className="font-medium text-gray-700">{cliente.nome || "—"}</span> • Contato: {cliente.telefone || "—"}</div>
          </div>
        </Section>)}
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-white to-[#F6F8FF] border border-gray-100 rounded-2xl p-5">
          <div className="text-sm uppercase tracking-wide font-semibold text-gray-500">Modo apresentação</div>
          <h3 className="text-lg font-semibold mt-1" style={{ color: "var(--serasa-blue)" }}>Tela para mostrar ao cliente</h3>
          <p className="text-sm text-gray-600 mt-2">Quando a análise não for autorizada no boleto, use esta proposta alternativa já formatada.</p>
          <div className="mt-4 p-4 rounded-xl border bg-white">
            <div className="text-sm text-gray-500">Produto</div>
            <div className="font-semibold text-gray-900">{produto.marca} {produto.aparelho || "—"} • {produto.capacidade}</div>
            <div className="mt-3">
              <label className="block text-xs text-gray-600 mb-1">Parcelas (1x a 12x)</label>
              <select className="w-full rounded-xl border-gray-300 focus:ring-[var(--serasa-magenta)] focus:border-[var(--serasa-magenta)]" value={parcelas} onChange={(e)=> setParcelas(Number(e.target.value))}>
                {Array.from({length:12}, (_,i)=>i+1).map(n => <option key={n} value={n}>{n}x</option>)}
              </select>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-[color:var(--serasa-blue)]/5"><div className="text-gray-600">Preço</div><div className="font-semibold" style={{ color: "var(--serasa-blue)" }}>{formatBRL(Number(produto.preco || 0))}</div></div>
              <div className="p-3 rounded-xl bg-[color:var(--serasa-magenta)]/5"><div className="text-gray-600">Entrada</div><div className="font-semibold" style={{ color: "var(--serasa-magenta)" }}>{formatBRL(Number(entrada || 0))}</div></div>
              <div className="p-3 rounded-xl bg-[color:var(--serasa-purple)]/5"><div className="text-gray-600">Saldo</div><div className="font-semibold" style={{ color: "var(--serasa-purple)" }}>{formatBRL(saldo)}</div></div>
              <div className="p-3 rounded-xl bg-[color:var(--serasa-blue-2)]/5"><div className="text-gray-600">{parcelas} parcelas de</div><div className="font-semibold" style={{ color: "var(--serasa-blue-2)" }}>{formatBRL(valorParcela)}</div></div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={()=> window.print()} className="px-4 py-2 rounded-xl btn-primary w-full">Imprimir</button>
            <button onClick={()=> {}} className="px-4 py-2 rounded-xl bg-gray-100 w-full">Ir para proposta</button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="text-sm uppercase tracking-wide font-semibold text-gray-500">Dicas rápidas</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 list-disc pl-5">
            <li>Mantenha a proposta em uma única tela para facilitar a compreensão do cliente.</li>
            <li>Use a impressão para gerar PDF em segundos com o mesmo layout.</li>
            <li>Se o valor de entrada for alto demais, reduza e aumente o número de parcelas.</li>
          </ul>
        </div>
      </div>
    </main>
  </div>);
}
