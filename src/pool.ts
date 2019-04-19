// export class Uint8Pool {
//   private readonly pool = new Map<number, Uint8Array[]>();
//
//   public get(length: number) {
//     let arrays = this.pool.get(length);
//     if (!arrays || arrays.length === 0) {
//       return new Uint8Array(length);
//     }
//     return arrays.pop();
//   }
//
//   public put(arr: Uint8Array) {
//     let arrays = this.pool.get(arr.length);
//     if (!arrays) arrays = [];
//     arrays.push(arr);
//     this.pool.set(arr.length, arrays);
//   }
// }
//
// export const BytePool = new Uint8Pool();
