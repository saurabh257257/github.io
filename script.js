const categoryFilters = document.querySelector("#categoryFilters");
const catalogGrid = document.querySelector("#catalogGrid");
const generateCatalogPdf = document.querySelector("#generateCatalogPdf");
const sampleList = document.querySelector("#sampleList");
const orderList = document.querySelector("#orderList");
const mobileSampleList = document.querySelector("#mobileSampleList");
const mobileOrderList = document.querySelector("#mobileOrderList");
const sampleForm = document.querySelector("#sampleForm");
const orderForm = document.querySelector("#orderForm");
const mobileSampleForm = document.querySelector("#mobileSampleForm");
const mobileOrderForm = document.querySelector("#mobileOrderForm");
const mobileFab = document.querySelector("#mobileFab");
const mobileSheet = document.querySelector("#mobileSheet");
const mobileSheetClose = document.querySelector("#mobileSheetClose");

const CART_KEY = "sampleCart";
const ORDER_KEY = "orderCart";

const COUNTRY_CODES = [
    {
        "name":  "Afghanistan",
        "dial_code":  "+93",
        "code":  "AF"
    },
    {
        "name":  "Aland Islands",
        "dial_code":  "+358",
        "code":  "AX"
    },
    {
        "name":  "Albania",
        "dial_code":  "+355",
        "code":  "AL"
    },
    {
        "name":  "Algeria",
        "dial_code":  "+213",
        "code":  "DZ"
    },
    {
        "name":  "AmericanSamoa",
        "dial_code":  "+1684",
        "code":  "AS"
    },
    {
        "name":  "Andorra",
        "dial_code":  "+376",
        "code":  "AD"
    },
    {
        "name":  "Angola",
        "dial_code":  "+244",
        "code":  "AO"
    },
    {
        "name":  "Anguilla",
        "dial_code":  "+1264",
        "code":  "AI"
    },
    {
        "name":  "Antarctica",
        "dial_code":  "+672",
        "code":  "AQ"
    },
    {
        "name":  "Antigua and Barbuda",
        "dial_code":  "+1268",
        "code":  "AG"
    },
    {
        "name":  "Argentina",
        "dial_code":  "+54",
        "code":  "AR"
    },
    {
        "name":  "Armenia",
        "dial_code":  "+374",
        "code":  "AM"
    },
    {
        "name":  "Aruba",
        "dial_code":  "+297",
        "code":  "AW"
    },
    {
        "name":  "Australia",
        "dial_code":  "+61",
        "code":  "AU"
    },
    {
        "name":  "Austria",
        "dial_code":  "+43",
        "code":  "AT"
    },
    {
        "name":  "Azerbaijan",
        "dial_code":  "+994",
        "code":  "AZ"
    },
    {
        "name":  "Bahamas",
        "dial_code":  "+1242",
        "code":  "BS"
    },
    {
        "name":  "Bahrain",
        "dial_code":  "+973",
        "code":  "BH"
    },
    {
        "name":  "Bangladesh",
        "dial_code":  "+880",
        "code":  "BD"
    },
    {
        "name":  "Barbados",
        "dial_code":  "+1246",
        "code":  "BB"
    },
    {
        "name":  "Belarus",
        "dial_code":  "+375",
        "code":  "BY"
    },
    {
        "name":  "Belgium",
        "dial_code":  "+32",
        "code":  "BE"
    },
    {
        "name":  "Belize",
        "dial_code":  "+501",
        "code":  "BZ"
    },
    {
        "name":  "Benin",
        "dial_code":  "+229",
        "code":  "BJ"
    },
    {
        "name":  "Bermuda",
        "dial_code":  "+1441",
        "code":  "BM"
    },
    {
        "name":  "Bhutan",
        "dial_code":  "+975",
        "code":  "BT"
    },
    {
        "name":  "Bolivia, Plurinational State of",
        "dial_code":  "+591",
        "code":  "BO"
    },
    {
        "name":  "Bosnia and Herzegovina",
        "dial_code":  "+387",
        "code":  "BA"
    },
    {
        "name":  "Botswana",
        "dial_code":  "+267",
        "code":  "BW"
    },
    {
        "name":  "Brazil",
        "dial_code":  "+55",
        "code":  "BR"
    },
    {
        "name":  "British Indian Ocean Territory",
        "dial_code":  "+246",
        "code":  "IO"
    },
    {
        "name":  "Brunei Darussalam",
        "dial_code":  "+673",
        "code":  "BN"
    },
    {
        "name":  "Bulgaria",
        "dial_code":  "+359",
        "code":  "BG"
    },
    {
        "name":  "Burkina Faso",
        "dial_code":  "+226",
        "code":  "BF"
    },
    {
        "name":  "Burundi",
        "dial_code":  "+257",
        "code":  "BI"
    },
    {
        "name":  "Cambodia",
        "dial_code":  "+855",
        "code":  "KH"
    },
    {
        "name":  "Cameroon",
        "dial_code":  "+237",
        "code":  "CM"
    },
    {
        "name":  "Canada",
        "dial_code":  "+1",
        "code":  "CA"
    },
    {
        "name":  "Cape Verde",
        "dial_code":  "+238",
        "code":  "CV"
    },
    {
        "name":  "Cayman Islands",
        "dial_code":  "+345",
        "code":  "KY"
    },
    {
        "name":  "Central African Republic",
        "dial_code":  "+236",
        "code":  "CF"
    },
    {
        "name":  "Chad",
        "dial_code":  "+235",
        "code":  "TD"
    },
    {
        "name":  "Chile",
        "dial_code":  "+56",
        "code":  "CL"
    },
    {
        "name":  "China",
        "dial_code":  "+86",
        "code":  "CN"
    },
    {
        "name":  "Christmas Island",
        "dial_code":  "+61",
        "code":  "CX"
    },
    {
        "name":  "Cocos (Keeling) Islands",
        "dial_code":  "+61",
        "code":  "CC"
    },
    {
        "name":  "Colombia",
        "dial_code":  "+57",
        "code":  "CO"
    },
    {
        "name":  "Comoros",
        "dial_code":  "+269",
        "code":  "KM"
    },
    {
        "name":  "Congo",
        "dial_code":  "+242",
        "code":  "CG"
    },
    {
        "name":  "Congo, The Democratic Republic of the Congo",
        "dial_code":  "+243",
        "code":  "CD"
    },
    {
        "name":  "Cook Islands",
        "dial_code":  "+682",
        "code":  "CK"
    },
    {
        "name":  "Costa Rica",
        "dial_code":  "+506",
        "code":  "CR"
    },
    {
        "name":  "Cote d\u0027Ivoire",
        "dial_code":  "+225",
        "code":  "CI"
    },
    {
        "name":  "Croatia",
        "dial_code":  "+385",
        "code":  "HR"
    },
    {
        "name":  "Cuba",
        "dial_code":  "+53",
        "code":  "CU"
    },
    {
        "name":  "Cyprus",
        "dial_code":  "+357",
        "code":  "CY"
    },
    {
        "name":  "Czech Republic",
        "dial_code":  "+420",
        "code":  "CZ"
    },
    {
        "name":  "Denmark",
        "dial_code":  "+45",
        "code":  "DK"
    },
    {
        "name":  "Djibouti",
        "dial_code":  "+253",
        "code":  "DJ"
    },
    {
        "name":  "Dominica",
        "dial_code":  "+1767",
        "code":  "DM"
    },
    {
        "name":  "Dominican Republic",
        "dial_code":  "+1849",
        "code":  "DO"
    },
    {
        "name":  "Ecuador",
        "dial_code":  "+593",
        "code":  "EC"
    },
    {
        "name":  "Egypt",
        "dial_code":  "+20",
        "code":  "EG"
    },
    {
        "name":  "El Salvador",
        "dial_code":  "+503",
        "code":  "SV"
    },
    {
        "name":  "Equatorial Guinea",
        "dial_code":  "+240",
        "code":  "GQ"
    },
    {
        "name":  "Eritrea",
        "dial_code":  "+291",
        "code":  "ER"
    },
    {
        "name":  "Estonia",
        "dial_code":  "+372",
        "code":  "EE"
    },
    {
        "name":  "Ethiopia",
        "dial_code":  "+251",
        "code":  "ET"
    },
    {
        "name":  "Falkland Islands (Malvinas)",
        "dial_code":  "+500",
        "code":  "FK"
    },
    {
        "name":  "Faroe Islands",
        "dial_code":  "+298",
        "code":  "FO"
    },
    {
        "name":  "Fiji",
        "dial_code":  "+679",
        "code":  "FJ"
    },
    {
        "name":  "Finland",
        "dial_code":  "+358",
        "code":  "FI"
    },
    {
        "name":  "France",
        "dial_code":  "+33",
        "code":  "FR"
    },
    {
        "name":  "French Guiana",
        "dial_code":  "+594",
        "code":  "GF"
    },
    {
        "name":  "French Polynesia",
        "dial_code":  "+689",
        "code":  "PF"
    },
    {
        "name":  "Gabon",
        "dial_code":  "+241",
        "code":  "GA"
    },
    {
        "name":  "Gambia",
        "dial_code":  "+220",
        "code":  "GM"
    },
    {
        "name":  "Georgia",
        "dial_code":  "+995",
        "code":  "GE"
    },
    {
        "name":  "Germany",
        "dial_code":  "+49",
        "code":  "DE"
    },
    {
        "name":  "Ghana",
        "dial_code":  "+233",
        "code":  "GH"
    },
    {
        "name":  "Gibraltar",
        "dial_code":  "+350",
        "code":  "GI"
    },
    {
        "name":  "Greece",
        "dial_code":  "+30",
        "code":  "GR"
    },
    {
        "name":  "Greenland",
        "dial_code":  "+299",
        "code":  "GL"
    },
    {
        "name":  "Grenada",
        "dial_code":  "+1473",
        "code":  "GD"
    },
    {
        "name":  "Guadeloupe",
        "dial_code":  "+590",
        "code":  "GP"
    },
    {
        "name":  "Guam",
        "dial_code":  "+1671",
        "code":  "GU"
    },
    {
        "name":  "Guatemala",
        "dial_code":  "+502",
        "code":  "GT"
    },
    {
        "name":  "Guernsey",
        "dial_code":  "+44",
        "code":  "GG"
    },
    {
        "name":  "Guinea",
        "dial_code":  "+224",
        "code":  "GN"
    },
    {
        "name":  "Guinea-Bissau",
        "dial_code":  "+245",
        "code":  "GW"
    },
    {
        "name":  "Guyana",
        "dial_code":  "+595",
        "code":  "GY"
    },
    {
        "name":  "Haiti",
        "dial_code":  "+509",
        "code":  "HT"
    },
    {
        "name":  "Holy See (Vatican City State)",
        "dial_code":  "+379",
        "code":  "VA"
    },
    {
        "name":  "Honduras",
        "dial_code":  "+504",
        "code":  "HN"
    },
    {
        "name":  "Hong Kong",
        "dial_code":  "+852",
        "code":  "HK"
    },
    {
        "name":  "Hungary",
        "dial_code":  "+36",
        "code":  "HU"
    },
    {
        "name":  "Iceland",
        "dial_code":  "+354",
        "code":  "IS"
    },
    {
        "name":  "India",
        "dial_code":  "+91",
        "code":  "IN"
    },
    {
        "name":  "Indonesia",
        "dial_code":  "+62",
        "code":  "ID"
    },
    {
        "name":  "Iran, Islamic Republic of Persian Gulf",
        "dial_code":  "+98",
        "code":  "IR"
    },
    {
        "name":  "Iraq",
        "dial_code":  "+964",
        "code":  "IQ"
    },
    {
        "name":  "Ireland",
        "dial_code":  "+353",
        "code":  "IE"
    },
    {
        "name":  "Isle of Man",
        "dial_code":  "+44",
        "code":  "IM"
    },
    {
        "name":  "Israel",
        "dial_code":  "+972",
        "code":  "IL"
    },
    {
        "name":  "Italy",
        "dial_code":  "+39",
        "code":  "IT"
    },
    {
        "name":  "Jamaica",
        "dial_code":  "+1876",
        "code":  "JM"
    },
    {
        "name":  "Japan",
        "dial_code":  "+81",
        "code":  "JP"
    },
    {
        "name":  "Jersey",
        "dial_code":  "+44",
        "code":  "JE"
    },
    {
        "name":  "Jordan",
        "dial_code":  "+962",
        "code":  "JO"
    },
    {
        "name":  "Kazakhstan",
        "dial_code":  "+77",
        "code":  "KZ"
    },
    {
        "name":  "Kenya",
        "dial_code":  "+254",
        "code":  "KE"
    },
    {
        "name":  "Kiribati",
        "dial_code":  "+686",
        "code":  "KI"
    },
    {
        "name":  "Korea, Democratic People\u0027s Republic of Korea",
        "dial_code":  "+850",
        "code":  "KP"
    },
    {
        "name":  "Korea, Republic of South Korea",
        "dial_code":  "+82",
        "code":  "KR"
    },
    {
        "name":  "Kuwait",
        "dial_code":  "+965",
        "code":  "KW"
    },
    {
        "name":  "Kyrgyzstan",
        "dial_code":  "+996",
        "code":  "KG"
    },
    {
        "name":  "Laos",
        "dial_code":  "+856",
        "code":  "LA"
    },
    {
        "name":  "Latvia",
        "dial_code":  "+371",
        "code":  "LV"
    },
    {
        "name":  "Lebanon",
        "dial_code":  "+961",
        "code":  "LB"
    },
    {
        "name":  "Lesotho",
        "dial_code":  "+266",
        "code":  "LS"
    },
    {
        "name":  "Liberia",
        "dial_code":  "+231",
        "code":  "LR"
    },
    {
        "name":  "Libyan Arab Jamahiriya",
        "dial_code":  "+218",
        "code":  "LY"
    },
    {
        "name":  "Liechtenstein",
        "dial_code":  "+423",
        "code":  "LI"
    },
    {
        "name":  "Lithuania",
        "dial_code":  "+370",
        "code":  "LT"
    },
    {
        "name":  "Luxembourg",
        "dial_code":  "+352",
        "code":  "LU"
    },
    {
        "name":  "Macao",
        "dial_code":  "+853",
        "code":  "MO"
    },
    {
        "name":  "Macedonia",
        "dial_code":  "+389",
        "code":  "MK"
    },
    {
        "name":  "Madagascar",
        "dial_code":  "+261",
        "code":  "MG"
    },
    {
        "name":  "Malawi",
        "dial_code":  "+265",
        "code":  "MW"
    },
    {
        "name":  "Malaysia",
        "dial_code":  "+60",
        "code":  "MY"
    },
    {
        "name":  "Maldives",
        "dial_code":  "+960",
        "code":  "MV"
    },
    {
        "name":  "Mali",
        "dial_code":  "+223",
        "code":  "ML"
    },
    {
        "name":  "Malta",
        "dial_code":  "+356",
        "code":  "MT"
    },
    {
        "name":  "Marshall Islands",
        "dial_code":  "+692",
        "code":  "MH"
    },
    {
        "name":  "Martinique",
        "dial_code":  "+596",
        "code":  "MQ"
    },
    {
        "name":  "Mauritania",
        "dial_code":  "+222",
        "code":  "MR"
    },
    {
        "name":  "Mauritius",
        "dial_code":  "+230",
        "code":  "MU"
    },
    {
        "name":  "Mayotte",
        "dial_code":  "+262",
        "code":  "YT"
    },
    {
        "name":  "Mexico",
        "dial_code":  "+52",
        "code":  "MX"
    },
    {
        "name":  "Micronesia, Federated States of Micronesia",
        "dial_code":  "+691",
        "code":  "FM"
    },
    {
        "name":  "Moldova",
        "dial_code":  "+373",
        "code":  "MD"
    },
    {
        "name":  "Monaco",
        "dial_code":  "+377",
        "code":  "MC"
    },
    {
        "name":  "Mongolia",
        "dial_code":  "+976",
        "code":  "MN"
    },
    {
        "name":  "Montenegro",
        "dial_code":  "+382",
        "code":  "ME"
    },
    {
        "name":  "Montserrat",
        "dial_code":  "+1664",
        "code":  "MS"
    },
    {
        "name":  "Morocco",
        "dial_code":  "+212",
        "code":  "MA"
    },
    {
        "name":  "Mozambique",
        "dial_code":  "+258",
        "code":  "MZ"
    },
    {
        "name":  "Myanmar",
        "dial_code":  "+95",
        "code":  "MM"
    },
    {
        "name":  "Namibia",
        "dial_code":  "+264",
        "code":  "NA"
    },
    {
        "name":  "Nauru",
        "dial_code":  "+674",
        "code":  "NR"
    },
    {
        "name":  "Nepal",
        "dial_code":  "+977",
        "code":  "NP"
    },
    {
        "name":  "Netherlands",
        "dial_code":  "+31",
        "code":  "NL"
    },
    {
        "name":  "Netherlands Antilles",
        "dial_code":  "+599",
        "code":  "AN"
    },
    {
        "name":  "New Caledonia",
        "dial_code":  "+687",
        "code":  "NC"
    },
    {
        "name":  "New Zealand",
        "dial_code":  "+64",
        "code":  "NZ"
    },
    {
        "name":  "Nicaragua",
        "dial_code":  "+505",
        "code":  "NI"
    },
    {
        "name":  "Niger",
        "dial_code":  "+227",
        "code":  "NE"
    },
    {
        "name":  "Nigeria",
        "dial_code":  "+234",
        "code":  "NG"
    },
    {
        "name":  "Niue",
        "dial_code":  "+683",
        "code":  "NU"
    },
    {
        "name":  "Norfolk Island",
        "dial_code":  "+672",
        "code":  "NF"
    },
    {
        "name":  "Northern Mariana Islands",
        "dial_code":  "+1670",
        "code":  "MP"
    },
    {
        "name":  "Norway",
        "dial_code":  "+47",
        "code":  "NO"
    },
    {
        "name":  "Oman",
        "dial_code":  "+968",
        "code":  "OM"
    },
    {
        "name":  "Pakistan",
        "dial_code":  "+92",
        "code":  "PK"
    },
    {
        "name":  "Palau",
        "dial_code":  "+680",
        "code":  "PW"
    },
    {
        "name":  "Palestinian Territory, Occupied",
        "dial_code":  "+970",
        "code":  "PS"
    },
    {
        "name":  "Panama",
        "dial_code":  "+507",
        "code":  "PA"
    },
    {
        "name":  "Papua New Guinea",
        "dial_code":  "+675",
        "code":  "PG"
    },
    {
        "name":  "Paraguay",
        "dial_code":  "+595",
        "code":  "PY"
    },
    {
        "name":  "Peru",
        "dial_code":  "+51",
        "code":  "PE"
    },
    {
        "name":  "Philippines",
        "dial_code":  "+63",
        "code":  "PH"
    },
    {
        "name":  "Pitcairn",
        "dial_code":  "+872",
        "code":  "PN"
    },
    {
        "name":  "Poland",
        "dial_code":  "+48",
        "code":  "PL"
    },
    {
        "name":  "Portugal",
        "dial_code":  "+351",
        "code":  "PT"
    },
    {
        "name":  "Puerto Rico",
        "dial_code":  "+1939",
        "code":  "PR"
    },
    {
        "name":  "Qatar",
        "dial_code":  "+974",
        "code":  "QA"
    },
    {
        "name":  "Romania",
        "dial_code":  "+40",
        "code":  "RO"
    },
    {
        "name":  "Russia",
        "dial_code":  "+7",
        "code":  "RU"
    },
    {
        "name":  "Rwanda",
        "dial_code":  "+250",
        "code":  "RW"
    },
    {
        "name":  "Reunion",
        "dial_code":  "+262",
        "code":  "RE"
    },
    {
        "name":  "Saint Barthelemy",
        "dial_code":  "+590",
        "code":  "BL"
    },
    {
        "name":  "Saint Helena, Ascension and Tristan Da Cunha",
        "dial_code":  "+290",
        "code":  "SH"
    },
    {
        "name":  "Saint Kitts and Nevis",
        "dial_code":  "+1869",
        "code":  "KN"
    },
    {
        "name":  "Saint Lucia",
        "dial_code":  "+1758",
        "code":  "LC"
    },
    {
        "name":  "Saint Martin",
        "dial_code":  "+590",
        "code":  "MF"
    },
    {
        "name":  "Saint Pierre and Miquelon",
        "dial_code":  "+508",
        "code":  "PM"
    },
    {
        "name":  "Saint Vincent and the Grenadines",
        "dial_code":  "+1784",
        "code":  "VC"
    },
    {
        "name":  "Samoa",
        "dial_code":  "+685",
        "code":  "WS"
    },
    {
        "name":  "San Marino",
        "dial_code":  "+378",
        "code":  "SM"
    },
    {
        "name":  "Sao Tome and Principe",
        "dial_code":  "+239",
        "code":  "ST"
    },
    {
        "name":  "Saudi Arabia",
        "dial_code":  "+966",
        "code":  "SA"
    },
    {
        "name":  "Senegal",
        "dial_code":  "+221",
        "code":  "SN"
    },
    {
        "name":  "Serbia",
        "dial_code":  "+381",
        "code":  "RS"
    },
    {
        "name":  "Seychelles",
        "dial_code":  "+248",
        "code":  "SC"
    },
    {
        "name":  "Sierra Leone",
        "dial_code":  "+232",
        "code":  "SL"
    },
    {
        "name":  "Singapore",
        "dial_code":  "+65",
        "code":  "SG"
    },
    {
        "name":  "Slovakia",
        "dial_code":  "+421",
        "code":  "SK"
    },
    {
        "name":  "Slovenia",
        "dial_code":  "+386",
        "code":  "SI"
    },
    {
        "name":  "Solomon Islands",
        "dial_code":  "+677",
        "code":  "SB"
    },
    {
        "name":  "Somalia",
        "dial_code":  "+252",
        "code":  "SO"
    },
    {
        "name":  "South Africa",
        "dial_code":  "+27",
        "code":  "ZA"
    },
    {
        "name":  "South Sudan",
        "dial_code":  "+211",
        "code":  "SS"
    },
    {
        "name":  "South Georgia and the South Sandwich Islands",
        "dial_code":  "+500",
        "code":  "GS"
    },
    {
        "name":  "Spain",
        "dial_code":  "+34",
        "code":  "ES"
    },
    {
        "name":  "Sri Lanka",
        "dial_code":  "+94",
        "code":  "LK"
    },
    {
        "name":  "Sudan",
        "dial_code":  "+249",
        "code":  "SD"
    },
    {
        "name":  "Suriname",
        "dial_code":  "+597",
        "code":  "SR"
    },
    {
        "name":  "Svalbard and Jan Mayen",
        "dial_code":  "+47",
        "code":  "SJ"
    },
    {
        "name":  "Swaziland",
        "dial_code":  "+268",
        "code":  "SZ"
    },
    {
        "name":  "Sweden",
        "dial_code":  "+46",
        "code":  "SE"
    },
    {
        "name":  "Switzerland",
        "dial_code":  "+41",
        "code":  "CH"
    },
    {
        "name":  "Syrian Arab Republic",
        "dial_code":  "+963",
        "code":  "SY"
    },
    {
        "name":  "Taiwan",
        "dial_code":  "+886",
        "code":  "TW"
    },
    {
        "name":  "Tajikistan",
        "dial_code":  "+992",
        "code":  "TJ"
    },
    {
        "name":  "Tanzania, United Republic of Tanzania",
        "dial_code":  "+255",
        "code":  "TZ"
    },
    {
        "name":  "Thailand",
        "dial_code":  "+66",
        "code":  "TH"
    },
    {
        "name":  "Timor-Leste",
        "dial_code":  "+670",
        "code":  "TL"
    },
    {
        "name":  "Togo",
        "dial_code":  "+228",
        "code":  "TG"
    },
    {
        "name":  "Tokelau",
        "dial_code":  "+690",
        "code":  "TK"
    },
    {
        "name":  "Tonga",
        "dial_code":  "+676",
        "code":  "TO"
    },
    {
        "name":  "Trinidad and Tobago",
        "dial_code":  "+1868",
        "code":  "TT"
    },
    {
        "name":  "Tunisia",
        "dial_code":  "+216",
        "code":  "TN"
    },
    {
        "name":  "Turkey",
        "dial_code":  "+90",
        "code":  "TR"
    },
    {
        "name":  "Turkmenistan",
        "dial_code":  "+993",
        "code":  "TM"
    },
    {
        "name":  "Turks and Caicos Islands",
        "dial_code":  "+1649",
        "code":  "TC"
    },
    {
        "name":  "Tuvalu",
        "dial_code":  "+688",
        "code":  "TV"
    },
    {
        "name":  "Uganda",
        "dial_code":  "+256",
        "code":  "UG"
    },
    {
        "name":  "Ukraine",
        "dial_code":  "+380",
        "code":  "UA"
    },
    {
        "name":  "United Arab Emirates",
        "dial_code":  "+971",
        "code":  "AE"
    },
    {
        "name":  "United Kingdom",
        "dial_code":  "+44",
        "code":  "GB"
    },
    {
        "name":  "United States",
        "dial_code":  "+1",
        "code":  "US"
    },
    {
        "name":  "Uruguay",
        "dial_code":  "+598",
        "code":  "UY"
    },
    {
        "name":  "Uzbekistan",
        "dial_code":  "+998",
        "code":  "UZ"
    },
    {
        "name":  "Vanuatu",
        "dial_code":  "+678",
        "code":  "VU"
    },
    {
        "name":  "Venezuela, Bolivarian Republic of Venezuela",
        "dial_code":  "+58",
        "code":  "VE"
    },
    {
        "name":  "Vietnam",
        "dial_code":  "+84",
        "code":  "VN"
    },
    {
        "name":  "Virgin Islands, British",
        "dial_code":  "+1284",
        "code":  "VG"
    },
    {
        "name":  "Virgin Islands, U.S.",
        "dial_code":  "+1340",
        "code":  "VI"
    },
    {
        "name":  "Wallis and Futuna",
        "dial_code":  "+681",
        "code":  "WF"
    },
    {
        "name":  "Yemen",
        "dial_code":  "+967",
        "code":  "YE"
    },
    {
        "name":  "Zambia",
        "dial_code":  "+260",
        "code":  "ZM"
    },
    {
        "name":  "Zimbabwe",
        "dial_code":  "+263",
        "code":  "ZW"
    }
]
;



const placeholderImage = (label) => {
  const safe = encodeURIComponent(label || "Product");
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='%23f3e9da'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Space Grotesk, Arial' font-size='36' fill='%23908a80'>${safe}</text></svg>`;
};

const getCart = () => {
  const raw = sessionStorage.getItem(CART_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const setCart = (cart) => {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const getOrder = () => {
  const raw = sessionStorage.getItem(ORDER_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const setOrder = (order) => {
  sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
};

const renderSampleList = () => {
  const targets = [sampleList, mobileSampleList].filter(Boolean);
  const cart = getCart();
  const entries = Object.values(cart);
  targets.forEach((list) => {
    list.innerHTML = "";
    if (entries.length === 0) {
      list.innerHTML = "<p class='form-note'>No samples added yet. Click “Request Sample” on any product.</p>";
      return;
    }
    entries.forEach((item) => {
      const row = document.createElement("div");
      row.className = "panel-item";
      row.innerHTML = `
        <div class="panel-item-header">
          <div><strong>${item.name}</strong></div>
          <button class="remove-item" type="button" aria-label="Remove item">×</button>
        </div>
        <div>Qty: 1</div>
      `;
      row.querySelector(".remove-item").addEventListener("click", () => {
        removeFromCart(item.id);
      });
      list.appendChild(row);
    });
  });
};

const renderOrderList = () => {
  const targets = [orderList, mobileOrderList].filter(Boolean);
  const order = getOrder();
  const entries = Object.values(order);
  targets.forEach((list) => {
    list.innerHTML = "";
    if (entries.length === 0) {
      list.innerHTML = "<p class='form-note'>No items added yet. Click “Order” on any product.</p>";
      return;
    }
    entries.forEach((item) => {
      const row = document.createElement("div");
      row.className = "panel-item";
      row.innerHTML = `
        <div class="panel-item-header">
          <div><strong>${item.name}</strong></div>
          <button class="remove-item" type="button" aria-label="Remove item">×</button>
        </div>
        <div>Qty: ${item.kg} kg</div>
      `;
      row.querySelector(".remove-item").addEventListener("click", () => {
        removeFromOrder(item.id);
      });
      list.appendChild(row);
    });
  });
};

const addToCart = (product) => {
  const cart = getCart();
  if (!cart[product.id]) {
    cart[product.id] = { id: product.id, name: product.name };
    setCart(cart);
    renderSampleList();
  }
};

const removeFromCart = (productId) => {
  const cart = getCart();
  if (!cart[productId]) return;
  delete cart[productId];
  setCart(cart);
  renderSampleList();
};

const clearCart = () => {
  sessionStorage.removeItem(CART_KEY);
  renderSampleList();
};

const addToOrder = (product, qty) => {
  const order = getOrder();
  order[product.id] = { id: product.id, name: product.name, kg: qty };
  setOrder(order);
  renderOrderList();
};

const updateOrderQty = (productId, qty) => {
  const order = getOrder();
  if (!order[productId]) return;
  order[productId].kg = qty;
  setOrder(order);
  renderOrderList();
};

const removeFromOrder = (productId) => {
  const order = getOrder();
  if (!order[productId]) return;
  delete order[productId];
  setOrder(order);
  renderOrderList();
};

const clearOrder = () => {
  sessionStorage.removeItem(ORDER_KEY);
  renderOrderList();
};

const createCarousel = (images, label) => {
  const wrapper = document.createElement("div");
  wrapper.className = "carousel";

  const hint = document.createElement("div");
  hint.className = "zoom-hint";
  hint.textContent = "Hover to zoom";
  wrapper.appendChild(hint);

  const safeImages = (images && images.length ? images : [placeholderImage(label)]);

  safeImages.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = label;
    img.loading = "lazy";
    img.className = index === 0 ? "active" : "";
    img.onerror = () => {
      img.onerror = null;
      img.src = placeholderImage(label);
    };
    wrapper.appendChild(img);
  });

  if (safeImages.length > 1) {
    const controls = document.createElement("div");
    controls.className = "carousel-controls";

    const prev = document.createElement("button");
    prev.className = "carousel-btn";
    prev.type = "button";
    prev.textContent = "Prev";

    const next = document.createElement("button");
    next.className = "carousel-btn";
    next.type = "button";
    next.textContent = "Next";

    const dots = document.createElement("div");
    dots.className = "carousel-dots";

    const dotEls = safeImages.map((_, idx) => {
      const dot = document.createElement("span");
      dot.className = idx === 0 ? "carousel-dot active" : "carousel-dot";
      dots.appendChild(dot);
      return dot;
    });

    let activeIndex = 0;
    const updateActive = (newIndex) => {
      const imgs = wrapper.querySelectorAll("img");
      imgs[activeIndex].classList.remove("active");
      dotEls[activeIndex].classList.remove("active");
      activeIndex = newIndex;
      imgs[activeIndex].classList.add("active");
      dotEls[activeIndex].classList.add("active");
    };

    prev.addEventListener("click", () => {
      const nextIndex = (activeIndex - 1 + safeImages.length) % safeImages.length;
      updateActive(nextIndex);
    });

    next.addEventListener("click", () => {
      const nextIndex = (activeIndex + 1) % safeImages.length;
      updateActive(nextIndex);
    });

    controls.appendChild(prev);
    controls.appendChild(dots);
    controls.appendChild(next);
    wrapper.appendChild(controls);
  }

  return wrapper;
};

const createCard = (product, categoryName) => {
  const card = document.createElement("article");
  card.className = "catalog-card";
  card.dataset.category = categoryName;

  const badge = "";
  const specs = (product.specs || []).map((spec) => `<li>${spec}</li>`).join("");
  const priceLine = product.price ? `<span class="price">Price: ${product.price}</span>` : "";
  const minQty = Number(product.minQuantity) || 1;
  const moqLine = product.minQuantity ? `<span class="price">Min Qty: ${minQty} kg</span>` : "";

  card.innerHTML = `
    ${badge}
    <div class="catalog-body">
      <div class="details-bottom">
        <h3>${product.name}</h3>
        <p class="sku">${product.subtitle || ""}</p>
        <p>${product.summary || ""}</p>
        <div class="price-row">
          ${priceLine}
          ${moqLine}
        </div>
        <button class="details-toggle" type="button" data-details="${product.id}">
          <span>+</span>
          More details
        </button>
        <div class="details" data-details-panel="${product.id}">
          <ul>${specs}</ul>
        </div>
        <div class="card-actions">
          <button class="button sample-btn" type="button" data-sample="${product.id}">Request Sample</button>
          <div class="order-controls" data-qty="${minQty}">
            <button class="qty-btn" type="button" data-action="dec" aria-label="Decrease quantity">-</button>
            <span class="qty-value">${minQty} kg</span>
            <button class="qty-btn" type="button" data-action="inc" aria-label="Increase quantity">+</button>
          </div>
          <button class="button order-btn" type="button" data-order="${product.id}">Order</button>
        </div>
      </div>
    </div>
  `;

  const carousel = createCarousel(product.images || [], product.name);
  card.insertBefore(carousel, card.firstChild);

  const detailsToggle = card.querySelector(`[data-details="${product.id}"]`);
  const detailsPanel = card.querySelector(`[data-details-panel="${product.id}"]`);
  detailsToggle.addEventListener("click", () => {
    const isOpen = detailsPanel.classList.toggle("is-open");
    detailsToggle.querySelector("span").textContent = isOpen ? "-" : "+";
  });

  const qtyControl = card.querySelector(".order-controls");
  const qtyValue = card.querySelector(".qty-value");
  const updateQty = (delta) => {
    const current = Number(qtyControl.dataset.qty) || minQty;
    const next = Math.max(minQty, current + delta);
    qtyControl.dataset.qty = String(next);
    qtyValue.textContent = `${next} kg`;
    addToOrder(product, next);
  };
  qtyControl.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const delta = btn.dataset.action === "inc" ? 1 : -1;
      updateQty(delta);
    });
  });

  const sampleBtn = card.querySelector("[data-sample]");
  const orderBtn = card.querySelector("[data-order]");
  sampleBtn.addEventListener("click", () => {
    addToCart(product);
    setActivePanel(document.querySelector(".catalog-side"), "sample");
    setActivePanel(mobileSheet, "sample");
  });
  orderBtn.addEventListener("click", () => {
    const qty = Number(qtyControl.dataset.qty) || minQty;
    addToOrder(product, qty);
    setActivePanel(document.querySelector(".catalog-side"), "order");
    setActivePanel(mobileSheet, "order");
  });

  return card;
};

const renderFilters = (categories) => {
  categoryFilters.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "filter-btn active";
  allBtn.dataset.filter = "all";
  allBtn.textContent = "All";
  categoryFilters.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.filter = cat.name;
    btn.textContent = cat.name;
    categoryFilters.appendChild(btn);
  });

  const buttons = categoryFilters.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      filterCatalog(filter);
    });
  });
};

const filterCatalog = (filter) => {
  const cards = catalogGrid.querySelectorAll(".catalog-card");
  cards.forEach((card) => {
    if (filter === "all" || card.dataset.category === filter) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

const loadCatalogFromJson = async () => {
  const response = await fetch("products.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("products.json not found");
  }
  const data = await response.json();
  return (data.categories || []).map((cat) => ({
    name: cat.name,
    products: (cat.products || []).map((product) => ({
      ...product,
      price: product.price || "",
      minQuantity: product.minQuantity || ""
    }))
  }));
};

const renderCatalog = (categories) => {
  if (!catalogGrid) return;
  catalogGrid.innerHTML = "";
  categories.forEach((category) => {
    (category.products || []).forEach((product) => {
      catalogGrid.appendChild(createCard(product, category.name));
    });
  });
  if (categoryFilters) {
    renderFilters(categories);
  }
  window.catalogData = categories;
};

const buildPdfDom = (categories) => {
  let root = document.querySelector("#pdfRoot");
  if (root) root.remove();
  root = document.createElement("div");
  root.id = "pdfRoot";
  root.className = "pdf-root";

  const header = document.createElement("div");
  header.innerHTML = `
    <h1>Arambhika Enablers</h1>
    <div class="pdf-meta">Product Catalog · sales@arambhika-enablers.com</div>
  `;
  root.appendChild(header);

  const overview = document.createElement("div");
  overview.className = "pdf-category";
  overview.innerHTML = `
    <h2>About Arambhika Enablers</h2>
    <p>Arambhika Enablers supplies precision-rolled nickel strips, copper bus bars, and prismatic cells for battery packs, electronics, and energy storage systems. Consistent thickness, tight tolerances, and reliable fulfillment.</p>
  `;
  root.appendChild(overview);

  const capabilities = document.createElement("div");
  capabilities.className = "pdf-category";
  capabilities.innerHTML = `
    <h2>Capabilities</h2>
    <p>Precision rolling, clean surface finish, custom cut and form, and bulk logistics with flexible MOQ.</p>
  `;
  root.appendChild(capabilities);

  const quality = document.createElement("div");
  quality.className = "pdf-category";
  quality.innerHTML = `
    <h2>Quality & Standards</h2>
    <p>Each batch includes mill test certificates, mechanical properties, and visual inspection reports. ISO-aligned processes available.</p>
  `;
  root.appendChild(quality);

  const applications = document.createElement("div");
  applications.className = "pdf-category";
  applications.innerHTML = `
    <h2>Applications</h2>
    <p>EV and mobility, energy storage systems, consumer devices, and OEM assembly.</p>
  `;
  root.appendChild(applications);

  categories.forEach((category) => {
    const section = document.createElement("div");
    section.className = "pdf-category";
    section.innerHTML = `
      <h2>${category.name}</h2>
      <p>${category.description || ""}</p>
    `;
    root.appendChild(section);

    const grid = document.createElement("div");
    grid.className = "pdf-grid";
    (category.products || []).forEach((product) => {
      const card = document.createElement("div");
      card.className = "pdf-card";
      const specs = (product.specs || []).map((s) => `<li>${s}</li>`).join("");
      const images = (product.images || [])
        .slice(0, 3)
        .map((src) => `<img src="${src}" alt="${product.name}">`)
        .join("");
      card.innerHTML = `
        <h3>${product.name}</h3>
        <div class="sku">${product.subtitle || ""}</div>
        <div>${product.summary || ""}</div>
        <ul class="pdf-specs">${specs}</ul>
        <div class="pdf-images">${images}</div>
      `;
      grid.appendChild(card);
    });
    root.appendChild(grid);
  });

  const contact = document.createElement("div");
  contact.className = "pdf-category";
  contact.innerHTML = `
    <h2>Contact</h2>
    <p>Email: sales@arambhika-enablers.com</p>
    <p>Phone: +91-XXXXXXXXXX</p>
    <p>Location: Pune, India (global shipping)</p>
  `;
  root.appendChild(contact);

  document.body.appendChild(root);
  return root;
};

const generatePdf = async () => {
  if (!window.catalogData || window.catalogData.length === 0) {
    alert("Catalog data not loaded yet.");
    return;
  }

  generateCatalogPdf.disabled = true;
  generateCatalogPdf.textContent = "Generating...";

  const root = buildPdfDom(window.catalogData);
  const canvas = await html2canvas(root, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "pt", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("catalog.pdf");
  root.remove();

  generateCatalogPdf.disabled = false;
  generateCatalogPdf.textContent = "Generate PDF";
};

const loadCatalog = async () => {
  if (!catalogGrid) return;
  try {
    const categories = await loadCatalogFromJson();
    renderCatalog(categories);
  } catch (error) {
    catalogGrid.innerHTML = "<p>Unable to load catalog. Please check products.json.</p>";
  }
};

if (generateCatalogPdf) {
  generateCatalogPdf.addEventListener("click", generatePdf);
}

const aboutContactForm = document.querySelector("#aboutContactForm");
if (aboutContactForm) {
  aboutContactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(aboutContactForm);
    const countryCode = formData.get("countryCode") || "+91";
    const mobile = formData.get("mobile") || "";
    const description = formData.get("notes");
    const body = [
      "General Inquiry",
      "",
      "Selected products: None",
      "",
      `Mobile: ${countryCode} ${mobile}`.trim(),
      `Email: ${formData.get("email") || "N/A"}`
    ]
      .concat(description ? [`Description: ${description}`] : [])
      .join("\n");

    const whatsapp = `https://wa.me/918112662827?text=${encodeURIComponent(body)}`;
    window.open(whatsapp, "_blank");
    aboutContactForm.reset();
  });
}

document.querySelectorAll("[data-explore]").forEach((button) => {
  const key = button.dataset.explore;
  const panel = document.querySelector(`[data-explore-panel="${key}"]`);
  if (!panel) return;
  button.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("is-open");
    button.querySelector("span").textContent = isOpen ? "-" : "+";
  });
});

const initSolutionsCarousel = () => {
  const carousel = document.querySelector("#solutionsCarousel");
  const nextBtn = document.querySelector("#solutionsNext");
  if (!carousel || !nextBtn) return;
  const cards = Array.from(carousel.querySelectorAll(".solution-card"));
  if (cards.length === 0) return;
  let index = cards.findIndex((card) => card.classList.contains("is-active"));
  if (index < 0) index = 0;

  const showAt = (idx) => {
    cards.forEach((card, i) => {
      card.classList.toggle("is-active", i === idx);
    });
  };

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % cards.length;
    showAt(index);
  });
};

const codeToEmoji = (code) => {
  if (!code || code.length !== 2) return "";
  const base = 0x1f1e6;
  const chars = code.toUpperCase().split("");
  return String.fromCodePoint(base + (chars[0].charCodeAt(0) - 65), base + (chars[1].charCodeAt(0) - 65));
};

const populateCountrySelects = () => {
  const selects = document.querySelectorAll(".phone-row select");
  if (!selects.length) return;

  selects.forEach((select) => {
    select.innerHTML = "";
    const option = document.createElement("option");
    option.value = "+91";
    option.textContent = "🇮🇳 India (+91)";
    option.selected = true;
    select.appendChild(option);
  });
};

const applySiteConfig = (config) => {
  if (!config) return;
  const brand = config.brand || {};
  const nav = config.nav || {};
  const topBar = config.topBar || {};
  const solutions = config.solutions || {};
  const about = config.about || {};
  const contactCta = config.contactCta || {};
  const fab = config.fab || {};
  const capabilities = config.capabilities || {};

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  };

  setText("brandMark", brand.mark);
  setText("brandName", brand.name);
  setText("brandTag", brand.tagline);

  setText("navHome", nav.home);
  setText("navCatalog", nav.catalog);
  setText("navCapabilities", nav.capabilities);
  setText("navAbout", nav.about);

  if (Array.isArray(topBar.phones)) {
    const [p1, p2] = topBar.phones;
    const setPhone = (phone, phoneId, waId) => {
      if (!phone) return;
      const phoneEl = document.getElementById(phoneId);
      const waEl = document.getElementById(waId);
      if (phoneEl) {
        phoneEl.textContent = phone.label || phone.tel || "";
        if (phone.tel) phoneEl.href = `tel:${phone.tel}`;
      }
      if (waEl) {
        const waNum = phone.whatsapp || "";
        if (waNum) waEl.href = `https://wa.me/${waNum}`;
      }
    };
    setPhone(p1, "topPhone1", "topWa1");
    setPhone(p2, "topPhone2", "topWa2");
  }

  setText("solutionsEyebrow", solutions.eyebrow);
  setText("solutionsTitle", solutions.title);
  setText("solutionsSubtitle", solutions.subtitle);

  setText("aboutEyebrow", about.eyebrow);
  setText("aboutTitle", about.title);
  setText("aboutLead", about.lead);
  setText("aboutWhyTitle", about.whyTitle);
  if (Array.isArray(about.whyItems)) {
    const list = document.getElementById("aboutWhyList");
    if (list) {
      list.innerHTML = about.whyItems.map((item) => `<li>${item}</li>`).join("");
    }
  }

  setText("contactEyebrow", contactCta.eyebrow);
  setText("contactTitle", contactCta.title);
  setText("contactLead", contactCta.lead);
  const cta = document.getElementById("contactCta");
  if (cta && contactCta.buttonLabel) {
    cta.textContent = contactCta.buttonLabel;
  }

  if (Array.isArray(solutions.items)) {
    const carousel = document.getElementById("solutionsCarousel");
    if (carousel) {
      const cardsHtml = solutions.items
        .map((item, idx) => `
          <article class="solution-card ${idx === 0 ? "is-active" : ""}" data-solution="${item.id || idx}">
            <div class="solution-media">
              <img src="${item.image}" alt="${item.title}" />
            </div>
            <div class="solution-copy">
              <h3>${item.title}</h3>
              <p class="solution-tag">${item.tag || ""}</p>
              <p class="solution-line">${item.line || ""}</p>
            </div>
          </article>
        `)
        .join("");
      const nextLabel = solutions.nextLabel || "Next";
      carousel.innerHTML = `
        ${cardsHtml}
        <div class="solutions-controls">
          <button class="button ghost tiny" type="button" id="solutionsNext">${nextLabel}</button>
        </div>
      `;
      initSolutionsCarousel();
    }
  }

  setText("capEyebrow", capabilities.eyebrow);
  setText("capTitle", capabilities.title);
  setText("capLead", capabilities.lead);
  if (Array.isArray(capabilities.cards)) {
    const grid = document.getElementById("capGrid");
    if (grid) {
      const gallery = Array.isArray(capabilities.gallery) ? capabilities.gallery : [];
      grid.innerHTML = capabilities.cards
        .map((card, idx) => {
          const image = gallery[idx % Math.max(gallery.length, 1)] || "assets/products/nickel-plated/np-20-1.jpg";
          return `
            <div class="cap-card">
              <img class="cap-photo" src="${image}" alt="${card.title}" />
              <h3>${card.title}</h3>
              <p>${card.text}</p>
            </div>
          `;
        })
        .join("");
    }
  }

  if (mobileFab && fab.label) {
    mobileFab.textContent = fab.label;
  }
  if (mobileFab && fab.icon) {
    mobileFab.classList.add("has-icon");
    mobileFab.style.setProperty("--fab-icon", `url('${fab.icon}')`);
  }
};

const loadSiteConfig = async () => {
  try {
    const response = await fetch("site.json", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    applySiteConfig(data);
  } catch {
    // ignore config errors
  }
};

const initTabs = (root) => {
  if (!root) return;
  const tabs = root.querySelectorAll(".side-tab");
  const panels = root.querySelectorAll(".side-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.tab;
      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.panel === key);
      });
    });
  });
};

const setActivePanel = (root, key) => {
  if (!root) return;
  const tabs = root.querySelectorAll(".side-tab");
  const panels = root.querySelectorAll(".side-panel");
  tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.tab === key);
  });
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === key);
  });
};

const openWhatsApp = (title, items, form) => {
  const formData = new FormData(form);
  const countryCode = formData.get("countryCode") || "+91";
  const mobile = String(formData.get("mobile") || "").trim();
  if (!mobile) return;
  const lines = items.length ? items : ["No products selected."];
  const body = [
    title,
    "",
    "Selected products:",
    ...lines,
    "",
    `Mobile: ${countryCode} ${mobile}`.trim()
  ].join("\n");
  const whatsapp = `https://wa.me/918112662827?text=${encodeURIComponent(body)}`;
  window.open(whatsapp, "_blank");
  form.reset();
};

document.querySelectorAll("[data-clear]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.clear;
    if (type === "sample") {
      clearCart();
    } else if (type === "order") {
      clearOrder();
    }
  });
});

if (sampleForm) {
  sampleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const items = Object.values(getCart()).map((item) => `• ${item.name} (Qty: 1)`);
    if (items.length === 0) {
      alert("Add at least one sample before submitting.");
      return;
    }
    openWhatsApp("Sample Request", items, sampleForm);
  });
}

if (mobileSampleForm) {
  mobileSampleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const items = Object.values(getCart()).map((item) => `• ${item.name} (Qty: 1)`);
    if (items.length === 0) {
      alert("Add at least one sample before submitting.");
      return;
    }
    openWhatsApp("Sample Request", items, mobileSampleForm);
  });
}

if (orderForm) {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const items = Object.values(getOrder()).map((item) => `• ${item.name} (${item.kg} kg)`);
    if (items.length === 0) {
      alert("Add at least one item before submitting.");
      return;
    }
    openWhatsApp("Order Request", items, orderForm);
  });
}

if (mobileOrderForm) {
  mobileOrderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const items = Object.values(getOrder()).map((item) => `• ${item.name} (${item.kg} kg)`);
    if (items.length === 0) {
      alert("Add at least one item before submitting.");
      return;
    }
    openWhatsApp("Order Request", items, mobileOrderForm);
  });
}

if (mobileFab && mobileSheet) {
  mobileFab.addEventListener("click", () => {
    mobileSheet.classList.add("is-open");
    mobileSheet.setAttribute("aria-hidden", "false");
  });
}

if (mobileSheetClose && mobileSheet) {
  mobileSheetClose.addEventListener("click", () => {
    mobileSheet.classList.remove("is-open");
    mobileSheet.setAttribute("aria-hidden", "true");
  });
}

if (mobileSheet) {
  mobileSheet.addEventListener("click", (event) => {
    if (event.target === mobileSheet) {
      mobileSheet.classList.remove("is-open");
      mobileSheet.setAttribute("aria-hidden", "true");
    }
  });
}

initTabs(document.querySelector(".catalog-side"));
initTabs(mobileSheet);

loadCatalog();
populateCountrySelects();
renderSampleList();
renderOrderList();
initSolutionsCarousel();
loadSiteConfig();

