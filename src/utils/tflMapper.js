exports.mapLineStatusToDisruptions = (lineStatusData, lineName) => {
  const disruptionData = lineStatusData[0];

  if (!disruptionData) {
    return {
      lineName: lineName || "unknown",
      disruptions: [],
    };
  }

  const result = {
    lineName,
    disruptions: [],
  };

  if (
    disruptionData.lineStatuses[0].statusSeverityDescription === "Good Service"
  ) {
    return result;
  }

  disruptionData.lineStatuses.forEach((disruption) => {
    result.disruptions.push({
      status: disruption.statusSeverityDescription,
      description: disruption.reason,
      disruptionStart: disruption.validityPeriods[0]?.fromDate,
      disruptionEnd: disruption.validityPeriods[0]?.toDate,
      isEntireRouteAffected: !disruption.disruption?.affectedStops?.length,
      affectedStations: (disruption.disruption?.affectedStops || []).map(
        (route) => formatStationName(route.commonName)
      ),
    });
  });

  return result;
};

const mapCommonNameShortenings = {
  "High Street": "High St",
  " Road": " Rd",
  " Underground Station": "",
  "-Underground": "",
  " Rail Station": "",
  " (Circle Line)": "",
  " (H&C Line)": "",
  " (DistrictLine)": "",
  " (Bakerloo)": "",
  " (Metropolitan)": "",
  " (Central)": "",
  " (Northern)": "",
  " (Piccadilly)": "",
  " (Victoria)": "",
  " (Waterloo & City)": "",
  " Tram Stop": "",
  " (London)": "",
  "London ": "",
  "'": "",
  "s's": "s",
};

const mapSpecialCaseShortenings = {
  "Queens Rd Peckham": "Qns Rd Peckham",
  "Kings Cross St. Pancras": "Kings Cross St. Pan",
  "Battersea Power Station": "Battersea Pwr Stn",
  "Heathrow Terminals 2 & 3": "Heathrow T2 & T3",
  "Heathrow Terminal 4": "Heathrow T4",
  "Heathrow Terminal 5": "Heathrow T5",
  "High Street Kensington": "High St Ken",
  "Kensington (Olympia)": "Ken Olympia",
};

const formatStationName = (stationName) => {
  if (!stationName) return "";

  let formattedName = stationName;
  for (const [pattern, replacement] of Object.entries(
    mapCommonNameShortenings
  )) {
    formattedName = formattedName.replace(pattern, replacement);
  }

  formattedName = formattedName.replace(/\s+/g, " ").trim();

  for (const [original, shortened] of Object.entries(
    mapSpecialCaseShortenings
  )) {
    if (formattedName === original) {
      return shortened;
    }
  }

  return formattedName;
};
