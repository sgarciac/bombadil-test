"use strict";
exports.__esModule = true;
var toml = require("@sgarciac/bombadil");
var fs = require("fs");
var input = fs.readFileSync('/dev/stdin', 'utf8');
var reader = new toml.TomlReader();
reader.readToml(input, true);
function bombadilToTomlTestAtomicValue(input) {
    switch (input.type) {
        case toml.atomicInteger: {
            return { type: 'integer', value: input.image };
        }
        case toml.atomicFloat: {
            return { type: 'float', value: input.value.toString() };
        }
        case toml.atomicBoolean: {
            return { type: 'bool', value: input.image.toString() };
        }
        case toml.atomicString: {
            return { type: 'string', value: input.value };
        }
        case toml.localDateTime: {
            return { type: 'datetime', value: input.image };
        }
        case toml.offsetDateTime: {
            return { type: 'datetime', value: input.image };
        }
        case toml.localDate: {
            return { type: 'datetime', value: input.image };
        }
        case toml.localTime: {
            return { type: 'datetime', value: input.image };
        }
        default: {
            throw 'eh!?';
        }
    }
}
function bombadilToTomlTest(input) {
    if (input.hasOwnProperty('type')) {
        return bombadilToTomlTestAtomicValue(input);
    }
    else if (input instanceof Array) {
        return { type: 'array', value: input.map(bombadilToTomlTest) };
    }
    else {
        var newObj = {};
        for (var property in input) {
            newObj[property] = bombadilToTomlTest(input[property]);
        }
        return newObj;
    }
}
if (reader.errors.length > 0) {
    process.exit(1);
}
console.log(JSON.stringify(bombadilToTomlTest(reader.result), null, 2));
process.exit(0);
