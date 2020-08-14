const fs = require("fs");
const path = require("path");

const Helper = require("../Helper");

module.exports = class Model {
  constructor(modelName, schema) {
    this.filePath = path.join(__dirname, "./data", modelName + ".json");
    this.documents = Helper.getJsonFile(this.filePath);
    this.schema = schema;
  }

  find(conditions) {
    if (typeof conditions !== "object") {
      throw new Error(
        "Parameter conditions must be an object, but got: " + conditions
      );
    }

    const keys = Object.keys(conditions);

    return [
      ...this.documents.reduce((acc, doc) => {
        let match = true;
        keys.forEach((key) => {
          if (typeof doc[key] === "object") {
            // just a temporary solution, NOT correct in most cases
            if (JSON.stringify(doc[key]) !== JSON.stringify(conditions[key])) {
              match = false;
            }
          } else {
            if (doc[key] !== conditions[key]) {
              match = false;
            }
          }
        });

        if (match) return [...acc, doc];
        return acc;
      }, []),
    ];
  }

  findOne(conditions) {
    const docs = this.find(conditions);

    if (docs.length > 0) return { ...docs[0] };
    return null;
  }

  findById(id) {
    if (typeof id !== "number")
      throw new Error("id must be a number, but got: " + id);

    return this.findOne({ id });
  }

  create(data) {
    if (typeof data !== "object") {
      throw new Error("Parameter data must be an object, but got: " + data);
    } else {
      const newDocument = this.getDefaultValues();

      Object.keys(data).forEach((key) => {
        if (this.schema[key] === "array") {
          if (Array.isArray(data[key])) {
            return (newDocument[key] = data[key]);
          }
          return;
        }

        if (key in this.schema && typeof data[key] === this.schema[key]) {
          return (newDocument[key] = data[key]);
        }

        return;
      });

      newDocument.id = this.getId();

      this.documents.push(newDocument);
      this.save();

      return newDocument;
    }
  }

  findByIdAndUpdate(id, payload) {
    const doc = this.findById(id);
    if (typeof payload !== "object")
      throw new Error(
        "Parameter 'object' must be an object, but got: " + payload
      );

    const filteredPayload = Object.keys(payload)
      .filter((key) => key !== "id")
      .reduce((acc, key) => ({ ...acc, [key]: payload[key] }), {});

    Object.keys(filteredPayload).forEach((key) => {
      if (
        key in this.schema &&
        (typeof payload[key] === this.schema[key] ||
          (Array.isArray(payload[key]) && this.schema[key] === "array"))
      ) {
        doc[key] = payload[key];
      }
    });

    const docIndex = this.indexOf(id);
    this.documents[docIndex] = doc;
    this.save();

    return doc;
  }

  findByIdAndDelete(id) {
    console.log(typeof id);
    this.documents = this.documents.filter((doc) => doc.id !== id);
    this.save();

    return this.documents;
  }

  // helpers
  indexOf(id) {
    let index = -1;

    this.documents.forEach((doc, i) => {
      index = doc.id === id ? i : index;
    });

    return index;
  }

  defaultValueGenerators = {
    number: null,
    string: null,
    date: () => new Date(),
    object: () => {},
    array: () => [],
  };

  getDefaultValues() {
    const val = {};

    Object.keys(this.schema).forEach((key) => {
      if (typeof this.defaultValueGenerators[this.schema[key]] === "function") {
        val[key] = this.defaultValueGenerators[this.schema[key]]();
      } else {
        val[key] = this.defaultValueGenerators[this.schema[key]];
      }
    });

    return val;
  }

  getId() {
    if (this.documents.length === 0) return 0;
    return this.documents[this.documents.length - 1].id + 1;
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.documents), {
        flag: "w",
      });
    } catch (err) {
      console.error(err);
    }
  }
};
