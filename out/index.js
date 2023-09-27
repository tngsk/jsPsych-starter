// node_modules/jspsych/dist/index.js
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var unique = function(arr) {
  return [...new Set(arr)];
};
var deepCopy = function(obj) {
  if (!obj)
    return obj;
  let out;
  if (Array.isArray(obj)) {
    out = [];
    for (const x of obj) {
      out.push(deepCopy(x));
    }
    return out;
  } else if (typeof obj === "object" && obj !== null) {
    out = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        out[key] = deepCopy(obj[key]);
      }
    }
    return out;
  } else {
    return obj;
  }
};
var deepMerge = function(obj1, obj2) {
  let merged = {};
  for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (typeof obj1[key] === "object" && obj2.hasOwnProperty(key)) {
        merged[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        merged[key] = obj1[key];
      }
    }
  }
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (!merged.hasOwnProperty(key)) {
        merged[key] = obj2[key];
      } else if (typeof obj2[key] === "object") {
        merged[key] = deepMerge(merged[key], obj2[key]);
      } else {
        merged[key] = obj2[key];
      }
    }
  }
  return merged;
};
var saveTextToFile = function(textstr, filename) {
  const blobToSave = new Blob([textstr], {
    type: "text/plain"
  });
  let blobURL = "";
  if (typeof window.webkitURL !== "undefined") {
    blobURL = window.webkitURL.createObjectURL(blobToSave);
  } else {
    blobURL = window.URL.createObjectURL(blobToSave);
  }
  const link = document.createElement("a");
  link.id = "jspsych-download-as-text-link";
  link.style.display = "none";
  link.download = filename;
  link.href = blobURL;
  link.click();
};
var JSON2CSV = function(objArray) {
  const array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  let line = "";
  let result = "";
  const columns = [];
  for (const row of array) {
    for (const key in row) {
      let keyString = key + "";
      keyString = '"' + keyString.replace(/"/g, '""') + '",';
      if (!columns.includes(key)) {
        columns.push(key);
        line += keyString;
      }
    }
  }
  line = line.slice(0, -1);
  result += line + "\r\n";
  for (const row of array) {
    line = "";
    for (const col of columns) {
      let value = typeof row[col] === "undefined" ? "" : row[col];
      if (typeof value == "object") {
        value = JSON.stringify(value);
      }
      const valueString = value + "";
      line += '"' + valueString.replace(/"/g, '""') + '",';
    }
    line = line.slice(0, -1);
    result += line + "\r\n";
  }
  return result;
};
var getQueryString = function() {
  const a = window.location.search.substr(1).split("&");
  const b = {};
  for (let i = 0;i < a.length; ++i) {
    const p = a[i].split("=", 2);
    if (p.length == 1)
      b[p[0]] = "";
    else
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
  }
  return b;
};
var createJointPluginAPIObject = function(jsPsych) {
  const settings = jsPsych.getInitSettings();
  const keyboardListenerAPI = autoBind(new KeyboardListenerAPI(jsPsych.getDisplayContainerElement, settings.case_sensitive_responses, settings.minimum_valid_rt));
  const timeoutAPI = autoBind(new TimeoutAPI);
  const mediaAPI = autoBind(new MediaAPI(settings.use_webaudio, jsPsych.webaudio_context));
  const hardwareAPI = autoBind(new HardwareAPI);
  const simulationAPI = autoBind(new SimulationAPI(jsPsych.getDisplayContainerElement, timeoutAPI.setTimeout));
  return Object.assign({}, ...[keyboardListenerAPI, timeoutAPI, mediaAPI, hardwareAPI, simulationAPI]);
};
var words = function(options) {
  function word() {
    if (options && options.maxLength > 1) {
      return generateWordWithMaxLength();
    } else {
      return generateRandomWord();
    }
  }
  function generateWordWithMaxLength() {
    var rightSize = false;
    var wordUsed;
    while (!rightSize) {
      wordUsed = generateRandomWord();
      if (wordUsed.length <= options.maxLength) {
        rightSize = true;
      }
    }
    return wordUsed;
  }
  function generateRandomWord() {
    return wordList[randInt(wordList.length)];
  }
  function randInt(lessThan) {
    return Math.floor(Math.random() * lessThan);
  }
  if (typeof options === "undefined") {
    return word();
  }
  if (typeof options === "number") {
    options = { exactly: options };
  }
  if (options.exactly) {
    options.min = options.exactly;
    options.max = options.exactly;
  }
  if (typeof options.wordsPerString !== "number") {
    options.wordsPerString = 1;
  }
  if (typeof options.formatter !== "function") {
    options.formatter = (word2) => word2;
  }
  if (typeof options.separator !== "string") {
    options.separator = " ";
  }
  var total = options.min + randInt(options.max + 1 - options.min);
  var results = [];
  var token = "";
  var relativeIndex = 0;
  for (var i = 0;i < total * options.wordsPerString; i++) {
    if (relativeIndex === options.wordsPerString - 1) {
      token += options.formatter(word(), relativeIndex);
    } else {
      token += options.formatter(word(), relativeIndex) + options.separator;
    }
    relativeIndex++;
    if ((i + 1) % options.wordsPerString === 0) {
      results.push(token);
      token = "";
      relativeIndex = 0;
    }
  }
  if (typeof options.join === "string") {
    results = results.join(options.join);
  }
  return results;
};
var setSeed = function(seed = Math.random().toString()) {
  Math.random = seedrandom(seed);
  return seed;
};
var repeat = function(array, repetitions, unpack = false) {
  const arr_isArray = Array.isArray(array);
  const rep_isArray = Array.isArray(repetitions);
  if (!arr_isArray) {
    if (!rep_isArray) {
      array = [array];
      repetitions = [repetitions];
    } else {
      repetitions = [repetitions[0]];
      console.log("Unclear parameters given to randomization.repeat. Multiple set sizes specified, but only one item exists to sample. Proceeding using the first set size.");
    }
  } else {
    if (!rep_isArray) {
      let reps = [];
      for (let i = 0;i < array.length; i++) {
        reps.push(repetitions);
      }
      repetitions = reps;
    } else {
      if (array.length != repetitions.length) {
        console.warn("Unclear parameters given to randomization.repeat. Items and repetitions are unequal lengths. Behavior may not be as expected.");
        if (repetitions.length < array.length) {
          let reps = [];
          for (let i = 0;i < array.length; i++) {
            reps.push(repetitions);
          }
          repetitions = reps;
        } else {
          repetitions = repetitions.slice(0, array.length);
        }
      }
    }
  }
  let allsamples = [];
  for (let i = 0;i < array.length; i++) {
    for (let j = 0;j < repetitions[i]; j++) {
      if (array[i] == null || typeof array[i] != "object") {
        allsamples.push(array[i]);
      } else {
        allsamples.push(Object.assign({}, array[i]));
      }
    }
  }
  let out = shuffle(allsamples);
  if (unpack) {
    out = unpackArray(out);
  }
  return out;
};
var shuffle = function(array) {
  if (!Array.isArray(array)) {
    console.error("Argument to shuffle() must be an array.");
  }
  const copy_array = array.slice(0);
  let m = copy_array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = copy_array[m];
    copy_array[m] = copy_array[i];
    copy_array[i] = t;
  }
  return copy_array;
};
var shuffleNoRepeats = function(arr, equalityTest) {
  if (!Array.isArray(arr)) {
    console.error("First argument to shuffleNoRepeats() must be an array.");
  }
  if (typeof equalityTest !== "undefined" && typeof equalityTest !== "function") {
    console.error("Second argument to shuffleNoRepeats() must be a function.");
  }
  if (typeof equalityTest == "undefined") {
    equalityTest = function(a, b) {
      if (a === b) {
        return true;
      } else {
        return false;
      }
    };
  }
  const random_shuffle = shuffle(arr);
  for (let i = 0;i < random_shuffle.length - 1; i++) {
    if (equalityTest(random_shuffle[i], random_shuffle[i + 1])) {
      let random_pick = Math.floor(Math.random() * (random_shuffle.length - 2)) + 1;
      while (equalityTest(random_shuffle[i + 1], random_shuffle[random_pick]) || equalityTest(random_shuffle[i + 1], random_shuffle[random_pick + 1]) || equalityTest(random_shuffle[i + 1], random_shuffle[random_pick - 1]) || equalityTest(random_shuffle[i], random_shuffle[random_pick])) {
        random_pick = Math.floor(Math.random() * (random_shuffle.length - 2)) + 1;
      }
      const new_neighbor = random_shuffle[random_pick];
      random_shuffle[random_pick] = random_shuffle[i + 1];
      random_shuffle[i + 1] = new_neighbor;
    }
  }
  return random_shuffle;
};
var shuffleAlternateGroups = function(arr_groups, random_group_order = false) {
  const n_groups = arr_groups.length;
  if (n_groups == 1) {
    console.warn("shuffleAlternateGroups() was called with only one group. Defaulting to simple shuffle.");
    return shuffle(arr_groups[0]);
  }
  let group_order = [];
  for (let i = 0;i < n_groups; i++) {
    group_order.push(i);
  }
  if (random_group_order) {
    group_order = shuffle(group_order);
  }
  const randomized_groups = [];
  let min_length = null;
  for (let i = 0;i < n_groups; i++) {
    min_length = min_length === null ? arr_groups[i].length : Math.min(min_length, arr_groups[i].length);
    randomized_groups.push(shuffle(arr_groups[i]));
  }
  const out = [];
  for (let i = 0;i < min_length; i++) {
    for (let j = 0;j < group_order.length; j++) {
      out.push(randomized_groups[group_order[j]][i]);
    }
  }
  return out;
};
var sampleWithoutReplacement = function(arr, size) {
  if (!Array.isArray(arr)) {
    console.error("First argument to sampleWithoutReplacement() must be an array");
  }
  if (size > arr.length) {
    console.error("Cannot take a sample larger than the size of the set of items to sample.");
  }
  return shuffle(arr).slice(0, size);
};
var sampleWithReplacement = function(arr, size, weights) {
  if (!Array.isArray(arr)) {
    console.error("First argument to sampleWithReplacement() must be an array");
  }
  const normalized_weights = [];
  if (typeof weights !== "undefined") {
    if (weights.length !== arr.length) {
      console.error("The length of the weights array must equal the length of the array to be sampled from.");
    }
    let weight_sum = 0;
    for (const weight of weights) {
      weight_sum += weight;
    }
    for (const weight of weights) {
      normalized_weights.push(weight / weight_sum);
    }
  } else {
    for (let i = 0;i < arr.length; i++) {
      normalized_weights.push(1 / arr.length);
    }
  }
  const cumulative_weights = [normalized_weights[0]];
  for (let i = 1;i < normalized_weights.length; i++) {
    cumulative_weights.push(normalized_weights[i] + cumulative_weights[i - 1]);
  }
  const samp = [];
  for (let i = 0;i < size; i++) {
    const rnd = Math.random();
    let index = 0;
    while (rnd > cumulative_weights[index]) {
      index++;
    }
    samp.push(arr[index]);
  }
  return samp;
};
var factorial = function(factors, repetitions = 1, unpack = false) {
  let design = [{}];
  for (const [factorName, factor] of Object.entries(factors)) {
    const new_design = [];
    for (const level of factor) {
      for (const cell of design) {
        new_design.push(Object.assign(Object.assign({}, cell), { [factorName]: level }));
      }
    }
    design = new_design;
  }
  return repeat(design, repetitions, unpack);
};
var randomID = function(length = 32) {
  let result = "";
  const chars = "0123456789abcdefghjklmnopqrstuvwxyz";
  for (let i = 0;i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};
var randomInt = function(lower, upper) {
  if (upper < lower) {
    throw new Error("Upper boundary must be less than or equal to lower boundary");
  }
  return lower + Math.floor(Math.random() * (upper - lower + 1));
};
var sampleBernoulli = function(p) {
  return Math.random() <= p ? 1 : 0;
};
var sampleNormal = function(mean, standard_deviation) {
  return randn_bm() * standard_deviation + mean;
};
var sampleExponential = function(rate) {
  return -Math.log(Math.random()) / rate;
};
var sampleExGaussian = function(mean, standard_deviation, rate, positive = false) {
  let s = sampleNormal(mean, standard_deviation) + sampleExponential(rate);
  if (positive) {
    while (s <= 0) {
      s = sampleNormal(mean, standard_deviation) + sampleExponential(rate);
    }
  }
  return s;
};
var randomWords = function(opts) {
  return randomWords$1(opts);
};
var randn_bm = function() {
  var u = 0, v = 0;
  while (u === 0)
    u = Math.random();
  while (v === 0)
    v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
var unpackArray = function(array) {
  const out = {};
  for (const x of array) {
    for (const key of Object.keys(x)) {
      if (typeof out[key] === "undefined") {
        out[key] = [];
      }
      out[key].push(x[key]);
    }
  }
  return out;
};
var turkInfo = function() {
  const turk = {
    previewMode: false,
    outsideTurk: false,
    hitId: "INVALID_URL_PARAMETER",
    assignmentId: "INVALID_URL_PARAMETER",
    workerId: "INVALID_URL_PARAMETER",
    turkSubmitTo: "INVALID_URL_PARAMETER"
  };
  const param = function(url, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regexS = "[\\?&]" + name + "=([^&#]*)";
    const regex = new RegExp(regexS);
    const results = regex.exec(url);
    return results == null ? "" : results[1];
  };
  const src = param(window.location.href, "assignmentId") ? window.location.href : document.referrer;
  const keys = ["assignmentId", "hitId", "workerId", "turkSubmitTo"];
  keys.map(function(key) {
    turk[key] = unescape(param(src, key));
  });
  turk.previewMode = turk.assignmentId == "ASSIGNMENT_ID_NOT_AVAILABLE";
  turk.outsideTurk = !turk.previewMode && turk.hitId === "" && turk.assignmentId == "" && turk.workerId == "";
  return turk;
};
var submitToTurk = function(data) {
  const turk = turkInfo();
  const assignmentId = turk.assignmentId;
  const turkSubmitTo = turk.turkSubmitTo;
  if (!assignmentId || !turkSubmitTo)
    return;
  const form = document.createElement("form");
  form.method = "POST";
  form.action = turkSubmitTo + "/mturk/externalSubmit?assignmentId=" + assignmentId;
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const hiddenField = document.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = key;
      hiddenField.id = key;
      hiddenField.value = data[key];
      form.appendChild(hiddenField);
    }
  }
  document.body.appendChild(form);
  form.submit();
};
var delay = function(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
var initJsPsych = function(options) {
  const jsPsych = new JsPsych(options);
  const migrationMessages = {
    init: "`jsPsych.init()` was replaced by `initJsPsych()` in jsPsych v7.",
    ALL_KEYS: 'jsPsych.ALL_KEYS was replaced by the "ALL_KEYS" string in jsPsych v7.',
    NO_KEYS: 'jsPsych.NO_KEYS was replaced by the "NO_KEYS" string in jsPsych v7.',
    currentTimelineNodeID: "`currentTimelineNodeID()` was renamed to `getCurrentTimelineNodeID()` in jsPsych v7.",
    progress: "`progress()` was renamed to `getProgress()` in jsPsych v7.",
    startTime: "`startTime()` was renamed to `getStartTime()` in jsPsych v7.",
    totalTime: "`totalTime()` was renamed to `getTotalTime()` in jsPsych v7.",
    currentTrial: "`currentTrial()` was renamed to `getCurrentTrial()` in jsPsych v7.",
    initSettings: "`initSettings()` was renamed to `getInitSettings()` in jsPsych v7.",
    allTimelineVariables: "`allTimelineVariables()` was renamed to `getAllTimelineVariables()` in jsPsych v7."
  };
  Object.defineProperties(jsPsych, Object.fromEntries(Object.entries(migrationMessages).map(([key, message]) => [
    key,
    {
      get() {
        throw new MigrationError(message);
      }
    }
  ])));
  return jsPsych;
};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var getAllProperties = (object) => {
  const properties = new Set;
  do {
    for (const key of Reflect.ownKeys(object)) {
      properties.add([object, key]);
    }
  } while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);
  return properties;
};
var autoBind = (self2, { include, exclude } = {}) => {
  const filter = (key) => {
    const match = (pattern) => typeof pattern === "string" ? key === pattern : pattern.test(key);
    if (include) {
      return include.some(match);
    }
    if (exclude) {
      return !exclude.some(match);
    }
    return true;
  };
  for (const [object, key] of getAllProperties(self2.constructor.prototype)) {
    if (key === "constructor" || !filter(key)) {
      continue;
    }
    const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    if (descriptor && typeof descriptor.value === "function") {
      self2[key] = self2[key].bind(self2);
    }
  }
  return self2;
};
var version = "7.3.3";

class MigrationError extends Error {
  constructor(message = "The global `jsPsych` variable is no longer available in jsPsych v7.") {
    super(`${message} Please follow the migration guide at https://www.jspsych.org/7.0/support/migration-v7/ to update your experiment.`);
    this.name = "MigrationError";
  }
}
window.jsPsych = {
  get init() {
    throw new MigrationError("`jsPsych.init()` was replaced by `initJsPsych()` in jsPsych v7.");
  },
  get data() {
    throw new MigrationError;
  },
  get randomization() {
    throw new MigrationError;
  },
  get turk() {
    throw new MigrationError;
  },
  get pluginAPI() {
    throw new MigrationError;
  },
  get ALL_KEYS() {
    throw new MigrationError('jsPsych.ALL_KEYS was replaced by the "ALL_KEYS" string in jsPsych v7.');
  },
  get NO_KEYS() {
    throw new MigrationError('jsPsych.NO_KEYS was replaced by the "NO_KEYS" string in jsPsych v7.');
  }
};
var utils = Object.freeze({
  __proto__: null,
  unique,
  deepCopy,
  deepMerge
});

class DataColumn {
  constructor(values = []) {
    this.values = values;
  }
  sum() {
    let s = 0;
    for (const v of this.values) {
      s += v;
    }
    return s;
  }
  mean() {
    return this.sum() / this.count();
  }
  median() {
    if (this.values.length === 0) {
      return;
    }
    const numbers = this.values.slice(0).sort(function(a, b) {
      return a - b;
    });
    const middle = Math.floor(numbers.length / 2);
    const isEven = numbers.length % 2 === 0;
    return isEven ? (numbers[middle] + numbers[middle - 1]) / 2 : numbers[middle];
  }
  min() {
    return Math.min.apply(null, this.values);
  }
  max() {
    return Math.max.apply(null, this.values);
  }
  count() {
    return this.values.length;
  }
  variance() {
    const mean = this.mean();
    let sum_square_error = 0;
    for (const x of this.values) {
      sum_square_error += Math.pow(x - mean, 2);
    }
    const mse = sum_square_error / (this.values.length - 1);
    return mse;
  }
  sd() {
    const mse = this.variance();
    const rmse = Math.sqrt(mse);
    return rmse;
  }
  frequencies() {
    const unique2 = {};
    for (const x of this.values) {
      if (typeof unique2[x] === "undefined") {
        unique2[x] = 1;
      } else {
        unique2[x]++;
      }
    }
    return unique2;
  }
  all(eval_fn) {
    for (const x of this.values) {
      if (!eval_fn(x)) {
        return false;
      }
    }
    return true;
  }
  subset(eval_fn) {
    const out = [];
    for (const x of this.values) {
      if (eval_fn(x)) {
        out.push(x);
      }
    }
    return new DataColumn(out);
  }
}

class DataCollection {
  constructor(data = []) {
    this.trials = data;
  }
  push(new_data) {
    this.trials.push(new_data);
    return this;
  }
  join(other_data_collection) {
    this.trials = this.trials.concat(other_data_collection.values());
    return this;
  }
  top() {
    if (this.trials.length <= 1) {
      return this;
    } else {
      return new DataCollection([this.trials[this.trials.length - 1]]);
    }
  }
  first(n = 1) {
    if (n < 1) {
      throw `You must query with a positive nonzero integer. Please use a
               different value for n.`;
    }
    if (this.trials.length === 0)
      return new DataCollection;
    if (n > this.trials.length)
      n = this.trials.length;
    return new DataCollection(this.trials.slice(0, n));
  }
  last(n = 1) {
    if (n < 1) {
      throw `You must query with a positive nonzero integer. Please use a
               different value for n.`;
    }
    if (this.trials.length === 0)
      return new DataCollection;
    if (n > this.trials.length)
      n = this.trials.length;
    return new DataCollection(this.trials.slice(this.trials.length - n, this.trials.length));
  }
  values() {
    return this.trials;
  }
  count() {
    return this.trials.length;
  }
  readOnly() {
    return new DataCollection(deepCopy(this.trials));
  }
  addToAll(properties) {
    for (const trial of this.trials) {
      Object.assign(trial, properties);
    }
    return this;
  }
  addToLast(properties) {
    if (this.trials.length != 0) {
      Object.assign(this.trials[this.trials.length - 1], properties);
    }
    return this;
  }
  filter(filters) {
    let f;
    if (!Array.isArray(filters)) {
      f = deepCopy([filters]);
    } else {
      f = deepCopy(filters);
    }
    const filtered_data = [];
    for (const trial of this.trials) {
      let keep = false;
      for (const filter of f) {
        let match = true;
        for (const key of Object.keys(filter)) {
          if (typeof trial[key] !== "undefined" && trial[key] === filter[key])
            ;
          else {
            match = false;
          }
        }
        if (match) {
          keep = true;
          break;
        }
      }
      if (keep) {
        filtered_data.push(trial);
      }
    }
    return new DataCollection(filtered_data);
  }
  filterCustom(fn) {
    return new DataCollection(this.trials.filter(fn));
  }
  filterColumns(columns) {
    return new DataCollection(this.trials.map((trial) => Object.fromEntries(columns.filter((key) => (key in trial)).map((key) => [key, trial[key]]))));
  }
  select(column) {
    const values = [];
    for (const trial of this.trials) {
      if (typeof trial[column] !== "undefined") {
        values.push(trial[column]);
      }
    }
    return new DataColumn(values);
  }
  ignore(columns) {
    if (!Array.isArray(columns)) {
      columns = [columns];
    }
    const o = deepCopy(this.trials);
    for (const trial of o) {
      for (const delete_key of columns) {
        delete trial[delete_key];
      }
    }
    return new DataCollection(o);
  }
  uniqueNames() {
    const names = [];
    for (const trial of this.trials) {
      for (const key of Object.keys(trial)) {
        if (!names.includes(key)) {
          names.push(key);
        }
      }
    }
    return names;
  }
  csv() {
    return JSON2CSV(this.trials);
  }
  json(pretty = false) {
    if (pretty) {
      return JSON.stringify(this.trials, null, "\t");
    }
    return JSON.stringify(this.trials);
  }
  localSave(format, filename) {
    format = format.toLowerCase();
    let data_string;
    if (format === "json") {
      data_string = this.json();
    } else if (format === "csv") {
      data_string = this.csv();
    } else {
      throw new Error('Invalid format specified for localSave. Must be "json" or "csv".');
    }
    saveTextToFile(data_string, filename);
  }
}

class JsPsychData {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
    this.dataProperties = {};
    this.reset();
  }
  reset() {
    this.allData = new DataCollection;
    this.interactionData = new DataCollection;
  }
  get() {
    return this.allData;
  }
  getInteractionData() {
    return this.interactionData;
  }
  write(data_object) {
    const progress = this.jsPsych.getProgress();
    const trial = this.jsPsych.getCurrentTrial();
    const default_data = {
      trial_type: trial.type.info.name,
      trial_index: progress.current_trial_global,
      time_elapsed: this.jsPsych.getTotalTime(),
      internal_node_id: this.jsPsych.getCurrentTimelineNodeID()
    };
    this.allData.push(Object.assign(Object.assign(Object.assign(Object.assign({}, data_object), trial.data), default_data), this.dataProperties));
  }
  addProperties(properties) {
    this.allData.addToAll(properties);
    this.dataProperties = Object.assign({}, this.dataProperties, properties);
  }
  addDataToLastTrial(data) {
    this.allData.addToLast(data);
  }
  getDataByTimelineNode(node_id) {
    return this.allData.filterCustom((x) => x.internal_node_id.slice(0, node_id.length) === node_id);
  }
  getLastTrialData() {
    return this.allData.top();
  }
  getLastTimelineData() {
    const lasttrial = this.getLastTrialData();
    const node_id = lasttrial.select("internal_node_id").values[0];
    if (typeof node_id === "undefined") {
      return new DataCollection;
    } else {
      const parent_node_id = node_id.substr(0, node_id.lastIndexOf("-"));
      const lastnodedata = this.getDataByTimelineNode(parent_node_id);
      return lastnodedata;
    }
  }
  displayData(format = "json") {
    format = format.toLowerCase();
    if (format != "json" && format != "csv") {
      console.log("Invalid format declared for displayData function. Using json as default.");
      format = "json";
    }
    const data_string = format === "json" ? this.allData.json(true) : this.allData.csv();
    const display_element = this.jsPsych.getDisplayElement();
    display_element.innerHTML = '<pre id="jspsych-data-display"></pre>';
    document.getElementById("jspsych-data-display").textContent = data_string;
  }
  urlVariables() {
    if (typeof this.query_string == "undefined") {
      this.query_string = getQueryString();
    }
    return this.query_string;
  }
  getURLVariable(whichvar) {
    return this.urlVariables()[whichvar];
  }
  createInteractionListeners() {
    window.addEventListener("blur", () => {
      const data = {
        event: "blur",
        trial: this.jsPsych.getProgress().current_trial_global,
        time: this.jsPsych.getTotalTime()
      };
      this.interactionData.push(data);
      this.jsPsych.getInitSettings().on_interaction_data_update(data);
    });
    window.addEventListener("focus", () => {
      const data = {
        event: "focus",
        trial: this.jsPsych.getProgress().current_trial_global,
        time: this.jsPsych.getTotalTime()
      };
      this.interactionData.push(data);
      this.jsPsych.getInitSettings().on_interaction_data_update(data);
    });
    const fullscreenchange = () => {
      const data = {
        event: document.isFullScreen || document.webkitIsFullScreen || document.mozIsFullScreen || document.fullscreenElement ? "fullscreenenter" : "fullscreenexit",
        trial: this.jsPsych.getProgress().current_trial_global,
        time: this.jsPsych.getTotalTime()
      };
      this.interactionData.push(data);
      this.jsPsych.getInitSettings().on_interaction_data_update(data);
    };
    document.addEventListener("fullscreenchange", fullscreenchange);
    document.addEventListener("mozfullscreenchange", fullscreenchange);
    document.addEventListener("webkitfullscreenchange", fullscreenchange);
  }
  _customInsert(data) {
    this.allData = new DataCollection(data);
  }
  _fullreset() {
    this.reset();
    this.dataProperties = {};
  }
}

class HardwareAPI {
  constructor() {
    this.hardwareConnected = false;
    document.addEventListener("jspsych-activate", (evt) => {
      this.hardwareConnected = true;
    });
  }
  hardware(mess) {
    const jspsychEvt = new CustomEvent("jspsych", { detail: mess });
    document.dispatchEvent(jspsychEvt);
  }
}

class KeyboardListenerAPI {
  constructor(getRootElement, areResponsesCaseSensitive = false, minimumValidRt = 0) {
    this.getRootElement = getRootElement;
    this.areResponsesCaseSensitive = areResponsesCaseSensitive;
    this.minimumValidRt = minimumValidRt;
    this.listeners = new Set;
    this.heldKeys = new Set;
    this.areRootListenersRegistered = false;
    autoBind(this);
    this.registerRootListeners();
  }
  registerRootListeners() {
    if (!this.areRootListenersRegistered) {
      const rootElement = this.getRootElement();
      if (rootElement) {
        rootElement.addEventListener("keydown", this.rootKeydownListener);
        rootElement.addEventListener("keyup", this.rootKeyupListener);
        this.areRootListenersRegistered = true;
      }
    }
  }
  rootKeydownListener(e) {
    for (const listener of Array.from(this.listeners)) {
      listener(e);
    }
    this.heldKeys.add(this.toLowerCaseIfInsensitive(e.key));
  }
  toLowerCaseIfInsensitive(string) {
    return this.areResponsesCaseSensitive ? string : string.toLowerCase();
  }
  rootKeyupListener(e) {
    this.heldKeys.delete(this.toLowerCaseIfInsensitive(e.key));
  }
  isResponseValid(validResponses, allowHeldKey, key) {
    if (!allowHeldKey && this.heldKeys.has(key)) {
      return false;
    }
    if (validResponses === "ALL_KEYS") {
      return true;
    }
    if (validResponses === "NO_KEYS") {
      return false;
    }
    return validResponses.includes(key);
  }
  getKeyboardResponse({ callback_function, valid_responses = "ALL_KEYS", rt_method = "performance", persist, audio_context, audio_context_start_time, allow_held_key = false, minimum_valid_rt = this.minimumValidRt }) {
    if (rt_method !== "performance" && rt_method !== "audio") {
      console.log('Invalid RT method specified in getKeyboardResponse. Defaulting to "performance" method.');
      rt_method = "performance";
    }
    const usePerformanceRt = rt_method === "performance";
    const startTime = usePerformanceRt ? performance.now() : audio_context_start_time * 1000;
    this.registerRootListeners();
    if (!this.areResponsesCaseSensitive && typeof valid_responses !== "string") {
      valid_responses = valid_responses.map((r) => r.toLowerCase());
    }
    const listener = (e) => {
      const rt = Math.round((rt_method == "performance" ? performance.now() : audio_context.currentTime * 1000) - startTime);
      if (rt < minimum_valid_rt) {
        return;
      }
      const key = this.toLowerCaseIfInsensitive(e.key);
      if (this.isResponseValid(valid_responses, allow_held_key, key)) {
        e.preventDefault();
        if (!persist) {
          this.cancelKeyboardResponse(listener);
        }
        callback_function({ key, rt });
      }
    };
    this.listeners.add(listener);
    return listener;
  }
  cancelKeyboardResponse(listener) {
    this.listeners.delete(listener);
  }
  cancelAllKeyboardResponses() {
    this.listeners.clear();
  }
  compareKeys(key1, key2) {
    if (typeof key1 !== "string" && key1 !== null || typeof key2 !== "string" && key2 !== null) {
      console.error("Error in jsPsych.pluginAPI.compareKeys: arguments must be key strings or null.");
      return;
    }
    if (typeof key1 === "string" && typeof key2 === "string") {
      return this.areResponsesCaseSensitive ? key1 === key2 : key1.toLowerCase() === key2.toLowerCase();
    }
    return key1 === null && key2 === null;
  }
}
var ParameterType;
(function(ParameterType2) {
  ParameterType2[ParameterType2["BOOL"] = 0] = "BOOL";
  ParameterType2[ParameterType2["STRING"] = 1] = "STRING";
  ParameterType2[ParameterType2["INT"] = 2] = "INT";
  ParameterType2[ParameterType2["FLOAT"] = 3] = "FLOAT";
  ParameterType2[ParameterType2["FUNCTION"] = 4] = "FUNCTION";
  ParameterType2[ParameterType2["KEY"] = 5] = "KEY";
  ParameterType2[ParameterType2["KEYS"] = 6] = "KEYS";
  ParameterType2[ParameterType2["SELECT"] = 7] = "SELECT";
  ParameterType2[ParameterType2["HTML_STRING"] = 8] = "HTML_STRING";
  ParameterType2[ParameterType2["IMAGE"] = 9] = "IMAGE";
  ParameterType2[ParameterType2["AUDIO"] = 10] = "AUDIO";
  ParameterType2[ParameterType2["VIDEO"] = 11] = "VIDEO";
  ParameterType2[ParameterType2["OBJECT"] = 12] = "OBJECT";
  ParameterType2[ParameterType2["COMPLEX"] = 13] = "COMPLEX";
  ParameterType2[ParameterType2["TIMELINE"] = 14] = "TIMELINE";
})(ParameterType || (ParameterType = {}));
var universalPluginParameters = {
  data: {
    type: ParameterType.OBJECT,
    pretty_name: "Data",
    default: {}
  },
  on_start: {
    type: ParameterType.FUNCTION,
    pretty_name: "On start",
    default: function() {
      return;
    }
  },
  on_finish: {
    type: ParameterType.FUNCTION,
    pretty_name: "On finish",
    default: function() {
      return;
    }
  },
  on_load: {
    type: ParameterType.FUNCTION,
    pretty_name: "On load",
    default: function() {
      return;
    }
  },
  post_trial_gap: {
    type: ParameterType.INT,
    pretty_name: "Post trial gap",
    default: null
  },
  css_classes: {
    type: ParameterType.STRING,
    pretty_name: "Custom CSS classes",
    default: null
  },
  simulation_options: {
    type: ParameterType.COMPLEX,
    default: null
  }
};
var preloadParameterTypes = [
  ParameterType.AUDIO,
  ParameterType.IMAGE,
  ParameterType.VIDEO
];

class MediaAPI {
  constructor(useWebaudio, webaudioContext) {
    this.useWebaudio = useWebaudio;
    this.webaudioContext = webaudioContext;
    this.video_buffers = {};
    this.context = null;
    this.audio_buffers = [];
    this.preload_requests = [];
    this.img_cache = {};
    this.preloadMap = new Map;
    this.microphone_recorder = null;
    this.camera_stream = null;
    this.camera_recorder = null;
  }
  getVideoBuffer(videoID) {
    if (videoID.startsWith("blob:")) {
      this.video_buffers[videoID] = videoID;
    }
    return this.video_buffers[videoID];
  }
  initAudio() {
    this.context = this.useWebaudio ? this.webaudioContext : null;
  }
  audioContext() {
    if (this.context !== null) {
      if (this.context.state !== "running") {
        this.context.resume();
      }
    }
    return this.context;
  }
  getAudioBuffer(audioID) {
    return new Promise((resolve, reject) => {
      if (typeof this.audio_buffers[audioID] == "undefined" || this.audio_buffers[audioID] == "tmp") {
        this.preloadAudio([audioID], () => {
          resolve(this.audio_buffers[audioID]);
        }, () => {
        }, (e) => {
          reject(e.error);
        });
      } else {
        resolve(this.audio_buffers[audioID]);
      }
    });
  }
  preloadAudio(files, callback_complete = () => {
  }, callback_load = (filepath) => {
  }, callback_error = (error_msg) => {
  }) {
    files = unique(files.flat());
    let n_loaded = 0;
    if (files.length == 0) {
      callback_complete();
      return;
    }
    const load_audio_file_webaudio = (source, count = 1) => {
      const request = new XMLHttpRequest;
      request.open("GET", source, true);
      request.responseType = "arraybuffer";
      request.onload = () => {
        this.context.decodeAudioData(request.response, (buffer) => {
          this.audio_buffers[source] = buffer;
          n_loaded++;
          callback_load(source);
          if (n_loaded == files.length) {
            callback_complete();
          }
        }, (e) => {
          callback_error({ source, error: e });
        });
      };
      request.onerror = (e) => {
        let err = e;
        if (request.status == 404) {
          err = "404";
        }
        callback_error({ source, error: err });
      };
      request.onloadend = (e) => {
        if (request.status == 404) {
          callback_error({ source, error: "404" });
        }
      };
      request.send();
      this.preload_requests.push(request);
    };
    const load_audio_file_html5audio = (source, count = 1) => {
      const audio = new Audio;
      const handleCanPlayThrough = () => {
        this.audio_buffers[source] = audio;
        n_loaded++;
        callback_load(source);
        if (n_loaded == files.length) {
          callback_complete();
        }
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      };
      audio.addEventListener("canplaythrough", handleCanPlayThrough);
      audio.addEventListener("error", function handleError(e) {
        callback_error({ source: audio.src, error: e });
        audio.removeEventListener("error", handleError);
      });
      audio.addEventListener("abort", function handleAbort(e) {
        callback_error({ source: audio.src, error: e });
        audio.removeEventListener("abort", handleAbort);
      });
      audio.src = source;
      this.preload_requests.push(audio);
    };
    for (const file of files) {
      if (typeof this.audio_buffers[file] !== "undefined") {
        n_loaded++;
        callback_load(file);
        if (n_loaded == files.length) {
          callback_complete();
        }
      } else {
        this.audio_buffers[file] = "tmp";
        if (this.audioContext() !== null) {
          load_audio_file_webaudio(file);
        } else {
          load_audio_file_html5audio(file);
        }
      }
    }
  }
  preloadImages(images, callback_complete = () => {
  }, callback_load = (filepath) => {
  }, callback_error = (error_msg) => {
  }) {
    images = unique(images.flat());
    var n_loaded = 0;
    if (images.length === 0) {
      callback_complete();
      return;
    }
    for (let i = 0;i < images.length; i++) {
      const img = new Image;
      const src = images[i];
      img.onload = () => {
        n_loaded++;
        callback_load(src);
        if (n_loaded === images.length) {
          callback_complete();
        }
      };
      img.onerror = (e) => {
        callback_error({ source: src, error: e });
      };
      img.src = src;
      this.img_cache[src] = img;
      this.preload_requests.push(img);
    }
  }
  preloadVideo(videos, callback_complete = () => {
  }, callback_load = (filepath) => {
  }, callback_error = (error_msg) => {
  }) {
    videos = unique(videos.flat());
    let n_loaded = 0;
    if (videos.length === 0) {
      callback_complete();
      return;
    }
    for (const video of videos) {
      const video_buffers = this.video_buffers;
      const request = new XMLHttpRequest;
      request.open("GET", video, true);
      request.responseType = "blob";
      request.onload = () => {
        if (request.status === 200 || request.status === 0) {
          const videoBlob = request.response;
          video_buffers[video] = URL.createObjectURL(videoBlob);
          n_loaded++;
          callback_load(video);
          if (n_loaded === videos.length) {
            callback_complete();
          }
        }
      };
      request.onerror = (e) => {
        let err = e;
        if (request.status == 404) {
          err = "404";
        }
        callback_error({ source: video, error: err });
      };
      request.onloadend = (e) => {
        if (request.status == 404) {
          callback_error({ source: video, error: "404" });
        }
      };
      request.send();
      this.preload_requests.push(request);
    }
  }
  getAutoPreloadList(timeline_description) {
    const preloadPaths = Object.fromEntries(preloadParameterTypes.map((type) => [type, new Set]));
    const traverseTimeline = (node, inheritedTrialType) => {
      var _a, _b, _c, _d;
      const isTimeline = typeof node.timeline !== "undefined";
      if (isTimeline) {
        for (const childNode of node.timeline) {
          traverseTimeline(childNode, (_a = node.type) !== null && _a !== undefined ? _a : inheritedTrialType);
        }
      } else if ((_c = (_b = node.type) !== null && _b !== undefined ? _b : inheritedTrialType) === null || _c === undefined ? undefined : _c.info) {
        const { name: pluginName, parameters } = ((_d = node.type) !== null && _d !== undefined ? _d : inheritedTrialType).info;
        if (!this.preloadMap.has(pluginName)) {
          this.preloadMap.set(pluginName, Object.fromEntries(Object.entries(parameters).filter(([_name, { type, preload }]) => preloadParameterTypes.includes(type) && (preload !== null && preload !== undefined ? preload : true)).map(([name, { type }]) => [name, type])));
        }
        for (const [parameterName, parameterType] of Object.entries(this.preloadMap.get(pluginName))) {
          const parameterValue = node[parameterName];
          const elements = preloadPaths[parameterType];
          if (typeof parameterValue === "string") {
            elements.add(parameterValue);
          } else if (Array.isArray(parameterValue)) {
            for (const element of parameterValue.flat()) {
              if (typeof element === "string") {
                elements.add(element);
              }
            }
          }
        }
      }
    };
    traverseTimeline({ timeline: timeline_description });
    return {
      images: [...preloadPaths[ParameterType.IMAGE]],
      audio: [...preloadPaths[ParameterType.AUDIO]],
      video: [...preloadPaths[ParameterType.VIDEO]]
    };
  }
  cancelPreloads() {
    for (const request of this.preload_requests) {
      request.onload = () => {
      };
      request.onerror = () => {
      };
      request.oncanplaythrough = () => {
      };
      request.onabort = () => {
      };
    }
    this.preload_requests = [];
  }
  initializeMicrophoneRecorder(stream) {
    const recorder = new MediaRecorder(stream);
    this.microphone_recorder = recorder;
  }
  getMicrophoneRecorder() {
    return this.microphone_recorder;
  }
  initializeCameraRecorder(stream, opts) {
    this.camera_stream = stream;
    const recorder = new MediaRecorder(stream, opts);
    this.camera_recorder = recorder;
  }
  getCameraStream() {
    return this.camera_stream;
  }
  getCameraRecorder() {
    return this.camera_recorder;
  }
}

class SimulationAPI {
  constructor(getDisplayContainerElement, setJsPsychTimeout) {
    this.getDisplayContainerElement = getDisplayContainerElement;
    this.setJsPsychTimeout = setJsPsychTimeout;
  }
  dispatchEvent(event) {
    this.getDisplayContainerElement().dispatchEvent(event);
  }
  keyDown(key) {
    this.dispatchEvent(new KeyboardEvent("keydown", { key }));
  }
  keyUp(key) {
    this.dispatchEvent(new KeyboardEvent("keyup", { key }));
  }
  pressKey(key, delay2 = 0) {
    if (delay2 > 0) {
      this.setJsPsychTimeout(() => {
        this.keyDown(key);
        this.keyUp(key);
      }, delay2);
    } else {
      this.keyDown(key);
      this.keyUp(key);
    }
  }
  clickTarget(target, delay2 = 0) {
    if (delay2 > 0) {
      this.setJsPsychTimeout(() => {
        target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        target.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }, delay2);
    } else {
      target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      target.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  }
  fillTextInput(target, text, delay2 = 0) {
    if (delay2 > 0) {
      this.setJsPsychTimeout(() => {
        target.value = text;
      }, delay2);
    } else {
      target.value = text;
    }
  }
  getValidKey(choices) {
    const possible_keys = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      " "
    ];
    let key;
    if (choices == "NO_KEYS") {
      key = null;
    } else if (choices == "ALL_KEYS") {
      key = possible_keys[Math.floor(Math.random() * possible_keys.length)];
    } else {
      const flat_choices = choices.flat();
      key = flat_choices[Math.floor(Math.random() * flat_choices.length)];
    }
    return key;
  }
  mergeSimulationData(default_data, simulation_options) {
    return Object.assign(Object.assign({}, default_data), simulation_options === null || simulation_options === undefined ? undefined : simulation_options.data);
  }
  ensureSimulationDataConsistency(trial, data) {
    if (data.rt) {
      data.rt = Math.round(data.rt);
    }
    if (trial.trial_duration && data.rt && data.rt > trial.trial_duration) {
      data.rt = null;
      if (data.response) {
        data.response = null;
      }
      if (data.correct) {
        data.correct = false;
      }
    }
    if (trial.choices && trial.choices == "NO_KEYS") {
      if (data.rt) {
        data.rt = null;
      }
      if (data.response) {
        data.response = null;
      }
    }
    if (trial.allow_response_before_complete) {
      if (trial.sequence_reps && trial.frame_time) {
        const min_time = trial.sequence_reps * trial.frame_time * trial.stimuli.length;
        if (data.rt < min_time) {
          data.rt = null;
          data.response = null;
        }
      }
    }
  }
}

class TimeoutAPI {
  constructor() {
    this.timeout_handlers = [];
  }
  setTimeout(callback, delay2) {
    const handle = window.setTimeout(callback, delay2);
    this.timeout_handlers.push(handle);
    return handle;
  }
  clearAllTimeouts() {
    for (const handler of this.timeout_handlers) {
      clearTimeout(handler);
    }
    this.timeout_handlers = [];
  }
}
var wordList = [
  "ability",
  "able",
  "aboard",
  "about",
  "above",
  "accept",
  "accident",
  "according",
  "account",
  "accurate",
  "acres",
  "across",
  "act",
  "action",
  "active",
  "activity",
  "actual",
  "actually",
  "add",
  "addition",
  "additional",
  "adjective",
  "adult",
  "adventure",
  "advice",
  "affect",
  "afraid",
  "after",
  "afternoon",
  "again",
  "against",
  "age",
  "ago",
  "agree",
  "ahead",
  "aid",
  "air",
  "airplane",
  "alike",
  "alive",
  "all",
  "allow",
  "almost",
  "alone",
  "along",
  "aloud",
  "alphabet",
  "already",
  "also",
  "although",
  "am",
  "among",
  "amount",
  "ancient",
  "angle",
  "angry",
  "animal",
  "announced",
  "another",
  "answer",
  "ants",
  "any",
  "anybody",
  "anyone",
  "anything",
  "anyway",
  "anywhere",
  "apart",
  "apartment",
  "appearance",
  "apple",
  "applied",
  "appropriate",
  "are",
  "area",
  "arm",
  "army",
  "around",
  "arrange",
  "arrangement",
  "arrive",
  "arrow",
  "art",
  "article",
  "as",
  "aside",
  "ask",
  "asleep",
  "at",
  "ate",
  "atmosphere",
  "atom",
  "atomic",
  "attached",
  "attack",
  "attempt",
  "attention",
  "audience",
  "author",
  "automobile",
  "available",
  "average",
  "avoid",
  "aware",
  "away",
  "baby",
  "back",
  "bad",
  "badly",
  "bag",
  "balance",
  "ball",
  "balloon",
  "band",
  "bank",
  "bar",
  "bare",
  "bark",
  "barn",
  "base",
  "baseball",
  "basic",
  "basis",
  "basket",
  "bat",
  "battle",
  "be",
  "bean",
  "bear",
  "beat",
  "beautiful",
  "beauty",
  "became",
  "because",
  "become",
  "becoming",
  "bee",
  "been",
  "before",
  "began",
  "beginning",
  "begun",
  "behavior",
  "behind",
  "being",
  "believed",
  "bell",
  "belong",
  "below",
  "belt",
  "bend",
  "beneath",
  "bent",
  "beside",
  "best",
  "bet",
  "better",
  "between",
  "beyond",
  "bicycle",
  "bigger",
  "biggest",
  "bill",
  "birds",
  "birth",
  "birthday",
  "bit",
  "bite",
  "black",
  "blank",
  "blanket",
  "blew",
  "blind",
  "block",
  "blood",
  "blow",
  "blue",
  "board",
  "boat",
  "body",
  "bone",
  "book",
  "border",
  "born",
  "both",
  "bottle",
  "bottom",
  "bound",
  "bow",
  "bowl",
  "box",
  "boy",
  "brain",
  "branch",
  "brass",
  "brave",
  "bread",
  "break",
  "breakfast",
  "breath",
  "breathe",
  "breathing",
  "breeze",
  "brick",
  "bridge",
  "brief",
  "bright",
  "bring",
  "broad",
  "broke",
  "broken",
  "brother",
  "brought",
  "brown",
  "brush",
  "buffalo",
  "build",
  "building",
  "built",
  "buried",
  "burn",
  "burst",
  "bus",
  "bush",
  "business",
  "busy",
  "but",
  "butter",
  "buy",
  "by",
  "cabin",
  "cage",
  "cake",
  "call",
  "calm",
  "came",
  "camera",
  "camp",
  "can",
  "canal",
  "cannot",
  "cap",
  "capital",
  "captain",
  "captured",
  "car",
  "carbon",
  "card",
  "care",
  "careful",
  "carefully",
  "carried",
  "carry",
  "case",
  "cast",
  "castle",
  "cat",
  "catch",
  "cattle",
  "caught",
  "cause",
  "cave",
  "cell",
  "cent",
  "center",
  "central",
  "century",
  "certain",
  "certainly",
  "chain",
  "chair",
  "chamber",
  "chance",
  "change",
  "changing",
  "chapter",
  "character",
  "characteristic",
  "charge",
  "chart",
  "check",
  "cheese",
  "chemical",
  "chest",
  "chicken",
  "chief",
  "child",
  "children",
  "choice",
  "choose",
  "chose",
  "chosen",
  "church",
  "circle",
  "circus",
  "citizen",
  "city",
  "class",
  "classroom",
  "claws",
  "clay",
  "clean",
  "clear",
  "clearly",
  "climate",
  "climb",
  "clock",
  "close",
  "closely",
  "closer",
  "cloth",
  "clothes",
  "clothing",
  "cloud",
  "club",
  "coach",
  "coal",
  "coast",
  "coat",
  "coffee",
  "cold",
  "collect",
  "college",
  "colony",
  "color",
  "column",
  "combination",
  "combine",
  "come",
  "comfortable",
  "coming",
  "command",
  "common",
  "community",
  "company",
  "compare",
  "compass",
  "complete",
  "completely",
  "complex",
  "composed",
  "composition",
  "compound",
  "concerned",
  "condition",
  "congress",
  "connected",
  "consider",
  "consist",
  "consonant",
  "constantly",
  "construction",
  "contain",
  "continent",
  "continued",
  "contrast",
  "control",
  "conversation",
  "cook",
  "cookies",
  "cool",
  "copper",
  "copy",
  "corn",
  "corner",
  "correct",
  "correctly",
  "cost",
  "cotton",
  "could",
  "count",
  "country",
  "couple",
  "courage",
  "course",
  "court",
  "cover",
  "cow",
  "cowboy",
  "crack",
  "cream",
  "create",
  "creature",
  "crew",
  "crop",
  "cross",
  "crowd",
  "cry",
  "cup",
  "curious",
  "current",
  "curve",
  "customs",
  "cut",
  "cutting",
  "daily",
  "damage",
  "dance",
  "danger",
  "dangerous",
  "dark",
  "darkness",
  "date",
  "daughter",
  "dawn",
  "day",
  "dead",
  "deal",
  "dear",
  "death",
  "decide",
  "declared",
  "deep",
  "deeply",
  "deer",
  "definition",
  "degree",
  "depend",
  "depth",
  "describe",
  "desert",
  "design",
  "desk",
  "detail",
  "determine",
  "develop",
  "development",
  "diagram",
  "diameter",
  "did",
  "die",
  "differ",
  "difference",
  "different",
  "difficult",
  "difficulty",
  "dig",
  "dinner",
  "direct",
  "direction",
  "directly",
  "dirt",
  "dirty",
  "disappear",
  "discover",
  "discovery",
  "discuss",
  "discussion",
  "disease",
  "dish",
  "distance",
  "distant",
  "divide",
  "division",
  "do",
  "doctor",
  "does",
  "dog",
  "doing",
  "doll",
  "dollar",
  "done",
  "donkey",
  "door",
  "dot",
  "double",
  "doubt",
  "down",
  "dozen",
  "draw",
  "drawn",
  "dream",
  "dress",
  "drew",
  "dried",
  "drink",
  "drive",
  "driven",
  "driver",
  "driving",
  "drop",
  "dropped",
  "drove",
  "dry",
  "duck",
  "due",
  "dug",
  "dull",
  "during",
  "dust",
  "duty",
  "each",
  "eager",
  "ear",
  "earlier",
  "early",
  "earn",
  "earth",
  "easier",
  "easily",
  "east",
  "easy",
  "eat",
  "eaten",
  "edge",
  "education",
  "effect",
  "effort",
  "egg",
  "eight",
  "either",
  "electric",
  "electricity",
  "element",
  "elephant",
  "eleven",
  "else",
  "empty",
  "end",
  "enemy",
  "energy",
  "engine",
  "engineer",
  "enjoy",
  "enough",
  "enter",
  "entire",
  "entirely",
  "environment",
  "equal",
  "equally",
  "equator",
  "equipment",
  "escape",
  "especially",
  "essential",
  "establish",
  "even",
  "evening",
  "event",
  "eventually",
  "ever",
  "every",
  "everybody",
  "everyone",
  "everything",
  "everywhere",
  "evidence",
  "exact",
  "exactly",
  "examine",
  "example",
  "excellent",
  "except",
  "exchange",
  "excited",
  "excitement",
  "exciting",
  "exclaimed",
  "exercise",
  "exist",
  "expect",
  "experience",
  "experiment",
  "explain",
  "explanation",
  "explore",
  "express",
  "expression",
  "extra",
  "eye",
  "face",
  "facing",
  "fact",
  "factor",
  "factory",
  "failed",
  "fair",
  "fairly",
  "fall",
  "fallen",
  "familiar",
  "family",
  "famous",
  "far",
  "farm",
  "farmer",
  "farther",
  "fast",
  "fastened",
  "faster",
  "fat",
  "father",
  "favorite",
  "fear",
  "feathers",
  "feature",
  "fed",
  "feed",
  "feel",
  "feet",
  "fell",
  "fellow",
  "felt",
  "fence",
  "few",
  "fewer",
  "field",
  "fierce",
  "fifteen",
  "fifth",
  "fifty",
  "fight",
  "fighting",
  "figure",
  "fill",
  "film",
  "final",
  "finally",
  "find",
  "fine",
  "finest",
  "finger",
  "finish",
  "fire",
  "fireplace",
  "firm",
  "first",
  "fish",
  "five",
  "fix",
  "flag",
  "flame",
  "flat",
  "flew",
  "flies",
  "flight",
  "floating",
  "floor",
  "flow",
  "flower",
  "fly",
  "fog",
  "folks",
  "follow",
  "food",
  "foot",
  "football",
  "for",
  "force",
  "foreign",
  "forest",
  "forget",
  "forgot",
  "forgotten",
  "form",
  "former",
  "fort",
  "forth",
  "forty",
  "forward",
  "fought",
  "found",
  "four",
  "fourth",
  "fox",
  "frame",
  "free",
  "freedom",
  "frequently",
  "fresh",
  "friend",
  "friendly",
  "frighten",
  "frog",
  "from",
  "front",
  "frozen",
  "fruit",
  "fuel",
  "full",
  "fully",
  "fun",
  "function",
  "funny",
  "fur",
  "furniture",
  "further",
  "future",
  "gain",
  "game",
  "garage",
  "garden",
  "gas",
  "gasoline",
  "gate",
  "gather",
  "gave",
  "general",
  "generally",
  "gentle",
  "gently",
  "get",
  "getting",
  "giant",
  "gift",
  "girl",
  "give",
  "given",
  "giving",
  "glad",
  "glass",
  "globe",
  "go",
  "goes",
  "gold",
  "golden",
  "gone",
  "good",
  "goose",
  "got",
  "government",
  "grabbed",
  "grade",
  "gradually",
  "grain",
  "grandfather",
  "grandmother",
  "graph",
  "grass",
  "gravity",
  "gray",
  "great",
  "greater",
  "greatest",
  "greatly",
  "green",
  "grew",
  "ground",
  "group",
  "grow",
  "grown",
  "growth",
  "guard",
  "guess",
  "guide",
  "gulf",
  "gun",
  "habit",
  "had",
  "hair",
  "half",
  "halfway",
  "hall",
  "hand",
  "handle",
  "handsome",
  "hang",
  "happen",
  "happened",
  "happily",
  "happy",
  "harbor",
  "hard",
  "harder",
  "hardly",
  "has",
  "hat",
  "have",
  "having",
  "hay",
  "he",
  "headed",
  "heading",
  "health",
  "heard",
  "hearing",
  "heart",
  "heat",
  "heavy",
  "height",
  "held",
  "hello",
  "help",
  "helpful",
  "her",
  "herd",
  "here",
  "herself",
  "hidden",
  "hide",
  "high",
  "higher",
  "highest",
  "highway",
  "hill",
  "him",
  "himself",
  "his",
  "history",
  "hit",
  "hold",
  "hole",
  "hollow",
  "home",
  "honor",
  "hope",
  "horn",
  "horse",
  "hospital",
  "hot",
  "hour",
  "house",
  "how",
  "however",
  "huge",
  "human",
  "hundred",
  "hung",
  "hungry",
  "hunt",
  "hunter",
  "hurried",
  "hurry",
  "hurt",
  "husband",
  "ice",
  "idea",
  "identity",
  "if",
  "ill",
  "image",
  "imagine",
  "immediately",
  "importance",
  "important",
  "impossible",
  "improve",
  "in",
  "inch",
  "include",
  "including",
  "income",
  "increase",
  "indeed",
  "independent",
  "indicate",
  "individual",
  "industrial",
  "industry",
  "influence",
  "information",
  "inside",
  "instance",
  "instant",
  "instead",
  "instrument",
  "interest",
  "interior",
  "into",
  "introduced",
  "invented",
  "involved",
  "iron",
  "is",
  "island",
  "it",
  "its",
  "itself",
  "jack",
  "jar",
  "jet",
  "job",
  "join",
  "joined",
  "journey",
  "joy",
  "judge",
  "jump",
  "jungle",
  "just",
  "keep",
  "kept",
  "key",
  "kids",
  "kill",
  "kind",
  "kitchen",
  "knew",
  "knife",
  "know",
  "knowledge",
  "known",
  "label",
  "labor",
  "lack",
  "lady",
  "laid",
  "lake",
  "lamp",
  "land",
  "language",
  "large",
  "larger",
  "largest",
  "last",
  "late",
  "later",
  "laugh",
  "law",
  "lay",
  "layers",
  "lead",
  "leader",
  "leaf",
  "learn",
  "least",
  "leather",
  "leave",
  "leaving",
  "led",
  "left",
  "leg",
  "length",
  "lesson",
  "let",
  "letter",
  "level",
  "library",
  "lie",
  "life",
  "lift",
  "light",
  "like",
  "likely",
  "limited",
  "line",
  "lion",
  "lips",
  "liquid",
  "list",
  "listen",
  "little",
  "live",
  "living",
  "load",
  "local",
  "locate",
  "location",
  "log",
  "lonely",
  "long",
  "longer",
  "look",
  "loose",
  "lose",
  "loss",
  "lost",
  "lot",
  "loud",
  "love",
  "lovely",
  "low",
  "lower",
  "luck",
  "lucky",
  "lunch",
  "lungs",
  "lying",
  "machine",
  "machinery",
  "mad",
  "made",
  "magic",
  "magnet",
  "mail",
  "main",
  "mainly",
  "major",
  "make",
  "making",
  "man",
  "managed",
  "manner",
  "manufacturing",
  "many",
  "map",
  "mark",
  "market",
  "married",
  "mass",
  "massage",
  "master",
  "material",
  "mathematics",
  "matter",
  "may",
  "maybe",
  "me",
  "meal",
  "mean",
  "means",
  "meant",
  "measure",
  "meat",
  "medicine",
  "meet",
  "melted",
  "member",
  "memory",
  "men",
  "mental",
  "merely",
  "met",
  "metal",
  "method",
  "mice",
  "middle",
  "might",
  "mighty",
  "mile",
  "military",
  "milk",
  "mill",
  "mind",
  "mine",
  "minerals",
  "minute",
  "mirror",
  "missing",
  "mission",
  "mistake",
  "mix",
  "mixture",
  "model",
  "modern",
  "molecular",
  "moment",
  "money",
  "monkey",
  "month",
  "mood",
  "moon",
  "more",
  "morning",
  "most",
  "mostly",
  "mother",
  "motion",
  "motor",
  "mountain",
  "mouse",
  "mouth",
  "move",
  "movement",
  "movie",
  "moving",
  "mud",
  "muscle",
  "music",
  "musical",
  "must",
  "my",
  "myself",
  "mysterious",
  "nails",
  "name",
  "nation",
  "national",
  "native",
  "natural",
  "naturally",
  "nature",
  "near",
  "nearby",
  "nearer",
  "nearest",
  "nearly",
  "necessary",
  "neck",
  "needed",
  "needle",
  "needs",
  "negative",
  "neighbor",
  "neighborhood",
  "nervous",
  "nest",
  "never",
  "new",
  "news",
  "newspaper",
  "next",
  "nice",
  "night",
  "nine",
  "no",
  "nobody",
  "nodded",
  "noise",
  "none",
  "noon",
  "nor",
  "north",
  "nose",
  "not",
  "note",
  "noted",
  "nothing",
  "notice",
  "noun",
  "now",
  "number",
  "numeral",
  "nuts",
  "object",
  "observe",
  "obtain",
  "occasionally",
  "occur",
  "ocean",
  "of",
  "off",
  "offer",
  "office",
  "officer",
  "official",
  "oil",
  "old",
  "older",
  "oldest",
  "on",
  "once",
  "one",
  "only",
  "onto",
  "open",
  "operation",
  "opinion",
  "opportunity",
  "opposite",
  "or",
  "orange",
  "orbit",
  "order",
  "ordinary",
  "organization",
  "organized",
  "origin",
  "original",
  "other",
  "ought",
  "our",
  "ourselves",
  "out",
  "outer",
  "outline",
  "outside",
  "over",
  "own",
  "owner",
  "oxygen",
  "pack",
  "package",
  "page",
  "paid",
  "pain",
  "paint",
  "pair",
  "palace",
  "pale",
  "pan",
  "paper",
  "paragraph",
  "parallel",
  "parent",
  "park",
  "part",
  "particles",
  "particular",
  "particularly",
  "partly",
  "parts",
  "party",
  "pass",
  "passage",
  "past",
  "path",
  "pattern",
  "pay",
  "peace",
  "pen",
  "pencil",
  "people",
  "per",
  "percent",
  "perfect",
  "perfectly",
  "perhaps",
  "period",
  "person",
  "personal",
  "pet",
  "phrase",
  "physical",
  "piano",
  "pick",
  "picture",
  "pictured",
  "pie",
  "piece",
  "pig",
  "pile",
  "pilot",
  "pine",
  "pink",
  "pipe",
  "pitch",
  "place",
  "plain",
  "plan",
  "plane",
  "planet",
  "planned",
  "planning",
  "plant",
  "plastic",
  "plate",
  "plates",
  "play",
  "pleasant",
  "please",
  "pleasure",
  "plenty",
  "plural",
  "plus",
  "pocket",
  "poem",
  "poet",
  "poetry",
  "point",
  "pole",
  "police",
  "policeman",
  "political",
  "pond",
  "pony",
  "pool",
  "poor",
  "popular",
  "population",
  "porch",
  "port",
  "position",
  "positive",
  "possible",
  "possibly",
  "post",
  "pot",
  "potatoes",
  "pound",
  "pour",
  "powder",
  "power",
  "powerful",
  "practical",
  "practice",
  "prepare",
  "present",
  "president",
  "press",
  "pressure",
  "pretty",
  "prevent",
  "previous",
  "price",
  "pride",
  "primitive",
  "principal",
  "principle",
  "printed",
  "private",
  "prize",
  "probably",
  "problem",
  "process",
  "produce",
  "product",
  "production",
  "program",
  "progress",
  "promised",
  "proper",
  "properly",
  "property",
  "protection",
  "proud",
  "prove",
  "provide",
  "public",
  "pull",
  "pupil",
  "pure",
  "purple",
  "purpose",
  "push",
  "put",
  "putting",
  "quarter",
  "queen",
  "question",
  "quick",
  "quickly",
  "quiet",
  "quietly",
  "quite",
  "rabbit",
  "race",
  "radio",
  "railroad",
  "rain",
  "raise",
  "ran",
  "ranch",
  "range",
  "rapidly",
  "rate",
  "rather",
  "raw",
  "rays",
  "reach",
  "read",
  "reader",
  "ready",
  "real",
  "realize",
  "rear",
  "reason",
  "recall",
  "receive",
  "recent",
  "recently",
  "recognize",
  "record",
  "red",
  "refer",
  "refused",
  "region",
  "regular",
  "related",
  "relationship",
  "religious",
  "remain",
  "remarkable",
  "remember",
  "remove",
  "repeat",
  "replace",
  "replied",
  "report",
  "represent",
  "require",
  "research",
  "respect",
  "rest",
  "result",
  "return",
  "review",
  "rhyme",
  "rhythm",
  "rice",
  "rich",
  "ride",
  "riding",
  "right",
  "ring",
  "rise",
  "rising",
  "river",
  "road",
  "roar",
  "rock",
  "rocket",
  "rocky",
  "rod",
  "roll",
  "roof",
  "room",
  "root",
  "rope",
  "rose",
  "rough",
  "round",
  "route",
  "row",
  "rubbed",
  "rubber",
  "rule",
  "ruler",
  "run",
  "running",
  "rush",
  "sad",
  "saddle",
  "safe",
  "safety",
  "said",
  "sail",
  "sale",
  "salmon",
  "salt",
  "same",
  "sand",
  "sang",
  "sat",
  "satellites",
  "satisfied",
  "save",
  "saved",
  "saw",
  "say",
  "scale",
  "scared",
  "scene",
  "school",
  "science",
  "scientific",
  "scientist",
  "score",
  "screen",
  "sea",
  "search",
  "season",
  "seat",
  "second",
  "secret",
  "section",
  "see",
  "seed",
  "seeing",
  "seems",
  "seen",
  "seldom",
  "select",
  "selection",
  "sell",
  "send",
  "sense",
  "sent",
  "sentence",
  "separate",
  "series",
  "serious",
  "serve",
  "service",
  "sets",
  "setting",
  "settle",
  "settlers",
  "seven",
  "several",
  "shade",
  "shadow",
  "shake",
  "shaking",
  "shall",
  "shallow",
  "shape",
  "share",
  "sharp",
  "she",
  "sheep",
  "sheet",
  "shelf",
  "shells",
  "shelter",
  "shine",
  "shinning",
  "ship",
  "shirt",
  "shoe",
  "shoot",
  "shop",
  "shore",
  "short",
  "shorter",
  "shot",
  "should",
  "shoulder",
  "shout",
  "show",
  "shown",
  "shut",
  "sick",
  "sides",
  "sight",
  "sign",
  "signal",
  "silence",
  "silent",
  "silk",
  "silly",
  "silver",
  "similar",
  "simple",
  "simplest",
  "simply",
  "since",
  "sing",
  "single",
  "sink",
  "sister",
  "sit",
  "sitting",
  "situation",
  "six",
  "size",
  "skill",
  "skin",
  "sky",
  "slabs",
  "slave",
  "sleep",
  "slept",
  "slide",
  "slight",
  "slightly",
  "slip",
  "slipped",
  "slope",
  "slow",
  "slowly",
  "small",
  "smaller",
  "smallest",
  "smell",
  "smile",
  "smoke",
  "smooth",
  "snake",
  "snow",
  "so",
  "soap",
  "social",
  "society",
  "soft",
  "softly",
  "soil",
  "solar",
  "sold",
  "soldier",
  "solid",
  "solution",
  "solve",
  "some",
  "somebody",
  "somehow",
  "someone",
  "something",
  "sometime",
  "somewhere",
  "son",
  "song",
  "soon",
  "sort",
  "sound",
  "source",
  "south",
  "southern",
  "space",
  "speak",
  "special",
  "species",
  "specific",
  "speech",
  "speed",
  "spell",
  "spend",
  "spent",
  "spider",
  "spin",
  "spirit",
  "spite",
  "split",
  "spoken",
  "sport",
  "spread",
  "spring",
  "square",
  "stage",
  "stairs",
  "stand",
  "standard",
  "star",
  "stared",
  "start",
  "state",
  "statement",
  "station",
  "stay",
  "steady",
  "steam",
  "steel",
  "steep",
  "stems",
  "step",
  "stepped",
  "stick",
  "stiff",
  "still",
  "stock",
  "stomach",
  "stone",
  "stood",
  "stop",
  "stopped",
  "store",
  "storm",
  "story",
  "stove",
  "straight",
  "strange",
  "stranger",
  "straw",
  "stream",
  "street",
  "strength",
  "stretch",
  "strike",
  "string",
  "strip",
  "strong",
  "stronger",
  "struck",
  "structure",
  "struggle",
  "stuck",
  "student",
  "studied",
  "studying",
  "subject",
  "substance",
  "success",
  "successful",
  "such",
  "sudden",
  "suddenly",
  "sugar",
  "suggest",
  "suit",
  "sum",
  "summer",
  "sun",
  "sunlight",
  "supper",
  "supply",
  "support",
  "suppose",
  "sure",
  "surface",
  "surprise",
  "surrounded",
  "swam",
  "sweet",
  "swept",
  "swim",
  "swimming",
  "swing",
  "swung",
  "syllable",
  "symbol",
  "system",
  "table",
  "tail",
  "take",
  "taken",
  "tales",
  "talk",
  "tall",
  "tank",
  "tape",
  "task",
  "taste",
  "taught",
  "tax",
  "tea",
  "teach",
  "teacher",
  "team",
  "tears",
  "teeth",
  "telephone",
  "television",
  "tell",
  "temperature",
  "ten",
  "tent",
  "term",
  "terrible",
  "test",
  "than",
  "thank",
  "that",
  "thee",
  "them",
  "themselves",
  "then",
  "theory",
  "there",
  "therefore",
  "these",
  "they",
  "thick",
  "thin",
  "thing",
  "think",
  "third",
  "thirty",
  "this",
  "those",
  "thou",
  "though",
  "thought",
  "thousand",
  "thread",
  "three",
  "threw",
  "throat",
  "through",
  "throughout",
  "throw",
  "thrown",
  "thumb",
  "thus",
  "thy",
  "tide",
  "tie",
  "tight",
  "tightly",
  "till",
  "time",
  "tin",
  "tiny",
  "tip",
  "tired",
  "title",
  "to",
  "tobacco",
  "today",
  "together",
  "told",
  "tomorrow",
  "tone",
  "tongue",
  "tonight",
  "too",
  "took",
  "tool",
  "top",
  "topic",
  "torn",
  "total",
  "touch",
  "toward",
  "tower",
  "town",
  "toy",
  "trace",
  "track",
  "trade",
  "traffic",
  "trail",
  "train",
  "transportation",
  "trap",
  "travel",
  "treated",
  "tree",
  "triangle",
  "tribe",
  "trick",
  "tried",
  "trip",
  "troops",
  "tropical",
  "trouble",
  "truck",
  "trunk",
  "truth",
  "try",
  "tube",
  "tune",
  "turn",
  "twelve",
  "twenty",
  "twice",
  "two",
  "type",
  "typical",
  "uncle",
  "under",
  "underline",
  "understanding",
  "unhappy",
  "union",
  "unit",
  "universe",
  "unknown",
  "unless",
  "until",
  "unusual",
  "up",
  "upon",
  "upper",
  "upward",
  "us",
  "use",
  "useful",
  "using",
  "usual",
  "usually",
  "valley",
  "valuable",
  "value",
  "vapor",
  "variety",
  "various",
  "vast",
  "vegetable",
  "verb",
  "vertical",
  "very",
  "vessels",
  "victory",
  "view",
  "village",
  "visit",
  "visitor",
  "voice",
  "volume",
  "vote",
  "vowel",
  "voyage",
  "wagon",
  "wait",
  "walk",
  "wall",
  "want",
  "war",
  "warm",
  "warn",
  "was",
  "wash",
  "waste",
  "watch",
  "water",
  "wave",
  "way",
  "we",
  "weak",
  "wealth",
  "wear",
  "weather",
  "week",
  "weigh",
  "weight",
  "welcome",
  "well",
  "went",
  "were",
  "west",
  "western",
  "wet",
  "whale",
  "what",
  "whatever",
  "wheat",
  "wheel",
  "when",
  "whenever",
  "where",
  "wherever",
  "whether",
  "which",
  "while",
  "whispered",
  "whistle",
  "white",
  "who",
  "whole",
  "whom",
  "whose",
  "why",
  "wide",
  "widely",
  "wife",
  "wild",
  "will",
  "willing",
  "win",
  "wind",
  "window",
  "wing",
  "winter",
  "wire",
  "wise",
  "wish",
  "with",
  "within",
  "without",
  "wolf",
  "women",
  "won",
  "wonder",
  "wonderful",
  "wood",
  "wooden",
  "wool",
  "word",
  "wore",
  "work",
  "worker",
  "world",
  "worried",
  "worry",
  "worse",
  "worth",
  "would",
  "wrapped",
  "write",
  "writer",
  "writing",
  "written",
  "wrong",
  "wrote",
  "yard",
  "year",
  "yellow",
  "yes",
  "yesterday",
  "yet",
  "you",
  "young",
  "younger",
  "your",
  "yourself",
  "youth",
  "zero",
  "zebra",
  "zipper",
  "zoo",
  "zulu"
];
var randomWords$1 = words;
words.wordList = wordList;
var alea = { exports: {} };
(function(module) {
  (function(global2, module2, define) {
    function Alea(seed) {
      var me = this, mash = Mash();
      me.next = function() {
        var t = 2091639 * me.s0 + me.c * 0.00000000023283064365386964;
        me.s0 = me.s1;
        me.s1 = me.s2;
        return me.s2 = t - (me.c = t | 0);
      };
      me.c = 1;
      me.s0 = mash(" ");
      me.s1 = mash(" ");
      me.s2 = mash(" ");
      me.s0 -= mash(seed);
      if (me.s0 < 0) {
        me.s0 += 1;
      }
      me.s1 -= mash(seed);
      if (me.s1 < 0) {
        me.s1 += 1;
      }
      me.s2 -= mash(seed);
      if (me.s2 < 0) {
        me.s2 += 1;
      }
      mash = null;
    }
    function copy(f, t) {
      t.c = f.c;
      t.s0 = f.s0;
      t.s1 = f.s1;
      t.s2 = f.s2;
      return t;
    }
    function impl(seed, opts) {
      var xg = new Alea(seed), state = opts && opts.state, prng = xg.next;
      prng.int32 = function() {
        return xg.next() * 4294967296 | 0;
      };
      prng.double = function() {
        return prng() + (prng() * 2097152 | 0) * 0.00000000000000011102230246251566;
      };
      prng.quick = prng;
      if (state) {
        if (typeof state == "object")
          copy(state, xg);
        prng.state = function() {
          return copy(xg, {});
        };
      }
      return prng;
    }
    function Mash() {
      var n = 4022871197;
      var mash = function(data) {
        data = String(data);
        for (var i = 0;i < data.length; i++) {
          n += data.charCodeAt(i);
          var h = 0.02519603282416938 * n;
          n = h >>> 0;
          h -= n;
          h *= n;
          n = h >>> 0;
          h -= n;
          n += h * 4294967296;
        }
        return (n >>> 0) * 0.00000000023283064365386964;
      };
      return mash;
    }
    if (module2 && module2.exports) {
      module2.exports = impl;
    } else if (define && define.amd) {
      define(function() {
        return impl;
      });
    } else {
      this.alea = impl;
    }
  })(commonjsGlobal, module, false);
})(alea);
var seedrandom = alea.exports;
var randomization = Object.freeze({
  __proto__: null,
  setSeed,
  repeat,
  shuffle,
  shuffleNoRepeats,
  shuffleAlternateGroups,
  sampleWithoutReplacement,
  sampleWithReplacement,
  factorial,
  randomID,
  randomInt,
  sampleBernoulli,
  sampleNormal,
  sampleExponential,
  sampleExGaussian,
  randomWords
});
var turk = Object.freeze({
  __proto__: null,
  turkInfo,
  submitToTurk
});

class TimelineNode {
  constructor(jsPsych, parameters, parent, relativeID) {
    this.jsPsych = jsPsych;
    this.progress = {
      current_location: -1,
      current_variable_set: 0,
      current_repetition: 0,
      current_iteration: 0,
      done: false
    };
    this.parent_node = parent;
    this.relative_id = typeof parent === "undefined" ? 0 : relativeID;
    if (typeof parameters.timeline !== "undefined") {
      this.timeline_parameters = {
        timeline: [],
        loop_function: parameters.loop_function,
        conditional_function: parameters.conditional_function,
        sample: parameters.sample,
        randomize_order: typeof parameters.randomize_order == "undefined" ? false : parameters.randomize_order,
        repetitions: typeof parameters.repetitions == "undefined" ? 1 : parameters.repetitions,
        timeline_variables: typeof parameters.timeline_variables == "undefined" ? [{}] : parameters.timeline_variables,
        on_timeline_finish: parameters.on_timeline_finish,
        on_timeline_start: parameters.on_timeline_start
      };
      this.setTimelineVariablesOrder();
      var node_data = Object.assign({}, parameters);
      delete node_data.timeline;
      delete node_data.conditional_function;
      delete node_data.loop_function;
      delete node_data.randomize_order;
      delete node_data.repetitions;
      delete node_data.timeline_variables;
      delete node_data.sample;
      delete node_data.on_timeline_start;
      delete node_data.on_timeline_finish;
      this.node_trial_data = node_data;
      for (var i = 0;i < parameters.timeline.length; i++) {
        var merged_parameters = Object.assign({}, node_data, parameters.timeline[i]);
        if (typeof node_data.data == "object" && typeof parameters.timeline[i].data == "object") {
          var merged_data = Object.assign({}, node_data.data, parameters.timeline[i].data);
          merged_parameters.data = merged_data;
        }
        this.timeline_parameters.timeline.push(new TimelineNode(this.jsPsych, merged_parameters, this, i));
      }
    } else {
      if (typeof parameters.type === "undefined") {
        console.error('Trial level node is missing the "type" parameter. The parameters for the node are: ' + JSON.stringify(parameters));
      }
      this.trial_parameters = Object.assign({}, parameters);
    }
  }
  trial() {
    if (typeof this.timeline_parameters == "undefined") {
      return deepCopy(this.trial_parameters);
    } else {
      if (this.progress.current_location >= this.timeline_parameters.timeline.length) {
        return null;
      } else {
        return this.timeline_parameters.timeline[this.progress.current_location].trial();
      }
    }
  }
  markCurrentTrialComplete() {
    if (typeof this.timeline_parameters === "undefined") {
      this.progress.done = true;
    } else {
      this.timeline_parameters.timeline[this.progress.current_location].markCurrentTrialComplete();
    }
  }
  nextRepetiton() {
    this.setTimelineVariablesOrder();
    this.progress.current_location = -1;
    this.progress.current_variable_set = 0;
    this.progress.current_repetition++;
    for (var i = 0;i < this.timeline_parameters.timeline.length; i++) {
      this.timeline_parameters.timeline[i].reset();
    }
  }
  setTimelineVariablesOrder() {
    const timeline_parameters = this.timeline_parameters;
    if (typeof timeline_parameters === "undefined" || typeof timeline_parameters.timeline_variables === "undefined") {
      return;
    }
    var order = [];
    for (var i = 0;i < timeline_parameters.timeline_variables.length; i++) {
      order.push(i);
    }
    if (typeof timeline_parameters.sample !== "undefined") {
      if (timeline_parameters.sample.type == "custom") {
        order = timeline_parameters.sample.fn(order);
      } else if (timeline_parameters.sample.type == "with-replacement") {
        order = sampleWithReplacement(order, timeline_parameters.sample.size, timeline_parameters.sample.weights);
      } else if (timeline_parameters.sample.type == "without-replacement") {
        order = sampleWithoutReplacement(order, timeline_parameters.sample.size);
      } else if (timeline_parameters.sample.type == "fixed-repetitions") {
        order = repeat(order, timeline_parameters.sample.size, false);
      } else if (timeline_parameters.sample.type == "alternate-groups") {
        order = shuffleAlternateGroups(timeline_parameters.sample.groups, timeline_parameters.sample.randomize_group_order);
      } else {
        console.error('Invalid type in timeline sample parameters. Valid options for type are "custom", "with-replacement", "without-replacement", "fixed-repetitions", and "alternate-groups"');
      }
    }
    if (timeline_parameters.randomize_order) {
      order = shuffle(order);
    }
    this.progress.order = order;
  }
  nextSet() {
    this.progress.current_location = -1;
    this.progress.current_variable_set++;
    for (var i = 0;i < this.timeline_parameters.timeline.length; i++) {
      this.timeline_parameters.timeline[i].reset();
    }
  }
  advance() {
    const progress = this.progress;
    const timeline_parameters = this.timeline_parameters;
    const internal = this.jsPsych.internal;
    if (progress.done) {
      return true;
    }
    if (progress.current_location == -1) {
      if (typeof timeline_parameters !== "undefined") {
        if (typeof timeline_parameters.conditional_function !== "undefined" && progress.current_repetition == 0 && progress.current_variable_set == 0) {
          internal.call_immediate = true;
          var conditional_result = timeline_parameters.conditional_function();
          internal.call_immediate = false;
          if (conditional_result == false) {
            progress.done = true;
            return true;
          }
        }
        if (typeof timeline_parameters.on_timeline_start !== "undefined" && progress.current_variable_set == 0) {
          timeline_parameters.on_timeline_start();
        }
      }
      progress.current_location = 0;
      return this.advance();
    }
    if (typeof timeline_parameters !== "undefined") {
      var have_node_to_run = false;
      while (progress.current_location < timeline_parameters.timeline.length && have_node_to_run == false) {
        var target_complete = timeline_parameters.timeline[progress.current_location].advance();
        if (!target_complete) {
          have_node_to_run = true;
          return false;
        } else {
          progress.current_location++;
        }
      }
      if (progress.current_variable_set < progress.order.length - 1) {
        this.nextSet();
        return this.advance();
      } else if (progress.current_repetition < timeline_parameters.repetitions - 1) {
        this.nextRepetiton();
        if (typeof timeline_parameters.on_timeline_finish !== "undefined") {
          timeline_parameters.on_timeline_finish();
        }
        return this.advance();
      } else {
        if (typeof timeline_parameters.on_timeline_finish !== "undefined") {
          timeline_parameters.on_timeline_finish();
        }
        if (typeof timeline_parameters.loop_function !== "undefined") {
          internal.call_immediate = true;
          if (timeline_parameters.loop_function(this.generatedData())) {
            this.reset();
            internal.call_immediate = false;
            return this.parent_node.advance();
          } else {
            progress.done = true;
            internal.call_immediate = false;
            return true;
          }
        }
      }
      progress.done = true;
      return true;
    }
  }
  isComplete() {
    return this.progress.done;
  }
  getTimelineVariableValue(variable_name) {
    if (typeof this.timeline_parameters == "undefined") {
      return;
    }
    var v = this.timeline_parameters.timeline_variables[this.progress.order[this.progress.current_variable_set]][variable_name];
    return v;
  }
  findTimelineVariable(variable_name) {
    var v = this.getTimelineVariableValue(variable_name);
    if (typeof v == "undefined") {
      if (typeof this.parent_node !== "undefined") {
        return this.parent_node.findTimelineVariable(variable_name);
      } else {
        return;
      }
    } else {
      return v;
    }
  }
  timelineVariable(variable_name) {
    if (typeof this.timeline_parameters == "undefined") {
      const val = this.findTimelineVariable(variable_name);
      if (typeof val === "undefined") {
        console.warn("Timeline variable " + variable_name + " not found.");
      }
      return val;
    } else {
      var loc = Math.max(0, this.progress.current_location);
      if (loc == this.timeline_parameters.timeline.length) {
        loc = loc - 1;
      }
      const val = this.timeline_parameters.timeline[loc].timelineVariable(variable_name);
      if (typeof val === "undefined") {
        console.warn("Timeline variable " + variable_name + " not found.");
      }
      return val;
    }
  }
  allTimelineVariables() {
    var all_tvs = this.allTimelineVariablesNames();
    var all_tvs_vals = {};
    for (var i = 0;i < all_tvs.length; i++) {
      all_tvs_vals[all_tvs[i]] = this.timelineVariable(all_tvs[i]);
    }
    return all_tvs_vals;
  }
  allTimelineVariablesNames(so_far = []) {
    if (typeof this.timeline_parameters !== "undefined") {
      so_far = so_far.concat(Object.keys(this.timeline_parameters.timeline_variables[this.progress.order[this.progress.current_variable_set]]));
      var loc = Math.max(0, this.progress.current_location);
      if (loc == this.timeline_parameters.timeline.length) {
        loc = loc - 1;
      }
      return this.timeline_parameters.timeline[loc].allTimelineVariablesNames(so_far);
    }
    if (typeof this.timeline_parameters == "undefined") {
      return so_far;
    }
  }
  length() {
    var length = 0;
    if (typeof this.timeline_parameters !== "undefined") {
      for (var i = 0;i < this.timeline_parameters.timeline.length; i++) {
        length += this.timeline_parameters.timeline[i].length();
      }
    } else {
      return 1;
    }
    return length;
  }
  percentComplete() {
    var total_trials = this.length();
    var completed_trials = 0;
    for (var i = 0;i < this.timeline_parameters.timeline.length; i++) {
      if (this.timeline_parameters.timeline[i].isComplete()) {
        completed_trials += this.timeline_parameters.timeline[i].length();
      }
    }
    return completed_trials / total_trials * 100;
  }
  reset() {
    this.progress.current_location = -1;
    this.progress.current_repetition = 0;
    this.progress.current_variable_set = 0;
    this.progress.current_iteration++;
    this.progress.done = false;
    this.setTimelineVariablesOrder();
    if (typeof this.timeline_parameters != "undefined") {
      for (var i = 0;i < this.timeline_parameters.timeline.length; i++) {
        this.timeline_parameters.timeline[i].reset();
      }
    }
  }
  end() {
    this.progress.done = true;
  }
  endActiveNode() {
    if (typeof this.timeline_parameters == "undefined") {
      this.end();
      this.parent_node.end();
    } else {
      this.timeline_parameters.timeline[this.progress.current_location].endActiveNode();
    }
  }
  ID() {
    var id = "";
    if (typeof this.parent_node == "undefined") {
      return "0." + this.progress.current_iteration;
    } else {
      id += this.parent_node.ID() + "-";
      id += this.relative_id + "." + this.progress.current_iteration;
      return id;
    }
  }
  activeID() {
    if (typeof this.timeline_parameters == "undefined") {
      return this.ID();
    } else {
      return this.timeline_parameters.timeline[this.progress.current_location].activeID();
    }
  }
  generatedData() {
    return this.jsPsych.data.getDataByTimelineNode(this.ID());
  }
  trialsOfType(type) {
    if (typeof this.timeline_parameters == "undefined") {
      if (this.trial_parameters.type == type) {
        return this.trial_parameters;
      } else {
        return [];
      }
    } else {
      var trials = [];
      for (var i = 0;i < this.timeline_parameters.timeline.length; i++) {
        var t = this.timeline_parameters.timeline[i].trialsOfType(type);
        trials = trials.concat(t);
      }
      return trials;
    }
  }
  insert(parameters) {
    if (typeof this.timeline_parameters === "undefined") {
      console.error("Cannot add new trials to a trial-level node.");
    } else {
      this.timeline_parameters.timeline.push(new TimelineNode(this.jsPsych, Object.assign(Object.assign({}, this.node_trial_data), parameters), this, this.timeline_parameters.timeline.length));
    }
  }
}

class JsPsych {
  constructor(options) {
    this.extensions = {};
    this.turk = turk;
    this.randomization = randomization;
    this.utils = utils;
    this.opts = {};
    this.global_trial_index = 0;
    this.current_trial = {};
    this.current_trial_finished = false;
    this.paused = false;
    this.waiting = false;
    this.file_protocol = false;
    this.simulation_mode = null;
    this.webaudio_context = null;
    this.internal = {
      call_immediate: false
    };
    this.progress_bar_amount = 0;
    options = Object.assign({ display_element: undefined, on_finish: () => {
    }, on_trial_start: () => {
    }, on_trial_finish: () => {
    }, on_data_update: () => {
    }, on_interaction_data_update: () => {
    }, on_close: () => {
    }, use_webaudio: true, exclusions: {}, show_progress_bar: false, message_progress_bar: "Completion Progress", auto_update_progress_bar: true, default_iti: 0, minimum_valid_rt: 0, experiment_width: null, override_safe_mode: false, case_sensitive_responses: false, extensions: [] }, options);
    this.opts = options;
    autoBind(this);
    this.webaudio_context = typeof window !== "undefined" && typeof window.AudioContext !== "undefined" ? new AudioContext : null;
    if (window.location.protocol == "file:" && (options.override_safe_mode === false || typeof options.override_safe_mode === "undefined")) {
      options.use_webaudio = false;
      this.file_protocol = true;
      console.warn("jsPsych detected that it is running via the file:// protocol and not on a web server. To prevent issues with cross-origin requests, Web Audio and video preloading have been disabled. If you would like to override this setting, you can set 'override_safe_mode' to 'true' in initJsPsych. For more information, see: https://www.jspsych.org/overview/running-experiments");
    }
    this.data = new JsPsychData(this);
    this.pluginAPI = createJointPluginAPIObject(this);
    for (const extension of options.extensions) {
      this.extensions[extension.type.info.name] = new extension.type(this);
    }
    this.pluginAPI.initAudio();
  }
  version() {
    return version;
  }
  run(timeline) {
    return __awaiter(this, undefined, undefined, function* () {
      if (typeof timeline === "undefined") {
        console.error("No timeline declared in jsPsych.run. Cannot start experiment.");
      }
      if (timeline.length === 0) {
        console.error("No trials have been added to the timeline (the timeline is an empty array). Cannot start experiment.");
      }
      this.timelineDescription = timeline;
      this.timeline = new TimelineNode(this, { timeline });
      yield this.prepareDom();
      yield this.checkExclusions(this.opts.exclusions);
      yield this.loadExtensions(this.opts.extensions);
      document.documentElement.setAttribute("jspsych", "present");
      this.startExperiment();
      yield this.finished;
    });
  }
  simulate(timeline, simulation_mode = "data-only", simulation_options = {}) {
    return __awaiter(this, undefined, undefined, function* () {
      this.simulation_mode = simulation_mode;
      this.simulation_options = simulation_options;
      yield this.run(timeline);
    });
  }
  getProgress() {
    return {
      total_trials: typeof this.timeline === "undefined" ? undefined : this.timeline.length(),
      current_trial_global: this.global_trial_index,
      percent_complete: typeof this.timeline === "undefined" ? 0 : this.timeline.percentComplete()
    };
  }
  getStartTime() {
    return this.exp_start_time;
  }
  getTotalTime() {
    if (typeof this.exp_start_time === "undefined") {
      return 0;
    }
    return new Date().getTime() - this.exp_start_time.getTime();
  }
  getDisplayElement() {
    return this.DOM_target;
  }
  getDisplayContainerElement() {
    return this.DOM_container;
  }
  finishTrial(data = {}) {
    var _a;
    if (this.current_trial_finished) {
      return;
    }
    this.current_trial_finished = true;
    if (typeof this.current_trial.css_classes !== "undefined" && Array.isArray(this.current_trial.css_classes)) {
      this.DOM_target.classList.remove(...this.current_trial.css_classes);
    }
    this.data.write(data);
    const trial_data = this.data.getLastTrialData();
    const trial_data_values = trial_data.values()[0];
    const current_trial = this.current_trial;
    if (typeof current_trial.save_trial_parameters === "object") {
      for (const key of Object.keys(current_trial.save_trial_parameters)) {
        const key_val = current_trial.save_trial_parameters[key];
        if (key_val === true) {
          if (typeof current_trial[key] === "undefined") {
            console.warn(`Invalid parameter specified in save_trial_parameters. Trial has no property called "${key}".`);
          } else if (typeof current_trial[key] === "function") {
            trial_data_values[key] = current_trial[key].toString();
          } else {
            trial_data_values[key] = current_trial[key];
          }
        }
        if (key_val === false) {
          if (key !== "internal_node_id" && key !== "trial_index") {
            delete trial_data_values[key];
          }
        }
      }
    }
    const extensionCallbackResults = ((_a = current_trial.extensions) !== null && _a !== undefined ? _a : []).map((extension) => this.extensions[extension.type.info.name].on_finish(extension.params));
    const onExtensionCallbacksFinished = () => {
      this.internal.call_immediate = true;
      if (typeof current_trial.on_finish === "function") {
        current_trial.on_finish(trial_data_values);
      }
      this.opts.on_trial_finish(trial_data_values);
      this.opts.on_data_update(trial_data_values);
      this.internal.call_immediate = false;
      if (this.simulation_mode === "data-only") {
        this.nextTrial();
      } else if (typeof current_trial.post_trial_gap === null || typeof current_trial.post_trial_gap === "undefined") {
        if (this.opts.default_iti > 0) {
          setTimeout(this.nextTrial, this.opts.default_iti);
        } else {
          this.nextTrial();
        }
      } else {
        if (current_trial.post_trial_gap > 0) {
          setTimeout(this.nextTrial, current_trial.post_trial_gap);
        } else {
          this.nextTrial();
        }
      }
    };
    if (extensionCallbackResults.some((result) => typeof result.then === "function")) {
      Promise.all(extensionCallbackResults.map((result) => Promise.resolve(result).then((ext_data_values) => {
        Object.assign(trial_data_values, ext_data_values);
      }))).then(onExtensionCallbacksFinished);
    } else {
      for (const values of extensionCallbackResults) {
        Object.assign(trial_data_values, values);
      }
      onExtensionCallbacksFinished();
    }
  }
  endExperiment(end_message = "", data = {}) {
    this.timeline.end_message = end_message;
    this.timeline.end();
    this.pluginAPI.cancelAllKeyboardResponses();
    this.pluginAPI.clearAllTimeouts();
    this.finishTrial(data);
  }
  endCurrentTimeline() {
    this.timeline.endActiveNode();
  }
  getCurrentTrial() {
    return this.current_trial;
  }
  getInitSettings() {
    return this.opts;
  }
  getCurrentTimelineNodeID() {
    return this.timeline.activeID();
  }
  timelineVariable(varname, immediate = false) {
    if (this.internal.call_immediate || immediate === true) {
      return this.timeline.timelineVariable(varname);
    } else {
      return {
        timelineVariablePlaceholder: true,
        timelineVariableFunction: () => this.timeline.timelineVariable(varname)
      };
    }
  }
  getAllTimelineVariables() {
    return this.timeline.allTimelineVariables();
  }
  addNodeToEndOfTimeline(new_timeline, preload_callback) {
    this.timeline.insert(new_timeline);
  }
  pauseExperiment() {
    this.paused = true;
  }
  resumeExperiment() {
    this.paused = false;
    if (this.waiting) {
      this.waiting = false;
      this.nextTrial();
    }
  }
  loadFail(message) {
    message = message || "<p>The experiment failed to load.</p>";
    this.DOM_target.innerHTML = message;
  }
  getSafeModeStatus() {
    return this.file_protocol;
  }
  getTimeline() {
    return this.timelineDescription;
  }
  prepareDom() {
    return __awaiter(this, undefined, undefined, function* () {
      if (document.readyState !== "complete") {
        yield new Promise((resolve) => {
          window.addEventListener("load", resolve);
        });
      }
      const options = this.opts;
      if (typeof options.display_element === "undefined") {
        const body = document.querySelector("body");
        if (body === null) {
          document.documentElement.appendChild(document.createElement("body"));
        }
        document.querySelector("html").style.height = "100%";
        document.querySelector("body").style.margin = "0px";
        document.querySelector("body").style.height = "100%";
        document.querySelector("body").style.width = "100%";
        options.display_element = document.querySelector("body");
      } else {
        const display = options.display_element instanceof Element ? options.display_element : document.querySelector("#" + options.display_element);
        if (display === null) {
          console.error("The display_element specified in initJsPsych() does not exist in the DOM.");
        } else {
          options.display_element = display;
        }
      }
      options.display_element.innerHTML = '<div class="jspsych-content-wrapper"><div id="jspsych-content"></div></div>';
      this.DOM_container = options.display_element;
      this.DOM_target = document.querySelector("#jspsych-content");
      if (options.experiment_width !== null) {
        this.DOM_target.style.width = options.experiment_width + "px";
      }
      options.display_element.tabIndex = 0;
      if (options.display_element.className.indexOf("jspsych-display-element") === -1) {
        options.display_element.className += " jspsych-display-element";
      }
      this.DOM_target.className += "jspsych-content";
      this.data.createInteractionListeners();
      window.addEventListener("beforeunload", options.on_close);
    });
  }
  loadExtensions(extensions) {
    return __awaiter(this, undefined, undefined, function* () {
      try {
        yield Promise.all(extensions.map((extension) => this.extensions[extension.type.info.name].initialize(extension.params || {})));
      } catch (error_message) {
        console.error(error_message);
        throw new Error(error_message);
      }
    });
  }
  startExperiment() {
    this.finished = new Promise((resolve) => {
      this.resolveFinishedPromise = resolve;
    });
    if (this.opts.show_progress_bar === true) {
      this.drawProgressBar(this.opts.message_progress_bar);
    }
    this.exp_start_time = new Date;
    this.timeline.advance();
    this.doTrial(this.timeline.trial());
  }
  finishExperiment() {
    const finish_result = this.opts.on_finish(this.data.get());
    const done_handler = () => {
      if (typeof this.timeline.end_message !== "undefined") {
        this.DOM_target.innerHTML = this.timeline.end_message;
      }
      this.resolveFinishedPromise();
    };
    if (finish_result) {
      Promise.resolve(finish_result).then(done_handler);
    } else {
      done_handler();
    }
  }
  nextTrial() {
    if (this.paused) {
      this.waiting = true;
      return;
    }
    this.global_trial_index++;
    this.timeline.markCurrentTrialComplete();
    const complete = this.timeline.advance();
    if (this.opts.show_progress_bar === true && this.opts.auto_update_progress_bar === true) {
      this.updateProgressBar();
    }
    if (complete) {
      this.finishExperiment();
      return;
    }
    this.doTrial(this.timeline.trial());
  }
  doTrial(trial) {
    this.current_trial = trial;
    this.current_trial_finished = false;
    this.evaluateTimelineVariables(trial);
    if (typeof trial.type === "string") {
      throw new MigrationError("A string was provided as the trial's `type` parameter. Since jsPsych v7, the `type` parameter needs to be a plugin object.");
    }
    trial.type = Object.assign(Object.assign({}, autoBind(new trial.type(this))), { info: trial.type.info });
    this.evaluateFunctionParameters(trial);
    this.setDefaultValues(trial);
    this.internal.call_immediate = true;
    this.opts.on_trial_start(trial);
    if (typeof trial.on_start === "function") {
      trial.on_start(trial);
    }
    if (Array.isArray(trial.extensions)) {
      for (const extension of trial.extensions) {
        this.extensions[extension.type.info.name].on_start(extension.params);
      }
    }
    this.DOM_container.focus();
    this.DOM_target.scrollTop = 0;
    if (typeof trial.css_classes !== "undefined") {
      if (!Array.isArray(trial.css_classes) && typeof trial.css_classes === "string") {
        trial.css_classes = [trial.css_classes];
      }
      if (Array.isArray(trial.css_classes)) {
        this.DOM_target.classList.add(...trial.css_classes);
      }
    }
    const load_callback = () => {
      if (typeof trial.on_load === "function") {
        trial.on_load();
      }
      if (Array.isArray(trial.extensions)) {
        for (const extension of trial.extensions) {
          this.extensions[extension.type.info.name].on_load(extension.params);
        }
      }
    };
    let trial_complete;
    let trial_sim_opts;
    let trial_sim_opts_merged;
    if (!this.simulation_mode) {
      trial_complete = trial.type.trial(this.DOM_target, trial, load_callback);
    }
    if (this.simulation_mode) {
      if (trial.type.simulate) {
        if (!trial.simulation_options) {
          trial_sim_opts = this.simulation_options.default;
        }
        if (trial.simulation_options) {
          if (typeof trial.simulation_options == "string") {
            if (this.simulation_options[trial.simulation_options]) {
              trial_sim_opts = this.simulation_options[trial.simulation_options];
            } else if (this.simulation_options.default) {
              console.log(`No matching simulation options found for "${trial.simulation_options}". Using "default" options.`);
              trial_sim_opts = this.simulation_options.default;
            } else {
              console.log(`No matching simulation options found for "${trial.simulation_options}" and no "default" options provided. Using the default values provided by the plugin.`);
              trial_sim_opts = {};
            }
          } else {
            trial_sim_opts = trial.simulation_options;
          }
        }
        trial_sim_opts_merged = this.utils.deepMerge(this.simulation_options.default, trial_sim_opts);
        trial_sim_opts_merged = this.utils.deepCopy(trial_sim_opts_merged);
        trial_sim_opts_merged = this.replaceFunctionsWithValues(trial_sim_opts_merged, null);
        if ((trial_sim_opts_merged === null || trial_sim_opts_merged === undefined ? undefined : trial_sim_opts_merged.simulate) === false) {
          trial_complete = trial.type.trial(this.DOM_target, trial, load_callback);
        } else {
          trial_complete = trial.type.simulate(trial, (trial_sim_opts_merged === null || trial_sim_opts_merged === undefined ? undefined : trial_sim_opts_merged.mode) || this.simulation_mode, trial_sim_opts_merged, load_callback);
        }
      } else {
        trial_complete = trial.type.trial(this.DOM_target, trial, load_callback);
      }
    }
    const is_promise = trial_complete && typeof trial_complete.then == "function";
    if (!is_promise && (!this.simulation_mode || this.simulation_mode && (trial_sim_opts_merged === null || trial_sim_opts_merged === undefined ? undefined : trial_sim_opts_merged.simulate) === false)) {
      load_callback();
    }
    this.internal.call_immediate = false;
  }
  evaluateTimelineVariables(trial) {
    for (const key of Object.keys(trial)) {
      if (typeof trial[key] === "object" && trial[key] !== null && typeof trial[key].timelineVariablePlaceholder !== "undefined") {
        trial[key] = trial[key].timelineVariableFunction();
      }
      if (typeof trial[key] === "object" && trial[key] !== null && key !== "timeline" && key !== "timeline_variables") {
        this.evaluateTimelineVariables(trial[key]);
      }
    }
  }
  evaluateFunctionParameters(trial) {
    this.internal.call_immediate = true;
    for (const key of Object.keys(trial)) {
      if (key !== "type") {
        if (typeof universalPluginParameters[key] !== "undefined" && universalPluginParameters[key].type !== ParameterType.FUNCTION) {
          trial[key] = this.replaceFunctionsWithValues(trial[key], null);
        }
        if (typeof trial.type.info.parameters[key] !== "undefined" && trial.type.info.parameters[key].type !== ParameterType.FUNCTION) {
          trial[key] = this.replaceFunctionsWithValues(trial[key], trial.type.info.parameters[key]);
        }
      }
    }
    this.internal.call_immediate = false;
  }
  replaceFunctionsWithValues(obj, info) {
    if (obj === null) {
      return obj;
    } else if (Array.isArray(obj)) {
      for (let i = 0;i < obj.length; i++) {
        obj[i] = this.replaceFunctionsWithValues(obj[i], info);
      }
    } else if (typeof obj === "object") {
      if (info === null || !info.nested) {
        for (const key of Object.keys(obj)) {
          if (key === "type" || key === "timeline" || key === "timeline_variables") {
            continue;
          }
          obj[key] = this.replaceFunctionsWithValues(obj[key], null);
        }
      } else {
        for (const key of Object.keys(obj)) {
          if (typeof info.nested[key] === "object" && info.nested[key].type !== ParameterType.FUNCTION) {
            obj[key] = this.replaceFunctionsWithValues(obj[key], info.nested[key]);
          }
        }
      }
    } else if (typeof obj === "function") {
      return obj();
    }
    return obj;
  }
  setDefaultValues(trial) {
    for (const param in trial.type.info.parameters) {
      if (trial.type.info.parameters[param].type === ParameterType.COMPLEX) {
        if (typeof trial[param] === "undefined" && trial.type.info.parameters[param].default) {
          trial[param] = trial.type.info.parameters[param].default;
        }
        if (trial.type.info.parameters[param].array === true && Array.isArray(trial[param])) {
          trial[param].forEach(function(ip, i) {
            for (const p in trial.type.info.parameters[param].nested) {
              if (typeof trial[param][i][p] === "undefined" || trial[param][i][p] === null) {
                if (typeof trial.type.info.parameters[param].nested[p].default === "undefined") {
                  console.error(`You must specify a value for the ${p} parameter (nested in the ${param} parameter) in the ${trial.type.info.name} plugin.`);
                } else {
                  trial[param][i][p] = trial.type.info.parameters[param].nested[p].default;
                }
              }
            }
          });
        }
      } else if (typeof trial[param] === "undefined" || trial[param] === null) {
        if (typeof trial.type.info.parameters[param].default === "undefined") {
          console.error(`You must specify a value for the ${param} parameter in the ${trial.type.info.name} plugin.`);
        } else {
          trial[param] = trial.type.info.parameters[param].default;
        }
      }
    }
  }
  checkExclusions(exclusions) {
    return __awaiter(this, undefined, undefined, function* () {
      if (exclusions.min_width || exclusions.min_height || exclusions.audio) {
        console.warn("The exclusions option in `initJsPsych()` is deprecated and will be removed in a future version. We recommend using the browser-check plugin instead. See https://www.jspsych.org/latest/plugins/browser-check/.");
      }
      if (exclusions.min_width || exclusions.min_height) {
        const mw = exclusions.min_width || 0;
        const mh = exclusions.min_height || 0;
        if (window.innerWidth < mw || window.innerHeight < mh) {
          this.getDisplayElement().innerHTML = "<p>Your browser window is too small to complete this experiment. Please maximize the size of your browser window. If your browser window is already maximized, you will not be able to complete this experiment.</p><p>The minimum width is " + mw + "px. Your current width is " + window.innerWidth + "px.</p><p>The minimum height is " + mh + "px. Your current height is " + window.innerHeight + "px.</p>";
          while (window.innerWidth < mw || window.innerHeight < mh) {
            yield delay(100);
          }
          this.getDisplayElement().innerHTML = "";
        }
      }
      if (typeof exclusions.audio !== "undefined" && exclusions.audio) {
        if (!window.hasOwnProperty("AudioContext") && !window.hasOwnProperty("webkitAudioContext")) {
          this.getDisplayElement().innerHTML = "<p>Your browser does not support the WebAudio API, which means that you will not be able to complete the experiment.</p><p>Browsers that support the WebAudio API include Chrome, Firefox, Safari, and Edge.</p>";
          throw new Error;
        }
      }
    });
  }
  drawProgressBar(msg) {
    document.querySelector(".jspsych-display-element").insertAdjacentHTML("afterbegin", '<div id="jspsych-progressbar-container"><span>' + msg + '</span><div id="jspsych-progressbar-outer"><div id="jspsych-progressbar-inner"></div></div></div>');
  }
  updateProgressBar() {
    this.setProgressBar(this.getProgress().percent_complete / 100);
  }
  setProgressBar(proportion_complete) {
    proportion_complete = Math.max(Math.min(1, proportion_complete), 0);
    document.querySelector("#jspsych-progressbar-inner").style.width = proportion_complete * 100 + "%";
    this.progress_bar_amount = proportion_complete;
  }
  getProgressBarCompleted() {
    return this.progress_bar_amount;
  }
}
if (typeof window !== "undefined" && window.hasOwnProperty("webkitAudioContext") && !window.hasOwnProperty("AudioContext")) {
  window.AudioContext = webkitAudioContext;
}

// node_modules/@jspsych/plugin-html-keyboard-response/dist/index.js
var info = {
  name: "html-keyboard-response",
  parameters: {
    stimulus: {
      type: ParameterType.HTML_STRING,
      pretty_name: "Stimulus",
      default: undefined
    },
    choices: {
      type: ParameterType.KEYS,
      pretty_name: "Choices",
      default: "ALL_KEYS"
    },
    prompt: {
      type: ParameterType.HTML_STRING,
      pretty_name: "Prompt",
      default: null
    },
    stimulus_duration: {
      type: ParameterType.INT,
      pretty_name: "Stimulus duration",
      default: null
    },
    trial_duration: {
      type: ParameterType.INT,
      pretty_name: "Trial duration",
      default: null
    },
    response_ends_trial: {
      type: ParameterType.BOOL,
      pretty_name: "Response ends trial",
      default: true
    }
  }
};

class HtmlKeyboardResponsePlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }
  trial(display_element, trial) {
    var new_html = '<div id="jspsych-html-keyboard-response-stimulus">' + trial.stimulus + "</div>";
    if (trial.prompt !== null) {
      new_html += trial.prompt;
    }
    display_element.innerHTML = new_html;
    var response = {
      rt: null,
      key: null
    };
    const end_trial = () => {
      this.jsPsych.pluginAPI.clearAllTimeouts();
      if (typeof keyboardListener !== "undefined") {
        this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }
      var trial_data = {
        rt: response.rt,
        stimulus: trial.stimulus,
        response: response.key
      };
      display_element.innerHTML = "";
      this.jsPsych.finishTrial(trial_data);
    };
    var after_response = (info2) => {
      display_element.querySelector("#jspsych-html-keyboard-response-stimulus").className += " responded";
      if (response.key == null) {
        response = info2;
      }
      if (trial.response_ends_trial) {
        end_trial();
      }
    };
    if (trial.choices != "NO_KEYS") {
      var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: "performance",
        persist: false,
        allow_held_key: false
      });
    }
    if (trial.stimulus_duration !== null) {
      this.jsPsych.pluginAPI.setTimeout(() => {
        display_element.querySelector("#jspsych-html-keyboard-response-stimulus").style.visibility = "hidden";
      }, trial.stimulus_duration);
    }
    if (trial.trial_duration !== null) {
      this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
    }
  }
  simulate(trial, simulation_mode, simulation_options, load_callback) {
    if (simulation_mode == "data-only") {
      load_callback();
      this.simulate_data_only(trial, simulation_options);
    }
    if (simulation_mode == "visual") {
      this.simulate_visual(trial, simulation_options, load_callback);
    }
  }
  create_simulation_data(trial, simulation_options) {
    const default_data = {
      stimulus: trial.stimulus,
      rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
      response: this.jsPsych.pluginAPI.getValidKey(trial.choices)
    };
    const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
    this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
    return data;
  }
  simulate_data_only(trial, simulation_options) {
    const data = this.create_simulation_data(trial, simulation_options);
    this.jsPsych.finishTrial(data);
  }
  simulate_visual(trial, simulation_options, load_callback) {
    const data = this.create_simulation_data(trial, simulation_options);
    const display_element = this.jsPsych.getDisplayElement();
    this.trial(display_element, trial);
    load_callback();
    if (data.rt !== null) {
      this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
    }
  }
}
HtmlKeyboardResponsePlugin.info = info;

// node_modules/@jspsych/plugin-image-keyboard-response/dist/index.js
var info2 = {
  name: "image-keyboard-response",
  parameters: {
    stimulus: {
      type: ParameterType.IMAGE,
      pretty_name: "Stimulus",
      default: undefined
    },
    stimulus_height: {
      type: ParameterType.INT,
      pretty_name: "Image height",
      default: null
    },
    stimulus_width: {
      type: ParameterType.INT,
      pretty_name: "Image width",
      default: null
    },
    maintain_aspect_ratio: {
      type: ParameterType.BOOL,
      pretty_name: "Maintain aspect ratio",
      default: true
    },
    choices: {
      type: ParameterType.KEYS,
      pretty_name: "Choices",
      default: "ALL_KEYS"
    },
    prompt: {
      type: ParameterType.HTML_STRING,
      pretty_name: "Prompt",
      default: null
    },
    stimulus_duration: {
      type: ParameterType.INT,
      pretty_name: "Stimulus duration",
      default: null
    },
    trial_duration: {
      type: ParameterType.INT,
      pretty_name: "Trial duration",
      default: null
    },
    response_ends_trial: {
      type: ParameterType.BOOL,
      pretty_name: "Response ends trial",
      default: true
    },
    render_on_canvas: {
      type: ParameterType.BOOL,
      pretty_name: "Render on canvas",
      default: true
    }
  }
};

class ImageKeyboardResponsePlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }
  trial(display_element, trial) {
    var height, width;
    if (trial.render_on_canvas) {
      var image_drawn = false;
      if (display_element.hasChildNodes()) {
        while (display_element.firstChild) {
          display_element.removeChild(display_element.firstChild);
        }
      }
      var canvas = document.createElement("canvas");
      canvas.id = "jspsych-image-keyboard-response-stimulus";
      canvas.style.margin = "0";
      canvas.style.padding = "0";
      var ctx = canvas.getContext("2d");
      var img = new Image;
      img.onload = () => {
        if (!image_drawn) {
          getHeightWidth();
          ctx.drawImage(img, 0, 0, width, height);
        }
      };
      img.src = trial.stimulus;
      const getHeightWidth = () => {
        if (trial.stimulus_height !== null) {
          height = trial.stimulus_height;
          if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
            width = img.naturalWidth * (trial.stimulus_height / img.naturalHeight);
          }
        } else {
          height = img.naturalHeight;
        }
        if (trial.stimulus_width !== null) {
          width = trial.stimulus_width;
          if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
            height = img.naturalHeight * (trial.stimulus_width / img.naturalWidth);
          }
        } else if (!(trial.stimulus_height !== null && trial.maintain_aspect_ratio)) {
          width = img.naturalWidth;
        }
        canvas.height = height;
        canvas.width = width;
      };
      getHeightWidth();
      display_element.insertBefore(canvas, null);
      if (img.complete && Number.isFinite(width) && Number.isFinite(height)) {
        ctx.drawImage(img, 0, 0, width, height);
        image_drawn = true;
      }
      if (trial.prompt !== null) {
        display_element.insertAdjacentHTML("beforeend", trial.prompt);
      }
    } else {
      var html = '<img src="' + trial.stimulus + '" id="jspsych-image-keyboard-response-stimulus">';
      if (trial.prompt !== null) {
        html += trial.prompt;
      }
      display_element.innerHTML = html;
      var img = display_element.querySelector("#jspsych-image-keyboard-response-stimulus");
      if (trial.stimulus_height !== null) {
        height = trial.stimulus_height;
        if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
          width = img.naturalWidth * (trial.stimulus_height / img.naturalHeight);
        }
      } else {
        height = img.naturalHeight;
      }
      if (trial.stimulus_width !== null) {
        width = trial.stimulus_width;
        if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
          height = img.naturalHeight * (trial.stimulus_width / img.naturalWidth);
        }
      } else if (!(trial.stimulus_height !== null && trial.maintain_aspect_ratio)) {
        width = img.naturalWidth;
      }
      img.style.height = height.toString() + "px";
      img.style.width = width.toString() + "px";
    }
    var response = {
      rt: null,
      key: null
    };
    const end_trial = () => {
      this.jsPsych.pluginAPI.clearAllTimeouts();
      if (typeof keyboardListener !== "undefined") {
        this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }
      var trial_data = {
        rt: response.rt,
        stimulus: trial.stimulus,
        response: response.key
      };
      display_element.innerHTML = "";
      this.jsPsych.finishTrial(trial_data);
    };
    var after_response = (info3) => {
      display_element.querySelector("#jspsych-image-keyboard-response-stimulus").className += " responded";
      if (response.key == null) {
        response = info3;
      }
      if (trial.response_ends_trial) {
        end_trial();
      }
    };
    if (trial.choices != "NO_KEYS") {
      var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: "performance",
        persist: false,
        allow_held_key: false
      });
    }
    if (trial.stimulus_duration !== null) {
      this.jsPsych.pluginAPI.setTimeout(() => {
        display_element.querySelector("#jspsych-image-keyboard-response-stimulus").style.visibility = "hidden";
      }, trial.stimulus_duration);
    }
    if (trial.trial_duration !== null) {
      this.jsPsych.pluginAPI.setTimeout(() => {
        end_trial();
      }, trial.trial_duration);
    } else if (trial.response_ends_trial === false) {
      console.warn("The experiment may be deadlocked. Try setting a trial duration or set response_ends_trial to true.");
    }
  }
  simulate(trial, simulation_mode, simulation_options, load_callback) {
    if (simulation_mode == "data-only") {
      load_callback();
      this.simulate_data_only(trial, simulation_options);
    }
    if (simulation_mode == "visual") {
      this.simulate_visual(trial, simulation_options, load_callback);
    }
  }
  simulate_data_only(trial, simulation_options) {
    const data = this.create_simulation_data(trial, simulation_options);
    this.jsPsych.finishTrial(data);
  }
  simulate_visual(trial, simulation_options, load_callback) {
    const data = this.create_simulation_data(trial, simulation_options);
    const display_element = this.jsPsych.getDisplayElement();
    this.trial(display_element, trial);
    load_callback();
    if (data.rt !== null) {
      this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
    }
  }
  create_simulation_data(trial, simulation_options) {
    const default_data = {
      stimulus: trial.stimulus,
      rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
      response: this.jsPsych.pluginAPI.getValidKey(trial.choices)
    };
    const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
    this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
    return data;
  }
}
ImageKeyboardResponsePlugin.info = info2;

// node_modules/@jspsych/plugin-preload/dist/index.js
var info3 = {
  name: "preload",
  parameters: {
    auto_preload: {
      type: ParameterType.BOOL,
      pretty_name: "Auto-preload",
      default: false
    },
    trials: {
      type: ParameterType.TIMELINE,
      pretty_name: "Trials",
      default: []
    },
    images: {
      type: ParameterType.STRING,
      pretty_name: "Images",
      default: [],
      array: true
    },
    audio: {
      type: ParameterType.STRING,
      pretty_name: "Audio",
      default: [],
      array: true
    },
    video: {
      type: ParameterType.STRING,
      pretty_name: "Video",
      default: [],
      array: true
    },
    message: {
      type: ParameterType.HTML_STRING,
      pretty_name: "Message",
      default: null
    },
    show_progress_bar: {
      type: ParameterType.BOOL,
      pretty_name: "Show progress bar",
      default: true
    },
    continue_after_error: {
      type: ParameterType.BOOL,
      pretty_name: "Continue after error",
      default: false
    },
    error_message: {
      type: ParameterType.HTML_STRING,
      pretty_name: "Error message",
      default: "The experiment failed to load."
    },
    show_detailed_errors: {
      type: ParameterType.BOOL,
      pretty_name: "Show detailed errors",
      default: false
    },
    max_load_time: {
      type: ParameterType.INT,
      pretty_name: "Max load time",
      default: null
    },
    on_error: {
      type: ParameterType.FUNCTION,
      pretty_name: "On error",
      default: null
    },
    on_success: {
      type: ParameterType.FUNCTION,
      pretty_name: "On success",
      default: null
    }
  }
};

class PreloadPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }
  trial(display_element, trial) {
    var success = null;
    var timeout = false;
    var failed_images = [];
    var failed_audio = [];
    var failed_video = [];
    var detailed_errors = [];
    var in_safe_mode = this.jsPsych.getSafeModeStatus();
    var images = [];
    var audio = [];
    var video = [];
    if (trial.auto_preload) {
      var experiment_timeline = this.jsPsych.getTimeline();
      var auto_preload = this.jsPsych.pluginAPI.getAutoPreloadList(experiment_timeline);
      images = images.concat(auto_preload.images);
      audio = audio.concat(auto_preload.audio);
      video = video.concat(auto_preload.video);
    }
    if (trial.trials.length > 0) {
      var trial_preloads = this.jsPsych.pluginAPI.getAutoPreloadList(trial.trials);
      images = images.concat(trial_preloads.images);
      audio = audio.concat(trial_preloads.audio);
      video = video.concat(trial_preloads.video);
    }
    images = images.concat(trial.images);
    audio = audio.concat(trial.audio);
    video = video.concat(trial.video);
    images = this.jsPsych.utils.unique(images.flat());
    audio = this.jsPsych.utils.unique(audio.flat());
    video = this.jsPsych.utils.unique(video.flat());
    if (in_safe_mode) {
      video = [];
    }
    var html = "";
    if (trial.message !== null) {
      html += trial.message;
    }
    if (trial.show_progress_bar) {
      html += `
            <div id='jspsych-loading-progress-bar-container' style='height: 10px; width: 300px; background-color: #ddd; margin: auto;'>
              <div id='jspsych-loading-progress-bar' style='height: 10px; width: 0%; background-color: #777;'></div>
            </div>`;
    }
    display_element.innerHTML = html;
    const update_loading_progress_bar = () => {
      loaded++;
      if (trial.show_progress_bar) {
        var percent_loaded = loaded / total_n * 100;
        var preload_progress_bar = display_element.querySelector("#jspsych-loading-progress-bar");
        if (preload_progress_bar !== null) {
          preload_progress_bar.style.width = percent_loaded + "%";
        }
      }
    };
    const on_success = () => {
      if (typeof timeout !== "undefined" && timeout === false) {
        this.jsPsych.pluginAPI.clearAllTimeouts();
        this.jsPsych.pluginAPI.cancelPreloads();
        success = true;
        end_trial();
      }
    };
    const on_timeout = () => {
      this.jsPsych.pluginAPI.cancelPreloads();
      if (typeof success !== "undefined" && (success === false || success === null)) {
        timeout = true;
        if (loaded_success < total_n) {
          success = false;
        }
        after_error("timeout");
        detailed_errors.push("<p><strong>Loading timed out.</strong><br>Consider compressing your stimuli files, loading your files in smaller batches,<br>and/or increasing the <i>max_load_time</i> parameter.</p>");
        if (trial.continue_after_error) {
          end_trial();
        } else {
          stop_with_error_message();
        }
      }
    };
    const stop_with_error_message = () => {
      this.jsPsych.pluginAPI.clearAllTimeouts();
      this.jsPsych.pluginAPI.cancelPreloads();
      display_element.innerHTML = trial.error_message;
      if (trial.show_detailed_errors) {
        display_element.innerHTML += "<p><strong>Error details:</strong></p>";
        detailed_errors.forEach((e) => {
          display_element.innerHTML += e;
        });
      }
    };
    const end_trial = () => {
      this.jsPsych.pluginAPI.clearAllTimeouts();
      var trial_data = {
        success,
        timeout,
        failed_images,
        failed_audio,
        failed_video
      };
      display_element.innerHTML = "";
      this.jsPsych.finishTrial(trial_data);
    };
    if (trial.max_load_time !== null) {
      this.jsPsych.pluginAPI.setTimeout(on_timeout, trial.max_load_time);
    }
    var total_n = images.length + audio.length + video.length;
    var loaded = 0;
    var loaded_success = 0;
    if (total_n == 0) {
      on_success();
    } else {
      const load_video = (cb) => {
        this.jsPsych.pluginAPI.preloadVideo(video, cb, file_loading_success, file_loading_error);
      };
      const load_audio = (cb) => {
        this.jsPsych.pluginAPI.preloadAudio(audio, cb, file_loading_success, file_loading_error);
      };
      const load_images = (cb) => {
        this.jsPsych.pluginAPI.preloadImages(images, cb, file_loading_success, file_loading_error);
      };
      if (video.length > 0) {
        load_video(() => {
        });
      }
      if (audio.length > 0) {
        load_audio(() => {
        });
      }
      if (images.length > 0) {
        load_images(() => {
        });
      }
    }
    function file_loading_error(e) {
      update_loading_progress_bar();
      if (success == null) {
        success = false;
      }
      var source = "unknown file";
      if (e.source) {
        source = e.source;
      }
      if (e.error && e.error.path && e.error.path.length > 0) {
        if (e.error.path[0].localName == "img") {
          failed_images.push(source);
        } else if (e.error.path[0].localName == "audio") {
          failed_audio.push(source);
        } else if (e.error.path[0].localName == "video") {
          failed_video.push(source);
        }
      }
      var err_msg = "<p><strong>Error loading file: " + source + "</strong><br>";
      if (e.error.statusText) {
        err_msg += "File request response status: " + e.error.statusText + "<br>";
      }
      if (e.error == "404") {
        err_msg += "404 - file not found.<br>";
      }
      if (typeof e.error.loaded !== "undefined" && e.error.loaded !== null && e.error.loaded !== 0) {
        err_msg += e.error.loaded + " bytes transferred.";
      } else {
        err_msg += "File did not begin loading. Check that file path is correct and reachable by the browser,<br>and that loading is not blocked by cross-origin resource sharing (CORS) errors.";
      }
      err_msg += "</p>";
      detailed_errors.push(err_msg);
      after_error(source);
      if (loaded == total_n) {
        if (trial.continue_after_error) {
          end_trial();
        } else {
          stop_with_error_message();
        }
      }
    }
    function file_loading_success(source) {
      update_loading_progress_bar();
      after_success(source);
      loaded_success++;
      if (loaded_success == total_n) {
        on_success();
      } else if (loaded == total_n) {
        if (trial.continue_after_error) {
          end_trial();
        } else {
          stop_with_error_message();
        }
      }
    }
    function after_error(source) {
      if (trial.on_error !== null) {
        trial.on_error(source);
      }
    }
    function after_success(source) {
      if (trial.on_success !== null) {
        trial.on_success(source);
      }
    }
  }
  simulate(trial, simulation_mode, simulation_options, load_callback) {
    if (simulation_mode == "data-only") {
      load_callback();
      this.simulate_data_only(trial, simulation_options);
    }
    if (simulation_mode == "visual") {
      this.simulate_visual(trial, simulation_options, load_callback);
    }
  }
  create_simulation_data(trial, simulation_options) {
    const default_data = {
      success: true,
      timeout: false,
      failed_images: [],
      failed_audio: [],
      failed_video: []
    };
    const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
    return data;
  }
  simulate_data_only(trial, simulation_options) {
    const data = this.create_simulation_data(trial, simulation_options);
    this.jsPsych.finishTrial(data);
  }
  simulate_visual(trial, simulation_options, load_callback) {
    const display_element = this.jsPsych.getDisplayElement();
    this.trial(display_element, trial);
    load_callback();
  }
}
PreloadPlugin.info = info3;

// index.ts
var jsPsych = initJsPsych({
  on_finish: () => {
    jsPsych.data.displayData();
  }
});
var timeline = [];
var preloading = {
  type: PreloadPlugin,
  images: ["stimulus_assets/blue.png", "stimulus_assets/orange.png"]
};
timeline.push(preloading);
var welcome = {
  type: HtmlKeyboardResponsePlugin,
  stimulus: "Welcome to the expriment. Press any key to begin."
};
timeline.push(welcome);
var stimuli = [
  { stimulus: "stimulus_assets/blue.png", correct_response: "f" },
  { stimulus: "stimulus_assets/orange.png", correct_response: "j" }
];
var fixation = {
  type: HtmlKeyboardResponsePlugin,
  stimulus: '<div class="fixation">+</div>',
  choices: "NO_KEYS",
  trial_duration: () => {
    return jsPsych.randomization.sampleWithoutReplacement([250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
  },
  data: {
    task: "fixation"
  }
};
var trial = {
  type: ImageKeyboardResponsePlugin,
  stimulus: jsPsych.timelineVariable("stimulus"),
  choices: ["f", "j"],
  data: {
    task: "response",
    correct_response: jsPsych.timelineVariable("correct_response")
  },
  on_finish: (data) => {
    data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
  }
};
var trial_procedure = {
  timeline: [fixation, trial],
  timeline_variables: stimuli,
  repetitions: 5,
  randomize_order: true
};
timeline.push(trial_procedure);
var debriefing = {
  type: HtmlKeyboardResponsePlugin,
  stimulus: () => {
    const trials = jsPsych.data.get().filter({ task: "response" });
    const correct_trials = trials.filter({ correct: true });
    const accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    const rt = Math.round(correct_trials.select("rt").mean());
    return `<p>You responded correctly on ${accuracy}% of the trials.</p>
          <p>Your average response time was ${rt}ms.</p>
          <p>Press any key to complete the experiment. Thank you!</p>`;
  }
};
timeline.push(debriefing);
jsPsych.run(timeline);
