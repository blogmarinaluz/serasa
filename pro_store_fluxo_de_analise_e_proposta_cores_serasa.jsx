import React, { useMemo, useState } from "react";

// =====================================
// PROSTORE – Fluxo de Análise e Proposta
// =====================================
// Observações:
// - Layout pensado para ser mostrado ao cliente (limpo, profissional e focado na proposta).
// - Paleta baseada nas cores da SERASA/Experian: azul escuro (#1D4F91), azul claro (#426DA9),
//   magenta (#E80070), púrpura (#C1188B) e um azul acinzentado (#8795C0).
// - Logo: usa dataURI incorporada; substitua "logoDataUri" se quiser trocar.
// - Não depende de bibliotecas externas (apenas React + Tailwind disponível no Canvas).

const logoDataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAtAAAAA7CAYAAACU3u4QAAAACXBIWXMAAAsSAAALEgHS3X78AAAgAElEQVR4nO3de3xV5Zn/8fczgQ2o2t4SgVVa2wEo0FJ4o0yY0tDq0qQyhaC2SPLvR8l5S7IrC0gZ9nJ9rQ1jX7Xv+1s8bB5q2nWmWfTzv7b2z+Zz9z2QqQmEJ4m4iRz2t3d3f3O7M7cM+fOnU0AAAB0hYbNAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAABQG2kHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

function classNames(...cls) {
  return cls.filter(Boolean).join(" ");
}

function formatBRL(value) {
  if (Number.isNaN(value) || value == null) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function Section({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="bg-white shadow-sm rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold" style={{ color: "#1D4F91" }}>{title}</h2>
        {right}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function StepBadge({ index, active, done }: { index: number; active?: boolean; done?: boolean }) {
  return (
    <div
      className={classNames(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
        done ? "bg-[#1D4F91] text-white" : active ? "ring-2 ring-[#E80070] text-[#1D4F91] bg-white" : "bg-gray-100 text-gray-500"
      )}
    >
      {done ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        index
      )}
    </div>
  );
}

function TopBar() {
  return (
    <header className="w-full bg-white/90 backdrop-blur sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <img src={logoDataUri} alt="proStore" className="h-8 w-auto" />
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="hidden sm:inline text-gray-500">Cores SERASA</span>
          <div className="flex items-center gap-1">
            <span className="inline-block w-4 h-4 rounded" style={{ background: "#1D4F91" }} />
            <span className="inline-block w-4 h-4 rounded" style={{ background: "#426DA9" }} />
            <span className="inline-block w-4 h-4 rounded" style={{ background: "#E80070" }} />
            <span className="inline-block w-4 h-4 rounded" style={{ background: "#C1188B" }} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function ProStoreApp() {
  const [step, setStep] = useState(1);

  // 1) Dados do Cliente
  const [cliente, setCliente] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
  });

  // 2) Produto
  const [produto, setProduto] = useState({
    marca: "iPhone",
    aparelho: "",
    capacidade: "128 GB",
    preco: 0,
  });

  // 3) Segurança / Termos
  const [aceitoTermos, setAceitoTermos] = useState(false);

  // 4) Resultado da Análise + Proposta Alternativa
  const [gerouAnalise, setGerouAnalise] = useState(false);
  const [entrada, setEntrada] = useState(0);
  const [parcelas, setParcelas] = useState(6);

  const saldo = useMemo(() => Math.max(0, Number(produto.preco || 0) - Number(entrada || 0)), [produto.preco, entrada]);
  const valorParcela = useMemo(() => (parcelas > 0 ? saldo / parcelas : 0), [saldo, parcelas]);

  const canGoNextFromStep1 = cliente.nome && cliente.cpf && cliente.telefone;
  const canGoNextFromStep2 = produto.aparelho && produto.preco > 0;
  const canGenerate = aceitoTermos && canGoNextFromStep1 && canGoNextFromStep2;

  function next() {
    setStep((s) => Math.min(s + 1, 4));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function gerarAnalise() {
    setGerouAnalise(true);
    setStep(4);
    if (entrada === 0 && produto.preco > 0) {
      setEntrada(Number((produto.preco * 0.1).toFixed(2))); // sugestão de 10%
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      {/* Paleta custom (sem Tailwind config) */}
      <style>{`
        .btn-primary { background:#1D4F91; color:#fff; }
        .btn-primary:hover { background:#143a69; }
        .btn-accent { background:#E80070; color:#fff; }
        .btn-accent:hover { background:#c40060; }
        .chip { background:#E1E4EF; color:#1D4F91; }
        .card-ring { box-shadow: 0 0 0 3px rgba(232,0,112,0.1); }
      `}</style>

      <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        {/* COLUNA ESQUERDA: passos e formulário */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stepper */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="grid grid-cols-4 items-center text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <StepBadge index={1} active={step === 1} done={step > 1} />
                <span className={classNames(step === 1 ? "text-[#1D4F91]" : "text-gray-500")}>Cliente</span>
              </div>
              <div className="flex items-center gap-3">
                <StepBadge index={2} active={step === 2} done={step > 2} />
                <span className={classNames(step === 2 ? "text-[#1D4F91]" : "text-gray-500")}>Produto</span>
              </div>
              <div className="flex items-center gap-3">
                <StepBadge index={3} active={step === 3} done={step > 3} />
                <span className={classNames(step === 3 ? "text-[#1D4F91]" : "text-gray-500")}>Segurança</span>
              </div>
              <div className="flex items-center gap-3">
                <StepBadge index={4} active={step === 4} done={false} />
                <span className={classNames(step === 4 ? "text-[#1D4F91]" : "text-gray-500")}>Análise</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <Section title="1) Dados do Cliente">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Nome completo *</label>
                  <input className="w-full rounded-xl border-gray-300 focus:ring-[#E80070] focus:border-[#E80070]" placeholder="Digite o nome" value={cliente.nome} onChange={(e) => setCliente({ ...cliente, nome: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">CPF *</label>
                  <input className="w-full rounded-xl border-gray-300 focus:ring-[#E80070] focus:border-[#E80070]" placeholder="000.000.000-00" value={cliente.cpf} onChange={(e) => setCliente({ ...cliente, cpf: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Telefone *</label>
                  <input className="w-full rounded-xl border-gray-300 focus:ring-[#E80070] focus:border-[#E80070]" placeholder="(00) 00000-0000" value={cliente.telefone} onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">E-mail</label>
                  <input className="w-full rounded-xl border-gray-300 focus:ring-[#E80070] focus:border-[#E80070]" placeholder="email@exemplo.com" value={cliente.email} onChange={(e) => setCliente({ ...cliente, email: e.target.value })} />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">Campos marcados com * são obrigatórios</div>
                <button disabled={!canGoNextFromStep1} onClick={next} className={classNames("px-5 py-2 rounded-xl btn-primary disabled:opacity-50 disabled:cursor-not-allowed")}>Continuar</button>
              </div>
            </Section>
          )}

          {step === 2 && (
            <Section title="2) Dados do Produto">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Marca</label>
                  <select className="w-full rounded-xl border-gray-300 focus:ring-[#E80070] focus:border-[#E80070]" value={produto.marca} onChange={(e) => setProduto({ ...produto, marca: e.target.value })}>
                    <option>iPhone</option>
                    <option>Samsung</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Nome do aparelho / modelo *</label>
                  <input className="w-full rounded-xl border-gray-300 focus:ring-[#E80070] focus:border-[#E80070]" placeholder="Ex.: iPhone 15 Pro" value={produto.aparelho} onChange={(e) => setProduto({ ...produto, aparelho: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Capacidade</label>
                  <select className="w-full rounded-xl border-gray-300 focus:ring-[#E80070] focus:border-[#E80070]" value={produto.capacidade} onChange={(e) => setProduto({ ...produto, capacidade: e.target.value })}>
                    <option>128 GB</option>
                    <option>256 GB</option>
                    <option>512 GB</option>
                    <option>1 TB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Valor do aparelho (R$) *</label>
                  <input type="number" min={0} step={0.01} className="w-full rounded-xl border-gray-300 focus:ring-[#E80070] focus:border-[#E80070]" placeholder="0,00" value={produto.preco} onChange={(e) => setProduto({ ...produto, preco: Number(e.target.value) })} />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button onClick={back} className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700">Voltar</button>
                <button disabled={!canGoNextFromStep2} onClick={next} className={classNames("px-5 py-2 rounded-xl btn-primary disabled:opacity-50 disabled:cursor-not-allowed")}>Continuar</button>
              </div>
            </Section>
          )}

          {step === 3 && (
            <Section
              title="3) Segurança, Leis e Transparência"
              right={<span className="chip px-2 py-1 rounded-full text-xs">LGPD</span>}
            >
              <div className="space-y-3 text-sm leading-relaxed text-gray-700">
                <p>
                  • Seus dados são tratados conforme a Lei Geral de Proteção de Dados (LGPD). Utilizamos somente o necessário para a análise e proposta.
                </p>
                <p>
                  • A análise por boleto pode não ser autorizada. Nesses casos, sugerimos alternativa com <strong>Entrada + pagamento do restante no boleto</strong>, mantendo a previsibilidade e a segurança.
                </p>
                <p>
                  • Emissão de boletos por instituição financeira parceira. Vencimentos e condições serão exibidos com total clareza antes da confirmação.
                </p>
                <label className="flex items-start gap-3 mt-4">
                  <input type="checkbox" checked={aceitoTermos} onChange={(e) => setAceitoTermos(e.target.checked)} className="mt-1" />
                  <span>
                    Declaro que li e concordo com os termos acima e autorizo o uso dos meus dados para a análise de crédito e emissão de proposta.
                  </span>
                </label>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button onClick={back} className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700">Voltar</button>
                <button disabled={!canGenerate} onClick={gerarAnalise} className={classNames("px-5 py-2 rounded-xl btn-accent disabled:opacity-50 disabled:cursor-not-allowed")}>Gerar análise</button>
              </div>
            </Section>
          )}

          {step === 4 && (
            <Section title="4) Resultado da Análise & Proposta ao Cliente">
              {/* Resultado */}
              <div className="rounded-xl p-4 mb-6 border card-ring bg-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#FFF0F6", color: "#E80070" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm uppercase tracking-wide font-semibold text-gray-500">Status da análise</div>
                    <div className="text-xl font-semibold text-gray-900">Não autorizado no boleto</div>
                    <div className="text-sm text-gray-600 mt-1">Mas encontramos uma alternativa segura para viabilizar a compra:</div>
                  </div>
                </div>
              </div>

              {/* Proposta Alternativa */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <div className="text-sm uppercase tracking-wide font-semibold text-gray-500">Configurar alternativa</div>
                  <h3 className="text-lg font-semibold mt-1" style={{ color: "#1D4F91" }}>Entrada + restante no boleto</h3>

                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Valor de entrada (R$)</label>
                      <input type="number" min={0} step={0.01} className="w-full rounded-xl border-gray-300 focus:ring-[#E80070] focus:border-[#E80070]" value={entrada} onChange={(e) => setEntrada(Number(e.target.value))} />
                      <p className="text-xs text-gray-500 mt-1">Dica: recomendamos a partir de {formatBRL(Number(produto.preco || 0) * 0.1)} (10%).</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Quantidade de boletos</label>
                      <input type="number" min={1} max={24} className="w-full rounded-xl border-gray-300 focus:ring-[#E80070] focus:border-[#E80070]" value={parcelas} onChange={(e) => setParcelas(Math.max(1, Math.min(24, Number(e.target.value))))} />
                      <p className="text-xs text-gray-500 mt-1">Defina entre 1 e 24.</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs chip">Sem consulta adicional</span>
                    <span className="px-3 py-1 rounded-full text-xs chip">Boleto bancário</span>
                  </div>
                </div>

                {/* RESUMO LINPO PARA MOSTRAR AO CLIENTE */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <div className="text-sm uppercase tracking-wide font-semibold text-gray-500">Resumo da proposta</div>
                  <h3 className="text-lg font-semibold mt-1" style={{ color: "#1D4F91" }}>{produto.marca} {produto.aparelho} • {produto.capacidade}</h3>

                  <dl className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-gray-600">Valor do aparelho</dt>
                      <dd className="font-medium">{formatBRL(Number(produto.preco || 0))}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-gray-600">Entrada</dt>
                      <dd className="font-medium">{formatBRL(Number(entrada || 0))}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-gray-600">Saldo a pagar no boleto</dt>
                      <dd className="font-semibold" style={{ color: "#E80070" }}>{formatBRL(saldo)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-gray-600">Quantidade de boletos</dt>
                      <dd className="font-medium">{parcelas}x</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-gray-600">Valor por boleto</dt>
                      <dd className="font-semibold" style={{ color: "#1D4F91" }}>{formatBRL(valorParcela)}</dd>
                    </div>
                  </dl>

                  <div className="mt-6 grid sm:grid-cols-2 gap-3">
                    <button onClick={() => window.print()} className="px-4 py-3 rounded-xl btn-primary w-full">Imprimir / PDF</button>
                    <button onClick={() => navigator.clipboard?.writeText(`Proposta: ${produto.marca} ${produto.aparelho} ${produto.capacidade} — Preço ${formatBRL(produto.preco)} — Entrada ${formatBRL(entrada)} — ${parcelas}x de ${formatBRL(valorParcela)} no boleto.`)} className="px-4 py-3 rounded-xl btn-accent w-full">Copiar Proposta</button>
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    * Valores calculados automaticamente com base no preço informado do aparelho. Sujeito à validação e disponibilidade.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button onClick={() => setStep(1)} className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700">Refazer</button>
                <div className="text-sm text-gray-500">Cliente: <span className="font-medium text-gray-700">{cliente.nome || "—"}</span> • Contato: {cliente.telefone || "—"}</div>
              </div>
            </Section>
          )}
        </div>

        {/* COLUNA DIREITA: cartão limpo para "modo apresentação" */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white to-[#F6F8FF] border border-gray-100 rounded-2xl p-5">
            <div className="text-sm uppercase tracking-wide font-semibold text-gray-500">Modo apresentação</div>
            <h3 className="text-lg font-semibold mt-1" style={{ color: "#1D4F91" }}>Tela para mostrar ao cliente</h3>
            <p className="text-sm text-gray-600 mt-2">Quando a análise não for autorizada no boleto, use esta proposta alternativa já formatada.</p>

            <div className="mt-4 p-4 rounded-xl border bg-white">
              <div className="text-sm text-gray-500">Produto</div>
              <div className="font-semibold text-gray-900">{produto.marca} {produto.aparelho || "—"} • {produto.capacidade}</div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-[#1D4F91]/5">
                  <div className="text-gray-600">Preço</div>
                  <div className="font-semibold" style={{ color: "#1D4F91" }}>{formatBRL(Number(produto.preco || 0))}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#E80070]/5">
                  <div className="text-gray-600">Entrada</div>
                  <div className="font-semibold" style={{ color: "#E80070" }}>{formatBRL(Number(entrada || 0))}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#C1188B]/5">
                  <div className="text-gray-600">Saldo</div>
                  <div className="font-semibold" style={{ color: "#C1188B" }}>{formatBRL(saldo)}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#426DA9]/5">
                  <div className="text-gray-600">{parcelas} boletos de</div>
                  <div className="font-semibold" style={{ color: "#426DA9" }}>{formatBRL(valorParcela)}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button onClick={() => window.print()} className="px-4 py-2 rounded-xl btn-primary w-full">Imprimir</button>
              <button onClick={() => setStep(4)} className="px-4 py-2 rounded-xl bg-gray-100 w-full">Ir para proposta</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-sm uppercase tracking-wide font-semibold text-gray-500">Dicas rápidas</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 list-disc pl-5">
              <li>Mantenha a proposta em uma única tela para facilitar a compreensão do cliente.</li>
              <li>Use a impressão para gerar PDF em segundos com o mesmo layout.</li>
              <li>Se o valor de entrada for alto demais, reduza e aumente o número de boletos.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
