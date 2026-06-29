import { motion } from 'motion/react';
import { MessageCircle, User, Heart, Sparkles } from 'lucide-react';

export default function LearnGrid() {
  const cards = [
    {
      id: 'comunicacao',
      title: 'Comunicação Clara',
      sub: 'O linguajar que atrai',
      description: 'Aprenda a falar de forma direta, profissional e assertiva que gera profunda seriedade e autoridade, sem precisar fazer trends e conteúdos virais.',
      icon: MessageCircle,
      iconBg: 'bg-[#0d1b3d] text-brand-accent border border-brand-card-border/60'
    },
    {
      id: 'conexao',
      title: 'Conexão Real',
      sub: 'Histórias que marcam',
      description: 'Como resgatar suas vivências reais e estruturá-las em narrativas humanas e conectivas que despertam interesse e geram afinidade imediata.',
      icon: User,
      iconBg: 'bg-[#0d1b3d] text-brand-accent border border-brand-card-border/60'
    },
    {
      id: 'emocoes',
      title: 'Emoções & Confiança',
      sub: 'Segurança comercial',
      description: 'Entenda os gatilhos emocionais da decisão de compra e use o diálogo acolhedor para deixar as pessoas perfeitamente confortáveis e seguras para negociar com você.',
      icon: Heart,
      iconBg: 'bg-[#0d1b3d] text-brand-accent border border-brand-card-border/60'
    },
    {
      id: 'comportamento',
      title: 'Comportamento & Retorno',
      sub: 'Público qualificado',
      description: 'Aprenda a guiar sua audiência pelo posicionamento adequado, selecionando e convertendo pessoas prontas para investir no seu trabalho e gerar retorno financeiro.',
      icon: Sparkles,
      iconBg: 'bg-[#0d1b3d] text-brand-accent border border-brand-card-border/60'
    }
  ];

  return (
    <section id="methodology-section" className="py-14 sm:py-24 bg-brand-bg border-t border-brand-card-border/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left info column */}
            <div className="lg:col-span-5 space-y-5 lg:pr-6">
              <div>
                <span className="inline-block text-[10px] sm:text-xs font-extrabold tracking-wider text-[#0d1b3d] uppercase bg-[#d9c8a9] px-3.5 py-1.5 rounded-lg shadow-[0_2px_10px_rgba(217,200,169,0.15)]">
                  O QUE VOCÊ VAI APRENDER
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight leading-tight heading-gradient">
                O que você vai aprender neste <span className="font-serif italic font-medium text-brand-accent">evento exclusivo</span>
              </h2>
              
              <p className="text-brand-muted text-xs sm:text-sm md:text-base leading-relaxed">
                Este não é um evento sobre truques de edição rápida, recortes de câmera automáticos ou formatos criativos. Este é um treinamento prático sobre como gerar conexão real e emitir uma comunicação profissional diferenciada.
              </p>
              
              <p className="text-brand-muted text-xs sm:text-sm md:text-base leading-relaxed">
                Você vai aprender a falar com o linguajar correto para se posicionar de maneira adequada no ambiente digital, atraindo clientes qualificados e transformando o seu público em oportunidades de negócios e retorno financeiro.
              </p>

              <div className="pt-3 border-l-2 border-brand-accent/30 pl-4 py-1">
                <p className="text-brand-muted font-serif italic text-xs sm:text-sm text-brand-accent leading-relaxed">
                  "A comunicação não serve para aplacar o ego com métricas de curtidas e seguidores vazias. Ela serve para construir conexões valiosas que abrem portas para novos clientes e dão sustentabilidade à sua profissão."
                </p>
              </div>
            </div>

          {/* Right 2x2 grid column */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 lg:pt-0">
            {cards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="rounded-[24px] sm:rounded-3xl border border-brand-card-border/80 bg-[#132247]/80 backdrop-blur-sm p-5 sm:p-7 md:p-8 flex flex-col justify-between hover:bg-[#132247] hover:border-brand-accent/40 hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-3 sm:space-y-4">
                    {/* Icon container - clean round shape similar to image 2 */}
                    <div className={`p-2.5 rounded-full w-10 h-10 flex items-center justify-center ${card.iconBg}`}>
                      <IconComp className="h-4 w-4 stroke-[1.5]" />
                    </div>

                    <div className="space-y-1 sm:space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-brand-dark tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-brand-muted text-[11px] sm:text-xs md:text-[13px] leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
