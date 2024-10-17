import { toPercent, toPercentUnit, toHex0x, toHex, sci } from './arithmeticFormatters.js';
import { dateTimeAsIso, dateTimeAsIsoNoDateIfToday, dateTimeAsUS, dateTimeAsUSNoDateIfToday, getDateTimeAsLocalFormat, getDateTimeAsLocalFormatNoDateIfToday, dateTimeSystemFormatter, dateTimeFromNow, toNanoSeconds, toMicroSeconds, toMilliSeconds, toSeconds, toMinutes, toHours, toDays, toDurationInMilliseconds, toDurationInSeconds, toDurationInHoursMinutesSeconds, toDurationInDaysHoursMinutesSeconds, toTimeTicks, toClockMilliseconds, toClockSeconds } from './dateTimeFormatters.js';
import { SIPrefix, currency, binaryPrefix } from './symbolFormatters.js';
import { toFixedUnit, stringFormater, scaledUnits, locale, simpleCountUnit, booleanValueFormatter } from './valueFormats.js';

const getCategories = () => [
  {
    name: "Misc",
    formats: [
      { name: "Number", id: "none", fn: toFixedUnit("") },
      { name: "String", id: "string", fn: stringFormater },
      {
        name: "short",
        id: "short",
        fn: scaledUnits(1e3, ["", " K", " Mil", " Bil", " Tri", " Quadr", " Quint", " Sext", " Sept"])
      },
      { name: "SI short", id: "sishort", fn: SIPrefix("") },
      { name: "Percent (0-100)", id: "percent", fn: toPercent },
      { name: "Percent (0.0-1.0)", id: "percentunit", fn: toPercentUnit },
      { name: "Humidity (%H)", id: "humidity", fn: toFixedUnit("%H") },
      { name: "Decibel", id: "dB", fn: toFixedUnit("dB") },
      { name: "Candela (cd)", id: "candela", fn: SIPrefix("cd") },
      { name: "Hexadecimal (0x)", id: "hex0x", fn: toHex0x },
      { name: "Hexadecimal", id: "hex", fn: toHex },
      { name: "Scientific notation", id: "sci", fn: sci },
      { name: "Locale format", id: "locale", fn: locale },
      { name: "Pixels", id: "pixel", fn: toFixedUnit("px") }
    ]
  },
  {
    name: "Acceleration",
    formats: [
      { name: "Meters/sec\xB2", id: "accMS2", fn: toFixedUnit("m/sec\xB2") },
      { name: "Feet/sec\xB2", id: "accFS2", fn: toFixedUnit("f/sec\xB2") },
      { name: "G unit", id: "accG", fn: toFixedUnit("g") }
    ]
  },
  {
    name: "Angle",
    formats: [
      { name: "Degrees (\xB0)", id: "degree", fn: toFixedUnit("\xB0") },
      { name: "Radians", id: "radian", fn: toFixedUnit("rad") },
      { name: "Gradian", id: "grad", fn: toFixedUnit("grad") },
      { name: "Arc Minutes", id: "arcmin", fn: toFixedUnit("arcmin") },
      { name: "Arc Seconds", id: "arcsec", fn: toFixedUnit("arcsec") }
    ]
  },
  {
    name: "Area",
    formats: [
      { name: "Square Meters (m\xB2)", id: "areaM2", fn: toFixedUnit("m\xB2") },
      { name: "Square Feet (ft\xB2)", id: "areaF2", fn: toFixedUnit("ft\xB2") },
      { name: "Square Miles (mi\xB2)", id: "areaMI2", fn: toFixedUnit("mi\xB2") },
      { name: "Acres (ac)", id: "acres", fn: toFixedUnit("ac") },
      { name: "Hectares (ha)", id: "hectares", fn: toFixedUnit("ha") }
    ]
  },
  {
    name: "Computation",
    formats: [
      { name: "FLOP/s", id: "flops", fn: SIPrefix("FLOPS") },
      { name: "MFLOP/s", id: "mflops", fn: SIPrefix("FLOPS", 2) },
      { name: "GFLOP/s", id: "gflops", fn: SIPrefix("FLOPS", 3) },
      { name: "TFLOP/s", id: "tflops", fn: SIPrefix("FLOPS", 4) },
      { name: "PFLOP/s", id: "pflops", fn: SIPrefix("FLOPS", 5) },
      { name: "EFLOP/s", id: "eflops", fn: SIPrefix("FLOPS", 6) },
      { name: "ZFLOP/s", id: "zflops", fn: SIPrefix("FLOPS", 7) },
      { name: "YFLOP/s", id: "yflops", fn: SIPrefix("FLOPS", 8) }
    ]
  },
  {
    name: "Concentration",
    formats: [
      { name: "parts-per-million (ppm)", id: "ppm", fn: toFixedUnit("ppm") },
      { name: "parts-per-billion (ppb)", id: "conppb", fn: toFixedUnit("ppb") },
      { name: "nanogram per cubic meter (ng/m\xB3)", id: "conngm3", fn: toFixedUnit("ng/m\xB3") },
      { name: "nanogram per normal cubic meter (ng/Nm\xB3)", id: "conngNm3", fn: toFixedUnit("ng/Nm\xB3") },
      { name: "microgram per cubic meter (\u03BCg/m\xB3)", id: "con\u03BCgm3", fn: toFixedUnit("\u03BCg/m\xB3") },
      { name: "microgram per normal cubic meter (\u03BCg/Nm\xB3)", id: "con\u03BCgNm3", fn: toFixedUnit("\u03BCg/Nm\xB3") },
      { name: "milligram per cubic meter (mg/m\xB3)", id: "conmgm3", fn: toFixedUnit("mg/m\xB3") },
      { name: "milligram per normal cubic meter (mg/Nm\xB3)", id: "conmgNm3", fn: toFixedUnit("mg/Nm\xB3") },
      { name: "gram per cubic meter (g/m\xB3)", id: "congm3", fn: toFixedUnit("g/m\xB3") },
      { name: "gram per normal cubic meter (g/Nm\xB3)", id: "congNm3", fn: toFixedUnit("g/Nm\xB3") },
      { name: "milligrams per decilitre (mg/dL)", id: "conmgdL", fn: toFixedUnit("mg/dL") },
      { name: "millimoles per litre (mmol/L)", id: "conmmolL", fn: toFixedUnit("mmol/L") }
    ]
  },
  {
    name: "Currency",
    formats: [
      { name: "Dollars ($)", id: "currencyUSD", fn: currency("$") },
      { name: "Pounds (\xA3)", id: "currencyGBP", fn: currency("\xA3") },
      { name: "Euro (\u20AC)", id: "currencyEUR", fn: currency("\u20AC") },
      { name: "Yen (\xA5)", id: "currencyJPY", fn: currency("\xA5") },
      { name: "Rubles (\u20BD)", id: "currencyRUB", fn: currency("\u20BD") },
      { name: "Hryvnias (\u20B4)", id: "currencyUAH", fn: currency("\u20B4") },
      { name: "Real (R$)", id: "currencyBRL", fn: currency("R$") },
      { name: "Danish Krone (kr)", id: "currencyDKK", fn: currency("kr", true) },
      { name: "Icelandic Kr\xF3na (kr)", id: "currencyISK", fn: currency("kr", true) },
      { name: "Norwegian Krone (kr)", id: "currencyNOK", fn: currency("kr", true) },
      { name: "Swedish Krona (kr)", id: "currencySEK", fn: currency("kr", true) },
      { name: "Czech koruna (czk)", id: "currencyCZK", fn: currency("czk") },
      { name: "Swiss franc (CHF)", id: "currencyCHF", fn: currency("CHF") },
      { name: "Polish Z\u0142oty (PLN)", id: "currencyPLN", fn: currency("PLN") },
      { name: "Bitcoin (\u0E3F)", id: "currencyBTC", fn: currency("\u0E3F") },
      { name: "Milli Bitcoin (\u0E3F)", id: "currencymBTC", fn: currency("mBTC") },
      { name: "Micro Bitcoin (\u0E3F)", id: "currency\u03BCBTC", fn: currency("\u03BCBTC") },
      { name: "South African Rand (R)", id: "currencyZAR", fn: currency("R") },
      { name: "Indian Rupee (\u20B9)", id: "currencyINR", fn: currency("\u20B9") },
      { name: "South Korean Won (\u20A9)", id: "currencyKRW", fn: currency("\u20A9") },
      { name: "Indonesian Rupiah (Rp)", id: "currencyIDR", fn: currency("Rp") },
      { name: "Philippine Peso (PHP)", id: "currencyPHP", fn: currency("PHP") },
      { name: "Vietnamese Dong (VND)", id: "currencyVND", fn: currency("\u0111", true) },
      { name: "Turkish Lira (\u20BA)", id: "currencyTRY", fn: currency("\u20BA", true) },
      { name: "Malaysian Ringgit (RM)", id: "currencyMYR", fn: currency("RM") },
      { name: "CFP franc (XPF)", id: "currencyXPF", fn: currency("XPF") },
      { name: "Bulgarian Lev (BGN)", id: "currencyBGN", fn: currency("BGN") },
      { name: "Guaran\xED (\u20B2)", id: "currencyPYG", fn: currency("\u20B2") },
      { name: "Uruguay Peso (UYU)", id: "currencyUYU", fn: currency("UYU") }
    ]
  },
  {
    name: "Data",
    formats: [
      { name: "bytes(IEC)", id: "bytes", fn: binaryPrefix("B") },
      { name: "bytes(SI)", id: "decbytes", fn: SIPrefix("B") },
      { name: "bits(IEC)", id: "bits", fn: binaryPrefix("b") },
      { name: "bits(SI)", id: "decbits", fn: SIPrefix("b") },
      { name: "kibibytes", id: "kbytes", fn: binaryPrefix("B", 1) },
      { name: "kilobytes", id: "deckbytes", fn: SIPrefix("B", 1) },
      { name: "mebibytes", id: "mbytes", fn: binaryPrefix("B", 2) },
      { name: "megabytes", id: "decmbytes", fn: SIPrefix("B", 2) },
      { name: "gibibytes", id: "gbytes", fn: binaryPrefix("B", 3) },
      { name: "gigabytes", id: "decgbytes", fn: SIPrefix("B", 3) },
      { name: "tebibytes", id: "tbytes", fn: binaryPrefix("B", 4) },
      { name: "terabytes", id: "dectbytes", fn: SIPrefix("B", 4) },
      { name: "pebibytes", id: "pbytes", fn: binaryPrefix("B", 5) },
      { name: "petabytes", id: "decpbytes", fn: SIPrefix("B", 5) }
    ]
  },
  {
    name: "Data rate",
    formats: [
      { name: "packets/sec", id: "pps", fn: SIPrefix("p/s") },
      { name: "bytes/sec(IEC)", id: "binBps", fn: binaryPrefix("B/s") },
      { name: "bytes/sec(SI)", id: "Bps", fn: SIPrefix("B/s") },
      { name: "bits/sec(IEC)", id: "binbps", fn: binaryPrefix("b/s") },
      { name: "bits/sec(SI)", id: "bps", fn: SIPrefix("b/s") },
      { name: "kibibytes/sec", id: "KiBs", fn: binaryPrefix("B/s", 1) },
      { name: "kibibits/sec", id: "Kibits", fn: binaryPrefix("b/s", 1) },
      { name: "kilobytes/sec", id: "KBs", fn: SIPrefix("B/s", 1) },
      { name: "kilobits/sec", id: "Kbits", fn: SIPrefix("b/s", 1) },
      { name: "mebibytes/sec", id: "MiBs", fn: binaryPrefix("B/s", 2) },
      { name: "mebibits/sec", id: "Mibits", fn: binaryPrefix("b/s", 2) },
      { name: "megabytes/sec", id: "MBs", fn: SIPrefix("B/s", 2) },
      { name: "megabits/sec", id: "Mbits", fn: SIPrefix("b/s", 2) },
      { name: "gibibytes/sec", id: "GiBs", fn: binaryPrefix("B/s", 3) },
      { name: "gibibits/sec", id: "Gibits", fn: binaryPrefix("b/s", 3) },
      { name: "gigabytes/sec", id: "GBs", fn: SIPrefix("B/s", 3) },
      { name: "gigabits/sec", id: "Gbits", fn: SIPrefix("b/s", 3) },
      { name: "tebibytes/sec", id: "TiBs", fn: binaryPrefix("B/s", 4) },
      { name: "tebibits/sec", id: "Tibits", fn: binaryPrefix("b/s", 4) },
      { name: "terabytes/sec", id: "TBs", fn: SIPrefix("B/s", 4) },
      { name: "terabits/sec", id: "Tbits", fn: SIPrefix("b/s", 4) },
      { name: "pebibytes/sec", id: "PiBs", fn: binaryPrefix("B/s", 5) },
      { name: "pebibits/sec", id: "Pibits", fn: binaryPrefix("b/s", 5) },
      { name: "petabytes/sec", id: "PBs", fn: SIPrefix("B/s", 5) },
      { name: "petabits/sec", id: "Pbits", fn: SIPrefix("b/s", 5) }
    ]
  },
  {
    name: "Date & time",
    formats: [
      { name: "Datetime ISO", id: "dateTimeAsIso", fn: dateTimeAsIso },
      { name: "Datetime ISO (No date if today)", id: "dateTimeAsIsoNoDateIfToday", fn: dateTimeAsIsoNoDateIfToday },
      { name: "Datetime US", id: "dateTimeAsUS", fn: dateTimeAsUS },
      { name: "Datetime US (No date if today)", id: "dateTimeAsUSNoDateIfToday", fn: dateTimeAsUSNoDateIfToday },
      { name: "Datetime local", id: "dateTimeAsLocal", fn: getDateTimeAsLocalFormat() },
      {
        name: "Datetime local (No date if today)",
        id: "dateTimeAsLocalNoDateIfToday",
        fn: getDateTimeAsLocalFormatNoDateIfToday()
      },
      { name: "Datetime default", id: "dateTimeAsSystem", fn: dateTimeSystemFormatter },
      { name: "From Now", id: "dateTimeFromNow", fn: dateTimeFromNow }
    ]
  },
  {
    name: "Energy",
    formats: [
      { name: "Watt (W)", id: "watt", fn: SIPrefix("W") },
      { name: "Kilowatt (kW)", id: "kwatt", fn: SIPrefix("W", 1) },
      { name: "Megawatt (MW)", id: "megwatt", fn: SIPrefix("W", 2) },
      { name: "Gigawatt (GW)", id: "gwatt", fn: SIPrefix("W", 3) },
      { name: "Milliwatt (mW)", id: "mwatt", fn: SIPrefix("W", -1) },
      { name: "Watt per square meter (W/m\xB2)", id: "Wm2", fn: toFixedUnit("W/m\xB2") },
      { name: "Volt-Ampere (VA)", id: "voltamp", fn: SIPrefix("VA") },
      { name: "Kilovolt-Ampere (kVA)", id: "kvoltamp", fn: SIPrefix("VA", 1) },
      { name: "Volt-Ampere reactive (VAr)", id: "voltampreact", fn: SIPrefix("VAr") },
      { name: "Kilovolt-Ampere reactive (kVAr)", id: "kvoltampreact", fn: SIPrefix("VAr", 1) },
      { name: "Watt-hour (Wh)", id: "watth", fn: SIPrefix("Wh") },
      { name: "Watt-hour per Kilogram (Wh/kg)", id: "watthperkg", fn: SIPrefix("Wh/kg") },
      { name: "Kilowatt-hour (kWh)", id: "kwatth", fn: SIPrefix("Wh", 1) },
      { name: "Kilowatt-min (kWm)", id: "kwattm", fn: SIPrefix("W-Min", 1) },
      { name: "Megawatt-hour (MWh)", id: "mwatth", fn: SIPrefix("Wh", 2) },
      { name: "Ampere-hour (Ah)", id: "amph", fn: SIPrefix("Ah") },
      { name: "Kiloampere-hour (kAh)", id: "kamph", fn: SIPrefix("Ah", 1) },
      { name: "Milliampere-hour (mAh)", id: "mamph", fn: SIPrefix("Ah", -1) },
      { name: "Joule (J)", id: "joule", fn: SIPrefix("J") },
      { name: "Electron volt (eV)", id: "ev", fn: SIPrefix("eV") },
      { name: "Ampere (A)", id: "amp", fn: SIPrefix("A") },
      { name: "Kiloampere (kA)", id: "kamp", fn: SIPrefix("A", 1) },
      { name: "Milliampere (mA)", id: "mamp", fn: SIPrefix("A", -1) },
      { name: "Volt (V)", id: "volt", fn: SIPrefix("V") },
      { name: "Kilovolt (kV)", id: "kvolt", fn: SIPrefix("V", 1) },
      { name: "Millivolt (mV)", id: "mvolt", fn: SIPrefix("V", -1) },
      { name: "Decibel-milliwatt (dBm)", id: "dBm", fn: SIPrefix("dBm") },
      { name: "Milliohm (m\u03A9)", id: "mohm", fn: SIPrefix("\u03A9", -1) },
      { name: "Ohm (\u03A9)", id: "ohm", fn: SIPrefix("\u03A9") },
      { name: "Kiloohm (k\u03A9)", id: "kohm", fn: SIPrefix("\u03A9", 1) },
      { name: "Megaohm (M\u03A9)", id: "Mohm", fn: SIPrefix("\u03A9", 2) },
      { name: "Farad (F)", id: "farad", fn: SIPrefix("F") },
      { name: "Microfarad (\xB5F)", id: "\xB5farad", fn: SIPrefix("F", -2) },
      { name: "Nanofarad (nF)", id: "nfarad", fn: SIPrefix("F", -3) },
      { name: "Picofarad (pF)", id: "pfarad", fn: SIPrefix("F", -4) },
      { name: "Femtofarad (fF)", id: "ffarad", fn: SIPrefix("F", -5) },
      { name: "Henry (H)", id: "henry", fn: SIPrefix("H") },
      { name: "Millihenry (mH)", id: "mhenry", fn: SIPrefix("H", -1) },
      { name: "Microhenry (\xB5H)", id: "\xB5henry", fn: SIPrefix("H", -2) },
      { name: "Lumens (Lm)", id: "lumens", fn: SIPrefix("Lm") }
    ]
  },
  {
    name: "Flow",
    formats: [
      { name: "Gallons/min (gpm)", id: "flowgpm", fn: toFixedUnit("gpm") },
      { name: "Cubic meters/sec (cms)", id: "flowcms", fn: toFixedUnit("cms") },
      { name: "Cubic feet/sec (cfs)", id: "flowcfs", fn: toFixedUnit("cfs") },
      { name: "Cubic feet/min (cfm)", id: "flowcfm", fn: toFixedUnit("cfm") },
      { name: "Litre/hour", id: "litreh", fn: toFixedUnit("L/h") },
      { name: "Litre/min (L/min)", id: "flowlpm", fn: toFixedUnit("L/min") },
      { name: "milliLitre/min (mL/min)", id: "flowmlpm", fn: toFixedUnit("mL/min") },
      { name: "Lux (lx)", id: "lux", fn: toFixedUnit("lux") }
    ]
  },
  {
    name: "Force",
    formats: [
      { name: "Newton-meters (Nm)", id: "forceNm", fn: SIPrefix("Nm") },
      { name: "Kilonewton-meters (kNm)", id: "forcekNm", fn: SIPrefix("Nm", 1) },
      { name: "Newtons (N)", id: "forceN", fn: SIPrefix("N") },
      { name: "Kilonewtons (kN)", id: "forcekN", fn: SIPrefix("N", 1) }
    ]
  },
  {
    name: "Hash rate",
    formats: [
      { name: "hashes/sec", id: "Hs", fn: SIPrefix("H/s") },
      { name: "kilohashes/sec", id: "KHs", fn: SIPrefix("H/s", 1) },
      { name: "megahashes/sec", id: "MHs", fn: SIPrefix("H/s", 2) },
      { name: "gigahashes/sec", id: "GHs", fn: SIPrefix("H/s", 3) },
      { name: "terahashes/sec", id: "THs", fn: SIPrefix("H/s", 4) },
      { name: "petahashes/sec", id: "PHs", fn: SIPrefix("H/s", 5) },
      { name: "exahashes/sec", id: "EHs", fn: SIPrefix("H/s", 6) }
    ]
  },
  {
    name: "Mass",
    formats: [
      { name: "milligram (mg)", id: "massmg", fn: SIPrefix("g", -1) },
      { name: "gram (g)", id: "massg", fn: SIPrefix("g") },
      { name: "pound (lb)", id: "masslb", fn: toFixedUnit("lb") },
      { name: "kilogram (kg)", id: "masskg", fn: SIPrefix("g", 1) },
      { name: "metric ton (t)", id: "masst", fn: toFixedUnit("t") }
    ]
  },
  {
    name: "Length",
    formats: [
      { name: "millimeter (mm)", id: "lengthmm", fn: SIPrefix("m", -1) },
      { name: "inch (in)", id: "lengthin", fn: toFixedUnit("in") },
      { name: "feet (ft)", id: "lengthft", fn: toFixedUnit("ft") },
      { name: "meter (m)", id: "lengthm", fn: SIPrefix("m") },
      { name: "kilometer (km)", id: "lengthkm", fn: SIPrefix("m", 1) },
      { name: "mile (mi)", id: "lengthmi", fn: toFixedUnit("mi") }
    ]
  },
  {
    name: "Pressure",
    formats: [
      { name: "Millibars", id: "pressurembar", fn: SIPrefix("bar", -1) },
      { name: "Bars", id: "pressurebar", fn: SIPrefix("bar") },
      { name: "Kilobars", id: "pressurekbar", fn: SIPrefix("bar", 1) },
      { name: "Pascals", id: "pressurepa", fn: SIPrefix("Pa") },
      { name: "Hectopascals", id: "pressurehpa", fn: toFixedUnit("hPa") },
      { name: "Kilopascals", id: "pressurekpa", fn: toFixedUnit("kPa") },
      { name: "Inches of mercury", id: "pressurehg", fn: toFixedUnit('"Hg') },
      { name: "PSI", id: "pressurepsi", fn: scaledUnits(1e3, ["psi", "ksi", "Mpsi"]) }
    ]
  },
  {
    name: "Radiation",
    formats: [
      { name: "Becquerel (Bq)", id: "radbq", fn: SIPrefix("Bq") },
      { name: "curie (Ci)", id: "radci", fn: SIPrefix("Ci") },
      { name: "Gray (Gy)", id: "radgy", fn: SIPrefix("Gy") },
      { name: "rad", id: "radrad", fn: SIPrefix("rad") },
      { name: "Sievert (Sv)", id: "radsv", fn: SIPrefix("Sv") },
      { name: "milliSievert (mSv)", id: "radmsv", fn: SIPrefix("Sv", -1) },
      { name: "microSievert (\xB5Sv)", id: "radusv", fn: SIPrefix("Sv", -2) },
      { name: "rem", id: "radrem", fn: SIPrefix("rem") },
      { name: "Exposure (C/kg)", id: "radexpckg", fn: SIPrefix("C/kg") },
      { name: "roentgen (R)", id: "radr", fn: SIPrefix("R") },
      { name: "Sievert/hour (Sv/h)", id: "radsvh", fn: SIPrefix("Sv/h") },
      { name: "milliSievert/hour (mSv/h)", id: "radmsvh", fn: SIPrefix("Sv/h", -1) },
      { name: "microSievert/hour (\xB5Sv/h)", id: "radusvh", fn: SIPrefix("Sv/h", -2) }
    ]
  },
  {
    name: "Rotational Speed",
    formats: [
      { name: "Revolutions per minute (rpm)", id: "rotrpm", fn: toFixedUnit("rpm") },
      { name: "Hertz (Hz)", id: "rothz", fn: SIPrefix("Hz") },
      { name: "Kilohertz (kHz)", id: "rotkhz", fn: SIPrefix("Hz", 1) },
      { name: "Megahertz (MHz)", id: "rotmhz", fn: SIPrefix("Hz", 2) },
      { name: "Gigahertz (GHz)", id: "rotghz", fn: SIPrefix("Hz", 3) },
      { name: "Radians per second (rad/s)", id: "rotrads", fn: toFixedUnit("rad/s") },
      { name: "Degrees per second (\xB0/s)", id: "rotdegs", fn: toFixedUnit("\xB0/s") }
    ]
  },
  {
    name: "Temperature",
    formats: [
      { name: "Celsius (\xB0C)", id: "celsius", fn: toFixedUnit("\xB0C") },
      { name: "Fahrenheit (\xB0F)", id: "fahrenheit", fn: toFixedUnit("\xB0F") },
      { name: "Kelvin (K)", id: "kelvin", fn: toFixedUnit("K") }
    ]
  },
  {
    name: "Time",
    formats: [
      { name: "Hertz (1/s)", id: "hertz", fn: SIPrefix("Hz") },
      { name: "nanoseconds (ns)", id: "ns", fn: toNanoSeconds },
      { name: "microseconds (\xB5s)", id: "\xB5s", fn: toMicroSeconds },
      { name: "milliseconds (ms)", id: "ms", fn: toMilliSeconds },
      { name: "seconds (s)", id: "s", fn: toSeconds },
      { name: "minutes (m)", id: "m", fn: toMinutes },
      { name: "hours (h)", id: "h", fn: toHours },
      { name: "days (d)", id: "d", fn: toDays },
      { name: "duration (ms)", id: "dtdurationms", fn: toDurationInMilliseconds },
      { name: "duration (s)", id: "dtdurations", fn: toDurationInSeconds },
      { name: "duration (hh:mm:ss)", id: "dthms", fn: toDurationInHoursMinutesSeconds },
      { name: "duration (d hh:mm:ss)", id: "dtdhms", fn: toDurationInDaysHoursMinutesSeconds },
      { name: "Timeticks (s/100)", id: "timeticks", fn: toTimeTicks },
      { name: "clock (ms)", id: "clockms", fn: toClockMilliseconds },
      { name: "clock (s)", id: "clocks", fn: toClockSeconds }
    ]
  },
  {
    name: "Throughput",
    formats: [
      { name: "counts/sec (cps)", id: "cps", fn: simpleCountUnit("c/s") },
      { name: "ops/sec (ops)", id: "ops", fn: simpleCountUnit("ops/s") },
      { name: "requests/sec (rps)", id: "reqps", fn: simpleCountUnit("req/s") },
      { name: "reads/sec (rps)", id: "rps", fn: simpleCountUnit("rd/s") },
      { name: "writes/sec (wps)", id: "wps", fn: simpleCountUnit("wr/s") },
      { name: "I/O ops/sec (iops)", id: "iops", fn: simpleCountUnit("io/s") },
      { name: "events/sec (eps)", id: "eps", fn: simpleCountUnit("evt/s") },
      { name: "messages/sec (mps)", id: "mps", fn: simpleCountUnit("msg/s") },
      { name: "records/sec (rps)", id: "recps", fn: simpleCountUnit("rec/s") },
      { name: "rows/sec (rps)", id: "rowsps", fn: simpleCountUnit("rows/s") },
      { name: "counts/min (cpm)", id: "cpm", fn: simpleCountUnit("c/m") },
      { name: "ops/min (opm)", id: "opm", fn: simpleCountUnit("ops/m") },
      { name: "requests/min (rpm)", id: "reqpm", fn: simpleCountUnit("req/m") },
      { name: "reads/min (rpm)", id: "rpm", fn: simpleCountUnit("rd/m") },
      { name: "writes/min (wpm)", id: "wpm", fn: simpleCountUnit("wr/m") },
      { name: "events/min (epm)", id: "epm", fn: simpleCountUnit("evts/m") },
      { name: "messages/min (mpm)", id: "mpm", fn: simpleCountUnit("msgs/m") },
      { name: "records/min (rpm)", id: "recpm", fn: simpleCountUnit("rec/m") },
      { name: "rows/min (rpm)", id: "rowspm", fn: simpleCountUnit("rows/m") }
    ]
  },
  {
    name: "Velocity",
    formats: [
      { name: "meters/second (m/s)", id: "velocityms", fn: toFixedUnit("m/s") },
      { name: "kilometers/hour (km/h)", id: "velocitykmh", fn: toFixedUnit("km/h") },
      { name: "miles/hour (mph)", id: "velocitymph", fn: toFixedUnit("mph") },
      { name: "knot (kn)", id: "velocityknot", fn: toFixedUnit("kn") }
    ]
  },
  {
    name: "Volume",
    formats: [
      { name: "millilitre (mL)", id: "mlitre", fn: SIPrefix("L", -1) },
      { name: "litre (L)", id: "litre", fn: SIPrefix("L") },
      { name: "cubic meter", id: "m3", fn: toFixedUnit("m\xB3") },
      { name: "Normal cubic meter", id: "Nm3", fn: toFixedUnit("Nm\xB3") },
      { name: "cubic decimeter", id: "dm3", fn: toFixedUnit("dm\xB3") },
      { name: "gallons", id: "gallons", fn: toFixedUnit("gal") }
    ]
  },
  {
    name: "Boolean",
    formats: [
      { name: "True / False", id: "bool", fn: booleanValueFormatter("True", "False") },
      { name: "Yes / No", id: "bool_yes_no", fn: booleanValueFormatter("Yes", "No") },
      { name: "On / Off", id: "bool_on_off", fn: booleanValueFormatter("On", "Off") }
    ]
  }
];

export { getCategories };
//# sourceMappingURL=categories.js.map
