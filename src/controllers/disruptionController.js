const tflService = require("../services/tflService");
const tflMapper = require("../utils/tflMapper");
const lineStatusService = require("../services/lineStatusService");
exports.getDisruptions = async (req, res, next) => {
  try {
    const { lineName } = req.query;

    if (!lineName) {
      return res
        .status(400)
        .json({ error: `Query param 'lineName' is required` });
    }

    const lineStatusData = await tflService.getLineStatus(lineName);
    const mappedData = tflMapper.mapLineStatusToDisruptions(lineStatusData);

    res.json(mappedData);
  } catch (error) {
    next(error);
  }
};

exports.getCachedDisruptions = async (req, res, next) => {
  try {
    const { lineName } = req.query;

    if (!lineName) {
      return res
        .status(400)
        .json({ error: `Query param 'lineName' is required` });
    }

    const cachedDisruptions = await lineStatusService.getLineStatus(lineName);
    res.json(cachedDisruptions);
  } catch (error) {
    next(error);
  }
};
