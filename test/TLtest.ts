import {trip12,trip10raw} from "../src/triplib";

async function test() {
    console.log(await trip12('test1234kjiuk'))
    console.log(trip10raw('#52daa8cd814f4f6f..'))
}

test()