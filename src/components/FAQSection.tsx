import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageSquare, Phone, HelpCircle, MessageCircle } from 'lucide-react';
import { FAQItem } from '../types';

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>('q-1');

  const faqs: FAQItem[] = [
    {
      id: 'q-1',
      question: 'O que é o Conexão Além da Tela e qual é a sua principal promessa?',
      answer: 'O Conexão Além da Tela é um evento digital inédito, ao vivo e gratuito, desenhado para especialistas, líderes e profissionais liberais. A sua principal promessa é sobre CRIAR CONEXÃO real e magnética com as pessoas certas. Você aprenderá a estruturar sua comunicação utilizando princípios de narrativa da TV e do streaming, para atrair, engajar e, principalmente, se conectar com o público que valoriza o seu trabalho, gerando autoridade e retorno financeiro sem depender de algoritmos ou dancinhas.'
    },
    {
      id: 'q-3',
      question: 'Eu preciso já ter um grande público ou saber falar perfeitamente em vídeo?',
      answer: 'De forma alguma. O foco do Conexão Além da Tela é justamente lapidar e profissionalizar a sua comunicação atual. Você não precisa ter milhares de seguidores ou ser um apresentador profissional. Pelo contrário: aprenderá a se expressar com verdade e estratégia para atrair as pessoas certas (clientes de alto valor) que valorizam a profundidade e a seriedade do seu trabalho, independentemente do tamanho atual da sua audiência.'
    },
    {
      id: 'q-4',
      question: 'Para quem este evento é indicado e para quem NÃO é?',
      answer: 'Este evento é indicado para médicos, advogados, consultores, terapeutas, psicólogos, mentores, executivos e marcas pessoais que vendem serviços especializados de alto valor, onde a confiança do cliente é o fator decisivo. Ele NÃO é indicado para quem busca fórmulas de enriquecimento rápido, truques de edição mágica para viralizar com conteúdos fúteis ou quem não está disposto a construir autoridade real com integridade e elegância.'
    },
    {
      id: 'q-5',
      question: 'Como funcionará a transmissão e como recebo o meu acesso?',
      answer: 'O Conexão Além da Tela será transmitido no dia 8 de Julho (quarta-feira) às 20:30 (Horário de Brasília). A transmissão é exclusiva e fechada para inscritos. Assim que preencher o formulário nesta página, você receberá a confirmação por e-mail e terá acesso direto ao nosso Grupo VIP do WhatsApp, onde enviaremos o link oficial de acesso à sala, materiais complementares e avisos cruciais.'
    },
    {
      id: 'q-6',
      question: 'O evento será gravado? Poderei assistir depois?',
      answer: 'Não há garantia de gravação disponível. O Conexão Além da Tela foi desenhado para ser uma experiência imersiva e interativa ao vivo. A energia do encontro em tempo real, os insights práticos compartilhados no momento e o networking exclusivo do chat fazem toda a diferença para o seu aprendizado. Por isso, sugerimos fortemente que reserve a data na sua agenda imediatamente após concluir sua inscrição.'
    }
  ];

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq-section" className="py-14 sm:py-20 bg-brand-bg border-t border-brand-card-border/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* Left Column: FAQ Badge and Questions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div>
              <span className="inline-block text-[10px] sm:text-xs font-extrabold tracking-wider text-[#0d1b3d] uppercase bg-[#d9c8a9] px-3.5 py-1.5 rounded-lg shadow-[0_2px_10px_rgba(217,200,169,0.15)]">
                FAQ
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight leading-tight heading-gradient">
                Perguntas <span className="font-serif italic font-medium text-brand-accent">frequentes</span>
              </h2>
            </div>

            <div id="faq-accordions" className="space-y-3 sm:space-y-4">
              {faqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                     key={faq.id}
                     className="rounded-2xl border border-brand-card-border bg-[#132247] transition-all duration-300 shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex justify-between items-center py-3.5 px-4 sm:py-4 sm:px-6 text-left group transition-all"
                    >
                      <span className="text-xs sm:text-sm md:text-base font-semibold text-brand-dark group-hover:text-brand-accent transition-colors pr-2">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-4.5 w-4.5 text-brand-muted shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-brand-accent' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="pb-4 pt-0.5 px-4 sm:pb-5 sm:pt-1 sm:px-6 text-[11px] sm:text-xs md:text-sm text-brand-muted leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Floating Sidebar Dubious Box */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 pt-4 lg:pt-0">
            <div className="relative overflow-hidden rounded-[24px] sm:rounded-3xl border border-brand-card-border bg-[#132247] p-6 sm:p-8 md:p-10 shadow-lg">
              {/* Corner decor cutout styling like the image mockup */}
              <div className="absolute top-0 right-0 h-14 w-14 sm:h-16 sm:w-16 bg-[#101e3f] rounded-bl-full border-l border-b border-brand-card-border" />
              
              {/* Icon Container */}
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-[#d9c8a9]/10 border border-[#b8964c]/20 text-[#d9c8a9] shadow-inner">
                <HelpCircle className="h-5 sm:h-6 w-5 sm:w-6 stroke-[1.8] text-brand-accent animate-pulse" />
              </div>

              <h3 className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl font-extrabold text-[#d9c8a9] tracking-tight">
                Ainda tem dúvidas?
              </h3>
              
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-[#f3ede2]/70 leading-relaxed">
                Entre em contato pelo WhatsApp para falar diretamente com nosso suporte, tirar qualquer dúvida sobre a dinâmica e garantir sua vaga.
              </p>

              <div className="mt-6 sm:mt-8">
                <a
                  href="https://wa.me/5561995820229?text=Ola!%20Tenho%20duvidas%20sobre%20o%20evento%20Conexao%20Alem%20da%20Tela"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white py-3 sm:py-3.5 px-6 font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="h-5 w-5 fill-current shrink-0" />
                  Chamar no WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
