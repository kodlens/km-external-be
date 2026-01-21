import React from 'react'

export default function Ahocorasick() {

    
// class AhoCorasick {
//     constructor() {
//         this.trie = {};
//         this.output = {};
//         this.fail = {};
//     }

//     // Adds a pattern to the Trie
//     addPattern(pattern) {
//         let node = this.trie;
//         for (let char of pattern) {
//             if (!node[char]) {
//                 node[char] = {};
//             }
//             node = node[char];
//         }
//         if (!this.output[node]) {
//             this.output[node] = [];
//         }
//         this.output[node].push(pattern);
//     }

//     // Builds the failure links and outputs for the Trie
//     buildFailureLinks() {
//         let queue = [];
//         for (let char in this.trie) {
//             this.fail[this.trie[char]] = this.trie;
//             queue.push(this.trie[char]);
//         }

//         while (queue.length > 0) {
//             let node = queue.shift();

//             for (let char in node) {
//                 if (char === 'fail') continue;

//                 let failNode = this.fail[node];
//                 while (failNode && !failNode[char]) {
//                     failNode = this.fail[failNode];
//                 }

//                 this.fail[node[char]] = failNode ? failNode[char] : this.trie;
//                 this.output[node[char]] = (this.output[node[char]] || []).concat(this.output[this.fail[node[char]]] || []);

//                 queue.push(node[char]);
//             }
//         }
//     }

//     // Search the text for the patterns
//     search(text) {
//         let node = this.trie;
//         let results = [];

//         for (let i = 0; i < text.length; i++) {
//             let char = text[i];

//             while (node && !node[char]) {
//                 node = this.fail[node];
//             }

//             if (!node) {
//                 node = this.trie;
//                 continue;
//             }

//             node = node[char];

//             if (this.output[node]) {
//                 for (let pattern of this.output[node]) {
//                     results.push({ pattern, index: i - pattern.length + 1 });
//                 }
//             }
//         }

//         return results;
//     }
// }

// // Example usage:
// let ac = new AhoCorasick();
// ac.addPattern("he");
// ac.addPattern("she");
// ac.addPattern("his");
// ac.addPattern("hers");

// ac.buildFailureLinks();

// let text = "ahishers";
// let matches = ac.search(text);

// for (let match of matches) {
//     console.log(`Found pattern "${match.pattern}" at index ${match.index}`);
// }


  return (
    <div>Ahocorasick</div>
  )
}

