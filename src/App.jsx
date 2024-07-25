import React, { useState } from 'react';
import './App.css';
import Papa from 'papaparse';

let pokeList = [['1', 'bulbasaur'], ['2', 'ivysaur'], ['3', 'venusaur'], ['4', 'charmander'], ['5', 'charmeleon'], ['6', 'charizard'], ['7', 'squirtle'], ['8', 'wartortle'], ['9', 'blastoise'], ['10', 'caterpie'], ['11', 'metapod'], ['12', 'butterfree'], ['13', 'weedle'], ['14', 'kakuna'], ['15', 'beedrill'], ['16', 'pidgey'], ['17', 'pidgeotto'], ['18', 'pidgeot'], ['19', 'rattata'], ['20', 'raticate'], ['21', 'spearow'], ['22', 'fearow'], ['23', 'ekans'], ['24', 'arbok'], ['25', 'pikachu'], ['26', 'raichu'], ['27', 'sandshrew'], ['28', 'sandslash'], ['29', 'nidoran-f'], ['30', 'nidorina'], ['31', 'nidoqueen'], ['32', 'nidoran-m'], ['33', 'nidorino'], ['34', 'nidoking'], ['35', 'clefairy'], ['36', 'clefable'], ['37', 'vulpix'], ['38', 'ninetales'], ['39', 'jigglypuff'], ['40', 'wigglytuff'], ['41', 'zubat'], ['42', 'golbat'], ['43', 'oddish'], ['44', 'gloom'], ['45', 'vileplume'], ['46', 'paras'], ['47', 'parasect'], ['48', 'venonat'], ['49', 'venomoth'], ['50', 'diglett'], ['51', 'dugtrio'], ['52', 'meowth'], ['53', 'persian'], ['54', 'psyduck'], ['55', 'golduck'], ['56', 'mankey'], ['57', 'primeape'], ['58', 'growlithe'], ['59', 'arcanine'], ['60', 'poliwag'], ['61', 'poliwhirl'], ['62', 'poliwrath'], ['63', 'abra'], ['64', 'kadabra'], ['65', 'alakazam'], ['66', 'machop'], ['67', 'machoke'], ['68', 'machamp'], ['69', 'bellsprout'], ['70', 'weepinbell'], ['71', 'victreebel'], ['72', 'tentacool'], ['73', 'tentacruel'], ['74', 'geodude'], ['75', 'graveler'], ['76', 'golem'], ['77', 'ponyta'], ['78', 'rapidash'], ['79', 'slowpoke'], ['80', 'slowbro'], ['81', 'magnemite'], ['82', 'magneton'], ['83', 'farfetchd'], ['84', 'doduo'], ['85', 'dodrio'], ['86', 'seel'], ['87', 'dewgong'], ['88', 'grimer'], ['89', 'muk'], ['90', 'shellder'], ['91', 'cloyster'], ['92', 'gastly'], ['93', 'haunter'], ['94', 'gengar'], ['95', 'onix'], ['96', 'drowzee'], ['97', 'hypno'], ['98', 'krabby'], ['99', 'kingler'], ['100', 'voltorb'], ['101', 'electrode'], ['102', 'exeggcute'], ['103', 'exeggutor'], ['104', 'cubone'], ['105', 'marowak'], ['106', 'hitmonlee'], ['107', 'hitmonchan'], ['108', 'lickitung'], ['109', 'koffing'], ['110', 'weezing'], ['111', 'rhyhorn'], ['112', 'rhydon'], ['113', 'chansey'], ['114', 'tangela'], ['115', 'kangaskhan'], ['116', 'horsea'], ['117', 'seadra'], ['118', 'goldeen'], ['119', 'seaking'], ['120', 'staryu'], ['121', 'starmie'], ['122', 'mr-mime'], ['123', 'scyther'], ['124', 'jynx'], ['125', 'electabuzz'], ['126', 'magmar'], ['127', 'pinsir'], ['128', 'tauros'], ['129', 'magikarp'], ['130', 'gyarados'], ['131', 'lapras'], ['132', 'ditto'], ['133', 'eevee'], ['134', 'vaporeon'], ['135', 'jolteon'], ['136', 'flareon'], ['137', 'porygon'], ['138', 'omanyte'], ['139', 'omastar'], ['140', 'kabuto'], ['141', 'kabutops'], ['142', 'aerodactyl'], ['143', 'snorlax'], ['144', 'articuno'], ['145', 'zapdos'], ['146', 'moltres'], ['147', 'dratini'], ['148', 'dragonair'], ['149', 'dragonite'], ['150', 'mewtwo'], ['151', 'mew'], ['152', 'chikorita'], ['153', 'bayleef'], ['154', 'meganium'], ['155', 'cyndaquil'], ['156', 'quilava'], ['157', 'typhlosion'], ['158', 'totodile'], ['159', 'croconaw'], ['160', 'feraligatr'], ['161', 'sentret'], ['162', 'furret'], ['163', 'hoothoot'], ['164', 'noctowl'], ['165', 'ledyba'], ['166', 'ledian'], ['167', 'spinarak'], ['168', 'ariados'], ['169', 'crobat'], ['170', 'chinchou'], ['171', 'lanturn'], ['172', 'pichu'], ['173', 'cleffa'], ['174', 'igglybuff'], ['175', 'togepi'], ['176', 'togetic'], ['177', 'natu'], ['178', 'xatu'], ['179', 'mareep'], ['180', 'flaaffy'], ['181', 'ampharos'], ['182', 'bellossom'], ['183', 'marill'], ['184', 'azumarill'], ['185', 'sudowoodo'], ['186', 'politoed'], ['187', 'hoppip'], ['188', 'skiploom'], ['189', 'jumpluff'], ['190', 'aipom'], ['191', 'sunkern'], ['192', 'sunflora'], ['193', 'yanma'], ['194', 'wooper'], ['195', 'quagsire'], ['196', 'espeon'], ['197', 'umbreon'], ['198', 'murkrow'], ['199', 'slowking'], ['200', 'misdreavus'], ['201', 'unown'], ['202', 'wobbuffet'], ['203', 'girafarig'], ['204', 'pineco'], ['205', 'forretress'], ['206', 'dunsparce'], ['207', 'gligar'], ['208', 'steelix'], ['209', 'snubbull'], ['210', 'granbull'], ['211', 'qwilfish'], ['212', 'scizor'], ['213', 'shuckle'], ['214', 'heracross'], ['215', 'sneasel'], ['216', 'teddiursa'], ['217', 'ursaring'], ['218', 'slugma'], ['219', 'magcargo'], ['220', 'swinub'], ['221', 'piloswine'], ['222', 'corsola'], ['223', 'remoraid'], ['224', 'octillery'], ['225', 'delibird'], ['226', 'mantine'], ['227', 'skarmory'], ['228', 'houndour'], ['229', 'houndoom'], ['230', 'kingdra'], ['231', 'phanpy'], ['232', 'donphan'], ['233', 'porygon2'], ['234', 'stantler'], ['235', 'smeargle'], ['236', 'tyrogue'], ['237', 'hitmontop'], ['238', 'smoochum'], ['239', 'elekid'], ['240', 'magby'], ['241', 'miltank'], ['242', 'blissey'], ['243', 'raikou'], ['244', 'entei'], ['245', 'suicune'], ['246', 'larvitar'], ['247', 'pupitar'], ['248', 'tyranitar'], ['249', 'lugia'], ['250', 'ho-oh'], ['251', 'celebi'], ['252', 'treecko'], ['253', 'grovyle'], ['254', 'sceptile'], ['255', 'torchic'], ['256', 'combusken'], ['257', 'blaziken'], ['258', 'mudkip'], ['259', 'marshtomp'], ['260', 'swampert'], ['261', 'poochyena'], ['262', 'mightyena'], ['263', 'zigzagoon'], ['264', 'linoone'], ['265', 'wurmple'], ['266', 'silcoon'], ['267', 'beautifly'], ['268', 'cascoon'], ['269', 'dustox'], ['270', 'lotad'], ['271', 'lombre'], ['272', 'ludicolo'], ['273', 'seedot'], ['274', 'nuzleaf'], ['275', 'shiftry'], ['276', 'taillow'], ['277', 'swellow'], ['278', 'wingull'], ['279', 'pelipper'], ['280', 'ralts'], ['281', 'kirlia'], ['282', 'gardevoir'], ['283', 'surskit'], ['284', 'masquerain'], ['285', 'shroomish'], ['286', 'breloom'], ['287', 'slakoth'], ['288', 'vigoroth'], ['289', 'slaking'], ['290', 'nincada'], ['291', 'ninjask'], ['292', 'shedinja'], ['293', 'whismur'], ['294', 'loudred'], ['295', 'exploud'], ['296', 'makuhita'], ['297', 'hariyama'], ['298', 'azurill'], ['299', 'nosepass'], ['300', 'skitty'], ['301', 'delcatty'], ['302', 'sableye'], ['303', 'mawile'], ['304', 'aron'], ['305', 'lairon'], ['306', 'aggron'], ['307', 'meditite'], ['308', 'medicham'], ['309', 'electrike'], ['310', 'manectric'], ['311', 'plusle'], ['312', 'minun'], ['313', 'volbeat'], ['314', 'illumise'], ['315', 'roselia'], ['316', 'gulpin'], ['317', 'swalot'], ['318', 'carvanha'], ['319', 'sharpedo'], ['320', 'wailmer'], ['321', 'wailord'], ['322', 'numel'], ['323', 'camerupt'], ['324', 'torkoal'], ['325', 'spoink'], ['326', 'grumpig'], ['327', 'spinda'], ['328', 'trapinch'], ['329', 'vibrava'], ['330', 'flygon'], ['331', 'cacnea'], ['332', 'cacturne'], ['333', 'swablu'], ['334', 'altaria'], ['335', 'zangoose'], ['336', 'seviper'], ['337', 'lunatone'], ['338', 'solrock'], ['339', 'barboach'], ['340', 'whiscash'], ['341', 'corphish'], ['342', 'crawdaunt'], ['343', 'baltoy'], ['344', 'claydol'], ['345', 'lileep'], ['346', 'cradily'], ['347', 'anorith'], ['348', 'armaldo'], ['349', 'feebas'], ['350', 'milotic'], ['351', 'castform'], ['352', 'kecleon'], ['353', 'shuppet'], ['354', 'banette'], ['355', 'duskull'], ['356', 'dusclops'], ['357', 'tropius'], ['358', 'chimecho'], ['359', 'absol'], ['360', 'wynaut'], ['361', 'snorunt'], ['362', 'glalie'], ['363', 'spheal'], ['364', 'sealeo'], ['365', 'walrein'], ['366', 'clamperl'], ['367', 'huntail'], ['368', 'gorebyss'], ['369', 'relicanth'], ['370', 'luvdisc'], ['371', 'bagon'], ['372', 'shelgon'], ['373', 'salamence'], ['374', 'beldum'], ['375', 'metang'], ['376', 'metagross'], ['377', 'regirock'], ['378', 'regice'], ['379', 'registeel'], ['380', 'latias'], ['381', 'latios'], ['382', 'kyogre'], ['383', 'groudon'], ['384', 'rayquaza'], ['385', 'jirachi'], ['386', 'deoxys (Normal)'], ['387', 'turtwig'], ['388', 'grotle'], ['389', 'torterra'], ['390', 'chimchar'], ['391', 'monferno'], ['392', 'infernape'], ['393', 'piplup'], ['394', 'prinplup'], ['395', 'empoleon'], ['396', 'starly'], ['397', 'staravia'], ['398', 'staraptor'], ['399', 'bidoof'], ['400', 'bibarel'], ['401', 'kricketot'], ['402', 'kricketune'], ['403', 'shinx'], ['404', 'luxio'], ['405', 'luxray'], ['406', 'budew'], ['407', 'roserade'], ['408', 'cranidos'], ['409', 'rampardos'], ['410', 'shieldon'], ['411', 'bastiodon'], ['412', 'burmy'], ['413', 'wormadam (Plant)'], ['414', 'mothim'], ['415', 'combee'], ['416', 'vespiquen'], ['417', 'pachirisu'], ['418', 'buizel'], ['419', 'floatzel'], ['420', 'cherubi'], ['421', 'cherrim'], ['422', 'shellos'], ['423', 'gastrodon'], ['424', 'ambipom'], ['425', 'drifloon'], ['426', 'drifblim'], ['427', 'buneary'], ['428', 'lopunny'], ['429', 'mismagius'], ['430', 'honchkrow'], ['431', 'glameow'], ['432', 'purugly'], ['433', 'chingling'], ['434', 'stunky'], ['435', 'skuntank'], ['436', 'bronzor'], ['437', 'bronzong'], ['438', 'bonsly'], ['439', 'mime-jr'], ['440', 'happiny'], ['441', 'chatot'], ['442', 'spiritomb'], ['443', 'gible'], ['444', 'gabite'], ['445', 'garchomp'], ['446', 'munchlax'], ['447', 'riolu'], ['448', 'lucario'], ['449', 'hippopotas'], ['450', 'hippowdon'], ['451', 'skorupi'], ['452', 'drapion'], ['453', 'croagunk'], ['454', 'toxicroak'], ['455', 'carnivine'], ['456', 'finneon'], ['457', 'lumineon'], ['458', 'mantyke'], ['459', 'snover'], ['460', 'abomasnow'], ['461', 'weavile'], ['462', 'magnezone'], ['463', 'lickilicky'], ['464', 'rhyperior'], ['465', 'tangrowth'], ['466', 'electivire'], ['467', 'magmortar'], ['468', 'togekiss'], ['469', 'yanmega'], ['470', 'leafeon'], ['471', 'glaceon'], ['472', 'gliscor'], ['473', 'mamoswine'], ['474', 'porygon-z'], ['475', 'gallade'], ['476', 'probopass'], ['477', 'dusknoir'], ['478', 'froslass'], ['479', 'rotom'], ['480', 'uxie'], ['481', 'mesprit'], ['482', 'azelf'], ['483', 'dialga'], ['484', 'palkia'], ['485', 'heatran'], ['486', 'regigigas'], ['487', 'giratina (Altered)'], ['488', 'cresselia'], ['489', 'phione'], ['490', 'manaphy'], ['491', 'darkrai'], ['492', 'shaymin (Land)'], ['493', 'arceus'], ['494', 'victini'], ['495', 'snivy'], ['496', 'servine'], ['497', 'serperior'], ['498', 'tepig'], ['499', 'pignite'], ['500', 'emboar'], ['501', 'oshawott'], ['502', 'dewott'], ['503', 'samurott'], ['504', 'patrat'], ['505', 'watchog'], ['506', 'lillipup'], ['507', 'herdier'], ['508', 'stoutland'], ['509', 'purrloin'], ['510', 'liepard'], ['511', 'pansage'], ['512', 'simisage'], ['513', 'pansear'], ['514', 'simisear'], ['515', 'panpour'], ['516', 'simipour'], ['517', 'munna'], ['518', 'musharna'], ['519', 'pidove'], ['520', 'tranquill'], ['521', 'unfezant'], ['522', 'blitzle'], ['523', 'zebstrika'], ['524', 'roggenrola'], ['525', 'boldore'], ['526', 'gigalith'], ['527', 'woobat'], ['528', 'swoobat'], ['529', 'drilbur'], ['530', 'excadrill'], ['531', 'audino'], ['532', 'timburr'], ['533', 'gurdurr'], ['534', 'conkeldurr'], ['535', 'tympole'], ['536', 'palpitoad'], ['537', 'seismitoad'], ['538', 'throh'], ['539', 'sawk'], ['540', 'sewaddle'], ['541', 'swadloon'], ['542', 'leavanny'], ['543', 'venipede'], ['544', 'whirlipede'], ['545', 'scolipede'], ['546', 'cottonee'], ['547', 'whimsicott'], ['548', 'petilil'], ['549', 'lilligant'], ['550', 'basculin-red-striped'],['551', 'sandile'], ['552', 'krokorok'], ['553', 'krookodile'], ['554', 'darumaka'], ['555', 'darmanitan (Standard)'], ['556', 'maractus'], ['557', 'dwebble'], ['558', 'crustle'], ['559', 'scraggy'], ['560', 'scrafty'], ['561', 'sigilyph'], ['562', 'yamask'], ['563', 'cofagrigus'], ['564', 'tirtouga'], ['565', 'carracosta'], ['566', 'archen'], ['567', 'archeops'], ['568', 'trubbish'], ['569', 'garbodor'], ['570', 'zorua'], ['571', 'zoroark'], ['572', 'minccino'], ['573', 'cinccino'], ['574', 'gothita'], ['575', 'gothorita'], ['576', 'gothitelle'], ['577', 'solosis'], ['578', 'duosion'], ['579', 'reuniclus'], ['580', 'ducklett'], ['581', 'swanna'], ['582', 'vanillite'], ['583', 'vanillish'], ['584', 'vanilluxe'], ['585', 'deerling'], ['586', 'sawsbuck'], ['587', 'emolga'], ['588', 'karrablast'], ['589', 'escavalier'], ['590', 'foongus'], ['591', 'amoonguss'], ['592', 'frillish'], ['593', 'jellicent'], ['594', 'alomomola'], ['595', 'joltik'], ['596', 'galvantula'], ['597', 'ferroseed'], ['598', 'ferrothorn'], ['599', 'klink'], ['600', 'klang'], ['601', 'klinklang'], ['602', 'tynamo'], ['603', 'eelektrik'], ['604', 'eelektross'], ['605', 'elgyem'], ['606', 'beheeyem'], ['607', 'litwick'], ['608', 'lampent'], ['609', 'chandelure'], ['610', 'axew'], ['611', 'fraxure'], ['612', 'haxorus'], ['613', 'cubchoo'], ['614', 'beartic'], ['615', 'cryogonal'], ['616', 'shelmet'], ['617', 'accelgor'], ['618', 'stunfisk'], ['619', 'mienfoo'], ['620', 'mienshao'], ['621', 'druddigon'], ['622', 'golett'], ['623', 'golurk'], ['624', 'pawniard'], ['625', 'bisharp'], ['626', 'bouffalant'], ['627', 'rufflet'], ['628', 'braviary'], ['629', 'vullaby'], ['630', 'mandibuzz'], ['631', 'heatmor'], ['632', 'durant'], ['633', 'deino'], ['634', 'zweilous'], ['635', 'hydreigon'], ['636', 'larvesta'], ['637', 'volcarona'], ['638', 'cobalion'], ['639', 'terrakion'], ['640', 'virizion'], ['641', 'tornadus (Incarnate)'], ['642', 'thundurus (Incarnate)'], ['643', 'reshiram'], ['644', 'zekrom'], ['645', 'landorus (Incarnate)'], ['646', 'kyurem'], ['647', 'keldeo (Ordinary)'], ['648', 'meloetta-aria'], ['649', 'genesect'], ['650', 'chespin'], ['651', 'quilladin'], ['652', 'chesnaught'], ['653', 'fennekin'], ['654', 'braixen'], ['655', 'delphox'], ['656', 'froakie'], ['657', 'frogadier'], ['658', 'greninja'], ['659', 'bunnelby'], ['660', 'diggersby'], ['661', 'fletchling'], ['662', 'fletchinder'], ['663', 'talonflame'], ['664', 'scatterbug'], ['665', 'spewpa'], ['666', 'vivillon'], ['667', 'litleo'], ['668', 'pyroar'], ['669', 'flabebe'], ['670', 'floette'], ['671', 'florges'], ['672', 'skiddo'], ['673', 'gogoat'], ['674', 'pancham'], ['675', 'pangoro'], ['676', 'furfrou'], ['677', 'espurr'], ['678', 'meowstic (Male)'], ['679', 'honedge'], ['680', 'doublade'], ['681', 'aegislash (Shield)'], ['682', 'spritzee'], ['683', 'aromatisse'], ['684', 'swirlix'], ['685', 'slurpuff'], ['686', 'inkay'], ['687', 'malamar'], ['688', 'binacle'], ['689', 'barbaracle'], ['690', 'skrelp'], ['691', 'dragalge'], ['692', 'clauncher'], ['693', 'clawitzer'], ['694', 'helioptile'], ['695', 'heliolisk'], ['696', 'tyrunt'], ['697', 'tyrantrum'], ['698', 'amaura'], ['699', 'aurorus'], ['700', 'sylveon'], ['701', 'hawlucha'], ['702', 'dedenne'], ['703', 'carbink'], ['704', 'goomy'], ['705', 'sliggoo'], ['706', 'goodra'], ['707', 'klefki'], ['708', 'phantump'], ['709', 'trevenant'], ['710', 'pumpkaboo (Average)'], ['711', 'gourgeist (Average)'], ['712', 'bergmite'], ['713', 'avalugg'], ['714', 'noibat'], ['715', 'noivern'], ['716', 'xerneas'], ['717', 'yveltal'], ['718', 'zygarde (50% Forme)'], ['719', 'diancie'], ['720', 'hoopa'], ['721', 'volcanion'], ['722', 'rowlet'], ['723', 'dartrix'], ['724', 'decidueye'], ['725', 'litten'], ['726', 'torracat'], ['727', 'incineroar'], ['728', 'popplio'], ['729', 'brionne'], ['730', 'primarina'], ['731', 'pikipek'], ['732', 'trumbeak'], ['733', 'toucannon'], ['734', 'yungoos'], ['735', 'gumshoos'], ['736', 'grubbin'], ['737', 'charjabug'], ['738', 'vikavolt'], ['739', 'crabrawler'], ['740', 'crabominable'], ['741', 'oricorio-baile'], ['742', 'cutiefly'], ['743', 'ribombee'], ['744', 'rockruff'], ['745', 'lycanroc-midday'], ['746', 'wishiwashi-solo'], ['747', 'mareanie'], ['748', 'toxapex'], ['749', 'mudbray'], ['750', 'mudsdale'], ['751', 'dewpider'], ['752', 'araquanid'], ['753', 'fomantis'], ['754', 'lurantis'], ['755', 'morelull'], ['756', 'shiinotic'], ['757', 'salandit'], ['758', 'salazzle'], ['759', 'stufful'], ['760', 'bewear'], ['761', 'bounsweet'], ['762', 'steenee'], ['763', 'tsareena'], ['764', 'comfey'], ['765', 'oranguru'], ['766', 'passimian'], ['767', 'wimpod'], ['768', 'golisopod'], ['769', 'sandygast'], ['770', 'palossand'], ['771', 'pyukumuku'], ['772', 'type-null'], ['773', 'silvally'], ['774', 'minior-red-meteor'], ['775', 'komala'], ['776', 'turtonator'], ['777', 'togedemaru'], ['778', 'mimikyu-disguised'], ['779', 'bruxish'], ['780', 'drampa'], ['781', 'dhelmise'], ['782', 'jangmo-o'], ['783', 'hakamo-o'], ['784', 'kommo-o'], ['785', 'tapu koko'], ['786', 'tapu lele'], ['787', 'tapu bulu'], ['788', 'tapu fini'], ['789', 'cosmog'], ['790', 'cosmoem'], ['791', 'solgaleo'], ['792', 'lunala'], ['793', 'nihilego'], ['794', 'buzzwole'], ['795', 'pheromosa'], ['796', 'xurkitree'], ['797', 'celesteela'], ['798', 'kartana'], ['799', 'guzzlord'], ['800', 'necrozma'], ['801', 'magearna'], ['802', 'marshadow'], ['803', 'poipole'], ['804', 'naganadel'], ['805', 'stakataka'], ['806', 'blacephalon'], ['807', 'zeraora'], ['808', 'meltan'], ['809', 'melmetal'], ['810', 'grookey'], ['811', 'thwackey'], ['812', 'rillaboom'], ['813', 'scorbunny'], ['814', 'raboot'], ['815', 'cinderace'], ['816', 'sobble'], ['817', 'drizzile'], ['818', 'inteleon'], ['819', 'skwovet'], ['820', 'greedent'], ['821', 'rookidee'], ['822', 'corvisquire'], ['823', 'corviknight'], ['824', 'blipbug'], ['825', 'dottler'], ['826', 'orbeetle'], ['827', 'nickit'], ['828', 'thievul'], ['829', 'gossifleur'], ['830', 'eldegoss'], ['831', 'wooloo'], ['832', 'dubwool'], ['833', 'chewtle'], ['834', 'drednaw'], ['835', 'yamper'], ['836', 'boltund'], ['837', 'rolycoly'], ['838', 'carkol'], ['839', 'coalossal'], ['840', 'applin'], ['841', 'flapple'], ['842', 'appletun'], ['843', 'silicobra'], ['844', 'sandaconda'], ['845', 'cramorant'], ['846', 'arrokuda'], ['847', 'barraskewda'], ['848', 'toxel'], ['849', 'toxtricity-amped'], ['850', 'sizzlipede'], ['851', 'centiskorch'], ['852', 'clobbopus'], ['853', 'grapploct'], ['854', 'sinistea'], ['855', 'polteageist'], ['856', 'hatenna'], ['857', 'hattrem'], ['858', 'hatterene'], ['859', 'impidimp'], ['860', 'morgrem'], ['861', 'grimmsnarl'], ['862', 'obstagoon'], ['863', 'perrserker'], ['864', 'cursola'], ['865', 'sirfetchd'], ['866', 'mr-rime'], ['867', 'runerigus'], ['868', 'milcery'], ['869', 'alcremie'], ['870', 'falinks'], ['871', 'pincurchin'], ['872', 'snom'], ['873', 'frosmoth'], ['874', 'stonjourner'], ['875', 'eiscue-ice'], ['876', 'indeedee (Male)'], ['877', 'morpeko-full-belly'], ['878', 'cufant'], ['879', 'copperajah'], ['880', 'dracozolt'], ['881', 'arctozolt'], ['882', 'dracovish'], ['883', 'arctovish'], ['884', 'duraludon'], ['885', 'dreepy'], ['886', 'drakloak'], ['887', 'dragapult'], ['888', 'zacian'], ['889', 'zamazenta'], ['890', 'eternatus'], ['891', 'kubfu'], ['892', 'urshifu-single-strike'], ['893', 'zarude'], ['894', 'regieleki'], ['895', 'regidrago'], ['896', 'glastrier'], ['897', 'spectrier'], ['898', 'calyrex'], ['899', 'wyrdeer'], ['900', 'kleavor'], ['901', 'ursaluna'], ['902', 'basculegion (Male)'], ['903', 'sneasler'], ['904', 'overqwil'], ['905', 'enamorus (Incarnate)'], ['906', 'sprigatito'], ['907', 'floragato'], ['908', 'meowscarada'], ['909', 'fuecoco'], ['910', 'crocalor'], ['911', 'skeledirge'], ['912', 'quaxly'], ['913', 'quaxwell'], ['914', 'quaquaval'], ['915', 'lechonk'], ['916', 'oinkologne'], ['917', 'tarountula'], ['918', 'spidops'], ['919', 'nymble'], ['920', 'lokix'], ['921', 'pawmi'], ['922', 'pawmo'], ['923', 'pawmot'], ['924', 'tandemaus'], ['925', 'maushold'], ['926', 'fidough'], ['927', 'dachsbun'], ['928', 'smoliv'], ['929', 'dolliv'], ['930', 'arboliva'], ['931', 'squawkabilly'], ['932', 'nacli'], ['933', 'naclstack'], ['934', 'garganacl'], ['935', 'charcadet'], ['936', 'armarouge'], ['937', 'ceruledge'], ['938', 'tadbulb'], ['939', 'bellibolt'], ['940', 'wattrel'], ['941', 'kilowattrel'], ['942', 'maschiff'], ['943', 'mabosstiff'], ['944', 'shroodle'], ['945', 'grafaiai'], ['946', 'bramblin'], ['947', 'brambleghast'], ['948', 'toedscool'], ['949', 'toedscruel'], ['950', 'klawf'], ['951', 'capsakid'], ['952', 'scovillain'], ['953', 'rellor'], ['954', 'rabsca'], ['955', 'flittle'], ['956', 'espathra'], ['957', 'tinkatink'], ['958', 'tinkatuff'], ['959', 'tinkaton'], ['960', 'wiglett'], ['961', 'wugtrio'], ['962', 'bombirdier'], ['963', 'finizen'], ['964', 'palafin'], ['965', 'varoom'], ['966', 'revavroom'], ['967', 'cyclizar'], ['968', 'orthworm'], ['969', 'glimmet'], ['970', 'glimmora'], ['971', 'greavard'], ['972', 'houndstone'], ['973', 'flamigo'], ['974', 'cetoddle'], ['975', 'cetitan'], ['976', 'veluza'], ['977', 'dondozo'], ['978', 'tatsugiri'], ['979', 'annihilape'], ['980', 'clodsire'], ['981', 'farigiraf'], ['982', 'dudunsparce'], ['983', 'kingambit'], ['984', 'great-tusk'], ['985', 'scream-tail'], ['986', 'brute-bonnet'], ['987', 'flutter-mane'], ['988', 'slither-wing'], ['989', 'sandy-shocks'], ['990', 'iron-treads'], ['991', 'iron-bundle'], ['992', 'iron-hands'], ['993', 'iron-jugulis'], ['994', 'iron-moth'], ['995', 'iron-thorns'], ['996', 'frigibax'], ['997', 'arctibax'], ['998', 'baxcalibur'], ['999', 'gimmighoul'], ['1000', 'gholdengo'], ['1001', 'wo-chien'], ['1002', 'chien-pao'], ['1003', 'ting-lu'], ['1004', 'chi-yu'], ['1005', 'roaring-moon'], ['1006', 'iron-valiant'], ['1007', 'koraidon'], ['1008', 'miraidon'], ['1009', 'walking-wake'], ['1010', 'iron-leaves'], ['1011', 'dipplin'], ['1012', 'poltchageist'], ['1013', 'sinistcha'], ['1014', 'okidogi'], ['1015', 'munkidori'], ['1016', 'fezandipiti'], ['1017', 'ogerpon'], ['1018', 'archaludon'], ['1019', 'hydrapple'], ['1020', 'gouging-fire'], ['1021', 'raging-bolt'], ['1022', 'iron-boulder'], ['1023', 'iron-crown'], ['1024', 'terapagos'], ['1025', 'pecharunt'], ['10001', 'deoxys-attack'], ['10002', 'deoxys (Defense)'], ['10003', 'deoxys (Speed)'], ['10004', 'wormadam-sandy'], ['10005', 'wormadam-trash'], ['10006', 'shaymin-sky'], ['10007', 'giratina-origin'], ['10008', 'rotom-heat'], ['10009', 'rotom-wash'], ['10010', 'rotom-frost'], ['10011', 'rotom-fan'], ['10012', 'rotom-mow'], ['10013', 'castform-sunny'], ['10014', 'castform-rainy'], ['10015', 'castform-snowy'], ['10016', 'basculin-blue-striped'], ['10017', 'darmanitan-zen'], ['10018', 'meloetta-pirouette'], ['10019', 'tornadus-therian'], ['10020', 'thundurus-therian'], ['10021', 'landorus-therian'], ['10022', 'kyurem-black'], ['10023', 'kyurem-white'], ['10024', 'keldeo-resolute'], ['10025', 'meowstic-female'], ['10026', 'aegislash-blade'], ['10027', 'pumpkaboo-small'], ['10028', 'pumpkaboo-large'], ['10029', 'pumpkaboo-super'], ['10030', 'gourgeist-small'], ['10031', 'gourgeist-large'], ['10032', 'gourgeist-super'], ['10033', 'venusaur-mega'], ['10034', 'charizard-mega-x'], ['10035', 'charizard-mega-y'], ['10036', 'blastoise-mega'], ['10037', 'alakazam-mega'], ['10038', 'gengar-mega'], ['10039', 'kangaskhan-mega'], ['10040', 'pinsir-mega'], ['10041', 'gyarados-mega'], ['10042', 'aerodactyl-mega'], ['10043', 'mewtwo-mega-x'], ['10044', 'mewtwo-mega-y'], ['10045', 'ampharos-mega'], ['10046', 'scizor-mega'], ['10047', 'heracross-mega'], ['10048', 'houndoom-mega'], ['10049', 'tyranitar-mega'], ['10050', 'blaziken-mega'], ['10051', 'gardevoir-mega'], ['10052', 'mawile-mega'], ['10053', 'aggron-mega'], ['10054', 'medicham-mega'], ['10055', 'manectric-mega'], ['10056', 'banette-mega'], ['10057', 'absol-mega'], ['10058', 'garchomp-mega'], ['10059', 'lucario-mega'], ['10060', 'abomasnow-mega'], ['10061', 'floette-eternal'], ['10062', 'latias-mega'], ['10063', 'latios-mega'], ['10064', 'swampert-mega'], ['10065', 'sceptile-mega'], ['10066', 'sableye-mega'], ['10067', 'altaria-mega'], ['10068', 'gallade-mega'], ['10069', 'audino-mega'], ['10070', 'sharpedo-mega'], ['10071', 'slowbro-mega'], ['10072', 'steelix-mega'], ['10073', 'pidgeot-mega'], ['10074', 'glalie-mega'], ['10075', 'diancie-mega'], ['10076', 'metagross-mega'], ['10077', 'kyogre-primal'], ['10078', 'groudon-primal'], ['10079', 'rayquaza-mega'], ['10080', 'pikachu-rock-star'], ['10081', 'pikachu-belle'], ['10082', 'pikachu-pop-star'], ['10083', 'pikachu-phd'], ['10084', 'pikachu-libre'], ['10085', 'pikachu-cosplay'], ['10086', 'hoopa-unbound'], ['10087', 'camerupt-mega'], ['10088', 'lopunny-mega'], ['10089', 'salamence-mega'], ['10090', 'beedrill-mega'], ['10091', 'rattata-alola'], ['10092', 'raticate-alola'], ['10093', 'raticate-totem-alola'], ['10094', 'pikachu-original-cap'], ['10095', 'pikachu-hoenn-cap'], ['10096', 'pikachu-sinnoh-cap'], ['10097', 'pikachu-unova-cap'], ['10098', 'pikachu-kalos-cap'], ['10099', 'pikachu-alola-cap'], ['10100', 'raichu-alola'], ['10101', 'sandshrew-alola'], ['10102', 'sandslash-alola'], ['10103', 'vulpix-alola'], ['10104', 'ninetales-alola'], ['10105', 'diglett-alola'], ['10106', 'dugtrio-alola'], ['10107', 'meowth-alola'], ['10108', 'persian-alola'], ['10109', 'geodude-alola'], ['10110', 'graveler-alola'], ['10111', 'golem-alola'], ['10112', 'grimer-alola'], ['10113', 'muk-alola'], ['10114', 'exeggutor-alola'], ['10115', 'marowak-alola'], ['10116', 'greninja-battle-bond'], ['10117', 'greninja-ash'], ['10118', 'zygarde-10-power-construct'], ['10119', 'zygarde-50-power-construct'], ['10120', 'zygarde (Complete forme)'], ['10121', 'gumshoos-totem'], ['10122', 'vikavolt-totem'], ['10123', 'oricorio-pom-pom'], ['10124', 'oricorio-pau'], ['10125', 'oricorio-sensu'], ['10126', 'lycanroc-midnight'], ['10127', 'wishiwashi-school'], ['10128', 'lurantis-totem'], ['10129', 'salazzle-totem'], ['10130', 'minior-orange-meteor'], ['10131', 'minior-yellow-meteor'], ['10132', 'minior-green-meteor'], ['10133', 'minior-blue-meteor'], ['10134', 'minior-indigo-meteor'], ['10135', 'minior-violet-meteor'], ['10136', 'minior-red'], ['10137', 'minior-orange'], ['10138', 'minior-yellow'], ['10139', 'minior-green'], ['10140', 'minior-blue'], ['10141', 'minior-indigo'], ['10142', 'minior-violet'], ['10143', 'mimikyu-busted'], ['10144', 'mimikyu-totem-disguised'], ['10145', 'mimikyu-totem-busted'], ['10146', 'kommo-o-totem'], ['10147', 'magearna-original'], ['10148', 'pikachu-partner-cap'], ['10149', 'marowak-totem'], ['10150', 'ribombee-totem'], ['10151', 'rockruff-own-tempo'], ['10152', 'lycanroc-dusk'], ['10153', 'araquanid-totem'], ['10154', 'togedemaru-totem'], ['10155', 'necrozma-dusk'], ['10156', 'necrozma-dawn'], ['10157', 'necrozma-ultra'], ['10158', 'pikachu-starter'], ['10159', 'eevee-starter'], ['10160', 'pikachu-world-cap'], ['10161', 'meowth-galar'], ['10162', 'ponyta-galar'], ['10163', 'rapidash-galar'], ['10164', 'slowpoke-galar'], ['10165', 'slowbro-galar'], ['10166', 'farfetchd-galar'], ['10167', 'weezing-galar'], ['10168', 'mr-mime-galar'], ['10169', 'articuno-galar'], ['10170', 'zapdos-galar'], ['10171', 'moltres-galar'], ['10172', 'slowking-galar'], ['10173', 'corsola-galar'], ['10174', 'zigzagoon-galar'], ['10175', 'linoone-galar'], ['10176', 'darumaka-galar'], ['10177', 'darmanitan-galar-standard'], ['10178', 'darmanitan-galar-zen'], ['10179', 'yamask-galar'], ['10180', 'stunfisk-galar'], ['10181', 'zygarde (10$ Forme)'], ['10182', 'cramorant-gulping'], ['10183', 'cramorant-gorging'], ['10184', 'toxtricity-low-key'], ['10185', 'eiscue-noice'], ['10186', 'indeedee-female'], ['10187', 'morpeko-hangry'], ['10188', 'zacian-crowned'], ['10189', 'zamazenta-crowned'], ['10190', 'eternatus-eternamax'], ['10191', 'urshifu-rapid-strike'], ['10192', 'zarude-dada'], ['10193', 'calyrex-ice'], ['10194', 'calyrex-shadow'], ['10195', 'venusaur-gmax'], ['10196', 'charizard-gmax'], ['10197', 'blastoise-gmax'], ['10198', 'butterfree-gmax'], ['10199', 'pikachu-gmax'], ['10200', 'meowth-gmax'], ['10201', 'machamp-gmax'], ['10202', 'gengar-gmax'], ['10203', 'kingler-gmax'], ['10204', 'lapras-gmax'], ['10205', 'eevee-gmax'], ['10206', 'snorlax-gmax'], ['10207', 'garbodor-gmax'], ['10208', 'melmetal-gmax'], ['10209', 'rillaboom-gmax'], ['10210', 'cinderace-gmax'], ['10211', 'inteleon-gmax'], ['10212', 'corviknight-gmax'], ['10213', 'orbeetle-gmax'], ['10214', 'drednaw-gmax'], ['10215', 'coalossal-gmax'], ['10216', 'flapple-gmax'], ['10217', 'appletun-gmax'], ['10218', 'sandaconda-gmax'], ['10219', 'toxtricity-amped-gmax'], ['10220', 'centiskorch-gmax'], ['10221', 'hatterene-gmax'], ['10222', 'grimmsnarl-gmax'], ['10223', 'alcremie-gmax'], ['10224', 'copperajah-gmax'], ['10225', 'duraludon-gmax'], ['10226', 'urshifu-single-strike-gmax'], ['10227', 'urshifu-rapid-strike-gmax'], ['10228', 'toxtricity-low-key-gmax'], ['10229', 'growlithe-hisui'], ['10230', 'arcanine-hisui'], ['10231', 'voltorb-hisui'], ['10232', 'electrode-hisui'], ['10233', 'typhlosion-hisui'], ['10234', 'qwilfish-hisui'], ['10235', 'sneasel-hisui'], ['10236', 'samurott-hisui'], ['10237', 'lilligant-hisui'], ['10238', 'zorua-hisui'], ['10239', 'zoroark-hisui'], ['10240', 'braviary-hisui'], ['10241', 'sliggoo-hisui'], ['10242', 'goodra-hisui'], ['10243', 'avalugg-hisui'], ['10244', 'decidueye-hisui'], ['10245', 'dialga-origin'], ['10246', 'palkia-origin'], ['10247', 'basculin-white-striped'], ['10248', 'basculegion-female'], ['10249', 'enamorus-therian'], ['10250', 'tauros-paldea-combat-breed'], ['10251', 'tauros-paldea-blaze-breed'], ['10252', 'tauros-paldea-aqua-breed'], ['10253', 'wooper-paldea'], ['10254', 'oinkologne-female'], ['10255', 'dudunsparce-three-segment'], ['10256', 'palafin-hero'], ['10257', 'maushold-family-of-three'], ['10258', 'tatsugiri-droopy'], ['10259', 'tatsugiri-stretchy'], ['10260', 'squawkabilly-blue-plumage'], ['10261', 'squawkabilly-yellow-plumage'], ['10262', 'squawkabilly-white-plumage'], ['10263', 'gimmighoul-roaming'], ['10264', 'koraidon-limited-build'], ['10265', 'koraidon-sprinting-build'], ['10266', 'koraidon-swimming-build'], ['10267', 'koraidon-gliding-build'], ['10268', 'miraidon-low-power-mode'], ['10269', 'miraidon-drive-mode'], ['10270', 'miraidon-aquatic-mode'], ['10271', 'miraidon-glide-mode'], ['10272', 'ursaluna-bloodmoon'], ['10273', 'ogerpon-wellspring-mask'], ['10274', 'ogerpon-hearthflame-mask'], ['10275', 'ogerpon-cornerstone-mask'], ['10276', 'terapagos-terastal'], ['10277', 'terapagos-stellar']];

function App() {
    
    const [finalList, setFinalList] = useState([]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: function (results) {
                const data = results.data;
                const names = data.map((row) => row.Pokemon.toLowerCase());

                const filteredList = [];
                
                for (let i = 0; i < names.length; i++) {
                    for (let j = 0; j < pokeList.length; j++) {

                        const index = names[i].indexOf('(');
                        const substringBeforeBrackets = names[i];
                        if (index !== -1) {
                            const substringBeforeBrackets = names[i].substring(0, index);

                        } 


                        if (substringBeforeBrackets.includes(pokeList[j][1].toLowerCase())) {
                            if (names[i].includes("Shadow")) {
                                pokeList[j].push("Shadow");
                            } else if (names[i].includes("Purified")) {
                                pokeList[j].push("Purified");
                            } else if (names[i].includes("Alolan")) {
                                pokeList[j].push("Alolan");
                            } else if (names[i].includes("Galarian")) {
                                pokeList[j].push("Galarian");
                            } else if (names[i].includes("Therian")) {
                                pokeList[j].push("Therian");
                            } else if (names[i].includes("Origin")) {
                                pokeList[j].push("Origin");
                            } else if (names[i].includes("Altered")) {
                                pokeList[j].push("Altered");
                            } else if (names[i].includes("Standard")) {
                                pokeList[j].push("Standard");
                            } else if (names[i].includes("Hero")) {
                                pokeList[j].push("Hero");
                            } else if (names[i].includes("Shock")) {
                                pokeList[j].push("Shock");
                            } else if (names[i].includes("Hisuian")) {
                                pokeList[j].push("Hisuian");
                            } else if (names[i].includes("Chill")) {
                                pokeList[j].push("Chill");
                            } else if (names[i].includes("Douse")) {
                                pokeList[j].push("Douse");
                            } else if (names[i].includes("Super")) {
                                pokeList[j].push("Super");
                            } else if (names[i].includes("Large")) {
                                pokeList[j].push("Large");
                            } else if (names[i].includes("Average")) {
                                pokeList[j].push("Average");
                            } else if (names[i].includes("Altered")) {
                                pokeList[j].push("Altered");
                            } else if (names[i].includes("50% Forme")) {
                                pokeList[j].push("50% Forme");
                            } else if (names[i].includes("10% Forme")) {
                                pokeList[j].push ("10% Forme");
                            } else if (names[i].includes("Complete Forme")) {
                                pokeList[j].push("Complete Forme");
                            } else if (names[i].includes("Zen Mode")) {
                                pokeList[j].push("Zen Mode");
                            } else if (names[i].includes("Mega")) {
                                pokeList[j].push("Mega");
                            } else if (names[i].includes("Mega X")) {
                                pokeList[j].push("Mega X");
                            } else if (names[i].includes("Mega Y")) {
                                pokeList[j].push("Mega Y");
                            } else if (names[i].includes("Defense")) {
                                pokeList[j].push("Defense");
                            } else if (names[i].includes("Speed")) {
                                pokeList[j].push("Speed");
                            } else if (names[i].includes("Attack")) {
                                pokeList[j].push("Attack");
                            } else {
                                pokeList[j].push("");
                            }
                            pokeList[j].push(i + 1);
                            if (substringBeforeBrackets !== names[i]) {
                                pokeList[j].push(substringBeforeBrackets);
                            } else {
                                pokeList[j].push(names[i]);
                            }
                            if (names[i] === "poliwrath") {
                                console.log(pokeList[j]);
                                console.log(names[i]);
                                console.log("hello");
                            }
                            filteredList.push(pokeList[j]);
                            break; // Break the inner loop if a match is found
                            // currently making duplicates, must find out why?!? Also using # of the last in order
                        }
                    }
                }
                setFinalList(filteredList);
            },
        });
    };

    return (
        <div className='grid'>
            <div className='title'>
                <input className="file" type="file" accept=".csv" onChange={handleFileUpload} />
                <a href="https://pvpoke.com/rankings/all/1500/overall/" className='link'>File Generator Website Here</a>
            </div>
            {finalList.map((pokemon, index) => (
                <div className="card" key={index}>
                    <img className="card-img"
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon[0]}.png`}
                        alt="No image available"
                    />
                    <hr className='line'></hr>
                    <p className='card-name'>{"#" + pokemon[3] + " " + pokemon[4] + " " + pokemon[2]}</p>
                </div>
            ))}
        </div>
    );
}

export default App;


  
  
  