/*jshint esversion: 6 */
/*??????????*/
const NodeHelper = require("node_helper");
const path = require("path");
const fs = require("fs");
const bodyParser = require('body-parser');

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		console.log("Starting node helper for: " + this.name);
		var rawparser = bodyParser.raw({ type: 'application/json' });
		this.expressApp.post("/ggg", rawparser , function(req, res) {
			//res.writeHead(202, {'Content-Type': 'text/plain'});
			//res.send('Settings received');

			var fs = require('fs');
			fs.writeFile(path.resolve(__dirname, "../../config/config.json"), req.body, function(err) {
				if(err) {
					res.writeHead(500, {'Content-Type': 'text/plain'});
					res.end('Settings could not be saved');
					return console.log(err);
				}
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end('Settings saved');    // echo the result back
				console.log("The file was saved!");
		  }); 
		});
	},
});