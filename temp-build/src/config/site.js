// src/config/site.js

export const LOGO_URL =
  'https://horizons-cdn.hostinger.com/386178fc-68a2-4ae9-99a1-df6a1385b4b9/1e20c7dbf245fee0e2ca926ad4054327.png';

export const FAVICON_URL = LOGO_URL;
export const SOBRE_HERO_URL =
  'https://images.unsplash.com/photo-1666056445151-57949bacdd60';

export const NAV_ITEMS = [
  { name: 'Home',       path: '/' },
  { name: 'Serviços',   path: '/servicos' },
  { name: 'Sobre',      path: '/sobre' },
  { name: 'Resultados', path: '/resultados' },
  { name: 'Blog',       path: '/blog' },
  { name: 'Contato',    path: '/contato' },
];

export const CONTATO_DEFAULTS = {
  whatsapp:            '5562981070937',
  telefone:            '(62) 98107-0937',
  email:               'contato@institutomilhomem.com',
  endereco:            'Setor Bueno, Goiânia - GO',
  maps_url:            'https://maps.google.com/?q=Setor+Bueno+Goiania+GO',
  instagram:           'https://www.instagram.com/institutomilhomem',
  facebook:            'https://facebook.com/institutomilhomem',
  dias_funcionamento:  'Segunda a Sexta',
  horario:             '8h às 17h',
  mensagem_header:     'Olá! Gostaria de mais informações sobre o atendimento do Dr. Pablo Milhomem.',
  logo_url:            LOGO_URL,
  favicon_url:         FAVICON_URL,
  sobre_hero_image:    SOBRE_HERO_URL,
};

export const SOBRE_DEFAULTS = {
  // Hero
  hero_title: 'Conheça Nossa Clínica',
  hero_subtitle: 'Um ambiente onde a equipe especializada une tecnologia de ponta e acolhimento premium para resultados naturais.',
  hero_image: SOBRE_HERO_URL,
  hero_badge: 'Padrão Internacional',

  // Doctor
  doctor_name: 'Dr. Pablo Milhomem',
  doctor_title: 'Fundador & Cirurgião Chefe',
  doctor_image: 'https://images.unsplash.com/photo-1637059824899-a441006a6875',
  doctor_bio: 'Especialista dedicado exclusivamente à arte e ciência do transplante capilar. Com formação rigorosa e constante atualização nos maiores centros de referência mundial, o Dr. Pablo construiu o Instituto Milhomem sobre o pilar da excelência absoluta.\n\nSua abordagem une a precisão cirúrgica a um apurado senso estético, garantindo que cada folículo seja posicionado para criar densidade, naturalidade e harmonia com os traços faciais do paciente.',
  doctor_credentials: [
    'Membro da International Society of Hair Restoration Surgery (ISHRS)',
    'Especialista em Técnica FUE e Preview Long Hair',
    'Milhares de procedimentos realizados com sucesso',
  ],
  doctor_experience_number: '15+',
  doctor_experience_label: 'Anos de Experiência',

  // WFI
  wfi_badge: 'Reconhecimento Global',
  wfi_title: 'World FUE Institute',
  wfi_text: 'O Dr. Pablo Milhomem é membro ativo e instrutor convidado do World FUE Institute (WFI), uma das mais prestigiadas organizações internacionais dedicadas ao avanço e ensino da técnica FUE. Este reconhecimento atesta o compromisso do Instituto Milhomem com os mais altos padrões globais de qualidade e inovação em restauração capilar.',
  wfi_link: 'https://wfiworkshops.com/',

  // About
  about_title: 'Uma jornada construída para transformar vidas',
  about_text: 'No Instituto Milhomem, cada caso é tratado com exclusividade. Nossa clínica combina protocolos avançados, atendimento humanizado e total transparência em todas as etapas do transplante capilar.',
  about_detail_text: 'Cada detalhe da nossa clínica foi projetado para oferecer conforto, segurança e resultados excepcionais. Da recepção acolhedora ao centro cirúrgico de última geração, tudo é pensado para proporcionar uma experiência premium ao paciente.',
  about_image: 'https://images.unsplash.com/photo-1637059824899-a441006a6875',

  // Values
  values_title: 'Nossa Filosofia',
  values_subtitle: '',
  values: [
    { title: 'Excelência', description: 'Busca incessante pela perfeição em cada detalhe, com protocolos internacionais.' },
    { title: 'Discrição', description: 'Atendimento sigiloso e ambiente privativo para sua segurança e conforto.' },
    { title: 'Conforto', description: 'Infraestrutura premium pensada para tornar cada visita mais tranquila e acolhedora.' },
    { title: 'Inovação', description: 'Tecnologia de ponta e métodos modernos para resultados mais naturais e duradouros.' },
  ],

  // Team
  team_title: 'Equipe Multidisciplinar',
  team_subtitle: 'O sucesso de um transplante capilar depende de uma equipe perfeitamente sincronizada. Nossos profissionais são altamente treinados para garantir segurança e resultados impecáveis.',
  team: [
    { name: 'Dra. Ana Silva', role: 'Anestesiologista', image: 'https://images.unsplash.com/photo-1594824432258-f6a115114297', desc: 'Especialista em conforto e segurança do paciente durante todo o procedimento.' },
    { name: 'Carlos Mendes', role: 'Enfermeiro Chefe', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7', desc: 'Coordena a equipe de instrumentação com precisão cirúrgica e cuidado humanizado.' },
    { name: 'Mariana Costa', role: 'Tricologista Clínica', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2', desc: 'Responsável pelos tratamentos complementares e preparo do couro cabeludo.' },
  ],

  // Technology
  technology_title: 'Tecnologia de Vanguarda',
  technology_text: 'Utilizamos microscópios de alta resolução para a lapidação dos folículos e extratores motorizados de precisão milimétrica. Isso garante a integridade de cada unidade folicular, maximizando a taxa de sobrevivência e o volume final do transplante.\n\nNossos protocolos de anestesia local computadorizada proporcionam um procedimento praticamente indolor, permitindo que você relaxe, assista a um filme ou ouça música durante a cirurgia.',
  technology_image: 'https://images.unsplash.com/photo-1516841273335-e39b37888115',
};

export const PAGE_CONFIG_DEFAULTS = {
  home: {
    services: {
      badge: 'Especialidades',
      title: 'Tratamentos capilares de alta performance',
      subtitle: 'Do transplante FUE a terapias complementares - cada protocolo pensado para o seu caso.',
      cta_text: 'Ver todos os serviços',
    },
    journey: {
      badge: 'Processo',
      title: 'A Jornada do Paciente',
      cta_text: 'Iniciar minha jornada',
      steps: [
        { step: 1, title: 'Avaliacao', desc: 'Analise detalhada do couro cabeludo e definicao da estrategia.' },
        { step: 2, title: 'Planejamento', desc: 'Desenho da linha capilar e calculo preciso de enxertos.' },
        { step: 3, title: 'Procedimento', desc: 'Realizacao com anestesia local, conforto e seguranca maxima.' },
        { step: 4, title: 'Acompanhamento', desc: 'Suporte continuo ate o resultado final definitivo.' },
      ],
    },
    about: {
      badge: 'O Instituto',
      title: 'Excelencia e dedicacao',
      highlight: 'em cada foliculo',
      paragraph_1: 'O Instituto Milhomem nasceu para devolver algo maior do que cabelo: a seguranca de se olhar no espelho e se reconhecer de novo. Unimos tecnologia de ponta com um olhar estetico cuidadoso em cada caso.',
      paragraph_2: 'Aqui voce e acompanhado pelo mesmo time do comeco ao fim - com transparencia, previsibilidade de resultados e suporte completo no pre e pos-operatorio.',
      cta_text: 'Conheca nossa clinica',
      images: [
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400',
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
      ],
      card_text: 'Avaliacao\nsem compromisso',
      card_button_text: 'Agendar agora',
    },
    results: {
      badge: 'Galeria',
      title: 'Resultados que transformam',
      subtitle: 'Acompanhe a evolucao real de nossos pacientes. Passe o mouse para ver o antes e depois.',
      cta_text: 'Ver galeria completa',
    },
    testimonials: {
      badge: 'Depoimentos',
      title: 'O que dizem nossos pacientes',
      subtitle: 'Historias reais de pessoas que recuperaram a autoestima com o Instituto Milhomem.',
    },
    blog: {
      badge: 'Conteudo',
      title: 'Ultimas do Blog',
      cta_text: 'Ver todos os artigos',
      empty_title: 'Nenhum artigo publicado ainda.',
      empty_subtitle: 'Volte em breve!',
    },
    final_cta: {
      badge: 'Agendamento',
      title: 'Pronto para dar o primeiro passo?',
      subtitle: 'Agende uma avaliacao com o time do Instituto Milhomem e receba um plano personalizado para o seu caso, sem compromisso de realizacao do procedimento.',
      primary_cta_text: 'Agendar pelo WhatsApp',
      secondary_cta_text: 'Ver todas as formas de contato',
    },
  },
  servicos: {
    header_badge: 'Especialidades',
    header_title: 'Nossos Servicos',
    header_subtitle: 'Oferecemos as tecnicas mais modernas e seguras do mundo para restauracao capilar, sempre com foco em resultados naturais, definitivos e atendimento personalizado.',
  },
  blog: {
    header_badge: 'Conteudo',
    header_title: 'Blog',
    header_subtitle: 'Informacoes, dicas e novidades sobre transplante capilar, saude dos fios e tratamentos avancados.',
    all_categories_label: 'Todos',
    search_placeholder: 'Pesquisar artigos...',
    empty_title: 'Nenhum artigo encontrado nesta categoria.',
    empty_subtitle: 'Tente ajustar os filtros ou pesquisar por outro termo.',
  },
  contato: {
    header_badge: 'Atendimento',
    header_title: 'Entre em',
    header_highlight: 'Contato',
    header_subtitle: 'Agende sua avaliacao gratuita e tire todas as suas duvidas sobre nossos tratamentos capilares.',
    form_title: 'Envie uma mensagem',
    info_title: 'Informacoes de Contato',
  },
  resultados: {
    header_badge: 'Galeria',
    header_title: 'Resultados Reais',
    header_subtitle: 'Acompanhe a transformacao de nossos pacientes atraves de fotos antes e depois e depoimentos autenticos.',
    testimonials_badge: 'Depoimentos',
    testimonials_title: 'O que nossos pacientes dizem',
  },
  footer: {
    description: 'Especialista em procedimentos esteticos e cirurgias plasticas com excelencia, seguranca e resultados naturais.',
    rights_text: 'Instituto Milhomem. Todos os direitos reservados.',
    credits_text: 'Desenvolvido com excelencia para o Dr. Pablo Milhomem',
  },
  service_detail: {
    breadcrumb_home: 'Inicio',
    breadcrumb_services: 'Servicos',
    loading_text: 'Carregando...',
    not_found_title: 'Servico nao encontrado',
    not_found_subtitle: 'O servico que voce procura nao existe ou foi removido.',
    not_found_button: 'Ver todos os servicos',
    hero_badge: 'Servico',
    hero_cta_text: 'Agendar Avaliacao',
    benefits_title: 'Beneficios',
    sidebar_title: 'Quer saber mais?',
    sidebar_text_prefix: 'Fale com nossa equipe e tire todas as suas duvidas sobre',
    sidebar_button: 'Falar no WhatsApp',
    back_to_services: 'Ver todos os servicos',
    related_badge: 'Veja tambem',
    related_title: 'Outros Servicos',
  },
  blog_post: {
    loading_text: 'Carregando artigo...',
    not_found_title: 'Artigo nao encontrado',
    back_to_blog: 'Voltar para o blog',
    related_title: 'Artigos Relacionados',
    related_cta: 'Ler artigo',
  },
  labels: {
    service_card_cta: 'Saiba mais',
    blog_card_cta: 'Ler artigo',
    before_after_empty: 'Nenhum resultado encontrado para este tema.',
    testimonials_empty: 'Nenhum depoimento cadastrado ainda.',
  },
};
