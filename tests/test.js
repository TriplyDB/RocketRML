let assert = require('assert');

const parser = require('../index.js');


//TESTS FOR JSON

it('Basic straight mapping', async function(){
    let result = await parser.parseFile('./tests/straightMapping/mapping.ttl', './tests/straightMapping/out.json',false).catch((err) => { console.log(err); });
    assert.equal(result['http://schema.org/name'], "Tom A.");
    assert.equal(result['http://schema.org/age'], 15);
    assert.equal(result['@type'], 'http://schema.org/Person');
    assert.equal(Object.keys(result).length, 3);
});

it('Basic straight double mapping', async function(){
    let result = await parser.parseFile('./tests/straightDoubleMapping/mapping.ttl', './tests/straightDoubleMapping/out.json',false).catch((err) => { console.log(err); });
    assert.equal(result.length,2);
});

it('Nested mapping', async function(){
    let result = await parser.parseFile('./tests/nestedMapping/mapping.ttl', './tests/nestedMapping/out.json',false).catch((err) => { console.log(err); });
    assert.equal(result['http://mytestprefix.org/likesSports']['http://mytestprefix.org/name'][0], 'Tennis');
    assert.equal(result['http://mytestprefix.org/likesSports']['http://mytestprefix.org/name'][1], 'Football');
});


it('Test with deleting prefixes', async function(){
    let result = await parser.parseFile('./tests/straightMapping/mapping.ttl', './tests/straightMapping/out.json', true).catch((err) => { console.log(err); });
    assert.equal(result['name'], "Tom A.");
    assert.equal(result['age'], 15);
    assert.equal(result['@type'], 'Person');
    assert.equal(Object.keys(result).length, 3);
});

it('Basic straight mapping with array of input', async function(){
    let result = await parser.parseFile('./tests/straightMappingArray/mapping.ttl', './tests/straightMappingArray/out.json',false).catch((err) => { console.log(err); });
    assert.equal(result[0]['http://schema.org/name'], "Ben A.");
    assert.equal(result[0]['http://schema.org/age'], 15);
    assert.equal(result[0]['@type'], 'http://schema.org/Person');
    assert.equal(result[1]['http://schema.org/name'], "Tom B.");
    assert.equal(result[1]['http://schema.org/age'], 16);
    assert.equal(result[1]['@type'], 'http://schema.org/Person');
    assert.equal(Object.keys(result).length, 2);
});

it('Nested mapping with array of input', async function(){
    let result = await parser.parseFile('./tests/nestedMappingArray/mapping.ttl', './tests/nestedMappingArray/out.json',true).catch((err) => { console.log(err); });
    assert.equal(result[0]['name'], "Ben A.");
    assert.equal(result[0].likesSports.name[0], "Tennis");
    assert.equal(result[0].likesSports.name[1], "Football");
    assert.equal(result[1]['name'], "Tom B.");
    assert.equal(result[1].likesSports.name[0], "Soccer");
    assert.equal(result[1].likesSports.name[1], "Baseball");
    assert.equal(Object.keys(result).length, 2);
});

it('Double-nested mapping', async function(){
    let result = await parser.parseFile('./tests/doubleNestedMapping/mapping.ttl', './tests/doubleNestedMapping/out.json',true).catch((err) => { console.log(err); });
    assert.equal(result['name'], "Tom A.");
    assert.equal(result['age'], "15");
    assert.equal(result['@type'], "Person");
    let likesSport=result['likesSports'];
    assert.equal(likesSport.name, "Basketball");
    assert.equal(likesSport['requires']['thing'][0], "ball");
    assert.equal(likesSport['requires']['thing'][1], "basket");
});

//TESTS FOR XML

it('Basic straight mapping XML', async function(){
    let result = await parser.parseFile('./tests/straightMappingXML/mapping.ttl', './tests/straightMappingXML/out.json',false).catch((err) => { console.log(err); });
    assert.equal(result['http://schema.org/name'], "Tom A.");
    assert.equal(result['http://schema.org/age'], 15);
    assert.equal(result['@type'], 'http://schema.org/Person');
    assert.equal(Object.keys(result).length, 3);
});

it('Basic straight double mapping XML', async function(){
    let result = await parser.parseFile('./tests/straightDoubleMappingXML/mapping.ttl', './tests/straightDoubleMappingXML/out.json',false).catch((err) => { console.log(err); });
    assert.equal(result.length,2);
});

it('Nested mapping XML', async function(){
    let result = await parser.parseFile('./tests/nestedMappingXML/mapping.ttl', './tests/nestedMappingXML/out.json',false).catch((err) => { console.log(err); });
    assert.equal(result['http://mytestprefix.org/likesSports']['http://mytestprefix.org/name'][1], 'Tennis');
    assert.equal(result['http://mytestprefix.org/likesSports']['http://mytestprefix.org/name'][0], 'Football');
});


it('Test with deleting prefixes XML', async function(){
    let result = await parser.parseFile('./tests/straightMappingXML/mapping.ttl', './tests/straightMappingXML/out.json', true).catch((err) => { console.log(err); });
    assert.equal(result['name'], "Tom A.");
    assert.equal(result['age'], 15);
    assert.equal(result['@type'], 'Person');
    assert.equal(Object.keys(result).length, 3);
});

it('Basic straight mapping with array of input XML', async function(){
    let result = await parser.parseFile('./tests/straightMappingArrayXML/mapping.ttl', './tests/straightMappingArrayXML/out.json',false).catch((err) => { console.log(err); });
    assert.equal(result[0]['http://schema.org/name'], "Ben A.");
    assert.equal(result[0]['http://schema.org/age'], 15);
    assert.equal(result[0]['@type'], 'http://schema.org/Person');
    assert.equal(result[1]['http://schema.org/name'], "Tom B.");
    assert.equal(result[1]['http://schema.org/age'], 16);
    assert.equal(result[1]['@type'], 'http://schema.org/Person');
    assert.equal(Object.keys(result).length, 2);
});

it('Nested mapping with array of input XML', async function(){
    let result = await parser.parseFile('./tests/nestedMappingArrayXML/mapping.ttl', './tests/nestedMappingArrayXML/out.json',true).catch((err) => { console.log(err); });
    assert.equal(result[0]['name'], "Ben A.");
    assert.equal(result[0].likesSports.name[1], "Tennis");
    assert.equal(result[0].likesSports.name[0], "Football");
    assert.equal(result[1]['name'], "Tom B.");
    assert.equal(result[1].likesSports.name[1], "Soccer");
    assert.equal(result[1].likesSports.name[0], "Baseball");
    assert.equal(Object.keys(result).length, 2);
});


it('Double-nested mapping', async function(){
    let result = await parser.parseFile('./tests/doubleNestedMappingXML/mapping.ttl', './tests/doubleNestedMappingXML/out.json',true).catch((err) => { console.log(err); });
    assert.equal(result['name'], "Tom A.");
    assert.equal(result['age'], "15");
    assert.equal(result['@type'], "Person");
    let likesSport=result['likesSports'];
    assert.equal(likesSport.name, "Basketball");
    assert.equal(likesSport['requires']['thing'][0], "ball");
    assert.equal(likesSport['requires']['thing'][1], "basket");
});