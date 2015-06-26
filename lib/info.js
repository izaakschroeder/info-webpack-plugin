
var chalk = require('chalk');

function WebpackInfoPlugin(options) {
	options = options || { };
	options.color = process.stdout.isTTY;
	this.options = options;
}

WebpackInfoPlugin.prototype.isStatsDisplayable = function(stats) {
	return this.options.stats && !stats.hasErrors() && !stats.hasWarnings();
}

WebpackInfoPlugin.prototype.displayStats = function(stats) {
	if (this.isStatsDisplayable(stats)) {
		console.log(stats.toString(this.options));
	}
}

WebpackInfoPlugin.prototype.isStateDisplayable = function() {
	return this.options.state;
}

WebpackInfoPlugin.prototype.displayState = function(state) {
	if (this.isStateDisplayable(state)) {
		if (state) {
			console.log('webpack: bundle is now ' + chalk.green('VALID') + '.');
		} else {
			console.log('webpack: bundle is now ' + chalk.red('INVALID') + '.');
		}
	}
}

WebpackInfoPlugin.prototype.apply = function info(compiler) {
	compiler.plugin('done', function(stats) {
		self.displayStats(stats);
		self.displayState(true);
	});
	compiler.plugin('invalid', function() {
		this.displayState(false);
	});
	compiler.plugin('watch-run', function(done) {
		this.displayState(false);
		done();
	});
	compiler.plugin('run', function(done) {
		this.displayState(false);
		done();
	});
};

module.exports = WebpackInfoPlugin;
