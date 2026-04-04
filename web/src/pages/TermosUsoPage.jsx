// src/pages/TermosUsoPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold text-secondary mb-3 border-b border-border pb-2">{title}</h2>
    <div className="text-foreground/80 leading-relaxed space-y-3 text-sm">{children}</div>
  </section>
);

const TermosUsoPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('terms.page_title')}</title>
        <meta name="description" content={t('terms.meta_desc')} />
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
                {t('terms.page_heading')}
              </h1>
            </div>
            <p className="text-white/60 text-sm">
              {t('terms.last_updated')}
            </p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="container-custom max-w-4xl py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-12">

            <Section title={t('terms.s1_title')}>
              <p>
                {t('terms.s1_p1_pre')} <strong>institutomilhomem.com</strong> {t('terms.s1_p1_mid')}{' '}
                <Link to="/politica-de-privacidade" className="text-primary hover:underline font-medium">
                  {t('terms.s1_p1_privacy')}
                </Link>
                {t('terms.s1_p1_post')}
              </p>
            </Section>

            <Section title={t('terms.s2_title')}>
              <p>{t('terms.s2_p1')}</p>
              <p>{t('terms.s2_p2')}</p>
            </Section>

            <Section title={t('terms.s3_title')}>
              <p>{t('terms.s3_intro')}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('terms.s3_b1')}</li>
                <li>{t('terms.s3_b2')}</li>
                <li>{t('terms.s3_b3')}</li>
              </ul>
            </Section>

            <Section title={t('terms.s4_title')}>
              <p>{t('terms.s4_intro')}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('terms.s4_b1')}</li>
                <li>{t('terms.s4_b2')}</li>
                <li>{t('terms.s4_b3')}</li>
                <li>{t('terms.s4_b4')}</li>
                <li>{t('terms.s4_b5')}</li>
              </ul>
            </Section>

            <Section title={t('terms.s5_title')}>
              <p>{t('terms.s5_p1')}</p>
              <p>{t('terms.s5_p2')}</p>
            </Section>

            <Section title={t('terms.s6_title')}>
              <p>{t('terms.s6_p1')}</p>
              <p>{t('terms.s6_p2')}</p>
            </Section>

            <Section title={t('terms.s7_title')}>
              <p>{t('terms.s7_p1')}</p>
            </Section>

            <Section title={t('terms.s8_title')}>
              <p>{t('terms.s8_p1')}</p>
            </Section>

            <Section title={t('terms.s9_title')}>
              <p>{t('terms.s9_p1')}</p>
            </Section>

            <Section title={t('terms.s10_title')}>
              <p>{t('terms.s10_p1')}</p>
            </Section>

            <Section title={t('terms.s11_title')}>
              <p>
                {t('terms.s11_p1')}{' '}
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
                {t('terms.back_home')}
              </Link>
              <Link
                to="/politica-de-privacidade"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                {t('terms.see_privacy')}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TermosUsoPage;
