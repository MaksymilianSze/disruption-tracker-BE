const bakerlooDariations = ["bakerloo", "bakerloo-line", "bakerloo line"];

const centralVariations = ["central", "central-line", "central line"];

const circleVariations = ["circle", "circle-line", "circle line"];

const districtVariations = ["district", "district-line", "district line"];

const hammerSmithAndCityVariations = [
  "hammersmith-city",
  "hammersmith-and-city",
  "hammersmith-and-city-line",
  "hammersmith-and-city",
  "hammersmith & city",
  "hammersmith & city line",
];

const jubileeVariations = ["jubilee", "jubilee-line", "jubilee line"];

const metropolitanVariations = [
  "metropolitan",
  "metropolitan-line",
  "metropolitan line",
  "met",
  "met line",
];

const northernVariations = ["northern", "northern-line", "northern line"];

const piccadillyVariations = [
  "piccadilly",
  "piccadilly-line",
  "piccadilly line",
];

const victoriaVariations = ["victoria", "victoria-line", "victoria line"];

const waterlooAndCityVariations = [
  "waterloo-and-city",
  "waterloo-and-city-line",
  "waterloo & city",
  "waterloo & city line",
  "waterloo & city",
  "waterloo & city line",
];

const elizabethVariations = [
  "elizabeth",
  "elizabeth-line",
  "elizabeth line",
  "crossrail",
];

const docklandsVariations = [
  "dlr",
  "docklands",
  "docklands light railway",
  "docklands-light-railway",
];

const overgroundVariations = [
  "overground",
  "london overground",
  "tfl overground",
  "overground line",
  "lioness",
  "lioness line",
  "liberty",
  "liberty line",
  "mildmay",
  "mildmay line",
  "suffragette",
  "suffragette line",
  "weaver",
  "weaver line",
  "windrush",
  "windrush line",
];

// Best effort attempt to create a mapping of line names to their common variations for filtering Reddit posts
exports.allowedVariationsMapper = (lineName) => {
  const lineNameLower = lineName.toLowerCase();

  if (lineNameLower.includes("hammersmith")) {
    return hammerSmithAndCityVariations;
  }
  if (lineNameLower.includes("waterloo")) {
    return waterlooAndCityVariations;
  }
  if (lineNameLower.includes("bakerloo")) {
    return bakerlooDariations;
  }
  if (lineNameLower.includes("central")) {
    return centralVariations;
  }
  if (lineNameLower.includes("circle")) {
    return circleVariations;
  }
  if (lineNameLower.includes("district")) {
    return districtVariations;
  }
  if (lineNameLower.includes("jubilee")) {
    return jubileeVariations;
  }
  if (lineNameLower.includes("metropolitan")) {
    return metropolitanVariations;
  }
  if (lineNameLower.includes("northern")) {
    return northernVariations;
  }
  if (lineNameLower.includes("piccadilly")) {
    return piccadillyVariations;
  }
  if (lineNameLower.includes("victoria")) {
    return victoriaVariations;
  }
  if (
    lineNameLower.includes("elizabeth") ||
    lineNameLower.includes("crossrail")
  ) {
    return elizabethVariations;
  }
  if (lineNameLower.includes("dlr") || lineNameLower.includes("docklands")) {
    return docklandsVariations;
  }
  if (
    lineNameLower.includes("overground") ||
    lineNameLower.includes("lioness") ||
    lineNameLower.includes("liberty") ||
    lineNameLower.includes("mildmay") ||
    lineNameLower.includes("suffragette") ||
    lineNameLower.includes("weaver") ||
    lineNameLower.includes("windrush")
  ) {
    return overgroundVariations;
  }
  return null;
};
