exports.mapLineStatusToDisruptions = (lineStatusData) => {
  const disruptionData = lineStatusData[0];

  if (!disruptionData) {
    return result;
  }

  const result = {
    lineName: disruptionData.name,
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
        route.commonName.replace(" Underground Station", "")
      ),
    });
  });

  return result;
};
