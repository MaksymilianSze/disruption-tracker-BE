const LineStatusWorker = require("./lineStatusWorker");

// Defines the workers for the tube lines and manages their start and stop
class WorkerManager {
  constructor() {
    this.workers = {};
    this.tubeLines = [
      "bakerloo",
      "central",
      "circle",
      "district",
      "hammersmith-city",
      "jubilee",
      "metropolitan",
      "northern",
      "piccadilly",
      "victoria",
      "waterloo-city",
      "dlr",
      "tram",
      "elizabeth",
      "lioness",
      "liberty",
      "mildmay",
      "suffragette",
      "weaver",
      "windrush",
    ];
  }

  startAll() {
    this.tubeLines.forEach((line) => {
      this.startWorker(line);
    });
    return this;
  }

  startWorker(lineName) {
    if (this.workers[lineName]) {
      console.log(`Worker for ${lineName} line already running`);
      return this;
    }

    this.workers[lineName] = new LineStatusWorker(lineName).start();
    return this;
  }

  stopWorker(lineName) {
    if (this.workers[lineName]) {
      this.workers[lineName].stop();
      delete this.workers[lineName];
    }
    return this;
  }

  stopAll() {
    Object.keys(this.workers).forEach((lineName) => {
      this.stopWorker(lineName);
    });
    return this;
  }

  getWorkers() {
    return this.workers;
  }
}

module.exports = new WorkerManager();
