import { useState, useEffect, startTransition, lazy, Suspense } from 'react';
import {
  Calendar,
  Clock,
  Tv,
  Users,
  Check,
  Sparkles,
  MessageCircle,
  UserCheck,
  ChevronRight,
  Award,
  BookOpen,
  Mic
} from 'lucide-react';
import { ParticipantData } from './types';
import { initMetaTracking } from './lib/meta-tracking';

const LearnGrid = lazy(() => import('./components/LearnGrid'));
const FAQSection = lazy(() => import('./components/FAQSection'));
const EnrollmentModal = lazy(() => import('./components/EnrollmentModal'));

const CAROUSEL_IMAGES = [
  {
    src: "/images/speaker/sthefanny-studio.webp",
    alt: "Sthefanny Loredo no estúdio de rádio",
    label: "Estúdio de Rádio"
  },
  {
    src: "/images/speaker/sthefanny-g1-reportagem.webp",
    alt: "Sthefanny Loredo em reportagem no G1",
    label: "Reportagem G1"
  },
  {
    src: "/images/speaker/sthefanny-jornal-nacional.webp",
    alt: "Sthefanny Loredo no Jornal Nacional",
    label: "Jornal Nacional"
  },
  {
    src: "/images/speaker/sthefanny-evento-1.webp",
    alt: "Sthefanny Loredo no estúdio Conecta Brasil",
    label: "Conecta Brasil"
  },
  {
    src: "/images/speaker/sthefanny-evento-2.webp",
    alt: "Sthefanny Loredo nos bastidores da TV",
    label: "Bastidores de TV"
  },
  {
    src: "/images/speaker/sthefanny-evento-3.webp",
    alt: "Sthefanny Loredo no estúdio do Fantástico",
    label: "Estúdio Fantástico",
    objectPosition: "center 22%"
  }
];

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [shouldLoadModal, setShouldLoadModal] = useState<boolean>(false);
  const [participant, setParticipant] = useState<ParticipantData | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const preloadCarousel = () => {
      CAROUSEL_IMAGES.forEach((image) => {
        const img = new Image();
        img.src = image.src;
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadCarousel);
    } else {
      setTimeout(preloadCarousel, 2000);
    }
  }, []);

  useEffect(() => {
    void initMetaTracking();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('storywork_participant');
    if (saved) {
      try {
        setParticipant(JSON.parse(saved));
        setShouldLoadModal(true);
      } catch (e) {
        console.error('Falha ao parsear participante', e);
      }
    }
  }, []);

  const handleRegistrationSuccess = (data: ParticipantData) => {
    localStorage.setItem('storywork_participant', JSON.stringify(data));
    setParticipant(data);
  };

  const handleResetRegistration = () => {
    localStorage.removeItem('storywork_participant');
    setParticipant(null);
  };

  const openRegisterModal = () => {
    setShouldLoadModal(true);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0d1b3d] font-sans text-[#f3ede2]/90 selection:bg-[#d9c8a9] selection:text-[#0d1b3d] overflow-x-hidden pb-32 md:pb-28">
      
      {/* Floating Registration Header Banner */}
      {participant && (
        <div id="vip-status-header" className="bg-[#d9c8a9] text-[#0d1b3d] py-2 px-3 sm:py-2.5 sm:px-4 text-center text-[11px] sm:text-xs font-bold relative z-50 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-b border-[#b8964c]/30">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse text-[#0d1b3d] shrink-0" />
              <span>Você é VIP! Inscrição confirmada para 8 de Julho.</span>
            </div>
            
            <div className="flex items-center gap-2 text-[9.5px] xs:text-xs">
              <span className="hidden sm:inline opacity-30 select-none">|</span>
              <button 
                type="button"
                onClick={() => setIsModalOpen(true)} 
                className="underline hover:text-[#0d1b3d]/80 transition-colors font-black cursor-pointer uppercase tracking-wider text-[9px] xs:text-[10.5px]"
              >
                Visualizar Ingresso
              </button>
              <span className="opacity-30 select-none">•</span>
              <button 
                type="button"
                onClick={handleResetRegistration} 
                className="opacity-70 hover:opacity-100 transition-opacity font-bold cursor-pointer text-[9px] xs:text-[10.5px]"
                title="Fazer uma nova inscrição"
              >
                Nova Inscrição
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL HEADER BAR - Elegant, responsive, fully optimized for all devices with emphasized GRATUITO and integrated date/time info */}
      <header id="main-header" className="sticky top-0 z-40 w-full bg-[#0d1b3d]/95 backdrop-blur-md border-b border-[#b8964c]/40 py-3 sm:py-4 md:py-5 px-3 sm:px-6 md:px-12 transition-all shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo Brand Column */}
          <a href="#hero-section" className="flex flex-col items-start group shrink-0 min-w-0">
            <img
              src="/images/conexao-alem-da-tela-logo.png"
              alt="Conexão Além da Tela"
              width={520}
              height={277}
              decoding="async"
              fetchPriority="high"
              className="h-14 xs:h-16 sm:h-[4.5rem] md:h-20 lg:h-24 w-auto object-contain object-left transition-opacity group-hover:opacity-90"
            />
            <span className="text-[7px] sm:text-[9.5px] uppercase font-bold tracking-widest text-[#f3ede2]/80 leading-none mt-0.5 sm:mt-1 hidden xs:block">
              Por Sthefanny Loredo
            </span>
          </a>

          {/* Right side information cluster - Beautifully responsive & distributed */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
            
            {/* Live Schedule Info (Fully Optimized per-screetype for maximum legibility) */}
            <div className="flex items-center gap-1.5 sm:gap-3 text-[#f3ede2]/80">
              {/* Calendar & Date */}
              <div className="flex items-center gap-1 text-[10px] xs:text-[11px] sm:text-[13px] font-black text-white">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-[#b8964c] stroke-[2.5]" />
                <span className="hidden sm:inline">8 de Julho</span>
                <span className="inline sm:hidden">08/Jul</span>
              </div>

              {/* Central Divider Dot */}
              <span className="text-[#b8964c]/70 font-black text-[10px] sm:text-xs select-none">•</span>

              {/* Clock & Time */}
              <div className="flex items-center gap-1 text-[10px] xs:text-[11px] sm:text-[13px] font-black text-white">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-[#b8964c] stroke-[2.5]" />
                <span>20h30</span>
              </div>
            </div>

            {/* Separator Line for screens with room */}
            <div className="h-5 sm:h-6 w-[1.5px] bg-[#b8964c]/30 hidden sm:block" />

            {/* 100% Online & GRATUITO Badge (Modern high-contrast capsule) */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-white/10 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-[#b8964c]/40 shadow-sm shrink-0">
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[#f3ede2]/90 hidden md:inline">
                100% Online •
              </span>
              <span className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider text-[#d9c8a9] flex items-center gap-1">
                <span className="hidden xs:inline">Online • </span>
                <span className="bg-[#b8964c] text-[#0d1b3d] px-1 sm:px-2 py-0.5 rounded-md font-black shadow-xs transform hover:scale-105 transition-transform duration-200">
                  GRATUITO
                </span>
              </span>
            </div>

          </div>

        </div>
      </header>

      {/* HERO SECTION / APRESENTAÇÃO INICIAL - Structured exactly like Image 1 */}
      <section id="hero-section" className="relative pt-3 pb-14 sm:pt-5 sm:pb-20 lg:pt-8 lg:pb-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-7 pr-0 lg:pr-4">
            


            <h1 className="text-[26px] xs:text-[30px] sm:text-5xl lg:text-[49px] font-extrabold text-white tracking-tight leading-[1.15]">
              Aprenda a se <span className="font-serif italic font-medium text-[#d9c8a9]">conectar com as pessoas certas</span> e gerar oportunidades reais, sem precisar viralizar.
            </h1>

            <p className="text-[#f3ede2]/80 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
              Na minha trajetória, observei e estudei técnicas trabalhando em grandes mídias como Globo e SBT e produção de produtos audiovisuais para streamings, técnicas para comunicar, atrair, engajar e, principalmente, se conectar com o público certo: Essa é a chave que quero compartilhar com você para abrir portas que geram retorno financeiro na sua vida.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              <button
                id="hero-floating-cta"
                onClick={() => openRegisterModal()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#d9c8a9] hover:bg-[#cbb694] text-[#0d1b3d] py-3 sm:py-3.5 px-5 sm:px-6 font-bold text-sm transition-all duration-200 shadow-md hover:translate-y-[-1.5px] cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 fill-current animate-bounce" />
                Garantir minha vaga gratuita
              </button>
            </div>

            {/* Float values bar matching stats in image 1 */}
            <div id="hero-indicators-bar" className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-10 border-t border-[#b8964c]/40 pt-5 sm:pt-6 max-w-xl">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#d9c8a9] flex items-center justify-center text-[#0d1b3d] shrink-0">
                  <Clock className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[1.8]" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm md:text-base font-bold text-white block leading-tight">
                    8 de Julho (quarta) às 20h30
                  </span>
                  <span className="text-[8.5px] sm:text-[9.5px] uppercase font-bold tracking-widest text-[#f3ede2]/70 block leading-none">
                    DATA DO EVENTO
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#d9c8a9] flex items-center justify-center text-[#0d1b3d] shrink-0">
                  <Sparkles className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[1.8]" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm md:text-base font-bold text-white block leading-tight">
                    Evento 100% gratuito e Online
                  </span>
                  <span className="text-[8.5px] sm:text-[9.5px] uppercase font-bold tracking-widest text-[#f3ede2]/70 block leading-none">
                    FORMATO
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Layout strictly inspired by Mockup Image 1 */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end py-4 sm:py-0">
            
            {/* The outer styled photo canvas panel */}
            <div className="relative w-full max-w-[260px] xs:max-w-[290px] sm:max-w-[340px] aspect-[4/5] rounded-[30px] sm:rounded-[38px] bg-[#d9c8a9] border border-[#b8964c] p-2.5 sm:p-3 shadow-xl">
              
              {/* Inner wrapper layout */}
              <div className="relative h-full w-full overflow-hidden rounded-[20px] sm:rounded-[28px] bg-[#132247]">
                <img
                  src="/images/sthefanny-hero.webp"
                  alt="Sthefanny Loredo"
                  width={340}
                  height={425}
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* FLOATING ITEM 1: Rotating Circular badge on the left - exactly style like Image 1 */}
              <div className="absolute top-1/4 -left-4 sm:-left-12 h-18 w-18 sm:h-24 sm:w-24 rounded-full bg-[#132247] border border-[#b8964c] p-0.5 shadow-md flex items-center justify-center animate-[spin_32s_linear_infinite]">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand-dark overflow-visible">
                  <path
                    id="badgeCurve"
                    fill="transparent"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  />
                  <text className="text-[9.5px] sm:text-[10px] font-medium tracking-widest uppercase fill-[#d9c8a9]">
                    <textPath href="#badgeCurve" startOffset="0%">
                      • CONEXÃO • ALÉM • DA TELA •{" "}
                    </textPath>
                  </text>
                </svg>
                <div className="absolute inset-3.5 sm:inset-4 rounded-full overflow-hidden bg-[#132247] border border-[#b8964c] flex items-center justify-center shadow-inner">
                  <img
                    src="/images/loredo-symbol.png"
                    alt="Símbolo Loredo Storywork"
                    width={64}
                    height={64}
                    decoding="async"
                    className="h-full w-full object-contain p-1.5 sm:p-2"
                  />
                </div>
              </div>

              {/* FLOATING ITEM 2: Pill badge on the right - exactly like "Atendimento online" of image 1 */}
              <div className="absolute top-[45%] -right-3 sm:-right-7 bg-[#0d1b3d]/95 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-sm border border-[#b8964c] flex items-center gap-1.5 sm:gap-2 transition-all hover:scale-105 text-white">
                <Tv className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#d9c8a9]" />
                <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide">
                  Transmissão online
                </span>
              </div>

              {/* FLOATING ITEM 3: Stamp Badge at the bottom left */}
              <div className="absolute bottom-4 -left-3 sm:bottom-6 sm:-left-8 bg-[#0d1b3d]/95 backdrop-blur-md px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-lg border border-[#b8964c] flex flex-col gap-1.5 text-white transition-all hover:scale-105">
                <span className="text-[8px] sm:text-[9.5px] font-semibold uppercase tracking-wider text-[#d9c8a9] text-center leading-tight px-0.5">
                  minha experiência profissional
                </span>
                <div className="flex items-center gap-1.5">
                {/* Globo Logo */}
                <div className="flex items-center gap-1 bg-white/5 hover:bg-white/10 px-1.5 py-0.5 sm:py-1 rounded-md text-[7.5px] sm:text-[9px] font-bold text-[#f3ede2] border border-white/10 transition-colors">
                  <img
                    src="/images/logos/globo.svg"
                    alt="TV Globo"
                    width={16}
                    height={16}
                    decoding="async"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain shrink-0"
                  />
                  <span>GLOBO</span>
                </div>
                {/* SBT Logo */}
                <div className="flex items-center gap-1 bg-white/5 hover:bg-white/10 px-1.5 py-0.5 sm:py-1 rounded-md text-[7.5px] sm:text-[9px] font-bold text-[#f3ede2] border border-white/10 transition-colors">
                  <img
                    src="/images/logos/sbt.svg"
                    alt="SBT"
                    width={16}
                    height={16}
                    decoding="async"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain shrink-0"
                  />
                  <span>SBT</span>
                </div>
                {/* Band Logo */}
                <div className="flex items-center gap-1 bg-white/5 hover:bg-white/10 px-1.5 py-0.5 sm:py-1 rounded-md text-[7.5px] sm:text-[9px] font-bold text-[#f3ede2] border border-white/10 transition-colors">
                  <img
                    src="/images/logos/band.svg"
                    alt="Band"
                    width={16}
                    height={16}
                    decoding="async"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain shrink-0"
                  />
                  <span>BAND</span>
                </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: BENEFÍCIOS EMOCIONAIS (Anxiety relief and client-centric value) */}
      <section id="benefits-section" className="py-14 sm:py-24 bg-[#101e3f] border-t border-[#b8964c]/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
            <span className="inline-block text-[10px] sm:text-xs font-extrabold tracking-wider text-[#0d1b3d] uppercase bg-[#d9c8a9] px-3.5 py-1.5 rounded-lg shadow-[0_2px_10px_rgba(217,200,169,0.15)]">
              CONEXÃO DE VALOR
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight heading-gradient">
              Conecte-se com as pessoas que realmente <span className="font-serif italic font-medium text-[#d9c8a9]">valorizam</span> o seu trabalho
            </h2>
            <p className="text-[#f3ede2]/80 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Vídeos virais e edição complexas geram alcance, mas, nem sempre, retém um público coerente com seu propósito a longo prazo. Volume não é sinal de retorno mas a conexão genuína gera negócio. Ao comunicar com clareza para o público certo, você constrói confiança, reconhecimento, recebe melhores oportunidades e transforma sua presença digital em reconhecimento e retorno financeiro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Benefit Box 1 */}
            <div className="bg-[#18274d] rounded-2xl sm:rounded-3xl border border-[#b8964c] p-5 sm:p-8 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3 sm:space-y-4">
                <div className="p-2.5 sm:p-3 rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-[#0d1b3d] text-[#d9c8a9] border border-[#b8964c]/60">
                  <Users className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[1.5]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Paz de Espírito Editorial
                </h3>
                <p className="text-[#f3ede2]/80 text-[11px] sm:text-xs md:text-sm leading-relaxed">
                  Sinta a confiança e o alívio de não precisar ser refém de fórmulas prontas para ser vista, reconhecida ou valorizada. Você não precisa entrar em desafios que prometem milhares de seguidores em pouco tempo, seguir trends ou correr atrás de números vazios para provar o seu valor.
                </p>
              </div>
              <div className="text-[#d9c8a9] text-xs font-semibold pt-3 sm:pt-4 flex items-center gap-1 cursor-pointer hover:underline">
                Recupere o foco em sua atuação <ChevronRight className="h-3 w-3" />
              </div>
            </div>

            {/* Benefit Box 2 */}
            <div className="bg-[#18274d] rounded-2xl sm:rounded-3xl border border-[#b8964c] p-5 sm:p-8 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3 sm:space-y-4">
                <div className="p-2.5 sm:p-3 rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-[#0d1b3d] text-[#d9c8a9] border border-[#b8964c]/60">
                  <UserCheck className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[1.5]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Autoestima e Respeito Real
                </h3>
                <p className="text-[#f3ede2]/80 text-[11px] sm:text-xs md:text-sm leading-relaxed">
                  Sinta-se seguro para expressar o conhecimento que você já carrega, comunicar sua experiência com clareza e destravar o medo de se posicionar. Sem precisar seguir fórmulas prontas ou padrões impostos pela internet, você aprende a falar com autenticidade, autoridade e empatia para se conectar com as pessoas certas.
                </p>
              </div>
              <div className="text-[#d9c8a9] text-xs font-semibold pt-3 sm:pt-4 flex items-center gap-1 cursor-pointer hover:underline">
                Sinta orgulho da sua comunicação <ChevronRight className="h-3 w-3" />
              </div>
            </div>

            {/* Benefit Box 3 */}
            <div className="bg-[#18274d] rounded-2xl sm:rounded-3xl border border-[#b8964c] p-5 sm:p-8 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3 sm:space-y-4">
                <div className="p-2.5 sm:p-3 rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-[#0d1b3d] text-[#d9c8a9] border border-[#b8964c]/60">
                  <Sparkles className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[1.5]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Confiança sem Constrangimento
                </h3>
                <p className="text-[#f3ede2]/80 text-[11px] sm:text-xs md:text-sm leading-relaxed">
                  Elimine a insegurança, a timidez ou o medo de parecer chato ou intrusivo ao apresentar ou cobrar pelo seu serviço no digital. Sinta-se plenamente calmo e confiante, agindo com a autoridade e confiança de quem sabe o real valor do que entrega.
                </p>
              </div>
              <div className="text-[#d9c8a9] text-xs font-semibold pt-3 sm:pt-4 flex items-center gap-1 cursor-pointer hover:underline">
                Descubra a elegância comercial <ChevronRight className="h-3 w-3" />
              </div>
            </div>

          </div>

          {/* Emotional Transform Banner */}
          <div className="mt-8 sm:mt-12 bg-[#18274d] rounded-[24px] sm:rounded-[32px] border border-[#b8964c] p-5 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1.5 sm:space-y-2 text-center md:text-left">
              <span className="text-[10px] sm:text-xs font-bold text-[#d9c8a9] uppercase tracking-wider block">
                CONEXÃO E PARCERIAS AUTÊNTICAS
              </span>
              <p className="text-sm sm:text-base md:text-lg font-bold text-white leading-snug">
                Você prefere ter 10.000 seguidores que apenas aumentam os números ou 1.000 clientes que realmente se conectam com você, geram oportunidades e trazem retorno financeiro?
              </p>
            </div>
            <button
              onClick={() => openRegisterModal()}
              className="w-full md:w-auto rounded-2xl bg-[#d9c8a9] hover:bg-[#cbb694] text-[#0d1b3d] px-6 py-3 sm:py-3.5 font-bold text-xs sm:text-sm tracking-wide shadow-md whitespace-nowrap cursor-pointer transition-all hover:scale-105 active:scale-95 text-center"
            >
              Escolho Clientes Qualificados
            </button>
          </div>
        </div>
      </section>

      {/* METHODOLOGY SECTION (LearnGrid) */}
      <Suspense fallback={null}>
        <LearnGrid />
      </Suspense>

      {/* SECTION 4: PARA QUEM É O EVENTO? - Styled precisely like Elisa's layout */}
      <section id="audience-section" className="py-14 sm:py-24 bg-brand-bg border-t border-[#b8964c]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            
            {/* Visual illustrative card on the left */}
            <div className="space-y-5 lg:pr-6">
              <span className="inline-block text-[10px] sm:text-xs font-extrabold tracking-wider text-[#0d1b3d] uppercase bg-[#d9c8a9] px-3.5 py-1.5 rounded-lg shadow-[0_2px_10px_rgba(217,200,169,0.15)]">
                PÚBLICO ALVO
              </span>
              <h2 className="text-2xl sm:text-[28px] md:text-4xl font-extrabold text-white tracking-tight leading-tight heading-gradient">
                Para quem este evento é <span className="font-serif italic font-medium text-[#d9c8a9]">recomendado?</span>
              </h2>
              <p className="text-[#f3ede2]/80 text-xs sm:text-sm md:text-base leading-relaxed">
                O Conexão Além da Tela é um evento para profissionais que desejam transformar sua comunicação em autoridade, reconhecimento e crescimento financeiro. Um encontro para quem quer atrair mais clientes, ser valorizado pelo mercado e construir uma presença digital autêntica.
              </p>

              {/* Quick info badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                <div className="bg-[#132247]/60 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#b8964c] flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#d9c8a9] shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-[#f3ede2]">Profissionais da Saúde (médicos, psicólogos, terapeutas, nutricionistas, dentistas e demais especialistas)</span>
                </div>
                <div className="bg-[#132247]/60 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#b8964c] flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#d9c8a9] shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-[#f3ede2]">Profissionais Liberais (advogados, contadores, engenheiros e consultores)</span>
                </div>
                <div className="bg-[#132247]/60 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#b8964c] flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#d9c8a9] shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-[#f3ede2]">Comunicadores e Criadores de Conteúdo (jornalistas, apresentadores, influenciadores e produtores de conteúdo)</span>
                </div>
                <div className="bg-[#132247]/60 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#b8964c] flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#d9c8a9] shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-[#f3ede2]">Empreendedores e Marcas Pessoais</span>
                </div>
                <div className="bg-[#132247]/60 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#b8964c] flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#d9c8a9] shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-[#f3ede2]">Mentores, Consultores e Palestrantes</span>
                </div>
                <div className="bg-[#132247]/60 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#b8964c] flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#d9c8a9] shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-[#f3ede2]">Profissionais Criativos (arquitetos, designers, fotógrafos, publicitários e outros especialistas da economia criativa)</span>
                </div>
              </div>
            </div>

            {/* Checklist items on the right side */}
            <div className="bg-[#132247]/90 backdrop-blur-sm rounded-[24px] sm:rounded-[36px] border border-[#b8964c] p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-6 shadow-sm">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight">
                Se você se identifica com pelo menos um destes sentimentos, sua presença é indispensável:
              </h3>

              <div className="space-y-4">
                {[
                  {
                    title: 'O "Circo Digital" e a exaustão do algoritmo',
                    text: 'Você se sente exaurido com a pressão invisível de produzir conteúdos diários rasos, expor sua vida pessoal ou usar fórmulas artificiais de engajamento apenas para tentar agradar o algoritmo.'
                  },
                  {
                    title: 'Excelente entrega técnica, pouco reconhecimento',
                    text: 'Você possui anos de estudo, dedicação técnica e um serviço de alto nível, mas vê concorrentes muito menos preparados ganharem espaço e autoridade apenas por se comunicarem de forma barulhenta.'
                  },
                  {
                    title: 'Métricas de vaidade que não se traduzem em faturamento',
                    text: 'Seus conteúdos até recebem curtidas, comentários e visualizações esporádicas, mas esses números não se convertem em clientes reais qualificados, consultas particulares ou contratos de alto valor assinados.'
                  },
                  {
                    title: 'Barreira ética e receio de parecer inconveniente',
                    text: 'Você sente desconforto na hora de ofertar seu trabalho porque se recusa a adotar gatilhos de escassez falsos, persuasão agressiva ou discursos que ferem a elegância e a integridade da sua profissão.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3.5 sm:gap-4 items-start border-b border-[#b8964c]/40 pb-3.5 sm:pb-4 last:border-none last:pb-0">
                    <div className="flex h-5.5 w-5.5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-[#d9c8a9] text-[#0d1b3d] font-semibold text-xs text-[11px] sm:text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[#f3ede2]/80 text-[11px] sm:text-xs md:text-sm mt-1 leading-normal">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openRegisterModal()}
                  className="w-full rounded-2xl bg-[#d9c8a9] hover:bg-[#cbb694] text-[#0d1b3d] py-3 sm:py-3.5 px-6 font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] text-center"
                >
                  Este Evento é Para Mim, Garantir Vaga
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>
               {/* SECTION 5: PALESTRANTE - STHEFANNY LOREDO (Recreating image 3) */}
      <section id="speaker-section" className="py-14 sm:py-24 bg-brand-bg border-t border-[#b8964c]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Speaker Info */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              
              <span className="inline-block text-[10px] sm:text-xs font-extrabold tracking-wider text-[#0d1b3d] uppercase bg-[#d9c8a9] px-3.5 py-1.5 rounded-lg shadow-[0_2px_10px_rgba(217,200,169,0.15)]">
                SOBRE A PALESTRANTE
              </span>
              
              <h2 className="text-2xl sm:text-3.5xl md:text-4xl font-extrabold text-white tracking-tight leading-tight heading-gradient">
                Prazer, sou a <span className="font-serif italic font-medium text-[#d9c8a9]">Sthefanny Loredo</span>
              </h2>

              <p className="text-[#f3ede2]/85 text-xs sm:text-sm md:text-base font-bold text-[#d9c8a9]">
                Apresentadora, jornalista e especialista em narrativas estratégicas.
              </p>

              <p className="text-[#f3ede2]/85 text-xs sm:text-sm md:text-base leading-relaxed">
                Com mais de uma década de experiência em comunicação, construí minha trajetória em algumas das maiores emissoras do país, como TV Globo, SBT e Band, participando da produção de conteúdos e reportagens exibidos nacionalmente, incluindo o Fantástico e o Jornal Nacional. Também atuo como apresentadora de um programa internacional e roteirista de projetos para plataformas de streaming.
              </p>

              <p className="text-[#f3ede2]/85 text-xs sm:text-sm md:text-base leading-relaxed">
                Por meio dos mesmos princípios de narrativa utilizados pela televisão e streaming, eu ensino especialistas, líderes e marcas pessoais a se posicionarem com autenticidade, fortalecerem sua autoridade e criarem conexões que geram oportunidades reais — sem depender de viralizações ou fórmulas prontas.
              </p>

            </div>

            {/* Right Column: Speaker Image Gallery / Experience Show */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              
              {/* Main portrait */}
              <div className="relative w-full aspect-[1.1/1.2] rounded-[24px] sm:rounded-[32px] bg-[#132247] border border-[#b8964c] p-2 sm:p-2.5 shadow-md hover:shadow-lg transition-all group overflow-hidden">
                
                <div className="relative h-full w-full overflow-hidden rounded-[18px] sm:rounded-[24px] bg-[#132247]">
                  <img
                    src="/images/speaker/sthefanny-portrait.webp"
                    alt="Sthefanny Loredo no Fantástico"
                    width={400}
                    height={436}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: '38% center' }}
                  />
                  <div className="absolute bottom-2.5 left-2.5 bg-[#0d1b3d]/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#b8964c]/40 text-[9px] font-bold text-[#d9c8a9] tracking-wider uppercase">
                    Palestrante & Mentora
                  </div>
                </div>
              </div>

              {/* Smaller Grid showing experience samples in an automatic carousel */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Slot 1 */}
                <div className="relative aspect-[4/3] rounded-2xl bg-[#132247] border border-[#b8964c]/50 p-1.5 shadow-sm hover:border-[#b8964c] transition-all overflow-hidden group">
                  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#132247]">
                    <img
                      key={CAROUSEL_IMAGES[carouselIndex].src}
                      src={CAROUSEL_IMAGES[carouselIndex].src}
                      alt={CAROUSEL_IMAGES[carouselIndex].alt}
                      width={320}
                      height={240}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 animate-carousel-fade-in"
                      style={{ objectPosition: CAROUSEL_IMAGES[carouselIndex].objectPosition ?? 'center' }}
                    />
                    <div
                      key={CAROUSEL_IMAGES[carouselIndex].label}
                      className="absolute bottom-1.5 left-1.5 bg-[#0d1b3d]/95 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-bold text-[#f3ede2]/90 tracking-wide border border-white/5 animate-carousel-fade-in"
                    >
                      {CAROUSEL_IMAGES[carouselIndex].label}
                    </div>
                  </div>
                </div>

                {/* Slot 2 */}
                <div className="relative aspect-[4/3] rounded-2xl bg-[#132247] border border-[#b8964c]/50 p-1.5 shadow-sm hover:border-[#b8964c] transition-all overflow-hidden group">
                  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#132247]">
                    <img
                      key={CAROUSEL_IMAGES[(carouselIndex + 1) % CAROUSEL_IMAGES.length].src}
                      src={CAROUSEL_IMAGES[(carouselIndex + 1) % CAROUSEL_IMAGES.length].src}
                      alt={CAROUSEL_IMAGES[(carouselIndex + 1) % CAROUSEL_IMAGES.length].alt}
                      width={320}
                      height={240}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 animate-carousel-fade-in"
                      style={{ objectPosition: CAROUSEL_IMAGES[(carouselIndex + 1) % CAROUSEL_IMAGES.length].objectPosition ?? 'center' }}
                    />
                    <div
                      key={CAROUSEL_IMAGES[(carouselIndex + 1) % CAROUSEL_IMAGES.length].label}
                      className="absolute bottom-1.5 left-1.5 bg-[#0d1b3d]/95 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-bold text-[#f3ede2]/90 tracking-wide border border-white/5 animate-carousel-fade-in"
                    >
                      {CAROUSEL_IMAGES[(carouselIndex + 1) % CAROUSEL_IMAGES.length].label}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ SECTION */}
      <Suspense fallback={null}>
        <FAQSection />
      </Suspense>

      {/* ENROLLMENT MODAL OVERLAY */}
      {shouldLoadModal && (
        <Suspense fallback={null}>
          <EnrollmentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleRegistrationSuccess}
          />
        </Suspense>
      )}



      {/* FOOTER */}
      <footer className="bg-[#0d1b3d] text-[#f3ede2]/80 py-8 sm:py-12 px-4 sm:px-6 border-t border-[#b8964c]/40">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          
          <div className="space-y-1 flex flex-col items-center md:items-start">
            <img
              src="/images/conexao-alem-da-tela-logo.png"
              alt="Conexão Além da Tela"
              width={520}
              height={277}
              loading="lazy"
              decoding="async"
              className="h-14 xs:h-16 sm:h-[4.5rem] md:h-20 lg:h-24 w-auto object-contain object-center md:object-left"
            />
            <span className="block text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-[#f3ede2]/75 leading-none">
              Por Sthefanny Loredo
            </span>
          </div>

          <div className="text-[10px] sm:text-xs text-[#f3ede2]/60 text-center space-y-1">
            <p>© 2026 Conexão Além da Tela • Todos os direitos reservados.</p>
            <p>Desenvolvido de forma exclusiva para Sthefanny Loredo.</p>
          </div>

          <div className="flex justify-center md:justify-end gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#f3ede2]/80">
            <a href="#benefits-section" className="hover:text-white transition-colors">Termos</a>
            <span>•</span>
            <a href="#faq-section" className="hover:text-white transition-colors">Suporte</a>
          </div>

        </div>
      </footer>

      {/* FIXED FOOTER */}
      <div id="fixed-bottom-footer" className="fixed bottom-0 left-0 right-0 z-45 bg-[#0d1b3d]/95 backdrop-blur-md border-t border-[#b8964c] py-2 sm:py-3 px-2 sm:px-6 shadow-[0_-8px_32px_rgb(0,0,0,0.45)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between sm:justify-center gap-1.5 xs:gap-3 sm:gap-8 md:gap-12">
          
          {/* Left-side icon links */}
          <div className="flex items-center gap-1.5 xs:gap-3 sm:gap-5 md:gap-6">
            <a href="#benefits-section" className="flex flex-col items-center gap-0.5 xs:gap-1 group text-center min-w-[38px] xs:min-w-[44px] sm:min-w-[50px]">
              <div className="h-7.5 w-7.5 xs:h-8 xs:w-8 sm:h-9 sm:w-9 rounded-full bg-[#d9c8a9]/15 border border-[#d9c8a9]/25 flex items-center justify-center text-[#d9c8a9] group-hover:bg-[#d9c8a9] group-hover:text-[#0d1b3d] transition-all duration-300">
                <Award className="h-3.5 xs:h-4 sm:h-4.5 w-3.5 xs:w-4 sm:w-4.5 stroke-[1.8]" />
              </div>
              <span className="text-[6.5px] xs:text-[7.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-[#d9c8a9] group-hover:text-white transition-colors block leading-none select-none">
                Conexão
              </span>
            </a>
 
            <a href="#methodology-section" className="flex flex-col items-center gap-0.5 xs:gap-1 group text-center min-w-[38px] xs:min-w-[44px] sm:min-w-[50px]">
              <div className="h-7.5 w-7.5 xs:h-8 xs:w-8 sm:h-9 sm:w-9 rounded-full bg-[#d9c8a9]/15 border border-[#d9c8a9]/25 flex items-center justify-center text-[#d9c8a9] group-hover:bg-[#d9c8a9] group-hover:text-[#0d1b3d] transition-all duration-300">
                <BookOpen className="h-3.5 xs:h-4 sm:h-4.5 w-3.5 xs:w-4 sm:w-4.5 stroke-[1.8]" />
              </div>
              <span className="text-[6.5px] xs:text-[7.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-[#d9c8a9] group-hover:text-white transition-colors block leading-none select-none">
                Aprender
              </span>
            </a>
          </div>
 
          {/* Center Button */}
          <div className="flex-1 max-w-[110px] xs:max-w-[130px] sm:max-w-[200px] md:max-w-[240px] mx-0.5 xs:mx-1 shrink-0">
            <button
              onClick={() => openRegisterModal()}
              className="w-full rounded-full bg-[#d9c8a9] hover:bg-[#cbb694] text-[#0d1b3d] text-[8px] xs:text-[9.5px] sm:text-[11px] md:text-xs font-black tracking-wider xs:tracking-widest uppercase py-1.5 xs:py-2.5 sm:py-3 shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 md:gap-2 px-1 xs:px-3 text-center"
            >
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-pulse shrink-0 text-[#0d1b3d] hidden sm:inline" />
              <span className="truncate">{participant ? 'VER INGRESSO' : 'GARANTIR VAGA'}</span>
            </button>
          </div>
 
          {/* Right-side icon links */}
          <div className="flex items-center gap-1.5 xs:gap-3 sm:gap-5 md:gap-6">
            <a href="#audience-section" className="flex flex-col items-center gap-0.5 xs:gap-1 group text-center min-w-[38px] xs:min-w-[44px] sm:min-w-[50px]">
              <div className="h-7.5 w-7.5 xs:h-8 xs:w-8 sm:h-9 sm:w-9 rounded-full bg-[#d9c8a9]/15 border border-[#d9c8a9]/25 flex items-center justify-center text-[#d9c8a9] group-hover:bg-[#d9c8a9] group-hover:text-[#0d1b3d] transition-all duration-300">
                <Users className="h-3.5 xs:h-4 sm:h-4.5 w-3.5 xs:w-4 sm:w-4.5 stroke-[1.8]" />
              </div>
              <span className="text-[6.5px] xs:text-[7.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-[#d9c8a9] group-hover:text-white transition-colors block leading-none select-none">
                Público
              </span>
            </a>
 
            <a href="#speaker-section" className="flex flex-col items-center gap-0.5 xs:gap-1 group text-center min-w-[38px] xs:min-w-[44px] sm:min-w-[50px]">
              <div className="h-7.5 w-7.5 xs:h-8 xs:w-8 sm:h-9 sm:w-9 rounded-full bg-[#d9c8a9]/15 border border-[#d9c8a9]/25 flex items-center justify-center text-[#d9c8a9] group-hover:bg-[#d9c8a9] group-hover:text-[#0d1b3d] transition-all duration-300">
                <Mic className="h-3.5 xs:h-4 sm:h-4.5 w-3.5 xs:w-4 sm:w-4.5 stroke-[1.8]" />
              </div>
              <span className="text-[6.5px] xs:text-[7.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-[#d9c8a9] group-hover:text-white transition-colors block leading-none select-none">
                Palestrante
              </span>
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
