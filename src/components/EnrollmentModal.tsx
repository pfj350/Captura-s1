import { useState, useEffect, startTransition } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, Calendar, MessageCircle, AlertCircle, Sparkles } from 'lucide-react';
import { ParticipantData } from '../types';
import { getStoredUtms } from '../lib/utm';
import { sendToGoogleSheet } from '../lib/google-sheet';
import { trackCompleteRegistration, trackContact, updatePixelUserData } from '../lib/meta-tracking';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: ParticipantData) => void;
}

const incomeOptions = [
  'Menos de R$ 2 mil',
  'R$ 2 mil a R$ 5 mil',
  'R$ 5 mil a R$ 10 mil',
  'R$ 10 mil a R$ 20 mil',
  'Mais de R$ 20 mil'
];

export default function EnrollmentModal({ isOpen, onClose, onSuccess }: EnrollmentModalProps) {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    challenge: '',
    income: 'R$ 5 mil a R$ 10 mil'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('storywork_participant');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFormData({
            name: parsed.name || '',
            email: parsed.email || '',
            phone: parsed.phone || '',
            profession: parsed.profession || '',
            challenge: parsed.challenge || '',
            income: parsed.income || 'R$ 5 mil a R$ 10 mil'
          });
          setStep(3);
        } catch (e) {
          console.error('Falha ao restaurar dados do localStorage', e);
          setStep(1);
        }
      } else {
        setStep(1);
        setFormData({
          name: '',
          email: '',
          phone: '',
          profession: '',
          challenge: '',
          income: 'R$ 5 mil a R$ 10 mil'
        });
      }
      setErrors({});
    }
  }, [isOpen]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Insira um e-mail válido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'WhatsApp é obrigatório';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Insira um WhatsApp válido com DDD';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.profession) newErrors.profession = 'Selecione ou digite sua área de atuação';
    if (!formData.challenge) newErrors.challenge = 'Por favor, selecione seu principal obstáculo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        updatePixelUserData({
          email: formData.email,
          phone: formData.phone,
          name: formData.name,
          country: 'br',
        });
        startTransition(() => {
          setStep(2);
        });
      }
    } else if (step === 2) {
      if (validateStep2()) {
        const participant: ParticipantData = {
          ...formData,
          ...getStoredUtms(),
          registeredAt: new Date().toISOString(),
        };
        
        localStorage.setItem('storywork_participant', JSON.stringify(participant));
        trackCompleteRegistration(participant);
        void sendToGoogleSheet(participant);

        startTransition(() => {
          setStep(3);
          onSuccess(participant);
        });
      }
    }
  };

  const handlePhoneChange = (val: string) => {
    // Format Brazilian Phone number: (XX) XXXXX-XXXX
    const cleaned = val.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    }
    if (cleaned.length > 7) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }
    setFormData({ ...formData, phone: formatted.slice(0, 15) });
  };

  const handleGoogleCalendar = () => {
    const title = encodeURIComponent('Conexão Além da Tela com Sthefanny Loredo');
    const details = encodeURIComponent('Evento exclusivo para aprender a fazer conexões profissionais autênticas, gerar oportunidades reais e vender sem precisar viralizar.');
    const dates = '20260708T233000Z/20260709T013000Z'; // 08 July 2026 20:30 - 22:30 BRT (UTC-3 is 23:30 UTC)
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            id="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            id="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-lg my-auto overflow-y-auto max-h-[90vh] rounded-2.5xl sm:rounded-3xl border border-brand-card-border bg-brand-bg p-5 sm:p-8 shadow-2xl text-brand-dark z-10"
          >
            {/* Close Button */}
            <button
              id="close-modal-btn"
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 rounded-full p-1.5 text-brand-muted hover:bg-brand-badge-bg hover:text-brand-dark transition-colors duration-200"
              aria-label="Fechar"
            >
              <X className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </button>

            {/* Stepper Indication (Only shown for input steps) */}
            {step < 3 && (
              <div id="stepper-header" className="mb-4 sm:mb-6">
                <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#0d1b3d] uppercase bg-brand-accent px-3 py-1 rounded-full shadow-sm">
                  Passo {step} de 2
                </span>
                <div className="mt-2.5 sm:mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-[#132247] border border-brand-card-border/15">
                  <div
                    className="h-full bg-brand-accent shadow-[0_0_8px_rgba(217,200,169,0.4)] transition-all duration-300"
                    style={{ width: `${step === 1 ? '50%' : '100%'}` }}
                  />
                </div>
              </div>
            )}

            {/* Dynamic steps */}
            <div id="modal-step-body">
              {step === 1 && (
                <div id="registration-step-1" className="space-y-4 sm:space-y-5">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-accent">
                      Garanta sua vaga gratuita
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-[#f3ede2]/75">
                      Preencha os campos abaixo para receber o link exclusivo de transmissão ao vivo.
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4 pt-1">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-brand-accent/80 mb-1">
                        Seu nome completo
                      </label>
                      <input
                        id="input-name"
                        type="text"
                        placeholder="Ex: Sthefanny Loredo"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-brand-card-border/30 bg-[#132247] text-white placeholder-white/20 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 focus:outline-none transition-all duration-200"
                      />
                      {errors.name && (
                        <p className="mt-1 text-2xs sm:text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-brand-accent/80 mb-1">
                        Seu melhor e-mail
                      </label>
                      <input
                        id="input-email"
                        type="email"
                        placeholder="Ex: seuemail@provedor.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-brand-card-border/30 bg-[#132247] text-white placeholder-white/20 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 focus:outline-none transition-all duration-200"
                      />
                      {errors.email && (
                        <p className="mt-1 text-2xs sm:text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-brand-accent/80 mb-1">
                        WhatsApp (com DDD)
                      </label>
                      <input
                        id="input-phone"
                        type="tel"
                        placeholder="Ex: (11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="w-full rounded-xl border border-brand-card-border/30 bg-[#132247] text-white placeholder-white/20 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 focus:outline-none transition-all duration-200"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-2xs sm:text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    id="submit-step-1"
                    onClick={handleNext}
                    className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-[#0d1b3d] py-3 sm:py-3.5 px-4 font-bold text-xs sm:text-sm transition-all duration-200 shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Prosseguir para Confirmar
                    <ArrowRight className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-[#0d1b3d]" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div id="registration-step-2" className="space-y-3 sm:space-y-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-brand-accent">
                      Só mais um detalhe...
                    </h3>
                    <p className="mt-0.5 text-[10px] sm:text-xs text-[#f3ede2]/75 leading-relaxed">
                      Queremos personalizar sua experiência no Conexão Além da Tela.
                    </p>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3 pt-0.5">
                    <div>
                      <label className="block text-[9.5px] sm:text-xs font-semibold uppercase tracking-wider text-brand-accent/80 mb-1">
                        Qual sua área de atuação/profissão?
                      </label>
                      <select
                        id="select-profession"
                        value={formData.profession}
                        onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                        className="w-full rounded-xl border border-brand-card-border/30 bg-[#132247] text-white px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm focus:border-brand-accent focus:outline-none transition-colors duration-200"
                      >
                        <option value="" className="bg-[#132247] text-white">Selecione uma opção...</option>
                        <option value="Advogado" className="bg-[#132247] text-white">Advogado</option>
                        <option value="Profissional liberal" className="bg-[#132247] text-white">Profissional liberal</option>
                        <option value="Área da saúde" className="bg-[#132247] text-white">Área da saúde</option>
                        <option value="Jornalista / Comunicador" className="bg-[#132247] text-white">Jornalista / Comunicador</option>
                        <option value="Empresário / Marca pessoal" className="bg-[#132247] text-white">Empresário / Marca pessoal</option>
                        <option value="Mentor / Palestrante" className="bg-[#132247] text-white">Mentor / Palestrante</option>
                        <option value="Outro" className="bg-[#132247] text-white">Outro</option>
                      </select>
                      {errors.profession && (
                        <p className="mt-1 text-2xs sm:text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.profession}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[9.5px] sm:text-xs font-semibold uppercase tracking-wider text-brand-accent/80 mb-1">
                        Qual seu maior obstáculo na hora de atrair clientes?
                      </label>
                      <div className="space-y-1.5 sm:space-y-2">
                        {[
                          { id: 'algorithm', text: 'Me sinto refém do algoritmo e exausto com a pressão de postar todo dia' },
                          { id: 'dances', text: 'Não quero fazer dancinhas, expor minha vida pessoal ou parecer forçado' },
                          { id: 'clients', text: 'Tenho dificuldade em converter meus conteúdos em clientes de alto valor' }
                        ].map((item) => (
                          <label
                            key={item.id}
                            className={`flex items-start gap-2 rounded-xl border p-2 sm:p-2.5 cursor-pointer text-[10.5px] sm:text-xs font-medium transition-all duration-200 ${
                              formData.challenge === item.id
                                ? 'border-brand-accent bg-[#d9c8a9]/10 text-white shadow-sm ring-1 ring-brand-accent/30'
                                : 'border-brand-card-border/30 bg-[#132247]/60 text-[#f3ede2]/80 hover:border-brand-card-border/60 hover:bg-[#132247]'
                            }`}
                          >
                            <input
                              type="radio"
                              name="challenge"
                              checked={formData.challenge === item.id}
                              onChange={() => setFormData({ ...formData, challenge: item.id })}
                              className="mt-0.5 accent-brand-accent h-3.5 w-3.5"
                            />
                            <span>{item.text}</span>
                          </label>
                        ))}
                      </div>
                      {errors.challenge && (
                        <p className="mt-1 text-2xs sm:text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.challenge}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[9.5px] sm:text-xs font-semibold uppercase tracking-wider text-brand-accent/80 mb-1">
                        Qual sua renda média mensal?
                      </label>
                      <div className="space-y-1.5 bg-[#132247] border border-brand-card-border/30 rounded-xl p-2.5 sm:p-3">
                        <div className="flex justify-between items-center text-[10px] sm:text-xs">
                          <span className="font-semibold text-[#f3ede2]/50 uppercase tracking-wider text-[9px] sm:text-[10px]">Faixa selecionada:</span>
                          <span className="font-bold text-[#d9c8a9] bg-[#d9c8a9]/15 border border-[#b8964c]/20 px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-xs">
                            {formData.income}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="4"
                          step="1"
                          value={incomeOptions.indexOf(formData.income) !== -1 ? incomeOptions.indexOf(formData.income) : 2}
                          onChange={(e) => {
                            const idx = parseInt(e.target.value);
                            setFormData({ ...formData, income: incomeOptions[idx] });
                          }}
                          className="w-full h-1 bg-slate-700/60 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                        />
                        <div className="flex justify-between text-[8px] sm:text-[9.5px] text-[#f3ede2]/40 font-bold uppercase tracking-wider px-1">
                          <span>&lt; R$ 2 mil</span>
                          <span>&gt; R$ 20 mil</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 sm:gap-3 pt-1.5">
                    <button
                      id="back-to-step-1"
                      onClick={() => setStep(1)}
                      className="w-1/3 rounded-xl border border-brand-card-border/40 font-bold text-xs hover:bg-[#132247] transition-all cursor-pointer text-[#f3ede2] py-2 sm:py-2.5"
                    >
                      Voltar
                    </button>
                    <button
                      id="submit-final-registration"
                      onClick={handleNext}
                      className="w-2/3 flex items-center justify-center gap-1.5 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-[#0d1b3d] py-2 sm:py-2.5 font-bold text-xs sm:text-sm transition-all duration-200 shadow-md cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    >
                      Finalizar Inscrição
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* SUCCESS TICKET STEP */}
              {step === 3 && (
                <div id="registration-success-ticket" className="space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <div className="mx-auto flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400">
                      <Check className="h-5.5 w-5.5 sm:h-7 sm:w-7" />
                    </div>
                    <h3 className="mt-2.5 text-xl sm:text-2xl font-extrabold tracking-tight text-brand-accent">
                      Inscrição Confirmada!
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-brand-muted uppercase font-bold tracking-wider text-amber-400/90 animate-pulse">
                      📸 Tire um print desta tela.
                    </p>
                  </div>

                  {/* Gorgeous Ticket Design */}
                  <div id="vip-ticket" className="relative overflow-hidden rounded-2xl border border-brand-accent/25 bg-[#132247] shadow-lg">
                    {/* Header Strip */}
                    <div className="bg-brand-accent px-4 py-2.5 sm:px-5 sm:py-3 text-[#0d1b3d] flex justify-between items-center">
                      <span className="font-serif italic font-semibold text-xs sm:text-sm text-[#0d1b3d]">
                        Conexão <span className="font-sans not-italic text-[#0d1b3d] text-[9px] font-black tracking-widest pl-0.5 uppercase">Além da Tela</span>
                      </span>
                      <span className="text-[7.5px] sm:text-[9.5px] font-extrabold tracking-widest uppercase text-[#0d1b3d]/80 bg-[#0d1b3d]/10 px-2 py-0.5 rounded">
                        INGRESSO VIP
                      </span>
                    </div>

                    {/* Ticket Body */}
                    <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                      <div>
                        <span className="text-[8px] sm:text-[10px] font-semibold text-[#f3ede2]/50 uppercase tracking-wider">
                          Participante
                        </span>
                        <div className="text-base sm:text-lg font-bold text-white truncate">
                          {formData.name}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4 border-t border-brand-card-border/30 pt-2.5 sm:pt-3">
                        <div>
                          <span className="text-[8px] sm:text-[10px] font-semibold text-[#f3ede2]/50 uppercase tracking-wider">
                            Data do Evento
                          </span>
                          <div className="text-[10.5px] sm:text-xs font-bold text-white">
                            Qua, 8 Julho, 2026
                          </div>
                        </div>
                        <div>
                          <span className="text-[8px] sm:text-[10px] font-semibold text-[#f3ede2]/50 uppercase tracking-wider">
                            Horário
                          </span>
                          <div className="text-[10.5px] sm:text-xs font-bold text-white">
                            20h30 (Horário BR)
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-brand-card-border/30 pt-2.5 sm:pt-3">
                        <span className="text-[8px] sm:text-[10px] font-semibold text-[#f3ede2]/50 uppercase tracking-wider">
                          Formato
                        </span>
                        <div className="text-[10.5px] sm:text-xs font-bold text-white">
                          Transmissão Online
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post-Registration Actions */}
                  <div className="space-y-3 pt-1">
                    <p className="text-center text-[11px] sm:text-xs font-medium text-[#f3ede2]/70">
                      👇 Clique abaixo para acessar a sala VIP no WhatsApp:
                    </p>

                    <a
                      id="join-vip-whatsapp"
                      href="https://chat.whatsapp.com/EtdAs7qSeKq6Om6glUNQs5"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        const saved = localStorage.getItem('storywork_participant');
                        const participant = saved ? JSON.parse(saved) as ParticipantData : null;
                        trackContact(participant);
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98] animate-pulse"
                    >
                      <MessageCircle className="h-5 w-5 fill-current shrink-0" />
                      Entrar no Grupo do WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
