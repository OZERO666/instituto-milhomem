import {
  Activity,
  Mail,
  List,
  Image,
  FileText,
  MessageSquare,
  BarChart3,
  MapPin,
  Search,
  Layout,
  Globe,
  Info,
  UserCircle,
  Cpu,
  Heart,
} from 'lucide-react';

export const ADMIN_TABS = [
  { value: 'overview', icon: Activity, label: 'Resumo' },
  { value: 'bookings', icon: Mail, label: 'Leads', badgeKey: 'unreadBookings' },
  { value: 'services', icon: List, label: 'Serviços' },
  { value: 'gallery', icon: Image, label: 'Galeria' },
  { value: 'blog', icon: FileText, label: 'Blog' },
  { value: 'testimonials', icon: MessageSquare, label: 'Depoimentos' },
  { value: 'stats', icon: BarChart3, label: 'Estatísticas' },
  { value: 'contact', icon: MapPin, label: 'Contato' },
  { value: 'branding', icon: Image, label: 'Branding' },
  { value: 'seo', icon: Search, label: 'SEO' },
  { value: 'hero', icon: Layout, label: 'Hero' },
  { value: 'pages', icon: Globe, label: 'Páginas' },
  { value: 'sobre', icon: Info, label: 'Sobre' },
];

export const PAGES_SECTION_OPTIONS = [
  { key: 'home', label: 'Home' },
  { key: 'servicos', label: 'Serviços' },
  { key: 'blog', label: 'Blog' },
  { key: 'contato', label: 'Contato' },
  { key: 'resultados', label: 'Resultados' },
  { key: 'footer', label: 'Footer' },
  { key: 'service_detail', label: 'Detalhe Serviço' },
  { key: 'blog_post', label: 'Post do Blog' },
  { key: 'labels', label: 'Labels Globais' },
];

export const SOBRE_SECTION_OPTIONS = [
  { key: 'hero', icon: Layout, label: 'Hero' },
  { key: 'doctor', icon: UserCircle, label: 'Doutor' },
  { key: 'wfi', icon: Globe, label: 'WFI' },
  { key: 'about', icon: Info, label: 'Sobre' },
  { key: 'values', icon: Heart, label: 'Valores' },
  { key: 'team', icon: List, label: 'Equipe' },
  { key: 'technology', icon: Cpu, label: 'Tecnologia' },
];
