import * as toml from "@sgarciac/bombadil";
import * as fs from "fs";
var input = fs.readFileSync("/dev/stdin", "utf8");

var reader = new toml.TomlReader();

reader.readToml(input, true);

function bombadilToTomlTestAtomicValue(input: toml.TomlValue) {}

function bombadilToTomlTest(input: any): any {
  if (input instanceof Array) {
    return input.map(bombadilToTomlTest);
  } else {
    switch (input.type) {
      case toml.atomicInteger: {
        return { type: "integer", value: input.value.toString() };
      }
      case toml.atomicFloat: {
        return { type: "float", value: input.value.toString() };
      }
      case toml.atomicNotANumber: {
        return { type: "float", value: input.image.toString() };
      }
      case toml.atomicInfinity: {
        return { type: "float", value: input.image.toString() };
      }
      case toml.atomicBoolean: {
        return { type: "bool", value: input.image.toString() };
      }
      case toml.atomicString: {
        return { type: "string", value: input.value };
      }
      case toml.localDateTime: {
        return { type: "datetime-local", value: input.image };
      }
      case toml.offsetDateTime: {
        return { type: "datetime", value: input.image };
      }
      case toml.localDate: {
        return { type: "date", value: input.image };
      }
      case toml.localTime: {
        return { type: "time", value: input.image };
      }
      case toml.table: {
        let newObj: { [key: string]: any } = {};
        for (let property in input.content) {
          newObj[property] = bombadilToTomlTest(input.content[property]);
        }
        return newObj;
      }
      default: {
        throw `eh!? ${JSON.stringify(input)}`;
      }
    }
  }
  // if (Object.prototype.hasOwnProperty.call(input, "type")) {
  //   return bombadilToTomlTestAtomicValue(input);
  // } else  else {
  // }
}

if (reader.errors.length > 0) {
  console.log(JSON.stringify(reader.errors));
  process.exit(1);
}
console.log(JSON.stringify(bombadilToTomlTest(reader.result), null, 2));
process.exit(0);
