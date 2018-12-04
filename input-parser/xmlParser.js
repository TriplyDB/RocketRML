const prefixhelper = require('../helper/prefixHelper.js');
const objectHelper = require('../helper/objectHelper.js');
const fs = require('fs');

const xpath = require('xpath')
    , dom = require('xmldom').DOMParser;

const parseXML = (data,currObject,prefixes,source, iterator)=>{
    console.log('Reading file...');
    let file = fs.readFileSync(source,"utf-8");
    console.log('Creating DOM...');
    let doc = new dom().parseFromString(file);
    console.log('DOM created!');
    let result= iterateDom(data,currObject,prefixes,iterator,doc);
    return result;
};

const iterateDom = (data,currObject,prefixes,iterator,doc) =>{
    let iteratorNodes ;
    if(iterator===undefined){
        iteratorNodes = doc;
        if(!iteratorNodes.length){
            iteratorNodes=[iteratorNodes];
        }
    }else{
        iteratorNodes = xpath.select(iterator, doc);
    }

    let subjectMapId= currObject.subjectMap['@id'];
    let subjectMap=objectHelper.findIdinObjArr(data,subjectMapId);
    subjectMap=prefixhelper.checkAndRemovePrefixesFromObject(subjectMap,prefixes);
    let subjectClass=subjectMap.class['@id'];
    subjectClass=prefixhelper.replacePrefixWithURL(subjectClass,prefixes);
    let result=[];
    if(subjectMap.termType){
        //we concider only BlankNode
        iteratorNodes.forEach(function(n){
            let obj={};
            obj['@type']=subjectClass;
            obj=doObjectMappings(currObject,data,iterator,prefixes,n,obj);
            result.push(obj);
        });
    }else{
        let template=subjectMap.template;
        let suffix=prefixhelper.checkAndRemovePrefixesFromStringWithBr(template,prefixes);
        let prefix=template.replace(suffix,'');
        suffix=suffix.replace('{','').replace('}',''); //TODO: nicer way of removing brackets
        let xp=suffix;
        iteratorNodes.forEach(function(node){
            let obj={};
            let nodes=xpath.select(xp,node);

            if(prefixes[prefix.replace(':','')]){
                prefix=prefixes[prefix.replace(':','')];
            }

            if(nodes.length>1){
                throw('ERROR: no multiple SubjectMapping ids allowed!');
            }

            obj['@id']=prefix+nodes[0].nodeValue;
            obj['@type']=subjectClass;
            obj=doObjectMappings(currObject,data,iterator,prefixes,node,obj);
            result.push(obj);
        });
    }
    if(result.length===1){
        result=result[0];
    }
    return result;
};

let doObjectMappings=(currObject,data,iterator,prefixes,node,obj)=>{
    //find objectMappings
    if(currObject.predicateObjectMap){
        let objectMapArray= currObject.predicateObjectMap;
        if(!Array.isArray(objectMapArray)){
            objectMapArray=[objectMapArray];
        }
        objectMapArray.forEach(function(o){
            let id=o['@id'];
            let mapping=objectHelper.findIdinObjArr(data,id);
            mapping=prefixhelper.checkAndRemovePrefixesFromObject(mapping,prefixes);
            let predicate=mapping.predicate['@id'];
            predicate=prefixhelper.replacePrefixWithURL(predicate,prefixes);
            let objectmap=objectHelper.findIdinObjArr(data,mapping.objectMap['@id']);
            objectmap=prefixhelper.checkAndRemovePrefixesFromObject(objectmap,prefixes);
            let reference=objectmap.reference;

            if (reference){
                let ns = xpath.select(reference,node);
                let arr=[];
                ns.forEach(function(n){
                    if(n.nodeValue){
                        arr.push(n.nodeValue);
                    }else{
                        let children=n.childNodes;
                        if(children){
                            for (let i=0; i<children.length; i++){
                                let c=children[i];
                                if(c.data){
                                    arr.push(c.data);
                                }
                            }
                        }
                    }

                });
                if(arr.length>0){
                    if(arr.length===1){
                        arr=arr[0];
                    }
                    obj[predicate]=arr;
                }
            }else{
                if(objectmap.parentTriplesMap &&objectmap.parentTriplesMap['@id']){
                    let nestedMapping=objectHelper.findIdinObjArr(data,objectmap.parentTriplesMap['@id']);
                    nestedMapping=prefixhelper.checkAndRemovePrefixesFromObject(nestedMapping,prefixes);
                    obj[predicate]=iterateDom(data,nestedMapping,prefixes,undefined,node);
                }
            }

        });
    }
    return obj;
};

module.exports.parseXML=parseXML;