// frontend/src/inesMadaniTrajectoryData.js
import { v4 as uuidv4 } from 'uuid'; // Assurez-vous que uuid est installé dans le frontend

const generateId = () => uuidv4(); // Pour la lisibilité, même si uuidv4() est court

export const inesMadaniPrecreatedData = () => {
  const nodes = [];
  const edges = [];

  // --- PÉRIODE 1: ADOLESCENCE & DÉBUT DIFFICULTÉS (2012-2014) ---
  const p1_id = generateId();
  nodes.push({
    id: p1_id, type: 'period', position: { x: 50, y: 50 },
    data: { label: 'Adolescence & Début Difficultés (2012-2014)' },
    width: 900, height: 700 // Taille estimée pour contenir les événements
  });

  // Événement 1.1: Scolarité et Isolement (2012, 15 ans)
  const e1_1_id = generateId();
  nodes.push({
    id: e1_1_id, type: 'event', parentNode: p1_id, extent: 'parent', position: { x: 30, y: 80 },
    data: { label: 'Scolarité et Isolement (2012)' },
    width: 400, height: 300
  });

  const f_e1_1_1 = generateId(); // CAP Pâtisserie, Sanitaire & Social, Compta
  nodes.push({
    id: f_e1_1_1, type: 'element', parentNode: e1_1_id, extent: 'parent', position: { x: 20, y: 60 },
    data: { label: 'Commence CAP Pâtisserie, puis Sanitaire & Social, puis Compta.', elementType: 'Fait', id: f_e1_1_1 }
  });
  const c_e1_1_1 = generateId(); // Exclue 3ème
  nodes.push({
    id: c_e1_1_1, type: 'element', parentNode: e1_1_id, extent: 'parent', position: { x: 20, y: 130 },
    data: { label: 'Exclue de sa classe de 3ème (alarme incendie).', elementType: 'Contexte', id: c_e1_1_1 }
  });
  const v_e1_1_1 = generateId(); // Ne s'aime pas, complexée
  nodes.push({
    id: v_e1_1_1, type: 'element', parentNode: e1_1_id, extent: 'parent', position: { x: 220, y: 60 },
    data: { label: "Ne s'aime pas, très complexée, garçon manqué. Se cherche.", elementType: 'Vécu', id: v_e1_1_1 }
  });
  const a_e1_1_1 = generateId(); // Absente, résultats médiocres
  nodes.push({
    id: a_e1_1_1, type: 'element', parentNode: e1_1_id, extent: 'parent', position: { x: 220, y: 150 },
    data: { label: 'Très absente des formations, résultats médiocres.', elementType: 'Action', id: a_e1_1_1 }
  });
  const a_e1_1_2 = generateId(); // Repli sur soi
  nodes.push({
    id: a_e1_1_2, type: 'element', parentNode: e1_1_id, extent: 'parent', position: { x: 220, y: 210 },
    data: { label: 'Se replie sur elle-même.', elementType: 'Action', id: a_e1_1_2 }
  });
  edges.push({ id: generateId(), source: f_e1_1_1, target: v_e1_1_1, label: 'produit', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: c_e1_1_1, target: v_e1_1_1, label: 'influe sur', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: v_e1_1_1, target: a_e1_1_1, label: 'engendre', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: v_e1_1_1, target: a_e1_1_2, label: 'engendre', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });

  // Événement 1.2: Rencontre Anissa Medj (2013, 16 ans)
  const e1_2_id = generateId();
  nodes.push({
    id: e1_2_id, type: 'event', parentNode: p1_id, extent: 'parent', position: { x: 460, y: 80 },
    data: { label: 'Rencontre Anissa Medj (2013)' },
    width: 400, height: 300
  });
  const f_e1_2_1 = generateId(); // Rencontre Anissa
  nodes.push({
    id: f_e1_2_1, type: 'element', parentNode: e1_2_id, extent: 'parent', position: { x: 20, y: 60 },
    data: { label: 'Rencontre Anissa Medj (A.M.) à la mosquée.', elementType: 'Fait', id: f_e1_2_1 }
  });
  const c_e1_2_1 = generateId(); // Contexte Anissa
  nodes.push({
    id: c_e1_2_1, type: 'element', parentNode: e1_2_id, extent: 'parent', position: { x: 20, y: 130 },
    data: { label: 'Exclue (discipline), sans diplôme. A.M. a 11 ans de plus, attend un enfant, islam rigoriste.', elementType: 'Contexte', id: c_e1_2_1 }
  });
  const v_e1_2_1 = generateId(); // Vécu Anissa
  nodes.push({
    id: v_e1_2_1, type: 'element', parentNode: e1_2_id, extent: 'parent', position: { x: 220, y: 60 },
    data: { label: "A.M. = Sœur Mentor, idéal de féminité, maternité, piété. Désinvestissement figures parentales.", elementType: 'Vécu', id: v_e1_2_1 }
  });
  const a_e1_2_1 = generateId(); // Actions avec Anissa
  nodes.push({
    id: a_e1_2_1, type: 'element', parentNode: e1_2_id, extent: 'parent', position: { x: 220, y: 150 },
    data: { label: "Deviennent amies, garde bébé d'A.M., cache relation à sa famille.", elementType: 'Action', id: a_e1_2_1 }
  });
  edges.push({ id: generateId(), source: f_e1_2_1, target: v_e1_2_1, label: 'produit', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: c_e1_2_1, target: v_e1_2_1, label: 'influe sur', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: v_e1_2_1, target: a_e1_2_1, label: 'engendre', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });


  // Événement 1.3: Traumatismes et Vulnérabilité (2014, 17 ans)
  const e1_3_id = generateId();
  nodes.push({
    id: e1_3_id, type: 'event', parentNode: p1_id, extent: 'parent', position: { x: 30, y: 420 },
    data: { label: 'Traumatismes et Vulnérabilité (2014)' },
    width: 830, height: 250
  });
  const f_e1_3_1 = generateId(); // Décès grand-mère
  nodes.push({
    id: f_e1_3_1, type: 'element', parentNode: e1_3_id, extent: 'parent', position: { x: 20, y: 60 },
    data: { label: 'Décès de sa grand-mère maternelle.', elementType: 'Fait', id: f_e1_3_1 }
  });
  const c_e1_3_1 = generateId(); // Contexte décès
  nodes.push({
    id: c_e1_3_1, type: 'element', parentNode: e1_3_id, extent: 'parent', position: { x: 20, y: 130 },
    data: { label: 'Dispute avec grand-mère avant décès (refus douche).', elementType: 'Contexte', id: c_e1_3_1 }
  });
  const v_e1_3_1 = generateId(); // Vécu décès
  nodes.push({
    id: v_e1_3_1, type: 'element', parentNode: e1_3_id, extent: 'parent', position: { x: 220, y: 60 },
    data: { label: 'Tristesse, Culpabilité immense.', elementType: 'Vécu', id: v_e1_3_1 }
  });
  const a_e1_3_1 = generateId(); // Action suite décès
  nodes.push({
    id: a_e1_3_1, type: 'element', parentNode: e1_3_id, extent: 'parent', position: { x: 420, y: 60 },
    data: { label: 'Fréquente régulièrement la mosquée. Consomme cannabis et alcool.', elementType: 'Action', id: a_e1_3_1 }
  });
  edges.push({ id: generateId(), source: f_e1_3_1, target: v_e1_3_1, label: 'produit', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: c_e1_3_1, target: v_e1_3_1, label: 'influe sur', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: v_e1_3_1, target: a_e1_3_1, label: 'engendre', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });

  const f_e1_3_2 = generateId(); // Agressions sexuelles
  nodes.push({
    id: f_e1_3_2, type: 'element', parentNode: e1_3_id, extent: 'parent', position: { x: 220, y: 130 },
    data: { label: 'Subit 2 agressions sexuelles dans la rue.', elementType: 'Fait', id: f_e1_3_2 }
  });
  const c_e1_3_2 = generateId(); // Contexte agressions
  nodes.push({
    id: c_e1_3_2, type: 'element', parentNode: e1_3_id, extent: 'parent', position: { x: 20, y: 190 },
    data: { label: 'Mal dans son corps, adolescence, relation conflictuelle mère, père passif face violences soeurs.', elementType: 'Contexte', id: c_e1_3_2 }
  });
  const v_e1_3_2 = generateId(); // Vécu agressions
  nodes.push({
    id: v_e1_3_2, type: 'element', parentNode: e1_3_id, extent: 'parent', position: { x: 420, y: 130 },
    data: { label: 'Honte, Colère, Trahison (figure masculine/père). Désir de protéger, être forte.', elementType: 'Vécu', id: v_e1_3_2 }
  });
  const a_e1_3_2 = generateId(); // Action suite agressions
  nodes.push({
    id: a_e1_3_2, type: 'element', parentNode: e1_3_id, extent: 'parent', position: { x: 620, y: 130 },
    data: { label: 'Silence, repli, port du voile. Défi autorité paternelle.', elementType: 'Action', id: a_e1_3_2 }
  });
  edges.push({ id: generateId(), source: f_e1_3_2, target: v_e1_3_2, label: 'produit', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: c_e1_3_2, target: v_e1_3_2, label: 'influe sur', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: c_e1_3_2, target: f_e1_3_2, label: 'contextualise', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: v_e1_3_2, target: a_e1_3_2, label: 'engendre', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });


  // --- PÉRIODE 2: PLONGÉE DANS LA RADICALISATION (2015, 18 ans) ---
  const p2_id = generateId();
  nodes.push({
    id: p2_id, type: 'period', position: { x: 50, y: 800 },
    data: { label: 'Plongée dans la Radicalisation (2015)' },
    width: 1200, height: 600
  });

  // Événement 2.1: Départ Anissa & Isolement Accru (Janv. 2015)
  const e2_1_id = generateId();
  nodes.push({
    id: e2_1_id, type: 'event', parentNode: p2_id, extent: 'parent', position: { x: 30, y: 80 },
    data: { label: "Départ d'Anissa M. en Syrie (Janv. 2015)" },
    width: 550, height: 250
  });
  const f_e2_1_1 = generateId();
  nodes.push({ id: f_e2_1_1, type: 'element', parentNode: e2_1_id, extent: 'parent', position: {x:20, y:60}, data: {label: "Anissa M. part en Syrie avec son bébé.", elementType: 'Fait', id: f_e2_1_1}});
  const v_e2_1_1 = generateId();
  nodes.push({ id: v_e2_1_1, type: 'element', parentNode: e2_1_id, extent: 'parent', position: {x:250, y:60}, data: {label: "Sentiment de solitude, abandon, perte de repère.", elementType: 'Vécu', id: v_e2_1_1}});
  const a_e2_1_1 = generateId();
  nodes.push({ id: a_e2_1_1, type: 'element', parentNode: e2_1_id, extent: 'parent', position: {x:20, y:150}, data: {label: "Refuse de suivre Anissa mais lui donne ses économies.", elementType: 'Action', id: a_e2_1_1}});
  const encap_e2_1_1 = generateId();
  nodes.push({ id: encap_e2_1_1, type: 'element', parentNode: e2_1_id, extent: 'parent', position: {x:250, y:150}, data: {label: "Devient 'l'Anissa' (influence) pour d'autres femmes pour combler le vide.", elementType: 'Encapacitation', id: encap_e2_1_1}});
  edges.push({ id: generateId(), source: f_e2_1_1, target: v_e2_1_1, label: 'produit', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: v_e2_1_1, target: a_e2_1_1, label: 'engendre', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: a_e2_1_1, target: encap_e2_1_1, label: 'mène à', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: v_e2_1_1, target: encap_e2_1_1, label: 'motive', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });


  // Événement 2.2: Gestion Compte Abou Barou & Création Avatars (Mars 2015)
  const e2_2_id = generateId();
  nodes.push({
    id: e2_2_id, type: 'event', parentNode: p2_id, extent: 'parent', position: { x: 620, y: 80 },
    data: { label: 'Prise de Rôle Virtuel (Mars 2015)' },
    width: 550, height: 450
  });
  const f_e2_2_1 = generateId();
  nodes.push({ id: f_e2_2_1, type: 'element', parentNode: e2_2_id, extent: 'parent', position: {x:20, y:60}, data: {label: "Anissa la met en contact avec djihadistes (Abou Barou). Gère page FB d'Abou Barou.", elementType: 'Fait', id: f_e2_2_1}});
  const c_e2_2_1 = generateId();
  nodes.push({ id: c_e2_2_1, type: 'element', parentNode: e2_2_id, extent: 'parent', position: {x:20, y:150}, data: {label: "Seule, sans perspectives, enfermée, conflits identitaires (féminin/masculin, image père/mère).", elementType: 'Contexte', id: c_e2_2_1}});
  const v_e2_2_1 = generateId();
  nodes.push({ id: v_e2_2_1, type: 'element', parentNode: e2_2_id, extent: 'parent', position: {x:280, y:60}, data: {label: "Se sent puissante, séduisante, influente, expérimentée en incarnant homme via avatars. Reçoit attention.", elementType: 'Vécu', id: v_e2_2_1}});
  const a_e2_2_1 = generateId();
  nodes.push({ id: a_e2_2_1, type: 'element', parentNode: e2_2_id, extent: 'parent', position: {x:280, y:180}, data: {label: "Crée des avatars djihadistes masculins, séduit et manipule des dizaines de femmes en ligne.", elementType: 'Action', id: a_e2_2_1}});
  const encap_e2_2_1 = generateId();
  nodes.push({ id: encap_e2_2_1, type: 'element', parentNode: e2_2_id, extent: 'parent', position: {x:280, y:270}, data: {label: "Puissance et contrôle par la manipulation et l'identité virtuelle masculine.", elementType: 'Encapacitation', id: encap_e2_2_1}});
  edges.push({ id: generateId(), source: f_e2_2_1, target: v_e2_2_1, label: 'permet', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: c_e2_2_1, target: v_e2_2_1, label: 'influe sur', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: v_e2_2_1, target: a_e2_2_1, label: 'engendre', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: a_e2_2_1, target: encap_e2_2_1, label: 'mène à', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  // Lien inter-événement (simplifié, l'encapacitation précédente mène à cette nouvelle phase)
  edges.push({ id: generateId(), source: encap_e2_1_1, target: f_e2_2_1, label: 'facilite', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });


  // Événement 2.3: Relation avec Lassad A. & Projet Syrie (Mai-Déc. 2015)
  // ... (Pour la concision, je ne détaille pas cet événement, mais la structure serait similaire)


  // --- PÉRIODE 3: PASSAGE À L'ACTE AVORTÉ & ARRESTATION (2016) ---
  const p3_id = generateId();
  nodes.push({
    id: p3_id, type: 'period', position: { x: 50, y: 1450 },
    data: { label: "Passage à l'Acte Avorté & Arrestation (2016)" },
    width: 1500, height: 800
  });

  // Événement 3.1: Préparation Attentat avec O. Gilligmann (Mai-Août 2016)
  const e3_1_id = generateId();
  nodes.push({
    id: e3_1_id, type: 'event', parentNode: p3_id, extent: 'parent', position: { x: 30, y: 80 },
    data: { label: 'Préparation Attentat avec O. Gilligmann (Mai-Août 2016)' },
    width: 450, height: 250
  });
  const f_e3_1_1 = generateId();
  nodes.push({ id: f_e3_1_1, type: 'element', parentNode: e3_1_id, extent: 'parent', position: {x:20, y:60}, data: {label: "Commence à échanger avec O. Gilligmann (OG) via avatar Abou Souleyman.", elementType: 'Fait', id: f_e3_1_1}});
  const a_e3_1_1 = generateId();
  nodes.push({ id: a_e3_1_1, type: 'element', parentNode: e3_1_id, extent: 'parent', position: {x:20, y:130}, data: {label: "Organise et rencontre O.G. en se faisant passer pour la sœur d'Abou Souleyman.", elementType: 'Action', id: a_e3_1_1}});
  const encap_e3_1_1 = generateId();
  nodes.push({ id: encap_e3_1_1, type: 'element', parentNode: e3_1_id, extent: 'parent', position: {x:250, y:130}, data: {label: "Capacité à manipuler et engager autrui dans un projet violent concret.", elementType: 'Encapacitation', id: encap_e3_1_1}});
  edges.push({ id: generateId(), source: f_e3_1_1, target: a_e3_1_1, label: 'mène à', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: a_e3_1_1, target: encap_e3_1_1, label: 'démontre', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  // Lien avec l'encapacitation précédente
  edges.push({ id: generateId(), source: encap_e2_2_1, target: f_e3_1_1, label: 'débouche sur', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });


  // Événement 3.2: Tentative d'Attentat Voiture Piégée (Nuit 3-4 Sept. 2016)
  const e3_2_id = generateId();
  nodes.push({
    id: e3_2_id, type: 'event', parentNode: p3_id, extent: 'parent', position: { x: 520, y: 80 },
    data: { label: "Tentative d'Attentat Voiture Piégée (3-4 Sept. 2016)" },
    width: 450, height: 550 // Plus haut car beaucoup d'actions
  });
  const a_e3_2_1 = generateId(); // Vidéo revendication
  nodes.push({ id: a_e3_2_1, type: 'element', parentNode: e3_2_id, extent: 'parent', position: {x:20, y:60}, data: {label: "Enregistrent vidéo de revendication, envoient à R. Kassim.", elementType: 'Action', id: a_e3_2_1}});
  const a_e3_2_2 = generateId(); // Vol voiture
  nodes.push({ id: a_e3_2_2, type: 'element', parentNode: e3_2_id, extent: 'parent', position: {x:20, y:120}, data: {label: "Vole la voiture de son père, conduit sans permis.", elementType: 'Action', id: a_e3_2_2}});
  const a_e3_2_3 = generateId(); // Recherche lieu
  nodes.push({ id: a_e3_2_3, type: 'element', parentNode: e3_2_id, extent: 'parent', position: {x:20, y:180}, data: {label: "Cherchent (2h) un lieu pour laisser la voiture piégée.", elementType: 'Action', id: a_e3_2_3}});
  const a_e3_2_4 = generateId(); // Dépôt voiture
  nodes.push({ id: a_e3_2_4, type: 'element', parentNode: e3_2_id, extent: 'parent', position: {x:20, y:240}, data: {label: "Laissent voiture (bonbonnes) près de Notre-Dame.", elementType: 'Action', id: a_e3_2_4}});
  const a_e3_2_5 = generateId(); // Tentative allumage
  nodes.push({ id: a_e3_2_5, type: 'element', parentNode: e3_2_id, extent: 'parent', position: {x:20, y:300}, data: {label: "Imbibe couverture gazole, O.G. jette mégot.", elementType: 'Action', id: a_e3_2_5}});
  const f_e3_2_1 = generateId(); // Non-explosion
  nodes.push({ id: f_e3_2_1, type: 'element', parentNode: e3_2_id, extent: 'parent', position: {x:250, y:300}, data: {label: "Voiture n'explose pas. Gérant brasserie alerte police.", elementType: 'Fait', id: f_e3_2_1}});
  const a_e3_2_6 = generateId(); // Fuite
  nodes.push({ id: a_e3_2_6, type: 'element', parentNode: e3_2_id, extent: 'parent', position: {x:20, y:380}, data: {label: "Repartent, voient police, s'enfuient. Retournent chez sœur I.M.", elementType: 'Action', id: a_e3_2_6}});
  const a_e3_2_7 = generateId(); // Test Molotov
  nodes.push({ id: a_e3_2_7, type: 'element', parentNode: e3_2_id, extent: 'parent', position: {x:20, y:440}, data: {label: "Testent cocktails Molotov sur des parkings.", elementType: 'Action', id: a_e3_2_7}});

  edges.push({ id: generateId(), source: encap_e3_1_1, target: a_e3_2_1, label: 'se concrétise par', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: a_e3_2_1, target: a_e3_2_2, label: 'précède', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: a_e3_2_2, target: a_e3_2_3, label: 'précède', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: a_e3_2_3, target: a_e3_2_4, label: 'aboutit à', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: a_e3_2_4, target: a_e3_2_5, label: 'est suivi de', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: a_e3_2_5, target: f_e3_2_1, label: 'résulte en (échec)', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: f_e3_2_1, target: a_e3_2_6, label: 'provoque', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: a_e3_2_6, target: a_e3_2_7, label: 'est suivi de', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });


  // Événement 3.3: Recherche de Fuite & Arrestation (4-8 Sept. 2016)
  const e3_3_id = generateId();
  nodes.push({
    id: e3_3_id, type: 'event', parentNode: p3_id, extent: 'parent', position: { x: 1010, y: 80 },
    data: { label: 'Recherche de Fuite & Arrestation (4-8 Sept. 2016)' },
    width: 450, height: 350
  });
  const f_e3_3_1 = generateId();
  nodes.push({ id: f_e3_3_1, type: 'element', parentNode: e3_3_id, extent: 'parent', position: {x:20, y:60}, data: {label: "O.G. repart de son côté. I.M. est recherchée.", elementType: 'Fait', id: f_e3_3_1}});
  const a_e3_3_1 = generateId();
  nodes.push({ id: a_e3_3_1, type: 'element', parentNode: e3_3_id, extent: 'parent', position: {x:20, y:130}, data: {label: "Active réseau 'sœurs djihadistes', trouve refuge chez A. Sakaou à Boussy-Saint-Antoine. S. Hervouët la rejoint.", elementType: 'Action', id: a_e3_3_1}});
  const c_e3_3_1 = generateId();
  nodes.push({ id: c_e3_3_1, type: 'element', parentNode: e3_3_id, extent: 'parent', position: {x:250, y:60}, data: {label: "Méfiance envers S. Hervouët. Prévenues que la police les recherche.", elementType: 'Contexte', id: c_e3_3_1}});
  const a_e3_3_2 = generateId();
  nodes.push({ id: a_e3_3_2, type: 'element', parentNode: e3_3_id, extent: 'parent', position: {x:20, y:220}, data: {label: "S'arment de couteaux. I.M. agite couteau face policier, se fait tirer dessus, demande à être tuée en martyre.", elementType: 'Action', id: a_e3_3_2}});
  const f_e3_3_2 = generateId();
  nodes.push({ id: f_e3_3_2, type: 'element', parentNode: e3_3_id, extent: 'parent', position: {x:250, y:220}, data: {label: "Arrestation d'I.M., A. Sakaou et S. Hervouët.", elementType: 'Fait', id: f_e3_3_2}});
  const encap_e3_3_1 = generateId();
  nodes.push({ id: encap_e3_3_1, type: 'element', parentNode: e3_3_id, extent: 'parent', position: {x:250, y:290}, data: {label: "Tentative d'accomplissement par le martyre (avortée).", elementType: 'Encapacitation', id: encap_e3_3_1}});

  edges.push({ id: generateId(), source: a_e3_2_7, target: f_e3_3_1, label: 'mène à (situation)', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } }); // Lien inter-événement
  edges.push({ id: generateId(), source: f_e3_3_1, target: a_e3_3_1, label: 'provoque', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: a_e3_3_1, target: c_e3_3_1, label: 'dans un contexte de', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: c_e3_3_1, target: a_e3_3_2, label: 'influe sur', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: a_e3_3_2, target: f_e3_3_2, label: 'résulte en', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });
  edges.push({ id: generateId(), source: a_e3_3_2, target: encap_e3_3_1, label: 'vise à', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } });


  return { nodes, edges };
};