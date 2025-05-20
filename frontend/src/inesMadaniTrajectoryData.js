// frontend/src/inesMadaniTrajectoryData.js
import { v4 as uuidv4 } from 'uuid';

const generateId = () => uuidv4();

export const inesMadaniPrecreatedData = () => {
  const nodes = [];
  const edges = [];

  // Helper to create an element node with its ID also in its data object
  const createElementNode = (parentNodeId, position, label, elementType, width, height) => {
    const id = generateId();
    return {
      id,
      type: 'element',
      parentNode: parentNodeId,
      extent: 'parent',
      position,
      data: { label, elementType, id }, // Ensure 'id' is in data for handle uniqueness if needed
      width,
      height
    };
  };
  
  const createEdge = (source, target, label) => ({
    id: generateId(),
    source,
    target,
    label,
    type: 'smoothstep',
    markerEnd: { type: 'arrowclosed' },
    style: { strokeWidth: 1.5, stroke: '#546e7a' },
    labelStyle: { fill: '#333', fontWeight: 500, fontSize: 11 },
    labelBgPadding: [4, 2],
    labelBgBorderRadius: 2,
    labelBgStyle: { fill: '#fff', fillOpacity: 0.7 },
  });


  // --- PÉRIODE 1: ADOLESCENCE & DÉBUT DIFFICULTÉS (2012-2014) ---
  const p1_id = generateId();
  nodes.push({
    id: p1_id, type: 'period', position: { x: 50, y: 50 },
    data: { label: 'Adolescence & Début Difficultés (2012-2014)' },
    width: 900, height: 700 
  });

  // Événement 1.1: Scolarité et Isolement (2012, 15 ans)
  const e1_1_id = generateId();
  nodes.push({
    id: e1_1_id, type: 'event', parentNode: p1_id, extent: 'parent', position: { x: 30, y: 80 },
    data: { label: 'Scolarité et Isolement (2012)' },
    width: 400, height: 300
  });

  let el; // Reusable variable for element nodes

  el = createElementNode(e1_1_id, { x: 20, y: 60 }, 'Commence CAP Pâtisserie, puis Sanitaire & Social, puis Compta.', 'Fait');
  const f_e1_1_1 = el.id; nodes.push(el);
  
  el = createElementNode(e1_1_id, { x: 20, y: 130 }, 'Exclue de sa classe de 3ème (alarme incendie).', 'Contexte');
  const c_e1_1_1 = el.id; nodes.push(el);

  el = createElementNode(e1_1_id, { x: 220, y: 60 }, "Ne s'aime pas, très complexée, garçon manqué. Se cherche.", 'Vécu');
  const v_e1_1_1 = el.id; nodes.push(el);

  el = createElementNode(e1_1_id, { x: 220, y: 150 }, 'Très absente des formations, résultats médiocres.', 'Action');
  const a_e1_1_1 = el.id; nodes.push(el);

  el = createElementNode(e1_1_id, { x: 220, y: 210 }, 'Se replie sur elle-même.', 'Action');
  const a_e1_1_2 = el.id; nodes.push(el);

  edges.push(createEdge(f_e1_1_1, v_e1_1_1, 'produit'));
  edges.push(createEdge(c_e1_1_1, v_e1_1_1, 'influe sur'));
  edges.push(createEdge(v_e1_1_1, a_e1_1_1, 'engendre'));
  edges.push(createEdge(v_e1_1_1, a_e1_1_2, 'engendre'));

  // Événement 1.2: Rencontre Anissa Medj (2013, 16 ans)
  const e1_2_id = generateId();
  nodes.push({
    id: e1_2_id, type: 'event', parentNode: p1_id, extent: 'parent', position: { x: 460, y: 80 },
    data: { label: 'Rencontre Anissa Medj (2013)' },
    width: 400, height: 300
  });

  el = createElementNode(e1_2_id, { x: 20, y: 60 }, 'Rencontre Anissa Medj (A.M.) à la mosquée.', 'Fait');
  const f_e1_2_1 = el.id; nodes.push(el);
  
  el = createElementNode(e1_2_id, { x: 20, y: 130 }, 'Exclue (discipline), sans diplôme. A.M. a 11 ans de plus, attend un enfant, islam rigoriste.', 'Contexte');
  const c_e1_2_1 = el.id; nodes.push(el);

  el = createElementNode(e1_2_id, { x: 220, y: 60 }, "A.M. = Sœur Mentor, idéal de féminité, maternité, piété. Désinvestissement figures parentales.", 'Vécu');
  const v_e1_2_1 = el.id; nodes.push(el);
  
  el = createElementNode(e1_2_id, { x: 220, y: 150 }, "Deviennent amies, garde bébé d'A.M., cache relation à sa famille.", 'Action');
  const a_e1_2_1 = el.id; nodes.push(el);

  edges.push(createEdge(f_e1_2_1, v_e1_2_1, 'produit'));
  edges.push(createEdge(c_e1_2_1, v_e1_2_1, 'influe sur'));
  edges.push(createEdge(v_e1_2_1, a_e1_2_1, 'engendre'));

  // Événement 1.3: Traumatismes et Vulnérabilité (2014, 17 ans)
  const e1_3_id = generateId();
  nodes.push({
    id: e1_3_id, type: 'event', parentNode: p1_id, extent: 'parent', position: { x: 30, y: 420 },
    data: { label: 'Traumatismes et Vulnérabilité (2014)' },
    width: 830, height: 250 
  });

  el = createElementNode(e1_3_id, { x: 20, y: 60 }, 'Décès de sa grand-mère maternelle.', 'Fait');
  const f_e1_3_1 = el.id; nodes.push(el);

  el = createElementNode(e1_3_id, { x: 20, y: 130 }, 'Dispute avec grand-mère avant décès (refus douche).', 'Contexte');
  const c_e1_3_1 = el.id; nodes.push(el);

  el = createElementNode(e1_3_id, { x: 220, y: 60 }, 'Tristesse, Culpabilité immense.', 'Vécu');
  const v_e1_3_1 = el.id; nodes.push(el);

  el = createElementNode(e1_3_id, { x: 420, y: 60 }, 'Fréquente régulièrement la mosquée. Consomme cannabis et alcool.', 'Action');
  const a_e1_3_1 = el.id; nodes.push(el);
  
  edges.push(createEdge(f_e1_3_1, v_e1_3_1, 'produit'));
  edges.push(createEdge(c_e1_3_1, v_e1_3_1, 'influe sur'));
  edges.push(createEdge(v_e1_3_1, a_e1_3_1, 'engendre'));

  el = createElementNode(e1_3_id, { x: 220, y: 130 }, 'Subit 2 agressions sexuelles dans la rue.', 'Fait');
  const f_e1_3_2 = el.id; nodes.push(el);

  el = createElementNode(e1_3_id, { x: 20, y: 190 }, 'Mal dans son corps, adolescence, relation conflictuelle mère, père passif face violences soeurs.', 'Contexte');
  const c_e1_3_2 = el.id; nodes.push(el);

  el = createElementNode(e1_3_id, { x: 420, y: 130 }, 'Honte, Colère, Trahison (figure masculine/père). Désir de protéger, être forte.', 'Vécu');
  const v_e1_3_2 = el.id; nodes.push(el);

  el = createElementNode(e1_3_id, { x: 620, y: 130 }, 'Silence, repli, port du voile. Défi autorité paternelle.', 'Action');
  const a_e1_3_2 = el.id; nodes.push(el);

  edges.push(createEdge(f_e1_3_2, v_e1_3_2, 'produit'));
  edges.push(createEdge(c_e1_3_2, v_e1_3_2, 'influe sur'));
  edges.push(createEdge(c_e1_3_2, f_e1_3_2, 'contextualise'));
  edges.push(createEdge(v_e1_3_2, a_e1_3_2, 'engendre'));


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

  el = createElementNode(e2_1_id, {x:20, y:60}, "Anissa M. part en Syrie avec son bébé.", 'Fait');
  const f_e2_1_1 = el.id; nodes.push(el);
  el = createElementNode(e2_1_id, {x:250, y:60}, "Sentiment de solitude, abandon, perte de repère.", 'Vécu');
  const v_e2_1_1 = el.id; nodes.push(el);
  el = createElementNode(e2_1_id, {x:20, y:150}, "Refuse de suivre Anissa mais lui donne ses économies.", 'Action');
  const a_e2_1_1 = el.id; nodes.push(el);
  el = createElementNode(e2_1_id, {x:250, y:150}, "Devient 'l'Anissa' (influence) pour d'autres femmes pour combler le vide.", 'Encapacitation');
  const encap_e2_1_1 = el.id; nodes.push(el);

  edges.push(createEdge(f_e2_1_1, v_e2_1_1, 'produit'));
  edges.push(createEdge(v_e2_1_1, a_e2_1_1, 'engendre'));
  edges.push(createEdge(a_e2_1_1, encap_e2_1_1, 'mène à'));
  edges.push(createEdge(v_e2_1_1, encap_e2_1_1, 'motive'));

  // Événement 2.2: Gestion Compte Abou Barou & Création Avatars (Mars 2015)
  const e2_2_id = generateId();
  nodes.push({
    id: e2_2_id, type: 'event', parentNode: p2_id, extent: 'parent', position: { x: 620, y: 80 },
    data: { label: 'Prise de Rôle Virtuel (Mars 2015)' },
    width: 550, height: 450
  });
  el = createElementNode(e2_2_id, {x:20, y:60}, "Anissa la met en contact avec djihadistes (Abou Barou). Gère page FB d'Abou Barou.", 'Fait');
  const f_e2_2_1 = el.id; nodes.push(el);
  el = createElementNode(e2_2_id, {x:20, y:150}, "Seule, sans perspectives, enfermée, conflits identitaires (féminin/masculin, image père/mère).", 'Contexte');
  const c_e2_2_1 = el.id; nodes.push(el);
  el = createElementNode(e2_2_id, {x:280, y:60}, "Se sent puissante, séduisante, influente, expérimentée en incarnant homme via avatars. Reçoit attention.", 'Vécu');
  const v_e2_2_1 = el.id; nodes.push(el);
  el = createElementNode(e2_2_id, {x:280, y:180}, "Crée des avatars djihadistes masculins, séduit et manipule des dizaines de femmes en ligne.", 'Action');
  const a_e2_2_1 = el.id; nodes.push(el);
  el = createElementNode(e2_2_id, {x:280, y:270}, "Puissance et contrôle par la manipulation et l'identité virtuelle masculine.", 'Encapacitation');
  const encap_e2_2_1 = el.id; nodes.push(el);

  edges.push(createEdge(f_e2_2_1, v_e2_2_1, 'permet'));
  edges.push(createEdge(c_e2_2_1, v_e2_2_1, 'influe sur'));
  edges.push(createEdge(v_e2_2_1, a_e2_2_1, 'engendre'));
  edges.push(createEdge(a_e2_2_1, encap_e2_2_1, 'mène à'));
  edges.push(createEdge(encap_e2_1_1, f_e2_2_1, 'facilite'));


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
  el = createElementNode(e3_1_id, {x:20, y:60}, "Commence à échanger avec O. Gilligmann (OG) via avatar Abou Souleyman.", 'Fait');
  const f_e3_1_1 = el.id; nodes.push(el);
  el = createElementNode(e3_1_id, {x:20, y:130}, "Organise et rencontre O.G. en se faisant passer pour la sœur d'Abou Souleyman.", 'Action');
  const a_e3_1_1 = el.id; nodes.push(el);
  el = createElementNode(e3_1_id, {x:250, y:130}, "Capacité à manipuler et engager autrui dans un projet violent concret.", 'Encapacitation');
  const encap_e3_1_1 = el.id; nodes.push(el);

  edges.push(createEdge(f_e3_1_1, a_e3_1_1, 'mène à'));
  edges.push(createEdge(a_e3_1_1, encap_e3_1_1, 'démontre'));
  edges.push(createEdge(encap_e2_2_1, f_e3_1_1, 'débouche sur'));

  // Événement 3.2: Tentative d'Attentat Voiture Piégée (Nuit 3-4 Sept. 2016)
  const e3_2_id = generateId();
  nodes.push({
    id: e3_2_id, type: 'event', parentNode: p3_id, extent: 'parent', position: { x: 520, y: 80 },
    data: { label: "Tentative d'Attentat Voiture Piégée (3-4 Sept. 2016)" },
    width: 450, height: 550
  });
  el = createElementNode(e3_2_id, {x:20, y:60}, "Enregistrent vidéo de revendication, envoient à R. Kassim.", 'Action');
  const a_e3_2_1 = el.id; nodes.push(el);
  el = createElementNode(e3_2_id, {x:20, y:120}, "Vole la voiture de son père, conduit sans permis.", 'Action');
  const a_e3_2_2 = el.id; nodes.push(el);
  el = createElementNode(e3_2_id, {x:20, y:180}, "Cherchent (2h) un lieu pour laisser la voiture piégée.", 'Action');
  const a_e3_2_3 = el.id; nodes.push(el);
  el = createElementNode(e3_2_id, {x:20, y:240}, "Laissent voiture (bonbonnes) près de Notre-Dame.", 'Action');
  const a_e3_2_4 = el.id; nodes.push(el);
  el = createElementNode(e3_2_id, {x:20, y:300}, "Imbibe couverture gazole, O.G. jette mégot.", 'Action');
  const a_e3_2_5 = el.id; nodes.push(el);
  el = createElementNode(e3_2_id, {x:250, y:300}, "Voiture n'explose pas. Gérant brasserie alerte police.", 'Fait');
  const f_e3_2_1 = el.id; nodes.push(el);
  el = createElementNode(e3_2_id, {x:20, y:380}, "Repartent, voient police, s'enfuient. Retournent chez sœur I.M.", 'Action');
  const a_e3_2_6 = el.id; nodes.push(el);
  el = createElementNode(e3_2_id, {x:20, y:440}, "Testent cocktails Molotov sur des parkings.", 'Action');
  const a_e3_2_7 = el.id; nodes.push(el);

  edges.push(createEdge(encap_e3_1_1, a_e3_2_1, 'se concrétise par'));
  edges.push(createEdge(a_e3_2_1, a_e3_2_2, 'précède'));
  edges.push(createEdge(a_e3_2_2, a_e3_2_3, 'précède'));
  edges.push(createEdge(a_e3_2_3, a_e3_2_4, 'aboutit à'));
  edges.push(createEdge(a_e3_2_4, a_e3_2_5, 'est suivi de'));
  edges.push(createEdge(a_e3_2_5, f_e3_2_1, 'résulte en (échec)'));
  edges.push(createEdge(f_e3_2_1, a_e3_2_6, 'provoque'));
  edges.push(createEdge(a_e3_2_6, a_e3_2_7, 'est suivi de'));

  // Événement 3.3: Recherche de Fuite & Arrestation (4-8 Sept. 2016)
  const e3_3_id = generateId();
  nodes.push({
    id: e3_3_id, type: 'event', parentNode: p3_id, extent: 'parent', position: { x: 1010, y: 80 },
    data: { label: 'Recherche de Fuite & Arrestation (4-8 Sept. 2016)' },
    width: 450, height: 350
  });
  el = createElementNode(e3_3_id, {x:20, y:60}, "O.G. repart de son côté. I.M. est recherchée.", 'Fait');
  const f_e3_3_1 = el.id; nodes.push(el);
  el = createElementNode(e3_3_id, {x:20, y:130}, "Active réseau 'sœurs djihadistes', trouve refuge chez A. Sakaou à Boussy-Saint-Antoine. S. Hervouët la rejoint.", 'Action');
  const a_e3_3_1 = el.id; nodes.push(el);
  el = createElementNode(e3_3_id, {x:250, y:60}, "Méfiance envers S. Hervouët. Prévenues que la police les recherche.", 'Contexte');
  const c_e3_3_1 = el.id; nodes.push(el);
  el = createElementNode(e3_3_id, {x:20, y:220}, "S'arment de couteaux. I.M. agite couteau face policier, se fait tirer dessus, demande à être tuée en martyre.", 'Action');
  const a_e3_3_2 = el.id; nodes.push(el);
  el = createElementNode(e3_3_id, {x:250, y:220}, "Arrestation d'I.M., A. Sakaou et S. Hervouët.", 'Fait');
  const f_e3_3_2 = el.id; nodes.push(el);
  el = createElementNode(e3_3_id, {x:250, y:290}, "Tentative d'accomplissement par le martyre (avortée).", 'Encapacitation');
  const encap_e3_3_1 = el.id; nodes.push(el);
  
  edges.push(createEdge(a_e3_2_7, f_e3_3_1, 'mène à (situation)'));
  edges.push(createEdge(f_e3_3_1, a_e3_3_1, 'provoque'));
  edges.push(createEdge(a_e3_3_1, c_e3_3_1, 'dans un contexte de'));
  edges.push(createEdge(c_e3_3_1, a_e3_3_2, 'influe sur'));
  edges.push(createEdge(a_e3_3_2, f_e3_3_2, 'résulte en'));
  edges.push(createEdge(a_e3_3_2, encap_e3_3_1, 'vise à'));

  return { nodes, edges };
};