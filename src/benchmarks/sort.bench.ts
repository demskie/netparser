import * as Benchmark from "benchmark";
import * as ipv4 from "../ipv6";
import * as sort from "../sort";
import { Network } from "../network";

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

  .add("\tsort n=100 (native)\t", () => {
    sort.nativeSort(e2Alpha);
  })

  .add("\tsort n=100 (insertion)\t", () => {
    sort.insertionSort(e2Bravo);
  })

  .add("\tsort n=100 (radix msd)\t", () => {
    sort.radixSort(e2Charlie);
  })

  .add("\tsort n=1000 (native)\t", () => {
    sort.nativeSort(e3Alpha);
  })

  .add("\tsort n=1000 (insertion)\t", () => {
    sort.insertionSort(e3Bravo);
  })

  .add("\tsort n=1000 (radix msd)\t", () => {
    sort.radixSort(e3Charlie);
  })

  .add("\tsort n=10000 (native)\t", () => {
    sort.nativeSort(e4Alpha);
  })

  .add("\tsort n=10000 (insertion)", () => {
    sort.insertionSort(e4Bravo);
  })

  .add("\tsort n=10000 (radix msd)", () => {
    sort.radixSort(e4Charlie);
  })

  .add("\tsort n=100000 (native)\t", () => {
    sort.nativeSort(e5Alpha);
  })

  .add("\tsort n=100000 (insertion)", () => {
    sort.insertionSort(e5Bravo);
  })

  .add("\tsort n=100000 (radix msd)", () => {
    sort.radixSort(e5Charlie);
  })

  .on("complete", function() {
    console.log(`'${this.name}' output:`);
    this.forEach((bench: Benchmark) => {
      console.log(bench.toString());
    });
  })

  .run();
