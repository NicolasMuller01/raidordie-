import { createContext, useContext, useEffect, useState } from 'react'

export const LANGS = [['en', 'English', 'EN'], ['es', 'Español', 'ES'], ['ru', 'Русский', 'RU']]

const en = {
  nav: { servers: 'Servers', shop: 'Shop', ranking: 'Leaderboard', info: 'About', rules: 'Rules', vote: 'Vote', invite: 'Invite', polls: 'Polls' },
  common: { online: 'online', offline: 'Offline', connect: 'Connect', copied: 'Copied', copy: 'Copy', votes: 'votes', search: 'Search item…', all: 'All', members: 'members' },
  auth: {
    login: 'Sign in with Steam', logout: 'Log out', required: 'Steam sign-in required',
    requiredText: 'You must connect your Steam account to use this. It links your purchases, votes and rewards to your in-game character.',
    error: 'Steam sign-in failed. Please try again.',
  },
  footer: 'unofficial server',
  home: {
    badge: 'ARK: Survival Evolved · PvP Cluster · 12 maps',
    tagline: 'ARK PvP server — Raid or die. Dominate, build and destroy in the wildest cluster.',
    play: 'Play now', maps: 'Maps', weeks: 'Weeks', perMap: 'per map', prizes: 'in prizes', cluster: 'in the cluster', release: 'Release', live: 'Server is live', cd: ['Days', 'Hours', 'Min', 'Sec'], xp: 'XP', taming: 'Taming',
    whyLabel: 'Why RaidOrDie', whyTitle: 'Built for PvP', whySub: 'Boosted rates, free transfers and a community that shows no mercy.',
    features: [
      ['12-map cluster', 'Transfer your character, dinos and items across every map.'],
      ['Fair PvP rules', '24/7 raids, no alliances and an active staff watching.'],
      ['Instant delivery', 'Whatever you buy in the shop lands in-game in seconds.'],
      ['Easy payments', 'Card and crypto, with a welcome bonus for new players.'],
    ],
    rates: 'Rates', shop: 'Shop', shopText: 'VIP, dinos, kits and resources. Automatic in-game delivery.', shopCta: 'Open shop',
    steamTitle: 'Connect with Steam', steamText: 'Sign in with your Steam account to buy, vote, take part in polls and get your invite code.',
    faqTitle: 'Frequently asked questions',
    faq: [
      ['What is RaidOrDie?', 'A 12-map ARK PvP cluster with boosted rates and fair rules.'],
      ['How do I join?', 'Search "RaidOrDie" in the ARK unofficial server list or use the Connect button on the Servers page.'],
      ['Is it free?', 'Yes. The shop is optional and only speeds up your progress.'],
      ['How do I buy in the shop?', 'Sign in with Steam, get points (pts) by topping up or voting, pick an item and it is delivered in-game in seconds.'],
      ['Can I transfer dinos between maps?', 'Yes: characters, dinos and items transfer across the whole cluster.'],
      ['Are there wipes?', 'Seasons are announced on Discord well in advance.'],
    ],
  },
  servers: { label: 'Cluster', title: 'Servers', sub: 'Cluster maps and live load. Crossplay on every map.', players: 'Players online' },
  shop: { label: 'Shop', title: 'RaidOrDie Shop', sub: 'Dinos, weapons, resources and kits. Pick an item and it lands in-game in seconds.', items: 'item(s)', clear: 'Clear', buy: 'Buy', checkout: 'Connect your payment gateway / points system here.',
    cats: { VIP: 'VIP', Dinos: 'Dinos', Weapons: 'Weapons', Saddles: 'Saddles', Resources: 'Resources', Structures: 'Structures', Kits: 'Kits' }, days: '30 days' },
  ranking: { label: 'Server stats', title: 'Leaderboard', sub: 'Top players and tribes of the season. Refreshed several times an hour.', kills: 'Kills', deaths: 'Deaths', tribes: 'Tribes' },
  info: { label: 'About us', title: 'Server info', sub: 'Unofficial ARK cluster focused on fair play with well-thought-out boosts.',
    rates: 'Rates', levels: 'Dino levels', limits: 'Limits', timings: 'Timings', features: 'Features',
    rateNames: ['XP', 'Taming', 'Harvest', 'Maturation', 'Dino weight', 'Incubation', 'Drops', 'Fishing'],
    levelNames: ['Wild', 'Tek', 'Eggs'], limitNames: ['Player level', 'Tribe size', 'Maps'],
    timingRows: [['Loot after death', '30 min'], ['Dropped loot', '10 min'], ['Taming food drain', 'x0.4']],
    featureList: ['Map location', 'Flyer speed boost', 'Cross-map transfers', 'Damage numbers', 'Third person', 'Gamma allowed', 'Infinite pickup', 'Structure auto-lock'] },
  rules: { label: 'Rules', title: 'Server rules', sub: 'Playing on RaidOrDie means you accept these rules. Staff may change them without notice.',
    warnTitle: 'Warning system', warnText: 'Warnings are a guideline, not a countdown. Staff may issue a permanent ban without prior warning in serious cases.',
    sections: [
      { title: 'General rules', items: ['No cheats, macros or third-party programs.', 'No item duplication or bug/exploit abuse.', 'No real-money trading outside the official shop.', 'No mesh building or building under the map.', 'One account per person; no account sharing.', 'Respect staff and players in global chat.'] },
      { title: 'PvP rules', items: ['No alliances between tribes.', 'Maximum 2 large bases per tribe per map.', 'Do not block caves, artifacts or resource spawns.', 'No building in boss or obelisk areas.', 'Raids allowed 24/7 except during announced events.'] },
      { title: 'Discord rules', items: ['No spam or advertising.', 'No NSFW or offensive content.', 'Use the right channels for tickets.'] },
    ] },
  vote: { label: 'Support the server', title: 'Vote', sub: 'Vote on server lists: VotePoints are credited automatically and top voters win end-of-season rewards.',
    perVote: 'pts per vote · every 24 h', btn: 'Vote', done: 'Already voted today', top: 'Top voters this month' },
  polls: { label: 'Player voice', title: 'Polls', sub: 'One vote per account. You can change your answer while the poll is open.',
    list: [{ q: 'Next weekend event?', o: ['Breeding x2', 'Harvest x3', 'PvP tournament'] }, { q: 'Should we add the Aquatica map?', o: ['Yes', 'No'] }] },
  invite: { label: 'Better together', title: 'Invite a friend', steps: [
    ['Share your code', 'Your friend enters it within 7 days and gets 100 pts on their first join.'],
    ['Earn from top-ups', 'You get 5% of every top-up your friend makes for 90 days.'],
    ['Activity bonus', 'When your friend reaches 25 hours played, you get 200 more pts.'],
  ] },
}

const es = {
  nav: { servers: 'Servidores', shop: 'Tienda', ranking: 'Ranking', info: 'Info', rules: 'Reglas', vote: 'Votar', invite: 'Invitar', polls: 'Encuestas' },
  common: { online: 'online', offline: 'Offline', connect: 'Conectar', copied: 'Copiado', copy: 'Copiar', votes: 'votos', search: 'Buscar objeto…', all: 'Todos', members: 'miembros' },
  auth: {
    login: 'Entrar con Steam', logout: 'Cerrar sesión', required: 'Necesitas conectar Steam',
    requiredText: 'Debes conectar tu cuenta de Steam para usar esto. Así vinculamos tus compras, votos y recompensas a tu personaje del juego.',
    error: 'Error al iniciar sesión con Steam. Inténtalo de nuevo.',
  },
  footer: 'servidor no oficial',
  home: {
    badge: 'ARK: Survival Evolved · Clúster PvP · 12 mapas',
    tagline: 'Servidor ARK PvP — Raidea o muere. Domina, construye y destruye en el clúster más salvaje.',
    play: 'Jugar ahora', maps: 'Mapas', weeks: 'Semanas', perMap: 'por mapa', prizes: 'en premios', cluster: 'en el clúster', release: 'Lanzamiento', live: 'Servidor abierto', cd: ['Días', 'Horas', 'Min', 'Seg'], xp: 'XP', taming: 'Domar',
    whyLabel: 'Por qué RaidOrDie', whyTitle: 'Hecho para el PvP', whySub: 'Rates potenciados, transferencias libres y una comunidad que no perdona.',
    features: [
      ['Clúster de 12 mapas', 'Transfiere personaje, dinos y objetos entre todos los mapas.'],
      ['PvP con reglas justas', 'Raids 24/7, sin alianzas y un staff activo que vigila.'],
      ['Entrega instantánea', 'Lo que compras en la tienda aparece en el juego en segundos.'],
      ['Pagos fáciles', 'Tarjeta y cripto, con bono de bienvenida para nuevos jugadores.'],
    ],
    rates: 'Rates', shop: 'Tienda', shopText: 'VIP, dinos, kits y recursos. Entrega automática en el juego.', shopCta: 'Ver tienda',
    steamTitle: 'Conéctate con Steam', steamText: 'Inicia sesión con tu cuenta de Steam para comprar, votar, participar en encuestas y obtener tu código de invitación.',
    faqTitle: 'Preguntas frecuentes',
    faq: [
      ['¿Qué es RaidOrDie?', 'Un clúster PvP de ARK con 12 mapas, rates potenciados y reglas justas.'],
      ['¿Cómo me conecto?', 'Busca "RaidOrDie" en la lista de servidores no oficiales de ARK o usa el botón Conectar en la página de Servidores.'],
      ['¿Es gratis?', 'Sí. La tienda es opcional y solo acelera tu progreso.'],
      ['¿Cómo compro en la tienda?', 'Entra con Steam, consigue puntos (pts) recargando o votando, elige el objeto y se entrega en el juego en segundos.'],
      ['¿Puedo transferir dinos entre mapas?', 'Sí: personajes, dinos y objetos se transfieren por todo el clúster.'],
      ['¿Hay wipes?', 'Las temporadas se anuncian en Discord con antelación.'],
    ],
  },
  servers: { label: 'Clúster', title: 'Servidores', sub: 'Mapas del clúster y carga en vivo. Crossplay en todos los mapas.', players: 'Jugadores conectados' },
  shop: { label: 'Tienda', title: 'Tienda RaidOrDie', sub: 'Dinos, armas, recursos y kits. Elige un objeto y llega al juego en segundos.', items: 'objeto(s)', clear: 'Vaciar', buy: 'Comprar', checkout: 'Conecta aquí tu pasarela de pago / sistema de puntos.',
    cats: { VIP: 'VIP', Dinos: 'Dinos', Weapons: 'Armas', Saddles: 'Sillas', Resources: 'Recursos', Structures: 'Estructuras', Kits: 'Kits' }, days: '30 días' },
  ranking: { label: 'Estadísticas', title: 'Ranking', sub: 'Top jugadores y tribus de la temporada. Se actualiza varias veces por hora.', kills: 'Kills', deaths: 'Muertes', tribes: 'Tribus' },
  info: { label: 'Sobre nosotros', title: 'Info del servidor', sub: 'Clúster no oficial de ARK centrado en el juego limpio con boosts bien pensados.',
    rates: 'Rates', levels: 'Niveles dinos', limits: 'Límites', timings: 'Tiempos', features: 'Características',
    rateNames: ['XP', 'Domar', 'Recolección', 'Maduración', 'Peso dinos', 'Incubación', 'Drops', 'Pesca'],
    levelNames: ['Salvajes', 'Tek', 'Huevos'], limitNames: ['Nivel jugador', 'Tamaño tribu', 'Mapas'],
    timingRows: [['Loot tras muerte', '30 min'], ['Loot tirado', '10 min'], ['Consumo comida domando', 'x0.4']],
    featureList: ['Ubicación en mapa', 'Boost velocidad voladores', 'Transferencia entre mapas', 'Números de daño', 'Tercera persona', 'Gamma permitida', 'Recogida infinita', 'Auto-lock de estructuras'] },
  rules: { label: 'Normativa', title: 'Reglas del servidor', sub: 'Jugar en RaidOrDie implica aceptar estas reglas. El staff puede modificarlas sin previo aviso.',
    warnTitle: 'Sistema de avisos', warnText: 'Los avisos son orientativos, no una cuenta atrás. El staff puede aplicar baneo permanente sin aviso previo en casos graves.',
    sections: [
      { title: 'Reglas generales', items: ['Prohibido usar cheats, macros o programas externos.', 'Prohibido duplicar objetos o abusar de bugs/exploits.', 'Prohibido el comercio con dinero real fuera de la tienda oficial.', 'Prohibido mesh building o construir bajo el mapa.', 'Una cuenta por persona; prohibido compartir cuentas.', 'Respeta a staff y jugadores en el chat global.'] },
      { title: 'Reglas PvP', items: ['No se permiten alianzas entre tribus.', 'Máximo 2 bases grandes por tribu y mapa.', 'Prohibido bloquear cuevas, artefactos o spawns de recursos.', 'Prohibido construir en zonas de jefes u obelisco.', 'Raids permitidas 24/7 salvo eventos anunciados.'] },
      { title: 'Reglas de Discord', items: ['Nada de spam ni publicidad.', 'Sin contenido NSFW ni ofensivo.', 'Usa los canales correctos para tickets.'] },
    ] },
  vote: { label: 'Apoya al servidor', title: 'Votar', sub: 'Vota en las listas de servidores: los VotePoints se acreditan automáticamente y los mejores votantes ganan premios al final de temporada.',
    perVote: 'pts por voto · cada 24 h', btn: 'Votar', done: 'Ya votaste hoy', top: 'Top votantes del mes' },
  polls: { label: 'La voz del jugador', title: 'Encuestas', sub: 'Un voto por cuenta. Puedes cambiar tu respuesta mientras la encuesta esté abierta.',
    list: [{ q: '¿Próximo evento del fin de semana?', o: ['Breeding x2', 'Harvest x3', 'Torneo PvP'] }, { q: '¿Añadimos el mapa Aquatica?', o: ['Sí', 'No'] }] },
  invite: { label: 'Mejor juntos', title: 'Invita a un amigo', steps: [
    ['Comparte tu código', 'Tu amigo lo introduce en 7 días y recibe 100 pts al entrar por primera vez.'],
    ['Gana con sus recargas', 'Recibes el 5% de cada recarga de tu amigo durante 90 días.'],
    ['Bono por actividad', 'Cuando tu amigo juegue 25 horas, recibes 200 pts más.'],
  ] },
}

const ru = {
  nav: { servers: 'Серверы', shop: 'Магазин', ranking: 'Рейтинг', info: 'О сервере', rules: 'Правила', vote: 'Голосовать', invite: 'Пригласить', polls: 'Опросы' },
  common: { online: 'онлайн', offline: 'Оффлайн', connect: 'Подключиться', copied: 'Скопировано', copy: 'Копировать', votes: 'голосов', search: 'Поиск предмета…', all: 'Все', members: 'участников' },
  auth: {
    login: 'Войти через Steam', logout: 'Выйти', required: 'Требуется вход через Steam',
    requiredText: 'Чтобы пользоваться этим, подключите аккаунт Steam. Так покупки, голоса и награды привязываются к вашему персонажу в игре.',
    error: 'Не удалось войти через Steam. Попробуйте ещё раз.',
  },
  footer: 'неофициальный сервер',
  home: {
    badge: 'ARK: Survival Evolved · PvP-кластер · 12 карт',
    tagline: 'PvP-сервер ARK — рейди или умри. Доминируй, строй и разрушай в самом диком кластере.',
    play: 'Играть', maps: 'Карт', weeks: 'Недели', perMap: 'на карту', prizes: 'в призах', cluster: 'в кластере', release: 'Запуск', live: 'Сервер открыт', cd: ['Дней', 'Часов', 'Мин', 'Сек'], xp: 'Опыт', taming: 'Приручение',
    whyLabel: 'Почему RaidOrDie', whyTitle: 'Создан для PvP', whySub: 'Повышенные рейты, свободные переносы и сообщество без пощады.',
    features: [
      ['Кластер из 12 карт', 'Переносите персонажа, дино и предметы между всеми картами.'],
      ['Честные PvP-правила', 'Рейды 24/7, без альянсов, активная администрация.'],
      ['Мгновенная доставка', 'Купленное в магазине появляется в игре за секунды.'],
      ['Удобная оплата', 'Карта и крипта, бонус для новых игроков.'],
    ],
    rates: 'Рейты', shop: 'Магазин', shopText: 'VIP, дино, киты и ресурсы. Автоматическая выдача в игре.', shopCta: 'Открыть магазин',
    steamTitle: 'Подключите Steam', steamText: 'Войдите через Steam, чтобы покупать, голосовать, участвовать в опросах и получить код приглашения.',
    faqTitle: 'Частые вопросы',
    faq: [
      ['Что такое RaidOrDie?', 'PvP-кластер ARK из 12 карт с повышенными рейтами и честными правилами.'],
      ['Как подключиться?', 'Найдите «RaidOrDie» в списке неофициальных серверов ARK или нажмите «Подключиться» на странице серверов.'],
      ['Это бесплатно?', 'Да. Магазин необязателен и лишь ускоряет прогресс.'],
      ['Как купить в магазине?', 'Войдите через Steam, получите очки (pts) пополнением или голосованием, выберите предмет — он придёт в игру за секунды.'],
      ['Можно переносить дино между картами?', 'Да: персонажи, дино и предметы переносятся по всему кластеру.'],
      ['Бывают вайпы?', 'Сезоны заранее объявляются в Discord.'],
    ],
  },
  servers: { label: 'Кластер', title: 'Серверы', sub: 'Карты кластера и текущая загрузка. Кроссплей на всех картах.', players: 'Игроков онлайн' },
  shop: { label: 'Магазин', title: 'Магазин RaidOrDie', sub: 'Дино, оружие, ресурсы и киты. Выберите предмет — он придёт в игру за секунды.', items: 'предмет(ов)', clear: 'Очистить', buy: 'Купить', checkout: 'Подключите здесь платёжный шлюз / систему очков.',
    cats: { VIP: 'VIP', Dinos: 'Дино', Weapons: 'Оружие', Saddles: 'Сёдла', Resources: 'Ресурсы', Structures: 'Постройки', Kits: 'Киты' }, days: '30 дней' },
  ranking: { label: 'Статистика', title: 'Рейтинг', sub: 'Лучшие игроки и племена сезона. Обновляется несколько раз в час.', kills: 'Убийства', deaths: 'Смерти', tribes: 'Племена' },
  info: { label: 'О нас', title: 'О сервере', sub: 'Неофициальный кластер ARK с упором на честную игру и продуманные бусты.',
    rates: 'Рейты', levels: 'Уровни дино', limits: 'Лимиты', timings: 'Тайминги', features: 'Особенности',
    rateNames: ['Опыт', 'Приручение', 'Сбор', 'Взросление', 'Вес дино', 'Инкубация', 'Дропы', 'Рыбалка'],
    levelNames: ['Дикие', 'Тек', 'Яйца'], limitNames: ['Уровень игрока', 'Размер племени', 'Карт'],
    timingRows: [['Лут после смерти', '30 мин'], ['Выброшенный лут', '10 мин'], ['Расход еды при приручении', 'x0.4']],
    featureList: ['Позиция на карте', 'Ускорение летунов', 'Перенос между картами', 'Цифры урона', 'Вид от третьего лица', 'Гамма разрешена', 'Бесконечный подбор', 'Автозамок построек'] },
  rules: { label: 'Регламент', title: 'Правила сервера', sub: 'Играя на RaidOrDie, вы принимаете эти правила. Администрация может менять их без предупреждения.',
    warnTitle: 'Система предупреждений', warnText: 'Предупреждения — ориентир, а не обратный отсчёт. В серьёзных случаях возможен перманентный бан без предупреждения.',
    sections: [
      { title: 'Общие правила', items: ['Запрещены читы, макросы и сторонние программы.', 'Запрещены дюпы и использование багов/эксплойтов.', 'Запрещена торговля за реальные деньги вне официального магазина.', 'Запрещён меш-билдинг и стройка под картой.', 'Один аккаунт на человека; передача аккаунтов запрещена.', 'Уважайте администрацию и игроков в общем чате.'] },
      { title: 'PvP-правила', items: ['Альянсы между племенами запрещены.', 'Не более 2 больших баз на племя на карте.', 'Нельзя блокировать пещеры, артефакты и спавны ресурсов.', 'Нельзя строить в зонах боссов и обелисков.', 'Рейды разрешены 24/7, кроме объявленных ивентов.'] },
      { title: 'Правила Discord', items: ['Без спама и рекламы.', 'Без NSFW и оскорбительного контента.', 'Используйте правильные каналы для тикетов.'] },
    ] },
  vote: { label: 'Поддержите сервер', title: 'Голосование', sub: 'Голосуйте в топах серверов: VotePoints начисляются автоматически, а лучшие получают награды в конце сезона.',
    perVote: 'pts за голос · раз в 24 ч', btn: 'Голосовать', done: 'Вы уже голосовали сегодня', top: 'Лучшие голосующие месяца' },
  polls: { label: 'Голос игроков', title: 'Опросы', sub: 'Один голос на аккаунт. Ответ можно изменить, пока опрос открыт.',
    list: [{ q: 'Ивент на следующие выходные?', o: ['Разведение x2', 'Сбор x3', 'PvP-турнир'] }, { q: 'Добавить карту Aquatica?', o: ['Да', 'Нет'] }] },
  invite: { label: 'Вместе веселее', title: 'Пригласи друга', steps: [
    ['Поделитесь кодом', 'Друг вводит его в течение 7 дней и получает 100 pts при первом входе.'],
    ['Доход с пополнений', 'Вы получаете 5% с каждого пополнения друга в течение 90 дней.'],
    ['Бонус за активность', 'Когда друг наиграет 25 часов, вы получите ещё 200 pts.'],
  ] },
}

const DICTS = { en, es, ru }
const Ctx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('rod-lang') || 'en' } catch { return 'en' } })
  useEffect(() => { document.documentElement.lang = lang; try { localStorage.setItem('rod-lang', lang) } catch {} }, [lang])
  return <Ctx.Provider value={{ lang, setLang, t: DICTS[lang] || en }}>{children}</Ctx.Provider>
}
export const useLang = () => useContext(Ctx)
