exports.mapLineStatusToDisruptions = (lineStatusData) => {
  const disruptionData = lineStatusData[0];

  if (!disruptionData) {
    return result;
  }

  const result = {
    lineName: disruptionData.name.replaceAll(" ", ""),
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
      disruptionStart: disruption.validityPeriods[0].fromDate,
      disruptionEnd: disruption.validityPeriods[0].toDate,
      isEntireRouteAffected: disruption.disruption.affectedStops.length === 0,
      affectedStations: disruption.disruption.affectedStops.map((route) =>
        route.commonName
          .replace(" Underground Station", "")
          .replace("-Underground", "")
          .replace(" (Circle Line)", "")
          .replace(" (H&C Line)", "")
          .replace(" (DistrictLine)", "")
          .replace("King's Cross St. Pancras", "King's Cross St. Pan")
          .replace("Heathrow Terminals 2 & 3", "Heathrow T2 & T3")
          .replace("Heathrow Terminals 4", "Heathrow T4")
          .replace("Heathrow Terminals 5", "Heathrow T5")
      ),
    });
  });

  return result;
};
