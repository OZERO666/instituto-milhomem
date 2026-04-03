-- ================================================================
-- Instituto Milhomem — Content Seed v1
-- Run AFTER 000_schema_completo.sql
--
-- Seeds default Portuguese content into all config tables and
-- populates the `traducoes` table with EN and ES translations.
-- Uses fixed UUIDs so FK references in `traducoes` are stable.
-- Safe to re-run (uses INSERT IGNORE / ON DUPLICATE KEY UPDATE).
-- ================================================================

-- ----------------------------------------------------------------
-- Fixed UUIDs for seeded records
-- ----------------------------------------------------------------
SET @hero_id    = '00000001-seed-0000-0000-000000000001';
SET @contato_id = '00000002-seed-0000-0000-000000000001';
SET @sobre_id   = '00000003-seed-0000-0000-000000000001';
SET @estat_id   = '00000004-seed-0000-0000-000000000001';
SET @role_admin = '00000005-seed-0000-0000-000000000001';

SET @svc_1 = '10000001-seed-0000-0000-000000000001';
SET @svc_2 = '10000002-seed-0000-0000-000000000001';
SET @svc_3 = '10000003-seed-0000-0000-000000000001';
SET @svc_4 = '10000004-seed-0000-0000-000000000001';
SET @svc_5 = '10000005-seed-0000-0000-000000000001';

-- ================================================================
-- ROLES
-- ================================================================
INSERT IGNORE INTO roles (id, name, description) VALUES
  (@role_admin, 'admin', 'Full administrative access');

-- ================================================================
-- HERO_CONFIG  (Portuguese — default content)
-- ================================================================
INSERT INTO hero_config
  (id, badge, titulo, subtitulo, cta_texto, cta_link, imagem_fundo)
VALUES (
  @hero_id,
  'Especialistas em Transplante Capilar',
  'Transforme sua Vida com o Melhor em Transplante Capilar',
  'Técnica FUE de alta precisão, resultados naturais e permanentes. Recupere sua autoestima com o Instituto Milhomem.',
  'Agende sua Consulta',
  '/contato',
  ''
)
ON DUPLICATE KEY UPDATE
  badge     = VALUES(badge),
  titulo    = VALUES(titulo),
  subtitulo = VALUES(subtitulo),
  cta_texto = VALUES(cta_texto);

-- ================================================================
-- ESTATISTICAS  (numbers are universal — labels live in pages_config)
-- ================================================================
INSERT INTO estatisticas
  (id, experiencia, pacientes, procedimentos, satisfacao)
VALUES
  (@estat_id, '15+', '5.000+', '8.000+', '99%')
ON DUPLICATE KEY UPDATE
  experiencia   = VALUES(experiencia),
  pacientes     = VALUES(pacientes),
  procedimentos = VALUES(procedimentos),
  satisfacao    = VALUES(satisfacao);

-- ================================================================
-- CONTATO_CONFIG  (Portuguese — fill real contact details in admin)
-- ================================================================
INSERT INTO contato_config (
  id, email, telefone, whatsapp, instagram, facebook,
  mensagem_header, mensagem_whatsapp,
  endereco, dias_funcionamento, horario,
  latitude, longitude, zoom
) VALUES (
  @contato_id,
  'contato@institutomilhomem.com.br',
  '+55 62 9 0000-0000',
  '5562900000000',
  'https://www.instagram.com/institutomilhomem',
  '',
  'Agende sua consulta gratuita e dê o primeiro passo para transformar sua aparência.',
  'Olá! Gostaria de agendar uma consulta no Instituto Milhomem. Pode me ajudar?',
  'Goiânia, Goiás, Brasil',
  'Segunda a Sábado',
  '08:00 – 18:00',
  -16.6869, -49.2648, 15
)
ON DUPLICATE KEY UPDATE
  mensagem_header   = VALUES(mensagem_header),
  mensagem_whatsapp = VALUES(mensagem_whatsapp);

-- ================================================================
-- SOBRE_CONFIG  (Portuguese)
-- ================================================================
INSERT INTO sobre_config (
  id,
  hero_title, hero_subtitle, hero_badge,
  doctor_name, doctor_title, doctor_bio,
  doctor_credentials,
  doctor_experience_number, doctor_experience_label,
  about_title, about_text, about_detail_text,
  wfi_badge, wfi_title, wfi_text, wfi_link,
  values_title, values_subtitle, `values`,
  team_title, team_subtitle, `team`,
  technology_title, technology_text
) VALUES (
  @sobre_id,
  'Conheça o Instituto Milhomem',
  'Referência em transplante capilar no Centro-Oeste do Brasil, unindo tecnologia de ponta e cuidado humanizado.',
  'Sobre Nós',
  'Dr. Milhomem',
  'Especialista em Transplante Capilar',
  'Dr. Milhomem é especialista em transplante capilar com mais de 15 anos de experiência, pioneiro na técnica FUE em Goiânia. Membro da Sociedade Brasileira de Dermatologia e certificado por institutos internacionais de medicina estética capilar, o Dr. Milhomem já realizou mais de 8.000 procedimentos com resultados naturais e duradouros.',
  '["CRM-GO – Médico registrado no Conselho Regional de Medicina de Goiás","Especialista em Dermatologia – Certificado pela Sociedade Brasileira de Dermatologia","Membro ISHRS – International Society of Hair Restoration Surgery","Técnica FUE Avançada – Certificado em microenxertia capilar de alta precisão"]',
  '15+',
  'Anos de Experiência',
  'Nossa História',
  'Fundado com a missão de oferecer o que há de mais avançado em transplante capilar, o Instituto Milhomem nasceu do sonho de devolver autoestima e confiança a pessoas que sofrem com a queda de cabelo.',
  'Combinamos tecnologia de ponta com um atendimento verdadeiramente humanizado. Cada paciente recebe um plano personalizado, desenvolvido especificamente para suas características e objetivos.',
  'Por que nos Escolher',
  'Excelência que Transforma Vidas',
  'Com mais de 5.000 pacientes satisfeitos e 15 anos de experiência, somos a escolha número 1 em transplante capilar no Centro-Oeste.',
  '/servicos',
  'Nossos Valores',
  'Os pilares que guiam cada procedimento realizado no Instituto Milhomem.',
  '[{"icon":"Heart","title":"Cuidado Humanizado","description":"Tratamos cada paciente como único, priorizando o bem-estar e a satisfação acima de tudo."},{"icon":"Award","title":"Excelência Técnica","description":"Utilizamos as técnicas mais avançadas e equipamentos de última geração para garantir os melhores resultados."},{"icon":"Shield","title":"Segurança Total","description":"Todos os procedimentos são realizados em ambiente cirúrgico certificado, com total segurança e higiene."},{"icon":"Star","title":"Resultados Comprovados","description":"Mais de 5.000 pacientes satisfeitos atestam a qualidade e naturalidade dos nossos resultados."}]',
  'Nossa Equipe',
  'Profissionais dedicados ao seu resultado.',
  '[]',
  'Tecnologia de Ponta',
  'Utilizamos os equipamentos mais modernos do mercado para garantir procedimentos precisos, seguros e com o menor tempo de recuperação possível.'
)
ON DUPLICATE KEY UPDATE
  hero_title    = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle);

-- ================================================================
-- SERVICOS  (Portuguese — 5 services)
-- ================================================================
INSERT IGNORE INTO servicos
  (id, nome, slug, descricao, beneficios, processo, icon, ordem, conteudo, imagem)
VALUES
-- 1. FUE
(
  @svc_1,
  'Transplante Capilar FUE',
  'transplante-capilar-fue',
  'A técnica FUE (Follicular Unit Extraction) é o método mais moderno e minimamente invasivo de transplante capilar, garantindo resultados naturais e permanentes.',
  '["Sem cicatriz linear","Recuperação rápida","Resultado 100% natural","Procedimento permanente","Alta densidade capilar","Técnica minimamente invasiva"]',
  '["Consulta e diagnóstico","Projeto do novo cabelo","Extração dos folículos","Implantação precisa","Pós-operatório assistido","Acompanhamento contínuo"]',
  'Scissors', 1,
  '<p>O transplante capilar FUE é a técnica mais avançada para restauração capilar. Através da extração individual de unidades foliculares da área doadora, os folículos são implantados na área com calvície com precisão milimétrica.</p><p>No Instituto Milhomem, cada procedimento FUE é personalizado de acordo com as características do paciente, levando em conta a linha de implantação, a densidade desejada e o padrão de calvície atual e futuro.</p>',
  ''
),
-- 2. FUT
(
  @svc_2,
  'Transplante Capilar FUT',
  'transplante-capilar-fut',
  'A técnica FUT (Follicular Unit Transplantation) permite o transplante de um grande número de folículos em uma única sessão, com excelente taxa de sobrevivência dos fios.',
  '["Grande quantidade de folículos em sessão única","Alta taxa de sobrevivência","Ideal para grandes áreas","Custo-benefício competitivo","Resultado natural e permanente"]',
  '["Consulta e planejamento","Retirada da faixa doadora","Dissecção das unidades foliculares","Implantação na área receptora","Sutura minimamente perceptível","Acompanhamento pós-operatório"]',
  'Scissors', 2,
  '<p>A técnica FUT consiste na retirada de uma pequena faixa de couro cabeludo da região doadora. Essa faixa é dissecada em laboratório para obter as unidades foliculares, que são implantadas na área com calvície.</p><p>Indicada principalmente para pacientes que necessitam de um grande número de folículos em uma única sessão.</p>',
  ''
),
-- 3. Barba e Sobrancelha
(
  @svc_3,
  'Transplante de Barba e Sobrancelha',
  'transplante-barba-sobrancelha',
  'Restaure a densidade e o contorno perfeito da sua barba ou sobrancelha com nossa técnica especializada de microimplante de pelos.',
  '["Resultado natural e permanente","Barba mais densa e uniforme","Sobrancelhas bem definidas","Procedimento minimamente invasivo","Sem cicatrizes visíveis","Resultados duradouros"]',
  '["Avaliação e desenho","Anestesia local","Extração dos folículos doadores","Implantação microcirúrgica","Orientações pós-procedimento","Acompanhamento do resultado"]',
  'Smile', 3,
  '<p>O transplante de barba e sobrancelha é uma solução definitiva para quem deseja ter uma barba mais densa, uniforme e bem contornada, ou sobrancelhas mais cheias e definidas.</p><p>Utilizamos folículos retirados da região doadora do couro cabeludo, implantados seguindo a direção natural dos pelos para um resultado completamente natural.</p>',
  ''
),
-- 4. Micropigmentação
(
  @svc_4,
  'Micropigmentação Capilar',
  'micropigmentacao-capilar',
  'A micropigmentação capilar simula visualmente a presença de fios cortados rente ao couro cabeludo, devolvendo a aparência de um cabelo denso e jovial.',
  '["Efeito imediato","Sem período de recuperação","Ideal para qualquer estágio de calvície","Complemento ao transplante","Resultado realista","Procedimento não cirúrgico"]',
  '["Avaliação e estudo da cor","Desenho da área a pigmentar","Sessões de pigmentação","Ajustes de densidade","Retoques periódicos"]',
  'Palette', 4,
  '<p>A micropigmentação capilar (MPC) utiliza pigmentos especializados para criar a ilusão de fios de cabelo no couro cabeludo. Indicada tanto para calvícies avançadas quanto como complemento a um transplante capilar, proporcionando resultados imediatos e realistas.</p>',
  ''
),
-- 5. Consultoria
(
  @svc_5,
  'Consultoria e Diagnóstico Capilar',
  'consultoria-diagnostico-capilar',
  'Realizamos uma avaliação completa do seu couro cabeludo e histórico de queda para indicar o melhor tratamento para o seu caso.',
  '["Diagnóstico personalizado","Avaliação do padrão de calvície","Testes de tração e densidade","Indicação do melhor tratamento","Planejamento do resultado","Sem compromisso prévio"]',
  '["Anamnese completa","Tricoscopia digital","Análise do padrão de queda","Relatório personalizado","Apresentação das opções","Plano de tratamento"]',
  'Search', 5,
  '<p>A consultoria capilar é o primeiro e mais importante passo. Durante a consulta, o Dr. Milhomem realiza uma avaliação completa do couro cabeludo, histórico familiar, padrão de queda e expectativas do paciente.</p><p>É elaborado um plano de tratamento personalizado, indicando as melhores opções e apresentando projeções realistas de resultado.</p>',
  ''
);

-- ================================================================
-- TRADUCOES — ENGLISH (EN)
-- ================================================================

-- hero_config EN
INSERT INTO traducoes (tabela, registro_id, campo, locale, valor) VALUES
  ('hero_config', @hero_id, 'badge',     'en', 'Hair Transplant Specialists'),
  ('hero_config', @hero_id, 'titulo',    'en', 'Transform Your Life with the Best in Hair Transplantation'),
  ('hero_config', @hero_id, 'subtitulo', 'en', 'High-precision FUE technique, natural and permanent results. Restore your confidence with Instituto Milhomem.'),
  ('hero_config', @hero_id, 'cta_texto', 'en', 'Book a Consultation')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- contato_config EN
INSERT INTO traducoes (tabela, registro_id, campo, locale, valor) VALUES
  ('contato_config', @contato_id, 'mensagem_header',   'en', 'Schedule your free consultation and take the first step to transform your appearance.'),
  ('contato_config', @contato_id, 'mensagem_whatsapp', 'en', 'Hello! I''d like to schedule a consultation at Instituto Milhomem. Can you help me?')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- sobre_config EN
INSERT INTO traducoes (tabela, registro_id, campo, locale, valor) VALUES
  ('sobre_config', @sobre_id, 'hero_title',              'en', 'About Instituto Milhomem'),
  ('sobre_config', @sobre_id, 'hero_subtitle',           'en', 'A reference in hair transplantation in Central-West Brazil, combining cutting-edge technology with humanized care.'),
  ('sobre_config', @sobre_id, 'hero_badge',              'en', 'About Us'),
  ('sobre_config', @sobre_id, 'doctor_bio',              'en', 'Dr. Milhomem is a hair transplant specialist with over 15 years of experience, a pioneer in the FUE technique in Goiânia. A member of the Brazilian Society of Dermatology and certified by international institutes of aesthetic hair medicine, Dr. Milhomem has performed over 8,000 procedures with natural and lasting results.'),
  ('sobre_config', @sobre_id, 'doctor_credentials',      'en', '["CRM-GO – Physician registered with the Regional Medical Council of Goiás","Dermatology Specialist – Certified by the Brazilian Society of Dermatology","ISHRS Member – International Society of Hair Restoration Surgery","Advanced FUE Technique – Certified in high-precision hair micro-grafting"]'),
  ('sobre_config', @sobre_id, 'doctor_experience_label', 'en', 'Years of Experience'),
  ('sobre_config', @sobre_id, 'about_title',             'en', 'Our Story'),
  ('sobre_config', @sobre_id, 'about_text',              'en', 'Founded with the mission of offering the most advanced in hair transplantation, Instituto Milhomem was born from the dream of restoring self-esteem and confidence to people who suffer from hair loss.'),
  ('sobre_config', @sobre_id, 'about_detail_text',       'en', 'We combine cutting-edge technology with truly humanized care. Each patient receives a personalized plan, developed specifically for their characteristics and goals.'),
  ('sobre_config', @sobre_id, 'wfi_badge',               'en', 'Why Choose Us'),
  ('sobre_config', @sobre_id, 'wfi_title',               'en', 'Excellence that Transforms Lives'),
  ('sobre_config', @sobre_id, 'wfi_text',                'en', 'With more than 5,000 satisfied patients and 15 years of experience, we are the number one choice for hair transplantation in Central-West Brazil.'),
  ('sobre_config', @sobre_id, 'values_title',            'en', 'Our Values'),
  ('sobre_config', @sobre_id, 'values_subtitle',         'en', 'The pillars that guide every procedure performed at Instituto Milhomem.'),
  ('sobre_config', @sobre_id, 'values',                  'en', '[{"icon":"Heart","title":"Humanized Care","description":"We treat each patient as unique, prioritizing well-being and satisfaction above all."},{"icon":"Award","title":"Technical Excellence","description":"We use the most advanced techniques and state-of-the-art equipment to guarantee the best results."},{"icon":"Shield","title":"Total Safety","description":"All procedures are performed in a certified surgical environment, with complete safety and hygiene."},{"icon":"Star","title":"Proven Results","description":"More than 5,000 satisfied patients testify to the quality and naturalness of our results."}]'),
  ('sobre_config', @sobre_id, 'team_title',              'en', 'Our Team'),
  ('sobre_config', @sobre_id, 'team_subtitle',           'en', 'Professionals dedicated to your results.'),
  ('sobre_config', @sobre_id, 'technology_title',        'en', 'Cutting-Edge Technology'),
  ('sobre_config', @sobre_id, 'technology_text',         'en', 'We use the most modern equipment on the market to ensure precise, safe procedures with the shortest possible recovery time.')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- servicos EN
INSERT INTO traducoes (tabela, registro_id, campo, locale, valor) VALUES
  -- FUE
  ('servicos', @svc_1, 'nome',       'en', 'FUE Hair Transplant'),
  ('servicos', @svc_1, 'descricao',  'en', 'The FUE (Follicular Unit Extraction) technique is the most modern and minimally invasive hair transplant method, guaranteeing natural and permanent results.'),
  ('servicos', @svc_1, 'beneficios', 'en', '["No linear scar","Fast recovery","100% natural result","Permanent procedure","High hair density","Minimally invasive technique"]'),
  ('servicos', @svc_1, 'processo',   'en', '["Consultation and diagnosis","New hairline design","Follicle extraction","Precise implantation","Assisted post-op care","Continuous follow-up"]'),
  ('servicos', @svc_1, 'conteudo',   'en', '<p>FUE hair transplant is the most advanced technique for hair restoration. Through individual extraction of follicular units from the donor area, follicles are implanted in the balding area with millimeter precision.</p><p>At Instituto Milhomem, each FUE procedure is personalized according to the patient''s characteristics, taking into account the hairline design, desired density, and current and future baldness pattern.</p>'),
  -- FUT
  ('servicos', @svc_2, 'nome',       'en', 'FUT Hair Transplant'),
  ('servicos', @svc_2, 'descricao',  'en', 'The FUT (Follicular Unit Transplantation) technique allows transplanting a large number of follicles in a single session, with excellent graft survival rates.'),
  ('servicos', @svc_2, 'beneficios', 'en', '["Large number of follicles in a single session","High follicle survival rate","Ideal for large areas","Competitive cost-effectiveness","Natural and permanent result"]'),
  ('servicos', @svc_2, 'processo',   'en', '["Consultation and planning","Donor strip removal","Follicular unit dissection","Implantation in recipient area","Minimally visible suture","Post-op follow-up"]'),
  ('servicos', @svc_2, 'conteudo',   'en', '<p>The FUT technique involves removing a small strip of scalp from the donor area. This strip is dissected in the lab to obtain follicular units, which are then implanted in the balding area.</p><p>Recommended primarily for patients who need a large number of follicles in a single session.</p>'),
  -- Beard & Eyebrow
  ('servicos', @svc_3, 'nome',       'en', 'Beard & Eyebrow Transplant'),
  ('servicos', @svc_3, 'descricao',  'en', 'Restore the density and perfect contour of your beard or eyebrows with our specialized micro-implantation technique.'),
  ('servicos', @svc_3, 'beneficios', 'en', '["Natural and permanent result","Denser and more uniform beard","Well-defined eyebrows","Minimally invasive procedure","No visible scars","Long-lasting results"]'),
  ('servicos', @svc_3, 'processo',   'en', '["Assessment and design","Local anesthesia","Donor follicle extraction","Microsurgical implantation","Post-procedure guidance","Result follow-up"]'),
  ('servicos', @svc_3, 'conteudo',   'en', '<p>Beard and eyebrow transplant is a definitive solution for those who want a denser, more uniform, and well-contoured beard, or fuller and more defined eyebrows.</p><p>We use follicles taken from the scalp donor area, carefully implanted following the natural direction of the hairs for a completely natural result.</p>'),
  -- Micropigmentation
  ('servicos', @svc_4, 'nome',       'en', 'Scalp Micropigmentation'),
  ('servicos', @svc_4, 'descricao',  'en', 'Scalp micropigmentation visually simulates closely cropped hair strands, restoring the appearance of a dense and youthful head of hair.'),
  ('servicos', @svc_4, 'beneficios', 'en', '["Immediate effect","No recovery period","Suitable for any stage of baldness","Complement to transplant","Realistic result","Non-surgical procedure"]'),
  ('servicos', @svc_4, 'processo',   'en', '["Assessment and color study","Design of the area to pigment","Pigmentation sessions","Density adjustments","Periodic touch-ups"]'),
  ('servicos', @svc_4, 'conteudo',   'en', '<p>Scalp micropigmentation (SMP) uses specialized pigments to create the illusion of hair follicles on the scalp. Suitable for advanced baldness or as a complement to a hair transplant, providing immediate and realistic results.</p>'),
  -- Consultation
  ('servicos', @svc_5, 'nome',       'en', 'Hair Consultation & Diagnosis'),
  ('servicos', @svc_5, 'descricao',  'en', 'We perform a complete assessment of your scalp and hair loss history to recommend the best treatment for your case.'),
  ('servicos', @svc_5, 'beneficios', 'en', '["Personalized diagnosis","Baldness pattern assessment","Traction and density tests","Best treatment recommendation","Result planning","No prior commitment"]'),
  ('servicos', @svc_5, 'processo',   'en', '["Complete anamnesis","Digital trichoscopy","Hair loss pattern analysis","Personalized report","Options presentation","Treatment plan"]'),
  ('servicos', @svc_5, 'conteudo',   'en', '<p>Hair consultation is the first and most important step. During the appointment, Dr. Milhomem performs a complete assessment of the scalp, family history, hair loss pattern, and patient expectations.</p><p>A personalized treatment plan is developed, indicating the best options and presenting realistic result projections.</p>')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- ================================================================
-- TRADUCOES — SPANISH (ES)
-- ================================================================

-- hero_config ES
INSERT INTO traducoes (tabela, registro_id, campo, locale, valor) VALUES
  ('hero_config', @hero_id, 'badge',     'es', 'Especialistas en Trasplante Capilar'),
  ('hero_config', @hero_id, 'titulo',    'es', 'Transforma Tu Vida con lo Mejor en Trasplante Capilar'),
  ('hero_config', @hero_id, 'subtitulo', 'es', 'Técnica FUE de alta precisión, resultados naturales y permanentes. Recupera tu autoestima con el Instituto Milhomem.'),
  ('hero_config', @hero_id, 'cta_texto', 'es', 'Agenda tu Consulta')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- contato_config ES
INSERT INTO traducoes (tabela, registro_id, campo, locale, valor) VALUES
  ('contato_config', @contato_id, 'mensagem_header',   'es', 'Agenda tu consulta gratuita y da el primer paso para transformar tu apariencia.'),
  ('contato_config', @contato_id, 'mensagem_whatsapp', 'es', '¡Hola! Me gustaría agendar una consulta en el Instituto Milhomem. ¿Pueden ayudarme?')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- sobre_config ES
INSERT INTO traducoes (tabela, registro_id, campo, locale, valor) VALUES
  ('sobre_config', @sobre_id, 'hero_title',              'es', 'Conoce el Instituto Milhomem'),
  ('sobre_config', @sobre_id, 'hero_subtitle',           'es', 'Referencia en trasplante capilar en el Centro-Oeste de Brasil, uniendo tecnología de vanguardia y atención humanizada.'),
  ('sobre_config', @sobre_id, 'hero_badge',              'es', 'Sobre Nosotros'),
  ('sobre_config', @sobre_id, 'doctor_bio',              'es', 'El Dr. Milhomem es especialista en trasplante capilar con más de 15 años de experiencia, pionero en la técnica FUE en Goiânia. Miembro de la Sociedad Brasileña de Dermatología y certificado por institutos internacionales de medicina estética capilar, el Dr. Milhomem ha realizado más de 8.000 procedimientos con resultados naturales y duraderos.'),
  ('sobre_config', @sobre_id, 'doctor_credentials',      'es', '["CRM-GO – Médico registrado en el Consejo Regional de Medicina de Goiás","Especialista en Dermatología – Certificado por la Sociedad Brasileña de Dermatología","Miembro ISHRS – International Society of Hair Restoration Surgery","Técnica FUE Avanzada – Certificado en microinjerto capilar de alta precisión"]'),
  ('sobre_config', @sobre_id, 'doctor_experience_label', 'es', 'Años de Experiencia'),
  ('sobre_config', @sobre_id, 'about_title',             'es', 'Nuestra Historia'),
  ('sobre_config', @sobre_id, 'about_text',              'es', 'Fundado con la misión de ofrecer lo más avanzado en trasplante capilar, el Instituto Milhomem nació del sueño de devolver la autoestima y confianza a personas que sufren de pérdida de cabello.'),
  ('sobre_config', @sobre_id, 'about_detail_text',       'es', 'Combinamos tecnología de vanguardia con una atención verdaderamente humanizada. Cada paciente recibe un plan personalizado, desarrollado específicamente para sus características y objetivos.'),
  ('sobre_config', @sobre_id, 'wfi_badge',               'es', 'Por Qué Elegirnos'),
  ('sobre_config', @sobre_id, 'wfi_title',               'es', 'Excelencia que Transforma Vidas'),
  ('sobre_config', @sobre_id, 'wfi_text',                'es', 'Con más de 5.000 pacientes satisfechos y 15 años de experiencia, somos la opción número uno en trasplante capilar en el Centro-Oeste de Brasil.'),
  ('sobre_config', @sobre_id, 'values_title',            'es', 'Nuestros Valores'),
  ('sobre_config', @sobre_id, 'values_subtitle',         'es', 'Los pilares que guían cada procedimiento realizado en el Instituto Milhomem.'),
  ('sobre_config', @sobre_id, 'values',                  'es', '[{"icon":"Heart","title":"Atención Humanizada","description":"Tratamos a cada paciente como único, priorizando el bienestar y la satisfacción por encima de todo."},{"icon":"Award","title":"Excelencia Técnica","description":"Utilizamos las técnicas más avanzadas y equipos de última generación para garantizar los mejores resultados."},{"icon":"Shield","title":"Seguridad Total","description":"Todos los procedimientos se realizan en un entorno quirúrgico certificado, con total seguridad e higiene."},{"icon":"Star","title":"Resultados Comprobados","description":"Más de 5.000 pacientes satisfechos dan fe de la calidad y naturalidad de nuestros resultados."}]'),
  ('sobre_config', @sobre_id, 'team_title',              'es', 'Nuestro Equipo'),
  ('sobre_config', @sobre_id, 'team_subtitle',           'es', 'Profesionales dedicados a tu resultado.'),
  ('sobre_config', @sobre_id, 'technology_title',        'es', 'Tecnología de Vanguardia'),
  ('sobre_config', @sobre_id, 'technology_text',         'es', 'Utilizamos los equipos más modernos del mercado para garantizar procedimientos precisos y seguros con el menor tiempo de recuperación posible.')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- servicos ES
INSERT INTO traducoes (tabela, registro_id, campo, locale, valor) VALUES
  -- FUE
  ('servicos', @svc_1, 'nome',       'es', 'Trasplante Capilar FUE'),
  ('servicos', @svc_1, 'descricao',  'es', 'La técnica FUE (Follicular Unit Extraction) es el método de trasplante capilar más moderno y mínimamente invasivo, que garantiza resultados naturales y permanentes.'),
  ('servicos', @svc_1, 'beneficios', 'es', '["Sin cicatriz lineal","Recuperación rápida","Resultado 100% natural","Procedimiento permanente","Alta densidad capilar","Técnica mínimamente invasiva"]'),
  ('servicos', @svc_1, 'processo',   'es', '["Consulta y diagnóstico","Diseño del nuevo cabello","Extracción de folículos","Implantación precisa","Post-operatorio asistido","Seguimiento continuo"]'),
  ('servicos', @svc_1, 'conteudo',   'es', '<p>El trasplante capilar FUE es la técnica más avanzada para la restauración capilar. A través de la extracción individual de unidades foliculares de la zona donante, los folículos se implantan en la zona con calvicie con precisión milimétrica.</p><p>En el Instituto Milhomem, cada procedimiento FUE es personalizado según las características del paciente, considerando el diseño de la línea capilar, la densidad deseada y el patrón de calvicie actual y futuro.</p>'),
  -- FUT
  ('servicos', @svc_2, 'nome',       'es', 'Trasplante Capilar FUT'),
  ('servicos', @svc_2, 'descricao',  'es', 'La técnica FUT (Follicular Unit Transplantation) permite trasplantar una gran cantidad de folículos en una sola sesión, con excelente tasa de supervivencia de los injertos.'),
  ('servicos', @svc_2, 'beneficios', 'es', '["Gran cantidad de folículos en una sola sesión","Alta tasa de supervivencia","Ideal para grandes áreas","Costo-beneficio competitivo","Resultado natural y permanente"]'),
  ('servicos', @svc_2, 'processo',   'es', '["Consulta y planificación","Extracción de la franja donante","Disección de unidades foliculares","Implantación en área receptora","Sutura mínimamente perceptible","Seguimiento post-operatorio"]'),
  ('servicos', @svc_2, 'conteudo',   'es', '<p>La técnica FUT consiste en retirar una pequeña franja de cuero cabelludo de la región donante. Esta franja se diseca en laboratorio para obtener las unidades foliculares, que se implantan en la zona con calvicie.</p><p>Indicada principalmente para pacientes que necesitan una gran cantidad de folículos en una sola sesión.</p>'),
  -- Beard & Eyebrow
  ('servicos', @svc_3, 'nome',       'es', 'Trasplante de Barba y Cejas'),
  ('servicos', @svc_3, 'descricao',  'es', 'Restaura la densidad y el contorno perfecto de tu barba o cejas con nuestra técnica especializada de microimplante de pelos.'),
  ('servicos', @svc_3, 'beneficios', 'es', '["Resultado natural y permanente","Barba más densa y uniforme","Cejas bien definidas","Procedimiento mínimamente invasivo","Sin cicatrices visibles","Resultados duraderos"]'),
  ('servicos', @svc_3, 'processo',   'es', '["Evaluación y diseño","Anestesia local","Extracción de folículos donantes","Implantación microquirúrgica","Orientaciones post-procedimiento","Seguimiento del resultado"]'),
  ('servicos', @svc_3, 'conteudo',   'es', '<p>El trasplante de barba y cejas es una solución definitiva para quienes desean tener una barba más densa, uniforme y bien perfilada, o unas cejas más llenas y definidas.</p><p>Utilizamos folículos tomados de la región donante del cuero cabelludo, implantados siguiendo la dirección natural de los pelos para un resultado completamente natural.</p>'),
  -- Micropigmentation
  ('servicos', @svc_4, 'nome',       'es', 'Micropigmentación Capilar'),
  ('servicos', @svc_4, 'descricao',  'es', 'La micropigmentación capilar simula visualmente la presencia de mechones de cabello cortados al ras del cuero cabelludo, devolviendo la apariencia de un cabello denso y juvenil.'),
  ('servicos', @svc_4, 'beneficios', 'es', '["Efecto inmediato","Sin período de recuperación","Apto para cualquier etapa de la calvicie","Complemento al trasplante","Resultado realista","Procedimiento no quirúrgico"]'),
  ('servicos', @svc_4, 'processo',   'es', '["Evaluación y estudio del color","Diseño del área a pigmentar","Sesiones de pigmentación","Ajustes de densidad","Retoques periódicos"]'),
  ('servicos', @svc_4, 'conteudo',   'es', '<p>La micropigmentación capilar (MPC) utiliza pigmentos especializados para crear la ilusión de folículos de cabello en el cuero cabelludo. Indicada tanto para calvicies avanzadas como complemento a un trasplante capilar, proporcionando resultados inmediatos y realistas.</p>'),
  -- Consultation
  ('servicos', @svc_5, 'nome',       'es', 'Consultoría y Diagnóstico Capilar'),
  ('servicos', @svc_5, 'descricao',  'es', 'Realizamos una evaluación completa de tu cuero cabelludo e historial de pérdida de cabello para indicar el mejor tratamiento para tu caso.'),
  ('servicos', @svc_5, 'beneficios', 'es', '["Diagnóstico personalizado","Evaluación del patrón de calvicie","Pruebas de tracción y densidad","Indicación del mejor tratamiento","Planificación del resultado","Sin compromiso previo"]'),
  ('servicos', @svc_5, 'processo',   'es', '["Anamnesis completa","Tricoscopía digital","Análisis del patrón de caída","Informe personalizado","Presentación de opciones","Plan de tratamiento"]'),
  ('servicos', @svc_5, 'conteudo',   'es', '<p>La consultoría capilar es el primer y más importante paso. Durante la consulta, el Dr. Milhomem realiza una evaluación completa del cuero cabelludo, historial familiar, patrón de caída y expectativas del paciente.</p><p>Se elabora un plan de tratamiento personalizado, indicando las mejores opciones y presentando proyecciones realistas de resultado.</p>')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- ================================================================
-- SEO_SETTINGS  (Portuguese — update values in admin for EN/ES)
-- ================================================================
UPDATE seo_settings SET
  meta_title       = 'Instituto Milhomem — Referência em Transplante Capilar em Goiânia',
  meta_description = 'Transplante capilar FUE em Goiânia. Mais de 15 anos de experiência, 5.000+ pacientes satisfeitos. Agende sua consulta gratuita.',
  keywords         = 'transplante capilar, FUE, calvície, Goiânia, Instituto Milhomem, queda de cabelo'
WHERE page_name = 'home';

UPDATE seo_settings SET
  meta_title       = 'Nossos Serviços — Instituto Milhomem',
  meta_description = 'Transplante FUE, FUT, micropigmentação capilar, transplante de barba e sobrancelha. Conheça todos os procedimentos do Instituto Milhomem.',
  keywords         = 'transplante capilar FUE, FUT, micropigmentação, barba, sobrancelha, Goiânia'
WHERE page_name = 'servicos';

UPDATE seo_settings SET
  meta_title       = 'Sobre Nós — Instituto Milhomem',
  meta_description = 'Conheça o Dr. Milhomem e nossa história. Pioneiro na técnica FUE em Goiânia com mais de 15 anos dedicados à restauração capilar.',
  keywords         = 'Dr. Milhomem, sobre instituto, história, transplante capilar Goiânia, especialista FUE'
WHERE page_name = 'sobre';

UPDATE seo_settings SET
  meta_title       = 'Resultados — Instituto Milhomem',
  meta_description = 'Veja os resultados reais de nossos pacientes. Fotos de antes e depois de transplantes capilares realizados no Instituto Milhomem.',
  keywords         = 'antes e depois transplante capilar, resultados FUE, fotos transplante, cases Goiânia'
WHERE page_name = 'resultados';

UPDATE seo_settings SET
  meta_title       = 'Blog Capilar — Instituto Milhomem',
  meta_description = 'Artigos e novidades sobre transplante capilar, saúde do cabelo, FUE, queda de cabelo e tudo sobre cuidados capilares.',
  keywords         = 'blog transplante capilar, artigos FUE, saúde capilar, dicas queda cabelo, Goiânia'
WHERE page_name = 'blog';

UPDATE seo_settings SET
  meta_title       = 'Contato e Agendamento — Instituto Milhomem',
  meta_description = 'Entre em contato com o Instituto Milhomem. Agende sua consulta gratuita em Goiânia e dê o primeiro passo para transformar sua aparência.',
  keywords         = 'contato Instituto Milhomem, agendar consulta transplante capilar, Goiânia, telefone, WhatsApp'
WHERE page_name = 'contato';

-- ================================================================
-- END OF SEED
-- ================================================================
