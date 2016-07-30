
let structures = {};
let enumeratedStructures = {};
function updateEnumeration(){
  for(var key in structures){
    enumeratedStructures[key] = key;
  }
}
export {enumeratedStructures as enumeratedStructures}

export function fetchStructure(key){
  return structures[key];
}

export function addStructure(key, value){
  structures[key] = value;
  updateEnumeration()
}
