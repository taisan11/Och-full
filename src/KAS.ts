import * as IconvCP932 from "iconv-cp932";
// import {Crypt} from "./crypt";
// import * as crypto from "crypto";

function formatUnixTime(unixTime: number): string {
  // UNIXタイムをミリ秒に変換
  const date = new Date(unixTime * 1000);

  // 年月日と曜日を取得
  const ymd = date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });

  // 時分秒を取得
  const hms = date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // ミリ秒を取得
  const ms = ('00' + date.getMilliseconds()).slice(-2);

  // フォーマットを組み立てる
  return `${ymd} ${hms}.${ms}`;
}

export async function KAS(mes:string,name:string,mail:string,time:number){
    const kkk = NewMES(mes)
    const lll = await NES(name,mail)
    const ttt = formatUnixTime(time)
    return {
      mes:kkk,
      name:lll.name,
      mail:lll.mail,
      time:ttt
    }
}

function NewMES(input: string | null): string {
  if (!input) return '';

  // HTML特殊文字を変換
  const htmlEscaped = input.replace(/[&<>"']/g, function(match) {
      return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
      }[match];
  });

  // 改行をbrタグに変換
  const newlineEscaped = htmlEscaped.replace(/\r?\n/g, '<br/>');
  const numLinkConverted = newlineEscaped.replace(/\b(\d+)\b/g, '<a href="#$1">&gt;&gt;$1</a>');
  return numLinkConverted;
}

async function NES(input: string,mail:string) {
    if (!input) {
      return {"name": "名無しのボンベイ", "mail": mail};
    }
    const match = input.match(/#(\d+)/); // #の後ろの数字を取得する正規表現
    let length = 0;

    if (match && match[1]) {
    length = match[1].length; // 取得した数字の長さ（桁数）を計算
    }

    if (mail == "koskarure0192") {
        return {"name":"管理者★★","mail":"kanrisurumono"}
    }

    const map: { [key: string]: string } = {
    '◆': '◇',
    '★': '☆',
    '\n': ''
    };
    if (input == null){return '';}
    const convertedInput = input.replace(/[◆★\n]/g, function(m) { return map[m]; });
    let trip = '';
    if (length > 0) {
    // trip = `◆`+await convertTrip(match, length, true);
    trip = `◆`+`現在一時的にトリップは使用できません`
  }
    return {"name":`${convertedInput.replace(/#.*/, '')}${trip}`,"mail":mail}
}


/**
 * トリップ作成関数 - convertTrip
 * @param key トリップキー(リファレンス)
 * @param column 桁数
 * @param shatrip 12桁トリップON/OFF
 * @returns 変換後文字列
 */
// function convertTrip(key: string | null | undefined, column: number, shatrip: boolean): string {
//   column *= -1;
//   let trip = '';

//   if (!key) {
//       key = '';
//   }

//   key = Buffer.from(key, 'utf16le').toString('cp932');

//   if (key.length >= 12) {
//       const mark = key[0];

//       if (mark === '#' || mark === '$') {
//           if (key.match(/^#([0-9a-zA-Z]{16})([./0-9A-Za-z]{0,2})$/)) {
//               const key2 = Buffer.from(key.match(/^#([0-9a-zA-Z]{16})([./0-9A-Za-z]{0,2})$/)[1], 'hex');
//               const salt = (key.match(/^#([0-9a-zA-Z]{16})([./0-9A-Za-z]{0,2})$/)[2] + '..').substring(0, 2);

//               const key2Str = key2.toString('binary').replace(/\x80[\x00-\xff]*$/, '');

//               trip = Crypt(key2Str, salt).substring(column);
//           } else {
//               trip = '???';
//           }
//       } else if (shatrip) {
//           const sha1hash = crypto.createHash('sha1').update(key).digest('base64');
//           trip = sha1hash.substring(0, 12).replace(/\+/g, '.');
//       }
//   }

//   if (trip === '') {
//       let salt = key.substring(1, 3) || '';
//       salt += 'H.';
//       salt = salt.replace(/[^\.-z]/g, '.');
//       salt = salt.replace(/:;<=>?@[\\]^_`/g, 'ABCDEFGabcdef');

//       key = key.replace(/\x80[\x00-\xff]*$/, '');

//       trip = Crypt(key, salt).substring(column);
//   }

//   return trip;
// }

// async function convertTrip(key: string, column: number, shatrip: boolean): Promise<string> {
//     // cryptのときの桁取得
//     column *= -1;
  
//     let trip = '';
  
//     key = key || '';
  
//     // // UTF-8エンコーディングを使用
//     const encoder = new TextEncoder();
//     // const decoder = new TextDecoder('utf-8');
//     const keyBytes = encoder.encode(key);
//     // key = decoder.decode(keyBytes);
//     key = IconvCP932.decode(keyBytes);
  
//     if (key.length >= 12) {
//       // 先頭1文字の取得
//       const mark = key.charAt(0);
  
//       if (mark === '#' || mark === '$') {
//         // 生キー
//         const match = key.match(/^#([0-9a-zA-Z]{16})([./0-9A-Za-z]{0,2})$/);
  
//         if (match) {
//           const key2 = Buffer.from(match[1], 'hex');
//           const salt = (match[2] + '..').substring(0, 2);
  
//           // 0x80問題再現
//           key2.fill(0x80, key2.length - 1);
  
//           const keyBuffer = await crypto.subtle.importKey('raw', key2, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
//           const signature = await crypto.subtle.sign('HMAC', keyBuffer, encoder.encode(salt));
  
//           const signatureArray = Array.from(new Uint8Array(signature));
//           trip = btoa(String.fromCharCode(...signatureArray)).substring(0, 12);
//           trip = trip.replace(/\+/g, '.');
//         } //else {
//           // 将来の拡張用
//           // trip = '★とりっぷえらー';
//         // }
//       } else if (shatrip) {
//         // SHA1(新仕様)トリップ
//         const keyBuffer = await crypto.subtle.digest('SHA-1', encoder.encode(key));
//         const signatureArray = Array.from(new Uint8Array(keyBuffer));
//         trip = btoa(String.fromCharCode(...signatureArray)).substring(0, 12);
//         trip = trip.replace(/\+/g, '.');
//       }
//     }
  
//     // 従来のトリップ生成方式
//     if (!trip) {
//       let salt = key.substring(1, 3) || '';
//       salt += 'H.';
//       salt = salt.replace(/[^\.-z]/g, '.');
//       salt = salt.replace(/:;<=>?@[\\]^_`/g, 'ABCDEFGabcdef');
  
//       // 0x80問題再現
//       key = key.replace(/\x80[\x00-\xff]*$/, '');
  
//       const keyBuffer = await crypto.subtle.importKey('raw', encoder.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
//       const signature = await crypto.subtle.sign('HMAC', keyBuffer, encoder.encode(salt));
  
//       const signatureArray = Array.from(new Uint8Array(signature));
//       trip = btoa(String.fromCharCode(...signatureArray)).substring(0, 12);
//     }
//     if (trip == '') {
//       trip = '★トリップエラー';
//     }
//     return trip;
// }