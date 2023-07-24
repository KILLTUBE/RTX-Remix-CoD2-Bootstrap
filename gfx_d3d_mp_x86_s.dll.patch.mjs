import { readFileSync, writeFileSync } from 'fs';
/**
 * @param {string} name 
 * @returns {Uint8Array}
 */
async function readBin(name) {
  const res = await readFileSync(name);
  const buf = new Uint8Array(res);
  return buf;
}
/**
 * Turns 144 into 0x90 and 0 into 0x00 etc.
 * @param {number} num 
 * @returns {string}
 */
function niceHex(num) {
  return '0x' + num.toString(16).padStart(2, '0');
}
const changed  = await readBin('gfx_d3d_mp_x86_s.dll');
const original = await readBin('gfx_d3d_mp_x86_s.dll-original');
function compare() {  
  for (let i = 0; i < original.length; i++) {
    if (changed[i] !== original[i]) {
      const o = niceHex(original[i]);
      const c = niceHex(changed[i]);
      console.log(`  arr[${niceHex(i)}] = ${c}; // was ${o}`);
    }
  }
}
/**
 * Address in IDA is 0x1000 + that hex, e.g. 0x100093d5
 * @todo make notes and stuff to explain
 * @param {Uint8Array} arr 
 */
function patchInPlace(arr) {
  // ...
  arr[0x80de] = 0x90; // was 0x74
  arr[0x80df] = 0x90; // was 0x71
  // ...
  arr[0x8188] = 0x90; // was 0x0f
  arr[0x8189] = 0x90; // was 0x85
  // ...
  arr[0x818a] = 0x90; // was 0x93
  arr[0x818b] = 0x90; // was 0x01
  arr[0x818c] = 0x90; // was 0x00
  arr[0x818d] = 0x90; // was 0x00
  // ...
  arr[0x81a3] = 0x90; // was 0x0f
  arr[0x81a4] = 0x90; // was 0x85
  arr[0x81a5] = 0x90; // was 0xb6
  arr[0x81a6] = 0x90; // was 0x00
  arr[0x81a7] = 0x90; // was 0x00
  arr[0x81a8] = 0x90; // was 0x00
  // ...
  arr[0x81b0] = 0x90; // was 0x74
  arr[0x81b1] = 0x90; // was 0x25
  // ...
  arr[0x81e7] = 0x90; // was 0x0f
  arr[0x81e8] = 0x90; // was 0x8e
  arr[0x81e9] = 0x90; // was 0x34
  arr[0x81ea] = 0x90; // was 0x01
  arr[0x81eb] = 0x90; // was 0x00
  arr[0x81ec] = 0x90; // was 0x00
  // ...
  arr[0x8208] = 0x90; // was 0x74
  arr[0x8209] = 0x90; // was 0x37
  // ...
  arr[0x82f1] = 0x90; // was 0x7e
  arr[0x82f2] = 0x90; // was 0x2e
  // ...
  arr[0x93c4] = 0x90; // was 0x0f
  arr[0x93c5] = 0x90; // was 0x85
  arr[0x93c6] = 0x90; // was 0xab
  arr[0x93c7] = 0x90; // was 0x00
  arr[0x93c8] = 0x90; // was 0x00
  arr[0x93c9] = 0x90; // was 0x00
  // ...
  arr[0x93d5] = 0x90; // was 0x74
  arr[0x93d6] = 0x90; // was 0x1e
  // ...
  arr[0x9496] = 0x90; // was 0x0f
  arr[0x9497] = 0x90; // was 0x84
  arr[0x9498] = 0x90; // was 0xc9
  arr[0x9499] = 0x90; // was 0x00
  arr[0x949a] = 0x90; // was 0x00
  arr[0x949b] = 0x90; // was 0x00
  // ...
  arr[0x96b1] = 0x90; // was 0x74
  arr[0x96b2] = 0x90; // was 0x0b
  // ...
  arr[0x1fd7c] = 0x90; // was 0x74
  arr[0x1fd7d] = 0x90; // was 0x15  
  // skip could which would print "MAX_SCENE_SURFS_SIZE exceeded - not dra"...
  // if before that:
  // arr[0x1FAB3 + 0] = 0x90;
  // arr[0x1FAB3 + 1] = 0x90;
  // this will ALWAYS run the code
  //arr[0x1FACE + 0] = 0x90;
  //arr[0x1FACE + 1] = 0x90;
  // this nukes it
  for (let i = 0x1FACE; i < 0x1FAE5; i++) {
    arr[i] = 0x90;
  }

  // in function 0x1001FC70, another case of "MAX_SCENE_SURFS_SIZE exceeded - not dra"
  //arr[0x1FE24 + 0] = 0x90; // was 0x76
  //arr[0x1FE24 + 1] = 0x90; // was 0x45  
  // this crashes since we remove all MAX_SCENE_SURFS_SIZE limit conditions... seems to be a hard-limit which starts overwriting memory or something
  if (false) {
    for (let i = 0x1FE3F; i < 0x1FE56; i++) {
      arr[i] = 0x90;
    }
  }
}
function patch() {
  patchInPlace(original);
  writeFileSync('gfx_d3d_mp_x86_s.dll', original);
}
//compare();
patch();
