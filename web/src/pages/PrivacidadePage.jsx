// src/pages/PrivacidadePage.jsx
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold text-secondary mb-3 border-b border-border pb-2">{title}</h2>
    <div className="text-foreground/80 leading-relaxed space-y-3 text-sm">{children}</div>
  </section>
);

const PrivacidadePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('privacy.page_title')}</title>
        <meta name="description" content={t('privacy.meta_desc')} />
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
                {t('privacy.page_heading')}
              </h1>
            </div>
            <p className="text-white/60 text-sm">
              {t('privacy.last_updated')}{' '}
              <strong className="text-white/80">{t('privacy.lgpd_ref')}</strong>
            </p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="container-custom max-w-4xl py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-12">

            <Section title={t('privacy.s1_title')}>
              <p>{t('privacy.s1_p1')}</p>
              <p>
                {t('privacy.s1_p2')}{' '}
                <a href="mailto:contato@institutomilhomem.com" className="text-primary hover:underline font-medium">
                  contato@institutomilhomem.com
                </a>
              </p>
            </Section>

            <Section title={t('privacy.s2_title')}>
              <p>{t('privacy.s2_intro')}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>{t('privacy.s2_b1_label')}</strong> {t('privacy.s2_b1_text')}</li>
                <li><strong>{t('privacy.s2_b2_label')}</strong> {t('privacy.s2_b2_text')}</li>
                <li><strong>{t('privacy.s2_b3_label')}</strong> {t('privacy.s2_b3_text')}</li>
              </ul>
              <p>{t('privacy.s2_note')}</p>
            </Section>

            <Section title={t('privacy.s3_title')}>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('privacy.s3_b1')}</li>
                <li>{t('privacy.s3_b2')}</li>
                <li>{t('privacy.s3_b3')}</li>
                <li>{t('privacy.s3_b4')}</li>
              </ul>
              <p>
                <strong>{t('privacy.s3_legal_label')}</strong>{' '}{t('privacy.s3_legal_text')}
              </p>
            </Section>

            <Section title={t('privacy.s4_title')}>
              <p>{t('privacy.s4_intro')}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('privacy.s4_b1')}</li>
                <li>{t('privacy.s4_b2')}</li>
              </ul>
            </Section>

            <Section title={t('privacy.s5_title')}>
              <p>{t('privacy.s5_p1')}</p>
              <p>{t('privacy.s5_p2')}</p>
            </Section>

            <Section title={t('privacy.s6_title')}>
              <p>{t('privacy.s6_p1')}</p>
              <p>{t('privacy.s6_p2')}</p>
            </Section>

            <Section title={t('privacy.s7_title')}>
              <p>{t('privacy.s7_intro')}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('privacy.s7_b1')}</li>
                <li>{t('privacy.s7_b2')}</li>
                <li>{t('privacy.s7_b3')}</li>
                <li>{t('privacy.s7_b4')}</li>
                <li>{t('privacy.s7_b5')}</li>
              </ul>
              <p>
                {t('privacy.s7_contact_pre')}{' '}
                <a href="mailto:contato@institutomilhomem.com" className="text-primary hover:underline font-medium">
                  contato@institutomilhomem.com
                </a>{' '}
                {t('privacy.s7_contact_post')}
              </p>
            </Section>

            <Section title={t('privacy.s8_title')}>
              <p>{t('privacy.s8_p1')}</p>
            </Section>

            <Section title={t('privacy.s9_title')}>
              <p>{t('privacy.s9_p1')}</p>
            </Section>

            <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('privacy.back_home')}
              </Link>
              <Link
                to="/termos-de-uso"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                {t('privacy.see_terms')}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PrivacidadePage;
