import * as chai from 'chai'; 
/**
 * Run the provided code and tests
 * @param {string} code - The code to evaluate
 * @param {Array} tests - The array of tests to run
 * @returns {Object} The result of the test run
 */
export function runTests(code, tests) {
    const failedTests = [];
    try {
        eval("global.foo = " + code); 
        tests.forEach(test => {
            try {
                eval(test.assertion); 
            } catch (assertionError) {
                failedTests.push({
                    title: test.title,
                    assertion: test.assertion,
                    error: assertionError.message
                });
            }
        });

        if (failedTests.length > 0) {
            throw new Error("Some tests failed");
        }
        
        return { success: true };

    } catch (err) {
        return { 
            success: false, 
            error: "Code or tests failed", 
            details: failedTests.length > 0 ? failedTests : err.message 
        };
    }
}