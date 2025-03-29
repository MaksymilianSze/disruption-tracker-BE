const tflService = require("../services/tflService");
const tflMapper = require("../utils/tflMapper");

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
