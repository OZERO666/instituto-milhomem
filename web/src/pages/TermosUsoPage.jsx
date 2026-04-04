// src/pages/TermosUsoPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold text-secondary mb-3 border-b border-border pb-2">{title}</h2>
    <div className="text-foreground/80 leading-relaxed space-y-3 text-sm">{children}</div>
  </section>
);

const TermosUsoPage = () => (
  <>
    <Helmet>
      <title>Termos de Uso | Instituto Milhomem</title>
      <meta name="description" content="Termos e condições de uso do site do Instituto Milhomem." />
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
            <FileText className="w-7 h-7 text-primary" />
            <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide">
              Termos de Uso
            </h1>
          </div>
          <p className="text-white/60 text-sm">
            Última atualização: abril de 2025
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container-custom max-w-4xl py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-12">

          <Section title="1. Aceitação dos termos">
            <p>
              Ao acessar e utilizar o site <strong>institutomilhomem.com</strong> ("Site"), você
              concorda com estes Termos de Uso e com nossa{' '}
              <Link to="/politica-de-privacidade" className="text-primary hover:underline font-medium">
                Política de Privacidade
              </Link>
              . Se não concordar, por favor não utilize o Site.
            </p>
          </Section>

          <Section title="2. Finalidade do site">
            <p>
              O Site tem finalidade <strong>informativa e comercial</strong>, apresentando os serviços
              de transplante capilar e procedimentos oferecidos pelo Instituto Milhomem.
              O conteúdo disponibilizado não constitui aconselhamento médico individualizado.
            </p>
            <p>
              Para diagnóstico e indicação de tratamento, consulte pessoalmente um profissional
              habilitado do Instituto Milhomem.
            </p>
          </Section>

          <Section title="3. Uso permitido">
            <p>Você pode usar o Site para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Obter informações sobre os serviços oferecidos.</li>
              <li>Entrar em contato e solicitar agendamento de consulta.</li>
              <li>Navegar pelo conteúdo educativo do blog.</li>
            </ul>
          </Section>

          <Section title="4. Restrições de uso">
            <p>É <strong>proibido</strong>:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Reproduzir, copiar ou distribuir conteúdo do Site sem autorização prévia e por escrito.</li>
              <li>Usar o Site para envio de spam, phishing ou qualquer atividade ilícita.</li>
              <li>Tentar acessar áreas restritas sem autorização (ex.: painel administrativo).</li>
              <li>Utilizar robôs, scrapers ou qualquer meio automatizado para coletar dados do Site.</li>
              <li>Publicar conteúdo falso, difamatório ou que viole direitos de terceiros.</li>
            </ul>
          </Section>

          <Section title="5. Propriedade intelectual">
            <p>
              Todo o conteúdo do Site — textos, imagens, logotipos, vídeos e código-fonte — é de
              propriedade do <strong>Instituto Milhomem</strong> ou de seus licenciantes, protegido
              pela Lei nº 9.610/1998 (Lei de Direitos Autorais).
            </p>
            <p>
              A reprodução parcial ou total sem autorização expressa constitui violação de direitos
              autorais e sujeita o infrator às penalidades legais cabíveis.
            </p>
          </Section>

          <Section title="6. Conteúdo de saúde – aviso importante">
            <p>
              As informações sobre procedimentos médicos, resultados e tratamentos disponíveis no
              Site têm caráter <strong>exclusivamente educativo e informativo</strong>.
            </p>
            <p>
              Resultados individuais podem variar. O Instituto Milhomem não garante resultados
              específicos. Toda indicação terapêutica é realizada individualmente durante consulta
              médica presencial.
            </p>
          </Section>

          <Section title="7. Links externos">
            <p>
              O Site pode conter links para sites de terceiros (ex.: redes sociais, publicações
              científicas). O Instituto Milhomem não se responsabiliza pelo conteúdo, políticas de
              privacidade ou práticas desses sites.
            </p>
          </Section>

          <Section title="8. Limitação de responsabilidade">
            <p>
              O Instituto Milhomem não será responsável por danos diretos, indiretos, incidentais
              ou consequenciais decorrentes do uso ou da incapacidade de uso do Site, incluindo
              interrupções técnicas, erros de conteúdo ou perda de dados.
            </p>
          </Section>

          <Section title="9. Alterações nos termos">
            <p>
              Reservamo-nos o direito de modificar estes Termos a qualquer momento. Alterações
              entram em vigor na data de publicação. O uso continuado do Site após as alterações
              implica aceitação dos novos Termos.
            </p>
          </Section>

          <Section title="10. Lei aplicável e foro">
            <p>
              Estes Termos são regidos pela <strong>lei brasileira</strong>. Para dirimir eventuais
              controvérsias, fica eleito o foro da comarca de <strong>Goiânia – GO</strong>, com
              renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </Section>

          <Section title="11. Contato">
            <p>
              Dúvidas sobre estes Termos? Entre em contato:{' '}
              <a href="mailto:contato@institutomilhomem.com" className="text-primary hover:underline font-medium">
                contato@institutomilhomem.com
              </a>
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
              to="/politica-de-privacidade"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Ver Política de Privacidade →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  </>
);

export default TermosUsoPage;
