import { loadConfig, watchConfig } from "c12";

const ochmainconfig = {
    'default_name': '名無しさん',
}

async function Ochconfig() {
    const { config, configFile, layers } = await loadConfig({
        configFile: "ochmain",
        defaultConfig: ochmainconfig
    });
}