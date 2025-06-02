// frontend/src/inesMadaniTrajectoryData.js
import { v4 as uuidv4 } from 'uuid';

const generateId = () => uuidv4();

export const inesMadaniPrecreatedData = () => {
  const nodes = [];
  const edges = [];

  // Helper to add date and tag fields more easily
  const createElementNode = (parentNodeId, position, label, elementType, dataExtras = {}, width = 180, height = 60) => {
    const id = generateId();
    return {
      id, type: 'element', parentNode: parentNodeId, extent: 'parent', position,
      data: { label, elementType, id, ...dataExtras }, width, height
    };
  };
  
  const createEdge = (source, target, label) => ({
    id: generateId(), source, target, label, type: 'smoothstep',
    markerEnd: { type: 'arrowclosed' }, style: { strokeWidth: 1.5, stroke: '#546e7a' },
    labelStyle: { fill: '#333', fontWeight: 500, fontSize: 11 },
    labelBgPadding: [4, 2], labelBgBorderRadius: 2, labelBgStyle: { fill: '#fff', fillOpacity: 0.7 },
  });

  // --- PÉRIODE 1: ADOLESCENCE & DÉBUT DIFFICULTÉS (2012-2014) ---
  const p1_id = generateId();
  nodes.push({
    id: p1_id, type: 'period', position: { x: 50, y: 50 },
    data: { 
      label: 'Adolescence & Début Difficultés (2012-2014)',
      startDate: '2012-01-01', 
      endDate: '2014-12-31',
      tags: ['adolescence', 'difficultés scolaires', 'isolement social', 'recherche identitaire']
    },
    width: 900, height: 700 
  });

  const e1_1_id = generateId();
  nodes.push({
    id: e1_1_id, type: 'event', parentNode: p1_id, extent: 'parent', position: { x: 30, y: 80 },
    data: { 
      label: 'Scolarité et Isolement (2012)',
      startDate: '2012-01-01',
      endDate: '2012-12-31',
      tags: ['scolarité', 'échec scolaire', 'isolement']
    }, width: 400, height: 300
  });
  let el;
  el = createElementNode(e1_1_id, { x: 20, y: 60 }, 'Commence CAP Pâtisserie, puis Sanitaire & Social, puis Compta.', 'Fait', { date: '2012-09-01', tags: ['formation', 'changement orientation'] }); const f_e1_1_1 = el.id; nodes.push(el);
  el = createElementNode(e1_1_id, { x: 20, y: 130 }, "Exclue de sa classe de 3ème (alarme incendie). Sort système scolaire sans diplôme.", 'Contexte', { date: '2012-06-01', tags: ['exclusion', 'déscolarisation', 'indiscipline'] }); const c_e1_1_1 = el.id; nodes.push(el);
  el = createElementNode(e1_1_id, { x: 220, y: 60 }, "Ne s'aime pas, très complexée, garçon manqué. Se cherche, ne sait pas ce qu'elle veut faire.", 'Vécu', { tags: ['mal-être', 'complexe', 'identité de genre', 'incertitude'] }); const v_e1_1_1 = el.id; nodes.push(el);
  el = createElementNode(e1_1_id, { x: 220, y: 150 }, 'Très absente des formations, résultats médiocres.', 'Action', { tags: ['absentéisme', 'mauvais résultats'] }); const a_e1_1_1 = el.id; nodes.push(el);
  el = createElementNode(e1_1_id, { x: 220, y: 210 }, 'Se replie sur elle-même.', 'Action', { tags: ['repli sur soi'] }); const a_e1_1_2 = el.id; nodes.push(el);
  edges.push(createEdge(f_e1_1_1, v_e1_1_1, 'produit')); edges.push(createEdge(c_e1_1_1, v_e1_1_1, 'influe sur'));
  edges.push(createEdge(v_e1_1_1, a_e1_1_1, 'engendre')); edges.push(createEdge(v_e1_1_1, a_e1_1_2, 'engendre'));

  const e1_2_id = generateId();
  nodes.push({
    id: e1_2_id, type: 'event', parentNode: p1_id, extent: 'parent', position: { x: 460, y: 80 },
    data: { 
      label: 'Rencontre Anissa Medj (2013)',
      date: '2013-01-01', // Approximatif pour l'année
      tags: ['rencontre', 'influence', 'amitié'],
      personTags: ['AnissaM']
    }, width: 400, height: 300
  });
  el = createElementNode(e1_2_id, { x: 20, y: 60 }, 'Rencontre Anissa Medj (A.M.) à la mosquée.', 'Fait', { date: '2013-01-01', tags: ['mosquée'], personTags: ['AnissaM'], locationTags: ['mosquée locale'] }); const f_e1_2_1 = el.id; nodes.push(el);
  el = createElementNode(e1_2_id, { x: 20, y: 130 }, "A.M. a 11 ans de plus, habite près, attend un enfant, pratique islam rigoriste.", 'Contexte', { tags: ['différence âge', 'maternité', 'islam rigoriste'], personTags: ['AnissaM'] }); const c_e1_2_1 = el.id; nodes.push(el);
  el = createElementNode(e1_2_id, { x: 220, y: 60 }, "A.M. = Sœur Mentor, idéal de féminité, maternité, piété. Désinvestissement figures parentales (transfert). A.M. occupe tout son espace affectif.", 'Vécu', { tags: ['mentorat', 'idéalisation', 'transfert affectif', 'dépendance'], personTags: ['AnissaM'] }); const v_e1_2_1 = el.id; nodes.push(el);
  el = createElementNode(e1_2_id, { x: 220, y: 150 }, "Deviennent amies, garde bébé d'A.M., cache relation à sa famille.", 'Action', { tags: ['garde enfant', 'relation cachée'], personTags: ['AnissaM'] }); const a_e1_2_1 = el.id; nodes.push(el);
  edges.push(createEdge(f_e1_2_1, v_e1_2_1, 'produit')); edges.push(createEdge(c_e1_2_1, v_e1_2_1, 'influe sur'));
  edges.push(createEdge(v_e1_2_1, a_e1_2_1, 'engendre'));

  const e1_3_id = generateId();
  nodes.push({
    id: e1_3_id, type: 'event', parentNode: p1_id, extent: 'parent', position: { x: 30, y: 420 },
    data: { 
      label: 'Traumatismes et Vulnérabilité (2014)',
      startDate: '2014-01-01',
      endDate: '2014-12-31',
      tags: ['traumatisme', 'deuil', 'agression sexuelle', 'vulnérabilité', 'culpabilité']
    }, width: 830, height: 250
  });
  el = createElementNode(e1_3_id, { x: 20, y: 60 }, 'Décès de sa grand-mère maternelle.', 'Fait', { date: '2014-01-01', tags: ['deuil', 'famille']}); const f_e1_3_1 = el.id; nodes.push(el);
  el = createElementNode(e1_3_id, { x: 20, y: 130 }, 'Dispute avec grand-mère (refus douche) avant décès. Dernière fois qu\'elle la voit.', 'Contexte', { tags: ['conflit familial', 'regret'] }); const c_e1_3_1 = el.id; nodes.push(el);
  el = createElementNode(e1_3_id, { x: 220, y: 60 }, 'Tristesse, Culpabilité immense.', 'Vécu', { tags: ['tristesse', 'culpabilité'] }); const v_e1_3_1 = el.id; nodes.push(el);
  el = createElementNode(e1_3_id, { x: 420, y: 60 }, 'Fréquente régulièrement la mosquée. Souhaite mourir. Consomme cannabis et alcool.', 'Action', { tags: ['mosquée', 'idées suicidaires', 'consommation substances', 'addiction'] }); const a_e1_3_1 = el.id; nodes.push(el);
  edges.push(createEdge(f_e1_3_1, v_e1_3_1, 'produit')); edges.push(createEdge(c_e1_3_1, v_e1_3_1, 'influe sur'));
  edges.push(createEdge(v_e1_3_1, a_e1_3_1, 'engendre'));

  el = createElementNode(e1_3_id, { x: 220, y: 130 }, 'Subit 2 agressions sexuelles dans la rue.', 'Fait', { date: '2014-06-01', tags:['agression sexuelle', 'violence subie'], locationTags: ['rue'] }); const f_e1_3_2 = el.id; nodes.push(el);
  el = createElementNode(e1_3_id, { x: 20, y: 190 }, 'Mal dans son corps, adolescence, relation conflictuelle mère. Sœurs victimes violences conjugales, père passif.', 'Contexte', { tags: ['mal-être corporel', 'conflit familial', 'violence conjugale (entourage)', 'passivité paternelle'] }); const c_e1_3_2 = el.id; nodes.push(el);
  el = createElementNode(e1_3_id, { x: 420, y: 130 }, 'Honte, Colère, Trahison (figure masculine/père). Désir être un homme pour protéger ses sœurs.', 'Vécu', { tags: ['honte', 'colère', 'trahison', 'quête de protection', 'identité de genre'] }); const v_e1_3_2 = el.id; nodes.push(el);
  el = createElementNode(e1_3_id, { x: 620, y: 130 }, 'Silence, repli sur soi, port du voile. Défi autorité paternelle en particulier.', 'Action', { tags: ['silence', 'repli sur soi', 'port du voile', 'contestation autorité'] }); const a_e1_3_2 = el.id; nodes.push(el);
  edges.push(createEdge(f_e1_3_2, v_e1_3_2, 'produit')); edges.push(createEdge(c_e1_3_2, v_e1_3_2, 'influe sur'));
  edges.push(createEdge(c_e1_3_2, f_e1_3_2, 'contextualise')); edges.push(createEdge(v_e1_3_2, a_e1_3_2, 'engendre'));

  // --- PÉRIODE 2: PLONGÉE DANS LA RADICALISATION (2015) ---
  const p2_id = generateId();
  nodes.push({
    id: p2_id, type: 'period', position: { x: 50, y: 800 },
    data: { 
      label: 'Plongée dans la Radicalisation (2015)',
      startDate: '2015-01-01',
      endDate: '2015-12-31',
      tags: ['radicalisation', 'influence virtuelle', 'djihadisme', 'quête identitaire masculine']
    }, width: 1200, height: 600
  });

  const e2_1_id = generateId();
  nodes.push({
    id: e2_1_id, type: 'event', parentNode: p2_id, extent: 'parent', position: { x: 30, y: 80 },
    data: { 
      label: "Départ d'Anissa M. en Syrie (Janv. 2015)",
      startDate: '2015-01-01',
      endDate: '2015-01-31',
      tags: ['départ Syrie', 'abandon', 'perte de repères'],
      personTags: ['AnissaM'],
      locationTags: ['Syrie']
    }, width: 550, height: 300
  });
  el = createElementNode(e2_1_id, {x:20, y:60}, "Anissa M. part en Syrie avec son bébé.", 'Fait', { date: '2015-01-15', tags: ['voyage Syrie'], personTags:['AnissaM'], locationTags:['Syrie'] }); const f_e2_1_1 = el.id; nodes.push(el);
  el = createElementNode(e2_1_id, {x:250, y:60}, "Sentiment de solitude, d'abandon, perte de repère, d'objet à investir.", 'Vécu', { tags: ['solitude', 'abandon', 'perte affective'] }); const v_e2_1_1 = el.id; nodes.push(el);
  el = createElementNode(e2_1_id, {x:20, y:150}, "Refuse de suivre Anissa mais lui donne toutes ses économies pour le voyage.", 'Action', { tags: ['soutien financier', 'non-départ'], personTags:['AnissaM'] }); const a_e2_1_1 = el.id; nodes.push(el);
  el = createElementNode(e2_1_id, {x:250, y:150}, "Devient 'l'Anissa' d'autres femmes en terme d'influence pour combler le vide.", 'Encapacitation', { tags: ['prise de rôle', 'influence', 'compensation'] }); const encap_e2_1_1 = el.id; nodes.push(el);
  edges.push(createEdge(f_e2_1_1, v_e2_1_1, 'produit')); edges.push(createEdge(v_e2_1_1, a_e2_1_1, 'engendre'));
  edges.push(createEdge(a_e2_1_1, encap_e2_1_1, 'mène à')); edges.push(createEdge(v_e2_1_1, encap_e2_1_1, 'motive'));

  const e2_2_id = generateId();
  nodes.push({
    id: e2_2_id, type: 'event', parentNode: p2_id, extent: 'parent', position: { x: 620, y: 80 },
    data: { 
      label: 'Prise de Rôle Virtuel & Idéal Masculin (Mars-Mai 2015)',
      startDate: '2015-03-01',
      endDate: '2015-05-31',
      tags: ['identité virtuelle', 'manipulation', 'séduction en ligne', 'avatar masculin', 'djihadisme'],
      personTags: ['AnissaM', 'AbouBarou', 'LassadA']
    }, width: 550, height: 480
  });
  el = createElementNode(e2_2_id, {x:20, y:60}, "Anissa la met en contact avec djihadistes (Abou Barou). Gère page FB d'Abou Barou. Rencontre Lassad A.", 'Fait', { date: '2015-03-01', tags: ['contact djihadistes', 'gestion page Facebook', 'rencontre virtuelle'], personTags: ['AnissaM', 'AbouBarou', 'LassadA'] }); const f_e2_2_1 = el.id; nodes.push(el);
  el = createElementNode(e2_2_id, {x:20, y:150}, "Seule, sans perspectives d'avenir, enfermée chez ses parents. Lassad A. (12 ans de plus). Image père faible, femmes faibles.", 'Contexte', { tags: ['isolement', 'manque de perspectives', 'relation virtuelle', 'figure paternelle'], personTags: ['LassadA'] }); const c_e2_2_1 = el.id; nodes.push(el);
  el = createElementNode(e2_2_id, {x:280, y:60}, "Se sent puissante, séduisante, influente, expérimentée en incarnant homme (avatars). Reçoit attention, messages de tendresse. Lassad A. comble image du père.", 'Vécu', { tags: ['sentiment de puissance', 'séduction', 'attention reçue', 'compensation affective'], personTags: ['LassadA'] }); const v_e2_2_1 = el.id; nodes.push(el);
  el = createElementNode(e2_2_id, {x:20, y:240}, "Crée avatars djihadistes masculins (Abou Souleyman, etc.), séduit et manipule des dizaines de femmes. Relation 'amoureuse' (non consommée) avec Lassad A., veut se marier et partir en Syrie avec lui.", 'Action', { tags: ['création avatars', 'manipulation en ligne', 'relation amoureuse virtuelle', 'projet départ Syrie'], personTags: ['AbouSouleyman', 'LassadA'], locationTags: ['Syrie'] }); const a_e2_2_1 = el.id; nodes.push(el);
  el = createElementNode(e2_2_id, {x:280, y:240}, "Puissance et contrôle par la manipulation et l'identité virtuelle masculine. Capacité à incarner un idéal masculin fort et protecteur.", 'Encapacitation', { tags: ['contrôle', 'pouvoir virtuel', 'incarnation idéal masculin'] }); const encap_e2_2_1 = el.id; nodes.push(el);
  edges.push(createEdge(f_e2_2_1, v_e2_2_1, 'permet')); edges.push(createEdge(c_e2_2_1, v_e2_2_1, 'influe sur'));
  edges.push(createEdge(v_e2_2_1, a_e2_2_1, 'engendre')); edges.push(createEdge(a_e2_2_1, encap_e2_2_1, 'mène à'));
  edges.push(createEdge(encap_e2_1_1, f_e2_2_1, 'facilite'));

  // --- PÉRIODE 3: PASSAGE À L'ACTE AVORTÉ & ARRESTATION (2016) ---
  const p3_id = generateId();
  nodes.push({
    id: p3_id, type: 'period', position: { x: 50, y: 1450 },
    data: { 
      label: "Passage à l'Acte Avorté & Arrestation (Janv-Sept 2016)",
      startDate: '2016-01-01',
      endDate: '2016-09-08',
      tags: ['passage à l_acte', 'tentative attentat', 'arrestation', 'djihadisme', 'manipulation']
    }, width: 1500, height: 800
  });

  const e3_1_id = generateId();
  nodes.push({
    id: e3_1_id, type: 'event', parentNode: p3_id, extent: 'parent', position: { x: 30, y: 80 },
    data: { 
      label: 'Projets contrariés et Connexion avec O. Gilligmann (Janv-Août 2016)',
      startDate: '2016-01-01',
      endDate: '2016-08-31',
      tags: ['projets contrariés', 'surveillance', 'nouvelle connexion', 'manipulation'],
      personTags: ['LassadA', 'OGilligmann', 'AbouSouleyman']
    }, width: 450, height: 350
  });
  el = createElementNode(e3_1_id, {x:20, y:60}, "Lassad A. arrêté et expulsé (Janv.). I.M. dénoncée par son père, interdite de sortie du territoire (Déc. 2015).", 'Fait', { startDate: '2015-12-15', endDate: '2016-01-31', tags: ['arrestation (partenaire)', 'expulsion (partenaire)', 'dénonciation familiale', 'interdiction sortie territoire'], personTags:['LassadA'] }); const f_e3_1_1 = el.id; nodes.push(el);
  el = createElementNode(e3_1_id, {x:20, y:130}, "De nouveau seule, projets de départ en Syrie bloqués. Vit les interdits comme persécution.", 'Contexte', { tags: ['isolement', 'blocage projet', 'sentiment persécution'], locationTags:['Syrie'] }); const c_e3_1_1 = el.id; nodes.push(el);
  el = createElementNode(e3_1_id, {x:250, y:60}, "Commence à échanger avec O. Gilligmann (OG) via avatar Abou Souleyman (Mai).", 'Action', { date: '2016-05-01', tags: ['communication en ligne', 'avatar'], personTags: ['OGilligmann', 'AbouSouleyman'] }); const a_e3_1_1 = el.id; nodes.push(el);
  el = createElementNode(e3_1_id, {x:20, y:220}, "Organise et rencontre O.G. (31 Août) en se faisant passer pour la sœur d'Abou Souleyman.", 'Action', { date: '2016-08-31', tags: ['rencontre physique', 'tromperie identité'], personTags: ['OGilligmann', 'AbouSouleyman'] }); const a_e3_1_2 = el.id; nodes.push(el);
  el = createElementNode(e3_1_id, {x:250, y:220}, "Capacité à manipuler et engager autrui dans un projet violent concret malgré les obstacles.", 'Encapacitation', { tags: ['manipulation avancée', 'engagement projet violent'] }); const encap_e3_1_1 = el.id; nodes.push(el);
  edges.push(createEdge(f_e3_1_1, c_e3_1_1, 'crée contexte')); edges.push(createEdge(c_e3_1_1, a_e3_1_1, 'mène à'));
  edges.push(createEdge(a_e3_1_1, a_e3_1_2, 'est suivi de')); edges.push(createEdge(a_e3_1_2, encap_e3_1_1, 'démontre'));
  edges.push(createEdge(encap_e2_2_1, a_e3_1_1, 'permet de'));

  const e3_2_id = generateId();
  nodes.push({
    id: e3_2_id, type: 'event', parentNode: p3_id, extent: 'parent', position: { x: 520, y: 80 },
    data: { 
      label: "Tentative d'Attentat Voiture Piégée (3-4 Sept. 2016)",
      startDate: '2016-09-03',
      endDate: '2016-09-04',
      tags: ['tentative attentat', 'voiture piégée', 'échec', 'fuite', 'terrorisme'],
      personTags: ['OGilligmann', 'RKassim'],
      locationTags: ['Paris', 'Notre-Dame']
    }, width: 450, height: 550
  });
  el = createElementNode(e3_2_id, {x:20, y:60}, "O.G. rejoint I.M. avec voiture de location et bonbonnes (2 Sept). Enregistrent vidéo de revendication, envoient à R. Kassim.", 'Action', { date: '2016-09-02', tags: ['préparation attentat', 'vidéo revendication'], personTags:['OGilligmann', 'RKassim'] }); const a_e3_2_1 = el.id; nodes.push(el);
  el = createElementNode(e3_2_id, {x:20, y:120}, "Vole la voiture de son père, conduit sans permis.", 'Action', { date: '2016-09-03', tags: ['vol véhicule', 'conduite sans permis'] }); const a_e3_2_2 = el.id; nodes.push(el);
  el = createElementNode(e3_2_id, {x:20, y:180}, "Cherchent (2h) un lieu pour laisser la voiture piégée.", 'Action', { date: '2016-09-03', tags: ['repérage'] }); const a_e3_2_3 = el.id; nodes.push(el);
  el = createElementNode(e3_2_id, {x:20, y:240}, "Laissent voiture (bonbonnes) près de Notre-Dame.", 'Action', { date: '2016-09-03', tags: ['dépôt voiture piégée'], locationTags:['Paris', 'Notre-Dame'] }); const a_e3_2_4 = el.id; nodes.push(el);
  el = createElementNode(e3_2_id, {x:20, y:300}, "Imbibe couverture gazole, O.G. jette mégot.", 'Action', { date: '2016-09-04', tags: ['tentative allumage'], personTags:['OGilligmann'] }); const a_e3_2_5 = el.id; nodes.push(el);
  el = createElementNode(e3_2_id, {x:250, y:300}, "Voiture n'explose pas. Gérant brasserie alerte police.", 'Fait', { date: '2016-09-04', tags: ['échec explosion', 'alerte police'] }); const f_e3_2_1 = el.id; nodes.push(el);
  el = createElementNode(e3_2_id, {x:20, y:380}, "Repartent, voient police, s'enfuient. Retournent chez sœur I.M. à Chevilly-Larue.", 'Action', { date: '2016-09-04', tags: ['fuite', 'repli'], locationTags:['Chevilly-Larue'] }); const a_e3_2_6 = el.id; nodes.push(el);
  el = createElementNode(e3_2_id, {x:20, y:440}, "Testent cocktails Molotov sur des parkings.", 'Action', { date: '2016-09-04', tags: ['test explosifs artisanaux'] }); const a_e3_2_7 = el.id; nodes.push(el);
  edges.push(createEdge(encap_e3_1_1, a_e3_2_1, 'se concrétise par')); edges.push(createEdge(a_e3_2_1, a_e3_2_2, 'précède'));
  edges.push(createEdge(a_e3_2_2, a_e3_2_3, 'précède')); edges.push(createEdge(a_e3_2_3, a_e3_2_4, 'aboutit à'));
  edges.push(createEdge(a_e3_2_4, a_e3_2_5, 'est suivi de')); edges.push(createEdge(a_e3_2_5, f_e3_2_1, 'résulte en (échec)'));
  edges.push(createEdge(f_e3_2_1, a_e3_2_6, 'provoque')); edges.push(createEdge(a_e3_2_6, a_e3_2_7, 'est suivi de'));

  const e3_3_id = generateId();
  nodes.push({
    id: e3_3_id, type: 'event', parentNode: p3_id, extent: 'parent', position: { x: 1010, y: 80 },
    data: { 
      label: 'Recherche de Fuite & Arrestation (4-8 Sept. 2016)',
      startDate: '2016-09-04',
      endDate: '2016-09-08',
      tags: ['fuite', 'cavale', 'arrestation', 'confrontation police', 'martyre'],
      personTags: ['OGilligmann', 'ASakaou', 'SHervouët'],
      locationTags: ['Boussy-Saint-Antoine']
    }, width: 450, height: 350
  });
  el = createElementNode(e3_3_id, {x:20, y:60}, "O.G. repart de son côté. I.M. est recherchée.", 'Fait', { date: '2016-09-04', tags: ['séparation complices', 'recherche policière'], personTags:['OGilligmann'] }); const f_e3_3_1 = el.id; nodes.push(el);
  el = createElementNode(e3_3_id, {x:20, y:130}, "Active réseau 'sœurs djihadistes', trouve refuge chez A. Sakaou à Boussy-Saint-Antoine. S. Hervouët la rejoint (6-7 Sept).", 'Action', { startDate: '2016-09-06', endDate: '2016-09-07', tags: ['activation réseau', 'refuge', 'regroupement'], personTags:['ASakaou', 'SHervouët'], locationTags:['Boussy-Saint-Antoine'] }); const a_e3_3_1 = el.id; nodes.push(el);
  el = createElementNode(e3_3_id, {x:250, y:60}, "Méfiance envers S. Hervouët (la fouille). Prévenues (8 Sept) que la police les recherche.", 'Contexte', { date: '2016-09-08', tags: ['méfiance', 'alerte police'], personTags:['SHervouët'] }); const c_e3_3_1 = el.id; nodes.push(el);
  el = createElementNode(e3_3_id, {x:20, y:220}, "S'arment de couteaux. Descendent sur le parking. I.M. agite couteau face policier, se fait tirer dessus, demande à être tuée en martyre en se débattant.", 'Action', { date: '2016-09-08', tags: ['armement', 'confrontation police', 'violence contre police', 'tentative martyre'] }); const a_e3_3_2 = el.id; nodes.push(el);
  el = createElementNode(e3_3_id, {x:250, y:220}, "Arrestation d'I.M., A. Sakaou et S. Hervouët (8 Sept).", 'Fait', { date: '2016-09-08', tags: ['arrestation'], personTags:['ASakaou', 'SHervouët'] }); const f_e3_3_2 = el.id; nodes.push(el);
  el = createElementNode(e3_3_id, {x:250, y:290}, "Tentative d'accomplissement par le martyre et confrontation violente finale.", 'Encapacitation', { date: '2016-09-08', tags: ['quête de martyre', 'confrontation finale'] }); const encap_e3_3_1 = el.id; nodes.push(el);
  edges.push(createEdge(a_e3_2_7, f_e3_3_1, 'mène à (situation)')); edges.push(createEdge(f_e3_3_1, a_e3_3_1, 'provoque'));
  edges.push(createEdge(a_e3_3_1, c_e3_3_1, 'dans un contexte de')); edges.push(createEdge(c_e3_3_1, a_e3_3_2, 'influe sur'));
  edges.push(createEdge(a_e3_3_2, f_e3_3_2, 'résulte en')); edges.push(createEdge(a_e3_3_2, encap_e3_3_1, 'vise à'));

  return { nodes, edges };
};