export const AIRPORTS = [
  { code: "DEL", city: "Delhi", name: "Indira Gandhi International Airport" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International Airport" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda International Airport" },
  { code: "GOI", city: "Goa", name: "Manohar International Airport" },
  { code: "JAI", city: "Jaipur", name: "Jaipur International Airport" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International Airport" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose International Airport" },
  { code: "MAA", city: "Chennai", name: "Chennai International Airport" },
  { code: "COK", city: "Kochi", name: "Cochin International Airport" },
  { code: "PNQ", city: "Pune", name: "Pune Airport" },
  { code: "GAU", city: "Guwahati", name: "Lokpriya Gopinath Bordoloi International Airport" },
  { code: "IXC", city: "Chandigarh", name: "Chandigarh Airport" },
];

export const AIRLINES = [
  { code: "6E", name: "IndiGo" },
  { code: "AI", name: "Air India" },
  { code: "UK", name: "Vistara" },
  { code: "QP", name: "Akasa Air" },
  { code: "SG", name: "SpiceJet" },
];

export const CITY_ROUTES = {
  DEL: ["BOM", "BLR", "GOI", "JAI"],
  BOM: ["DEL", "BLR", "GOI", "COK"],
  BLR: ["DEL", "BOM", "MAA", "GAU"],
};
