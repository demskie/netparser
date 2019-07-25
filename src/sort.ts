import { Network } from "./network";

const BEFORE = -1;
const EQUALS = 0;
const AFTER = 1;

export function isSorted(networks: Network[]) {
  if (networks.length > 1) {
    for (var i = 1; i < networks.length; i++) {
      var x = networks[i - 1].compare(networks[i]);
      if (x === AFTER || x === null) return false;
    }
  }
  return true;
}

export function binarySearchForInsertionIndex(network: Network, sortedNetworks: Network[]) {
  if (!sortedNetworks || sortedNetworks.length === 0) return 0;
  let left = 0;
  let right = sortedNetworks.length - 1;
  while (left < right) {
    let middle = Math.floor((left + right) / 2);
    switch (sortedNetworks[middle].compare(network)) {
      case EQUALS:
        return middle;
      case BEFORE:
        left = middle + 1;
        break;
      case AFTER:
        right = middle - 1;
        break;
    }
  }
  if (sortedNetworks[left].compare(network) === BEFORE) return left + 1;
  return left;
}

export function insertionSort(networks: Network[]) {
  const sorted = [] as Network[];
  networks.forEach((net: Network) => {
    var idx = binarySearchForInsertionIndex(net, sorted);
    sorted.splice(idx, 0, net);
  });
  return sorted;
}

function msdRadixSort(networks: Network[], start: number, stop: number, byteIndex: number) {
  if (start >= stop - 1) return;
  const runningPrefixSum = new Array(256) as number[];
  const offsetPrefixSum = new Array(256) as number[];
  const counts = runningPrefixSum;
  for (let i = 0; i < counts.length; i++) {
    counts[i] = 0;
  }

  // count each occurance of byte value
  for (let i = start; i < stop; i++) {
    let byteValue: number;
    switch (byteIndex) {
      case -1:
        byteValue = networks[i].addr.bytes().length;
        break;
      case 16:
        byteValue = networks[i].cidr();
        break;
      default:
        if (byteIndex < networks[i].addr.bytes().length) {
          byteValue = networks[i].addr.bytes()[byteIndex];
        } else {
          byteValue = 0;
        }
    }
    counts[byteValue]++;
  }
  let lastCount = counts[counts.length - 1];

  // initialize runningPrefixSum
  let total = 0;
  let oldCount = 0;
  for (let i = 0; i < 256; i++) {
    oldCount = counts[i];
    runningPrefixSum[i] = total;
    total += oldCount;
  }

  // initialize offsetPrefixSum (american flag sort)
  for (let i = 0; i < 256; i++) {
    if (i < 255) {
      offsetPrefixSum[i] = runningPrefixSum[i + 1];
    } else {
      offsetPrefixSum[i] = runningPrefixSum[i] + lastCount;
    }
  }

  // in place swap and sort by value
  let redIndex = start;
  let redValue = 0;
  while (redIndex < stop) {
    switch (byteIndex) {
      case -1:
        redValue = networks[redIndex].addr.bytes().length;
        break;
      case 16:
        redValue = networks[redIndex].cidr();
        break;
      default:
        if (byteIndex < networks[redIndex].addr.bytes().length) {
          redValue = networks[redIndex].addr.bytes()[byteIndex];
        } else {
          redValue = 0;
        }
    }
    let blueIndex = start + runningPrefixSum[redValue];
    if (runningPrefixSum[redValue] < offsetPrefixSum[redValue]) {
      runningPrefixSum[redValue]++;
      if (redIndex === blueIndex) {
        redIndex++;
      } else {
        let oldRedNetwork = networks[redIndex];
        networks[redIndex] = networks[blueIndex];
        networks[blueIndex] = oldRedNetwork;
      }
    } else {
      redIndex++;
    }
  }

  // recurse and sort lower bits
  if (byteIndex < 16) {
    let lastPrefixSum = 0;
    for (var i = 0; i < runningPrefixSum.length; i++) {
      if (runningPrefixSum[i] !== lastPrefixSum) {
        msdRadixSort(networks, start + lastPrefixSum, start + runningPrefixSum[i], byteIndex + 1);
      }
      lastPrefixSum = runningPrefixSum[i];
    }
  }
}

export function radixSort(networks: Network[]) {
  msdRadixSort(networks, 0, networks.length, -1);
}
