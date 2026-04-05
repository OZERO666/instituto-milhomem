import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Globe2, Languages, Loader2 } from 'lucide-react';
import api from '@/lib/apiServerClient';
import { Badge } from '@/components/ui/badge.jsx';

const RESOURCE_CONFIG = [
  {
    key: 'servicos',
    label: 'Servicos',
    fields: ['nome', 'descricao', 'beneficios', 'conteudo'],
    getItems: ({ services }) => services,
  },
  {
    key: 'artigos',
    label: 'Artigos',
    fields: ['titulo', 'resumo', 'conteudo'],
    getItems: ({ articles }) => articles,
  },
  {
    key: 'galeria',
    label: 'Galeria',
    fields: ['titulo'],
    getItems: ({ galleryItems }) => galleryItems,
  },
  {
    key: 'depoimentos',
    label: 'Depoimentos',
    fields: ['cargo', 'mensagem'],
    getItems: ({ testimonials }) => testimonials,
  },
  {
    key: 'faq',
    label: 'FAQ',
    fields: ['pergunta', 'resposta'],
    getItems: ({ faqItems }) => faqItems,
  },
];

const LOCALES = ['en', 'es'];

function countCompletedTranslations(items, translationsByRecord, fields) {
  return items.reduce((total, item) => {
    const translatedFields = translationsByRecord?.[String(item.id)] || {};
    const completedFields = fields.filter((field) => String(translatedFields[field] || '').trim()).length;
    return total + completedFields;
  }, 0);
}

function getCoverageTone(percent) {
  if (percent >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (percent >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-destructive bg-destructive/5 border-destructive/20';
}

export default function AdminTranslationCoverage({ services = [], articles = [], galleryItems = [], testimonials = [], faqItems = [] }) {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadCoverage = async () => {
      setLoading(true);
      try {
        const resourceResults = await Promise.all(
          RESOURCE_CONFIG.map(async (resource) => {
            const localeEntries = await Promise.all(
              LOCALES.map(async (locale) => {
                try {
                  const data = await api.get(`/traducoes/${resource.key}?lang=${locale}`);
                  return [locale, data || {}];
                } catch {
                  return [locale, {}];
                }
              })
            );

            return [resource.key, Object.fromEntries(localeEntries)];
          })
        );

        if (!cancelled) {
          setTranslations(Object.fromEntries(resourceResults));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCoverage();

    return () => {
      cancelled = true;
    };
  }, []);

  const resources = useMemo(() => {
    const source = { services, articles, galleryItems, testimonials, faqItems };

    return RESOURCE_CONFIG.map((resource) => {
      const items = resource.getItems(source) || [];
      const totalFields = items.length * resource.fields.length;

      const locales = LOCALES.map((locale) => {
        const translatedFields = countCompletedTranslations(items, translations[resource.key]?.[locale], resource.fields);
        const percent = totalFields === 0 ? 100 : Math.round((translatedFields / totalFields) * 100);
        return {
          locale,
          translatedFields,
          totalFields,
          percent,
        };
      });

      return {
        key: resource.key,
        label: resource.label,
        itemCount: items.length,
        locales,
      };
    });
  }, [articles, faqItems, galleryItems, services, testimonials, translations]);

  const overallCoverage = useMemo(() => {
    const localeTotals = LOCALES.map((locale) => {
      const translated = resources.reduce((sum, resource) => sum + (resource.locales.find((entry) => entry.locale === locale)?.translatedFields || 0), 0);
      const total = resources.reduce((sum, resource) => sum + (resource.locales.find((entry) => entry.locale === locale)?.totalFields || 0), 0);
      return {
        locale,
        translated,
        total,
        percent: total === 0 ? 100 : Math.round((translated / total) * 100),
      };
    });

    return localeTotals;
  }, [resources]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4 mb-4">
        <div>
          <h3 className="font-bold text-lg text-secondary flex items-center gap-2">
            <Languages className="w-5 h-5 text-primary" /> Completude De Traducoes
          </h3>
          <p className="text-sm text-muted-foreground">Acompanhe a cobertura de EN e ES nos recursos mais importantes do site.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {overallCoverage.map((item) => (
            <Badge key={item.locale} variant="outline">
              {item.locale.toUpperCase()}: {item.percent}%
            </Badge>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Carregando diagnostico de traducoes...
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map((resource) => (
            <div key={resource.key} className="rounded-xl border border-border px-4 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-secondary">{resource.label}</p>
                    <Badge variant="outline">{resource.itemCount} registro(s)</Badge>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5" /> cobertura por idioma
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resource.locales.map((localeData) => (
                  <div key={localeData.locale} className={`rounded-lg border px-3 py-3 ${getCoverageTone(localeData.percent)}`}>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{localeData.locale.toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-bold">{localeData.percent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden mb-2">
                      <div className="h-full rounded-full bg-current" style={{ width: `${localeData.percent}%` }} />
                    </div>
                    <p className="text-xs opacity-80">
                      {localeData.translatedFields} de {localeData.totalFields} campo(s) traduzidos
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}