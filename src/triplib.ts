import * as IconvCP932 from "iconv-cp932";
import {Crypt} from "./crypt";
import { crypt } from 'crypt3-md5';

export async function trip12(key: any) {
  const encoder = new TextEncoder();
  key = encoder.encode(key);
  if (key.length <= 12) {return 'errerrr'}
  key = await crypto.subtle.digest('SHA-1',key)
  key = btoa(key)
  key = key.slice(0, 12);
  return key;
}

export async function name(key:any) {
  // saltの処理
  let salt = key.slice(1, 3);
  salt = salt ?? "";
  salt += "H.";
  salt = salt.replace(/[^\.-z]/g, ".");
  salt = salt.replace(/[:;<=>?@[\\]^_`]/g, (c) => "ABCDEFGabcdef"[":;<=>?@[\\]^_`".indexOf(c)]);
  //ここまで
  // Reproduce the 0x80 problem.
  key = key.replace(/\x80[\x00-\xff]*$/, "");
  let trip = crypt((key), (salt.slice(2))).slice(-10);
  return trip;
}

export function trip10raw(tripkey: string): string {
    const match = tripkey.match(/^#([0-9a-zA-Z]{16})([.\/0-9A-Za-z]{0,2})$/);
    if (!match) {
        throw new Error('Invalid tripkey format');
    }
    const asciiCode = match[1];
    let salt = match[2];

    // CP932に変換
    // const cp932KeyBuffer = IconvCP932.encode(asciiCode);
    // const cp932Key = cp932KeyBuffer.toString();

    salt = (String(salt) + '..').slice(0, 2);

    // 0x80問題再現
    // 0x80より後ろを切り捨てる
    // const nullIndex = cp932Key.indexOf('\x80');
    // const truncatedCp932Key = nullIndex !== -1 ? cp932Key.slice(0, nullIndex) : cp932Key;

    // Crypt関数を使用してtrip生成
    // Reproduce the 0x80 problem.
    const key = asciiCode.replace(/\x80[\x00-\xff]*$/, "");
    const trip = Crypt(key, salt).slice(-10);

    return trip;
}


// var target;
// var Csalt = [46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46.46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46];
let key
function keyDecode(keys) {
    let esc = {
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
      "&": "&amp;"
    };
    var base16 = [];
    var text = "";
    key = keys.filter(Boolean);
    for (var i = 0; i < key.length; i++) {
      base16.push(key[i].toString(16));
    }
    let encodedURI = '%' + base16.join('%');
    console.log(encodedURI.split('%').join(' '), key);
    text = decodeURIComponent(encodedURI).replace(/[&'"<>]/g, match => esc[match]) + (new Array(11 - key.length)).join(".");
    return text;
  }
  // トリップをいい感じにしてるところなのかな?
  function tripDecode(tripList) {
    return String.fromCharCode.apply(null, tripList.slice(1, ));
  }
// // 生成
// // speed: 1秒あたりのtrip生成速度
// // target: 検索対象
// // @return 結果
// function UnkoTripFinderMain(key) {
//   console.log(target, speed);
//   let len = target.length;

//   var pass = [, , , , , , , , , ];
//   var salt;
//   var trip;
//   var t = 0;
//   var tripList = [];
//   var by = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
//   var byte;
//   var asc;
//   var rnd;
//   // 実際に生成してるところ
//   while (t < speed) {
//     //ascii 33-126
//     byte = 0;
//     pass = [, , , , , , , , , ];
//     while (byte < 8) {
//       if (by[byte] < 0.19512) {
//         rnd = Math.floor(Math.random() * 1920);
//         pass[byte] = (rnd - rnd % 64) / 64 + 194;
//         byte++;
//         pass[byte] = rnd % 64 + 128;
//         byte++;
//       } else if (0.97560 < by[byte]) {
//         rnd = Math.floor(Math.random() * 65536);
//         pass[byte] = (rnd - rnd % 4096) / 4096 + 224;
//         byte++;
//         pass[byte] = (rnd % 4096 - rnd % 64) / 64 + 128;
//         byte++;
//         pass[byte] = rnd % 64 + 128;
//         byte++;
//       } else {
//         asc = Math.floor(Math.random() * 94) + 33;
//         if (asc == 60) {
//           asc = 32;
//         }
//         if (asc == 34) {
//           asc = 31;
//         }
//         if (asc == 38) {
//           asc = 30;
//         }
//         if (asc == 62) {
//           asc = 29;
//         }
//         pass[byte] = asc;
//         byte++;
//       }
//     }
//     //繰り返しここまで
//     trip = crypt.Crypt(pass, [Csalt[pass[1]], Csalt[pass[2]]]);
//     var c = true;
//     for (var j = len - 1; j >= 0; j--) {
//       c = (trip[j + 1] == target[j] && c);
//     }
//     if (c) {
//       tripList.push([trip.slice(), pass.slice()]);
//     }
//     t++;
//   }
//   var text = "";
//   //なにこれ?
//   for (var i = 0; i < tripList.length; i++) {
//     text += "<br />◆" + tripDecode(tripList[i][0]) + " : #" + keyDecode(tripList[i][1]);
//     console.log(tripList[i]);
//   }
// }

// function keybase16(key) {
//   var text = "";
//   var base16 = (new TextEncoder('utf-8')).encode(key).slice(0, 8);
//   for (var i = 0; i < base16.length; i++) {
//     text += base16[i].toString(16);
//   }
//   text = text + String.fromCharCode(Csalt[base16[1]]) + String.fromCharCode(Csalt[base16[2]]);
//   return text;
// }
// // 生キー変換(完了)
// function changeRaw(key:any) {
//   encodeURIComponent(key);
//   if (key.match(/^#.+/)) {
//     return "##" + keybase16(key.slice(1, ))
//   } else {
//     return "変換できん"
//   }
// }
// // スピードテスト(完了)
// // @return speed(1秒あたりのtrip生成速度)
// function speedTest(target) {
//   On = false;
//   tripCounter = 0;
//   let now = new Date();
//   UnkoTripFinderMain([1, 1, 1, 1, 1, 1, 1, 1], 4000);
//   let stime = new Date();
//   var speed = Math.floor(4000000 / (stime.getTime() - now.getTime()));
//   return speed
//   On = true;
// }