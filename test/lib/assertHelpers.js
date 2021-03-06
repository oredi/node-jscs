var assert = require('assert');
var Checker = require('../../lib/checker');

var AssertHelpers = {

    /**
     * Assert that the input fails with a certain number of errors and when fixed matches output with no errors.
     *
     * @param {Object} options
     * @param {String} options.name the name of the test that will be put in the describe block
     * @param {Object} options.rules the object that will be passed to checker.configure
     * @param {String} options.input the input string to check
     * @param {String} options.output the output string that input should match after being fixed
     * @param {Number} [options.errors='1'] the expected number of errors when checking input
     */
    reportAndFix: function(options) {
        assert.equal(typeof(options), 'object');
        assert.equal(typeof(options.name), 'string');
        assert.equal(typeof(options.rules), 'object');
        assert.equal(typeof(options.input), 'string');
        assert.equal(typeof(options.output), 'string');

        if (options.errors !== undefined) {
            assert.equal(typeof(options.errors), 'number');
        }

        options.errors = options.errors === undefined ? 1 : options.errors;

        function check() {
            var checker;

            beforeEach(function() {
                checker = new Checker();
                checker.registerDefaultRules();
                checker.configure(options.rules);
            });

            it('report', function() {
                assert(checker.checkString(options.input).getErrorCount() === options.errors);
            });

            it('fix', function() {
                var result = checker.fixString(options.input);
                assert(result.errors.isEmpty());
                assert.equal(result.output, options.output);
            });
        }

        if (options.only) {
            describe.only(options.name, check);

        } else {
            describe(options.name, check);
        }
    }
};

module.exports = AssertHelpers;
