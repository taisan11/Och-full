use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn convert_trip(key: &mut String, column: i32, shatrip: bool) -> String {
    let mut trip = String::new();
    if key.is_empty() {
        *key = String::new();
    }
    let key_encoded = key.encode("cp932").unwrap();
    if key_encoded.len() >= 12 {
        let mark = &key_encoded[0..1];
        if mark == "#" || mark == "$" {
            if let Some(captures) = Regex::new(r"^#([0-9a-zA-Z]{16})([./0-9A-Za-z]{0,2})$").unwrap().captures(&key_encoded) {
                let key2 = hex::decode(&captures[1]).unwrap();
                let salt = &captures[2..].to_owned() + "..";
                let salt = &salt[0..2];
                let mut key2 = String::from_utf8_lossy(&key2).to_string();
                key2 = key2.replace("\u{80}", "");
                trip = crypt(&key2, salt).unwrap().chars().skip(column as usize).collect();
            } else {
                trip = String::from("???");
            }
        } else if shatrip {
            let mut sha = Sha1::new();
            sha.update(&key_encoded);
            let trip_bytes = sha.digest().bytes();
            let trip = base64::encode(&trip_bytes);
            trip = trip.chars().map(|c| if c == '+' { '.' } else { c }).collect();
        }
    }
    if trip.is_empty() {
        let salt = &key_encoded[1..3];
        let salt = if salt.is_empty() { String::new() } else { salt.to_owned() };
        let mut salt = salt + "H.";
        salt = salt.chars().map(|c| if !(".-z".contains(c)) { '.' } else { c }).collect();
        salt = salt.chars().map(|c| match c {
            ':' => 'A',
            ';' => 'B',
            '<' => 'C',
            '=' => 'D',
            '>' => 'E',
            '?' => 'F',
            '@' => 'G',
            '[' => 'a',
            '\\' => 'b',
            ']' => 'c',
            '^' => 'd',
            '_' => 'e',
            '`' => 'f',
            _ => c,
        }).collect();
        let mut key_encoded = key_encoded.replace("\u{80}", "");
        trip = crypt(&key_encoded, &salt).unwrap().chars().skip(column as usize).collect();
    }
    trip
}

