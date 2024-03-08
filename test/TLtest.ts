import {trip12,trip10raw,name} from "../src/triplib";

async function test() {
    console.log(await trip12('test1234kjiuk'))
    console.log(trip10raw('#38376a65356a6b557j'))
    console.log(await name('st1234kjiuk'))
}

test()