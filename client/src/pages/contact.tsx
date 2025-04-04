import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Contact() {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast({
        title: "Formulário incompleto",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsPending(true);
    
    try {
      await apiRequest('POST', '/api/contact', contactForm);
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.",
      });
      
      // Reset form
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar sua mensagem. Tente novamente mais tarde.",
        variant: "destructive",
      });
      console.error("Failed to send contact message:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-16 md:pb-0">
      <PageHeader 
        title="Fale Conosco" 
        description="Entre em contato conosco e receba suporte nutricional personalizado"
      />
      
      {/* Seção de Canais de Contato com Design Ultra Moderno */}
      <div className="bg-gradient-to-r from-violet-500 via-primary-500 to-indigo-500 rounded-xl overflow-hidden shadow-lg">
        <div className="p-6 md:p-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
              <i className="ri-chat-smile-3-line text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-white">Canais de Atendimento</h2>
          </div>
          <p className="text-white/80 mb-8 max-w-2xl">
            Escolha o canal de sua preferência para receber suporte personalizado e orientações sobre nutrição, dieta e uso do aplicativo
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
            {/* WhatsApp Card - Design Moderno */}
            <a 
              href="https://wa.me/5511999999999" 
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-2 overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-green-600/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl rotate-3 flex items-center justify-center mb-5 shadow-lg transform group-hover:rotate-6 transition-all duration-300">
                  <i className="ri-whatsapp-line text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">WhatsApp</h3>
                <p className="text-white/70 mb-4">Atendimento rápido 24/7 via chat direto com nutricionistas</p>
                <div className="mt-3 py-2 px-4 bg-green-500/20 rounded-full text-white font-medium flex items-center group-hover:bg-green-500/30 transition-colors">
                  <span>Conversar agora</span>
                  <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </a>
            
            {/* Instagram Card - Design Moderno */}
            <a 
              href="https://instagram.com/nutritrack" 
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20 hover:-translate-y-2 overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-400/10 to-purple-600/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl rotate-3 flex items-center justify-center mb-5 shadow-lg transform group-hover:rotate-6 transition-all duration-300">
                  <i className="ri-instagram-line text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Instagram</h3>
                <p className="text-white/70 mb-4">Siga para dicas diárias, receitas saudáveis e novidades</p>
                <div className="mt-3 py-2 px-4 bg-pink-500/20 rounded-full text-white font-medium flex items-center group-hover:bg-pink-500/30 transition-colors">
                  <span>@nutritrack</span>
                  <i className="ri-external-link-line ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </a>
            
            {/* Email Card - Design Moderno */}
            <a 
              href="mailto:contato@nutritrack.com" 
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-2 overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-blue-600/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl rotate-3 flex items-center justify-center mb-5 shadow-lg transform group-hover:rotate-6 transition-all duration-300">
                  <i className="ri-mail-line text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Email</h3>
                <p className="text-white/70 mb-4">Envie uma mensagem para nossa equipe de suporte técnico</p>
                <div className="mt-3 py-2 px-4 bg-blue-500/20 rounded-full text-white font-medium flex items-center group-hover:bg-blue-500/30 transition-colors">
                  <span>contato@nutritrack.com</span>
                  <i className="ri-mail-send-line ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </a>
          </div>
          
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/15 rounded-full text-white/80 backdrop-blur-sm">
              <i className="ri-time-line"></i>
              <span>Disponível 24/7 para atendimento e suporte</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Formulário de Contato e FAQ com Tabs Modernas */}
      <div className="mt-8 relative">
        <div className="absolute -top-16 right-4 md:right-8 w-40 h-40 bg-gradient-to-br from-yellow-300/30 to-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 left-4 md:left-8 w-40 h-40 bg-gradient-to-br from-blue-300/30 to-cyan-500/20 rounded-full blur-3xl"></div>
        
        <Tabs defaultValue="message" className="w-full relative z-10">
          <TabsList className="grid w-full grid-cols-2 p-1 rounded-xl bg-primary-100/50 backdrop-blur-sm">
            <TabsTrigger value="message" className="rounded-lg text-base py-3 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-md">
              <i className="ri-message-3-line mr-2"></i>
              Enviar Mensagem
            </TabsTrigger>
            <TabsTrigger value="faq" className="rounded-lg text-base py-3 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-md">
              <i className="ri-question-answer-line mr-2"></i>
              Perguntas Frequentes
            </TabsTrigger>
          </TabsList>
          
          {/* Tab de Envio de Mensagem */}
          <TabsContent value="message">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                    <i className="ri-mail-send-line text-xl"></i>
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Envie sua Mensagem</CardTitle>
                    <CardDescription className="text-slate-600">
                      Nossa equipe está pronta para te ajudar com qualquer dúvida
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <i className="ri-user-smile-line text-primary-500"></i>
                      Nome Completo
                    </Label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Digite seu nome completo"
                      className="rounded-lg border-slate-200 focus:border-primary-400 focus:ring-primary-200 bg-white/70"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <i className="ri-mail-line text-primary-500"></i>
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="rounded-lg border-slate-200 focus:border-primary-400 focus:ring-primary-200 bg-white/70"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <i className="ri-chat-1-line text-primary-500"></i>
                    Assunto
                  </Label>
                  <Select
                    value={contactForm.subject}
                    onValueChange={(value) => handleInputChange("subject", value)}
                  >
                    <SelectTrigger className="rounded-lg border-slate-200 focus:border-primary-400 focus:ring-primary-200 bg-white/70">
                      <SelectValue placeholder="Selecione o assunto da mensagem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support" className="flex items-center">
                        <div className="flex items-center gap-2">
                          <i className="ri-customer-service-line text-blue-500"></i>
                          <span>Suporte e Ajuda</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="suggestion">
                        <div className="flex items-center gap-2">
                          <i className="ri-lightbulb-line text-yellow-500"></i>
                          <span>Sugestão de Melhoria</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="nutrition">
                        <div className="flex items-center gap-2">
                          <i className="ri-heart-pulse-line text-red-500"></i>
                          <span>Consultoria Nutricional</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="bug">
                        <div className="flex items-center gap-2">
                          <i className="ri-bug-line text-orange-500"></i>
                          <span>Reportar um Problema</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="other">
                        <div className="flex items-center gap-2">
                          <i className="ri-more-2-fill text-slate-500"></i>
                          <span>Outro Assunto</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <i className="ri-message-2-line text-primary-500"></i>
                    Mensagem
                  </Label>
                  <Textarea
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Descreva detalhadamente sua dúvida ou solicitação..."
                    className="rounded-lg border-slate-200 focus:border-primary-400 focus:ring-primary-200 resize-none bg-white/70"
                  />
                </div>
                
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pt-2">
                  <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm">
                    <i className="ri-shield-check-line text-green-500"></i>
                    <span>Suas informações estão protegidas e não serão compartilhadas</span>
                  </div>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="rounded-xl px-10 py-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {isPending ? 
                      <span className="flex items-center gap-2">
                        <i className="ri-loader-4-line animate-spin"></i>
                        <span>Enviando mensagem...</span>
                      </span> : 
                      <span className="flex items-center gap-2">
                        <i className="ri-send-plane-fill"></i>
                        <span>Enviar Mensagem</span>
                      </span>
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab de Perguntas Frequentes */}
          <TabsContent value="faq">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                    <i className="ri-questionnaire-line text-xl"></i>
                  </div>
                  <div>
                    <CardTitle className="text-2xl">FAQ - Perguntas Frequentes</CardTitle>
                    <CardDescription className="text-slate-600">
                      Respostas para as dúvidas mais comuns sobre o NutriTrack
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="bg-gradient-to-r from-primary-50 to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-primary-100/50">
                  <h3 className="font-semibold text-primary-800 flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 flex-shrink-0">
                      <i className="ri-target-line"></i>
                    </div>
                    Como posso personalizar minhas metas nutricionais?
                  </h3>
                  <div className="mt-3 ml-11 text-slate-700">
                    <p>Você pode personalizar suas metas acessando a seção de <strong>Perfil</strong>, onde encontrará opções para configurar:</p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-slate-600 ml-4">
                      <li>Meta diária de calorias</li>
                      <li>Distribuição de macronutrientes (proteínas, carboidratos, gorduras)</li> 
                      <li>Objetivos específicos como perda de peso ou ganho muscular</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-purple-100/50">
                  <h3 className="font-semibold text-purple-800 flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 flex-shrink-0">
                      <i className="ri-restaurant-line"></i>
                    </div>
                    Posso adicionar meus próprios alimentos ao banco de dados?
                  </h3>
                  <div className="mt-3 ml-11 text-slate-700">
                    <p>Sim! Ao registrar uma refeição, você tem duas opções:</p>
                    <ul className="mt-2 space-y-1 text-slate-600 ml-4">
                      <li className="flex items-center gap-2">
                        <i className="ri-search-line text-purple-500"></i>
                        <span>Selecionar alimentos do nosso banco de dados pré-cadastrado</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <i className="ri-add-circle-line text-purple-500"></i>
                        <span>Adicionar um novo alimento com seus valores nutricionais personalizados</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-blue-100/50">
                  <h3 className="font-semibold text-blue-800 flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 flex-shrink-0">
                      <i className="ri-file-chart-line"></i>
                    </div>
                    Como exportar meus dados nutricionais?
                  </h3>
                  <div className="mt-3 ml-11 text-slate-700">
                    <p>Atualmente, você pode visualizar seus dados detalhados na página de <strong>Relatórios</strong>. Estamos trabalhando para lançar em breve:</p>
                    <div className="mt-2 flex flex-wrap gap-3 ml-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100/70 text-blue-700 rounded-full text-sm">
                        <i className="ri-file-pdf-line"></i> Exportação em PDF
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100/70 text-green-700 rounded-full text-sm">
                        <i className="ri-file-excel-line"></i> Exportação em CSV
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100/70 text-orange-700 rounded-full text-sm">
                        <i className="ri-share-line"></i> Compartilhamento direto
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-amber-50 to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-amber-100/50">
                  <h3 className="font-semibold text-amber-800 flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 flex-shrink-0">
                      <i className="ri-notification-3-line"></i>
                    </div>
                    Posso configurar lembretes para registrar minhas refeições?
                  </h3>
                  <div className="mt-3 ml-11 text-slate-700">
                    <p>Sim, na área de <strong>Perfil</strong> você encontra a seção de lembretes onde pode:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 ml-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          <i className="ri-time-line"></i>
                        </div>
                        <span>Definir horários personalizados</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          <i className="ri-repeat-line"></i>
                        </div>
                        <span>Configurar frequência</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 flex flex-col items-center justify-center">
                  <p className="text-slate-600 mb-4 text-center max-w-md">Não encontrou a resposta que procurava? Entre em contato diretamente com nossa equipe!</p>
                  <Button 
                    variant="outline" 
                    className="rounded-full px-6 py-5 bg-white shadow-md border-primary-200 hover:bg-primary-50 transition-all"
                    onClick={() => {
                      const tabs = document.querySelector('[role="tablist"]');
                      if (tabs) {
                        const messageTab = tabs.children[0] as HTMLElement;
                        if (messageTab) messageTab.click();
                      }
                    }}
                  >
                    <i className="ri-message-3-line mr-2 text-primary-500"></i> 
                    <span>Envie sua pergunta</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
