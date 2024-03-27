extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;
use std::str;
use regex::Regex;
use md5::{Digest, Md5};
use sha1::{Digest as SHA1Digest, Sha1};

#[wasm_bindgen]
pub fn convert_trip(key: &str, column: i32, shatrip: bool) -> String {
    let mut column = column;
    let mut trip = String::new();
    let key = if key.is_empty() { String::new() } else { key.to_owned() };

    // cryptのときの桁取得
    column *= -1;

    if key.len() >= 12 {
        // 先頭1文字の取得
        let mark = key.chars().next().unwrap();

        if mark == '#' || mark == '$' {
            // 生キー
            if let Some(captures) = Regex::new(r"^#([0-9a-zA-Z]{16})([./0-9A-Za-z]{0,2})$").unwrap().captures(&key) {
                let key2 = &captures[1];
                let salt = &captures[2];
                let salt = &format!("{}{}", salt, "..").chars().take(2).collect::<String>();

                // 0x80問題再現
                let key2 = key2.replace("\u{80}[\u{00}-\u{ff}]*$", "");

                trip = String::from(&crypt(&key2, &salt)[column as usize..]);
            }
            // 将来の拡張用
            else {
                trip = String::from("???");
            }
        }
        // SHA1(新仕様)トリップ
        else if shatrip {
            let mut sha1 = sha1(&key.clone().into_bytes());
            sha1.truncate(12);
            trip = String::from(&sha1.replace("+", "."));
        }
    }

    // 従来のトリップ生成方式
    if trip.is_empty() {
        let salt = if key.len() > 2 { &key[1..3] } else { "" };
        let salt = &format!("{}{}", salt, "H.");
        let salt = salt.chars().map(|c| if c < '.' || c > 'z' { '.' } else { c }).collect::<String>();

        // 0x80問題再現
        let key = key.replace("\u{80}[\u{00}-\u{ff}]*$", "");

        trip = String::from(&crypt(&key, &salt)[column as usize..]);
    }

    trip
}

fn sha1(data: &[u8]) -> String {
    let mut hasher = Sha1::new();
    hasher.update(data);
    let result = hasher.finalize();
    format!("{:x}", result)
}
fn crypt(key: &str, salt: &str) -> String {
    let mut hasher = Md5::new();
    hasher.update(key);
    hasher.update(salt);
    let result = hasher.finalize();
    format!("{:x}", result)
}