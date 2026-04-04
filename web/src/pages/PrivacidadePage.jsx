// src/pages/PrivacidadePage.jsx
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold text-secondary mb-3 border-b border-border pb-2">{title}</h2>
    <div className="text-foreground/80 leading-relaxed space-y-3 text-sm">{children}</div>
  </section>
);

const PrivacidadePage = () => (
  <>
    <Helmet>
      <title>Política de Privacidade | Instituto Milhomem</title>
      <meta name="description" content="Política de privacidade e proteção de dados do Instituto Milhomem, em conformidade com a LGPD." />
      <meta name="robots" content="noindex" />
    </Helmet>

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-muted"
    >
      {/* Header */}
      <div className="bg-secondary text-white py-14">
        <div className="container-custom max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-7 h-7 text-primary" />
            <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide">
              Política de Privacidade
            </h1>
          </div>
          <p className="text-white/60 text-sm">
            Última atualização: abril de 2025 · Em conformidade com a{' '}
            <strong className="text-white/80">Lei nº 13.709/2018 (LGPD)</strong>
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container-custom max-w-4xl py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-12">

          <Section title="1. Quem somos">
            <p>
              O <strong>Instituto Milhomem</strong> (CNPJ: 39.875.746/0001-84), com sede no Setor Bueno,
              Goiânia – GO, é o controlador dos dados pessoais tratados neste site, nos termos do
              art. 5º, VI da LGPD.
            </p>
            <p>
              Nosso canal de contato para assuntos de privacidade:{' '}
              <a href="mailto:contato@institutomilhomem.com" className="text-primary hover:underline font-medium">
                contato@institutomilhomem.com
              </a>
            </p>
          </Section>

          <Section title="2. Dados que coletamos">
            <p>Coletamos apenas os dados necessários para as finalidades abaixo:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Formulário de contato / agendamento:</strong> nome, e-mail, telefone, tipo de serviço e mensagem opcional.</li>
              <li><strong>Navegação:</strong> endereço IP, tipo de navegador, páginas visitadas e tempo de permanência (via cookies técnicos, sem rastreamento de terceiros).</li>
              <li><strong>Área administrativa:</strong> credenciais de acesso (e-mail e senha criptografada) dos colaboradores autorizados.</li>
            </ul>
            <p>Não coletamos dados sensíveis (saúde, biométricos, etc.) sem consentimento explícito.</p>
          </Section>

          <Section title="3. Como usamos seus dados">
            <ul className="list-disc pl-5 space-y-1">
              <li>Responder consultas e agendar tratamentos.</li>
              <li>Enviar comunicações relacionadas ao serviço solicitado.</li>
              <li>Melhorar a experiência e o desempenho do site.</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
            <p>
              <strong>Base legal:</strong> consentimento (art. 7º, I), execução de contrato (art. 7º, V)
              e legítimo interesse (art. 7º, IX), conforme aplicável a cada finalidade.
            </p>
          </Section>

          <Section title="4. Compartilhamento de dados">
            <p>
              Seus dados <strong>não são vendidos ou compartilhados com terceiros para fins comerciais</strong>.
              Podemos compartilhá-los exclusivamente com:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Prestadores de serviços de TI (hospedagem, e-mail) sob contrato de confidencialidade.</li>
              <li>Autoridades públicas, quando exigido por lei.</li>
            </ul>
          </Section>

          <Section title="5. Cookies">
            <p>
              Utilizamos apenas <strong>cookies técnicos essenciais</strong> para o funcionamento do site
              (manutenção de sessão, segurança). Não usamos cookies de rastreamento ou publicidade.
            </p>
            <p>
              Você pode desativar cookies nas configurações do seu navegador, mas isso pode afetar
              algumas funcionalidades do site.
            </p>
          </Section>

          <Section title="6. Retenção dos dados">
            <p>
              Os dados do formulário de contato são mantidos pelo período necessário para atender à
              solicitação e, em seguida, pelo prazo legal de 5 anos para eventual comprovação de
              prestação de serviço (art. 12 do Código de Defesa do Consumidor).
            </p>
            <p>
              Dados de colaboradores são excluídos em até 30 dias após o encerramento do vínculo.
            </p>
          </Section>

          <Section title="7. Seus direitos (LGPD, art. 18)">
            <p>Você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Confirmar a existência de tratamento de seus dados.</li>
              <li>Acessar, corrigir ou atualizar seus dados.</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
              <li>Peticionar à Autoridade Nacional de Proteção de Dados (ANPD).</li>
            </ul>
            <p>
              Para exercer seus direitos, entre em contato pelo e-mail{' '}
              <a href="mailto:contato@institutomilhomem.com" className="text-primary hover:underline font-medium">
                contato@institutomilhomem.com
              </a>{' '}
              com o assunto "LGPD – [seu direito]". Responderemos em até 15 dias.
            </p>
          </Section>

          <Section title="8. Segurança">
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo:
              criptografia de senhas (bcrypt), comunicação via HTTPS, controle de acesso baseado
              em papéis (RBAC) e logs de auditoria de ações administrativas.
            </p>
          </Section>

          <Section title="9. Alterações nesta política">
            <p>
              Esta política pode ser atualizada periodicamente. Alterações relevantes serão
              comunicadas mediante aviso no site. A data da última atualização está sempre indicada
              no topo desta página.
            </p>
          </Section>

          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </Link>
            <Link
              to="/termos-de-uso"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Ver Termos de Uso →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  </>
);

export default PrivacidadePage;
