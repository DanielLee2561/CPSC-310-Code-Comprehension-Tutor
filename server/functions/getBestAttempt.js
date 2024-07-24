function getBestAttempt (attempts) {
	let attemptBest = null;
	let scoreBest = 0;
	let timeBest = Infinity;

	for (let i = 0; i < attempts.length; i++) {
		let attemptNew = attempts[i];
		let scoreNew = attemptNew.testCorrect;
		let timeNew = attemptNew.duration;
		if (attemptNew.inProgress == false) {
		if (scoreBest < scoreNew || scoreBest == scoreNew && timeNew < timeBest) {
			attemptBest = attemptNew;
			scoreBest = attemptBest.testCorrect;
			timeBest = timeNew;
		}
		}
	}

	return attemptBest;
}

export { getBestAttempt };