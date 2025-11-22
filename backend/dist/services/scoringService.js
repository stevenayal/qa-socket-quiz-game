"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringService = void 0;
class ScoringService {
    static calculateScore(isCorrect, responseTimeMs) {
        if (!isCorrect)
            return 0;
        // Bonus = max(0, 50 - (responseTimeMs / 400))
        // This means if you answer instantly (0ms), you get 50 bonus.
        // If you answer at 20s (20000ms), 20000/400 = 50. 50-50 = 0 bonus.
        const bonus = Math.max(0, 50 - Math.floor(responseTimeMs / 400));
        return this.BASE_SCORE + bonus;
    }
}
exports.ScoringService = ScoringService;
ScoringService.BASE_SCORE = 100;
ScoringService.TIME_LIMIT_MS = 20000; // 20s
