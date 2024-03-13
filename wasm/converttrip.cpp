#include <iostream>
#include <string>
#include <cstring>
#include <openssl/sha.h>

std::string ConvertTrip(std::string& key, int column, bool shatrip) {
    column *= -1;
    std::string trip = "";
    if (key.empty()) {
        key = "";
    }
    key = key;
    if (key.length() >= 12) {
        char mark = key[0];
        if (mark == '#' || mark == '$') {
            if (key.substr(0, 18) == "#([0-9a-zA-Z]{16})([./0-9A-Za-z]{0,2})$") {
                std::string key2 = key.substr(1, 16);
                std::string salt = key.substr(17, 2) + "..";
                key2 = key2;
                key2.erase(std::remove(key2.begin(), key2.end(), '\x80'), key2.end());
                char* c_key2 = new char[key2.length() + 1];
                strcpy(c_key2, key2.c_str());
                char* c_salt = new char[salt.length() + 1];
                strcpy(c_salt, salt.c_str());
                trip = crypt(c_key2, c_salt);
                trip = trip.substr(column);
                delete[] c_key2;
                delete[] c_salt;
            }
            else {
                trip = "???";
            }
        }
        else if (shatrip) {
            unsigned char digest[SHA_DIGEST_LENGTH];
            SHA1((unsigned char*)key.c_str(), key.length(), digest);
            std::string sha1_base64 = "";
            for (int i = 0; i < SHA_DIGEST_LENGTH; i++) {
                sha1_base64 += digest[i];
            }
            trip = sha1_base64.substr(0, 12);
            std::replace(trip.begin(), trip.end(), '+', '.');
        }
    }
    if (trip.empty()) {
        std::string salt = key.substr(1, 2);
        if (salt.empty()) {
            salt = "";
        }
        salt += "H.";
        std::replace_if(salt.begin(), salt.end(), [](char c) { return !(c == '.' || c == '-' || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')); }, '.');
        std::replace_if(salt.begin(), salt.end(), [](char c) { return c == ':' || c == ';' || c == '<' || c == '=' || c == '>' || c == '?' || c == '@' || c == '[' || c == '\\' || c == ']' || c == '^' || c == '_'; }, [](char c) { return c + 7; });
        key = key;
        key.erase(std::remove(key.begin(), key.end(), '\x80'), key.end());
        char* c_key = new char[key.length() + 1];
        strcpy(c_key, key.c_str());
        char* c_salt = new char[salt.length() + 1];
        strcpy(c_salt, salt.c_str());
        trip = crypt(c_key, c_salt);
        trip = trip.substr(column);
        delete[] c_key;
        delete[] c_salt;
    }
    return trip;
}

