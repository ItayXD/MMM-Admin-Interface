/* global module, require */
/* Magic Mirror
 * Module: MMM-admin-interface
 *
 * By ItayXD
 * GPL-3.0 Licensed.
 */
const NodeHelper = require( "node_helper" );
const path = require( "path" );
const fs = require( "fs" );
const bodyParser = require( "body-parser" );
module.exports = NodeHelper.create( {

	// Subclass start method.
	start: function() {
		console.log( "Starting node helper for: " + this.name );
		var self = this;
		var modulePath = `/modules/${this.name}/`;
		var configPath = path.resolve( __dirname, "../../config/config.js" );

		//Read Original config file = starting values
		try {
			var originconfig = require( configPath );
		} catch ( e ) {
				console.log( "Could not read config.js" );
				console.log( e );
		}

		//Send the starting values with the page
		this.expressApp.get( modulePath + "index", function( req, res ) {
			var startingValue = JSON.stringify( originconfig );
			var html = require( "./index.js" );
			html = html.replace( "{{starting_value}}",  startingValue );
			res.contentType( "text/html" );
			res.send( html );
		} );

		//Recive the schemas from other modules, and send them to front end
		this.schema = require( "./schema.default.json" );
		this.expressApp.get( modulePath + "schema.json", function( req, res ) {
			res.contentType( "application/json" );
			var jsonSchema = JSON.stringify( self.schema );
			res.send( jsonSchema );
		} );

		//Recieve the post req and save the config file
		var rawParser = bodyParser.raw( { type: "application/json" } );
		this.expressApp.post( modulePath, rawParser, function( req, res ) {
			var header = "/* Magic Mirror Config Sample\n" +
				"*\n" +
				"* By Michael Teeuw http://michaelteeuw.nl\n" +
				"* MIT Licensed.\n" +
				"*/\n" +
				"var config = ";
			var footer = ";\n/*************** DO NOT EDIT THE LINE BELOW ***************/ \n" +
				"if (typeof module !== 'undefined') {module.exports = config;}";
			fs.writeFile( configPath, header + req.body + footer, function( err ) {
				if ( err ) {
					res.writeHead( 500, { "Content-Type": "text/plain" } );
					res.end( "Settings could not be saved" );
					return console.log( err );
				}
				res.writeHead( 200, { "Content-Type": "text/plain" } );
				res.end( "Settings saved" );    // echo the result back
				console.log( "The file was saved!" );
			} );
		} );
	},
	socketNotificationReceived: function( notification, payload ) {
		if ( notification === "schema" && payload && typeof ( payload ) === "object" ) {
	    	console.log('received')
			Object.assign( this.schema, payload );
		}
	}
} );
