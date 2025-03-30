const cron = require("node-cron");
const tflService = require("../services/tflService");
const tflMapper = require("../utils/tflMapper");
const LineStatus = require("../models/LineStatus");

class LineStatusWorker {
  constructor(lineName, interval = process.env.POLLING_INTERVAL || 60000) {
    this.lineName = lineName;
    this.interval = parseInt(interval, 10);
    this.job = null;
  }

  async pollAndUpdate() {
    try {
      console.log(`Polling TFL API for ${this.lineName} line status...`);

      const lineStatusData = await tflService.getLineStatus(this.lineName);

      const mappedData = tflMapper.mapLineStatusToDisruptions(lineStatusData);

      mappedData.updatedAt = new Date();

      await LineStatus.findOneAndUpdate(
        { lineName: mappedData.lineName },
        mappedData,
        { upsert: true, new: true }
      );

      console.log(`Updated ${this.lineName} line status successfully`);
    } catch (error) {
      console.error(`Error updating ${this.lineName} line status:`, error);
    }
  }

  start() {
    const intervalSeconds = Math.floor(this.interval / 1000);

    if (intervalSeconds < 60) {
      console.log(
        `Setting up polling for ${this.lineName} every ${intervalSeconds} seconds`
      );
      this.job = setInterval(() => this.pollAndUpdate(), this.interval);
    } else {
      const minutes = Math.floor(intervalSeconds / 60);
      const cronExpression =
        minutes === 1 ? "* * * * *" : `*/${minutes} * * * *`;

      console.log(
        `Setting up cron job for ${this.lineName} with expression: ${cronExpression}`
      );
      this.job = cron.schedule(cronExpression, () => {
        this.pollAndUpdate();
      });
    }

    this.pollAndUpdate();

    console.log(
      `Started polling worker for ${this.lineName} line, interval: ${this.interval}ms`
    );
    return this;
  }

  stop() {
    if (this.job) {
      if (typeof this.job.stop === "function") {
        this.job.stop();
      } else {
        clearInterval(this.job);
      }
      console.log(`Stopped polling worker for ${this.lineName} line`);
    }
    return this;
  }
}

module.exports = LineStatusWorker;
