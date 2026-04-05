import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, FileWarning, ImageOff, MailWarning } from 'lucide-react';
import { Badge } from '@/components/ui/badge.jsx';

const ALERT_STYLES = {
  critical: {
    card: 'border-destructive/30 bg-destructive/5',
    icon: 'text-destructive bg-destructive/10',
    badge: 'destructive',
    label: 'Critico',
  },
  warning: {
    card: 'border-amber-300 bg-amber-50',
    icon: 'text-amber-700 bg-amber-100',
    badge: 'secondary',
    label: 'Atencao',
  },
  info: {
    card: 'border-sky-300 bg-sky-50',
    icon: 'text-sky-700 bg-sky-100',
    badge: 'outline',
    label: 'Info',
  },
  success: {
    card: 'border-emerald-300 bg-emerald-50',
    icon: 'text-emerald-700 bg-emerald-100',
    badge: 'outline',
    label: 'OK',
  },
};

const createAlert = (severity, icon, title, description) => ({ severity, icon, title, description });

export default function AdminOverviewAlerts({ bookings = [], services = [], galleryItems = [], articles = [], auditLogs = [] }) {
  const alerts = useMemo(() => {
    const unreadBookings = bookings.filter((item) => !item.lido).length;
    const servicesWithoutImage = services.filter((item) => !item.imagem).length;
    const draftArticles = articles.filter((item) => item.status === 'draft').length;
    const publishedArticles = articles.filter((item) => item.status !== 'draft').length;
    const incompleteGalleryItems = galleryItems.filter((item) => !item.foto_antes || !item.foto_depois).length;
    const latestAuditLog = auditLogs[0]?.timestamp ? new Date(auditLogs[0].timestamp) : null;
    const daysSinceLastActivity = latestAuditLog
      ? Math.floor((Date.now() - latestAuditLog.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    const nextAlerts = [];

    if (unreadBookings > 0) {
      nextAlerts.push(
        createAlert(
          unreadBookings >= 5 ? 'critical' : 'warning',
          MailWarning,
          'Leads aguardando resposta',
          `${unreadBookings} lead(s) ainda nao foram marcados como lidos no painel.`
        )
      );
    }

    if (services.length === 0) {
      nextAlerts.push(createAlert('critical', FileWarning, 'Sem servicos cadastrados', 'A pagina de servicos depende de ao menos um servico ativo e visivel.'));
    } else if (servicesWithoutImage > 0) {
      nextAlerts.push(
        createAlert(
          'warning',
          ImageOff,
          'Servicos sem imagem',
          `${servicesWithoutImage} servico(s) estao sem imagem representativa no admin.`
        )
      );
    }

    if (articles.length === 0) {
      nextAlerts.push(createAlert('warning', FileWarning, 'Blog sem conteudo', 'Nenhum artigo foi cadastrado ainda no blog.'));
    } else {
      if (publishedArticles === 0) {
        nextAlerts.push(createAlert('critical', FileWarning, 'Nenhum artigo publicado', 'Existem artigos cadastrados, mas nenhum esta publicado para o site publico.'));
      }
      if (draftArticles > 0) {
        nextAlerts.push(
          createAlert(
            'info',
            Clock3,
            'Rascunhos pendentes',
            `${draftArticles} artigo(s) ainda estao em rascunho e podem exigir revisao/publicacao.`
          )
        );
      }
    }

    if (galleryItems.length === 0) {
      nextAlerts.push(createAlert('warning', ImageOff, 'Galeria vazia', 'Nenhum caso foi cadastrado na galeria de resultados.'));
    } else if (incompleteGalleryItems > 0) {
      nextAlerts.push(
        createAlert(
          'warning',
          ImageOff,
          'Itens incompletos na galeria',
          `${incompleteGalleryItems} item(ns) nao possuem foto de antes ou depois.`
        )
      );
    }

    if (!latestAuditLog) {
      nextAlerts.push(createAlert('info', Clock3, 'Sem atividade recente', 'Nenhum log de auditoria foi encontrado ainda para o painel.'));
    } else if (daysSinceLastActivity >= 14) {
      nextAlerts.push(
        createAlert(
          'info',
          Clock3,
          'Baixa atividade no admin',
          `Nenhuma atividade relevante foi registrada ha ${daysSinceLastActivity} dias.`
        )
      );
    }

    if (nextAlerts.length === 0) {
      nextAlerts.push(createAlert('success', CheckCircle2, 'Painel em dia', 'Nenhum alerta operacional critico foi identificado com os dados atuais.'));
    }

    return nextAlerts;
  }, [articles, auditLogs, bookings, galleryItems, services]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-3 mb-4">
        <div>
          <h3 className="font-bold text-lg text-secondary">Alertas Operacionais</h3>
          <p className="text-sm text-muted-foreground">Diagnostico rapido do conteudo e da operacao do painel.</p>
        </div>
        <Badge variant="outline">{alerts.length} item(ns)</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          const styles = ALERT_STYLES[alert.severity] ?? ALERT_STYLES.info;

          return (
            <div key={`${alert.severity}-${alert.title}`} className={`rounded-xl border p-4 ${styles.card}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${styles.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-secondary">{alert.title}</h4>
                    <Badge variant={styles.badge}>{styles.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{alert.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}