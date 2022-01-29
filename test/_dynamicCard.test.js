import { trimContents } from '../src/_dynamicCard.js';

import { expect } from 'chai';

//const calculator = require('../src/calculator')

describe('_dynamic_Card.js', () => {
	describe('parseContents()', () => {
		it('should remove language labels', () => {
			const examples = [
				// [input, expected output],
				["misc text here!", "misc text here!"],
				["mais perto [P]", "mais perto"],
				["A praia [pt]", "A praia"],
				["A praia [pt]", "A praia"],
				["Gesticulate (E)", "Gesticulate"],
				["el acantilado -&gt; [PT]", "el acantilado -&gt; [PT]"],
				["El transbordador, el ferry ->[PT]", "El transbordador, el ferry"],
			];

			examples.forEach(pair => {
				console.log(pair)
				expect(pair.length).to.equal(2);
				console.log('testing: ' + pair[0])
				expect(trimContents(pair[0])).to.equal(pair[1]);
				
			});
			for (let pair of examples) {
			}
		});

	})

})
