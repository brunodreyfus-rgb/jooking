const incidents = [
  {
    id: 1,
    realCase: true,
    tourismType: "tourism_direct",
    confidence: "Real source - verify",
    status: "approved",
    country: "Spain",
    city: "Vigo",
    category: "Restaurant",
    name: "Mimassa Restaurant",
    date: "2025-07-09",
    summary: "Israeli tourists reportedly expelled from a restaurant in Spain after being accused in relation to Gaza/Palestine.",
    details: "Starter real-source case. Reports describe Israeli tourists being expelled from a Spanish restaurant, with hostile remarks referencing Palestine/Gaza. City and details should be confirmed during moderation because some public reports mention uncertainty or different locations.",
    sources: [
      { label: "i24NEWS article provided by Bruno", url: "https://www.i24news.tv/fr/actu/international/europe/artc-vous-tuez-la-palestine-allez-manger-a-gaza-des-touristes-israeliens-expulses-d-un-restaurant-en-espagne" }
    ]
  },
  {
    id: 2,
    realCase: true,
    tourismType: "tourism_direct",
    confidence: "Social source - verify",
    status: "under_review",
    country: "Spain",
    city: "Malaga",
    category: "Restaurant",
    name: "Restaurant / server incident Malaga",
    date: "2025-07-10",
    summary: "A similar incident was reported on social media involving Israeli tourists and pro-Palestinian chants.",
    details: "Starter social-source case based on the Instagram reel provided. Because this is primarily social content, it must be corroborated before publication.",
    sources: [
      { label: "Instagram reel provided by Bruno", url: "https://www.instagram.com/reel/DMDBbUnKO9U/" }
    ]
  },
  {
    id: 3,
    realCase: true,
    tourismType: "tourism_direct",
    confidence: "Real source - legal case",
    status: "approved",
    country: "France",
    city: "Porté-Puymorens",
    category: "Museum / Attraction",
    name: "Tyrovol Adventure Park",
    date: "2025-08-21",
    summary: "150 Israeli children/vacationers reportedly refused access to a French leisure park; manager investigated for discrimination.",
    details: "Starter real-source case. French media reported that a group of Israeli minors/vacationers was refused access to Tyrovol in the Pyrénées-Orientales. The manager denied the accusation according to press coverage, so the incident should be documented with careful legal-status wording and source links.",
    sources: [
      { label: "Le Parisien article provided by Bruno", url: "https://www.leparisien.fr/faits-divers/150-vacanciers-israeliens-refuses-dun-parc-de-loisirs-francais-en-garde-a-vue-le-gerant-nie-les-faits-22-08-2025-6LK4776HJFD3RJA2BUXZZD5RHQ.php" }
    ]
  },
  {
    id: 4,
    realCase: true,
    tourismType: "tourism_direct",
    confidence: "Government report - verify",
    status: "approved",
    country: "Spain",
    city: "Valencia",
    category: "Airport Service",
    name: "Vueling Airlines flight from Valencia Airport",
    date: "2025-07-23",
    summary: "French Jewish children and their camp director were reportedly removed from a Vueling flight after singing Hebrew songs.",
    details: "A Government of Israel report says around 50 French Jewish children aged 13-15 and their 21-year-old summer camp director were removed from a Vueling Airlines flight at Valencia Airport after reportedly singing Hebrew songs. The report says police were called, the children were removed before takeoff, and the director was handcuffed and taken into custody. Wording should remain careful because the same report notes that authorities had not confirmed an antisemitic motive.",
    sources: [
      { label: "Government of Israel retrospective report", url: "https://www.gov.il/BlobFolder/reports/spain_antisemitic_incident_vueling_flight_2025-07-23/en/mashlat_spain_antisemitic_incident_vueling_flight_2025-07-23.pdf" }
    ]
  },
  {
    id: 5,
    realCase: true,
    tourismType: "tourism_related",
    confidence: "TAU report - tourism lead",
    status: "under_review",
    country: "Hungary",
    city: "Budapest",
    category: "Taxi / Transport",
    name: "Central Budapest tourist area",
    date: "2025-04-01",
    summary: "Eight Orthodox Israeli Jews in central Budapest were reportedly assaulted by German tourists shouting antisemitic abuse.",
    details: "TAU's 2025 report describes eight Orthodox Israeli Jews assaulted in central Budapest by German tourists who reportedly shouted antisemitic abuse before police intervened. This is a tourism-area safety lead and should be reviewed for exact location before publication.",
    sources: [
      { label: "TAU Antisemitism Worldwide Report 2025", url: "/assets/sources/TAU antisemite 2025.pdf" },
      { label: "Ynetnews source cited by TAU", url: "https://www.ynetnews.com/jewish-world/article/s1acps1bll" }
    ]
  },
  {
    id: 6,
    realCase: true,
    tourismType: "tourism_related",
    confidence: "TAU report - transport lead",
    status: "under_review",
    country: "Italy",
    city: "Milan",
    category: "Taxi / Transport",
    name: "Milan Central Train Station",
    date: "2025-01-01",
    summary: "An American ultra-Orthodox Jew was reportedly assaulted at Milan's central train station.",
    details: "TAU's 2025 report says the CDEC recorded a real-world physical assault at Milan's central train station in which an American ultra-Orthodox Jew was punched and kicked, leaving him with a head injury before police arrested the suspect. Date should be refined before publication.",
    sources: [
      { label: "TAU Antisemitism Worldwide Report 2025", url: "/assets/sources/TAU antisemite 2025.pdf" }
    ]
  },
  {
    id: 7,
    realCase: true,
    tourismType: "tourism_related",
    confidence: "TAU report - city monument lead",
    status: "context_only",
    country: "Mexico",
    city: "Mexico City",
    category: "Museum / Attraction",
    name: "Angel of Independence monument",
    date: "2025-06-10",
    summary: "TAU reports that the Angel of Independence monument was vandalized with antisemitic and anti-Zionist graffiti.",
    details: "The Angel of Independence is a major city landmark. This is tourism-related context and should be used for country/city risk, not as a private business listing.",
    sources: [
      { label: "TAU Antisemitism Worldwide Report 2025", url: "/assets/sources/TAU antisemite 2025.pdf" }
    ]
  },
  ...generateSeedIncidents()
];

function generateSeedIncidents() {
  const seed = [
    ["France", "Paris", "Hotel", "Hotel République Sample", "Reported refusal to process a reservation after nationality was disclosed."],
    ["France", "Nice", "Restaurant", "Café Promenade Sample", "Reported hostile remarks toward Hebrew-speaking guests."],
    ["France", "Marseille", "Taxi / Transport", "Airport Transfer Marseille Sample", "Reported cancellation after Israeli destination details appeared in messages."],
    ["France", "Lyon", "Airbnb / Rental", "Old Town Rental Sample", "Reported cancellation after guest profile mentioned Israel."],
    ["Spain", "Barcelona", "Hotel", "Rambla Stay Sample", "Reported refusal to honor a booking after passport nationality was shown."],
    ["Spain", "Madrid", "Restaurant", "Centro Restaurant Sample", "Reported discriminatory remarks during service."],
    ["Spain", "Seville", "Taxi / Transport", "Seville Transfer Sample", "Reported driver refusal after hearing Hebrew."],
    ["Spain", "Valencia", "Airbnb / Rental", "Valencia Rental Sample", "Reported host cancellation after nationality-related exchange."],
    ["Italy", "Rome", "Hotel", "Roma Centro Hotel Sample", "Reported check-in refusal with nationality-related comments."],
    ["Italy", "Milan", "Restaurant", "Milan Bistro Sample", "Reported staff comments linking guests to political conflict."],
    ["Italy", "Venice", "Airbnb / Rental", "Venice Host Sample", "Reported host refused check-in after passport review."],
    ["Germany", "Berlin", "Hotel", "Berlin Mitte Hotel Sample", "Reported hostile reception interaction involving Jewish symbols."],
    ["Germany", "Munich", "Restaurant", "Munich Dining Sample", "Reported refusal of table service after guests spoke Hebrew."],
    ["Germany", "Frankfurt", "Airport Service", "Frankfurt Airport Service Sample", "Reported discriminatory assistance refusal during transit."],
    ["Netherlands", "Amsterdam", "Hotel", "Canal Hotel Sample", "Reported booking cancellation with discriminatory wording."],
    ["Belgium", "Brussels", "Hotel", "Brussels Central Hotel Sample", "Reported refusal to accept ID documents from Israeli guests."],
    ["United Kingdom", "London", "Hotel", "London Stay Sample", "Reported group booking cancellation after organizer details disclosed."],
    ["Greece", "Athens", "Hotel", "Athens Boutique Hotel Sample", "Reported check-in hostility after Israeli passport shown."],
    ["Portugal", "Lisbon", "Restaurant", "Lisbon Dining Sample", "Reported discriminatory remarks from staff."],
    ["Switzerland", "Zurich", "Taxi / Transport", "Zurich Transfer Sample", "Reported discriminatory refusal by transport provider."],
    ["United States", "New York", "Hotel", "NYC Midtown Hotel Sample", "Reported discriminatory comments during group booking."],
    ["Canada", "Montreal", "Taxi / Transport", "Montreal Transfer Sample", "Reported ride refusal after Jewish identity became visible."]
  ];

  return seed.map((row, index) => ({
    id: index + 8,
    realCase: false,
    tourismType: "demo_seed",
    status: "demo",
    confidence: index % 3 === 0 ? "Fictional seed" : "Demo only",
    country: row[0],
    city: row[1],
    category: row[2],
    name: row[3],
    date: seedDate(index),
    summary: row[4],
    details: "Fictional seed incident created only to test the AntiBooking search experience, filters, incident detail page, moderation process and visual density. Replace with verified real-world reports before public launch.",
    sources: [
      { label: "Demo placeholder - no real source", url: "#" }
    ]
  }));
}

function seedDate(index) {
  const month = String((index % 12) + 1).padStart(2, "0");
  const day = String(((index * 7) % 26) + 1).padStart(2, "0");
  return `2025-${month}-${day}`;
}

function categoryImage(category) {
  if (category === "Hotel") return "/assets/img/categories/hotel.svg";
  if (category === "Restaurant") return "/assets/img/categories/restaurant.svg";
  if (category === "Taxi / Transport") return "/assets/img/categories/transport.svg";
  if (category === "Museum / Attraction") return "/assets/img/categories/museum.svg";
  if (category === "Airbnb / Rental") return "/assets/img/categories/airbnb.svg";
  if (category === "Airport Service") return "/assets/img/categories/airport.svg";
  return "/assets/img/categories/hotel.svg";
}

const AI_AGENT_QUERIES = [
  "Israeli tourists refused hotel",
  "Jewish travelers expelled restaurant",
  "Hebrew singing removed from flight",
  "antisemitic incident hotel restaurant travel",
  "Jewish tourist attacked tourist site",
  "Israeli group denied entry attraction",
  "airport antisemitic discrimination Israeli passengers",
  "Israeli tourists denied service taxi restaurant hotel"
];

const TOURISM_DIRECT_CATEGORIES = ["Hotel", "Restaurant", "Airbnb / Rental", "Taxi / Transport", "Airport Service"];
const TOURISM_RELATED_CATEGORIES = ["Museum / Attraction"];
