import * as coreRefinements from "../shared/core-refinements"

let enumeratedRefinements = {};
for(var key in coreRefinements){
  enumeratedRefinements[key] = key;
}

export {enumeratedRefinements as enumeratedRefinements}

export function fetchRefinement(key){
  return coreRefinements[key];
}
