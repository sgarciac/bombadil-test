import * as toml from '@sgarciac/bombadil'
import * as fs from "fs"
var input = fs.readFileSync('/dev/stdin', 'utf8');

var reader = new toml.TomlReader();

reader.readToml(input, true);

function bombadilToTomlTestAtomicValue(input: toml.TomlValue) {
    switch (input.type) {
        case toml.atomicInteger: {
            return { type: 'integer', value: input.value.toString() };
        }
        case toml.atomicFloat: {
            return { type: 'float', value: input.value.toString() };
        }
        case toml.atomicNotANumber: {
            return { type: 'float', value: input.image.toString() };
        }
        case toml.atomicInfinity: {
            return { type: 'float', value: input.image.toString() };
        }
        case toml.atomicBoolean: {
            return { type: 'bool', value: input.image.toString() };
        }
        case toml.atomicString: {
            return { type: 'string', value: input.value };
        }
        case toml.localDateTime: {
            return { type: 'local-datetime', value: input.image };
        }
        case toml.offsetDateTime: {
            return { type: 'datetime', value: input.image };
        }
        case toml.localDate: {
            return { type: 'local-date', value: input.image };
        }
        case toml.localTime: {
            return { type: 'local-time', value: input.image };
        }
        case toml.arrayType: {
            if (input.contents.length == 0 || input.contents[0].type != toml.inlineTable) {
                return { type: 'array', value: input.contents.map(bombadilToTomlTest) };
            } else {
                return input.contents.map(bombadilToTomlTest);
            }
        }
        case toml.inlineTable: {
            let newObj: { [key: string]: any } = {}
            for (let kv of input.bindings) {
                newObj[kv.keys[0]] = bombadilToTomlTest(kv.value);
            }
            return newObj;
        }
        default: {
            throw `eh!? ${JSON.stringify(input)}`;
        }
    }
}

function bombadilToTomlTest(input: any): any {
    if (input.hasOwnProperty('type')) {
        return bombadilToTomlTestAtomicValue(input);
    }
    else if (input instanceof Array) {
        return input.map(bombadilToTomlTest);
    }
    else {
        let newObj: { [key: string]: any } = {}
        for (let property in input) {
            newObj[property] = bombadilToTomlTest(input[property]);
        }
        return newObj;
    }
}

if (reader.errors.length > 0) {
    console.log(JSON.stringify(reader.errors));
    process.exit(1);
}
console.log(JSON.stringify(bombadilToTomlTest(reader.result), null, 2));
process.exit(0);

