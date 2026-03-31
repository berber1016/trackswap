export enum MessageIndexType {
  /**
   * message is selected if set
   */
  SELECTED = 0x8000,
  /**
   * reserved (default 0)
   */
  RESERVED = 0x7000,
  /**
   * index
   */
  MASK = 0x0fff,
}

export enum DeviceIndexType {
  /**
   * Creator of the file is always device index 0.
   */
  CREATOR = 0,
}

export enum Gender {
  /**
   * female
   */
  FEMALE = 0,
  /**
   * male
   */
  MALE = 1,
}

export enum Language {
  /**
   * english
   */
  ENGLISH = 0,
  /**
   * french
   */
  FRENCH = 1,
  /**
   * italian
   */
  ITALIAN = 2,
  /**
   * german
   */
  GERMAN = 3,
  /**
   * spanish
   */
  SPANISH = 4,
  /**
   * croatian
   */
  CROATIAN = 5,
  /**
   * czech
   */
  CZECH = 6,
  /**
   * danish
   */
  DANISH = 7,
  /**
   * dutch
   */
  DUTCH = 8,
  /**
   * finnish
   */
  FINNISH = 9,
  /**
   * greek
   */
  GREEK = 10,
  /**
   * hungarian
   */
  HUNGARIAN = 11,
  /**
   * norwegian
   */
  NORWEGIAN = 12,
  /**
   * polish
   */
  POLISH = 13,
  /**
   * portuguese
   */
  PORTUGUESE = 14,
  /**
   * slovakian
   */
  SLOVAKIAN = 15,
  /**
   * slovenian
   */
  SLOVENIAN = 16,
  /**
   * swedish
   */
  SWEDISH = 17,
  /**
   * russian
   */
  RUSSIAN = 18,
  /**
   * turkish
   */
  TURKISH = 19,
  /**
   * latvian
   */
  LATVIAN = 20,
  /**
   * ukrainian
   */
  UKRAINIAN = 21,
  /**
   * arabic
   */
  ARABIC = 22,
  /**
   * farsi
   */
  FARSI = 23,
  /**
   * bulgarian
   */
  BULGARIAN = 24,
  /**
   * romanian
   */
  ROMANIAN = 25,
  /**
   * chinese
   */
  CHINESE = 26,
  /**
   * japanese
   */
  JAPANESE = 27,
  /**
   * korean
   */
  KOREAN = 28,
  /**
   * taiwanese
   */
  TAIWANESE = 29,
  /**
   * thai
   */
  THAI = 30,
  /**
   * hebrew
   */
  HEBREW = 31,
  /**
   * brazilianPortuguese
   */
  BRAZILIAN_PORTUGUESE = 32,
  /**
   * indonesian
   */
  INDONESIAN = 33,
  /**
   * malaysian
   */
  MALAYSIAN = 34,
  /**
   * vietnamese
   */
  VIETNAMESE = 35,
  /**
   * burmese
   */
  BURMESE = 36,
  /**
   * mongolian
   */
  MONGOLIAN = 37,
  /**
   * custom
   */
  CUSTOM = 254,
}

export enum LanguageBits0 {
  /**
   * english
   */
  ENGLISH = 0x01,
  /**
   * french
   */
  FRENCH = 0x02,
  /**
   * italian
   */
  ITALIAN = 0x04,
  /**
   * german
   */
  GERMAN = 0x08,
  /**
   * spanish
   */
  SPANISH = 0x10,
  /**
   * croatian
   */
  CROATIAN = 0x20,
  /**
   * czech
   */
  CZECH = 0x40,
  /**
   * danish
   */
  DANISH = 0x80,
}

export enum LanguageBits1 {
  /**
   * dutch
   */
  DUTCH = 0x01,
  /**
   * finnish
   */
  FINNISH = 0x02,
  /**
   * greek
   */
  GREEK = 0x04,
  /**
   * hungarian
   */
  HUNGARIAN = 0x08,
  /**
   * norwegian
   */
  NORWEGIAN = 0x10,
  /**
   * polish
   */
  POLISH = 0x20,
  /**
   * portuguese
   */
  PORTUGUESE = 0x40,
  /**
   * slovakian
   */
  SLOVAKIAN = 0x80,
}

export enum LanguageBits2 {
  /**
   * slovenian
   */
  SLOVENIAN = 0x01,
  /**
   * swedish
   */
  SWEDISH = 0x02,
  /**
   * russian
   */
  RUSSIAN = 0x04,
  /**
   * turkish
   */
  TURKISH = 0x08,
  /**
   * latvian
   */
  LATVIAN = 0x10,
  /**
   * ukrainian
   */
  UKRAINIAN = 0x20,
  /**
   * arabic
   */
  ARABIC = 0x40,
  /**
   * farsi
   */
  FARSI = 0x80,
}

export enum LanguageBits3 {
  /**
   * bulgarian
   */
  BULGARIAN = 0x01,
  /**
   * romanian
   */
  ROMANIAN = 0x02,
  /**
   * chinese
   */
  CHINESE = 0x04,
  /**
   * japanese
   */
  JAPANESE = 0x08,
  /**
   * korean
   */
  KOREAN = 0x10,
  /**
   * taiwanese
   */
  TAIWANESE = 0x20,
  /**
   * thai
   */
  THAI = 0x40,
  /**
   * hebrew
   */
  HEBREW = 0x80,
}

export enum LanguageBits4 {
  /**
   * brazilianPortuguese
   */
  BRAZILIAN_PORTUGUESE = 0x01,
  /**
   * indonesian
   */
  INDONESIAN = 0x02,
  /**
   * malaysian
   */
  MALAYSIAN = 0x04,
  /**
   * vietnamese
   */
  VIETNAMESE = 0x08,
  /**
   * burmese
   */
  BURMESE = 0x10,
  /**
   * mongolian
   */
  MONGOLIAN = 0x20,
}

export enum TimeZone {
  /**
   * almaty
   */
  ALMATY = 0,
  /**
   * bangkok
   */
  BANGKOK = 1,
  /**
   * bombay
   */
  BOMBAY = 2,
  /**
   * brasilia
   */
  BRASILIA = 3,
  /**
   * cairo
   */
  CAIRO = 4,
  /**
   * capeVerdeIs
   */
  CAPE_VERDE_IS = 5,
  /**
   * darwin
   */
  DARWIN = 6,
  /**
   * eniwetok
   */
  ENIWETOK = 7,
  /**
   * fiji
   */
  FIJI = 8,
  /**
   * hongKong
   */
  HONG_KONG = 9,
  /**
   * islamabad
   */
  ISLAMABAD = 10,
  /**
   * kabul
   */
  KABUL = 11,
  /**
   * magadan
   */
  MAGADAN = 12,
  /**
   * midAtlantic
   */
  MID_ATLANTIC = 13,
  /**
   * moscow
   */
  MOSCOW = 14,
  /**
   * muscat
   */
  MUSCAT = 15,
  /**
   * newfoundland
   */
  NEWFOUNDLAND = 16,
  /**
   * samoa
   */
  SAMOA = 17,
  /**
   * sydney
   */
  SYDNEY = 18,
  /**
   * tehran
   */
  TEHRAN = 19,
  /**
   * tokyo
   */
  TOKYO = 20,
  /**
   * usAlaska
   */
  US_ALASKA = 21,
  /**
   * usAtlantic
   */
  US_ATLANTIC = 22,
  /**
   * usCentral
   */
  US_CENTRAL = 23,
  /**
   * usEastern
   */
  US_EASTERN = 24,
  /**
   * usHawaii
   */
  US_HAWAII = 25,
  /**
   * usMountain
   */
  US_MOUNTAIN = 26,
  /**
   * usPacific
   */
  US_PACIFIC = 27,
  /**
   * other
   */
  OTHER = 28,
  /**
   * auckland
   */
  AUCKLAND = 29,
  /**
   * kathmandu
   */
  KATHMANDU = 30,
  /**
   * europeWesternWet
   */
  EUROPE_WESTERN_WET = 31,
  /**
   * europeCentralCet
   */
  EUROPE_CENTRAL_CET = 32,
  /**
   * europeEasternEet
   */
  EUROPE_EASTERN_EET = 33,
  /**
   * jakarta
   */
  JAKARTA = 34,
  /**
   * perth
   */
  PERTH = 35,
  /**
   * adelaide
   */
  ADELAIDE = 36,
  /**
   * brisbane
   */
  BRISBANE = 37,
  /**
   * tasmania
   */
  TASMANIA = 38,
  /**
   * iceland
   */
  ICELAND = 39,
  /**
   * amsterdam
   */
  AMSTERDAM = 40,
  /**
   * athens
   */
  ATHENS = 41,
  /**
   * barcelona
   */
  BARCELONA = 42,
  /**
   * berlin
   */
  BERLIN = 43,
  /**
   * brussels
   */
  BRUSSELS = 44,
  /**
   * budapest
   */
  BUDAPEST = 45,
  /**
   * copenhagen
   */
  COPENHAGEN = 46,
  /**
   * dublin
   */
  DUBLIN = 47,
  /**
   * helsinki
   */
  HELSINKI = 48,
  /**
   * lisbon
   */
  LISBON = 49,
  /**
   * london
   */
  LONDON = 50,
  /**
   * madrid
   */
  MADRID = 51,
  /**
   * munich
   */
  MUNICH = 52,
  /**
   * oslo
   */
  OSLO = 53,
  /**
   * paris
   */
  PARIS = 54,
  /**
   * prague
   */
  PRAGUE = 55,
  /**
   * reykjavik
   */
  REYKJAVIK = 56,
  /**
   * rome
   */
  ROME = 57,
  /**
   * stockholm
   */
  STOCKHOLM = 58,
  /**
   * vienna
   */
  VIENNA = 59,
  /**
   * warsaw
   */
  WARSAW = 60,
  /**
   * zurich
   */
  ZURICH = 61,
  /**
   * quebec
   */
  QUEBEC = 62,
  /**
   * ontario
   */
  ONTARIO = 63,
  /**
   * manitoba
   */
  MANITOBA = 64,
  /**
   * saskatchewan
   */
  SASKATCHEWAN = 65,
  /**
   * alberta
   */
  ALBERTA = 66,
  /**
   * britishColumbia
   */
  BRITISH_COLUMBIA = 67,
  /**
   * boise
   */
  BOISE = 68,
  /**
   * boston
   */
  BOSTON = 69,
  /**
   * chicago
   */
  CHICAGO = 70,
  /**
   * dallas
   */
  DALLAS = 71,
  /**
   * denver
   */
  DENVER = 72,
  /**
   * kansasCity
   */
  KANSAS_CITY = 73,
  /**
   * lasVegas
   */
  LAS_VEGAS = 74,
  /**
   * losAngeles
   */
  LOS_ANGELES = 75,
  /**
   * miami
   */
  MIAMI = 76,
  /**
   * minneapolis
   */
  MINNEAPOLIS = 77,
  /**
   * newYork
   */
  NEW_YORK = 78,
  /**
   * newOrleans
   */
  NEW_ORLEANS = 79,
  /**
   * phoenix
   */
  PHOENIX = 80,
  /**
   * santaFe
   */
  SANTA_FE = 81,
  /**
   * seattle
   */
  SEATTLE = 82,
  /**
   * washingtonDc
   */
  WASHINGTON_DC = 83,
  /**
   * usArizona
   */
  US_ARIZONA = 84,
  /**
   * chita
   */
  CHITA = 85,
  /**
   * ekaterinburg
   */
  EKATERINBURG = 86,
  /**
   * irkutsk
   */
  IRKUTSK = 87,
  /**
   * kaliningrad
   */
  KALININGRAD = 88,
  /**
   * krasnoyarsk
   */
  KRASNOYARSK = 89,
  /**
   * novosibirsk
   */
  NOVOSIBIRSK = 90,
  /**
   * petropavlovskKamchatskiy
   */
  PETROPAVLOVSK_KAMCHATSKIY = 91,
  /**
   * samara
   */
  SAMARA = 92,
  /**
   * vladivostok
   */
  VLADIVOSTOK = 93,
  /**
   * mexicoCentral
   */
  MEXICO_CENTRAL = 94,
  /**
   * mexicoMountain
   */
  MEXICO_MOUNTAIN = 95,
  /**
   * mexicoPacific
   */
  MEXICO_PACIFIC = 96,
  /**
   * capeTown
   */
  CAPE_TOWN = 97,
  /**
   * winkhoek
   */
  WINKHOEK = 98,
  /**
   * lagos
   */
  LAGOS = 99,
  /**
   * riyahd
   */
  RIYAHD = 100,
  /**
   * venezuela
   */
  VENEZUELA = 101,
  /**
   * australiaLh
   */
  AUSTRALIA_LH = 102,
  /**
   * santiago
   */
  SANTIAGO = 103,
  /**
   * manual
   */
  MANUAL = 253,
  /**
   * automatic
   */
  AUTOMATIC = 254,
}

export enum DisplayMeasure {
  /**
   * metric
   */
  METRIC = 0,
  /**
   * statute
   */
  STATUTE = 1,
  /**
   * nautical
   */
  NAUTICAL = 2,
}

export enum DisplayHeart {
  /**
   * bpm
   */
  BPM = 0,
  /**
   * max
   */
  MAX = 1,
  /**
   * reserve
   */
  RESERVE = 2,
}

export enum DisplayPower {
  /**
   * watts
   */
  WATTS = 0,
  /**
   * percentFtp
   */
  PERCENT_FTP = 1,
}

export enum DisplayPosition {
  /**
   * degree (dd.dddddd)
   */
  DEGREE = 0,
  /**
   * degreeMinute (dddmm.mmm)
   */
  DEGREE_MINUTE = 1,
  /**
   * degreeMinuteSecond (dddmmss)
   */
  DEGREE_MINUTE_SECOND = 2,
  /**
   * austrianGrid (Austrian Grid (BMN))
   */
  AUSTRIAN_GRID = 3,
  /**
   * britishGrid (British National Grid)
   */
  BRITISH_GRID = 4,
  /**
   * dutchGrid (Dutch grid system)
   */
  DUTCH_GRID = 5,
  /**
   * hungarianGrid (Hungarian grid system)
   */
  HUNGARIAN_GRID = 6,
  /**
   * finnishGrid (Finnish grid system Zone3 KKJ27)
   */
  FINNISH_GRID = 7,
  /**
   * germanGrid (Gausss Krueger (German))
   */
  GERMAN_GRID = 8,
  /**
   * icelandicGrid (Icelandic Grid)
   */
  ICELANDIC_GRID = 9,
  /**
   * indonesianEquatorial (Indonesian Equatorial LCO)
   */
  INDONESIAN_EQUATORIAL = 10,
  /**
   * indonesianIrian (Indonesian Irian LCO)
   */
  INDONESIAN_IRIAN = 11,
  /**
   * indonesianSouthern (Indonesian Southern LCO)
   */
  INDONESIAN_SOUTHERN = 12,
  /**
   * indiaZone0 (India zone 0)
   */
  INDIA_ZONE_0 = 13,
  /**
   * indiaZoneIA (India zone IA)
   */
  INDIA_ZONE_IA = 14,
  /**
   * indiaZoneIB (India zone IB)
   */
  INDIA_ZONE_IB = 15,
  /**
   * indiaZoneIIA (India zone IIA)
   */
  INDIA_ZONE_IIA = 16,
  /**
   * indiaZoneIIB (India zone IIB)
   */
  INDIA_ZONE_IIB = 17,
  /**
   * indiaZoneIIIA (India zone IIIA)
   */
  INDIA_ZONE_IIIA = 18,
  /**
   * indiaZoneIIIB (India zone IIIB)
   */
  INDIA_ZONE_IIIB = 19,
  /**
   * indiaZoneIVA (India zone IVA)
   */
  INDIA_ZONE_IVA = 20,
  /**
   * indiaZoneIVB (India zone IVB)
   */
  INDIA_ZONE_IVB = 21,
  /**
   * irishTransverse (Irish Transverse Mercator)
   */
  IRISH_TRANSVERSE = 22,
  /**
   * irishGrid (Irish Grid)
   */
  IRISH_GRID = 23,
  /**
   * loran (Loran TD)
   */
  LORAN = 24,
  /**
   * maidenheadGrid (Maidenhead grid system)
   */
  MAIDENHEAD_GRID = 25,
  /**
   * mgrsGrid (MGRS grid system)
   */
  MGRS_GRID = 26,
  /**
   * newZealandGrid (New Zealand grid system)
   */
  NEW_ZEALAND_GRID = 27,
  /**
   * newZealandTransverse (New Zealand Transverse Mercator)
   */
  NEW_ZEALAND_TRANSVERSE = 28,
  /**
   * qatarGrid (Qatar National Grid)
   */
  QATAR_GRID = 29,
  /**
   * modifiedSwedishGrid (Modified RT-90 (Sweden))
   */
  MODIFIED_SWEDISH_GRID = 30,
  /**
   * swedishGrid (RT-90 (Sweden))
   */
  SWEDISH_GRID = 31,
  /**
   * southAfricanGrid (South African Grid)
   */
  SOUTH_AFRICAN_GRID = 32,
  /**
   * swissGrid (Swiss CH-1903 grid)
   */
  SWISS_GRID = 33,
  /**
   * taiwanGrid (Taiwan Grid)
   */
  TAIWAN_GRID = 34,
  /**
   * unitedStatesGrid (United States National Grid)
   */
  UNITED_STATES_GRID = 35,
  /**
   * utmUpsGrid (UTM/UPS grid system)
   */
  UTM_UPS_GRID = 36,
  /**
   * westMalayan (West Malayan RSO)
   */
  WEST_MALAYAN = 37,
  /**
   * borneoRso (Borneo RSO)
   */
  BORNEO_RSO = 38,
  /**
   * estonianGrid (Estonian grid system)
   */
  ESTONIAN_GRID = 39,
  /**
   * latvianGrid (Latvian Transverse Mercator)
   */
  LATVIAN_GRID = 40,
  /**
   * swedishRef99Grid (Reference Grid 99 TM (Swedish))
   */
  SWEDISH_REF_99_GRID = 41,
}

export enum Switch {
  /**
   * off
   */
  OFF = 0,
  /**
   * on
   */
  ON = 1,
  /**
   * auto
   */
  AUTO = 2,
}

export enum Sport {
  /**
   * generic
   */
  GENERIC = 0,
  /**
   * running
   */
  RUNNING = 1,
  /**
   * cycling
   */
  CYCLING = 2,
  /**
   * transition (Mulitsport transition)
   */
  TRANSITION = 3,
  /**
   * fitnessEquipment
   */
  FITNESS_EQUIPMENT = 4,
  /**
   * swimming
   */
  SWIMMING = 5,
  /**
   * basketball
   */
  BASKETBALL = 6,
  /**
   * soccer
   */
  SOCCER = 7,
  /**
   * tennis
   */
  TENNIS = 8,
  /**
   * americanFootball
   */
  AMERICAN_FOOTBALL = 9,
  /**
   * training
   */
  TRAINING = 10,
  /**
   * walking
   */
  WALKING = 11,
  /**
   * crossCountrySkiing
   */
  CROSS_COUNTRY_SKIING = 12,
  /**
   * alpineSkiing
   */
  ALPINE_SKIING = 13,
  /**
   * snowboarding
   */
  SNOWBOARDING = 14,
  /**
   * rowing
   */
  ROWING = 15,
  /**
   * mountaineering
   */
  MOUNTAINEERING = 16,
  /**
   * hiking
   */
  HIKING = 17,
  /**
   * multisport
   */
  MULTISPORT = 18,
  /**
   * paddling
   */
  PADDLING = 19,
  /**
   * flying
   */
  FLYING = 20,
  /**
   * eBiking
   */
  E_BIKING = 21,
  /**
   * motorcycling
   */
  MOTORCYCLING = 22,
  /**
   * boating
   */
  BOATING = 23,
  /**
   * driving
   */
  DRIVING = 24,
  /**
   * golf
   */
  GOLF = 25,
  /**
   * hangGliding
   */
  HANG_GLIDING = 26,
  /**
   * horsebackRiding
   */
  HORSEBACK_RIDING = 27,
  /**
   * hunting
   */
  HUNTING = 28,
  /**
   * fishing
   */
  FISHING = 29,
  /**
   * inlineSkating
   */
  INLINE_SKATING = 30,
  /**
   * rockClimbing
   */
  ROCK_CLIMBING = 31,
  /**
   * sailing
   */
  SAILING = 32,
  /**
   * iceSkating
   */
  ICE_SKATING = 33,
  /**
   * skyDiving
   */
  SKY_DIVING = 34,
  /**
   * snowshoeing
   */
  SNOWSHOEING = 35,
  /**
   * snowmobiling
   */
  SNOWMOBILING = 36,
  /**
   * standUpPaddleboarding
   */
  STAND_UP_PADDLEBOARDING = 37,
  /**
   * surfing
   */
  SURFING = 38,
  /**
   * wakeboarding
   */
  WAKEBOARDING = 39,
  /**
   * waterSkiing
   */
  WATER_SKIING = 40,
  /**
   * kayaking
   */
  KAYAKING = 41,
  /**
   * rafting
   */
  RAFTING = 42,
  /**
   * windsurfing
   */
  WINDSURFING = 43,
  /**
   * kitesurfing
   */
  KITESURFING = 44,
  /**
   * tactical
   */
  TACTICAL = 45,
  /**
   * jumpmaster
   */
  JUMPMASTER = 46,
  /**
   * boxing
   */
  BOXING = 47,
  /**
   * floorClimbing
   */
  FLOOR_CLIMBING = 48,
  /**
   * baseball
   */
  BASEBALL = 49,
  /**
   * diving
   */
  DIVING = 53,
  /**
   * hiit
   */
  HIIT = 62,
  /**
   * racket
   */
  RACKET = 64,
  /**
   * wheelchairPushWalk
   */
  WHEELCHAIR_PUSH_WALK = 65,
  /**
   * wheelchairPushRun
   */
  WHEELCHAIR_PUSH_RUN = 66,
  /**
   * meditation
   */
  MEDITATION = 67,
  /**
   * discGolf
   */
  DISC_GOLF = 69,
  /**
   * cricket
   */
  CRICKET = 71,
  /**
   * rugby
   */
  RUGBY = 72,
  /**
   * hockey
   */
  HOCKEY = 73,
  /**
   * lacrosse
   */
  LACROSSE = 74,
  /**
   * volleyball
   */
  VOLLEYBALL = 75,
  /**
   * waterTubing
   */
  WATER_TUBING = 76,
  /**
   * wakesurfing
   */
  WAKESURFING = 77,
  /**
   * mixedMartialArts
   */
  MIXED_MARTIAL_ARTS = 80,
  /**
   * snorkeling
   */
  SNORKELING = 82,
  /**
   * dance
   */
  DANCE = 83,
  /**
   * jumpRope
   */
  JUMP_ROPE = 84,
  /**
   * all (All is for goals only to include all sports.)
   */
  ALL = 254,
}

export enum SportBits0 {
  /**
   * generic
   */
  GENERIC = 0x01,
  /**
   * running
   */
  RUNNING = 0x02,
  /**
   * cycling
   */
  CYCLING = 0x04,
  /**
   * transition (Mulitsport transition)
   */
  TRANSITION = 0x08,
  /**
   * fitnessEquipment
   */
  FITNESS_EQUIPMENT = 0x10,
  /**
   * swimming
   */
  SWIMMING = 0x20,
  /**
   * basketball
   */
  BASKETBALL = 0x40,
  /**
   * soccer
   */
  SOCCER = 0x80,
}

export enum SportBits1 {
  /**
   * tennis
   */
  TENNIS = 0x01,
  /**
   * americanFootball
   */
  AMERICAN_FOOTBALL = 0x02,
  /**
   * training
   */
  TRAINING = 0x04,
  /**
   * walking
   */
  WALKING = 0x08,
  /**
   * crossCountrySkiing
   */
  CROSS_COUNTRY_SKIING = 0x10,
  /**
   * alpineSkiing
   */
  ALPINE_SKIING = 0x20,
  /**
   * snowboarding
   */
  SNOWBOARDING = 0x40,
  /**
   * rowing
   */
  ROWING = 0x80,
}

export enum SportBits2 {
  /**
   * mountaineering
   */
  MOUNTAINEERING = 0x01,
  /**
   * hiking
   */
  HIKING = 0x02,
  /**
   * multisport
   */
  MULTISPORT = 0x04,
  /**
   * paddling
   */
  PADDLING = 0x08,
  /**
   * flying
   */
  FLYING = 0x10,
  /**
   * eBiking
   */
  E_BIKING = 0x20,
  /**
   * motorcycling
   */
  MOTORCYCLING = 0x40,
  /**
   * boating
   */
  BOATING = 0x80,
}

export enum SportBits3 {
  /**
   * driving
   */
  DRIVING = 0x01,
  /**
   * golf
   */
  GOLF = 0x02,
  /**
   * hangGliding
   */
  HANG_GLIDING = 0x04,
  /**
   * horsebackRiding
   */
  HORSEBACK_RIDING = 0x08,
  /**
   * hunting
   */
  HUNTING = 0x10,
  /**
   * fishing
   */
  FISHING = 0x20,
  /**
   * inlineSkating
   */
  INLINE_SKATING = 0x40,
  /**
   * rockClimbing
   */
  ROCK_CLIMBING = 0x80,
}

export enum SportBits4 {
  /**
   * sailing
   */
  SAILING = 0x01,
  /**
   * iceSkating
   */
  ICE_SKATING = 0x02,
  /**
   * skyDiving
   */
  SKY_DIVING = 0x04,
  /**
   * snowshoeing
   */
  SNOWSHOEING = 0x08,
  /**
   * snowmobiling
   */
  SNOWMOBILING = 0x10,
  /**
   * standUpPaddleboarding
   */
  STAND_UP_PADDLEBOARDING = 0x20,
  /**
   * surfing
   */
  SURFING = 0x40,
  /**
   * wakeboarding
   */
  WAKEBOARDING = 0x80,
}

export enum SportBits5 {
  /**
   * waterSkiing
   */
  WATER_SKIING = 0x01,
  /**
   * kayaking
   */
  KAYAKING = 0x02,
  /**
   * rafting
   */
  RAFTING = 0x04,
  /**
   * windsurfing
   */
  WINDSURFING = 0x08,
  /**
   * kitesurfing
   */
  KITESURFING = 0x10,
  /**
   * tactical
   */
  TACTICAL = 0x20,
  /**
   * jumpmaster
   */
  JUMPMASTER = 0x40,
  /**
   * boxing
   */
  BOXING = 0x80,
}

export enum SportBits6 {
  /**
   * floorClimbing
   */
  FLOOR_CLIMBING = 0x01,
}

export enum SubSport {
  /**
   * generic
   */
  GENERIC = 0,
  /**
   * treadmill (Run/Fitness Equipment)
   */
  TREADMILL = 1,
  /**
   * street (Run)
   */
  STREET = 2,
  /**
   * trail (Run)
   */
  TRAIL = 3,
  /**
   * track (Run)
   */
  TRACK = 4,
  /**
   * spin (Cycling)
   */
  SPIN = 5,
  /**
   * indoorCycling (Cycling/Fitness Equipment)
   */
  INDOOR_CYCLING = 6,
  /**
   * road (Cycling)
   */
  ROAD = 7,
  /**
   * mountain (Cycling)
   */
  MOUNTAIN = 8,
  /**
   * downhill (Cycling)
   */
  DOWNHILL = 9,
  /**
   * recumbent (Cycling)
   */
  RECUMBENT = 10,
  /**
   * cyclocross (Cycling)
   */
  CYCLOCROSS = 11,
  /**
   * handCycling (Cycling)
   */
  HAND_CYCLING = 12,
  /**
   * trackCycling (Cycling)
   */
  TRACK_CYCLING = 13,
  /**
   * indoorRowing (Fitness Equipment)
   */
  INDOOR_ROWING = 14,
  /**
   * elliptical (Fitness Equipment)
   */
  ELLIPTICAL = 15,
  /**
   * stairClimbing (Fitness Equipment)
   */
  STAIR_CLIMBING = 16,
  /**
   * lapSwimming (Swimming)
   */
  LAP_SWIMMING = 17,
  /**
   * openWater (Swimming)
   */
  OPEN_WATER = 18,
  /**
   * flexibilityTraining (Training)
   */
  FLEXIBILITY_TRAINING = 19,
  /**
   * strengthTraining (Training)
   */
  STRENGTH_TRAINING = 20,
  /**
   * warmUp (Tennis)
   */
  WARM_UP = 21,
  /**
   * match (Tennis)
   */
  MATCH = 22,
  /**
   * exercise (Tennis)
   */
  EXERCISE = 23,
  /**
   * challenge
   */
  CHALLENGE = 24,
  /**
   * indoorSkiing (Fitness Equipment)
   */
  INDOOR_SKIING = 25,
  /**
   * cardioTraining (Training)
   */
  CARDIO_TRAINING = 26,
  /**
   * indoorWalking (Walking/Fitness Equipment)
   */
  INDOOR_WALKING = 27,
  /**
   * eBikeFitness (E-Biking)
   */
  E_BIKE_FITNESS = 28,
  /**
   * bmx (Cycling)
   */
  BMX = 29,
  /**
   * casualWalking (Walking)
   */
  CASUAL_WALKING = 30,
  /**
   * speedWalking (Walking)
   */
  SPEED_WALKING = 31,
  /**
   * bikeToRunTransition (Transition)
   */
  BIKE_TO_RUN_TRANSITION = 32,
  /**
   * runToBikeTransition (Transition)
   */
  RUN_TO_BIKE_TRANSITION = 33,
  /**
   * swimToBikeTransition (Transition)
   */
  SWIM_TO_BIKE_TRANSITION = 34,
  /**
   * atv (Motorcycling)
   */
  ATV = 35,
  /**
   * motocross (Motorcycling)
   */
  MOTOCROSS = 36,
  /**
   * backcountry (Alpine Skiing/Snowboarding)
   */
  BACKCOUNTRY = 37,
  /**
   * resort (Alpine Skiing/Snowboarding)
   */
  RESORT = 38,
  /**
   * rcDrone (Flying)
   */
  RC_DRONE = 39,
  /**
   * wingsuit (Flying)
   */
  WINGSUIT = 40,
  /**
   * whitewater (Kayaking/Rafting)
   */
  WHITEWATER = 41,
  /**
   * skateSkiing (Cross Country Skiing)
   */
  SKATE_SKIING = 42,
  /**
   * yoga (Training)
   */
  YOGA = 43,
  /**
   * pilates (Fitness Equipment)
   */
  PILATES = 44,
  /**
   * indoorRunning (Run)
   */
  INDOOR_RUNNING = 45,
  /**
   * gravelCycling (Cycling)
   */
  GRAVEL_CYCLING = 46,
  /**
   * eBikeMountain (Cycling)
   */
  E_BIKE_MOUNTAIN = 47,
  /**
   * commuting (Cycling)
   */
  COMMUTING = 48,
  /**
   * mixedSurface (Cycling)
   */
  MIXED_SURFACE = 49,
  /**
   * navigate
   */
  NAVIGATE = 50,
  /**
   * trackMe
   */
  TRACK_ME = 51,
  /**
   * map
   */
  MAP = 52,
  /**
   * singleGasDiving (Diving)
   */
  SINGLE_GAS_DIVING = 53,
  /**
   * multiGasDiving (Diving)
   */
  MULTI_GAS_DIVING = 54,
  /**
   * gaugeDiving (Diving)
   */
  GAUGE_DIVING = 55,
  /**
   * apneaDiving (Diving)
   */
  APNEA_DIVING = 56,
  /**
   * apneaHunting (Diving)
   */
  APNEA_HUNTING = 57,
  /**
   * virtualActivity
   */
  VIRTUAL_ACTIVITY = 58,
  /**
   * obstacle (Used for events where participants run, crawl through mud, climb over walls, etc.)
   */
  OBSTACLE = 59,
  /**
   * breathing
   */
  BREATHING = 62,
  /**
   * sailRace (Sailing)
   */
  SAIL_RACE = 65,
  /**
   * ultra (Ultramarathon)
   */
  ULTRA = 67,
  /**
   * indoorClimbing (Climbing)
   */
  INDOOR_CLIMBING = 68,
  /**
   * bouldering (Climbing)
   */
  BOULDERING = 69,
  /**
   * hiit (High Intensity Interval Training)
   */
  HIIT = 70,
  /**
   * amrap (HIIT)
   */
  AMRAP = 73,
  /**
   * emom (HIIT)
   */
  EMOM = 74,
  /**
   * tabata (HIIT)
   */
  TABATA = 75,
  /**
   * pickleball (Racket)
   */
  PICKLEBALL = 84,
  /**
   * padel (Racket)
   */
  PADEL = 85,
  /**
   * indoorWheelchairWalk
   */
  INDOOR_WHEELCHAIR_WALK = 86,
  /**
   * indoorWheelchairRun
   */
  INDOOR_WHEELCHAIR_RUN = 87,
  /**
   * indoorHandCycling
   */
  INDOOR_HAND_CYCLING = 88,
  /**
   * squash
   */
  SQUASH = 94,
  /**
   * badminton
   */
  BADMINTON = 95,
  /**
   * racquetball
   */
  RACQUETBALL = 96,
  /**
   * tableTennis
   */
  TABLE_TENNIS = 97,
  /**
   * flyCanopy (Flying)
   */
  FLY_CANOPY = 110,
  /**
   * flyParaglide (Flying)
   */
  FLY_PARAGLIDE = 111,
  /**
   * flyParamotor (Flying)
   */
  FLY_PARAMOTOR = 112,
  /**
   * flyPressurized (Flying)
   */
  FLY_PRESSURIZED = 113,
  /**
   * flyNavigate (Flying)
   */
  FLY_NAVIGATE = 114,
  /**
   * flyTimer (Flying)
   */
  FLY_TIMER = 115,
  /**
   * flyAltimeter (Flying)
   */
  FLY_ALTIMETER = 116,
  /**
   * flyWx (Flying)
   */
  FLY_WX = 117,
  /**
   * flyVfr (Flying)
   */
  FLY_VFR = 118,
  /**
   * flyIfr (Flying)
   */
  FLY_IFR = 119,
  /**
   * all
   */
  ALL = 254,
}

export enum SportEvent {
  /**
   * uncategorized
   */
  UNCATEGORIZED = 0,
  /**
   * geocaching
   */
  GEOCACHING = 1,
  /**
   * fitness
   */
  FITNESS = 2,
  /**
   * recreation
   */
  RECREATION = 3,
  /**
   * race
   */
  RACE = 4,
  /**
   * specialEvent
   */
  SPECIAL_EVENT = 5,
  /**
   * training
   */
  TRAINING = 6,
  /**
   * transportation
   */
  TRANSPORTATION = 7,
  /**
   * touring
   */
  TOURING = 8,
}

export enum ActivityMode {
  /**
   * manual
   */
  MANUAL = 0,
  /**
   * autoMultiSport
   */
  AUTO_MULTI_SPORT = 1,
}

export enum Intensity {
  /**
   * active
   */
  ACTIVE = 0,
  /**
   * rest
   */
  REST = 1,
  /**
   * warmup
   */
  WARMUP = 2,
  /**
   * cooldown
   */
  COOLDOWN = 3,
  /**
   * recovery
   */
  RECOVERY = 4,
  /**
   * interval
   */
  INTERVAL = 5,
  /**
   * other
   */
  OTHER = 6,
}

export enum SessionTrigger {
  /**
   * activityEnd
   */
  ACTIVITY_END = 0,
  /**
   * manual (User changed sport.)
   */
  MANUAL = 1,
  /**
   * autoMultiSport (Auto multi-sport feature is enabled and user pressed lap button to advance session.)
   */
  AUTO_MULTI_SPORT = 2,
  /**
   * fitnessEquipment (Auto sport change caused by user linking to fitness equipment.)
   */
  FITNESS_EQUIPMENT = 3,
}

export enum AutolapTrigger {
  /**
   * time
   */
  TIME = 0,
  /**
   * distance
   */
  DISTANCE = 1,
  /**
   * positionStart
   */
  POSITION_START = 2,
  /**
   * positionLap
   */
  POSITION_LAP = 3,
  /**
   * positionWaypoint
   */
  POSITION_WAYPOINT = 4,
  /**
   * positionMarked
   */
  POSITION_MARKED = 5,
  /**
   * off
   */
  OFF = 6,
  /**
   * autoSelect
   */
  AUTO_SELECT = 13,
}

export enum LapTrigger {
  /**
   * manual
   */
  MANUAL = 0,
  /**
   * time
   */
  TIME = 1,
  /**
   * distance
   */
  DISTANCE = 2,
  /**
   * positionStart
   */
  POSITION_START = 3,
  /**
   * positionLap
   */
  POSITION_LAP = 4,
  /**
   * positionWaypoint
   */
  POSITION_WAYPOINT = 5,
  /**
   * positionMarked
   */
  POSITION_MARKED = 6,
  /**
   * sessionEnd
   */
  SESSION_END = 7,
  /**
   * fitnessEquipment
   */
  FITNESS_EQUIPMENT = 8,
}

export enum TimeMode {
  /**
   * hour12
   */
  HOUR_12 = 0,
  /**
   * hour24 (Does not use a leading zero and has a colon)
   */
  HOUR_24 = 1,
  /**
   * military (Uses a leading zero and does not have a colon)
   */
  MILITARY = 2,
  /**
   * hour12WithSeconds
   */
  HOUR_12_WITH_SECONDS = 3,
  /**
   * hour24WithSeconds
   */
  HOUR_24_WITH_SECONDS = 4,
  /**
   * utc
   */
  UTC = 5,
}

export enum BacklightMode {
  /**
   * off
   */
  OFF = 0,
  /**
   * manual
   */
  MANUAL = 1,
  /**
   * keyAndMessages
   */
  KEY_AND_MESSAGES = 2,
  /**
   * autoBrightness
   */
  AUTO_BRIGHTNESS = 3,
  /**
   * smartNotifications
   */
  SMART_NOTIFICATIONS = 4,
  /**
   * keyAndMessagesNight
   */
  KEY_AND_MESSAGES_NIGHT = 5,
  /**
   * keyAndMessagesAndSmartNotifications
   */
  KEY_AND_MESSAGES_AND_SMART_NOTIFICATIONS = 6,
}

export enum DateMode {
  /**
   * dayMonth
   */
  DAY_MONTH = 0,
  /**
   * monthDay
   */
  MONTH_DAY = 1,
}

export enum BacklightTimeout {
  /**
   * infinite (Backlight stays on forever.)
   */
  INFINITE = 0,
}

export enum Event {
  /**
   * timer (Group 0. Start / stop_all)
   */
  TIMER = 0,
  /**
   * workout (start / stop)
   */
  WORKOUT = 3,
  /**
   * workoutStep (Start at beginning of workout. Stop at end of each step.)
   */
  WORKOUT_STEP = 4,
  /**
   * powerDown (stop_all group 0)
   */
  POWER_DOWN = 5,
  /**
   * powerUp (stop_all group 0)
   */
  POWER_UP = 6,
  /**
   * offCourse (start / stop group 0)
   */
  OFF_COURSE = 7,
  /**
   * session (Stop at end of each session.)
   */
  SESSION = 8,
  /**
   * lap (Stop at end of each lap.)
   */
  LAP = 9,
  /**
   * coursePoint (marker)
   */
  COURSE_POINT = 10,
  /**
   * battery (marker)
   */
  BATTERY = 11,
  /**
   * virtualPartnerPace (Group 1. Start at beginning of activity if VP enabled, when VP pace is changed during activity or VP enabled mid activity. stop_disable when VP disabled.)
   */
  VIRTUAL_PARTNER_PACE = 12,
  /**
   * hrHighAlert (Group 0. Start / stop when in alert condition.)
   */
  HR_HIGH_ALERT = 13,
  /**
   * hrLowAlert (Group 0. Start / stop when in alert condition.)
   */
  HR_LOW_ALERT = 14,
  /**
   * speedHighAlert (Group 0. Start / stop when in alert condition.)
   */
  SPEED_HIGH_ALERT = 15,
  /**
   * speedLowAlert (Group 0. Start / stop when in alert condition.)
   */
  SPEED_LOW_ALERT = 16,
  /**
   * cadHighAlert (Group 0. Start / stop when in alert condition.)
   */
  CAD_HIGH_ALERT = 17,
  /**
   * cadLowAlert (Group 0. Start / stop when in alert condition.)
   */
  CAD_LOW_ALERT = 18,
  /**
   * powerHighAlert (Group 0. Start / stop when in alert condition.)
   */
  POWER_HIGH_ALERT = 19,
  /**
   * powerLowAlert (Group 0. Start / stop when in alert condition.)
   */
  POWER_LOW_ALERT = 20,
  /**
   * recoveryHr (marker)
   */
  RECOVERY_HR = 21,
  /**
   * batteryLow (marker)
   */
  BATTERY_LOW = 22,
  /**
   * timeDurationAlert (Group 1. Start if enabled mid activity (not required at start of activity). Stop when duration is reached. stop_disable if disabled.)
   */
  TIME_DURATION_ALERT = 23,
  /**
   * distanceDurationAlert (Group 1. Start if enabled mid activity (not required at start of activity). Stop when duration is reached. stop_disable if disabled.)
   */
  DISTANCE_DURATION_ALERT = 24,
  /**
   * calorieDurationAlert (Group 1. Start if enabled mid activity (not required at start of activity). Stop when duration is reached. stop_disable if disabled.)
   */
  CALORIE_DURATION_ALERT = 25,
  /**
   * activity (Group 1.. Stop at end of activity.)
   */
  ACTIVITY = 26,
  /**
   * fitnessEquipment (marker)
   */
  FITNESS_EQUIPMENT = 27,
  /**
   * length (Stop at end of each length.)
   */
  LENGTH = 28,
  /**
   * userMarker (marker)
   */
  USER_MARKER = 32,
  /**
   * sportPoint (marker)
   */
  SPORT_POINT = 33,
  /**
   * calibration (start/stop/marker)
   */
  CALIBRATION = 36,
  /**
   * frontGearChange (marker)
   */
  FRONT_GEAR_CHANGE = 42,
  /**
   * rearGearChange (marker)
   */
  REAR_GEAR_CHANGE = 43,
  /**
   * riderPositionChange (marker)
   */
  RIDER_POSITION_CHANGE = 44,
  /**
   * elevHighAlert (Group 0. Start / stop when in alert condition.)
   */
  ELEV_HIGH_ALERT = 45,
  /**
   * elevLowAlert (Group 0. Start / stop when in alert condition.)
   */
  ELEV_LOW_ALERT = 46,
  /**
   * commTimeout (marker)
   */
  COMM_TIMEOUT = 47,
  /**
   * autoActivityDetect (marker)
   */
  AUTO_ACTIVITY_DETECT = 54,
  /**
   * diveAlert (marker)
   */
  DIVE_ALERT = 56,
  /**
   * diveGasSwitched (marker)
   */
  DIVE_GAS_SWITCHED = 57,
  /**
   * tankPressureReserve (marker)
   */
  TANK_PRESSURE_RESERVE = 71,
  /**
   * tankPressureCritical (marker)
   */
  TANK_PRESSURE_CRITICAL = 72,
  /**
   * tankLost (marker)
   */
  TANK_LOST = 73,
  /**
   * radarThreatAlert (start/stop/marker)
   */
  RADAR_THREAT_ALERT = 75,
  /**
   * tankBatteryLow (marker)
   */
  TANK_BATTERY_LOW = 76,
  /**
   * tankPodConnected (marker - tank pod has connected)
   */
  TANK_POD_CONNECTED = 81,
  /**
   * tankPodDisconnected (marker - tank pod has lost connection)
   */
  TANK_POD_DISCONNECTED = 82,
}

export enum EventType {
  /**
   * start
   */
  START = 0,
  /**
   * stop
   */
  STOP = 1,
  /**
   * consecutiveDepreciated
   */
  CONSECUTIVE_DEPRECIATED = 2,
  /**
   * marker
   */
  MARKER = 3,
  /**
   * stopAll
   */
  STOP_ALL = 4,
  /**
   * beginDepreciated
   */
  BEGIN_DEPRECIATED = 5,
  /**
   * endDepreciated
   */
  END_DEPRECIATED = 6,
  /**
   * endAllDepreciated
   */
  END_ALL_DEPRECIATED = 7,
  /**
   * stopDisable
   */
  STOP_DISABLE = 8,
  /**
   * stopDisableAll
   */
  STOP_DISABLE_ALL = 9,
}

export enum TimerTrigger {
  /**
   * manual
   */
  MANUAL = 0,
  /**
   * auto
   */
  AUTO = 1,
  /**
   * fitnessEquipment
   */
  FITNESS_EQUIPMENT = 2,
}

export enum FitnessEquipmentState {
  /**
   * ready
   */
  READY = 0,
  /**
   * inUse
   */
  IN_USE = 1,
  /**
   * paused
   */
  PAUSED = 2,
  /**
   * unknown (lost connection to fitness equipment)
   */
  UNKNOWN = 3,
}

export enum Tone {
  /**
   * off
   */
  OFF = 0,
  /**
   * tone
   */
  TONE = 1,
  /**
   * vibrate
   */
  VIBRATE = 2,
  /**
   * toneAndVibrate
   */
  TONE_AND_VIBRATE = 3,
}

export enum Autoscroll {
  /**
   * none
   */
  NONE = 0,
  /**
   * slow
   */
  SLOW = 1,
  /**
   * medium
   */
  MEDIUM = 2,
  /**
   * fast
   */
  FAST = 3,
}

export enum ActivityClass {
  /**
   * level (0 to 100)
   */
  LEVEL = 0x7f,
  /**
   * levelMax
   */
  LEVEL_MAX = 100,
  /**
   * athlete
   */
  ATHLETE = 0x80,
}

export enum HrZoneCalc {
  /**
   * custom
   */
  CUSTOM = 0,
  /**
   * percentMaxHr
   */
  PERCENT_MAX_HR = 1,
  /**
   * percentHrr
   */
  PERCENT_HRR = 2,
  /**
   * percentLthr
   */
  PERCENT_LTHR = 3,
}

export enum PwrZoneCalc {
  /**
   * custom
   */
  CUSTOM = 0,
  /**
   * percentFtp
   */
  PERCENT_FTP = 1,
}

export enum WktStepDuration {
  /**
   * time
   */
  TIME = 0,
  /**
   * distance
   */
  DISTANCE = 1,
  /**
   * hrLessThan
   */
  HR_LESS_THAN = 2,
  /**
   * hrGreaterThan
   */
  HR_GREATER_THAN = 3,
  /**
   * calories
   */
  CALORIES = 4,
  /**
   * open
   */
  OPEN = 5,
  /**
   * repeatUntilStepsCmplt
   */
  REPEAT_UNTIL_STEPS_CMPLT = 6,
  /**
   * repeatUntilTime
   */
  REPEAT_UNTIL_TIME = 7,
  /**
   * repeatUntilDistance
   */
  REPEAT_UNTIL_DISTANCE = 8,
  /**
   * repeatUntilCalories
   */
  REPEAT_UNTIL_CALORIES = 9,
  /**
   * repeatUntilHrLessThan
   */
  REPEAT_UNTIL_HR_LESS_THAN = 10,
  /**
   * repeatUntilHrGreaterThan
   */
  REPEAT_UNTIL_HR_GREATER_THAN = 11,
  /**
   * repeatUntilPowerLessThan
   */
  REPEAT_UNTIL_POWER_LESS_THAN = 12,
  /**
   * repeatUntilPowerGreaterThan
   */
  REPEAT_UNTIL_POWER_GREATER_THAN = 13,
  /**
   * powerLessThan
   */
  POWER_LESS_THAN = 14,
  /**
   * powerGreaterThan
   */
  POWER_GREATER_THAN = 15,
  /**
   * trainingPeaksTss
   */
  TRAINING_PEAKS_TSS = 16,
  /**
   * repeatUntilPowerLastLapLessThan
   */
  REPEAT_UNTIL_POWER_LAST_LAP_LESS_THAN = 17,
  /**
   * repeatUntilMaxPowerLastLapLessThan
   */
  REPEAT_UNTIL_MAX_POWER_LAST_LAP_LESS_THAN = 18,
  /**
   * power3sLessThan
   */
  POWER_3S_LESS_THAN = 19,
  /**
   * power10sLessThan
   */
  POWER_10S_LESS_THAN = 20,
  /**
   * power30sLessThan
   */
  POWER_30S_LESS_THAN = 21,
  /**
   * power3sGreaterThan
   */
  POWER_3S_GREATER_THAN = 22,
  /**
   * power10sGreaterThan
   */
  POWER_10S_GREATER_THAN = 23,
  /**
   * power30sGreaterThan
   */
  POWER_30S_GREATER_THAN = 24,
  /**
   * powerLapLessThan
   */
  POWER_LAP_LESS_THAN = 25,
  /**
   * powerLapGreaterThan
   */
  POWER_LAP_GREATER_THAN = 26,
  /**
   * repeatUntilTrainingPeaksTss
   */
  REPEAT_UNTIL_TRAINING_PEAKS_TSS = 27,
  /**
   * repetitionTime
   */
  REPETITION_TIME = 28,
  /**
   * reps
   */
  REPS = 29,
  /**
   * timeOnly
   */
  TIME_ONLY = 31,
}

export enum WktStepTarget {
  /**
   * speed
   */
  SPEED = 0,
  /**
   * heartRate
   */
  HEART_RATE = 1,
  /**
   * open
   */
  OPEN = 2,
  /**
   * cadence
   */
  CADENCE = 3,
  /**
   * power
   */
  POWER = 4,
  /**
   * grade
   */
  GRADE = 5,
  /**
   * resistance
   */
  RESISTANCE = 6,
  /**
   * power3s
   */
  POWER_3S = 7,
  /**
   * power10s
   */
  POWER_10S = 8,
  /**
   * power30s
   */
  POWER_30S = 9,
  /**
   * powerLap
   */
  POWER_LAP = 10,
  /**
   * swimStroke
   */
  SWIM_STROKE = 11,
  /**
   * speedLap
   */
  SPEED_LAP = 12,
  /**
   * heartRateLap
   */
  HEART_RATE_LAP = 13,
}

export enum Goal {
  /**
   * time
   */
  TIME = 0,
  /**
   * distance
   */
  DISTANCE = 1,
  /**
   * calories
   */
  CALORIES = 2,
  /**
   * frequency
   */
  FREQUENCY = 3,
  /**
   * steps
   */
  STEPS = 4,
  /**
   * ascent
   */
  ASCENT = 5,
  /**
   * activeMinutes
   */
  ACTIVE_MINUTES = 6,
}

export enum GoalRecurrence {
  /**
   * off
   */
  OFF = 0,
  /**
   * daily
   */
  DAILY = 1,
  /**
   * weekly
   */
  WEEKLY = 2,
  /**
   * monthly
   */
  MONTHLY = 3,
  /**
   * yearly
   */
  YEARLY = 4,
  /**
   * custom
   */
  CUSTOM = 5,
}

export enum GoalSource {
  /**
   * auto (Device generated)
   */
  AUTO = 0,
  /**
   * community (Social network sourced goal)
   */
  COMMUNITY = 1,
  /**
   * user (Manually generated)
   */
  USER = 2,
}

export enum Schedule {
  /**
   * workout
   */
  WORKOUT = 0,
  /**
   * course
   */
  COURSE = 1,
}

export enum CoursePoint {
  /**
   * generic
   */
  GENERIC = 0,
  /**
   * summit
   */
  SUMMIT = 1,
  /**
   * valley
   */
  VALLEY = 2,
  /**
   * water
   */
  WATER = 3,
  /**
   * food
   */
  FOOD = 4,
  /**
   * danger
   */
  DANGER = 5,
  /**
   * left
   */
  LEFT = 6,
  /**
   * right
   */
  RIGHT = 7,
  /**
   * straight
   */
  STRAIGHT = 8,
  /**
   * firstAid
   */
  FIRST_AID = 9,
  /**
   * fourthCategory
   */
  FOURTH_CATEGORY = 10,
  /**
   * thirdCategory
   */
  THIRD_CATEGORY = 11,
  /**
   * secondCategory
   */
  SECOND_CATEGORY = 12,
  /**
   * firstCategory
   */
  FIRST_CATEGORY = 13,
  /**
   * horsCategory
   */
  HORS_CATEGORY = 14,
  /**
   * sprint
   */
  SPRINT = 15,
  /**
   * leftFork
   */
  LEFT_FORK = 16,
  /**
   * rightFork
   */
  RIGHT_FORK = 17,
  /**
   * middleFork
   */
  MIDDLE_FORK = 18,
  /**
   * slightLeft
   */
  SLIGHT_LEFT = 19,
  /**
   * sharpLeft
   */
  SHARP_LEFT = 20,
  /**
   * slightRight
   */
  SLIGHT_RIGHT = 21,
  /**
   * sharpRight
   */
  SHARP_RIGHT = 22,
  /**
   * uTurn
   */
  U_TURN = 23,
  /**
   * segmentStart
   */
  SEGMENT_START = 24,
  /**
   * segmentEnd
   */
  SEGMENT_END = 25,
  /**
   * campsite
   */
  CAMPSITE = 27,
  /**
   * aidStation
   */
  AID_STATION = 28,
  /**
   * restArea
   */
  REST_AREA = 29,
  /**
   * generalDistance (Used with UpAhead)
   */
  GENERAL_DISTANCE = 30,
  /**
   * service
   */
  SERVICE = 31,
  /**
   * energyGel
   */
  ENERGY_GEL = 32,
  /**
   * sportsDrink
   */
  SPORTS_DRINK = 33,
  /**
   * mileMarker
   */
  MILE_MARKER = 34,
  /**
   * checkpoint
   */
  CHECKPOINT = 35,
  /**
   * shelter
   */
  SHELTER = 36,
  /**
   * meetingSpot
   */
  MEETING_SPOT = 37,
  /**
   * overlook
   */
  OVERLOOK = 38,
  /**
   * toilet
   */
  TOILET = 39,
  /**
   * shower
   */
  SHOWER = 40,
  /**
   * gear
   */
  GEAR = 41,
  /**
   * sharpCurve
   */
  SHARP_CURVE = 42,
  /**
   * steepIncline
   */
  STEEP_INCLINE = 43,
  /**
   * tunnel
   */
  TUNNEL = 44,
  /**
   * bridge
   */
  BRIDGE = 45,
  /**
   * obstacle
   */
  OBSTACLE = 46,
  /**
   * crossing
   */
  CROSSING = 47,
  /**
   * store
   */
  STORE = 48,
  /**
   * transition
   */
  TRANSITION = 49,
  /**
   * navaid
   */
  NAVAID = 50,
  /**
   * transport
   */
  TRANSPORT = 51,
  /**
   * alert
   */
  ALERT = 52,
  /**
   * info
   */
  INFO = 53,
}

export enum Manufacturer {
  /**
   * garmin
   */
  GARMIN = 1,
  /**
   * garminFr405Antfs (Do not use. Used by FR405 for ANTFS man id.)
   */
  GARMIN_FR405_ANTFS = 2,
  /**
   * zephyr
   */
  ZEPHYR = 3,
  /**
   * dayton
   */
  DAYTON = 4,
  /**
   * idt
   */
  IDT = 5,
  /**
   * srm
   */
  SRM = 6,
  /**
   * quarq
   */
  QUARQ = 7,
  /**
   * ibike
   */
  IBIKE = 8,
  /**
   * saris
   */
  SARIS = 9,
  /**
   * sparkHk
   */
  SPARK_HK = 10,
  /**
   * tanita
   */
  TANITA = 11,
  /**
   * echowell
   */
  ECHOWELL = 12,
  /**
   * dynastreamOem
   */
  DYNASTREAM_OEM = 13,
  /**
   * nautilus
   */
  NAUTILUS = 14,
  /**
   * dynastream
   */
  DYNASTREAM = 15,
  /**
   * timex
   */
  TIMEX = 16,
  /**
   * metrigear
   */
  METRIGEAR = 17,
  /**
   * xelic
   */
  XELIC = 18,
  /**
   * beurer
   */
  BEURER = 19,
  /**
   * cardiosport
   */
  CARDIOSPORT = 20,
  /**
   * aAndD
   */
  A_AND_D = 21,
  /**
   * hmm
   */
  HMM = 22,
  /**
   * suunto
   */
  SUUNTO = 23,
  /**
   * thitaElektronik
   */
  THITA_ELEKTRONIK = 24,
  /**
   * gpulse
   */
  GPULSE = 25,
  /**
   * cleanMobile
   */
  CLEAN_MOBILE = 26,
  /**
   * pedalBrain
   */
  PEDAL_BRAIN = 27,
  /**
   * peaksware
   */
  PEAKSWARE = 28,
  /**
   * saxonar
   */
  SAXONAR = 29,
  /**
   * lemondFitness
   */
  LEMOND_FITNESS = 30,
  /**
   * dexcom
   */
  DEXCOM = 31,
  /**
   * wahooFitness
   */
  WAHOO_FITNESS = 32,
  /**
   * octaneFitness
   */
  OCTANE_FITNESS = 33,
  /**
   * archinoetics
   */
  ARCHINOETICS = 34,
  /**
   * theHurtBox
   */
  THE_HURT_BOX = 35,
  /**
   * citizenSystems
   */
  CITIZEN_SYSTEMS = 36,
  /**
   * magellan
   */
  MAGELLAN = 37,
  /**
   * osynce
   */
  OSYNCE = 38,
  /**
   * holux
   */
  HOLUX = 39,
  /**
   * concept2
   */
  CONCEPT_2 = 40,
  /**
   * shimano
   */
  SHIMANO = 41,
  /**
   * oneGiantLeap
   */
  ONE_GIANT_LEAP = 42,
  /**
   * aceSensor
   */
  ACE_SENSOR = 43,
  /**
   * brimBrothers
   */
  BRIM_BROTHERS = 44,
  /**
   * xplova
   */
  XPLOVA = 45,
  /**
   * perceptionDigital
   */
  PERCEPTION_DIGITAL = 46,
  /**
   * bf1systems
   */
  BF_1SYSTEMS = 47,
  /**
   * pioneer
   */
  PIONEER = 48,
  /**
   * spantec
   */
  SPANTEC = 49,
  /**
   * metalogics
   */
  METALOGICS = 50,
  /**
   * 4iiiis
   */
  _4IIIIS = 51,
  /**
   * seikoEpson
   */
  SEIKO_EPSON = 52,
  /**
   * seikoEpsonOem
   */
  SEIKO_EPSON_OEM = 53,
  /**
   * iforPowell
   */
  IFOR_POWELL = 54,
  /**
   * maxwellGuider
   */
  MAXWELL_GUIDER = 55,
  /**
   * starTrac
   */
  STAR_TRAC = 56,
  /**
   * breakaway
   */
  BREAKAWAY = 57,
  /**
   * alatechTechnologyLtd
   */
  ALATECH_TECHNOLOGY_LTD = 58,
  /**
   * mioTechnologyEurope
   */
  MIO_TECHNOLOGY_EUROPE = 59,
  /**
   * rotor
   */
  ROTOR = 60,
  /**
   * geonaute
   */
  GEONAUTE = 61,
  /**
   * idBike
   */
  ID_BIKE = 62,
  /**
   * specialized
   */
  SPECIALIZED = 63,
  /**
   * wtek
   */
  WTEK = 64,
  /**
   * physicalEnterprises
   */
  PHYSICAL_ENTERPRISES = 65,
  /**
   * northPoleEngineering
   */
  NORTH_POLE_ENGINEERING = 66,
  /**
   * bkool
   */
  BKOOL = 67,
  /**
   * cateye
   */
  CATEYE = 68,
  /**
   * stagesCycling
   */
  STAGES_CYCLING = 69,
  /**
   * sigmasport
   */
  SIGMASPORT = 70,
  /**
   * tomtom
   */
  TOMTOM = 71,
  /**
   * peripedal
   */
  PERIPEDAL = 72,
  /**
   * wattbike
   */
  WATTBIKE = 73,
  /**
   * moxy
   */
  MOXY = 76,
  /**
   * ciclosport
   */
  CICLOSPORT = 77,
  /**
   * powerbahn
   */
  POWERBAHN = 78,
  /**
   * acornProjectsAps
   */
  ACORN_PROJECTS_APS = 79,
  /**
   * lifebeam
   */
  LIFEBEAM = 80,
  /**
   * bontrager
   */
  BONTRAGER = 81,
  /**
   * wellgo
   */
  WELLGO = 82,
  /**
   * scosche
   */
  SCOSCHE = 83,
  /**
   * magura
   */
  MAGURA = 84,
  /**
   * woodway
   */
  WOODWAY = 85,
  /**
   * elite
   */
  ELITE = 86,
  /**
   * nielsenKellerman
   */
  NIELSEN_KELLERMAN = 87,
  /**
   * dkCity
   */
  DK_CITY = 88,
  /**
   * tacx
   */
  TACX = 89,
  /**
   * directionTechnology
   */
  DIRECTION_TECHNOLOGY = 90,
  /**
   * magtonic
   */
  MAGTONIC = 91,
  /**
   * 1partcarbon
   */
  _1PARTCARBON = 92,
  /**
   * insideRideTechnologies
   */
  INSIDE_RIDE_TECHNOLOGIES = 93,
  /**
   * soundOfMotion
   */
  SOUND_OF_MOTION = 94,
  /**
   * stryd
   */
  STRYD = 95,
  /**
   * icg (Indoorcycling Group)
   */
  ICG = 96,
  /**
   * miPulse
   */
  MI_PULSE = 97,
  /**
   * bsxAthletics
   */
  BSX_ATHLETICS = 98,
  /**
   * look
   */
  LOOK = 99,
  /**
   * campagnoloSrl
   */
  CAMPAGNOLO_SRL = 100,
  /**
   * bodyBikeSmart
   */
  BODY_BIKE_SMART = 101,
  /**
   * praxisworks
   */
  PRAXISWORKS = 102,
  /**
   * limitsTechnology (Limits Technology Ltd.)
   */
  LIMITS_TECHNOLOGY = 103,
  /**
   * topactionTechnology (TopAction Technology Inc.)
   */
  TOPACTION_TECHNOLOGY = 104,
  /**
   * cosinuss
   */
  COSINUSS = 105,
  /**
   * fitcare
   */
  FITCARE = 106,
  /**
   * magene
   */
  MAGENE = 107,
  /**
   * giantManufacturingCo
   */
  GIANT_MANUFACTURING_CO = 108,
  /**
   * tigrasport (Tigrasport)
   */
  TIGRASPORT = 109,
  /**
   * salutron
   */
  SALUTRON = 110,
  /**
   * technogym
   */
  TECHNOGYM = 111,
  /**
   * brytonSensors
   */
  BRYTON_SENSORS = 112,
  /**
   * latitudeLimited
   */
  LATITUDE_LIMITED = 113,
  /**
   * soaringTechnology
   */
  SOARING_TECHNOLOGY = 114,
  /**
   * igpsport
   */
  IGPSPORT = 115,
  /**
   * thinkrider
   */
  THINKRIDER = 116,
  /**
   * gopherSport
   */
  GOPHER_SPORT = 117,
  /**
   * waterrower
   */
  WATERROWER = 118,
  /**
   * orangetheory
   */
  ORANGETHEORY = 119,
  /**
   * inpeak
   */
  INPEAK = 120,
  /**
   * kinetic
   */
  KINETIC = 121,
  /**
   * johnsonHealthTech
   */
  JOHNSON_HEALTH_TECH = 122,
  /**
   * polarElectro
   */
  POLAR_ELECTRO = 123,
  /**
   * seesense
   */
  SEESENSE = 124,
  /**
   * nciTechnology
   */
  NCI_TECHNOLOGY = 125,
  /**
   * iqsquare
   */
  IQSQUARE = 126,
  /**
   * leomo
   */
  LEOMO = 127,
  /**
   * ifitCom
   */
  IFIT_COM = 128,
  /**
   * corosByte
   */
  COROS_BYTE = 129,
  /**
   * versaDesign
   */
  VERSA_DESIGN = 130,
  /**
   * chileaf
   */
  CHILEAF = 131,
  /**
   * cycplus
   */
  CYCPLUS = 132,
  /**
   * gravaaByte
   */
  GRAVAA_BYTE = 133,
  /**
   * sigeyi
   */
  SIGEYI = 134,
  /**
   * coospo
   */
  COOSPO = 135,
  /**
   * geoid
   */
  GEOID = 136,
  /**
   * bosch
   */
  BOSCH = 137,
  /**
   * kyto
   */
  KYTO = 138,
  /**
   * kineticSports
   */
  KINETIC_SPORTS = 139,
  /**
   * decathlonByte
   */
  DECATHLON_BYTE = 140,
  /**
   * tqSystems
   */
  TQ_SYSTEMS = 141,
  /**
   * tagHeuer
   */
  TAG_HEUER = 142,
  /**
   * keiserFitness
   */
  KEISER_FITNESS = 143,
  /**
   * zwiftByte
   */
  ZWIFT_BYTE = 144,
  /**
   * porscheEp
   */
  PORSCHE_EP = 145,
  /**
   * blackbird
   */
  BLACKBIRD = 146,
  /**
   * meilanByte
   */
  MEILAN_BYTE = 147,
  /**
   * ezon
   */
  EZON = 148,
  /**
   * laisi
   */
  LAISI = 149,
  /**
   * myzone
   */
  MYZONE = 150,
  /**
   * abawo
   */
  ABAWO = 151,
  /**
   * bafang
   */
  BAFANG = 152,
  /**
   * luhongTechnology
   */
  LUHONG_TECHNOLOGY = 153,
  /**
   * development
   */
  DEVELOPMENT = 255,
  /**
   * healthandlife
   */
  HEALTHANDLIFE = 257,
  /**
   * lezyne
   */
  LEZYNE = 258,
  /**
   * scribeLabs
   */
  SCRIBE_LABS = 259,
  /**
   * zwift
   */
  ZWIFT = 260,
  /**
   * watteam
   */
  WATTEAM = 261,
  /**
   * recon
   */
  RECON = 262,
  /**
   * faveroElectronics
   */
  FAVERO_ELECTRONICS = 263,
  /**
   * dynovelo
   */
  DYNOVELO = 264,
  /**
   * strava
   */
  STRAVA = 265,
  /**
   * precor (Amer Sports)
   */
  PRECOR = 266,
  /**
   * bryton
   */
  BRYTON = 267,
  /**
   * sram
   */
  SRAM = 268,
  /**
   * navman (MiTAC Global Corporation (Mio Technology))
   */
  NAVMAN = 269,
  /**
   * cobi (COBI GmbH)
   */
  COBI = 270,
  /**
   * spivi
   */
  SPIVI = 271,
  /**
   * mioMagellan
   */
  MIO_MAGELLAN = 272,
  /**
   * evesports
   */
  EVESPORTS = 273,
  /**
   * sensitivusGauge
   */
  SENSITIVUS_GAUGE = 274,
  /**
   * podoon
   */
  PODOON = 275,
  /**
   * lifeTimeFitness
   */
  LIFE_TIME_FITNESS = 276,
  /**
   * falcoEMotors (Falco eMotors Inc.)
   */
  FALCO_E_MOTORS = 277,
  /**
   * minoura
   */
  MINOURA = 278,
  /**
   * cycliq
   */
  CYCLIQ = 279,
  /**
   * luxottica
   */
  LUXOTTICA = 280,
  /**
   * trainerRoad
   */
  TRAINER_ROAD = 281,
  /**
   * theSufferfest
   */
  THE_SUFFERFEST = 282,
  /**
   * fullspeedahead
   */
  FULLSPEEDAHEAD = 283,
  /**
   * virtualtraining
   */
  VIRTUALTRAINING = 284,
  /**
   * feedbacksports
   */
  FEEDBACKSPORTS = 285,
  /**
   * omata
   */
  OMATA = 286,
  /**
   * vdo
   */
  VDO = 287,
  /**
   * magneticdays
   */
  MAGNETICDAYS = 288,
  /**
   * hammerhead
   */
  HAMMERHEAD = 289,
  /**
   * kineticByKurt
   */
  KINETIC_BY_KURT = 290,
  /**
   * shapelog
   */
  SHAPELOG = 291,
  /**
   * dabuziduo
   */
  DABUZIDUO = 292,
  /**
   * jetblack
   */
  JETBLACK = 293,
  /**
   * coros
   */
  COROS = 294,
  /**
   * virtugo
   */
  VIRTUGO = 295,
  /**
   * velosense
   */
  VELOSENSE = 296,
  /**
   * cycligentinc
   */
  CYCLIGENTINC = 297,
  /**
   * trailforks
   */
  TRAILFORKS = 298,
  /**
   * mahleEbikemotion
   */
  MAHLE_EBIKEMOTION = 299,
  /**
   * nurvv
   */
  NURVV = 300,
  /**
   * microprogram
   */
  MICROPROGRAM = 301,
  /**
   * zone5cloud
   */
  ZONE_5CLOUD = 302,
  /**
   * greenteg
   */
  GREENTEG = 303,
  /**
   * yamahaMotors
   */
  YAMAHA_MOTORS = 304,
  /**
   * whoop
   */
  WHOOP = 305,
  /**
   * gravaa
   */
  GRAVAA = 306,
  /**
   * onelap
   */
  ONELAP = 307,
  /**
   * monarkExercise
   */
  MONARK_EXERCISE = 308,
  /**
   * form
   */
  FORM = 309,
  /**
   * decathlon
   */
  DECATHLON = 310,
  /**
   * syncros
   */
  SYNCROS = 311,
  /**
   * heatup
   */
  HEATUP = 312,
  /**
   * cannondale
   */
  CANNONDALE = 313,
  /**
   * trueFitness
   */
  TRUE_FITNESS = 314,
  /**
   * rGTCycling
   */
  R_GT_CYCLING = 315,
  /**
   * vasa
   */
  VASA = 316,
  /**
   * raceRepublic
   */
  RACE_REPUBLIC = 317,
  /**
   * fazua
   */
  FAZUA = 318,
  /**
   * orekaTraining
   */
  OREKA_TRAINING = 319,
  /**
   * lsec (Lishun Electric & Communication)
   */
  LSEC = 320,
  /**
   * lululemonStudio
   */
  LULULEMON_STUDIO = 321,
  /**
   * shanyue
   */
  SHANYUE = 322,
  /**
   * spinningMda
   */
  SPINNING_MDA = 323,
  /**
   * hilldating
   */
  HILLDATING = 324,
  /**
   * aeroSensor
   */
  AERO_SENSOR = 325,
  /**
   * nike
   */
  NIKE = 326,
  /**
   * magicshine
   */
  MAGICSHINE = 327,
  /**
   * ictrainer
   */
  ICTRAINER = 328,
  /**
   * absoluteCycling
   */
  ABSOLUTE_CYCLING = 329,
  /**
   * eoSwimbetter
   */
  EO_SWIMBETTER = 330,
  /**
   * mywhoosh
   */
  MYWHOOSH = 331,
  /**
   * ravemen
   */
  RAVEMEN = 332,
  /**
   * tektroRacingProducts
   */
  TEKTRO_RACING_PRODUCTS = 333,
  /**
   * daradInnovationCorporation
   */
  DARAD_INNOVATION_CORPORATION = 334,
  /**
   * cycloptim
   */
  CYCLOPTIM = 335,
  /**
   * runna
   */
  RUNNA = 337,
  /**
   * zepp
   */
  ZEPP = 339,
  /**
   * peloton
   */
  PELOTON = 340,
  /**
   * carv
   */
  CARV = 341,
  /**
   * tissot
   */
  TISSOT = 342,
  /**
   * realVelo
   */
  REAL_VELO = 345,
  /**
   * actigraphcorp
   */
  ACTIGRAPHCORP = 5759,
}

export enum GarminProduct {
  /**
   * hrm1
   */
  HRM_1 = 1,
  /**
   * axh01 (AXH01 HRM chipset)
   */
  AXH_01 = 2,
  /**
   * axb01
   */
  AXB_01 = 3,
  /**
   * axb02
   */
  AXB_02 = 4,
  /**
   * hrm2ss
   */
  HRM_2SS = 5,
  /**
   * dsiAlf02
   */
  DSI_ALF_02 = 6,
  /**
   * hrm3ss
   */
  HRM_3SS = 7,
  /**
   * hrmRunSingleByteProductId (hrm_run model for HRM ANT+ messaging)
   */
  HRM_RUN_SINGLE_BYTE_PRODUCT_ID = 8,
  /**
   * bsm (BSM model for ANT+ messaging)
   */
  BSM = 9,
  /**
   * bcm (BCM model for ANT+ messaging)
   */
  BCM = 10,
  /**
   * axs01 (AXS01 HRM Bike Chipset model for ANT+ messaging)
   */
  AXS_01 = 11,
  /**
   * hrmTriSingleByteProductId (hrm_tri model for HRM ANT+ messaging)
   */
  HRM_TRI_SINGLE_BYTE_PRODUCT_ID = 12,
  /**
   * hrm4RunSingleByteProductId (hrm4 run model for HRM ANT+ messaging)
   */
  HRM_4_RUN_SINGLE_BYTE_PRODUCT_ID = 13,
  /**
   * fr225SingleByteProductId (fr225 model for HRM ANT+ messaging)
   */
  FR_225_SINGLE_BYTE_PRODUCT_ID = 14,
  /**
   * gen3BsmSingleByteProductId (gen3_bsm model for Bike Speed ANT+ messaging)
   */
  GEN_3_BSM_SINGLE_BYTE_PRODUCT_ID = 15,
  /**
   * gen3BcmSingleByteProductId (gen3_bcm model for Bike Cadence ANT+ messaging)
   */
  GEN_3_BCM_SINGLE_BYTE_PRODUCT_ID = 16,
  /**
   * hrmFitSingleByteProductId
   */
  HRM_FIT_SINGLE_BYTE_PRODUCT_ID = 22,
  /**
   * oHR (Garmin Wearable Optical Heart Rate Sensor for ANT+ HR Profile Broadcasting)
   */
  O_HR = 255,
  /**
   * fr301China
   */
  FR_301_CHINA = 473,
  /**
   * fr301Japan
   */
  FR_301_JAPAN = 474,
  /**
   * fr301Korea
   */
  FR_301_KOREA = 475,
  /**
   * fr301Taiwan
   */
  FR_301_TAIWAN = 494,
  /**
   * fr405 (Forerunner 405)
   */
  FR_405 = 717,
  /**
   * fr50 (Forerunner 50)
   */
  FR_50 = 782,
  /**
   * fr405Japan
   */
  FR_405_JAPAN = 987,
  /**
   * fr60 (Forerunner 60)
   */
  FR_60 = 988,
  /**
   * dsiAlf01
   */
  DSI_ALF_01 = 1011,
  /**
   * fr310xt (Forerunner 310)
   */
  FR_310XT = 1018,
  /**
   * edge500
   */
  EDGE_500 = 1036,
  /**
   * fr110 (Forerunner 110)
   */
  FR_110 = 1124,
  /**
   * edge800
   */
  EDGE_800 = 1169,
  /**
   * edge500Taiwan
   */
  EDGE_500_TAIWAN = 1199,
  /**
   * edge500Japan
   */
  EDGE_500_JAPAN = 1213,
  /**
   * chirp
   */
  CHIRP = 1253,
  /**
   * fr110Japan
   */
  FR_110_JAPAN = 1274,
  /**
   * edge200
   */
  EDGE_200 = 1325,
  /**
   * fr910xt
   */
  FR_910XT = 1328,
  /**
   * edge800Taiwan
   */
  EDGE_800_TAIWAN = 1333,
  /**
   * edge800Japan
   */
  EDGE_800_JAPAN = 1334,
  /**
   * alf04
   */
  ALF_04 = 1341,
  /**
   * fr610
   */
  FR_610 = 1345,
  /**
   * fr210Japan
   */
  FR_210_JAPAN = 1360,
  /**
   * vectorSs
   */
  VECTOR_SS = 1380,
  /**
   * vectorCp
   */
  VECTOR_CP = 1381,
  /**
   * edge800China
   */
  EDGE_800_CHINA = 1386,
  /**
   * edge500China
   */
  EDGE_500_CHINA = 1387,
  /**
   * approachG10
   */
  APPROACH_G10 = 1405,
  /**
   * fr610Japan
   */
  FR_610_JAPAN = 1410,
  /**
   * edge500Korea
   */
  EDGE_500_KOREA = 1422,
  /**
   * fr70
   */
  FR_70 = 1436,
  /**
   * fr310xt4t
   */
  FR_310XT_4T = 1446,
  /**
   * amx
   */
  AMX = 1461,
  /**
   * fr10
   */
  FR_10 = 1482,
  /**
   * edge800Korea
   */
  EDGE_800_KOREA = 1497,
  /**
   * swim
   */
  SWIM = 1499,
  /**
   * fr910xtChina
   */
  FR_910XT_CHINA = 1537,
  /**
   * fenix
   */
  FENIX = 1551,
  /**
   * edge200Taiwan
   */
  EDGE_200_TAIWAN = 1555,
  /**
   * edge510
   */
  EDGE_510 = 1561,
  /**
   * edge810
   */
  EDGE_810 = 1567,
  /**
   * tempe
   */
  TEMPE = 1570,
  /**
   * fr910xtJapan
   */
  FR_910XT_JAPAN = 1600,
  /**
   * fr620
   */
  FR_620 = 1623,
  /**
   * fr220
   */
  FR_220 = 1632,
  /**
   * fr910xtKorea
   */
  FR_910XT_KOREA = 1664,
  /**
   * fr10Japan
   */
  FR_10_JAPAN = 1688,
  /**
   * edge810Japan
   */
  EDGE_810_JAPAN = 1721,
  /**
   * virbElite
   */
  VIRB_ELITE = 1735,
  /**
   * edgeTouring (Also Edge Touring Plus)
   */
  EDGE_TOURING = 1736,
  /**
   * edge510Japan
   */
  EDGE_510_JAPAN = 1742,
  /**
   * hrmTri (Also HRM-Swim)
   */
  HRM_TRI = 1743,
  /**
   * hrmRun
   */
  HRM_RUN = 1752,
  /**
   * fr920xt
   */
  FR_920XT = 1765,
  /**
   * edge510Asia
   */
  EDGE_510_ASIA = 1821,
  /**
   * edge810China
   */
  EDGE_810_CHINA = 1822,
  /**
   * edge810Taiwan
   */
  EDGE_810_TAIWAN = 1823,
  /**
   * edge1000
   */
  EDGE_1000 = 1836,
  /**
   * vivoFit
   */
  VIVO_FIT = 1837,
  /**
   * virbRemote
   */
  VIRB_REMOTE = 1853,
  /**
   * vivoKi
   */
  VIVO_KI = 1885,
  /**
   * fr15
   */
  FR_15 = 1903,
  /**
   * vivoActive
   */
  VIVO_ACTIVE = 1907,
  /**
   * edge510Korea
   */
  EDGE_510_KOREA = 1918,
  /**
   * fr620Japan
   */
  FR_620_JAPAN = 1928,
  /**
   * fr620China
   */
  FR_620_CHINA = 1929,
  /**
   * fr220Japan
   */
  FR_220_JAPAN = 1930,
  /**
   * fr220China
   */
  FR_220_CHINA = 1931,
  /**
   * approachS6
   */
  APPROACH_S6 = 1936,
  /**
   * vivoSmart
   */
  VIVO_SMART = 1956,
  /**
   * fenix2
   */
  FENIX_2 = 1967,
  /**
   * epix
   */
  EPIX = 1988,
  /**
   * fenix3
   */
  FENIX_3 = 2050,
  /**
   * edge1000Taiwan
   */
  EDGE_1000_TAIWAN = 2052,
  /**
   * edge1000Japan
   */
  EDGE_1000_JAPAN = 2053,
  /**
   * fr15Japan
   */
  FR_15_JAPAN = 2061,
  /**
   * edge520
   */
  EDGE_520 = 2067,
  /**
   * edge1000China
   */
  EDGE_1000_CHINA = 2070,
  /**
   * fr620Russia
   */
  FR_620_RUSSIA = 2072,
  /**
   * fr220Russia
   */
  FR_220_RUSSIA = 2073,
  /**
   * vectorS
   */
  VECTOR_S = 2079,
  /**
   * edge1000Korea
   */
  EDGE_1000_KOREA = 2100,
  /**
   * fr920xtTaiwan
   */
  FR_920XT_TAIWAN = 2130,
  /**
   * fr920xtChina
   */
  FR_920XT_CHINA = 2131,
  /**
   * fr920xtJapan
   */
  FR_920XT_JAPAN = 2132,
  /**
   * virbx
   */
  VIRBX = 2134,
  /**
   * vivoSmartApac
   */
  VIVO_SMART_APAC = 2135,
  /**
   * etrexTouch
   */
  ETREX_TOUCH = 2140,
  /**
   * edge25
   */
  EDGE_25 = 2147,
  /**
   * fr25
   */
  FR_25 = 2148,
  /**
   * vivoFit2
   */
  VIVO_FIT_2 = 2150,
  /**
   * fr225
   */
  FR_225 = 2153,
  /**
   * fr630
   */
  FR_630 = 2156,
  /**
   * fr230
   */
  FR_230 = 2157,
  /**
   * fr735xt
   */
  FR_735XT = 2158,
  /**
   * vivoActiveApac
   */
  VIVO_ACTIVE_APAC = 2160,
  /**
   * vector2
   */
  VECTOR_2 = 2161,
  /**
   * vector2s
   */
  VECTOR_2S = 2162,
  /**
   * virbxe
   */
  VIRBXE = 2172,
  /**
   * fr620Taiwan
   */
  FR_620_TAIWAN = 2173,
  /**
   * fr220Taiwan
   */
  FR_220_TAIWAN = 2174,
  /**
   * truswing
   */
  TRUSWING = 2175,
  /**
   * d2airvenu
   */
  D2_AIRVENU = 2187,
  /**
   * fenix3China
   */
  FENIX_3_CHINA = 2188,
  /**
   * fenix3Twn
   */
  FENIX_3_TWN = 2189,
  /**
   * variaHeadlight
   */
  VARIA_HEADLIGHT = 2192,
  /**
   * variaTaillightOld
   */
  VARIA_TAILLIGHT_OLD = 2193,
  /**
   * edgeExplore1000
   */
  EDGE_EXPLORE_1000 = 2204,
  /**
   * fr225Asia
   */
  FR_225_ASIA = 2219,
  /**
   * variaRadarTaillight
   */
  VARIA_RADAR_TAILLIGHT = 2225,
  /**
   * variaRadarDisplay
   */
  VARIA_RADAR_DISPLAY = 2226,
  /**
   * edge20
   */
  EDGE_20 = 2238,
  /**
   * edge520Asia
   */
  EDGE_520_ASIA = 2260,
  /**
   * edge520Japan
   */
  EDGE_520_JAPAN = 2261,
  /**
   * d2Bravo
   */
  D2_BRAVO = 2262,
  /**
   * approachS20
   */
  APPROACH_S20 = 2266,
  /**
   * vivoSmart2
   */
  VIVO_SMART_2 = 2271,
  /**
   * edge1000Thai
   */
  EDGE_1000_THAI = 2274,
  /**
   * variaRemote
   */
  VARIA_REMOTE = 2276,
  /**
   * edge25Asia
   */
  EDGE_25_ASIA = 2288,
  /**
   * edge25Jpn
   */
  EDGE_25_JPN = 2289,
  /**
   * edge20Asia
   */
  EDGE_20_ASIA = 2290,
  /**
   * approachX40
   */
  APPROACH_X40 = 2292,
  /**
   * fenix3Japan
   */
  FENIX_3_JAPAN = 2293,
  /**
   * vivoSmartEmea
   */
  VIVO_SMART_EMEA = 2294,
  /**
   * fr630Asia
   */
  FR_630_ASIA = 2310,
  /**
   * fr630Jpn
   */
  FR_630_JPN = 2311,
  /**
   * fr230Jpn
   */
  FR_230_JPN = 2313,
  /**
   * hrm4Run
   */
  HRM_4_RUN = 2327,
  /**
   * epixJapan
   */
  EPIX_JAPAN = 2332,
  /**
   * vivoActiveHr
   */
  VIVO_ACTIVE_HR = 2337,
  /**
   * vivoSmartGpsHr
   */
  VIVO_SMART_GPS_HR = 2347,
  /**
   * vivoSmartHr
   */
  VIVO_SMART_HR = 2348,
  /**
   * vivoSmartHrAsia
   */
  VIVO_SMART_HR_ASIA = 2361,
  /**
   * vivoSmartGpsHrAsia
   */
  VIVO_SMART_GPS_HR_ASIA = 2362,
  /**
   * vivoMove
   */
  VIVO_MOVE = 2368,
  /**
   * variaTaillight
   */
  VARIA_TAILLIGHT = 2379,
  /**
   * fr235Asia
   */
  FR_235_ASIA = 2396,
  /**
   * fr235Japan
   */
  FR_235_JAPAN = 2397,
  /**
   * variaVision
   */
  VARIA_VISION = 2398,
  /**
   * vivoFit3
   */
  VIVO_FIT_3 = 2406,
  /**
   * fenix3Korea
   */
  FENIX_3_KOREA = 2407,
  /**
   * fenix3Sea
   */
  FENIX_3_SEA = 2408,
  /**
   * fenix3Hr
   */
  FENIX_3_HR = 2413,
  /**
   * virbUltra30
   */
  VIRB_ULTRA_30 = 2417,
  /**
   * indexSmartScale
   */
  INDEX_SMART_SCALE = 2429,
  /**
   * fr235
   */
  FR_235 = 2431,
  /**
   * fenix3Chronos
   */
  FENIX_3_CHRONOS = 2432,
  /**
   * oregon7xx
   */
  OREGON_7XX = 2441,
  /**
   * rino7xx
   */
  RINO_7XX = 2444,
  /**
   * epixKorea
   */
  EPIX_KOREA = 2457,
  /**
   * fenix3HrChn
   */
  FENIX_3_HR_CHN = 2473,
  /**
   * fenix3HrTwn
   */
  FENIX_3_HR_TWN = 2474,
  /**
   * fenix3HrJpn
   */
  FENIX_3_HR_JPN = 2475,
  /**
   * fenix3HrSea
   */
  FENIX_3_HR_SEA = 2476,
  /**
   * fenix3HrKor
   */
  FENIX_3_HR_KOR = 2477,
  /**
   * nautix
   */
  NAUTIX = 2496,
  /**
   * vivoActiveHrApac
   */
  VIVO_ACTIVE_HR_APAC = 2497,
  /**
   * fr35
   */
  FR_35 = 2503,
  /**
   * oregon7xxWw
   */
  OREGON_7XX_WW = 2512,
  /**
   * edge820
   */
  EDGE_820 = 2530,
  /**
   * edgeExplore820
   */
  EDGE_EXPLORE_820 = 2531,
  /**
   * fr735xtApac
   */
  FR_735XT_APAC = 2533,
  /**
   * fr735xtJapan
   */
  FR_735XT_JAPAN = 2534,
  /**
   * fenix5s
   */
  FENIX_5S = 2544,
  /**
   * d2BravoTitanium
   */
  D2_BRAVO_TITANIUM = 2547,
  /**
   * variaUt800 (Varia UT 800 SW)
   */
  VARIA_UT_800 = 2567,
  /**
   * runningDynamicsPod
   */
  RUNNING_DYNAMICS_POD = 2593,
  /**
   * edge820China
   */
  EDGE_820_CHINA = 2599,
  /**
   * edge820Japan
   */
  EDGE_820_JAPAN = 2600,
  /**
   * fenix5x
   */
  FENIX_5X = 2604,
  /**
   * vivoFitJr
   */
  VIVO_FIT_JR = 2606,
  /**
   * vivoSmart3
   */
  VIVO_SMART_3 = 2622,
  /**
   * vivoSport
   */
  VIVO_SPORT = 2623,
  /**
   * edge820Taiwan
   */
  EDGE_820_TAIWAN = 2628,
  /**
   * edge820Korea
   */
  EDGE_820_KOREA = 2629,
  /**
   * edge820Sea
   */
  EDGE_820_SEA = 2630,
  /**
   * fr35Hebrew
   */
  FR_35_HEBREW = 2650,
  /**
   * approachS60
   */
  APPROACH_S60 = 2656,
  /**
   * fr35Apac
   */
  FR_35_APAC = 2667,
  /**
   * fr35Japan
   */
  FR_35_JAPAN = 2668,
  /**
   * fenix3ChronosAsia
   */
  FENIX_3_CHRONOS_ASIA = 2675,
  /**
   * virb360
   */
  VIRB_360 = 2687,
  /**
   * fr935
   */
  FR_935 = 2691,
  /**
   * fenix5
   */
  FENIX_5 = 2697,
  /**
   * vivoactive3
   */
  VIVOACTIVE_3 = 2700,
  /**
   * fr235ChinaNfc
   */
  FR_235_CHINA_NFC = 2733,
  /**
   * foretrex601_701
   */
  FORETREX_601_701 = 2769,
  /**
   * vivoMoveHr
   */
  VIVO_MOVE_HR = 2772,
  /**
   * edge1030
   */
  EDGE_1030 = 2713,
  /**
   * fr35Sea
   */
  FR_35_SEA = 2727,
  /**
   * vector3
   */
  VECTOR_3 = 2787,
  /**
   * fenix5Asia
   */
  FENIX_5_ASIA = 2796,
  /**
   * fenix5sAsia
   */
  FENIX_5S_ASIA = 2797,
  /**
   * fenix5xAsia
   */
  FENIX_5X_ASIA = 2798,
  /**
   * approachZ80
   */
  APPROACH_Z80 = 2806,
  /**
   * fr35Korea
   */
  FR_35_KOREA = 2814,
  /**
   * d2charlie
   */
  D2CHARLIE = 2819,
  /**
   * vivoSmart3Apac
   */
  VIVO_SMART_3_APAC = 2831,
  /**
   * vivoSportApac
   */
  VIVO_SPORT_APAC = 2832,
  /**
   * fr935Asia
   */
  FR_935_ASIA = 2833,
  /**
   * descent
   */
  DESCENT = 2859,
  /**
   * vivoFit4
   */
  VIVO_FIT_4 = 2878,
  /**
   * fr645
   */
  FR_645 = 2886,
  /**
   * fr645m
   */
  FR_645M = 2888,
  /**
   * fr30
   */
  FR_30 = 2891,
  /**
   * fenix5sPlus
   */
  FENIX_5S_PLUS = 2900,
  /**
   * edge130
   */
  EDGE_130 = 2909,
  /**
   * edge1030Asia
   */
  EDGE_1030_ASIA = 2924,
  /**
   * vivosmart4
   */
  VIVOSMART_4 = 2927,
  /**
   * vivoMoveHrAsia
   */
  VIVO_MOVE_HR_ASIA = 2945,
  /**
   * approachX10
   */
  APPROACH_X10 = 2962,
  /**
   * fr30Asia
   */
  FR_30_ASIA = 2977,
  /**
   * vivoactive3mW
   */
  VIVOACTIVE_3M_W = 2988,
  /**
   * fr645Asia
   */
  FR_645_ASIA = 3003,
  /**
   * fr645mAsia
   */
  FR_645M_ASIA = 3004,
  /**
   * edgeExplore
   */
  EDGE_EXPLORE = 3011,
  /**
   * gpsmap66
   */
  GPSMAP_66 = 3028,
  /**
   * approachS10
   */
  APPROACH_S10 = 3049,
  /**
   * vivoactive3mL
   */
  VIVOACTIVE_3M_L = 3066,
  /**
   * fr245
   */
  FR_245 = 3076,
  /**
   * fr245Music
   */
  FR_245_MUSIC = 3077,
  /**
   * approachG80
   */
  APPROACH_G80 = 3085,
  /**
   * edge130Asia
   */
  EDGE_130_ASIA = 3092,
  /**
   * edge1030Bontrager
   */
  EDGE_1030_BONTRAGER = 3095,
  /**
   * fenix5Plus
   */
  FENIX_5_PLUS = 3110,
  /**
   * fenix5xPlus
   */
  FENIX_5X_PLUS = 3111,
  /**
   * edge520Plus
   */
  EDGE_520_PLUS = 3112,
  /**
   * fr945
   */
  FR_945 = 3113,
  /**
   * edge530
   */
  EDGE_530 = 3121,
  /**
   * edge830
   */
  EDGE_830 = 3122,
  /**
   * instinctEsports
   */
  INSTINCT_ESPORTS = 3126,
  /**
   * fenix5sPlusApac
   */
  FENIX_5S_PLUS_APAC = 3134,
  /**
   * fenix5xPlusApac
   */
  FENIX_5X_PLUS_APAC = 3135,
  /**
   * edge520PlusApac
   */
  EDGE_520_PLUS_APAC = 3142,
  /**
   * descentT1
   */
  DESCENT_T1 = 3143,
  /**
   * fr235lAsia
   */
  FR_235L_ASIA = 3144,
  /**
   * fr245Asia
   */
  FR_245_ASIA = 3145,
  /**
   * vivoActive3mApac
   */
  VIVO_ACTIVE_3M_APAC = 3163,
  /**
   * gen3Bsm (gen3 bike speed sensor)
   */
  GEN_3_BSM = 3192,
  /**
   * gen3Bcm (gen3 bike cadence sensor)
   */
  GEN_3_BCM = 3193,
  /**
   * vivoSmart4Asia
   */
  VIVO_SMART_4_ASIA = 3218,
  /**
   * vivoactive4Small
   */
  VIVOACTIVE_4_SMALL = 3224,
  /**
   * vivoactive4Large
   */
  VIVOACTIVE_4_LARGE = 3225,
  /**
   * venu
   */
  VENU = 3226,
  /**
   * marqDriver
   */
  MARQ_DRIVER = 3246,
  /**
   * marqAviator
   */
  MARQ_AVIATOR = 3247,
  /**
   * marqCaptain
   */
  MARQ_CAPTAIN = 3248,
  /**
   * marqCommander
   */
  MARQ_COMMANDER = 3249,
  /**
   * marqExpedition
   */
  MARQ_EXPEDITION = 3250,
  /**
   * marqAthlete
   */
  MARQ_ATHLETE = 3251,
  /**
   * descentMk2
   */
  DESCENT_MK_2 = 3258,
  /**
   * fr45
   */
  FR_45 = 3282,
  /**
   * gpsmap66i
   */
  GPSMAP_66I = 3284,
  /**
   * fenix6SSport
   */
  FENIX_6_S_SPORT = 3287,
  /**
   * fenix6S
   */
  FENIX_6_S = 3288,
  /**
   * fenix6Sport
   */
  FENIX_6_SPORT = 3289,
  /**
   * fenix6
   */
  FENIX_6 = 3290,
  /**
   * fenix6x
   */
  FENIX_6X = 3291,
  /**
   * hrmDual (HRM-Dual)
   */
  HRM_DUAL = 3299,
  /**
   * hrmPro (HRM-Pro)
   */
  HRM_PRO = 3300,
  /**
   * vivoMove3Premium
   */
  VIVO_MOVE_3_PREMIUM = 3308,
  /**
   * approachS40
   */
  APPROACH_S40 = 3314,
  /**
   * fr245mAsia
   */
  FR_245M_ASIA = 3321,
  /**
   * edge530Apac
   */
  EDGE_530_APAC = 3349,
  /**
   * edge830Apac
   */
  EDGE_830_APAC = 3350,
  /**
   * vivoMove3
   */
  VIVO_MOVE_3 = 3378,
  /**
   * vivoActive4SmallAsia
   */
  VIVO_ACTIVE_4_SMALL_ASIA = 3387,
  /**
   * vivoActive4LargeAsia
   */
  VIVO_ACTIVE_4_LARGE_ASIA = 3388,
  /**
   * vivoActive4OledAsia
   */
  VIVO_ACTIVE_4_OLED_ASIA = 3389,
  /**
   * swim2
   */
  SWIM_2 = 3405,
  /**
   * marqDriverAsia
   */
  MARQ_DRIVER_ASIA = 3420,
  /**
   * marqAviatorAsia
   */
  MARQ_AVIATOR_ASIA = 3421,
  /**
   * vivoMove3Asia
   */
  VIVO_MOVE_3_ASIA = 3422,
  /**
   * fr945Asia
   */
  FR_945_ASIA = 3441,
  /**
   * vivoActive3tChn
   */
  VIVO_ACTIVE_3T_CHN = 3446,
  /**
   * marqCaptainAsia
   */
  MARQ_CAPTAIN_ASIA = 3448,
  /**
   * marqCommanderAsia
   */
  MARQ_COMMANDER_ASIA = 3449,
  /**
   * marqExpeditionAsia
   */
  MARQ_EXPEDITION_ASIA = 3450,
  /**
   * marqAthleteAsia
   */
  MARQ_ATHLETE_ASIA = 3451,
  /**
   * indexSmartScale2
   */
  INDEX_SMART_SCALE_2 = 3461,
  /**
   * instinctSolar
   */
  INSTINCT_SOLAR = 3466,
  /**
   * fr45Asia
   */
  FR_45_ASIA = 3469,
  /**
   * vivoactive3Daimler
   */
  VIVOACTIVE_3_DAIMLER = 3473,
  /**
   * legacyRey
   */
  LEGACY_REY = 3498,
  /**
   * legacyDarthVader
   */
  LEGACY_DARTH_VADER = 3499,
  /**
   * legacyCaptainMarvel
   */
  LEGACY_CAPTAIN_MARVEL = 3500,
  /**
   * legacyFirstAvenger
   */
  LEGACY_FIRST_AVENGER = 3501,
  /**
   * fenix6sSportAsia
   */
  FENIX_6S_SPORT_ASIA = 3512,
  /**
   * fenix6sAsia
   */
  FENIX_6S_ASIA = 3513,
  /**
   * fenix6SportAsia
   */
  FENIX_6_SPORT_ASIA = 3514,
  /**
   * fenix6Asia
   */
  FENIX_6_ASIA = 3515,
  /**
   * fenix6xAsia
   */
  FENIX_6X_ASIA = 3516,
  /**
   * legacyCaptainMarvelAsia
   */
  LEGACY_CAPTAIN_MARVEL_ASIA = 3535,
  /**
   * legacyFirstAvengerAsia
   */
  LEGACY_FIRST_AVENGER_ASIA = 3536,
  /**
   * legacyReyAsia
   */
  LEGACY_REY_ASIA = 3537,
  /**
   * legacyDarthVaderAsia
   */
  LEGACY_DARTH_VADER_ASIA = 3538,
  /**
   * descentMk2s
   */
  DESCENT_MK_2S = 3542,
  /**
   * edge130Plus
   */
  EDGE_130_PLUS = 3558,
  /**
   * edge1030Plus
   */
  EDGE_1030_PLUS = 3570,
  /**
   * rally200 (Rally 100/200 Power Meter Series)
   */
  RALLY_200 = 3578,
  /**
   * fr745
   */
  FR_745 = 3589,
  /**
   * venusqMusic
   */
  VENUSQ_MUSIC = 3596,
  /**
   * venusqMusicV2
   */
  VENUSQ_MUSIC_V2 = 3599,
  /**
   * venusq
   */
  VENUSQ = 3600,
  /**
   * lily
   */
  LILY = 3615,
  /**
   * marqAdventurer
   */
  MARQ_ADVENTURER = 3624,
  /**
   * enduro
   */
  ENDURO = 3638,
  /**
   * swim2Apac
   */
  SWIM_2_APAC = 3639,
  /**
   * marqAdventurerAsia
   */
  MARQ_ADVENTURER_ASIA = 3648,
  /**
   * fr945Lte
   */
  FR_945_LTE = 3652,
  /**
   * descentMk2Asia (Mk2 and Mk2i)
   */
  DESCENT_MK_2_ASIA = 3702,
  /**
   * venu2
   */
  VENU_2 = 3703,
  /**
   * venu2s
   */
  VENU_2S = 3704,
  /**
   * venuDaimlerAsia
   */
  VENU_DAIMLER_ASIA = 3737,
  /**
   * marqGolfer
   */
  MARQ_GOLFER = 3739,
  /**
   * venuDaimler
   */
  VENU_DAIMLER = 3740,
  /**
   * fr745Asia
   */
  FR_745_ASIA = 3794,
  /**
   * variaRct715
   */
  VARIA_RCT_715 = 3808,
  /**
   * lilyAsia
   */
  LILY_ASIA = 3809,
  /**
   * edge1030PlusAsia
   */
  EDGE_1030_PLUS_ASIA = 3812,
  /**
   * edge130PlusAsia
   */
  EDGE_130_PLUS_ASIA = 3813,
  /**
   * approachS12
   */
  APPROACH_S12 = 3823,
  /**
   * enduroAsia
   */
  ENDURO_ASIA = 3872,
  /**
   * venusqAsia
   */
  VENUSQ_ASIA = 3837,
  /**
   * edge1040
   */
  EDGE_1040 = 3843,
  /**
   * marqGolferAsia
   */
  MARQ_GOLFER_ASIA = 3850,
  /**
   * venu2Plus
   */
  VENU_2_PLUS = 3851,
  /**
   * gnss (Airoha AG3335M Family)
   */
  GNSS = 3865,
  /**
   * fr55
   */
  FR_55 = 3869,
  /**
   * instinct2
   */
  INSTINCT_2 = 3888,
  /**
   * instinct2s
   */
  INSTINCT_2S = 3889,
  /**
   * fenix7s
   */
  FENIX_7S = 3905,
  /**
   * fenix7
   */
  FENIX_7 = 3906,
  /**
   * fenix7x
   */
  FENIX_7X = 3907,
  /**
   * fenix7sApac
   */
  FENIX_7S_APAC = 3908,
  /**
   * fenix7Apac
   */
  FENIX_7_APAC = 3909,
  /**
   * fenix7xApac
   */
  FENIX_7X_APAC = 3910,
  /**
   * approachG12
   */
  APPROACH_G12 = 3927,
  /**
   * descentMk2sAsia
   */
  DESCENT_MK_2S_ASIA = 3930,
  /**
   * approachS42
   */
  APPROACH_S42 = 3934,
  /**
   * epixGen2
   */
  EPIX_GEN_2 = 3943,
  /**
   * epixGen2Apac
   */
  EPIX_GEN_2_APAC = 3944,
  /**
   * venu2sAsia
   */
  VENU_2S_ASIA = 3949,
  /**
   * venu2Asia
   */
  VENU_2_ASIA = 3950,
  /**
   * fr945LteAsia
   */
  FR_945_LTE_ASIA = 3978,
  /**
   * vivoMoveSport
   */
  VIVO_MOVE_SPORT = 3982,
  /**
   * vivomoveTrend
   */
  VIVOMOVE_TREND = 3983,
  /**
   * approachS12Asia
   */
  APPROACH_S12_ASIA = 3986,
  /**
   * fr255Music
   */
  FR_255_MUSIC = 3990,
  /**
   * fr255SmallMusic
   */
  FR_255_SMALL_MUSIC = 3991,
  /**
   * fr255
   */
  FR_255 = 3992,
  /**
   * fr255Small
   */
  FR_255_SMALL = 3993,
  /**
   * approachG12Asia
   */
  APPROACH_G12_ASIA = 4001,
  /**
   * approachS42Asia
   */
  APPROACH_S42_ASIA = 4002,
  /**
   * descentG1
   */
  DESCENT_G1 = 4005,
  /**
   * venu2PlusAsia
   */
  VENU_2_PLUS_ASIA = 4017,
  /**
   * fr955
   */
  FR_955 = 4024,
  /**
   * fr55Asia
   */
  FR_55_ASIA = 4033,
  /**
   * edge540
   */
  EDGE_540 = 4061,
  /**
   * edge840
   */
  EDGE_840 = 4062,
  /**
   * vivosmart5
   */
  VIVOSMART_5 = 4063,
  /**
   * instinct2Asia
   */
  INSTINCT_2_ASIA = 4071,
  /**
   * marqGen2 (Adventurer, Athlete, Captain, Golfer)
   */
  MARQ_GEN_2 = 4105,
  /**
   * venusq2
   */
  VENUSQ_2 = 4115,
  /**
   * venusq2music
   */
  VENUSQ_2MUSIC = 4116,
  /**
   * marqGen2Aviator
   */
  MARQ_GEN_2_AVIATOR = 4124,
  /**
   * d2AirX10
   */
  D2_AIR_X10 = 4125,
  /**
   * hrmProPlus
   */
  HRM_PRO_PLUS = 4130,
  /**
   * descentG1Asia
   */
  DESCENT_G1_ASIA = 4132,
  /**
   * tactix7
   */
  TACTIX_7 = 4135,
  /**
   * instinctCrossover
   */
  INSTINCT_CROSSOVER = 4155,
  /**
   * edgeExplore2
   */
  EDGE_EXPLORE_2 = 4169,
  /**
   * descentMk3
   */
  DESCENT_MK_3 = 4222,
  /**
   * descentMk3i
   */
  DESCENT_MK_3I = 4223,
  /**
   * approachS70
   */
  APPROACH_S70 = 4233,
  /**
   * fr265Large
   */
  FR_265_LARGE = 4257,
  /**
   * fr265Small
   */
  FR_265_SMALL = 4258,
  /**
   * venu3
   */
  VENU_3 = 4260,
  /**
   * venu3s
   */
  VENU_3S = 4261,
  /**
   * tacxNeoSmart (Neo Smart, Tacx)
   */
  TACX_NEO_SMART = 4265,
  /**
   * tacxNeo2Smart (Neo 2 Smart, Tacx)
   */
  TACX_NEO_2_SMART = 4266,
  /**
   * tacxNeo2TSmart (Neo 2T Smart, Tacx)
   */
  TACX_NEO_2T_SMART = 4267,
  /**
   * tacxNeoSmartBike (Neo Smart Bike, Tacx)
   */
  TACX_NEO_SMART_BIKE = 4268,
  /**
   * tacxSatoriSmart (Satori Smart, Tacx)
   */
  TACX_SATORI_SMART = 4269,
  /**
   * tacxFlowSmart (Flow Smart, Tacx)
   */
  TACX_FLOW_SMART = 4270,
  /**
   * tacxVortexSmart (Vortex Smart, Tacx)
   */
  TACX_VORTEX_SMART = 4271,
  /**
   * tacxBushidoSmart (Bushido Smart, Tacx)
   */
  TACX_BUSHIDO_SMART = 4272,
  /**
   * tacxGeniusSmart (Genius Smart, Tacx)
   */
  TACX_GENIUS_SMART = 4273,
  /**
   * tacxFluxFluxSSmart (Flux/Flux S Smart, Tacx)
   */
  TACX_FLUX_FLUX_S_SMART = 4274,
  /**
   * tacxFlux2Smart (Flux 2 Smart, Tacx)
   */
  TACX_FLUX_2_SMART = 4275,
  /**
   * tacxMagnum (Magnum, Tacx)
   */
  TACX_MAGNUM = 4276,
  /**
   * edge1040Asia
   */
  EDGE_1040_ASIA = 4305,
  /**
   * epixGen2Pro42
   */
  EPIX_GEN_2_PRO_42 = 4312,
  /**
   * epixGen2Pro47
   */
  EPIX_GEN_2_PRO_47 = 4313,
  /**
   * epixGen2Pro51
   */
  EPIX_GEN_2_PRO_51 = 4314,
  /**
   * fr965
   */
  FR_965 = 4315,
  /**
   * enduro2
   */
  ENDURO_2 = 4341,
  /**
   * fenix7sProSolar
   */
  FENIX_7S_PRO_SOLAR = 4374,
  /**
   * fenix7ProSolar
   */
  FENIX_7_PRO_SOLAR = 4375,
  /**
   * fenix7xProSolar
   */
  FENIX_7X_PRO_SOLAR = 4376,
  /**
   * lily2
   */
  LILY_2 = 4380,
  /**
   * instinct2x
   */
  INSTINCT_2X = 4394,
  /**
   * vivoactive5
   */
  VIVOACTIVE_5 = 4426,
  /**
   * fr165
   */
  FR_165 = 4432,
  /**
   * fr165Music
   */
  FR_165_MUSIC = 4433,
  /**
   * edge1050
   */
  EDGE_1050 = 4440,
  /**
   * descentT2
   */
  DESCENT_T2 = 4442,
  /**
   * hrmFit
   */
  HRM_FIT = 4446,
  /**
   * marqGen2Commander
   */
  MARQ_GEN_2_COMMANDER = 4472,
  /**
   * lilyAthlete (aka the Lily 2 Active)
   */
  LILY_ATHLETE = 4477,
  /**
   * rallyX10 (Rally 110/210)
   */
  RALLY_X10 = 4525,
  /**
   * fenix8Solar
   */
  FENIX_8_SOLAR = 4532,
  /**
   * fenix8SolarLarge
   */
  FENIX_8_SOLAR_LARGE = 4533,
  /**
   * fenix8Small
   */
  FENIX_8_SMALL = 4534,
  /**
   * fenix8
   */
  FENIX_8 = 4536,
  /**
   * d2Mach1Pro
   */
  D2_MACH_1_PRO = 4556,
  /**
   * enduro3
   */
  ENDURO_3 = 4575,
  /**
   * instinctE40mm
   */
  INSTINCT_E_40MM = 4583,
  /**
   * instinctE45mm
   */
  INSTINCT_E_45MM = 4584,
  /**
   * instinct3Solar45mm
   */
  INSTINCT_3_SOLAR_45MM = 4585,
  /**
   * instinct3Amoled45mm
   */
  INSTINCT_3_AMOLED_45MM = 4586,
  /**
   * instinct3Amoled50mm
   */
  INSTINCT_3_AMOLED_50MM = 4587,
  /**
   * descentG2
   */
  DESCENT_G2 = 4588,
  /**
   * venuX1
   */
  VENU_X1 = 4603,
  /**
   * hrm200
   */
  HRM_200 = 4606,
  /**
   * vivoactive6
   */
  VIVOACTIVE_6 = 4625,
  /**
   * fenix8Pro
   */
  FENIX_8_PRO = 4631,
  /**
   * edge550
   */
  EDGE_550 = 4633,
  /**
   * edge850
   */
  EDGE_850 = 4634,
  /**
   * venu4
   */
  VENU_4 = 4643,
  /**
   * venu4s
   */
  VENU_4S = 4644,
  /**
   * approachS44
   */
  APPROACH_S44 = 4647,
  /**
   * edgeMtb
   */
  EDGE_MTB = 4655,
  /**
   * approachS50
   */
  APPROACH_S50 = 4656,
  /**
   * fenixE
   */
  FENIX_E = 4666,
  /**
   * bounce2
   */
  BOUNCE_2 = 4745,
  /**
   * instinct3Solar50mm
   */
  INSTINCT_3_SOLAR_50MM = 4759,
  /**
   * tactix8Amoled
   */
  TACTIX_8_AMOLED = 4775,
  /**
   * tactix8Solar
   */
  TACTIX_8_SOLAR = 4776,
  /**
   * approachJ1
   */
  APPROACH_J1 = 4825,
  /**
   * d2Mach2
   */
  D2_MACH_2 = 4879,
  /**
   * instinctCrossoverAmoled
   */
  INSTINCT_CROSSOVER_AMOLED = 4678,
  /**
   * d2AirX15
   */
  D2_AIR_X15 = 4944,
  /**
   * sdm4 (SDM4 footpod)
   */
  SDM_4 = 10007,
  /**
   * edgeRemote
   */
  EDGE_REMOTE = 10014,
  /**
   * tacxTrainingAppWin
   */
  TACX_TRAINING_APP_WIN = 20533,
  /**
   * tacxTrainingAppMac
   */
  TACX_TRAINING_APP_MAC = 20534,
  /**
   * tacxTrainingAppMacCatalyst
   */
  TACX_TRAINING_APP_MAC_CATALYST = 20565,
  /**
   * trainingCenter
   */
  TRAINING_CENTER = 20119,
  /**
   * tacxTrainingAppAndroid
   */
  TACX_TRAINING_APP_ANDROID = 30045,
  /**
   * tacxTrainingAppIos
   */
  TACX_TRAINING_APP_IOS = 30046,
  /**
   * tacxTrainingAppLegacy
   */
  TACX_TRAINING_APP_LEGACY = 30047,
  /**
   * connectiqSimulator
   */
  CONNECTIQ_SIMULATOR = 65531,
  /**
   * androidAntplusPlugin
   */
  ANDROID_ANTPLUS_PLUGIN = 65532,
  /**
   * connect (Garmin Connect website)
   */
  CONNECT = 65534,
}

export enum AntplusDeviceType {
  /**
   * antfs
   */
  ANTFS = 1,
  /**
   * bikePower
   */
  BIKE_POWER = 11,
  /**
   * environmentSensorLegacy
   */
  ENVIRONMENT_SENSOR_LEGACY = 12,
  /**
   * multiSportSpeedDistance
   */
  MULTI_SPORT_SPEED_DISTANCE = 15,
  /**
   * control
   */
  CONTROL = 16,
  /**
   * fitnessEquipment
   */
  FITNESS_EQUIPMENT = 17,
  /**
   * bloodPressure
   */
  BLOOD_PRESSURE = 18,
  /**
   * geocacheNode
   */
  GEOCACHE_NODE = 19,
  /**
   * lightElectricVehicle
   */
  LIGHT_ELECTRIC_VEHICLE = 20,
  /**
   * envSensor
   */
  ENV_SENSOR = 25,
  /**
   * racquet
   */
  RACQUET = 26,
  /**
   * controlHub
   */
  CONTROL_HUB = 27,
  /**
   * muscleOxygen
   */
  MUSCLE_OXYGEN = 31,
  /**
   * shifting
   */
  SHIFTING = 34,
  /**
   * bikeLightMain
   */
  BIKE_LIGHT_MAIN = 35,
  /**
   * bikeLightShared
   */
  BIKE_LIGHT_SHARED = 36,
  /**
   * exd
   */
  EXD = 38,
  /**
   * bikeRadar
   */
  BIKE_RADAR = 40,
  /**
   * bikeAero
   */
  BIKE_AERO = 46,
  /**
   * weightScale
   */
  WEIGHT_SCALE = 119,
  /**
   * heartRate
   */
  HEART_RATE = 120,
  /**
   * bikeSpeedCadence
   */
  BIKE_SPEED_CADENCE = 121,
  /**
   * bikeCadence
   */
  BIKE_CADENCE = 122,
  /**
   * bikeSpeed
   */
  BIKE_SPEED = 123,
  /**
   * strideSpeedDistance
   */
  STRIDE_SPEED_DISTANCE = 124,
}

export enum AntNetwork {
  /**
   * public
   */
  PUBLIC = 0,
  /**
   * antplus
   */
  ANTPLUS = 1,
  /**
   * antfs
   */
  ANTFS = 2,
  /**
   * private
   */
  PRIVATE = 3,
}

export enum WorkoutCapabilities {
  /**
   * interval
   */
  INTERVAL = 0x00000001,
  /**
   * custom
   */
  CUSTOM = 0x00000002,
  /**
   * fitnessEquipment
   */
  FITNESS_EQUIPMENT = 0x00000004,
  /**
   * firstbeat
   */
  FIRSTBEAT = 0x00000008,
  /**
   * newLeaf
   */
  NEW_LEAF = 0x00000010,
  /**
   * tcx (For backwards compatibility. Watch should add missing id fields then clear flag.)
   */
  TCX = 0x00000020,
  /**
   * speed (Speed source required for workout step.)
   */
  SPEED = 0x00000080,
  /**
   * heartRate (Heart rate source required for workout step.)
   */
  HEART_RATE = 0x00000100,
  /**
   * distance (Distance source required for workout step.)
   */
  DISTANCE = 0x00000200,
  /**
   * cadence (Cadence source required for workout step.)
   */
  CADENCE = 0x00000400,
  /**
   * power (Power source required for workout step.)
   */
  POWER = 0x00000800,
  /**
   * grade (Grade source required for workout step.)
   */
  GRADE = 0x00001000,
  /**
   * resistance (Resistance source required for workout step.)
   */
  RESISTANCE = 0x00002000,
  /**
   * protected
   */
  PROTECTED = 0x00004000,
}

export enum BatteryStatus {
  /**
   * new
   */
  NEW = 1,
  /**
   * good
   */
  GOOD = 2,
  /**
   * ok
   */
  OK = 3,
  /**
   * low
   */
  LOW = 4,
  /**
   * critical
   */
  CRITICAL = 5,
  /**
   * charging
   */
  CHARGING = 6,
  /**
   * unknown
   */
  UNKNOWN = 7,
}

export enum HrType {
  /**
   * normal
   */
  NORMAL = 0,
  /**
   * irregular
   */
  IRREGULAR = 1,
}

export enum CourseCapabilities {
  /**
   * processed
   */
  PROCESSED = 0x00000001,
  /**
   * valid
   */
  VALID = 0x00000002,
  /**
   * time
   */
  TIME = 0x00000004,
  /**
   * distance
   */
  DISTANCE = 0x00000008,
  /**
   * position
   */
  POSITION = 0x00000010,
  /**
   * heartRate
   */
  HEART_RATE = 0x00000020,
  /**
   * power
   */
  POWER = 0x00000040,
  /**
   * cadence
   */
  CADENCE = 0x00000080,
  /**
   * training
   */
  TRAINING = 0x00000100,
  /**
   * navigation
   */
  NAVIGATION = 0x00000200,
  /**
   * bikeway
   */
  BIKEWAY = 0x00000400,
  /**
   * aviation (Denote course files to be used as flight plans)
   */
  AVIATION = 0x00001000,
}

export enum Weight {
  /**
   * calculating
   */
  CALCULATING = 0xfffe,
}

export enum WorkoutHr {
  /**
   * bpmOffset
   */
  BPM_OFFSET = 100,
}

export enum WorkoutPower {
  /**
   * wattsOffset
   */
  WATTS_OFFSET = 1000,
}

export enum BpStatus {
  /**
   * noError
   */
  NO_ERROR = 0,
  /**
   * errorIncompleteData
   */
  ERROR_INCOMPLETE_DATA = 1,
  /**
   * errorNoMeasurement
   */
  ERROR_NO_MEASUREMENT = 2,
  /**
   * errorDataOutOfRange
   */
  ERROR_DATA_OUT_OF_RANGE = 3,
  /**
   * errorIrregularHeartRate
   */
  ERROR_IRREGULAR_HEART_RATE = 4,
}

export enum UserLocalId {
  /**
   * localMin
   */
  LOCAL_MIN = 0x0000,
  /**
   * localMax
   */
  LOCAL_MAX = 0x000f,
  /**
   * stationaryMin
   */
  STATIONARY_MIN = 0x0010,
  /**
   * stationaryMax
   */
  STATIONARY_MAX = 0x00ff,
  /**
   * portableMin
   */
  PORTABLE_MIN = 0x0100,
  /**
   * portableMax
   */
  PORTABLE_MAX = 0xfffe,
}

export enum SwimStroke {
  /**
   * freestyle
   */
  FREESTYLE = 0,
  /**
   * backstroke
   */
  BACKSTROKE = 1,
  /**
   * breaststroke
   */
  BREASTSTROKE = 2,
  /**
   * butterfly
   */
  BUTTERFLY = 3,
  /**
   * drill
   */
  DRILL = 4,
  /**
   * mixed
   */
  MIXED = 5,
  /**
   * im (IM is a mixed interval containing the same number of lengths for each of: Butterfly, Backstroke, Breaststroke, Freestyle, swam in that order.)
   */
  IM = 6,
  /**
   * imByRound (For repeated workout steps, a new individual medly stroke is used for each round.)
   */
  IM_BY_ROUND = 7,
  /**
   * rimo (Reverse IM Order)
   */
  RIMO = 8,
}

export enum ActivityType {
  /**
   * generic
   */
  GENERIC = 0,
  /**
   * running
   */
  RUNNING = 1,
  /**
   * cycling
   */
  CYCLING = 2,
  /**
   * transition (Mulitsport transition)
   */
  TRANSITION = 3,
  /**
   * fitnessEquipment
   */
  FITNESS_EQUIPMENT = 4,
  /**
   * swimming
   */
  SWIMMING = 5,
  /**
   * walking
   */
  WALKING = 6,
  /**
   * sedentary
   */
  SEDENTARY = 8,
  /**
   * all (All is for goals only to include all sports.)
   */
  ALL = 254,
}

export enum ActivitySubtype {
  /**
   * generic
   */
  GENERIC = 0,
  /**
   * treadmill (Run)
   */
  TREADMILL = 1,
  /**
   * street (Run)
   */
  STREET = 2,
  /**
   * trail (Run)
   */
  TRAIL = 3,
  /**
   * track (Run)
   */
  TRACK = 4,
  /**
   * spin (Cycling)
   */
  SPIN = 5,
  /**
   * indoorCycling (Cycling)
   */
  INDOOR_CYCLING = 6,
  /**
   * road (Cycling)
   */
  ROAD = 7,
  /**
   * mountain (Cycling)
   */
  MOUNTAIN = 8,
  /**
   * downhill (Cycling)
   */
  DOWNHILL = 9,
  /**
   * recumbent (Cycling)
   */
  RECUMBENT = 10,
  /**
   * cyclocross (Cycling)
   */
  CYCLOCROSS = 11,
  /**
   * handCycling (Cycling)
   */
  HAND_CYCLING = 12,
  /**
   * trackCycling (Cycling)
   */
  TRACK_CYCLING = 13,
  /**
   * indoorRowing (Fitness Equipment)
   */
  INDOOR_ROWING = 14,
  /**
   * elliptical (Fitness Equipment)
   */
  ELLIPTICAL = 15,
  /**
   * stairClimbing (Fitness Equipment)
   */
  STAIR_CLIMBING = 16,
  /**
   * lapSwimming (Swimming)
   */
  LAP_SWIMMING = 17,
  /**
   * openWater (Swimming)
   */
  OPEN_WATER = 18,
  /**
   * all
   */
  ALL = 254,
}

export enum ActivityLevel {
  /**
   * low
   */
  LOW = 0,
  /**
   * medium
   */
  MEDIUM = 1,
  /**
   * high
   */
  HIGH = 2,
}

export enum Side {
  /**
   * right
   */
  RIGHT = 0,
  /**
   * left
   */
  LEFT = 1,
}

export enum LeftRightBalance {
  /**
   * mask (% contribution)
   */
  MASK = 0x7f,
  /**
   * right (data corresponds to right if set, otherwise unknown)
   */
  RIGHT = 0x80,
}

export enum LeftRightBalance100 {
  /**
   * mask (% contribution scaled by 100)
   */
  MASK = 0x3fff,
  /**
   * right (data corresponds to right if set, otherwise unknown)
   */
  RIGHT = 0x8000,
}

export enum LengthType {
  /**
   * idle (Rest period. Length with no strokes)
   */
  IDLE = 0,
  /**
   * active (Length with strokes.)
   */
  ACTIVE = 1,
}

export enum DayOfWeek {
  /**
   * sunday
   */
  SUNDAY = 0,
  /**
   * monday
   */
  MONDAY = 1,
  /**
   * tuesday
   */
  TUESDAY = 2,
  /**
   * wednesday
   */
  WEDNESDAY = 3,
  /**
   * thursday
   */
  THURSDAY = 4,
  /**
   * friday
   */
  FRIDAY = 5,
  /**
   * saturday
   */
  SATURDAY = 6,
}

export enum ConnectivityCapabilities {
  /**
   * bluetooth
   */
  BLUETOOTH = 0x00000001,
  /**
   * bluetoothLe
   */
  BLUETOOTH_LE = 0x00000002,
  /**
   * ant
   */
  ANT = 0x00000004,
  /**
   * activityUpload
   */
  ACTIVITY_UPLOAD = 0x00000008,
  /**
   * courseDownload
   */
  COURSE_DOWNLOAD = 0x00000010,
  /**
   * workoutDownload
   */
  WORKOUT_DOWNLOAD = 0x00000020,
  /**
   * liveTrack
   */
  LIVE_TRACK = 0x00000040,
  /**
   * weatherConditions
   */
  WEATHER_CONDITIONS = 0x00000080,
  /**
   * weatherAlerts
   */
  WEATHER_ALERTS = 0x00000100,
  /**
   * gpsEphemerisDownload
   */
  GPS_EPHEMERIS_DOWNLOAD = 0x00000200,
  /**
   * explicitArchive
   */
  EXPLICIT_ARCHIVE = 0x00000400,
  /**
   * setupIncomplete
   */
  SETUP_INCOMPLETE = 0x00000800,
  /**
   * continueSyncAfterSoftwareUpdate
   */
  CONTINUE_SYNC_AFTER_SOFTWARE_UPDATE = 0x00001000,
  /**
   * connectIqAppDownload
   */
  CONNECT_IQ_APP_DOWNLOAD = 0x00002000,
  /**
   * golfCourseDownload
   */
  GOLF_COURSE_DOWNLOAD = 0x00004000,
  /**
   * deviceInitiatesSync (Indicates device is in control of initiating all syncs)
   */
  DEVICE_INITIATES_SYNC = 0x00008000,
  /**
   * connectIqWatchAppDownload
   */
  CONNECT_IQ_WATCH_APP_DOWNLOAD = 0x00010000,
  /**
   * connectIqWidgetDownload
   */
  CONNECT_IQ_WIDGET_DOWNLOAD = 0x00020000,
  /**
   * connectIqWatchFaceDownload
   */
  CONNECT_IQ_WATCH_FACE_DOWNLOAD = 0x00040000,
  /**
   * connectIqDataFieldDownload
   */
  CONNECT_IQ_DATA_FIELD_DOWNLOAD = 0x00080000,
  /**
   * connectIqAppManagment (Device supports delete and reorder of apps via GCM)
   */
  CONNECT_IQ_APP_MANAGMENT = 0x00100000,
  /**
   * swingSensor
   */
  SWING_SENSOR = 0x00200000,
  /**
   * swingSensorRemote
   */
  SWING_SENSOR_REMOTE = 0x00400000,
  /**
   * incidentDetection (Device supports incident detection)
   */
  INCIDENT_DETECTION = 0x00800000,
  /**
   * audioPrompts
   */
  AUDIO_PROMPTS = 0x01000000,
  /**
   * wifiVerification (Device supports reporting wifi verification via GCM)
   */
  WIFI_VERIFICATION = 0x02000000,
  /**
   * trueUp (Device supports True Up)
   */
  TRUE_UP = 0x04000000,
  /**
   * findMyWatch (Device supports Find My Watch)
   */
  FIND_MY_WATCH = 0x08000000,
  /**
   * remoteManualSync
   */
  REMOTE_MANUAL_SYNC = 0x10000000,
  /**
   * liveTrackAutoStart (Device supports LiveTrack auto start)
   */
  LIVE_TRACK_AUTO_START = 0x20000000,
  /**
   * liveTrackMessaging (Device supports LiveTrack Messaging)
   */
  LIVE_TRACK_MESSAGING = 0x40000000,
  /**
   * instantInput (Device supports instant input feature)
   */
  INSTANT_INPUT = 0x80000000,
}

export enum WeatherReport {
  /**
   * current
   */
  CURRENT = 0,
  /**
   * forecast (Deprecated use hourly_forecast instead)
   */
  FORECAST = 1,
  /**
   * hourlyForecast
   */
  HOURLY_FORECAST = 1,
  /**
   * dailyForecast
   */
  DAILY_FORECAST = 2,
}

export enum WeatherStatus {
  /**
   * clear
   */
  CLEAR = 0,
  /**
   * partlyCloudy
   */
  PARTLY_CLOUDY = 1,
  /**
   * mostlyCloudy
   */
  MOSTLY_CLOUDY = 2,
  /**
   * rain
   */
  RAIN = 3,
  /**
   * snow
   */
  SNOW = 4,
  /**
   * windy
   */
  WINDY = 5,
  /**
   * thunderstorms
   */
  THUNDERSTORMS = 6,
  /**
   * wintryMix
   */
  WINTRY_MIX = 7,
  /**
   * fog
   */
  FOG = 8,
  /**
   * hazy
   */
  HAZY = 11,
  /**
   * hail
   */
  HAIL = 12,
  /**
   * scatteredShowers
   */
  SCATTERED_SHOWERS = 13,
  /**
   * scatteredThunderstorms
   */
  SCATTERED_THUNDERSTORMS = 14,
  /**
   * unknownPrecipitation
   */
  UNKNOWN_PRECIPITATION = 15,
  /**
   * lightRain
   */
  LIGHT_RAIN = 16,
  /**
   * heavyRain
   */
  HEAVY_RAIN = 17,
  /**
   * lightSnow
   */
  LIGHT_SNOW = 18,
  /**
   * heavySnow
   */
  HEAVY_SNOW = 19,
  /**
   * lightRainSnow
   */
  LIGHT_RAIN_SNOW = 20,
  /**
   * heavyRainSnow
   */
  HEAVY_RAIN_SNOW = 21,
  /**
   * cloudy
   */
  CLOUDY = 22,
}

export enum WeatherSeverity {
  /**
   * unknown
   */
  UNKNOWN = 0,
  /**
   * warning
   */
  WARNING = 1,
  /**
   * watch
   */
  WATCH = 2,
  /**
   * advisory
   */
  ADVISORY = 3,
  /**
   * statement
   */
  STATEMENT = 4,
}

export enum WeatherSevereType {
  /**
   * unspecified
   */
  UNSPECIFIED = 0,
  /**
   * tornado
   */
  TORNADO = 1,
  /**
   * tsunami
   */
  TSUNAMI = 2,
  /**
   * hurricane
   */
  HURRICANE = 3,
  /**
   * extremeWind
   */
  EXTREME_WIND = 4,
  /**
   * typhoon
   */
  TYPHOON = 5,
  /**
   * inlandHurricane
   */
  INLAND_HURRICANE = 6,
  /**
   * hurricaneForceWind
   */
  HURRICANE_FORCE_WIND = 7,
  /**
   * waterspout
   */
  WATERSPOUT = 8,
  /**
   * severeThunderstorm
   */
  SEVERE_THUNDERSTORM = 9,
  /**
   * wreckhouseWinds
   */
  WRECKHOUSE_WINDS = 10,
  /**
   * lesSuetesWind
   */
  LES_SUETES_WIND = 11,
  /**
   * avalanche
   */
  AVALANCHE = 12,
  /**
   * flashFlood
   */
  FLASH_FLOOD = 13,
  /**
   * tropicalStorm
   */
  TROPICAL_STORM = 14,
  /**
   * inlandTropicalStorm
   */
  INLAND_TROPICAL_STORM = 15,
  /**
   * blizzard
   */
  BLIZZARD = 16,
  /**
   * iceStorm
   */
  ICE_STORM = 17,
  /**
   * freezingRain
   */
  FREEZING_RAIN = 18,
  /**
   * debrisFlow
   */
  DEBRIS_FLOW = 19,
  /**
   * flashFreeze
   */
  FLASH_FREEZE = 20,
  /**
   * dustStorm
   */
  DUST_STORM = 21,
  /**
   * highWind
   */
  HIGH_WIND = 22,
  /**
   * winterStorm
   */
  WINTER_STORM = 23,
  /**
   * heavyFreezingSpray
   */
  HEAVY_FREEZING_SPRAY = 24,
  /**
   * extremeCold
   */
  EXTREME_COLD = 25,
  /**
   * windChill
   */
  WIND_CHILL = 26,
  /**
   * coldWave
   */
  COLD_WAVE = 27,
  /**
   * heavySnowAlert
   */
  HEAVY_SNOW_ALERT = 28,
  /**
   * lakeEffectBlowingSnow
   */
  LAKE_EFFECT_BLOWING_SNOW = 29,
  /**
   * snowSquall
   */
  SNOW_SQUALL = 30,
  /**
   * lakeEffectSnow
   */
  LAKE_EFFECT_SNOW = 31,
  /**
   * winterWeather
   */
  WINTER_WEATHER = 32,
  /**
   * sleet
   */
  SLEET = 33,
  /**
   * snowfall
   */
  SNOWFALL = 34,
  /**
   * snowAndBlowingSnow
   */
  SNOW_AND_BLOWING_SNOW = 35,
  /**
   * blowingSnow
   */
  BLOWING_SNOW = 36,
  /**
   * snowAlert
   */
  SNOW_ALERT = 37,
  /**
   * arcticOutflow
   */
  ARCTIC_OUTFLOW = 38,
  /**
   * freezingDrizzle
   */
  FREEZING_DRIZZLE = 39,
  /**
   * storm
   */
  STORM = 40,
  /**
   * stormSurge
   */
  STORM_SURGE = 41,
  /**
   * rainfall
   */
  RAINFALL = 42,
  /**
   * arealFlood
   */
  AREAL_FLOOD = 43,
  /**
   * coastalFlood
   */
  COASTAL_FLOOD = 44,
  /**
   * lakeshoreFlood
   */
  LAKESHORE_FLOOD = 45,
  /**
   * excessiveHeat
   */
  EXCESSIVE_HEAT = 46,
  /**
   * heat
   */
  HEAT = 47,
  /**
   * weather
   */
  WEATHER = 48,
  /**
   * highHeatAndHumidity
   */
  HIGH_HEAT_AND_HUMIDITY = 49,
  /**
   * humidexAndHealth
   */
  HUMIDEX_AND_HEALTH = 50,
  /**
   * humidex
   */
  HUMIDEX = 51,
  /**
   * gale
   */
  GALE = 52,
  /**
   * freezingSpray
   */
  FREEZING_SPRAY = 53,
  /**
   * specialMarine
   */
  SPECIAL_MARINE = 54,
  /**
   * squall
   */
  SQUALL = 55,
  /**
   * strongWind
   */
  STRONG_WIND = 56,
  /**
   * lakeWind
   */
  LAKE_WIND = 57,
  /**
   * marineWeather
   */
  MARINE_WEATHER = 58,
  /**
   * wind
   */
  WIND = 59,
  /**
   * smallCraftHazardousSeas
   */
  SMALL_CRAFT_HAZARDOUS_SEAS = 60,
  /**
   * hazardousSeas
   */
  HAZARDOUS_SEAS = 61,
  /**
   * smallCraft
   */
  SMALL_CRAFT = 62,
  /**
   * smallCraftWinds
   */
  SMALL_CRAFT_WINDS = 63,
  /**
   * smallCraftRoughBar
   */
  SMALL_CRAFT_ROUGH_BAR = 64,
  /**
   * highWaterLevel
   */
  HIGH_WATER_LEVEL = 65,
  /**
   * ashfall
   */
  ASHFALL = 66,
  /**
   * freezingFog
   */
  FREEZING_FOG = 67,
  /**
   * denseFog
   */
  DENSE_FOG = 68,
  /**
   * denseSmoke
   */
  DENSE_SMOKE = 69,
  /**
   * blowingDust
   */
  BLOWING_DUST = 70,
  /**
   * hardFreeze
   */
  HARD_FREEZE = 71,
  /**
   * freeze
   */
  FREEZE = 72,
  /**
   * frost
   */
  FROST = 73,
  /**
   * fireWeather
   */
  FIRE_WEATHER = 74,
  /**
   * flood
   */
  FLOOD = 75,
  /**
   * ripTide
   */
  RIP_TIDE = 76,
  /**
   * highSurf
   */
  HIGH_SURF = 77,
  /**
   * smog
   */
  SMOG = 78,
  /**
   * airQuality
   */
  AIR_QUALITY = 79,
  /**
   * briskWind
   */
  BRISK_WIND = 80,
  /**
   * airStagnation
   */
  AIR_STAGNATION = 81,
  /**
   * lowWater
   */
  LOW_WATER = 82,
  /**
   * hydrological
   */
  HYDROLOGICAL = 83,
  /**
   * specialWeather
   */
  SPECIAL_WEATHER = 84,
}

export enum StrokeType {
  /**
   * noEvent
   */
  NO_EVENT = 0,
  /**
   * other (stroke was detected but cannot be identified)
   */
  OTHER = 1,
  /**
   * serve
   */
  SERVE = 2,
  /**
   * forehand
   */
  FOREHAND = 3,
  /**
   * backhand
   */
  BACKHAND = 4,
  /**
   * smash
   */
  SMASH = 5,
}

export enum BodyLocation {
  /**
   * leftLeg
   */
  LEFT_LEG = 0,
  /**
   * leftCalf
   */
  LEFT_CALF = 1,
  /**
   * leftShin
   */
  LEFT_SHIN = 2,
  /**
   * leftHamstring
   */
  LEFT_HAMSTRING = 3,
  /**
   * leftQuad
   */
  LEFT_QUAD = 4,
  /**
   * leftGlute
   */
  LEFT_GLUTE = 5,
  /**
   * rightLeg
   */
  RIGHT_LEG = 6,
  /**
   * rightCalf
   */
  RIGHT_CALF = 7,
  /**
   * rightShin
   */
  RIGHT_SHIN = 8,
  /**
   * rightHamstring
   */
  RIGHT_HAMSTRING = 9,
  /**
   * rightQuad
   */
  RIGHT_QUAD = 10,
  /**
   * rightGlute
   */
  RIGHT_GLUTE = 11,
  /**
   * torsoBack
   */
  TORSO_BACK = 12,
  /**
   * leftLowerBack
   */
  LEFT_LOWER_BACK = 13,
  /**
   * leftUpperBack
   */
  LEFT_UPPER_BACK = 14,
  /**
   * rightLowerBack
   */
  RIGHT_LOWER_BACK = 15,
  /**
   * rightUpperBack
   */
  RIGHT_UPPER_BACK = 16,
  /**
   * torsoFront
   */
  TORSO_FRONT = 17,
  /**
   * leftAbdomen
   */
  LEFT_ABDOMEN = 18,
  /**
   * leftChest
   */
  LEFT_CHEST = 19,
  /**
   * rightAbdomen
   */
  RIGHT_ABDOMEN = 20,
  /**
   * rightChest
   */
  RIGHT_CHEST = 21,
  /**
   * leftArm
   */
  LEFT_ARM = 22,
  /**
   * leftShoulder
   */
  LEFT_SHOULDER = 23,
  /**
   * leftBicep
   */
  LEFT_BICEP = 24,
  /**
   * leftTricep
   */
  LEFT_TRICEP = 25,
  /**
   * leftBrachioradialis (Left anterior forearm)
   */
  LEFT_BRACHIORADIALIS = 26,
  /**
   * leftForearmExtensors (Left posterior forearm)
   */
  LEFT_FOREARM_EXTENSORS = 27,
  /**
   * rightArm
   */
  RIGHT_ARM = 28,
  /**
   * rightShoulder
   */
  RIGHT_SHOULDER = 29,
  /**
   * rightBicep
   */
  RIGHT_BICEP = 30,
  /**
   * rightTricep
   */
  RIGHT_TRICEP = 31,
  /**
   * rightBrachioradialis (Right anterior forearm)
   */
  RIGHT_BRACHIORADIALIS = 32,
  /**
   * rightForearmExtensors (Right posterior forearm)
   */
  RIGHT_FOREARM_EXTENSORS = 33,
  /**
   * neck
   */
  NECK = 34,
  /**
   * throat
   */
  THROAT = 35,
  /**
   * waistMidBack
   */
  WAIST_MID_BACK = 36,
  /**
   * waistFront
   */
  WAIST_FRONT = 37,
  /**
   * waistLeft
   */
  WAIST_LEFT = 38,
  /**
   * waistRight
   */
  WAIST_RIGHT = 39,
}

export enum SegmentLapStatus {
  /**
   * end
   */
  END = 0,
  /**
   * fail
   */
  FAIL = 1,
}

export enum SegmentLeaderboardType {
  /**
   * overall
   */
  OVERALL = 0,
  /**
   * personalBest
   */
  PERSONAL_BEST = 1,
  /**
   * connections
   */
  CONNECTIONS = 2,
  /**
   * group
   */
  GROUP = 3,
  /**
   * challenger
   */
  CHALLENGER = 4,
  /**
   * kom
   */
  KOM = 5,
  /**
   * qom
   */
  QOM = 6,
  /**
   * pr
   */
  PR = 7,
  /**
   * goal
   */
  GOAL = 8,
  /**
   * carrot
   */
  CARROT = 9,
  /**
   * clubLeader
   */
  CLUB_LEADER = 10,
  /**
   * rival
   */
  RIVAL = 11,
  /**
   * last
   */
  LAST = 12,
  /**
   * recentBest
   */
  RECENT_BEST = 13,
  /**
   * courseRecord
   */
  COURSE_RECORD = 14,
}

export enum SegmentDeleteStatus {
  /**
   * doNotDelete
   */
  DO_NOT_DELETE = 0,
  /**
   * deleteOne
   */
  DELETE_ONE = 1,
  /**
   * deleteAll
   */
  DELETE_ALL = 2,
}

export enum SegmentSelectionType {
  /**
   * starred
   */
  STARRED = 0,
  /**
   * suggested
   */
  SUGGESTED = 1,
}

export enum SourceType {
  /**
   * ant (External device connected with ANT)
   */
  ANT = 0,
  /**
   * antplus (External device connected with ANT+)
   */
  ANTPLUS = 1,
  /**
   * bluetooth (External device connected with BT)
   */
  BLUETOOTH = 2,
  /**
   * bluetoothLowEnergy (External device connected with BLE)
   */
  BLUETOOTH_LOW_ENERGY = 3,
  /**
   * wifi (External device connected with Wifi)
   */
  WIFI = 4,
  /**
   * local (Onboard device)
   */
  LOCAL = 5,
}

export enum LocalDeviceType {
  /**
   * gps (Onboard gps receiver)
   */
  GPS = 0,
  /**
   * glonass (Onboard glonass receiver)
   */
  GLONASS = 1,
  /**
   * gpsGlonass (Onboard gps glonass receiver)
   */
  GPS_GLONASS = 2,
  /**
   * accelerometer (Onboard sensor)
   */
  ACCELEROMETER = 3,
  /**
   * barometer (Onboard sensor)
   */
  BAROMETER = 4,
  /**
   * temperature (Onboard sensor)
   */
  TEMPERATURE = 5,
  /**
   * whr (Onboard wrist HR sensor)
   */
  WHR = 10,
  /**
   * sensorHub (Onboard software package)
   */
  SENSOR_HUB = 12,
}

export enum BleDeviceType {
  /**
   * connectedGps (GPS that is provided over a proprietary bluetooth service)
   */
  CONNECTED_GPS = 0,
  /**
   * heartRate
   */
  HEART_RATE = 1,
  /**
   * bikePower
   */
  BIKE_POWER = 2,
  /**
   * bikeSpeedCadence
   */
  BIKE_SPEED_CADENCE = 3,
  /**
   * bikeSpeed
   */
  BIKE_SPEED = 4,
  /**
   * bikeCadence
   */
  BIKE_CADENCE = 5,
  /**
   * footpod
   */
  FOOT_POD = 6,
  /**
   * bikeTrainer (Indoor-Bike FTMS protocol)
   */
  BIKE_TRAINER = 7,
}

export enum AntChannelId {
  /**
   * antExtendedDeviceNumberUpperNibble
   */
  ANT_EXTENDED_DEVICE_NUMBER_UPPER_NIBBLE = 0xf0000000,
  /**
   * antTransmissionTypeLowerNibble
   */
  ANT_TRANSMISSION_TYPE_LOWER_NIBBLE = 0x0f000000,
  /**
   * antDeviceType
   */
  ANT_DEVICE_TYPE = 0x00ff0000,
  /**
   * antDeviceNumber
   */
  ANT_DEVICE_NUMBER = 0x0000ffff,
}

export enum DisplayOrientation {
  /**
   * auto (automatic if the device supports it)
   */
  AUTO = 0,
  /**
   * portrait
   */
  PORTRAIT = 1,
  /**
   * landscape
   */
  LANDSCAPE = 2,
  /**
   * portraitFlipped (portrait mode but rotated 180 degrees)
   */
  PORTRAIT_FLIPPED = 3,
  /**
   * landscapeFlipped (landscape mode but rotated 180 degrees)
   */
  LANDSCAPE_FLIPPED = 4,
}

export enum WorkoutEquipment {
  /**
   * none
   */
  NONE = 0,
  /**
   * swimFins
   */
  SWIM_FINS = 1,
  /**
   * swimKickboard
   */
  SWIM_KICKBOARD = 2,
  /**
   * swimPaddles
   */
  SWIM_PADDLES = 3,
  /**
   * swimPullBuoy
   */
  SWIM_PULL_BUOY = 4,
  /**
   * swimSnorkel
   */
  SWIM_SNORKEL = 5,
}

export enum WatchfaceMode {
  /**
   * digital
   */
  DIGITAL = 0,
  /**
   * analog
   */
  ANALOG = 1,
  /**
   * connectIq
   */
  CONNECT_IQ = 2,
  /**
   * disabled
   */
  DISABLED = 3,
}

export enum DigitalWatchfaceLayout {
  /**
   * traditional
   */
  TRADITIONAL = 0,
  /**
   * modern
   */
  MODERN = 1,
  /**
   * bold
   */
  BOLD = 2,
}

export enum AnalogWatchfaceLayout {
  /**
   * minimal
   */
  MINIMAL = 0,
  /**
   * traditional
   */
  TRADITIONAL = 1,
  /**
   * modern
   */
  MODERN = 2,
}

export enum RiderPositionType {
  /**
   * seated
   */
  SEATED = 0,
  /**
   * standing
   */
  STANDING = 1,
  /**
   * transitionToSeated
   */
  TRANSITION_TO_SEATED = 2,
  /**
   * transitionToStanding
   */
  TRANSITION_TO_STANDING = 3,
}

export enum PowerPhaseType {
  /**
   * powerPhaseStartAngle
   */
  POWER_PHASE_START_ANGLE = 0,
  /**
   * powerPhaseEndAngle
   */
  POWER_PHASE_END_ANGLE = 1,
  /**
   * powerPhaseArcLength
   */
  POWER_PHASE_ARC_LENGTH = 2,
  /**
   * powerPhaseCenter
   */
  POWER_PHASE_CENTER = 3,
}

export enum CameraEventType {
  /**
   * videoStart (Start of video recording)
   */
  VIDEO_START = 0,
  /**
   * videoSplit (Mark of video file split (end of one file, beginning of the other))
   */
  VIDEO_SPLIT = 1,
  /**
   * videoEnd (End of video recording)
   */
  VIDEO_END = 2,
  /**
   * photoTaken (Still photo taken)
   */
  PHOTO_TAKEN = 3,
  /**
   * videoSecondStreamStart
   */
  VIDEO_SECOND_STREAM_START = 4,
  /**
   * videoSecondStreamSplit
   */
  VIDEO_SECOND_STREAM_SPLIT = 5,
  /**
   * videoSecondStreamEnd
   */
  VIDEO_SECOND_STREAM_END = 6,
  /**
   * videoSplitStart (Mark of video file split start)
   */
  VIDEO_SPLIT_START = 7,
  /**
   * videoSecondStreamSplitStart
   */
  VIDEO_SECOND_STREAM_SPLIT_START = 8,
  /**
   * videoPause (Mark when a video recording has been paused)
   */
  VIDEO_PAUSE = 11,
  /**
   * videoSecondStreamPause
   */
  VIDEO_SECOND_STREAM_PAUSE = 12,
  /**
   * videoResume (Mark when a video recording has been resumed)
   */
  VIDEO_RESUME = 13,
  /**
   * videoSecondStreamResume
   */
  VIDEO_SECOND_STREAM_RESUME = 14,
}

export enum SensorType {
  /**
   * accelerometer
   */
  ACCELEROMETER = 0,
  /**
   * gyroscope
   */
  GYROSCOPE = 1,
  /**
   * compass (Magnetometer)
   */
  COMPASS = 2,
  /**
   * barometer
   */
  BAROMETER = 3,
}

export enum BikeLightNetworkConfigType {
  /**
   * auto
   */
  AUTO = 0,
  /**
   * individual
   */
  INDIVIDUAL = 4,
  /**
   * highVisibility
   */
  HIGH_VISIBILITY = 5,
  /**
   * trail
   */
  TRAIL = 6,
}

export enum CommTimeoutType {
  /**
   * wildcardPairingTimeout (Timeout pairing to any device)
   */
  WILDCARD_PAIRING_TIMEOUT = 0,
  /**
   * pairingTimeout (Timeout pairing to previously paired device)
   */
  PAIRING_TIMEOUT = 1,
  /**
   * connectionLost (Temporary loss of communications)
   */
  CONNECTION_LOST = 2,
  /**
   * connectionTimeout (Connection closed due to extended bad communications)
   */
  CONNECTION_TIMEOUT = 3,
}

export enum CameraOrientationType {
  /**
   * cameraOrientation0
   */
  CAMERA_ORIENTATION_0 = 0,
  /**
   * cameraOrientation90
   */
  CAMERA_ORIENTATION_90 = 1,
  /**
   * cameraOrientation180
   */
  CAMERA_ORIENTATION_180 = 2,
  /**
   * cameraOrientation270
   */
  CAMERA_ORIENTATION_270 = 3,
}

export enum AttitudeStage {
  /**
   * failed
   */
  FAILED = 0,
  /**
   * aligning
   */
  ALIGNING = 1,
  /**
   * degraded
   */
  DEGRADED = 2,
  /**
   * valid
   */
  VALID = 3,
}

export enum AttitudeValidity {
  /**
   * trackAngleHeadingValid
   */
  TRACK_ANGLE_HEADING_VALID = 0x0001,
  /**
   * pitchValid
   */
  PITCH_VALID = 0x0002,
  /**
   * rollValid
   */
  ROLL_VALID = 0x0004,
  /**
   * lateralBodyAccelValid
   */
  LATERAL_BODY_ACCEL_VALID = 0x0008,
  /**
   * normalBodyAccelValid
   */
  NORMAL_BODY_ACCEL_VALID = 0x0010,
  /**
   * turnRateValid
   */
  TURN_RATE_VALID = 0x0020,
  /**
   * hwFail
   */
  HW_FAIL = 0x0040,
  /**
   * magInvalid
   */
  MAG_INVALID = 0x0080,
  /**
   * noGps
   */
  NO_GPS = 0x0100,
  /**
   * gpsInvalid
   */
  GPS_INVALID = 0x0200,
  /**
   * solutionCoasting
   */
  SOLUTION_COASTING = 0x0400,
  /**
   * trueTrackAngle
   */
  TRUE_TRACK_ANGLE = 0x0800,
  /**
   * magneticHeading
   */
  MAGNETIC_HEADING = 0x1000,
}

export enum AutoSyncFrequency {
  /**
   * never
   */
  NEVER = 0,
  /**
   * occasionally
   */
  OCCASIONALLY = 1,
  /**
   * frequent
   */
  FREQUENT = 2,
  /**
   * onceADay
   */
  ONCE_A_DAY = 3,
  /**
   * remote
   */
  REMOTE = 4,
}

export enum ExdLayout {
  /**
   * fullScreen
   */
  FULL_SCREEN = 0,
  /**
   * halfVertical
   */
  HALF_VERTICAL = 1,
  /**
   * halfHorizontal
   */
  HALF_HORIZONTAL = 2,
  /**
   * halfVerticalRightSplit
   */
  HALF_VERTICAL_RIGHT_SPLIT = 3,
  /**
   * halfHorizontalBottomSplit
   */
  HALF_HORIZONTAL_BOTTOM_SPLIT = 4,
  /**
   * fullQuarterSplit
   */
  FULL_QUARTER_SPLIT = 5,
  /**
   * halfVerticalLeftSplit
   */
  HALF_VERTICAL_LEFT_SPLIT = 6,
  /**
   * halfHorizontalTopSplit
   */
  HALF_HORIZONTAL_TOP_SPLIT = 7,
  /**
   * dynamic (The EXD may display the configured concepts in any layout it sees fit.)
   */
  DYNAMIC = 8,
}

export enum ExdDisplayType {
  /**
   * numerical
   */
  NUMERICAL = 0,
  /**
   * simple
   */
  SIMPLE = 1,
  /**
   * graph
   */
  GRAPH = 2,
  /**
   * bar
   */
  BAR = 3,
  /**
   * circleGraph
   */
  CIRCLE_GRAPH = 4,
  /**
   * virtualPartner
   */
  VIRTUAL_PARTNER = 5,
  /**
   * balance
   */
  BALANCE = 6,
  /**
   * stringList
   */
  STRING_LIST = 7,
  /**
   * string
   */
  STRING = 8,
  /**
   * simpleDynamicIcon
   */
  SIMPLE_DYNAMIC_ICON = 9,
  /**
   * gauge
   */
  GAUGE = 10,
}

export enum ExdDataUnits {
  /**
   * noUnits
   */
  NO_UNITS = 0,
  /**
   * laps
   */
  LAPS = 1,
  /**
   * milesPerHour
   */
  MILES_PER_HOUR = 2,
  /**
   * kilometersPerHour
   */
  KILOMETERS_PER_HOUR = 3,
  /**
   * feetPerHour
   */
  FEET_PER_HOUR = 4,
  /**
   * metersPerHour
   */
  METERS_PER_HOUR = 5,
  /**
   * degreesCelsius
   */
  DEGREES_CELSIUS = 6,
  /**
   * degreesFarenheit
   */
  DEGREES_FARENHEIT = 7,
  /**
   * zone
   */
  ZONE = 8,
  /**
   * gear
   */
  GEAR = 9,
  /**
   * rpm
   */
  RPM = 10,
  /**
   * bpm
   */
  BPM = 11,
  /**
   * degrees
   */
  DEGREES = 12,
  /**
   * millimeters
   */
  MILLIMETERS = 13,
  /**
   * meters
   */
  METERS = 14,
  /**
   * kilometers
   */
  KILOMETERS = 15,
  /**
   * feet
   */
  FEET = 16,
  /**
   * yards
   */
  YARDS = 17,
  /**
   * kilofeet
   */
  KILOFEET = 18,
  /**
   * miles
   */
  MILES = 19,
  /**
   * time
   */
  TIME = 20,
  /**
   * enumTurnType
   */
  ENUM_TURN_TYPE = 21,
  /**
   * percent
   */
  PERCENT = 22,
  /**
   * watts
   */
  WATTS = 23,
  /**
   * wattsPerKilogram
   */
  WATTS_PER_KILOGRAM = 24,
  /**
   * enumBatteryStatus
   */
  ENUM_BATTERY_STATUS = 25,
  /**
   * enumBikeLightBeamAngleMode
   */
  ENUM_BIKE_LIGHT_BEAM_ANGLE_MODE = 26,
  /**
   * enumBikeLightBatteryStatus
   */
  ENUM_BIKE_LIGHT_BATTERY_STATUS = 27,
  /**
   * enumBikeLightNetworkConfigType
   */
  ENUM_BIKE_LIGHT_NETWORK_CONFIG_TYPE = 28,
  /**
   * lights
   */
  LIGHTS = 29,
  /**
   * seconds
   */
  SECONDS = 30,
  /**
   * minutes
   */
  MINUTES = 31,
  /**
   * hours
   */
  HOURS = 32,
  /**
   * calories
   */
  CALORIES = 33,
  /**
   * kilojoules
   */
  KILOJOULES = 34,
  /**
   * milliseconds
   */
  MILLISECONDS = 35,
  /**
   * secondPerMile
   */
  SECOND_PER_MILE = 36,
  /**
   * secondPerKilometer
   */
  SECOND_PER_KILOMETER = 37,
  /**
   * centimeter
   */
  CENTIMETER = 38,
  /**
   * enumCoursePoint
   */
  ENUM_COURSE_POINT = 39,
  /**
   * bradians
   */
  BRADIANS = 40,
  /**
   * enumSport
   */
  ENUM_SPORT = 41,
  /**
   * inchesHg
   */
  INCHES_HG = 42,
  /**
   * mmHg
   */
  MM_HG = 43,
  /**
   * mbars
   */
  MBARS = 44,
  /**
   * hectoPascals
   */
  HECTO_PASCALS = 45,
  /**
   * feetPerMin
   */
  FEET_PER_MIN = 46,
  /**
   * metersPerMin
   */
  METERS_PER_MIN = 47,
  /**
   * metersPerSec
   */
  METERS_PER_SEC = 48,
  /**
   * eightCardinal
   */
  EIGHT_CARDINAL = 49,
}

export enum ExdQualifiers {
  /**
   * noQualifier
   */
  NO_QUALIFIER = 0,
  /**
   * instantaneous
   */
  INSTANTANEOUS = 1,
  /**
   * average
   */
  AVERAGE = 2,
  /**
   * lap
   */
  LAP = 3,
  /**
   * maximum
   */
  MAXIMUM = 4,
  /**
   * maximumAverage
   */
  MAXIMUM_AVERAGE = 5,
  /**
   * maximumLap
   */
  MAXIMUM_LAP = 6,
  /**
   * lastLap
   */
  LAST_LAP = 7,
  /**
   * averageLap
   */
  AVERAGE_LAP = 8,
  /**
   * toDestination
   */
  TO_DESTINATION = 9,
  /**
   * toGo
   */
  TO_GO = 10,
  /**
   * toNext
   */
  TO_NEXT = 11,
  /**
   * nextCoursePoint
   */
  NEXT_COURSE_POINT = 12,
  /**
   * total
   */
  TOTAL = 13,
  /**
   * threeSecondAverage
   */
  THREE_SECOND_AVERAGE = 14,
  /**
   * tenSecondAverage
   */
  TEN_SECOND_AVERAGE = 15,
  /**
   * thirtySecondAverage
   */
  THIRTY_SECOND_AVERAGE = 16,
  /**
   * percentMaximum
   */
  PERCENT_MAXIMUM = 17,
  /**
   * percentMaximumAverage
   */
  PERCENT_MAXIMUM_AVERAGE = 18,
  /**
   * lapPercentMaximum
   */
  LAP_PERCENT_MAXIMUM = 19,
  /**
   * elapsed
   */
  ELAPSED = 20,
  /**
   * sunrise
   */
  SUNRISE = 21,
  /**
   * sunset
   */
  SUNSET = 22,
  /**
   * comparedToVirtualPartner
   */
  COMPARED_TO_VIRTUAL_PARTNER = 23,
  /**
   * maximum24h
   */
  MAXIMUM_24H = 24,
  /**
   * minimum24h
   */
  MINIMUM_24H = 25,
  /**
   * minimum
   */
  MINIMUM = 26,
  /**
   * first
   */
  FIRST = 27,
  /**
   * second
   */
  SECOND = 28,
  /**
   * third
   */
  THIRD = 29,
  /**
   * shifter
   */
  SHIFTER = 30,
  /**
   * lastSport
   */
  LAST_SPORT = 31,
  /**
   * moving
   */
  MOVING = 32,
  /**
   * stopped
   */
  STOPPED = 33,
  /**
   * estimatedTotal
   */
  ESTIMATED_TOTAL = 34,
  /**
   * zone9
   */
  ZONE_9 = 242,
  /**
   * zone8
   */
  ZONE_8 = 243,
  /**
   * zone7
   */
  ZONE_7 = 244,
  /**
   * zone6
   */
  ZONE_6 = 245,
  /**
   * zone5
   */
  ZONE_5 = 246,
  /**
   * zone4
   */
  ZONE_4 = 247,
  /**
   * zone3
   */
  ZONE_3 = 248,
  /**
   * zone2
   */
  ZONE_2 = 249,
  /**
   * zone1
   */
  ZONE_1 = 250,
}

export enum ExdDescriptors {
  /**
   * bikeLightBatteryStatus
   */
  BIKE_LIGHT_BATTERY_STATUS = 0,
  /**
   * beamAngleStatus
   */
  BEAM_ANGLE_STATUS = 1,
  /**
   * bateryLevel
   */
  BATERY_LEVEL = 2,
  /**
   * lightNetworkMode
   */
  LIGHT_NETWORK_MODE = 3,
  /**
   * numberLightsConnected
   */
  NUMBER_LIGHTS_CONNECTED = 4,
  /**
   * cadence
   */
  CADENCE = 5,
  /**
   * distance
   */
  DISTANCE = 6,
  /**
   * estimatedTimeOfArrival
   */
  ESTIMATED_TIME_OF_ARRIVAL = 7,
  /**
   * heading
   */
  HEADING = 8,
  /**
   * time
   */
  TIME = 9,
  /**
   * batteryLevel
   */
  BATTERY_LEVEL = 10,
  /**
   * trainerResistance
   */
  TRAINER_RESISTANCE = 11,
  /**
   * trainerTargetPower
   */
  TRAINER_TARGET_POWER = 12,
  /**
   * timeSeated
   */
  TIME_SEATED = 13,
  /**
   * timeStanding
   */
  TIME_STANDING = 14,
  /**
   * elevation
   */
  ELEVATION = 15,
  /**
   * grade
   */
  GRADE = 16,
  /**
   * ascent
   */
  ASCENT = 17,
  /**
   * descent
   */
  DESCENT = 18,
  /**
   * verticalSpeed
   */
  VERTICAL_SPEED = 19,
  /**
   * di2BatteryLevel
   */
  DI2_BATTERY_LEVEL = 20,
  /**
   * frontGear
   */
  FRONT_GEAR = 21,
  /**
   * rearGear
   */
  REAR_GEAR = 22,
  /**
   * gearRatio
   */
  GEAR_RATIO = 23,
  /**
   * heartRate
   */
  HEART_RATE = 24,
  /**
   * heartRateZone
   */
  HEART_RATE_ZONE = 25,
  /**
   * timeInHeartRateZone
   */
  TIME_IN_HEART_RATE_ZONE = 26,
  /**
   * heartRateReserve
   */
  HEART_RATE_RESERVE = 27,
  /**
   * calories
   */
  CALORIES = 28,
  /**
   * gpsAccuracy
   */
  GPS_ACCURACY = 29,
  /**
   * gpsSignalStrength
   */
  GPS_SIGNAL_STRENGTH = 30,
  /**
   * temperature
   */
  TEMPERATURE = 31,
  /**
   * timeOfDay
   */
  TIME_OF_DAY = 32,
  /**
   * balance
   */
  BALANCE = 33,
  /**
   * pedalSmoothness
   */
  PEDAL_SMOOTHNESS = 34,
  /**
   * power
   */
  POWER = 35,
  /**
   * functionalThresholdPower
   */
  FUNCTIONAL_THRESHOLD_POWER = 36,
  /**
   * intensityFactor
   */
  INTENSITY_FACTOR = 37,
  /**
   * work
   */
  WORK = 38,
  /**
   * powerRatio
   */
  POWER_RATIO = 39,
  /**
   * normalizedPower
   */
  NORMALIZED_POWER = 40,
  /**
   * trainingStressScore
   */
  TRAINING_STRESS_SCORE = 41,
  /**
   * timeOnZone
   */
  TIME_ON_ZONE = 42,
  /**
   * speed
   */
  SPEED = 43,
  /**
   * laps
   */
  LAPS = 44,
  /**
   * reps
   */
  REPS = 45,
  /**
   * workoutStep
   */
  WORKOUT_STEP = 46,
  /**
   * courseDistance
   */
  COURSE_DISTANCE = 47,
  /**
   * navigationDistance
   */
  NAVIGATION_DISTANCE = 48,
  /**
   * courseEstimatedTimeOfArrival
   */
  COURSE_ESTIMATED_TIME_OF_ARRIVAL = 49,
  /**
   * navigationEstimatedTimeOfArrival
   */
  NAVIGATION_ESTIMATED_TIME_OF_ARRIVAL = 50,
  /**
   * courseTime
   */
  COURSE_TIME = 51,
  /**
   * navigationTime
   */
  NAVIGATION_TIME = 52,
  /**
   * courseHeading
   */
  COURSE_HEADING = 53,
  /**
   * navigationHeading
   */
  NAVIGATION_HEADING = 54,
  /**
   * powerZone
   */
  POWER_ZONE = 55,
  /**
   * torqueEffectiveness
   */
  TORQUE_EFFECTIVENESS = 56,
  /**
   * timerTime
   */
  TIMER_TIME = 57,
  /**
   * powerWeightRatio
   */
  POWER_WEIGHT_RATIO = 58,
  /**
   * leftPlatformCenterOffset
   */
  LEFT_PLATFORM_CENTER_OFFSET = 59,
  /**
   * rightPlatformCenterOffset
   */
  RIGHT_PLATFORM_CENTER_OFFSET = 60,
  /**
   * leftPowerPhaseStartAngle
   */
  LEFT_POWER_PHASE_START_ANGLE = 61,
  /**
   * rightPowerPhaseStartAngle
   */
  RIGHT_POWER_PHASE_START_ANGLE = 62,
  /**
   * leftPowerPhaseFinishAngle
   */
  LEFT_POWER_PHASE_FINISH_ANGLE = 63,
  /**
   * rightPowerPhaseFinishAngle
   */
  RIGHT_POWER_PHASE_FINISH_ANGLE = 64,
  /**
   * gears (Combined gear information)
   */
  GEARS = 65,
  /**
   * pace
   */
  PACE = 66,
  /**
   * trainingEffect
   */
  TRAINING_EFFECT = 67,
  /**
   * verticalOscillation
   */
  VERTICAL_OSCILLATION = 68,
  /**
   * verticalRatio
   */
  VERTICAL_RATIO = 69,
  /**
   * groundContactTime
   */
  GROUND_CONTACT_TIME = 70,
  /**
   * leftGroundContactTimeBalance
   */
  LEFT_GROUND_CONTACT_TIME_BALANCE = 71,
  /**
   * rightGroundContactTimeBalance
   */
  RIGHT_GROUND_CONTACT_TIME_BALANCE = 72,
  /**
   * strideLength
   */
  STRIDE_LENGTH = 73,
  /**
   * runningCadence
   */
  RUNNING_CADENCE = 74,
  /**
   * performanceCondition
   */
  PERFORMANCE_CONDITION = 75,
  /**
   * courseType
   */
  COURSE_TYPE = 76,
  /**
   * timeInPowerZone
   */
  TIME_IN_POWER_ZONE = 77,
  /**
   * navigationTurn
   */
  NAVIGATION_TURN = 78,
  /**
   * courseLocation
   */
  COURSE_LOCATION = 79,
  /**
   * navigationLocation
   */
  NAVIGATION_LOCATION = 80,
  /**
   * compass
   */
  COMPASS = 81,
  /**
   * gearCombo
   */
  GEAR_COMBO = 82,
  /**
   * muscleOxygen
   */
  MUSCLE_OXYGEN = 83,
  /**
   * icon
   */
  ICON = 84,
  /**
   * compassHeading
   */
  COMPASS_HEADING = 85,
  /**
   * gpsHeading
   */
  GPS_HEADING = 86,
  /**
   * gpsElevation
   */
  GPS_ELEVATION = 87,
  /**
   * anaerobicTrainingEffect
   */
  ANAEROBIC_TRAINING_EFFECT = 88,
  /**
   * course
   */
  COURSE = 89,
  /**
   * offCourse
   */
  OFF_COURSE = 90,
  /**
   * glideRatio
   */
  GLIDE_RATIO = 91,
  /**
   * verticalDistance
   */
  VERTICAL_DISTANCE = 92,
  /**
   * vmg
   */
  VMG = 93,
  /**
   * ambientPressure
   */
  AMBIENT_PRESSURE = 94,
  /**
   * pressure
   */
  PRESSURE = 95,
  /**
   * vam
   */
  VAM = 96,
}

export enum AutoActivityDetect {
  /**
   * none
   */
  NONE = 0x00000000,
  /**
   * running
   */
  RUNNING = 0x00000001,
  /**
   * cycling
   */
  CYCLING = 0x00000002,
  /**
   * swimming
   */
  SWIMMING = 0x00000004,
  /**
   * walking
   */
  WALKING = 0x00000008,
  /**
   * elliptical
   */
  ELLIPTICAL = 0x00000020,
  /**
   * sedentary
   */
  SEDENTARY = 0x00000400,
}

export enum SupportedExdScreenLayouts {
  /**
   * fullScreen
   */
  FULL_SCREEN = 0x00000001,
  /**
   * halfVertical
   */
  HALF_VERTICAL = 0x00000002,
  /**
   * halfHorizontal
   */
  HALF_HORIZONTAL = 0x00000004,
  /**
   * halfVerticalRightSplit
   */
  HALF_VERTICAL_RIGHT_SPLIT = 0x00000008,
  /**
   * halfHorizontalBottomSplit
   */
  HALF_HORIZONTAL_BOTTOM_SPLIT = 0x00000010,
  /**
   * fullQuarterSplit
   */
  FULL_QUARTER_SPLIT = 0x00000020,
  /**
   * halfVerticalLeftSplit
   */
  HALF_VERTICAL_LEFT_SPLIT = 0x00000040,
  /**
   * halfHorizontalTopSplit
   */
  HALF_HORIZONTAL_TOP_SPLIT = 0x00000080,
}

export enum FitBaseType {
  /**
   * enum
   */
  ENUM = 0,
  /**
   * sint8
   */
  SINT8 = 1,
  /**
   * uint8
   */
  UINT8 = 2,
  /**
   * sint16
   */
  SINT16 = 131,
  /**
   * uint16
   */
  UINT16 = 132,
  /**
   * sint32
   */
  SINT32 = 133,
  /**
   * uint32
   */
  UINT32 = 134,
  /**
   * string
   */
  STRING = 7,
  /**
   * float32
   */
  FLOAT32 = 136,
  /**
   * float64
   */
  FLOAT64 = 137,
  /**
   * uint8z
   */
  UINT8Z = 10,
  /**
   * uint16z
   */
  UINT16Z = 139,
  /**
   * uint32z
   */
  UINT32Z = 140,
  /**
   * byte
   */
  BYTE = 13,
  /**
   * sint64
   */
  SINT64 = 142,
  /**
   * uint64
   */
  UINT64 = 143,
  /**
   * uint64z
   */
  UINT64Z = 144,
}

export enum TurnType {
  /**
   * arrivingIdx
   */
  ARRIVING_IDX = 0,
  /**
   * arrivingLeftIdx
   */
  ARRIVING_LEFT_IDX = 1,
  /**
   * arrivingRightIdx
   */
  ARRIVING_RIGHT_IDX = 2,
  /**
   * arrivingViaIdx
   */
  ARRIVING_VIA_IDX = 3,
  /**
   * arrivingViaLeftIdx
   */
  ARRIVING_VIA_LEFT_IDX = 4,
  /**
   * arrivingViaRightIdx
   */
  ARRIVING_VIA_RIGHT_IDX = 5,
  /**
   * bearKeepLeftIdx
   */
  BEAR_KEEP_LEFT_IDX = 6,
  /**
   * bearKeepRightIdx
   */
  BEAR_KEEP_RIGHT_IDX = 7,
  /**
   * continueIdx
   */
  CONTINUE_IDX = 8,
  /**
   * exitLeftIdx
   */
  EXIT_LEFT_IDX = 9,
  /**
   * exitRightIdx
   */
  EXIT_RIGHT_IDX = 10,
  /**
   * ferryIdx
   */
  FERRY_IDX = 11,
  /**
   * roundabout45Idx
   */
  ROUNDABOUT_45_IDX = 12,
  /**
   * roundabout90Idx
   */
  ROUNDABOUT_90_IDX = 13,
  /**
   * roundabout135Idx
   */
  ROUNDABOUT_135_IDX = 14,
  /**
   * roundabout180Idx
   */
  ROUNDABOUT_180_IDX = 15,
  /**
   * roundabout225Idx
   */
  ROUNDABOUT_225_IDX = 16,
  /**
   * roundabout270Idx
   */
  ROUNDABOUT_270_IDX = 17,
  /**
   * roundabout315Idx
   */
  ROUNDABOUT_315_IDX = 18,
  /**
   * roundabout360Idx
   */
  ROUNDABOUT_360_IDX = 19,
  /**
   * roundaboutNeg45Idx
   */
  ROUNDABOUT_NEG_45_IDX = 20,
  /**
   * roundaboutNeg90Idx
   */
  ROUNDABOUT_NEG_90_IDX = 21,
  /**
   * roundaboutNeg135Idx
   */
  ROUNDABOUT_NEG_135_IDX = 22,
  /**
   * roundaboutNeg180Idx
   */
  ROUNDABOUT_NEG_180_IDX = 23,
  /**
   * roundaboutNeg225Idx
   */
  ROUNDABOUT_NEG_225_IDX = 24,
  /**
   * roundaboutNeg270Idx
   */
  ROUNDABOUT_NEG_270_IDX = 25,
  /**
   * roundaboutNeg315Idx
   */
  ROUNDABOUT_NEG_315_IDX = 26,
  /**
   * roundaboutNeg360Idx
   */
  ROUNDABOUT_NEG_360_IDX = 27,
  /**
   * roundaboutGenericIdx
   */
  ROUNDABOUT_GENERIC_IDX = 28,
  /**
   * roundaboutNegGenericIdx
   */
  ROUNDABOUT_NEG_GENERIC_IDX = 29,
  /**
   * sharpTurnLeftIdx
   */
  SHARP_TURN_LEFT_IDX = 30,
  /**
   * sharpTurnRightIdx
   */
  SHARP_TURN_RIGHT_IDX = 31,
  /**
   * turnLeftIdx
   */
  TURN_LEFT_IDX = 32,
  /**
   * turnRightIdx
   */
  TURN_RIGHT_IDX = 33,
  /**
   * uturnLeftIdx
   */
  UTURN_LEFT_IDX = 34,
  /**
   * uturnRightIdx
   */
  UTURN_RIGHT_IDX = 35,
  /**
   * iconInvIdx
   */
  ICON_INV_IDX = 36,
  /**
   * iconIdxCnt
   */
  ICON_IDX_CNT = 37,
}

export enum BikeLightBeamAngleMode {
  /**
   * manual
   */
  MANUAL = 0,
  /**
   * auto
   */
  AUTO = 1,
}

export enum FitBaseUnit {
  /**
   * other
   */
  OTHER = 0,
  /**
   * kilogram
   */
  KILOGRAM = 1,
  /**
   * pound
   */
  POUND = 2,
}

export enum SetType {
  /**
   * rest
   */
  REST = 0,
  /**
   * active
   */
  ACTIVE = 1,
}

export enum MaxMetCategory {
  /**
   * generic
   */
  GENERIC = 0,
  /**
   * cycling
   */
  CYCLING = 1,
}

export enum ExerciseCategory {
  BENCH_PRESS = 0,
  CALF_RAISE = 1,
  CARDIO = 2,
  CARRY = 3,
  CHOP = 4,
  CORE = 5,
  CRUNCH = 6,
  CURL = 7,
  DEADLIFT = 8,
  FLYE = 9,
  HIP_RAISE = 10,
  HIP_STABILITY = 11,
  HIP_SWING = 12,
  HYPEREXTENSION = 13,
  LATERAL_RAISE = 14,
  LEG_CURL = 15,
  LEG_RAISE = 16,
  LUNGE = 17,
  OLYMPIC_LIFT = 18,
  PLANK = 19,
  PLYO = 20,
  PULL_UP = 21,
  PUSH_UP = 22,
  ROW = 23,
  SHOULDER_PRESS = 24,
  SHOULDER_STABILITY = 25,
  SHRUG = 26,
  SIT_UP = 27,
  SQUAT = 28,
  TOTAL_BODY = 29,
  TRICEPS_EXTENSION = 30,
  WARM_UP = 31,
  RUN = 32,
  BIKE = 33,
  CARDIO_SENSORS = 34,
  MOVE = 35,
  POSE = 36,
  BANDED_EXERCISES = 37,
  BATTLE_ROPE = 38,
  ELLIPTICAL = 39,
  FLOOR_CLIMB = 40,
  INDOOR_BIKE = 41,
  INDOOR_ROW = 42,
  LADDER = 43,
  SANDBAG = 44,
  SLED = 45,
  SLEDGE_HAMMER = 46,
  STAIR_STEPPER = 47,
  SUSPENSION = 49,
  TIRE = 50,
  RUN_INDOOR = 52,
  BIKE_OUTDOOR = 53,
  UNKNOWN = 65534,
}

export enum BenchPressExerciseName {
  ALTERNATING_DUMBBELL_CHEST_PRESS_ON_SWISS_BALL = 0,
  BARBELL_BENCH_PRESS = 1,
  BARBELL_BOARD_BENCH_PRESS = 2,
  BARBELL_FLOOR_PRESS = 3,
  CLOSE_GRIP_BARBELL_BENCH_PRESS = 4,
  DECLINE_DUMBBELL_BENCH_PRESS = 5,
  DUMBBELL_BENCH_PRESS = 6,
  DUMBBELL_FLOOR_PRESS = 7,
  INCLINE_BARBELL_BENCH_PRESS = 8,
  INCLINE_DUMBBELL_BENCH_PRESS = 9,
  INCLINE_SMITH_MACHINE_BENCH_PRESS = 10,
  ISOMETRIC_BARBELL_BENCH_PRESS = 11,
  KETTLEBELL_CHEST_PRESS = 12,
  NEUTRAL_GRIP_DUMBBELL_BENCH_PRESS = 13,
  NEUTRAL_GRIP_DUMBBELL_INCLINE_BENCH_PRESS = 14,
  ONE_ARM_FLOOR_PRESS = 15,
  WEIGHTED_ONE_ARM_FLOOR_PRESS = 16,
  PARTIAL_LOCKOUT = 17,
  REVERSE_GRIP_BARBELL_BENCH_PRESS = 18,
  REVERSE_GRIP_INCLINE_BENCH_PRESS = 19,
  SINGLE_ARM_CABLE_CHEST_PRESS = 20,
  SINGLE_ARM_DUMBBELL_BENCH_PRESS = 21,
  SMITH_MACHINE_BENCH_PRESS = 22,
  SWISS_BALL_DUMBBELL_CHEST_PRESS = 23,
  TRIPLE_STOP_BARBELL_BENCH_PRESS = 24,
  WIDE_GRIP_BARBELL_BENCH_PRESS = 25,
  ALTERNATING_DUMBBELL_CHEST_PRESS = 26,
}

export enum CalfRaiseExerciseName {
  _3_WAY_CALF_RAISE = 0,
  _3_WAY_WEIGHTED_CALF_RAISE = 1,
  _3_WAY_SINGLE_LEG_CALF_RAISE = 2,
  _3_WAY_WEIGHTED_SINGLE_LEG_CALF_RAISE = 3,
  DONKEY_CALF_RAISE = 4,
  WEIGHTED_DONKEY_CALF_RAISE = 5,
  SEATED_CALF_RAISE = 6,
  WEIGHTED_SEATED_CALF_RAISE = 7,
  SEATED_DUMBBELL_TOE_RAISE = 8,
  SINGLE_LEG_BENT_KNEE_CALF_RAISE = 9,
  WEIGHTED_SINGLE_LEG_BENT_KNEE_CALF_RAISE = 10,
  SINGLE_LEG_DECLINE_PUSH_UP = 11,
  SINGLE_LEG_DONKEY_CALF_RAISE = 12,
  WEIGHTED_SINGLE_LEG_DONKEY_CALF_RAISE = 13,
  SINGLE_LEG_HIP_RAISE_WITH_KNEE_HOLD = 14,
  SINGLE_LEG_STANDING_CALF_RAISE = 15,
  SINGLE_LEG_STANDING_DUMBBELL_CALF_RAISE = 16,
  STANDING_BARBELL_CALF_RAISE = 17,
  STANDING_CALF_RAISE = 18,
  WEIGHTED_STANDING_CALF_RAISE = 19,
  STANDING_DUMBBELL_CALF_RAISE = 20,
}

export enum CardioExerciseName {
  BOB_AND_WEAVE_CIRCLE = 0,
  WEIGHTED_BOB_AND_WEAVE_CIRCLE = 1,
  CARDIO_CORE_CRAWL = 2,
  WEIGHTED_CARDIO_CORE_CRAWL = 3,
  DOUBLE_UNDER = 4,
  WEIGHTED_DOUBLE_UNDER = 5,
  JUMP_ROPE = 6,
  WEIGHTED_JUMP_ROPE = 7,
  JUMP_ROPE_CROSSOVER = 8,
  WEIGHTED_JUMP_ROPE_CROSSOVER = 9,
  JUMP_ROPE_JOG = 10,
  WEIGHTED_JUMP_ROPE_JOG = 11,
  JUMPING_JACKS = 12,
  WEIGHTED_JUMPING_JACKS = 13,
  SKI_MOGULS = 14,
  WEIGHTED_SKI_MOGULS = 15,
  SPLIT_JACKS = 16,
  WEIGHTED_SPLIT_JACKS = 17,
  SQUAT_JACKS = 18,
  WEIGHTED_SQUAT_JACKS = 19,
  TRIPLE_UNDER = 20,
  WEIGHTED_TRIPLE_UNDER = 21,
  ELLIPTICAL = 22,
  SPINNING = 23,
  POLE_PADDLE_FORWARD_WHEELCHAIR = 24,
  POLE_PADDLE_BACKWARD_WHEELCHAIR = 25,
  POLE_HANDCYCLE_FORWARD_WHEELCHAIR = 26,
  POLE_HANDCYCLE_BACKWARD_WHEELCHAIR = 27,
  POLE_RAINBOW_WHEELCHAIR = 28,
  DOUBLE_PUNCH_FORWARD_WHEELCHAIR = 29,
  DOUBLE_PUNCH_DOWN_WHEELCHAIR = 30,
  DOUBLE_PUNCH_SIDEWAYS_WHEELCHAIR = 31,
  DOUBLE_PUNCH_UP_WHEELCHAIR = 32,
  SIT_SKI_WHEELCHAIR = 33,
  SITTING_JACKS_WHEELCHAIR = 34,
  PUNCH_FORWARD_WHEELCHAIR = 35,
  PUNCH_DOWN_WHEELCHAIR = 36,
  PUNCH_SIDEWAYS_WHEELCHAIR = 37,
  PUNCH_UP_WHEELCHAIR = 38,
  PUNCH_BAG_WHEELCHAIR = 39,
  POLE_DD_FF_UU_WHEELCHAIR = 40,
  BUTTERFLY_ARMS_WHEELCHAIR = 41,
  PUNCH = 42,
}

export enum CarryExerciseName {
  BAR_HOLDS = 0,
  FARMERS_WALK = 1,
  FARMERS_WALK_ON_TOES = 2,
  HEX_DUMBBELL_HOLD = 3,
  OVERHEAD_CARRY = 4,
  DUMBBELL_WAITER_CARRY = 5,
  FARMERS_CARRY_WALK_LUNGE = 6,
  FARMERS_CARRY = 7,
  FARMERS_CARRY_ON_TOES = 8,
}

export enum ChopExerciseName {
  CABLE_PULL_THROUGH = 0,
  CABLE_ROTATIONAL_LIFT = 1,
  CABLE_WOODCHOP = 2,
  CROSS_CHOP_TO_KNEE = 3,
  WEIGHTED_CROSS_CHOP_TO_KNEE = 4,
  DUMBBELL_CHOP = 5,
  HALF_KNEELING_ROTATION = 6,
  WEIGHTED_HALF_KNEELING_ROTATION = 7,
  HALF_KNEELING_ROTATIONAL_CHOP = 8,
  HALF_KNEELING_ROTATIONAL_REVERSE_CHOP = 9,
  HALF_KNEELING_STABILITY_CHOP = 10,
  HALF_KNEELING_STABILITY_REVERSE_CHOP = 11,
  KNEELING_ROTATIONAL_CHOP = 12,
  KNEELING_ROTATIONAL_REVERSE_CHOP = 13,
  KNEELING_STABILITY_CHOP = 14,
  KNEELING_WOODCHOPPER = 15,
  MEDICINE_BALL_WOOD_CHOPS = 16,
  POWER_SQUAT_CHOPS = 17,
  WEIGHTED_POWER_SQUAT_CHOPS = 18,
  STANDING_ROTATIONAL_CHOP = 19,
  STANDING_SPLIT_ROTATIONAL_CHOP = 20,
  STANDING_SPLIT_ROTATIONAL_REVERSE_CHOP = 21,
  STANDING_STABILITY_REVERSE_CHOP = 22,
}

export enum CoreExerciseName {
  ABS_JABS = 0,
  WEIGHTED_ABS_JABS = 1,
  ALTERNATING_PLATE_REACH = 2,
  BARBELL_ROLLOUT = 3,
  WEIGHTED_BARBELL_ROLLOUT = 4,
  BODY_BAR_OBLIQUE_TWIST = 5,
  CABLE_CORE_PRESS = 6,
  CABLE_SIDE_BEND = 7,
  SIDE_BEND = 8,
  WEIGHTED_SIDE_BEND = 9,
  CRESCENT_CIRCLE = 10,
  WEIGHTED_CRESCENT_CIRCLE = 11,
  CYCLING_RUSSIAN_TWIST = 12,
  WEIGHTED_CYCLING_RUSSIAN_TWIST = 13,
  ELEVATED_FEET_RUSSIAN_TWIST = 14,
  WEIGHTED_ELEVATED_FEET_RUSSIAN_TWIST = 15,
  HALF_TURKISH_GET_UP = 16,
  KETTLEBELL_WINDMILL = 17,
  KNEELING_AB_WHEEL = 18,
  WEIGHTED_KNEELING_AB_WHEEL = 19,
  MODIFIED_FRONT_LEVER = 20,
  OPEN_KNEE_TUCKS = 21,
  WEIGHTED_OPEN_KNEE_TUCKS = 22,
  SIDE_ABS_LEG_LIFT = 23,
  WEIGHTED_SIDE_ABS_LEG_LIFT = 24,
  SWISS_BALL_JACKKNIFE = 25,
  WEIGHTED_SWISS_BALL_JACKKNIFE = 26,
  SWISS_BALL_PIKE = 27,
  WEIGHTED_SWISS_BALL_PIKE = 28,
  SWISS_BALL_ROLLOUT = 29,
  WEIGHTED_SWISS_BALL_ROLLOUT = 30,
  TRIANGLE_HIP_PRESS = 31,
  WEIGHTED_TRIANGLE_HIP_PRESS = 32,
  TRX_SUSPENDED_JACKKNIFE = 33,
  WEIGHTED_TRX_SUSPENDED_JACKKNIFE = 34,
  U_BOAT = 35,
  WEIGHTED_U_BOAT = 36,
  WINDMILL_SWITCHES = 37,
  WEIGHTED_WINDMILL_SWITCHES = 38,
  ALTERNATING_SLIDE_OUT = 39,
  WEIGHTED_ALTERNATING_SLIDE_OUT = 40,
  GHD_BACK_EXTENSIONS = 41,
  WEIGHTED_GHD_BACK_EXTENSIONS = 42,
  OVERHEAD_WALK = 43,
  INCHWORM = 44,
  WEIGHTED_MODIFIED_FRONT_LEVER = 45,
  RUSSIAN_TWIST = 46,
  /**
   * abdominalLegRotations (Deprecated do not use)
   */
  ABDOMINAL_LEG_ROTATIONS = 47,
  ARM_AND_LEG_EXTENSION_ON_KNEES = 48,
  BICYCLE = 49,
  BICEP_CURL_WITH_LEG_EXTENSION = 50,
  CAT_COW = 51,
  CORKSCREW = 52,
  CRISS_CROSS = 53,
  /**
   * crissCrossWithBall (Deprecated do not use)
   */
  CRISS_CROSS_WITH_BALL = 54,
  DOUBLE_LEG_STRETCH = 55,
  KNEE_FOLDS = 56,
  LOWER_LIFT = 57,
  NECK_PULL = 58,
  PELVIC_CLOCKS = 59,
  ROLL_OVER = 60,
  ROLL_UP = 61,
  ROLLING = 62,
  ROWING_1 = 63,
  ROWING_2 = 64,
  SCISSORS = 65,
  SINGLE_LEG_CIRCLES = 66,
  SINGLE_LEG_STRETCH = 67,
  /**
   * snakeTwist1And2 (Deprecated do not use)
   */
  SNAKE_TWIST_1_AND_2 = 68,
  SWAN = 69,
  SWIMMING = 70,
  TEASER = 71,
  THE_HUNDRED = 72,
  BICEP_CURL_WITH_LEG_EXTENSION_WITH_WEIGHTS = 73,
  HANGING_L_SIT = 75,
  LOWER_LIFT_WITH_WEIGHTS = 77,
  RING_L_SIT = 79,
  ROWING_1_WITH_WEIGHTS = 80,
  ROWING_2_WITH_WEIGHTS = 81,
  SCISSORS_WITH_WEIGHTS = 82,
  SINGLE_LEG_STRETCH_WITH_WEIGHTS = 83,
  TOES_TO_ELBOWS = 84,
  WEIGHTED_CRISS_CROSS = 85,
  WEIGHTED_DOUBLE_LEG_STRETCH = 86,
  WEIGHTED_THE_HUNDRED = 87,
  L_SIT = 88,
  TURKISH_GET_UP = 89,
  WEIGHTED_RING_L_SIT = 90,
  WEIGHTED_HANGING_L_SIT = 91,
  WEIGHTED_L_SIT = 92,
  SEATED_SIDE_BEND = 96,
  SIDE_BEND_LOW_WHEELCHAIR = 93,
  SIDE_BEND_MID_WHEELCHAIR = 94,
  SIDE_BEND_HIGH_WHEELCHAIR = 95,
}

export enum CrunchExerciseName {
  BICYCLE_CRUNCH = 0,
  CABLE_CRUNCH = 1,
  CIRCULAR_ARM_CRUNCH = 2,
  CROSSED_ARMS_CRUNCH = 3,
  WEIGHTED_CROSSED_ARMS_CRUNCH = 4,
  CROSS_LEG_REVERSE_CRUNCH = 5,
  WEIGHTED_CROSS_LEG_REVERSE_CRUNCH = 6,
  CRUNCH_CHOP = 7,
  WEIGHTED_CRUNCH_CHOP = 8,
  DOUBLE_CRUNCH = 9,
  WEIGHTED_DOUBLE_CRUNCH = 10,
  ELBOW_TO_KNEE_CRUNCH = 11,
  WEIGHTED_ELBOW_TO_KNEE_CRUNCH = 12,
  FLUTTER_KICKS = 13,
  WEIGHTED_FLUTTER_KICKS = 14,
  FOAM_ROLLER_REVERSE_CRUNCH_ON_BENCH = 15,
  WEIGHTED_FOAM_ROLLER_REVERSE_CRUNCH_ON_BENCH = 16,
  FOAM_ROLLER_REVERSE_CRUNCH_WITH_DUMBBELL = 17,
  FOAM_ROLLER_REVERSE_CRUNCH_WITH_MEDICINE_BALL = 18,
  FROG_PRESS = 19,
  HANGING_KNEE_RAISE_OBLIQUE_CRUNCH = 20,
  WEIGHTED_HANGING_KNEE_RAISE_OBLIQUE_CRUNCH = 21,
  HIP_CROSSOVER = 22,
  WEIGHTED_HIP_CROSSOVER = 23,
  HOLLOW_ROCK = 24,
  WEIGHTED_HOLLOW_ROCK = 25,
  INCLINE_REVERSE_CRUNCH = 26,
  WEIGHTED_INCLINE_REVERSE_CRUNCH = 27,
  KNEELING_CABLE_CRUNCH = 28,
  KNEELING_CROSS_CRUNCH = 29,
  WEIGHTED_KNEELING_CROSS_CRUNCH = 30,
  KNEELING_OBLIQUE_CABLE_CRUNCH = 31,
  KNEES_TO_ELBOW = 32,
  LEG_EXTENSIONS = 33,
  WEIGHTED_LEG_EXTENSIONS = 34,
  LEG_LEVERS = 35,
  MCGILL_CURL_UP = 36,
  WEIGHTED_MCGILL_CURL_UP = 37,
  MODIFIED_PILATES_ROLL_UP_WITH_BALL = 38,
  WEIGHTED_MODIFIED_PILATES_ROLL_UP_WITH_BALL = 39,
  PILATES_CRUNCH = 40,
  WEIGHTED_PILATES_CRUNCH = 41,
  PILATES_ROLL_UP_WITH_BALL = 42,
  WEIGHTED_PILATES_ROLL_UP_WITH_BALL = 43,
  RAISED_LEGS_CRUNCH = 44,
  WEIGHTED_RAISED_LEGS_CRUNCH = 45,
  REVERSE_CRUNCH = 46,
  WEIGHTED_REVERSE_CRUNCH = 47,
  REVERSE_CRUNCH_ON_A_BENCH = 48,
  WEIGHTED_REVERSE_CRUNCH_ON_A_BENCH = 49,
  REVERSE_CURL_AND_LIFT = 50,
  WEIGHTED_REVERSE_CURL_AND_LIFT = 51,
  ROTATIONAL_LIFT = 52,
  WEIGHTED_ROTATIONAL_LIFT = 53,
  SEATED_ALTERNATING_REVERSE_CRUNCH = 54,
  WEIGHTED_SEATED_ALTERNATING_REVERSE_CRUNCH = 55,
  SEATED_LEG_U = 56,
  WEIGHTED_SEATED_LEG_U = 57,
  SIDE_TO_SIDE_CRUNCH_AND_WEAVE = 58,
  WEIGHTED_SIDE_TO_SIDE_CRUNCH_AND_WEAVE = 59,
  SINGLE_LEG_REVERSE_CRUNCH = 60,
  WEIGHTED_SINGLE_LEG_REVERSE_CRUNCH = 61,
  SKATER_CRUNCH_CROSS = 62,
  WEIGHTED_SKATER_CRUNCH_CROSS = 63,
  STANDING_CABLE_CRUNCH = 64,
  STANDING_SIDE_CRUNCH = 65,
  STEP_CLIMB = 66,
  WEIGHTED_STEP_CLIMB = 67,
  SWISS_BALL_CRUNCH = 68,
  SWISS_BALL_REVERSE_CRUNCH = 69,
  WEIGHTED_SWISS_BALL_REVERSE_CRUNCH = 70,
  SWISS_BALL_RUSSIAN_TWIST = 71,
  WEIGHTED_SWISS_BALL_RUSSIAN_TWIST = 72,
  SWISS_BALL_SIDE_CRUNCH = 73,
  WEIGHTED_SWISS_BALL_SIDE_CRUNCH = 74,
  THORACIC_CRUNCHES_ON_FOAM_ROLLER = 75,
  WEIGHTED_THORACIC_CRUNCHES_ON_FOAM_ROLLER = 76,
  TRICEPS_CRUNCH = 77,
  WEIGHTED_BICYCLE_CRUNCH = 78,
  WEIGHTED_CRUNCH = 79,
  WEIGHTED_SWISS_BALL_CRUNCH = 80,
  TOES_TO_BAR = 81,
  WEIGHTED_TOES_TO_BAR = 82,
  CRUNCH = 83,
  STRAIGHT_LEG_CRUNCH_WITH_BALL = 84,
  LEG_CLIMB_CRUNCH = 86,
}

export enum CurlExerciseName {
  ALTERNATING_DUMBBELL_BICEPS_CURL = 0,
  ALTERNATING_DUMBBELL_BICEPS_CURL_ON_SWISS_BALL = 1,
  ALTERNATING_INCLINE_DUMBBELL_BICEPS_CURL = 2,
  BARBELL_BICEPS_CURL = 3,
  BARBELL_REVERSE_WRIST_CURL = 4,
  BARBELL_WRIST_CURL = 5,
  BEHIND_THE_BACK_BARBELL_REVERSE_WRIST_CURL = 6,
  BEHIND_THE_BACK_ONE_ARM_CABLE_CURL = 7,
  CABLE_BICEPS_CURL = 8,
  CABLE_HAMMER_CURL = 9,
  CHEATING_BARBELL_BICEPS_CURL = 10,
  CLOSE_GRIP_EZ_BARBELL_BICEPS_CURL = 11,
  CROSS_BODY_DUMBBELL_HAMMER_CURL = 12,
  DEAD_HANG_BICEPS_CURL = 13,
  DECLINE_HAMMER_CURL = 14,
  DUMBBELL_BICEPS_CURL_WITH_STATIC_HOLD = 15,
  DUMBBELL_HAMMER_CURL = 16,
  DUMBBELL_REVERSE_WRIST_CURL = 17,
  DUMBBELL_WRIST_CURL = 18,
  EZ_BARBELL_PREACHER_CURL = 19,
  FORWARD_BEND_BICEPS_CURL = 20,
  HAMMER_CURL_TO_PRESS = 21,
  INCLINE_DUMBBELL_BICEPS_CURL = 22,
  INCLINE_OFFSET_THUMB_DUMBBELL_CURL = 23,
  KETTLEBELL_BICEPS_CURL = 24,
  LYING_CONCENTRATION_CABLE_CURL = 25,
  ONE_ARM_PREACHER_CURL = 26,
  PLATE_PINCH_CURL = 27,
  PREACHER_CURL_WITH_CABLE = 28,
  REVERSE_EZ_BARBELL_CURL = 29,
  REVERSE_GRIP_WRIST_CURL = 30,
  REVERSE_GRIP_BARBELL_BICEPS_CURL = 31,
  SEATED_ALTERNATING_DUMBBELL_BICEPS_CURL = 32,
  SEATED_DUMBBELL_BICEPS_CURL = 33,
  SEATED_REVERSE_DUMBBELL_CURL = 34,
  SPLIT_STANCE_OFFSET_PINKY_DUMBBELL_CURL = 35,
  STANDING_ALTERNATING_DUMBBELL_CURLS = 36,
  STANDING_DUMBBELL_BICEPS_CURL = 37,
  STANDING_EZ_BARBELL_BICEPS_CURL = 38,
  STATIC_CURL = 39,
  SWISS_BALL_DUMBBELL_OVERHEAD_TRICEPS_EXTENSION = 40,
  SWISS_BALL_EZ_BARBELL_PREACHER_CURL = 41,
  TWISTING_STANDING_DUMBBELL_BICEPS_CURL = 42,
  WIDE_GRIP_EZ_BARBELL_BICEPS_CURL = 43,
  ONE_ARM_CONCENTRATION_CURL = 44,
  STANDING_ZOTTMAN_BICEPS_CURL = 45,
  DUMBBELL_BICEPS_CURL = 46,
  DRAG_CURL_WHEELCHAIR = 47,
  DUMBBELL_BICEPS_CURL_WHEELCHAIR = 48,
  BOTTLE_CURL = 49,
  SEATED_BOTTLE_CURL = 50,
}

export enum DeadliftExerciseName {
  BARBELL_DEADLIFT = 0,
  BARBELL_STRAIGHT_LEG_DEADLIFT = 1,
  DUMBBELL_DEADLIFT = 2,
  DUMBBELL_SINGLE_LEG_DEADLIFT_TO_ROW = 3,
  DUMBBELL_STRAIGHT_LEG_DEADLIFT = 4,
  KETTLEBELL_FLOOR_TO_SHELF = 5,
  ONE_ARM_ONE_LEG_DEADLIFT = 6,
  RACK_PULL = 7,
  ROTATIONAL_DUMBBELL_STRAIGHT_LEG_DEADLIFT = 8,
  SINGLE_ARM_DEADLIFT = 9,
  SINGLE_LEG_BARBELL_DEADLIFT = 10,
  SINGLE_LEG_BARBELL_STRAIGHT_LEG_DEADLIFT = 11,
  SINGLE_LEG_DEADLIFT_WITH_BARBELL = 12,
  SINGLE_LEG_RDL_CIRCUIT = 13,
  SINGLE_LEG_ROMANIAN_DEADLIFT_WITH_DUMBBELL = 14,
  SUMO_DEADLIFT = 15,
  SUMO_DEADLIFT_HIGH_PULL = 16,
  TRAP_BAR_DEADLIFT = 17,
  WIDE_GRIP_BARBELL_DEADLIFT = 18,
  KETTLEBELL_DEADLIFT = 20,
  KETTLEBELL_SUMO_DEADLIFT = 21,
  ROMANIAN_DEADLIFT = 23,
  SINGLE_LEG_ROMANIAN_DEADLIFT_CIRCUIT = 24,
  STRAIGHT_LEG_DEADLIFT = 25,
}

export enum FlyeExerciseName {
  CABLE_CROSSOVER = 0,
  DECLINE_DUMBBELL_FLYE = 1,
  DUMBBELL_FLYE = 2,
  INCLINE_DUMBBELL_FLYE = 3,
  KETTLEBELL_FLYE = 4,
  KNEELING_REAR_FLYE = 5,
  SINGLE_ARM_STANDING_CABLE_REVERSE_FLYE = 6,
  SWISS_BALL_DUMBBELL_FLYE = 7,
  ARM_ROTATIONS = 8,
  HUG_A_TREE = 9,
  FACE_DOWN_INCLINE_REVERSE_FLYE = 10,
  INCLINE_REVERSE_FLYE = 11,
  REAR_DELT_FLY_WHEELCHAIR = 12,
}

export enum HipRaiseExerciseName {
  BARBELL_HIP_THRUST_ON_FLOOR = 0,
  BARBELL_HIP_THRUST_WITH_BENCH = 1,
  BENT_KNEE_SWISS_BALL_REVERSE_HIP_RAISE = 2,
  WEIGHTED_BENT_KNEE_SWISS_BALL_REVERSE_HIP_RAISE = 3,
  BRIDGE_WITH_LEG_EXTENSION = 4,
  WEIGHTED_BRIDGE_WITH_LEG_EXTENSION = 5,
  CLAM_BRIDGE = 6,
  FRONT_KICK_TABLETOP = 7,
  WEIGHTED_FRONT_KICK_TABLETOP = 8,
  HIP_EXTENSION_AND_CROSS = 9,
  WEIGHTED_HIP_EXTENSION_AND_CROSS = 10,
  HIP_RAISE = 11,
  WEIGHTED_HIP_RAISE = 12,
  HIP_RAISE_WITH_FEET_ON_SWISS_BALL = 13,
  WEIGHTED_HIP_RAISE_WITH_FEET_ON_SWISS_BALL = 14,
  HIP_RAISE_WITH_HEAD_ON_BOSU_BALL = 15,
  WEIGHTED_HIP_RAISE_WITH_HEAD_ON_BOSU_BALL = 16,
  HIP_RAISE_WITH_HEAD_ON_SWISS_BALL = 17,
  WEIGHTED_HIP_RAISE_WITH_HEAD_ON_SWISS_BALL = 18,
  HIP_RAISE_WITH_KNEE_SQUEEZE = 19,
  WEIGHTED_HIP_RAISE_WITH_KNEE_SQUEEZE = 20,
  INCLINE_REAR_LEG_EXTENSION = 21,
  WEIGHTED_INCLINE_REAR_LEG_EXTENSION = 22,
  KETTLEBELL_SWING = 23,
  MARCHING_HIP_RAISE = 24,
  WEIGHTED_MARCHING_HIP_RAISE = 25,
  MARCHING_HIP_RAISE_WITH_FEET_ON_A_SWISS_BALL = 26,
  WEIGHTED_MARCHING_HIP_RAISE_WITH_FEET_ON_A_SWISS_BALL = 27,
  REVERSE_HIP_RAISE = 28,
  WEIGHTED_REVERSE_HIP_RAISE = 29,
  SINGLE_LEG_HIP_RAISE = 30,
  WEIGHTED_SINGLE_LEG_HIP_RAISE = 31,
  SINGLE_LEG_HIP_RAISE_WITH_FOOT_ON_BENCH = 32,
  WEIGHTED_SINGLE_LEG_HIP_RAISE_WITH_FOOT_ON_BENCH = 33,
  SINGLE_LEG_HIP_RAISE_WITH_FOOT_ON_BOSU_BALL = 34,
  WEIGHTED_SINGLE_LEG_HIP_RAISE_WITH_FOOT_ON_BOSU_BALL = 35,
  SINGLE_LEG_HIP_RAISE_WITH_FOOT_ON_FOAM_ROLLER = 36,
  WEIGHTED_SINGLE_LEG_HIP_RAISE_WITH_FOOT_ON_FOAM_ROLLER = 37,
  SINGLE_LEG_HIP_RAISE_WITH_FOOT_ON_MEDICINE_BALL = 38,
  WEIGHTED_SINGLE_LEG_HIP_RAISE_WITH_FOOT_ON_MEDICINE_BALL = 39,
  SINGLE_LEG_HIP_RAISE_WITH_HEAD_ON_BOSU_BALL = 40,
  WEIGHTED_SINGLE_LEG_HIP_RAISE_WITH_HEAD_ON_BOSU_BALL = 41,
  WEIGHTED_CLAM_BRIDGE = 42,
  SINGLE_LEG_SWISS_BALL_HIP_RAISE_AND_LEG_CURL = 43,
  CLAMS = 44,
  /**
   * innerThighCircles (Deprecated do not use)
   */
  INNER_THIGH_CIRCLES = 45,
  /**
   * innerThighSideLift (Deprecated do not use)
   */
  INNER_THIGH_SIDE_LIFT = 46,
  LEG_CIRCLES = 47,
  LEG_LIFT = 48,
  LEG_LIFT_IN_EXTERNAL_ROTATION = 49,
}

export enum HipStabilityExerciseName {
  BAND_SIDE_LYING_LEG_RAISE = 0,
  DEAD_BUG = 1,
  WEIGHTED_DEAD_BUG = 2,
  EXTERNAL_HIP_RAISE = 3,
  WEIGHTED_EXTERNAL_HIP_RAISE = 4,
  FIRE_HYDRANT_KICKS = 5,
  WEIGHTED_FIRE_HYDRANT_KICKS = 6,
  HIP_CIRCLES = 7,
  WEIGHTED_HIP_CIRCLES = 8,
  INNER_THIGH_LIFT = 9,
  WEIGHTED_INNER_THIGH_LIFT = 10,
  LATERAL_WALKS_WITH_BAND_AT_ANKLES = 11,
  PRETZEL_SIDE_KICK = 12,
  WEIGHTED_PRETZEL_SIDE_KICK = 13,
  PRONE_HIP_INTERNAL_ROTATION = 14,
  WEIGHTED_PRONE_HIP_INTERNAL_ROTATION = 15,
  QUADRUPED = 16,
  QUADRUPED_HIP_EXTENSION = 17,
  WEIGHTED_QUADRUPED_HIP_EXTENSION = 18,
  QUADRUPED_WITH_LEG_LIFT = 19,
  WEIGHTED_QUADRUPED_WITH_LEG_LIFT = 20,
  SIDE_LYING_LEG_RAISE = 21,
  WEIGHTED_SIDE_LYING_LEG_RAISE = 22,
  SLIDING_HIP_ADDUCTION = 23,
  WEIGHTED_SLIDING_HIP_ADDUCTION = 24,
  STANDING_ADDUCTION = 25,
  WEIGHTED_STANDING_ADDUCTION = 26,
  STANDING_CABLE_HIP_ABDUCTION = 27,
  STANDING_HIP_ABDUCTION = 28,
  WEIGHTED_STANDING_HIP_ABDUCTION = 29,
  STANDING_REAR_LEG_RAISE = 30,
  WEIGHTED_STANDING_REAR_LEG_RAISE = 31,
  SUPINE_HIP_INTERNAL_ROTATION = 32,
  WEIGHTED_SUPINE_HIP_INTERNAL_ROTATION = 33,
  LYING_ABDUCTION_STRETCH = 34,
}

export enum HipSwingExerciseName {
  SINGLE_ARM_KETTLEBELL_SWING = 0,
  SINGLE_ARM_DUMBBELL_SWING = 1,
  STEP_OUT_SWING = 2,
  ONE_ARM_SWING = 3,
}

export enum HyperextensionExerciseName {
  BACK_EXTENSION_WITH_OPPOSITE_ARM_AND_LEG_REACH = 0,
  WEIGHTED_BACK_EXTENSION_WITH_OPPOSITE_ARM_AND_LEG_REACH = 1,
  BASE_ROTATIONS = 2,
  WEIGHTED_BASE_ROTATIONS = 3,
  BENT_KNEE_REVERSE_HYPEREXTENSION = 4,
  WEIGHTED_BENT_KNEE_REVERSE_HYPEREXTENSION = 5,
  HOLLOW_HOLD_AND_ROLL = 6,
  WEIGHTED_HOLLOW_HOLD_AND_ROLL = 7,
  KICKS = 8,
  WEIGHTED_KICKS = 9,
  KNEE_RAISES = 10,
  WEIGHTED_KNEE_RAISES = 11,
  KNEELING_SUPERMAN = 12,
  WEIGHTED_KNEELING_SUPERMAN = 13,
  LAT_PULLDOWN_WITH_ROW = 14,
  MEDICINE_BALL_DEADLIFT_TO_REACH = 15,
  ONE_ARM_ONE_LEG_ROW = 16,
  ONE_ARM_ROW_WITH_BAND = 17,
  OVERHEAD_LUNGE_WITH_MEDICINE_BALL = 18,
  PLANK_KNEE_TUCKS = 19,
  WEIGHTED_PLANK_KNEE_TUCKS = 20,
  SIDE_STEP = 21,
  WEIGHTED_SIDE_STEP = 22,
  SINGLE_LEG_BACK_EXTENSION = 23,
  WEIGHTED_SINGLE_LEG_BACK_EXTENSION = 24,
  SPINE_EXTENSION = 25,
  WEIGHTED_SPINE_EXTENSION = 26,
  STATIC_BACK_EXTENSION = 27,
  WEIGHTED_STATIC_BACK_EXTENSION = 28,
  SUPERMAN_FROM_FLOOR = 29,
  WEIGHTED_SUPERMAN_FROM_FLOOR = 30,
  SWISS_BALL_BACK_EXTENSION = 31,
  WEIGHTED_SWISS_BALL_BACK_EXTENSION = 32,
  SWISS_BALL_HYPEREXTENSION = 33,
  WEIGHTED_SWISS_BALL_HYPEREXTENSION = 34,
  SWISS_BALL_OPPOSITE_ARM_AND_LEG_LIFT = 35,
  WEIGHTED_SWISS_BALL_OPPOSITE_ARM_AND_LEG_LIFT = 36,
  SUPERMAN_ON_SWISS_BALL = 37,
  COBRA = 38,
  /**
   * supineFloorBarre (Deprecated do not use)
   */
  SUPINE_FLOOR_BARRE = 39,
}

export enum LateralRaiseExerciseName {
  _45_DEGREE_CABLE_EXTERNAL_ROTATION = 0,
  ALTERNATING_LATERAL_RAISE_WITH_STATIC_HOLD = 1,
  BAR_MUSCLE_UP = 2,
  BENT_OVER_LATERAL_RAISE = 3,
  CABLE_DIAGONAL_RAISE = 4,
  CABLE_FRONT_RAISE = 5,
  CALORIE_ROW = 6,
  COMBO_SHOULDER_RAISE = 7,
  DUMBBELL_DIAGONAL_RAISE = 8,
  DUMBBELL_V_RAISE = 9,
  FRONT_RAISE = 10,
  LEANING_DUMBBELL_LATERAL_RAISE = 11,
  LYING_DUMBBELL_RAISE = 12,
  MUSCLE_UP = 13,
  ONE_ARM_CABLE_LATERAL_RAISE = 14,
  OVERHAND_GRIP_REAR_LATERAL_RAISE = 15,
  PLATE_RAISES = 16,
  RING_DIP = 17,
  WEIGHTED_RING_DIP = 18,
  RING_MUSCLE_UP = 19,
  WEIGHTED_RING_MUSCLE_UP = 20,
  ROPE_CLIMB = 21,
  WEIGHTED_ROPE_CLIMB = 22,
  SCAPTION = 23,
  SEATED_LATERAL_RAISE = 24,
  SEATED_REAR_LATERAL_RAISE = 25,
  SIDE_LYING_LATERAL_RAISE = 26,
  STANDING_LIFT = 27,
  SUSPENDED_ROW = 28,
  UNDERHAND_GRIP_REAR_LATERAL_RAISE = 29,
  WALL_SLIDE = 30,
  WEIGHTED_WALL_SLIDE = 31,
  ARM_CIRCLES = 32,
  SHAVING_THE_HEAD = 33,
  DUMBBELL_LATERAL_RAISE = 34,
  RING_DIP_KIPPING = 36,
  WALL_WALK = 37,
  DUMBBELL_FRONT_RAISE_WHEELCHAIR = 38,
  DUMBBELL_LATERAL_RAISE_WHEELCHAIR = 39,
  POLE_DOUBLE_ARM_OVERHEAD_AND_FORWARD_WHEELCHAIR = 40,
  POLE_STRAIGHT_ARM_OVERHEAD_WHEELCHAIR = 41,
}

export enum LegCurlExerciseName {
  LEG_CURL = 0,
  WEIGHTED_LEG_CURL = 1,
  GOOD_MORNING = 2,
  SEATED_BARBELL_GOOD_MORNING = 3,
  SINGLE_LEG_BARBELL_GOOD_MORNING = 4,
  SINGLE_LEG_SLIDING_LEG_CURL = 5,
  SLIDING_LEG_CURL = 6,
  SPLIT_BARBELL_GOOD_MORNING = 7,
  SPLIT_STANCE_EXTENSION = 8,
  STAGGERED_STANCE_GOOD_MORNING = 9,
  SWISS_BALL_HIP_RAISE_AND_LEG_CURL = 10,
  ZERCHER_GOOD_MORNING = 11,
  BAND_GOOD_MORNING = 12,
  BAR_GOOD_MORNING = 13,
}

export enum LegRaiseExerciseName {
  HANGING_KNEE_RAISE = 0,
  HANGING_LEG_RAISE = 1,
  WEIGHTED_HANGING_LEG_RAISE = 2,
  HANGING_SINGLE_LEG_RAISE = 3,
  WEIGHTED_HANGING_SINGLE_LEG_RAISE = 4,
  KETTLEBELL_LEG_RAISES = 5,
  LEG_LOWERING_DRILL = 6,
  WEIGHTED_LEG_LOWERING_DRILL = 7,
  LYING_STRAIGHT_LEG_RAISE = 8,
  WEIGHTED_LYING_STRAIGHT_LEG_RAISE = 9,
  MEDICINE_BALL_LEG_DROPS = 10,
  QUADRUPED_LEG_RAISE = 11,
  WEIGHTED_QUADRUPED_LEG_RAISE = 12,
  REVERSE_LEG_RAISE = 13,
  WEIGHTED_REVERSE_LEG_RAISE = 14,
  REVERSE_LEG_RAISE_ON_SWISS_BALL = 15,
  WEIGHTED_REVERSE_LEG_RAISE_ON_SWISS_BALL = 16,
  SINGLE_LEG_LOWERING_DRILL = 17,
  WEIGHTED_SINGLE_LEG_LOWERING_DRILL = 18,
  WEIGHTED_HANGING_KNEE_RAISE = 19,
  LATERAL_STEPOVER = 20,
  WEIGHTED_LATERAL_STEPOVER = 21,
}

export enum LungeExerciseName {
  OVERHEAD_LUNGE = 0,
  LUNGE_MATRIX = 1,
  WEIGHTED_LUNGE_MATRIX = 2,
  ALTERNATING_BARBELL_FORWARD_LUNGE = 3,
  ALTERNATING_DUMBBELL_LUNGE_WITH_REACH = 4,
  BACK_FOOT_ELEVATED_DUMBBELL_SPLIT_SQUAT = 5,
  BARBELL_BOX_LUNGE = 6,
  BARBELL_BULGARIAN_SPLIT_SQUAT = 7,
  BARBELL_CROSSOVER_LUNGE = 8,
  BARBELL_FRONT_SPLIT_SQUAT = 9,
  BARBELL_LUNGE = 10,
  BARBELL_REVERSE_LUNGE = 11,
  BARBELL_SIDE_LUNGE = 12,
  BARBELL_SPLIT_SQUAT = 13,
  CORE_CONTROL_REAR_LUNGE = 14,
  DIAGONAL_LUNGE = 15,
  DROP_LUNGE = 16,
  DUMBBELL_BOX_LUNGE = 17,
  DUMBBELL_BULGARIAN_SPLIT_SQUAT = 18,
  DUMBBELL_CROSSOVER_LUNGE = 19,
  DUMBBELL_DIAGONAL_LUNGE = 20,
  DUMBBELL_LUNGE = 21,
  DUMBBELL_LUNGE_AND_ROTATION = 22,
  DUMBBELL_OVERHEAD_BULGARIAN_SPLIT_SQUAT = 23,
  DUMBBELL_REVERSE_LUNGE_TO_HIGH_KNEE_AND_PRESS = 24,
  DUMBBELL_SIDE_LUNGE = 25,
  ELEVATED_FRONT_FOOT_BARBELL_SPLIT_SQUAT = 26,
  FRONT_FOOT_ELEVATED_DUMBBELL_SPLIT_SQUAT = 27,
  GUNSLINGER_LUNGE = 28,
  LAWNMOWER_LUNGE = 29,
  LOW_LUNGE_WITH_ISOMETRIC_ADDUCTION = 30,
  LOW_SIDE_TO_SIDE_LUNGE = 31,
  LUNGE = 32,
  WEIGHTED_LUNGE = 33,
  LUNGE_WITH_ARM_REACH = 34,
  LUNGE_WITH_DIAGONAL_REACH = 35,
  LUNGE_WITH_SIDE_BEND = 36,
  OFFSET_DUMBBELL_LUNGE = 37,
  OFFSET_DUMBBELL_REVERSE_LUNGE = 38,
  OVERHEAD_BULGARIAN_SPLIT_SQUAT = 39,
  OVERHEAD_DUMBBELL_REVERSE_LUNGE = 40,
  OVERHEAD_DUMBBELL_SPLIT_SQUAT = 41,
  OVERHEAD_LUNGE_WITH_ROTATION = 42,
  REVERSE_BARBELL_BOX_LUNGE = 43,
  REVERSE_BOX_LUNGE = 44,
  REVERSE_DUMBBELL_BOX_LUNGE = 45,
  REVERSE_DUMBBELL_CROSSOVER_LUNGE = 46,
  REVERSE_DUMBBELL_DIAGONAL_LUNGE = 47,
  REVERSE_LUNGE_WITH_REACH_BACK = 48,
  WEIGHTED_REVERSE_LUNGE_WITH_REACH_BACK = 49,
  REVERSE_LUNGE_WITH_TWIST_AND_OVERHEAD_REACH = 50,
  WEIGHTED_REVERSE_LUNGE_WITH_TWIST_AND_OVERHEAD_REACH = 51,
  REVERSE_SLIDING_BOX_LUNGE = 52,
  WEIGHTED_REVERSE_SLIDING_BOX_LUNGE = 53,
  REVERSE_SLIDING_LUNGE = 54,
  WEIGHTED_REVERSE_SLIDING_LUNGE = 55,
  RUNNERS_LUNGE_TO_BALANCE = 56,
  WEIGHTED_RUNNERS_LUNGE_TO_BALANCE = 57,
  SHIFTING_SIDE_LUNGE = 58,
  SIDE_AND_CROSSOVER_LUNGE = 59,
  WEIGHTED_SIDE_AND_CROSSOVER_LUNGE = 60,
  SIDE_LUNGE = 61,
  WEIGHTED_SIDE_LUNGE = 62,
  SIDE_LUNGE_AND_PRESS = 63,
  SIDE_LUNGE_JUMP_OFF = 64,
  SIDE_LUNGE_SWEEP = 65,
  WEIGHTED_SIDE_LUNGE_SWEEP = 66,
  SIDE_LUNGE_TO_CROSSOVER_TAP = 67,
  WEIGHTED_SIDE_LUNGE_TO_CROSSOVER_TAP = 68,
  SIDE_TO_SIDE_LUNGE_CHOPS = 69,
  WEIGHTED_SIDE_TO_SIDE_LUNGE_CHOPS = 70,
  SIFF_JUMP_LUNGE = 71,
  WEIGHTED_SIFF_JUMP_LUNGE = 72,
  SINGLE_ARM_REVERSE_LUNGE_AND_PRESS = 73,
  SLIDING_LATERAL_LUNGE = 74,
  WEIGHTED_SLIDING_LATERAL_LUNGE = 75,
  WALKING_BARBELL_LUNGE = 76,
  WALKING_DUMBBELL_LUNGE = 77,
  WALKING_LUNGE = 78,
  WEIGHTED_WALKING_LUNGE = 79,
  WIDE_GRIP_OVERHEAD_BARBELL_SPLIT_SQUAT = 80,
  ALTERNATING_DUMBBELL_LUNGE = 81,
  DUMBBELL_REVERSE_LUNGE = 82,
  OVERHEAD_DUMBBELL_LUNGE = 83,
  SCISSOR_POWER_SWITCH = 84,
  DUMBBELL_OVERHEAD_WALKING_LUNGE = 85,
  CURTSY_LUNGE = 86,
  WEIGHTED_CURTSY_LUNGE = 87,
  WEIGHTED_SHIFTING_SIDE_LUNGE = 88,
  WEIGHTED_SIDE_LUNGE_AND_PRESS = 89,
  WEIGHTED_SIDE_LUNGE_JUMP_OFF = 90,
}

export enum OlympicLiftExerciseName {
  BARBELL_HANG_POWER_CLEAN = 0,
  BARBELL_HANG_SQUAT_CLEAN = 1,
  BARBELL_POWER_CLEAN = 2,
  BARBELL_POWER_SNATCH = 3,
  BARBELL_SQUAT_CLEAN = 4,
  CLEAN_AND_JERK = 5,
  BARBELL_HANG_POWER_SNATCH = 6,
  BARBELL_HANG_PULL = 7,
  BARBELL_HIGH_PULL = 8,
  BARBELL_SNATCH = 9,
  BARBELL_SPLIT_JERK = 10,
  CLEAN = 11,
  DUMBBELL_CLEAN = 12,
  DUMBBELL_HANG_PULL = 13,
  ONE_HAND_DUMBBELL_SPLIT_SNATCH = 14,
  PUSH_JERK = 15,
  SINGLE_ARM_DUMBBELL_SNATCH = 16,
  SINGLE_ARM_HANG_SNATCH = 17,
  SINGLE_ARM_KETTLEBELL_SNATCH = 18,
  SPLIT_JERK = 19,
  SQUAT_CLEAN_AND_JERK = 20,
  DUMBBELL_HANG_SNATCH = 21,
  DUMBBELL_POWER_CLEAN_AND_JERK = 22,
  DUMBBELL_POWER_CLEAN_AND_PUSH_PRESS = 23,
  DUMBBELL_POWER_CLEAN_AND_STRICT_PRESS = 24,
  DUMBBELL_SNATCH = 25,
  MEDICINE_BALL_CLEAN = 26,
  CLEAN_AND_PRESS = 27,
  SNATCH = 28,
}

export enum PlankExerciseName {
  _45_DEGREE_PLANK = 0,
  WEIGHTED_45_DEGREE_PLANK = 1,
  _90_DEGREE_STATIC_HOLD = 2,
  WEIGHTED_90_DEGREE_STATIC_HOLD = 3,
  BEAR_CRAWL = 4,
  WEIGHTED_BEAR_CRAWL = 5,
  CROSS_BODY_MOUNTAIN_CLIMBER = 6,
  WEIGHTED_CROSS_BODY_MOUNTAIN_CLIMBER = 7,
  ELBOW_PLANK_PIKE_JACKS = 8,
  WEIGHTED_ELBOW_PLANK_PIKE_JACKS = 9,
  ELEVATED_FEET_PLANK = 10,
  WEIGHTED_ELEVATED_FEET_PLANK = 11,
  ELEVATOR_ABS = 12,
  WEIGHTED_ELEVATOR_ABS = 13,
  EXTENDED_PLANK = 14,
  WEIGHTED_EXTENDED_PLANK = 15,
  FULL_PLANK_PASSE_TWIST = 16,
  WEIGHTED_FULL_PLANK_PASSE_TWIST = 17,
  INCHING_ELBOW_PLANK = 18,
  WEIGHTED_INCHING_ELBOW_PLANK = 19,
  INCHWORM_TO_SIDE_PLANK = 20,
  WEIGHTED_INCHWORM_TO_SIDE_PLANK = 21,
  KNEELING_PLANK = 22,
  WEIGHTED_KNEELING_PLANK = 23,
  KNEELING_SIDE_PLANK_WITH_LEG_LIFT = 24,
  WEIGHTED_KNEELING_SIDE_PLANK_WITH_LEG_LIFT = 25,
  LATERAL_ROLL = 26,
  WEIGHTED_LATERAL_ROLL = 27,
  LYING_REVERSE_PLANK = 28,
  WEIGHTED_LYING_REVERSE_PLANK = 29,
  MEDICINE_BALL_MOUNTAIN_CLIMBER = 30,
  WEIGHTED_MEDICINE_BALL_MOUNTAIN_CLIMBER = 31,
  MODIFIED_MOUNTAIN_CLIMBER_AND_EXTENSION = 32,
  WEIGHTED_MODIFIED_MOUNTAIN_CLIMBER_AND_EXTENSION = 33,
  MOUNTAIN_CLIMBER = 34,
  WEIGHTED_MOUNTAIN_CLIMBER = 35,
  MOUNTAIN_CLIMBER_ON_SLIDING_DISCS = 36,
  WEIGHTED_MOUNTAIN_CLIMBER_ON_SLIDING_DISCS = 37,
  MOUNTAIN_CLIMBER_WITH_FEET_ON_BOSU_BALL = 38,
  WEIGHTED_MOUNTAIN_CLIMBER_WITH_FEET_ON_BOSU_BALL = 39,
  MOUNTAIN_CLIMBER_WITH_HANDS_ON_BENCH = 40,
  MOUNTAIN_CLIMBER_WITH_HANDS_ON_SWISS_BALL = 41,
  WEIGHTED_MOUNTAIN_CLIMBER_WITH_HANDS_ON_SWISS_BALL = 42,
  PLANK = 43,
  PLANK_JACKS_WITH_FEET_ON_SLIDING_DISCS = 44,
  WEIGHTED_PLANK_JACKS_WITH_FEET_ON_SLIDING_DISCS = 45,
  PLANK_KNEE_TWIST = 46,
  WEIGHTED_PLANK_KNEE_TWIST = 47,
  PLANK_PIKE_JUMPS = 48,
  WEIGHTED_PLANK_PIKE_JUMPS = 49,
  PLANK_PIKES = 50,
  WEIGHTED_PLANK_PIKES = 51,
  PLANK_TO_STAND_UP = 52,
  WEIGHTED_PLANK_TO_STAND_UP = 53,
  PLANK_WITH_ARM_RAISE = 54,
  WEIGHTED_PLANK_WITH_ARM_RAISE = 55,
  PLANK_WITH_KNEE_TO_ELBOW = 56,
  WEIGHTED_PLANK_WITH_KNEE_TO_ELBOW = 57,
  PLANK_WITH_OBLIQUE_CRUNCH = 58,
  WEIGHTED_PLANK_WITH_OBLIQUE_CRUNCH = 59,
  PLYOMETRIC_SIDE_PLANK = 60,
  WEIGHTED_PLYOMETRIC_SIDE_PLANK = 61,
  ROLLING_SIDE_PLANK = 62,
  WEIGHTED_ROLLING_SIDE_PLANK = 63,
  SIDE_KICK_PLANK = 64,
  WEIGHTED_SIDE_KICK_PLANK = 65,
  SIDE_PLANK = 66,
  WEIGHTED_SIDE_PLANK = 67,
  SIDE_PLANK_AND_ROW = 68,
  WEIGHTED_SIDE_PLANK_AND_ROW = 69,
  SIDE_PLANK_LIFT = 70,
  WEIGHTED_SIDE_PLANK_LIFT = 71,
  SIDE_PLANK_WITH_ELBOW_ON_BOSU_BALL = 72,
  WEIGHTED_SIDE_PLANK_WITH_ELBOW_ON_BOSU_BALL = 73,
  SIDE_PLANK_WITH_FEET_ON_BENCH = 74,
  WEIGHTED_SIDE_PLANK_WITH_FEET_ON_BENCH = 75,
  SIDE_PLANK_WITH_KNEE_CIRCLE = 76,
  WEIGHTED_SIDE_PLANK_WITH_KNEE_CIRCLE = 77,
  SIDE_PLANK_WITH_KNEE_TUCK = 78,
  WEIGHTED_SIDE_PLANK_WITH_KNEE_TUCK = 79,
  SIDE_PLANK_WITH_LEG_LIFT = 80,
  WEIGHTED_SIDE_PLANK_WITH_LEG_LIFT = 81,
  SIDE_PLANK_WITH_REACH_UNDER = 82,
  WEIGHTED_SIDE_PLANK_WITH_REACH_UNDER = 83,
  SINGLE_LEG_ELEVATED_FEET_PLANK = 84,
  WEIGHTED_SINGLE_LEG_ELEVATED_FEET_PLANK = 85,
  SINGLE_LEG_FLEX_AND_EXTEND = 86,
  WEIGHTED_SINGLE_LEG_FLEX_AND_EXTEND = 87,
  SINGLE_LEG_SIDE_PLANK = 88,
  WEIGHTED_SINGLE_LEG_SIDE_PLANK = 89,
  SPIDERMAN_PLANK = 90,
  WEIGHTED_SPIDERMAN_PLANK = 91,
  STRAIGHT_ARM_PLANK = 92,
  WEIGHTED_STRAIGHT_ARM_PLANK = 93,
  STRAIGHT_ARM_PLANK_WITH_SHOULDER_TOUCH = 94,
  WEIGHTED_STRAIGHT_ARM_PLANK_WITH_SHOULDER_TOUCH = 95,
  SWISS_BALL_PLANK = 96,
  WEIGHTED_SWISS_BALL_PLANK = 97,
  SWISS_BALL_PLANK_LEG_LIFT = 98,
  WEIGHTED_SWISS_BALL_PLANK_LEG_LIFT = 99,
  SWISS_BALL_PLANK_LEG_LIFT_AND_HOLD = 100,
  SWISS_BALL_PLANK_WITH_FEET_ON_BENCH = 101,
  WEIGHTED_SWISS_BALL_PLANK_WITH_FEET_ON_BENCH = 102,
  SWISS_BALL_PRONE_JACKKNIFE = 103,
  WEIGHTED_SWISS_BALL_PRONE_JACKKNIFE = 104,
  SWISS_BALL_SIDE_PLANK = 105,
  WEIGHTED_SWISS_BALL_SIDE_PLANK = 106,
  THREE_WAY_PLANK = 107,
  WEIGHTED_THREE_WAY_PLANK = 108,
  TOWEL_PLANK_AND_KNEE_IN = 109,
  WEIGHTED_TOWEL_PLANK_AND_KNEE_IN = 110,
  T_STABILIZATION = 111,
  WEIGHTED_T_STABILIZATION = 112,
  TURKISH_GET_UP_TO_SIDE_PLANK = 113,
  WEIGHTED_TURKISH_GET_UP_TO_SIDE_PLANK = 114,
  TWO_POINT_PLANK = 115,
  WEIGHTED_TWO_POINT_PLANK = 116,
  WEIGHTED_PLANK = 117,
  WIDE_STANCE_PLANK_WITH_DIAGONAL_ARM_LIFT = 118,
  WEIGHTED_WIDE_STANCE_PLANK_WITH_DIAGONAL_ARM_LIFT = 119,
  WIDE_STANCE_PLANK_WITH_DIAGONAL_LEG_LIFT = 120,
  WEIGHTED_WIDE_STANCE_PLANK_WITH_DIAGONAL_LEG_LIFT = 121,
  WIDE_STANCE_PLANK_WITH_LEG_LIFT = 122,
  WEIGHTED_WIDE_STANCE_PLANK_WITH_LEG_LIFT = 123,
  WIDE_STANCE_PLANK_WITH_OPPOSITE_ARM_AND_LEG_LIFT = 124,
  WEIGHTED_MOUNTAIN_CLIMBER_WITH_HANDS_ON_BENCH = 125,
  WEIGHTED_SWISS_BALL_PLANK_LEG_LIFT_AND_HOLD = 126,
  WEIGHTED_WIDE_STANCE_PLANK_WITH_OPPOSITE_ARM_AND_LEG_LIFT = 127,
  PLANK_WITH_FEET_ON_SWISS_BALL = 128,
  SIDE_PLANK_TO_PLANK_WITH_REACH_UNDER = 129,
  BRIDGE_WITH_GLUTE_LOWER_LIFT = 130,
  BRIDGE_ONE_LEG_BRIDGE = 131,
  PLANK_WITH_ARM_VARIATIONS = 132,
  PLANK_WITH_LEG_LIFT = 133,
  REVERSE_PLANK_WITH_LEG_PULL = 134,
  RING_PLANK_SPRAWLS = 135,
}

export enum PlyoExerciseName {
  ALTERNATING_JUMP_LUNGE = 0,
  WEIGHTED_ALTERNATING_JUMP_LUNGE = 1,
  BARBELL_JUMP_SQUAT = 2,
  BODY_WEIGHT_JUMP_SQUAT = 3,
  WEIGHTED_JUMP_SQUAT = 4,
  CROSS_KNEE_STRIKE = 5,
  WEIGHTED_CROSS_KNEE_STRIKE = 6,
  DEPTH_JUMP = 7,
  WEIGHTED_DEPTH_JUMP = 8,
  DUMBBELL_JUMP_SQUAT = 9,
  DUMBBELL_SPLIT_JUMP = 10,
  FRONT_KNEE_STRIKE = 11,
  WEIGHTED_FRONT_KNEE_STRIKE = 12,
  HIGH_BOX_JUMP = 13,
  WEIGHTED_HIGH_BOX_JUMP = 14,
  ISOMETRIC_EXPLOSIVE_BODY_WEIGHT_JUMP_SQUAT = 15,
  WEIGHTED_ISOMETRIC_EXPLOSIVE_JUMP_SQUAT = 16,
  LATERAL_LEAP_AND_HOP = 17,
  WEIGHTED_LATERAL_LEAP_AND_HOP = 18,
  LATERAL_PLYO_SQUATS = 19,
  WEIGHTED_LATERAL_PLYO_SQUATS = 20,
  LATERAL_SLIDE = 21,
  WEIGHTED_LATERAL_SLIDE = 22,
  MEDICINE_BALL_OVERHEAD_THROWS = 23,
  MEDICINE_BALL_SIDE_THROW = 24,
  MEDICINE_BALL_SLAM = 25,
  SIDE_TO_SIDE_MEDICINE_BALL_THROWS = 26,
  SIDE_TO_SIDE_SHUFFLE_JUMP = 27,
  WEIGHTED_SIDE_TO_SIDE_SHUFFLE_JUMP = 28,
  SQUAT_JUMP_ONTO_BOX = 29,
  WEIGHTED_SQUAT_JUMP_ONTO_BOX = 30,
  SQUAT_JUMPS_IN_AND_OUT = 31,
  WEIGHTED_SQUAT_JUMPS_IN_AND_OUT = 32,
  BOX_JUMP = 33,
  BOX_JUMP_OVERS = 34,
  BOX_JUMP_OVERS_OVER_THE_BOX = 35,
  STAR_JUMP_SQUATS = 36,
  JUMP_SQUAT = 37,
}

export enum PullUpExerciseName {
  BANDED_PULL_UPS = 0,
  _30_DEGREE_LAT_PULLDOWN = 1,
  BAND_ASSISTED_CHIN_UP = 2,
  CLOSE_GRIP_CHIN_UP = 3,
  WEIGHTED_CLOSE_GRIP_CHIN_UP = 4,
  CLOSE_GRIP_LAT_PULLDOWN = 5,
  CROSSOVER_CHIN_UP = 6,
  WEIGHTED_CROSSOVER_CHIN_UP = 7,
  EZ_BARBELL_PULLOVER = 8,
  HANGING_HURDLE = 9,
  WEIGHTED_HANGING_HURDLE = 10,
  KNEELING_LAT_PULLDOWN = 11,
  KNEELING_UNDERHAND_GRIP_LAT_PULLDOWN = 12,
  LAT_PULLDOWN = 13,
  MIXED_GRIP_CHIN_UP = 14,
  WEIGHTED_MIXED_GRIP_CHIN_UP = 15,
  MIXED_GRIP_PULL_UP = 16,
  WEIGHTED_MIXED_GRIP_PULL_UP = 17,
  REVERSE_GRIP_PULLDOWN = 18,
  STANDING_CABLE_PULLOVER = 19,
  STRAIGHT_ARM_PULLDOWN = 20,
  SWISS_BALL_EZ_BARBELL_PULLOVER = 21,
  TOWEL_PULL_UP = 22,
  WEIGHTED_TOWEL_PULL_UP = 23,
  WEIGHTED_PULL_UP = 24,
  WIDE_GRIP_LAT_PULLDOWN = 25,
  WIDE_GRIP_PULL_UP = 26,
  WEIGHTED_WIDE_GRIP_PULL_UP = 27,
  BURPEE_PULL_UP = 28,
  WEIGHTED_BURPEE_PULL_UP = 29,
  JUMPING_PULL_UPS = 30,
  WEIGHTED_JUMPING_PULL_UPS = 31,
  KIPPING_PULL_UP = 32,
  WEIGHTED_KIPPING_PULL_UP = 33,
  L_PULL_UP = 34,
  WEIGHTED_L_PULL_UP = 35,
  SUSPENDED_CHIN_UP = 36,
  WEIGHTED_SUSPENDED_CHIN_UP = 37,
  PULL_UP = 38,
  CHIN_UP = 39,
  NEUTRAL_GRIP_CHIN_UP = 40,
  WEIGHTED_CHIN_UP = 41,
  BAND_ASSISTED_PULL_UP = 42,
  NEUTRAL_GRIP_PULL_UP = 43,
  WEIGHTED_NEUTRAL_GRIP_CHIN_UP = 44,
  WEIGHTED_NEUTRAL_GRIP_PULL_UP = 45,
}

export enum PushUpExerciseName {
  CHEST_PRESS_WITH_BAND = 0,
  ALTERNATING_STAGGERED_PUSH_UP = 1,
  WEIGHTED_ALTERNATING_STAGGERED_PUSH_UP = 2,
  ALTERNATING_HANDS_MEDICINE_BALL_PUSH_UP = 3,
  WEIGHTED_ALTERNATING_HANDS_MEDICINE_BALL_PUSH_UP = 4,
  BOSU_BALL_PUSH_UP = 5,
  WEIGHTED_BOSU_BALL_PUSH_UP = 6,
  CLAPPING_PUSH_UP = 7,
  WEIGHTED_CLAPPING_PUSH_UP = 8,
  CLOSE_GRIP_MEDICINE_BALL_PUSH_UP = 9,
  WEIGHTED_CLOSE_GRIP_MEDICINE_BALL_PUSH_UP = 10,
  CLOSE_HANDS_PUSH_UP = 11,
  WEIGHTED_CLOSE_HANDS_PUSH_UP = 12,
  DECLINE_PUSH_UP = 13,
  WEIGHTED_DECLINE_PUSH_UP = 14,
  DIAMOND_PUSH_UP = 15,
  WEIGHTED_DIAMOND_PUSH_UP = 16,
  EXPLOSIVE_CROSSOVER_PUSH_UP = 17,
  WEIGHTED_EXPLOSIVE_CROSSOVER_PUSH_UP = 18,
  EXPLOSIVE_PUSH_UP = 19,
  WEIGHTED_EXPLOSIVE_PUSH_UP = 20,
  FEET_ELEVATED_SIDE_TO_SIDE_PUSH_UP = 21,
  WEIGHTED_FEET_ELEVATED_SIDE_TO_SIDE_PUSH_UP = 22,
  HAND_RELEASE_PUSH_UP = 23,
  WEIGHTED_HAND_RELEASE_PUSH_UP = 24,
  HANDSTAND_PUSH_UP = 25,
  WEIGHTED_HANDSTAND_PUSH_UP = 26,
  INCLINE_PUSH_UP = 27,
  WEIGHTED_INCLINE_PUSH_UP = 28,
  ISOMETRIC_EXPLOSIVE_PUSH_UP = 29,
  WEIGHTED_ISOMETRIC_EXPLOSIVE_PUSH_UP = 30,
  JUDO_PUSH_UP = 31,
  WEIGHTED_JUDO_PUSH_UP = 32,
  KNEELING_PUSH_UP = 33,
  WEIGHTED_KNEELING_PUSH_UP = 34,
  MEDICINE_BALL_CHEST_PASS = 35,
  MEDICINE_BALL_PUSH_UP = 36,
  WEIGHTED_MEDICINE_BALL_PUSH_UP = 37,
  ONE_ARM_PUSH_UP = 38,
  WEIGHTED_ONE_ARM_PUSH_UP = 39,
  WEIGHTED_PUSH_UP = 40,
  PUSH_UP_AND_ROW = 41,
  WEIGHTED_PUSH_UP_AND_ROW = 42,
  PUSH_UP_PLUS = 43,
  WEIGHTED_PUSH_UP_PLUS = 44,
  PUSH_UP_WITH_FEET_ON_SWISS_BALL = 45,
  WEIGHTED_PUSH_UP_WITH_FEET_ON_SWISS_BALL = 46,
  PUSH_UP_WITH_ONE_HAND_ON_MEDICINE_BALL = 47,
  WEIGHTED_PUSH_UP_WITH_ONE_HAND_ON_MEDICINE_BALL = 48,
  SHOULDER_PUSH_UP = 49,
  WEIGHTED_SHOULDER_PUSH_UP = 50,
  SINGLE_ARM_MEDICINE_BALL_PUSH_UP = 51,
  WEIGHTED_SINGLE_ARM_MEDICINE_BALL_PUSH_UP = 52,
  SPIDERMAN_PUSH_UP = 53,
  WEIGHTED_SPIDERMAN_PUSH_UP = 54,
  STACKED_FEET_PUSH_UP = 55,
  WEIGHTED_STACKED_FEET_PUSH_UP = 56,
  STAGGERED_HANDS_PUSH_UP = 57,
  WEIGHTED_STAGGERED_HANDS_PUSH_UP = 58,
  SUSPENDED_PUSH_UP = 59,
  WEIGHTED_SUSPENDED_PUSH_UP = 60,
  SWISS_BALL_PUSH_UP = 61,
  WEIGHTED_SWISS_BALL_PUSH_UP = 62,
  SWISS_BALL_PUSH_UP_PLUS = 63,
  WEIGHTED_SWISS_BALL_PUSH_UP_PLUS = 64,
  T_PUSH_UP = 65,
  WEIGHTED_T_PUSH_UP = 66,
  TRIPLE_STOP_PUSH_UP = 67,
  WEIGHTED_TRIPLE_STOP_PUSH_UP = 68,
  WIDE_HANDS_PUSH_UP = 69,
  WEIGHTED_WIDE_HANDS_PUSH_UP = 70,
  PARALLETTE_HANDSTAND_PUSH_UP = 71,
  WEIGHTED_PARALLETTE_HANDSTAND_PUSH_UP = 72,
  RING_HANDSTAND_PUSH_UP = 73,
  WEIGHTED_RING_HANDSTAND_PUSH_UP = 74,
  RING_PUSH_UP = 75,
  WEIGHTED_RING_PUSH_UP = 76,
  PUSH_UP = 77,
  PILATES_PUSH_UP = 78,
  DYNAMIC_PUSH_UP = 79,
  KIPPING_HANDSTAND_PUSH_UP = 80,
  SHOULDER_TAPPING_PUSH_UP = 81,
  BICEPS_PUSH_UP = 82,
  HINDU_PUSH_UP = 83,
  PIKE_PUSH_UP = 84,
  WIDE_GRIP_PUSH_UP = 85,
  WEIGHTED_BICEPS_PUSH_UP = 86,
  WEIGHTED_HINDU_PUSH_UP = 87,
  WEIGHTED_PIKE_PUSH_UP = 88,
  KIPPING_PARALLETTE_HANDSTAND_PUSH_UP = 89,
  WALL_PUSH_UP = 90,
}

export enum RowExerciseName {
  BARBELL_STRAIGHT_LEG_DEADLIFT_TO_ROW = 0,
  CABLE_ROW_STANDING = 1,
  DUMBBELL_ROW = 2,
  ELEVATED_FEET_INVERTED_ROW = 3,
  WEIGHTED_ELEVATED_FEET_INVERTED_ROW = 4,
  FACE_PULL = 5,
  FACE_PULL_WITH_EXTERNAL_ROTATION = 6,
  INVERTED_ROW_WITH_FEET_ON_SWISS_BALL = 7,
  WEIGHTED_INVERTED_ROW_WITH_FEET_ON_SWISS_BALL = 8,
  KETTLEBELL_ROW = 9,
  MODIFIED_INVERTED_ROW = 10,
  WEIGHTED_MODIFIED_INVERTED_ROW = 11,
  NEUTRAL_GRIP_ALTERNATING_DUMBBELL_ROW = 12,
  ONE_ARM_BENT_OVER_ROW = 13,
  ONE_LEGGED_DUMBBELL_ROW = 14,
  RENEGADE_ROW = 15,
  REVERSE_GRIP_BARBELL_ROW = 16,
  ROPE_HANDLE_CABLE_ROW = 17,
  SEATED_CABLE_ROW = 18,
  SEATED_DUMBBELL_ROW = 19,
  SINGLE_ARM_CABLE_ROW = 20,
  SINGLE_ARM_CABLE_ROW_AND_ROTATION = 21,
  SINGLE_ARM_INVERTED_ROW = 22,
  WEIGHTED_SINGLE_ARM_INVERTED_ROW = 23,
  SINGLE_ARM_NEUTRAL_GRIP_DUMBBELL_ROW = 24,
  SINGLE_ARM_NEUTRAL_GRIP_DUMBBELL_ROW_AND_ROTATION = 25,
  SUSPENDED_INVERTED_ROW = 26,
  WEIGHTED_SUSPENDED_INVERTED_ROW = 27,
  T_BAR_ROW = 28,
  TOWEL_GRIP_INVERTED_ROW = 29,
  WEIGHTED_TOWEL_GRIP_INVERTED_ROW = 30,
  UNDERHAND_GRIP_CABLE_ROW = 31,
  V_GRIP_CABLE_ROW = 32,
  WIDE_GRIP_SEATED_CABLE_ROW = 33,
  ALTERNATING_DUMBBELL_ROW = 34,
  INVERTED_ROW = 35,
  ROW = 36,
  WEIGHTED_ROW = 37,
  INDOOR_ROW = 38,
  BANDED_FACE_PULLS = 39,
  CHEST_SUPPORTED_DUMBBELL_ROW = 40,
  DECLINE_RING_ROW = 41,
  ELEVATED_RING_ROW = 42,
  RDL_BENT_OVER_ROW_WITH_BARBELL_DUMBBELL = 43,
  RING_ROW = 44,
  BARBELL_ROW = 45,
  BENT_OVER_ROW_WITH_BARBELL = 46,
  BENT_OVER_ROW_WITH_DUMBELL = 47,
  SEATED_UNDERHAND_GRIP_CABLE_ROW = 48,
  TRX_INVERTED_ROW = 49,
  WEIGHTED_INVERTED_ROW = 50,
  WEIGHTED_TRX_INVERTED_ROW = 51,
  DUMBBELL_ROW_WHEELCHAIR = 52,
}

export enum ShoulderPressExerciseName {
  ALTERNATING_DUMBBELL_SHOULDER_PRESS = 0,
  ARNOLD_PRESS = 1,
  BARBELL_FRONT_SQUAT_TO_PUSH_PRESS = 2,
  BARBELL_PUSH_PRESS = 3,
  BARBELL_SHOULDER_PRESS = 4,
  DEAD_CURL_PRESS = 5,
  DUMBBELL_ALTERNATING_SHOULDER_PRESS_AND_TWIST = 6,
  DUMBBELL_HAMMER_CURL_TO_LUNGE_TO_PRESS = 7,
  DUMBBELL_PUSH_PRESS = 8,
  FLOOR_INVERTED_SHOULDER_PRESS = 9,
  WEIGHTED_FLOOR_INVERTED_SHOULDER_PRESS = 10,
  INVERTED_SHOULDER_PRESS = 11,
  WEIGHTED_INVERTED_SHOULDER_PRESS = 12,
  ONE_ARM_PUSH_PRESS = 13,
  OVERHEAD_BARBELL_PRESS = 14,
  OVERHEAD_DUMBBELL_PRESS = 15,
  SEATED_BARBELL_SHOULDER_PRESS = 16,
  SEATED_DUMBBELL_SHOULDER_PRESS = 17,
  SINGLE_ARM_DUMBBELL_SHOULDER_PRESS = 18,
  SINGLE_ARM_STEP_UP_AND_PRESS = 19,
  SMITH_MACHINE_OVERHEAD_PRESS = 20,
  SPLIT_STANCE_HAMMER_CURL_TO_PRESS = 21,
  SWISS_BALL_DUMBBELL_SHOULDER_PRESS = 22,
  WEIGHT_PLATE_FRONT_RAISE = 23,
  DUMBBELL_SHOULDER_PRESS = 24,
  MILITARY_PRESS = 25,
  STRICT_PRESS = 27,
  DUMBBELL_FRONT_RAISE = 28,
  DUMBBELL_CURL_TO_OVERHEAD_PRESS_WHEELCHAIR = 29,
  ARNOLD_PRESS_WHEELCHAIR = 30,
  OVERHEAD_DUMBBELL_PRESS_WHEELCHAIR = 31,
}

export enum ShoulderStabilityExerciseName {
  _90_DEGREE_CABLE_EXTERNAL_ROTATION = 0,
  BAND_EXTERNAL_ROTATION = 1,
  BAND_INTERNAL_ROTATION = 2,
  BENT_ARM_LATERAL_RAISE_AND_EXTERNAL_ROTATION = 3,
  CABLE_EXTERNAL_ROTATION = 4,
  DUMBBELL_FACE_PULL_WITH_EXTERNAL_ROTATION = 5,
  FLOOR_I_RAISE = 6,
  WEIGHTED_FLOOR_I_RAISE = 7,
  FLOOR_T_RAISE = 8,
  WEIGHTED_FLOOR_T_RAISE = 9,
  FLOOR_Y_RAISE = 10,
  WEIGHTED_FLOOR_Y_RAISE = 11,
  INCLINE_I_RAISE = 12,
  WEIGHTED_INCLINE_I_RAISE = 13,
  INCLINE_L_RAISE = 14,
  WEIGHTED_INCLINE_L_RAISE = 15,
  INCLINE_T_RAISE = 16,
  WEIGHTED_INCLINE_T_RAISE = 17,
  INCLINE_W_RAISE = 18,
  WEIGHTED_INCLINE_W_RAISE = 19,
  INCLINE_Y_RAISE = 20,
  WEIGHTED_INCLINE_Y_RAISE = 21,
  LYING_EXTERNAL_ROTATION = 22,
  SEATED_DUMBBELL_EXTERNAL_ROTATION = 23,
  STANDING_L_RAISE = 24,
  SWISS_BALL_I_RAISE = 25,
  WEIGHTED_SWISS_BALL_I_RAISE = 26,
  SWISS_BALL_T_RAISE = 27,
  WEIGHTED_SWISS_BALL_T_RAISE = 28,
  SWISS_BALL_W_RAISE = 29,
  WEIGHTED_SWISS_BALL_W_RAISE = 30,
  SWISS_BALL_Y_RAISE = 31,
  WEIGHTED_SWISS_BALL_Y_RAISE = 32,
  CABLE_INTERNAL_ROTATION = 33,
  LYING_INTERNAL_ROTATION = 34,
  SEATED_DUMBBELL_INTERNAL_ROTATION = 35,
}

export enum ShrugExerciseName {
  BARBELL_JUMP_SHRUG = 0,
  BARBELL_SHRUG = 1,
  BARBELL_UPRIGHT_ROW = 2,
  BEHIND_THE_BACK_SMITH_MACHINE_SHRUG = 3,
  DUMBBELL_JUMP_SHRUG = 4,
  DUMBBELL_SHRUG = 5,
  DUMBBELL_UPRIGHT_ROW = 6,
  INCLINE_DUMBBELL_SHRUG = 7,
  OVERHEAD_BARBELL_SHRUG = 8,
  OVERHEAD_DUMBBELL_SHRUG = 9,
  SCAPTION_AND_SHRUG = 10,
  SCAPULAR_RETRACTION = 11,
  SERRATUS_CHAIR_SHRUG = 12,
  WEIGHTED_SERRATUS_CHAIR_SHRUG = 13,
  SERRATUS_SHRUG = 14,
  WEIGHTED_SERRATUS_SHRUG = 15,
  WIDE_GRIP_JUMP_SHRUG = 16,
  WIDE_GRIP_BARBELL_SHRUG = 17,
  BEHIND_THE_BACK_SHRUG = 18,
  DUMBBELL_SHRUG_WHEELCHAIR = 19,
  SHRUG_WHEELCHAIR = 20,
  SHRUG_ARM_DOWN_WHEELCHAIR = 21,
  SHRUG_ARM_MID_WHEELCHAIR = 22,
  SHRUG_ARM_UP_WHEELCHAIR = 23,
  UPRIGHT_ROW = 24,
}

export enum SitUpExerciseName {
  ALTERNATING_SIT_UP = 0,
  WEIGHTED_ALTERNATING_SIT_UP = 1,
  BENT_KNEE_V_UP = 2,
  WEIGHTED_BENT_KNEE_V_UP = 3,
  BUTTERFLY_SIT_UP = 4,
  WEIGHTED_BUTTERFLY_SITUP = 5,
  CROSS_PUNCH_ROLL_UP = 6,
  WEIGHTED_CROSS_PUNCH_ROLL_UP = 7,
  CROSSED_ARMS_SIT_UP = 8,
  WEIGHTED_CROSSED_ARMS_SIT_UP = 9,
  GET_UP_SIT_UP = 10,
  WEIGHTED_GET_UP_SIT_UP = 11,
  HOVERING_SIT_UP = 12,
  WEIGHTED_HOVERING_SIT_UP = 13,
  KETTLEBELL_SIT_UP = 14,
  MEDICINE_BALL_ALTERNATING_V_UP = 15,
  MEDICINE_BALL_SIT_UP = 16,
  MEDICINE_BALL_V_UP = 17,
  MODIFIED_SIT_UP = 18,
  NEGATIVE_SIT_UP = 19,
  ONE_ARM_FULL_SIT_UP = 20,
  RECLINING_CIRCLE = 21,
  WEIGHTED_RECLINING_CIRCLE = 22,
  REVERSE_CURL_UP = 23,
  WEIGHTED_REVERSE_CURL_UP = 24,
  SINGLE_LEG_SWISS_BALL_JACKKNIFE = 25,
  WEIGHTED_SINGLE_LEG_SWISS_BALL_JACKKNIFE = 26,
  THE_TEASER = 27,
  THE_TEASER_WEIGHTED = 28,
  THREE_PART_ROLL_DOWN = 29,
  WEIGHTED_THREE_PART_ROLL_DOWN = 30,
  V_UP = 31,
  WEIGHTED_V_UP = 32,
  WEIGHTED_RUSSIAN_TWIST_ON_SWISS_BALL = 33,
  WEIGHTED_SIT_UP = 34,
  X_ABS = 35,
  WEIGHTED_X_ABS = 36,
  SIT_UP = 37,
  GHD_SIT_UPS = 38,
  SIT_UP_TURKISH_GET_UP = 39,
  RUSSIAN_TWIST_ON_SWISS_BALL = 40,
}

export enum SquatExerciseName {
  LEG_PRESS = 0,
  BACK_SQUAT_WITH_BODY_BAR = 1,
  BACK_SQUATS = 2,
  WEIGHTED_BACK_SQUATS = 3,
  BALANCING_SQUAT = 4,
  WEIGHTED_BALANCING_SQUAT = 5,
  BARBELL_BACK_SQUAT = 6,
  BARBELL_BOX_SQUAT = 7,
  BARBELL_FRONT_SQUAT = 8,
  BARBELL_HACK_SQUAT = 9,
  BARBELL_HANG_SQUAT_SNATCH = 10,
  BARBELL_LATERAL_STEP_UP = 11,
  BARBELL_QUARTER_SQUAT = 12,
  BARBELL_SIFF_SQUAT = 13,
  BARBELL_SQUAT_SNATCH = 14,
  BARBELL_SQUAT_WITH_HEELS_RAISED = 15,
  BARBELL_STEPOVER = 16,
  BARBELL_STEP_UP = 17,
  BENCH_SQUAT_WITH_ROTATIONAL_CHOP = 18,
  WEIGHTED_BENCH_SQUAT_WITH_ROTATIONAL_CHOP = 19,
  BODY_WEIGHT_WALL_SQUAT = 20,
  WEIGHTED_WALL_SQUAT = 21,
  BOX_STEP_SQUAT = 22,
  WEIGHTED_BOX_STEP_SQUAT = 23,
  BRACED_SQUAT = 24,
  CROSSED_ARM_BARBELL_FRONT_SQUAT = 25,
  CROSSOVER_DUMBBELL_STEP_UP = 26,
  DUMBBELL_FRONT_SQUAT = 27,
  DUMBBELL_SPLIT_SQUAT = 28,
  DUMBBELL_SQUAT = 29,
  DUMBBELL_SQUAT_CLEAN = 30,
  DUMBBELL_STEPOVER = 31,
  DUMBBELL_STEP_UP = 32,
  ELEVATED_SINGLE_LEG_SQUAT = 33,
  WEIGHTED_ELEVATED_SINGLE_LEG_SQUAT = 34,
  FIGURE_FOUR_SQUATS = 35,
  WEIGHTED_FIGURE_FOUR_SQUATS = 36,
  GOBLET_SQUAT = 37,
  KETTLEBELL_SQUAT = 38,
  KETTLEBELL_SWING_OVERHEAD = 39,
  KETTLEBELL_SWING_WITH_FLIP_TO_SQUAT = 40,
  LATERAL_DUMBBELL_STEP_UP = 41,
  ONE_LEGGED_SQUAT = 42,
  OVERHEAD_DUMBBELL_SQUAT = 43,
  OVERHEAD_SQUAT = 44,
  PARTIAL_SINGLE_LEG_SQUAT = 45,
  WEIGHTED_PARTIAL_SINGLE_LEG_SQUAT = 46,
  PISTOL_SQUAT = 47,
  WEIGHTED_PISTOL_SQUAT = 48,
  PLIE_SLIDES = 49,
  WEIGHTED_PLIE_SLIDES = 50,
  PLIE_SQUAT = 51,
  WEIGHTED_PLIE_SQUAT = 52,
  PRISONER_SQUAT = 53,
  WEIGHTED_PRISONER_SQUAT = 54,
  SINGLE_LEG_BENCH_GET_UP = 55,
  WEIGHTED_SINGLE_LEG_BENCH_GET_UP = 56,
  SINGLE_LEG_BENCH_SQUAT = 57,
  WEIGHTED_SINGLE_LEG_BENCH_SQUAT = 58,
  SINGLE_LEG_SQUAT_ON_SWISS_BALL = 59,
  WEIGHTED_SINGLE_LEG_SQUAT_ON_SWISS_BALL = 60,
  SQUAT = 61,
  WEIGHTED_SQUAT = 62,
  SQUATS_WITH_BAND = 63,
  STAGGERED_SQUAT = 64,
  WEIGHTED_STAGGERED_SQUAT = 65,
  STEP_UP = 66,
  WEIGHTED_STEP_UP = 67,
  SUITCASE_SQUATS = 68,
  SUMO_SQUAT = 69,
  SUMO_SQUAT_SLIDE_IN = 70,
  WEIGHTED_SUMO_SQUAT_SLIDE_IN = 71,
  SUMO_SQUAT_TO_HIGH_PULL = 72,
  SUMO_SQUAT_TO_STAND = 73,
  WEIGHTED_SUMO_SQUAT_TO_STAND = 74,
  SUMO_SQUAT_WITH_ROTATION = 75,
  WEIGHTED_SUMO_SQUAT_WITH_ROTATION = 76,
  SWISS_BALL_BODY_WEIGHT_WALL_SQUAT = 77,
  WEIGHTED_SWISS_BALL_WALL_SQUAT = 78,
  THRUSTERS = 79,
  UNEVEN_SQUAT = 80,
  WEIGHTED_UNEVEN_SQUAT = 81,
  WAIST_SLIMMING_SQUAT = 82,
  WALL_BALL = 83,
  WIDE_STANCE_BARBELL_SQUAT = 84,
  WIDE_STANCE_GOBLET_SQUAT = 85,
  ZERCHER_SQUAT = 86,
  /**
   * kbsOverhead (Deprecated do not use)
   */
  KBS_OVERHEAD = 87,
  SQUAT_AND_SIDE_KICK = 88,
  SQUAT_JUMPS_IN_N_OUT = 89,
  PILATES_PLIE_SQUATS_PARALLEL_TURNED_OUT_FLAT_AND_HEELS = 90,
  RELEVE_STRAIGHT_LEG_AND_KNEE_BENT_WITH_ONE_LEG_VARIATION = 91,
  ALTERNATING_BOX_DUMBBELL_STEP_UPS = 92,
  DUMBBELL_OVERHEAD_SQUAT_SINGLE_ARM = 93,
  DUMBBELL_SQUAT_SNATCH = 94,
  MEDICINE_BALL_SQUAT = 95,
  WALL_BALL_SQUAT_AND_PRESS = 97,
  SQUAT_AMERICAN_SWING = 98,
  AIR_SQUAT = 100,
  DUMBBELL_THRUSTERS = 101,
  OVERHEAD_BARBELL_SQUAT = 102,
}

export enum TotalBodyExerciseName {
  BURPEE = 0,
  WEIGHTED_BURPEE = 1,
  BURPEE_BOX_JUMP = 2,
  WEIGHTED_BURPEE_BOX_JUMP = 3,
  HIGH_PULL_BURPEE = 4,
  MAN_MAKERS = 5,
  ONE_ARM_BURPEE = 6,
  SQUAT_THRUSTS = 7,
  WEIGHTED_SQUAT_THRUSTS = 8,
  SQUAT_PLANK_PUSH_UP = 9,
  WEIGHTED_SQUAT_PLANK_PUSH_UP = 10,
  STANDING_T_ROTATION_BALANCE = 11,
  WEIGHTED_STANDING_T_ROTATION_BALANCE = 12,
  BARBELL_BURPEE = 13,
  BURPEE_BOX_JUMP_OVER_YES_LITERALLY_JUMPING_OVER_THE_BOX = 15,
  BURPEE_BOX_JUMP_STEP_UP_OVER = 16,
  LATERAL_BARBELL_BURPEE = 17,
  TOTAL_BODY_BURPEE_OVER_BAR = 18,
  BURPEE_BOX_JUMP_OVER = 19,
  BURPEE_WHEELCHAIR = 20,
}

export enum MoveExerciseName {
  ARCH_AND_CURL = 0,
  ARM_CIRCLES_WITH_BALL_BAND_AND_WEIGHT = 1,
  ARM_STRETCH = 2,
  BACK_MASSAGE = 3,
  BELLY_BREATHING = 4,
  BRIDGE_WITH_BALL = 5,
  DIAMOND_LEG_CRUNCH = 6,
  DIAMOND_LEG_LIFT = 7,
  EIGHT_POINT_SHOULDER_OPENER = 8,
  FOOT_ROLLING = 9,
  FOOTWORK = 10,
  FOOTWORK_ON_DISC = 11,
  FORWARD_FOLD = 12,
  FROG_WITH_BAND = 13,
  HALF_ROLL_UP = 14,
  HAMSTRING_CURL = 15,
  HAMSTRING_STRETCH = 16,
  HIP_STRETCH = 17,
  HUG_A_TREE_WITH_BALL_BAND_AND_WEIGHT = 18,
  KNEE_CIRCLES = 19,
  KNEE_FOLDS_ON_DISC = 20,
  LATERAL_FLEXION = 21,
  LEG_STRETCH_WITH_BAND = 22,
  LEG_STRETCH_WITH_LEG_CIRCLES = 23,
  LOWER_LIFT_ON_DISC = 24,
  LUNGE_SQUAT = 25,
  LUNGES_WITH_KNEE_LIFT = 26,
  MERMAID_STRETCH = 27,
  NEUTRAL_PELVIC_POSITION = 28,
  PELVIC_CLOCKS_ON_DISC = 29,
  PILATES_PLIE_SQUATS_PARALLEL_TURNED_OUT_FLAT_AND_HEELS_WITH_CHAIR = 30,
  PIRIFORMIS_STRETCH = 31,
  PLANK_KNEE_CROSSES = 32,
  PLANK_KNEE_PULLS = 33,
  PLANK_UP_DOWNS = 34,
  PRAYER_MUDRA = 35,
  PSOAS_LUNGE_STRETCH = 36,
  RIBCAGE_BREATHING = 37,
  ROLL_DOWN = 38,
  ROLL_UP_WITH_WEIGHT_AND_BAND = 39,
  SAW = 40,
  SCAPULAR_STABILIZATION = 41,
  SCISSORS_ON_DISC = 42,
  SEATED_HIP_STRETCHUP = 43,
  SEATED_TWIST = 44,
  SHAVING_THE_HEAD_WITH_BALL_BAND_AND_WEIGHT = 45,
  SPINAL_TWIST = 46,
  SPINAL_TWIST_STRETCH = 47,
  SPINE_STRETCH_FORWARD = 48,
  SQUAT_OPEN_ARM_TWIST_POSE = 49,
  SQUATS_WITH_BALL = 50,
  STAND_AND_HANG = 51,
  STANDING_SIDE_STRETCH = 52,
  STANDING_SINGLE_LEG_FORWARD_BEND_WITH_IT_BAND_OPENER = 53,
  STRAIGHT_LEG_CRUNCH_WITH_LEG_LIFT = 54,
  STRAIGHT_LEG_CRUNCH_WITH_LEG_LIFT_WITH_BALL = 55,
  STRAIGHT_LEG_CRUNCH_WITH_LEGS_CROSSED = 56,
  STRAIGHT_LEG_CRUNCH_WITH_LEGS_CROSSED_WITH_BALL = 57,
  STRAIGHT_LEG_DIAGONAL_CRUNCH = 58,
  STRAIGHT_LEG_DIAGONAL_CRUNCH_WITH_BALL = 59,
  TAILBONE_CURL = 60,
  THROAT_LOCK = 61,
  TICK_TOCK_SIDE_ROLL = 62,
  TWIST = 63,
  V_LEG_CRUNCHES = 64,
  V_SIT = 65,
  FORWARD_FOLD_WHEELCHAIR = 66,
  FORWARD_FOLD_PLUS_WHEELCHAIR = 67,
  ARM_CIRCLES_LOW_FORWARD_WHEELCHAIR = 68,
  ARM_CIRCLES_MID_FORWARD_WHEELCHAIR = 69,
  ARM_CIRCLES_HIGH_FORWARD_WHEELCHAIR = 70,
  ARM_CIRCLES_LOW_BACKWARD_WHEELCHAIR = 71,
  ARM_CIRCLES_MID_BACKWARD_WHEELCHAIR = 72,
  ARM_CIRCLES_HIGH_BACKWARD_WHEELCHAIR = 73,
  CORE_TWISTS_WHEELCHAIR = 74,
  ARM_RAISE_WHEELCHAIR = 75,
  CHEST_EXPAND_WHEELCHAIR = 76,
  ARM_EXTEND_WHEELCHAIR = 77,
  FORWARD_BEND_WHEELCHAIR = 78,
  TOE_TOUCH_WHEELCHAIR = 79,
  EXTENDED_TOE_TOUCH_WHEELCHAIR = 80,
  SEATED_ARM_CIRCLES = 81,
  TRUNK_ROTATIONS = 82,
  SEATED_TRUNK_ROTATIONS = 83,
  TOE_TOUCH = 84,
}

export enum PoseExerciseName {
  ALL_FOURS = 0,
  ANKLE_TO_KNEE = 1,
  BABY_COBRA = 2,
  BOAT = 3,
  BOUND_ANGLE = 4,
  BOUND_SEATED_SINGLE_LEG_FORWARD_BEND = 5,
  BOW = 6,
  BOWED_HALF_MOON = 7,
  BRIDGE = 8,
  CAT = 9,
  CHAIR = 10,
  CHILDS = 11,
  CORPSE = 12,
  COW_FACE = 13,
  COW = 14,
  DEVOTIONAL_WARRIOR = 15,
  DOLPHIN_PLANK = 16,
  DOLPHIN = 17,
  DOWN_DOG_KNEE_TO_NOSE = 18,
  DOWN_DOG_SPLIT = 19,
  DOWN_DOG_SPLIT_OPEN_HIP_BENT_KNEE = 20,
  DOWNWARD_FACING_DOG = 21,
  EAGLE = 22,
  EASY_SEATED = 23,
  EXTENDED_PUPPY = 24,
  EXTENDED_SIDE_ANGLE = 25,
  FISH = 26,
  FOUR_LIMBED_STAFF = 27,
  FULL_SPLIT = 28,
  GATE = 29,
  HALF_CHAIR_HALF_ANKLE_TO_KNEE = 30,
  HALF_MOON = 31,
  HEAD_TO_KNEE = 32,
  HERON = 33,
  HEROS = 34,
  HIGH_LUNGE = 35,
  KNEES_CHEST_CHIN = 36,
  LIZARD = 37,
  LOCUST = 38,
  LOW_LUNGE = 39,
  LOW_LUNGE_TWIST = 40,
  LOW_LUNGE_WITH_KNEE_DOWN = 41,
  MERMAID = 42,
  MOUNTAIN = 43,
  ONE_LEGGED_DOWNWARD_FACING_POSE_OPEN_HIP_BENT_KNEE = 44,
  ONE_LEGGED_PIGEON = 45,
  PEACEFUL_WARRIOR = 46,
  PLANK = 47,
  PLOW = 48,
  RECLINED_HAND_TO_FOOT = 49,
  REVOLVED_HALF_MOON = 50,
  REVOLVED_HEAD_TO_KNEE = 51,
  REVOLVED_TRIANGLE = 52,
  RUNNERS_LUNGE = 53,
  SEATED_EASY_SIDE_BEND = 54,
  SEATED_EASY_TWIST = 55,
  SEATED_LONG_LEG_FORWARD_BEND = 56,
  SEATED_WIDE_LEG_FORWARD_BEND = 57,
  SHOULDER_STAND = 58,
  SIDE_BOAT = 59,
  SIDE_PLANK = 60,
  SPHINX = 61,
  SQUAT_OPEN_ARM_TWIST = 62,
  SQUAT_PALM_PRESS = 63,
  STAFF = 64,
  STANDING_ARMS_UP = 65,
  STANDING_FORWARD_BEND_HALFWAY_UP = 66,
  STANDING_FORWARD_BEND = 67,
  STANDING_SIDE_OPENER = 68,
  STANDING_SINGLE_LEG_FORWARD_BEND = 69,
  STANDING_SPLIT = 70,
  STANDING_WIDE_LEG_FORWARD_BEND = 71,
  STANDING_WIDE_LEG_FORWARD_BEND_WITH_TWIST = 72,
  SUPINE_SPINAL_TWIST = 73,
  TABLE_TOP = 74,
  THREAD_THE_NEEDLE = 75,
  THUNDERBOLT = 76,
  THUNDERBOLT_POSE_BOTH_SIDES_ARM_STRETCH = 77,
  TREE = 78,
  TRIANGLE = 79,
  UP_DOG = 80,
  UPWARD_FACING_PLANK = 81,
  WARRIOR_ONE = 82,
  WARRIOR_THREE = 83,
  WARRIOR_TWO = 84,
  WHEEL = 85,
  WIDE_SIDE_LUNGE = 86,
  DEEP_BREATHING_WHEELCHAIR = 87,
  DEEP_BREATHING_LOW_WHEELCHAIR = 88,
  DEEP_BREATHING_MID_WHEELCHAIR = 89,
  DEEP_BREATHING_HIGH_WHEELCHAIR = 90,
  PRAYER_WHEELCHAIR = 91,
  OVERHEAD_PRAYER_WHEELCHAIR = 92,
  CACTUS_WHEELCHAIR = 93,
  BREATHING_PUNCHES_WHEELCHAIR = 94,
  BREATHING_PUNCHES_EXTENDED_WHEELCHAIR = 95,
  BREATHING_PUNCHES_OVERHEAD_WHEELCHAIR = 96,
  BREATHING_PUNCHES_OVERHEAD_AND_DOWN_WHEELCHAIR = 97,
  BREATHING_PUNCHES_SIDE_WHEELCHAIR = 98,
  BREATHING_PUNCHES_EXTENDED_SIDE_WHEELCHAIR = 99,
  BREATHING_PUNCHES_OVERHEAD_SIDE_WHEELCHAIR = 100,
  BREATHING_PUNCHES_OVERHEAD_AND_DOWN_SIDE_WHEELCHAIR = 101,
  LEFT_HAND_BACK_WHEELCHAIR = 102,
  TRIANGLE_WHEELCHAIR = 103,
  THREAD_THE_NEEDLE_WHEELCHAIR = 104,
  NECK_FLEXION_AND_EXTENSION_WHEELCHAIR = 105,
  NECK_LATERAL_FLEXION_WHEELCHAIR = 106,
  SPINE_FLEXION_AND_EXTENSION_WHEELCHAIR = 107,
  SPINE_ROTATION_WHEELCHAIR = 108,
  SPINE_LATERAL_FLEXION_WHEELCHAIR = 109,
  ALTERNATIVE_SKIING_WHEELCHAIR = 110,
  REACH_FORWARD_WHEELCHAIR = 111,
  WARRIOR_WHEELCHAIR = 112,
  REVERSE_WARRIOR_WHEELCHAIR = 113,
  DOWNWARD_FACING_DOG_TO_COBRA = 114,
  SEATED_CAT_COW = 115,
}

export enum TricepsExtensionExerciseName {
  BENCH_DIP = 0,
  WEIGHTED_BENCH_DIP = 1,
  BODY_WEIGHT_DIP = 2,
  CABLE_KICKBACK = 3,
  CABLE_LYING_TRICEPS_EXTENSION = 4,
  CABLE_OVERHEAD_TRICEPS_EXTENSION = 5,
  DUMBBELL_KICKBACK = 6,
  DUMBBELL_LYING_TRICEPS_EXTENSION = 7,
  EZ_BARBELL_OVERHEAD_TRICEPS_EXTENSION = 8,
  INCLINE_DIP = 9,
  WEIGHTED_INCLINE_DIP = 10,
  INCLINE_EZ_BARBELL_LYING_TRICEPS_EXTENSION = 11,
  LYING_DUMBBELL_PULLOVER_TO_EXTENSION = 12,
  LYING_EZ_BARBELL_TRICEPS_EXTENSION = 13,
  LYING_TRICEPS_EXTENSION_TO_CLOSE_GRIP_BENCH_PRESS = 14,
  OVERHEAD_DUMBBELL_TRICEPS_EXTENSION = 15,
  RECLINING_TRICEPS_PRESS = 16,
  REVERSE_GRIP_PRESSDOWN = 17,
  REVERSE_GRIP_TRICEPS_PRESSDOWN = 18,
  ROPE_PRESSDOWN = 19,
  SEATED_BARBELL_OVERHEAD_TRICEPS_EXTENSION = 20,
  SEATED_DUMBBELL_OVERHEAD_TRICEPS_EXTENSION = 21,
  SEATED_EZ_BARBELL_OVERHEAD_TRICEPS_EXTENSION = 22,
  SEATED_SINGLE_ARM_OVERHEAD_DUMBBELL_EXTENSION = 23,
  SINGLE_ARM_DUMBBELL_OVERHEAD_TRICEPS_EXTENSION = 24,
  SINGLE_DUMBBELL_SEATED_OVERHEAD_TRICEPS_EXTENSION = 25,
  SINGLE_LEG_BENCH_DIP_AND_KICK = 26,
  WEIGHTED_SINGLE_LEG_BENCH_DIP_AND_KICK = 27,
  SINGLE_LEG_DIP = 28,
  WEIGHTED_SINGLE_LEG_DIP = 29,
  STATIC_LYING_TRICEPS_EXTENSION = 30,
  SUSPENDED_DIP = 31,
  WEIGHTED_SUSPENDED_DIP = 32,
  SWISS_BALL_DUMBBELL_LYING_TRICEPS_EXTENSION = 33,
  SWISS_BALL_EZ_BARBELL_LYING_TRICEPS_EXTENSION = 34,
  SWISS_BALL_EZ_BARBELL_OVERHEAD_TRICEPS_EXTENSION = 35,
  TABLETOP_DIP = 36,
  WEIGHTED_TABLETOP_DIP = 37,
  TRICEPS_EXTENSION_ON_FLOOR = 38,
  TRICEPS_PRESSDOWN = 39,
  WEIGHTED_DIP = 40,
  ALTERNATING_DUMBBELL_LYING_TRICEPS_EXTENSION = 41,
  TRICEPS_PRESS = 42,
  DUMBBELL_KICKBACK_WHEELCHAIR = 43,
  OVERHEAD_DUMBBELL_TRICEPS_EXTENSION_WHEELCHAIR = 44,
}

export enum WarmUpExerciseName {
  QUADRUPED_ROCKING = 0,
  NECK_TILTS = 1,
  ANKLE_CIRCLES = 2,
  ANKLE_DORSIFLEXION_WITH_BAND = 3,
  ANKLE_INTERNAL_ROTATION = 4,
  ARM_CIRCLES = 5,
  BENT_OVER_REACH_TO_SKY = 6,
  CAT_CAMEL = 7,
  ELBOW_TO_FOOT_LUNGE = 8,
  FORWARD_AND_BACKWARD_LEG_SWINGS = 9,
  GROINERS = 10,
  INVERTED_HAMSTRING_STRETCH = 11,
  LATERAL_DUCK_UNDER = 12,
  NECK_ROTATIONS = 13,
  OPPOSITE_ARM_AND_LEG_BALANCE = 14,
  REACH_ROLL_AND_LIFT = 15,
  /**
   * scorpion (Deprecated do not use)
   */
  SCORPION = 16,
  SHOULDER_CIRCLES = 17,
  SIDE_TO_SIDE_LEG_SWINGS = 18,
  SLEEPER_STRETCH = 19,
  SLIDE_OUT = 20,
  SWISS_BALL_HIP_CROSSOVER = 21,
  SWISS_BALL_REACH_ROLL_AND_LIFT = 22,
  SWISS_BALL_WINDSHIELD_WIPERS = 23,
  THORACIC_ROTATION = 24,
  WALKING_HIGH_KICKS = 25,
  WALKING_HIGH_KNEES = 26,
  WALKING_KNEE_HUGS = 27,
  WALKING_LEG_CRADLES = 28,
  WALKOUT = 29,
  WALKOUT_FROM_PUSH_UP_POSITION = 30,
  BICEPS_STRETCH = 31,
  GLUTES_STRETCH = 32,
  STANDING_HAMSTRING_STRETCH = 33,
  STRETCH_90_90 = 34,
  STRETCH_ABS = 35,
  STRETCH_BUTTERFLY = 36,
  STRETCH_CALF = 37,
  STRETCH_CAT_COW = 38,
  STRETCH_CHILDS_POSE = 39,
  STRETCH_COBRA = 40,
  STRETCH_FOREARMS = 41,
  STRETCH_FORWARD_GLUTES = 42,
  STRETCH_FRONT_SPLIT = 43,
  STRETCH_HAMSTRING = 44,
  STRETCH_HIP_FLEXOR_AND_QUAD = 45,
  STRETCH_LAT = 46,
  STRETCH_LEVATOR_SCAPULAE = 47,
  STRETCH_LUNGE_WITH_SPINAL_TWIST = 48,
  STRETCH_LUNGING_HIP_FLEXOR = 49,
  STRETCH_LYING_ABDUCTION = 50,
  STRETCH_LYING_IT_BAND = 51,
  STRETCH_LYING_KNEE_TO_CHEST = 52,
  STRETCH_LYING_PIRIFORMIS = 53,
  STRETCH_LYING_SPINAL_TWIST = 54,
  STRETCH_NECK = 55,
  STRETCH_OBLIQUES = 56,
  STRETCH_OVER_UNDER_SHOULDER = 57,
  STRETCH_PECTORAL = 58,
  STRETCH_PIGEON_POSE = 59,
  STRETCH_PIRIFORMIS = 60,
  STRETCH_QUAD = 61,
  STRETCH_SCORPION = 62,
  STRETCH_SHOULDER = 63,
  STRETCH_SIDE = 64,
  STRETCH_SIDE_LUNGE = 65,
  STRETCH_SIDE_SPLIT = 66,
  STRETCH_STANDING_IT_BAND = 67,
  STRETCH_STRADDLE = 68,
  STRETCH_TRICEPS = 69,
  STRETCH_WALL_CHEST_AND_SHOULDER = 70,
  NECK_ROTATIONS_WHEELCHAIR = 71,
  HALF_KNEELING_ARM_ROTATION = 72,
  THREE_WAY_ANKLE_MOBILIZATION = 73,
  /**
   * ninetyNinetyHipSwitch (90_90_hip_switch)
   */
  NINETY_NINETY_HIP_SWITCH = 74,
  ACTIVE_FROG = 75,
  SHOULDER_SWEEPS = 76,
  ANKLE_LUNGES = 77,
  BACK_ROLL_FOAM_ROLLER = 78,
  BEAR_CRAWL = 79,
  LATISSIMUS_DORSI_FOAM_ROLL = 80,
  REVERSE_T_HIP_OPENER = 81,
  SHOULDER_ROLLS = 82,
  CHEST_OPENERS = 83,
  TRICEPS_STRETCH = 84,
  UPPER_BACK_STRETCH = 85,
  HIP_CIRCLES = 86,
  ANKLE_STRETCH = 87,
  MARCHING_IN_PLACE = 88,
  TRICEPS_STRETCH_WHEELCHAIR = 89,
  UPPER_BACK_STRETCH_WHEELCHAIR = 90,
}

export enum RunExerciseName {
  RUN = 0,
  WALK = 1,
  JOG = 2,
  SPRINT = 3,
  RUN_OR_WALK = 4,
  SPEED_WALK = 5,
  WARM_UP = 6,
}

export enum BikeExerciseName {
  BIKE = 0,
  RIDE = 1,
  SPRINT = 2,
}

export enum BandedExercisesExerciseName {
  AB_TWIST = 1,
  BACK_EXTENSION = 2,
  BICYCLE_CRUNCH = 3,
  CALF_RAISES = 4,
  CHEST_PRESS = 5,
  CLAM_SHELLS = 6,
  CURL = 7,
  DEADBUG = 8,
  DEADLIFT = 9,
  DONKEY_KICK = 10,
  EXTERNAL_ROTATION = 11,
  EXTERNAL_ROTATION_AT_90_DEGREE_ABDUCTION = 12,
  FACE_PULL = 13,
  FIRE_HYDRANT = 14,
  FLY = 15,
  FRONT_RAISE = 16,
  GLUTE_BRIDGE = 17,
  HAMSTRING_CURLS = 18,
  HIGH_PLANK_LEG_LIFTS = 19,
  HIP_EXTENSION = 20,
  INTERNAL_ROTATION = 21,
  JUMPING_JACK = 22,
  KNEELING_CRUNCH = 23,
  LATERAL_BAND_WALKS = 24,
  LATERAL_RAISE = 25,
  LATPULL = 26,
  LEG_ABDUCTION = 27,
  LEG_ADDUCTION = 28,
  LEG_EXTENSION = 29,
  LUNGE = 30,
  PLANK = 31,
  PULL_APART = 32,
  PUSH_UPS = 33,
  REVERSE_CRUNCH = 34,
  ROW = 35,
  SHOULDER_ABDUCTION = 36,
  SHOULDER_EXTENSION = 37,
  SHOULDER_EXTERNAL_ROTATION = 38,
  SHOULDER_FLEXION_TO_90_DEGREES = 39,
  SIDE_PLANK_LEG_LIFTS = 40,
  SIDE_RAISE = 41,
  SQUAT = 42,
  SQUAT_TO_PRESS = 43,
  TRICEP_EXTENSION = 44,
  TRICEP_KICKBACK = 45,
  UPRIGHT_ROW = 46,
  WALL_CRAWL_WITH_EXTERNAL_ROTATION = 47,
  LATERAL_RAISE_WHEELCHAIR = 49,
  TRICEPS_EXTENSION_WHEELCHAIR = 50,
  CHEST_FLY_INCLINE_WHEELCHAIR = 51,
  CHEST_FLY_DECLINE_WHEELCHAIR = 52,
  PULL_DOWN_WHEELCHAIR = 53,
  STRAIGHT_ARM_PULL_DOWN_WHEELCHAIR = 54,
  CURL_WHEELCHAIR = 55,
  OVERHEAD_CURL_WHEELCHAIR = 56,
  FACE_PULL_WHEELCHAIR = 57,
  AROUND_THE_WORLD_WHEELCHAIR = 58,
  PULL_APART_WHEELCHAIR = 59,
  SIDE_CURL_WHEELCHAIR = 60,
  OVERHEAD_PRESS_WHEELCHAIR = 61,
}

export enum BattleRopeExerciseName {
  ALTERNATING_FIGURE_EIGHT = 0,
  ALTERNATING_JUMP_WAVE = 1,
  ALTERNATING_KNEELING_TO_STANDING_WAVE = 2,
  ALTERNATING_LUNGE_WAVE = 3,
  ALTERNATING_SQUAT_WAVE = 4,
  ALTERNATING_WAVE = 5,
  ALTERNATING_WAVE_WITH_LATERAL_SHUFFLE = 6,
  CLAP_WAVE = 7,
  DOUBLE_ARM_FIGURE_EIGHT = 8,
  DOUBLE_ARM_SIDE_TO_SIDE_SNAKE = 9,
  DOUBLE_ARM_SIDE_WAVE = 10,
  DOUBLE_ARM_SLAM = 11,
  DOUBLE_ARM_WAVE = 12,
  GRAPPLER_TOSS = 13,
  HIP_TOSS = 14,
  IN_AND_OUT_WAVE = 15,
  INSIDE_CIRCLE = 16,
  JUMPING_JACKS = 17,
  OUTSIDE_CIRCLE = 18,
  RAINBOW = 19,
  SIDE_PLANK_WAVE = 20,
  SIDEWINDER = 21,
  SITTING_RUSSIAN_TWIST = 22,
  SNAKE_WAVE = 23,
  SPLIT_JACK = 24,
  STAGE_COACH = 25,
  ULTIMATE_WARRIOR = 26,
  UPPER_CUTS = 27,
}

export enum EllipticalExerciseName {
  ELLIPTICAL = 0,
}

export enum FloorClimbExerciseName {
  FLOOR_CLIMB = 0,
}

export enum IndoorBikeExerciseName {
  AIR_BIKE = 0,
  ASSAULT_BIKE = 1,
  STATIONARY_BIKE = 3,
}

export enum IndoorRowExerciseName {
  ROWING_MACHINE = 0,
}

export enum LadderExerciseName {
  AGILITY = 0,
  SPEED = 1,
}

export enum SandbagExerciseName {
  AROUND_THE_WORLD = 0,
  BACK_SQUAT = 1,
  BEAR_CRAWL_PULL_THROUGH = 2,
  BEAR_HUG_SQUAT = 3,
  CLEAN = 4,
  CLEAN_AND_PRESS = 5,
  CURL = 6,
  FRONT_CARRY = 7,
  FRONT_SQUAT = 8,
  LUNGE = 9,
  OVERHEAD_PRESS = 10,
  PLANK_PULL_THROUGH = 11,
  ROTATIONAL_LUNGE = 12,
  ROW = 13,
  RUSSIAN_TWIST = 14,
  SHOULDERING = 15,
  SHOVELING = 16,
  SIDE_LUNGE = 17,
  SPRINT = 18,
  ZERCHER_SQUAT = 19,
}

export enum SledExerciseName {
  BACKWARD_DRAG = 0,
  CHEST_PRESS = 1,
  FORWARD_DRAG = 2,
  LOW_PUSH = 3,
  PUSH = 4,
  ROW = 5,
}

export enum SledgeHammerExerciseName {
  LATERAL_SWING = 0,
  HAMMER_SLAM = 1,
}

export enum StairStepperExerciseName {
  STAIR_STEPPER = 0,
}

export enum SuspensionExerciseName {
  CHEST_FLY = 0,
  CHEST_PRESS = 1,
  CRUNCH = 2,
  CURL = 3,
  DIP = 4,
  FACE_PULL = 5,
  GLUTE_BRIDGE = 6,
  HAMSTRING_CURL = 7,
  HIP_DROP = 8,
  INVERTED_ROW = 9,
  KNEE_DRIVE_JUMP = 10,
  KNEE_TO_CHEST = 11,
  LAT_PULLOVER = 12,
  LUNGE = 13,
  MOUNTAIN_CLIMBER = 14,
  PENDULUM = 15,
  PIKE = 16,
  PLANK = 17,
  POWER_PULL = 18,
  PULL_UP = 19,
  PUSH_UP = 20,
  REVERSE_MOUNTAIN_CLIMBER = 21,
  REVERSE_PLANK = 22,
  ROLLOUT = 23,
  ROW = 24,
  SIDE_LUNGE = 25,
  SIDE_PLANK = 26,
  SINGLE_LEG_DEADLIFT = 27,
  SINGLE_LEG_SQUAT = 28,
  SIT_UP = 29,
  SPLIT = 30,
  SQUAT = 31,
  SQUAT_JUMP = 32,
  TRICEP_PRESS = 33,
  Y_FLY = 34,
}

export enum TireExerciseName {
  FLIP = 0,
}

export enum BikeOutdoorExerciseName {
  BIKE = 0,
}

export enum RunIndoorExerciseName {
  INDOOR_TRACK_RUN = 0,
  TREADMILL = 1,
}

export enum WaterType {
  FRESH = 0,
  SALT = 1,
  EN13319 = 2,
  CUSTOM = 3,
}

export enum TissueModelType {
  /**
   * zhl16c (Buhlmann's decompression algorithm, version C)
   */
  ZHL16C = 0,
}

export enum DiveGasStatus {
  DISABLED = 0,
  ENABLED = 1,
  BACKUP_ONLY = 2,
}

export enum DiveAlert {
  NDL_REACHED = 0,
  GAS_SWITCH_PROMPTED = 1,
  NEAR_SURFACE = 2,
  APPROACHING_NDL = 3,
  PO2_WARN = 4,
  PO2_CRIT_HIGH = 5,
  PO2_CRIT_LOW = 6,
  TIME_ALERT = 7,
  DEPTH_ALERT = 8,
  DECO_CEILING_BROKEN = 9,
  DECO_COMPLETE = 10,
  SAFETY_STOP_BROKEN = 11,
  SAFETY_STOP_COMPLETE = 12,
  CNS_WARNING = 13,
  CNS_CRITICAL = 14,
  OTU_WARNING = 15,
  OTU_CRITICAL = 16,
  ASCENT_CRITICAL = 17,
  ALERT_DISMISSED_BY_KEY = 18,
  ALERT_DISMISSED_BY_TIMEOUT = 19,
  BATTERY_LOW = 20,
  BATTERY_CRITICAL = 21,
  SAFETY_STOP_STARTED = 22,
  APPROACHING_FIRST_DECO_STOP = 23,
  SETPOINT_SWITCH_AUTO_LOW = 24,
  SETPOINT_SWITCH_AUTO_HIGH = 25,
  SETPOINT_SWITCH_MANUAL_LOW = 26,
  SETPOINT_SWITCH_MANUAL_HIGH = 27,
  AUTO_SETPOINT_SWITCH_IGNORED = 28,
  SWITCHED_TO_OPEN_CIRCUIT = 29,
  SWITCHED_TO_CLOSED_CIRCUIT = 30,
  TANK_BATTERY_LOW = 32,
  /**
   * po2CcrDilLow (ccr diluent has low po2)
   */
  PO2_CCR_DIL_LOW = 33,
  /**
   * decoStopCleared (a deco stop has been cleared)
   */
  DECO_STOP_CLEARED = 34,
  /**
   * apneaNeutralBuoyancy (Target Depth Apnea Alarm triggered)
   */
  APNEA_NEUTRAL_BUOYANCY = 35,
  /**
   * apneaTargetDepth (Neutral Buoyance Apnea Alarm triggered)
   */
  APNEA_TARGET_DEPTH = 36,
  /**
   * apneaSurface (Surface Apnea Alarm triggered)
   */
  APNEA_SURFACE = 37,
  /**
   * apneaHighSpeed (High Speed Apnea Alarm triggered)
   */
  APNEA_HIGH_SPEED = 38,
  /**
   * apneaLowSpeed (Low Speed Apnea Alarm triggered)
   */
  APNEA_LOW_SPEED = 39,
}

export enum DiveAlarmType {
  /**
   * depth (Alarm when a certain depth is crossed)
   */
  DEPTH = 0,
  /**
   * time (Alarm when a certain time has transpired)
   */
  TIME = 1,
  /**
   * speed (Alarm when a certain ascent or descent rate is exceeded)
   */
  SPEED = 2,
}

export enum DiveBacklightMode {
  AT_DEPTH = 0,
  ALWAYS_ON = 1,
}

export enum SleepLevel {
  UNMEASURABLE = 0,
  AWAKE = 1,
  LIGHT = 2,
  DEEP = 3,
  REM = 4,
}

export enum Spo2MeasurementType {
  OFF_WRIST = 0,
  SPOT_CHECK = 1,
  CONTINUOUS_CHECK = 2,
  PERIODIC = 3,
}

export enum CcrSetpointSwitchMode {
  /**
   * manual (User switches setpoints manually)
   */
  MANUAL = 0,
  /**
   * automatic (Switch automatically based on depth)
   */
  AUTOMATIC = 1,
}

export enum DiveGasMode {
  OPEN_CIRCUIT = 0,
  CLOSED_CIRCUIT_DILUENT = 1,
}

export enum ProjectileType {
  /**
   * arrow (Arrow projectile type)
   */
  ARROW = 0,
  /**
   * rifleCartridge (Rifle cartridge projectile type)
   */
  RIFLE_CARTRIDGE = 1,
  /**
   * pistolCartridge (Pistol cartridge projectile type)
   */
  PISTOL_CARTRIDGE = 2,
  /**
   * shotshell (Shotshell projectile type)
   */
  SHOTSHELL = 3,
  /**
   * airRiflePellet (Air rifle pellet projectile type)
   */
  AIR_RIFLE_PELLET = 4,
  /**
   * other (Other projectile type)
   */
  OTHER = 5,
}

export enum FaveroProduct {
  ASSIOMA_UNO = 10,
  ASSIOMA_DUO = 12,
}

export enum SplitType {
  ASCENT_SPLIT = 1,
  DESCENT_SPLIT = 2,
  INTERVAL_ACTIVE = 3,
  INTERVAL_REST = 4,
  INTERVAL_WARMUP = 5,
  INTERVAL_COOLDOWN = 6,
  INTERVAL_RECOVERY = 7,
  INTERVAL_OTHER = 8,
  CLIMB_ACTIVE = 9,
  CLIMB_REST = 10,
  SURF_ACTIVE = 11,
  RUN_ACTIVE = 12,
  RUN_REST = 13,
  WORKOUT_ROUND = 14,
  /**
   * rwdRun (run/walk detection running)
   */
  RWD_RUN = 17,
  /**
   * rwdWalk (run/walk detection walking)
   */
  RWD_WALK = 18,
  WINDSURF_ACTIVE = 21,
  /**
   * rwdStand (run/walk detection standing)
   */
  RWD_STAND = 22,
  /**
   * transition (Marks the time going from ascent_split to descent_split/used in backcountry ski)
   */
  TRANSITION = 23,
  SKI_LIFT_SPLIT = 28,
  SKI_RUN_SPLIT = 29,
}

export enum ClimbProEvent {
  APPROACH = 0,
  START = 1,
  COMPLETE = 2,
}

export enum GasConsumptionRateType {
  /**
   * pressureSac (Pressure-based Surface Air Consumption)
   */
  PRESSURE_SAC = 0,
  /**
   * volumeSac (Volumetric Surface Air Consumption)
   */
  VOLUME_SAC = 1,
  /**
   * rmv (Respiratory Minute Volume)
   */
  RMV = 2,
}

export enum TapSensitivity {
  HIGH = 0,
  MEDIUM = 1,
  LOW = 2,
}

export enum RadarThreatLevelType {
  THREAT_UNKNOWN = 0,
  THREAT_NONE = 1,
  THREAT_APPROACHING = 2,
  THREAT_APPROACHING_FAST = 3,
}

export enum SleepDisruptionSeverity {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export enum MaxMetSpeedSource {
  ONBOARD_GPS = 0,
  CONNECTED_GPS = 1,
  CADENCE = 2,
}

export enum MaxMetHeartRateSource {
  /**
   * whr (Wrist Heart Rate Monitor)
   */
  WHR = 0,
  /**
   * hrm (Chest Strap Heart Rate Monitor)
   */
  HRM = 1,
}

export enum HrvStatus {
  NONE = 0,
  POOR = 1,
  LOW = 2,
  UNBALANCED = 3,
  BALANCED = 4,
}

export enum NoFlyTimeMode {
  /**
   * standard (Standard Diver Alert Network no-fly guidance)
   */
  STANDARD = 0,
  /**
   * flat24Hours (Flat 24 hour no-fly guidance)
   */
  FLAT_24_HOURS = 1,
}
