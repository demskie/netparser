import * as Benchmark from "benchmark";
import * as ipv4 from "../ipv6";
import * as sort from "../sort";
import { Network } from "../network";
import { fixedWidth } from "./formatters";

const e2Alpha = Array.from(Array(1e2), () => ipv4.randomNetwork());
const e2Bravo = Array.from(e2Alpha, (net: Network) => net.duplicate());
const e2Charlie = Array.from(e2Alpha, (net: Network) => net.duplicate());

const e3Alpha = Array.from(Array(1e3), () => ipv4.randomNetwork());
const e3Bravo = Array.from(e3Alpha, (net: Network) => net.duplicate());
const e3Charlie = Array.from(e3Alpha, (net: Network) => net.duplicate());

const e4Alpha = Array.from(Array(1e4), () => ipv4.randomNetwork());
const e4Bravo = Array.from(e4Alpha, (net: Network) => net.duplicate());
const e4Charlie = Array.from(e4Alpha, (net: Network) => net.duplicate());

const e5Alpha = Array.from(Array(1e5), () => ipv4.randomNetwork());
const e5Bravo = Array.from(e5Alpha, (net: Network) => net.duplicate());
const e5Charlie = Array.from(e5Alpha, (net: Network) => net.duplicate());

new Benchmark.Suite("sort.bench.ts")

  .add(fixedWidth("sort n=100 (native)", 30), () => {
    sort.nativeSort(e2Alpha);
  })

  .add(fixedWidth("sort n=100 (insertion)", 30), () => {
    sort.insertionSort(e2Bravo);
  })

  .add(fixedWidth("sort n=100 (radix msd)", 30), () => {
    sort.radixSort(e2Charlie);
  })

  .add(fixedWidth("sort n=1000 (native)", 30), () => {
    sort.nativeSort(e3Alpha);
  })

  .add(fixedWidth("sort n=1000 (insertion)", 30), () => {
    sort.insertionSort(e3Bravo);
  })

  .add(fixedWidth("sort n=1000 (radix msd)", 30), () => {
    sort.radixSort(e3Charlie);
  })

  .add(fixedWidth("sort n=10000 (native)", 30), () => {
    sort.nativeSort(e4Alpha);
  })

  .add(fixedWidth("sort n=10000 (insertion)", 30), () => {
    sort.insertionSort(e4Bravo);
  })

  .add(fixedWidth("sort n=10000 (radix msd)", 30), () => {
    sort.radixSort(e4Charlie);
  })

  .add(fixedWidth("sort n=100000 (native)", 30), () => {
    sort.nativeSort(e5Alpha);
  })

  .add(fixedWidth("sort n=100000 (insertion)", 30), () => {
    sort.insertionSort(e5Bravo);
  })

  .add(fixedWidth("sort n=100000 (radix msd)", 30), () => {
    sort.radixSort(e5Charlie);
  })

  .on("complete", function() {
    console.log(`'${this.name}' output:`);
    this.forEach((bench: Benchmark) => {
      console.log(bench.toString());
    });
  })

  .run();
