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

const formatStationName = (stationName) => {
  return stationName
    .replace(" Underground Station", "")
    .replace("-Underground", "")
    .replace(" Rail Station", "")
    .replace(" (Circle Line)", "")
    .replace(" (H&C Line)", "")
    .replace(" (DistrictLine)", "")
    .replace(" (Bakerloo)", "")
    .replace(" (Metropolitan)", "")
    .replace(" (Central)", "")
    .replace(" (Northern)", "")
    .replace(" (Piccadilly)", "")
    .replace(" (Victoria)", "")
    .replace(" (Waterloo & City)", "")
    .replace("King's Cross St. Pancras", "King's Cross St. Pan")
    .replace("Battersea Power Station", "Battersea Pwr Stn")
    .replace("Heathrow Terminals 2 & 3", "Heathrow T2 & T3")
    .replace("Heathrow Terminal 4", "Heathrow T4")
    .replace("Heathrow Terminal 5", "Heathrow T5")
    .replace("High Street Kensington", "High St Ken")
    .replace("Kensington (Olympia)", "Ken Olympia")
    .replace("Shepherds Bush", "Shepard's Bush")
    .replace(" Tram Stop", "")
    .replace(" (London)", "");
};
