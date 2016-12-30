var html = "<!DOCTYPE html>\n\
<html>\n\
	<head>\n\
		<meta charset=\"utf-8\" />\n\
		<title>Magic Mirror Settings</title>\n\
		<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\" integrity=\"sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u\" crossorigin=\"anonymous\">\n\
		<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css'>\n\
		<script src=\"jsoneditor.js\"></script>\n\
	</head>\n\
	<body>\n\
		<div class=\"container\">\n\
		<div class='page-header'>\n\
				<h1>Magic Mirror² Admin Interface</h1>\n\
		</div>\n\
		<p>\n\
			<button id='submit' class='btn btn-primary'>Save settings</button>\n\
			<button id='restore' class='btn btn-info'>Restore to Default</button>\n\
			<span id='valid_indicator' class='label'></span>\n\
		</p>\n\
		<p>\n\
			<div class=\"progress\">\n\
				<div id=\"progress_bar\" class=\"progress-bar progress-bar-striped active\" style=\"width:0%\"></div>\n\
			</div>\n\
			<div id=\"result_status\" class=\"\" role=\"alert\"></div>\n\
		</p>\n\
		<div class='row'>\n\
			<div id='editor_holder' class='col-md-12'></div>\n\
		</div>\n\
		</div>\n\
		\n\
		<script>\n\
			JSONEditor.defaults.theme = 'bootstrap3';\n\
			JSONEditor.defaults.iconlib = 'fontawesome4';\n\
\n\
			// This is the starting value for the editor\n\
			// We will use this to seed the initial editor\n\
			// and to provide a \"Restore to Default\" button.\n\
			const startingValue = {{starting_value}}; //{{starting_value}} is replaced with the current values form config.js when served\n\
			// Initialize the editor\n\
			var editor = new JSONEditor( document.getElementById( \"editor_holder\" ), {\n\
				ajax: true,\n\
				schema: {\n\
					$ref: \"./schema.json\",\n\
					format: \"grid\"\n\
				},\n\
				startval: startingValue\n\
			} );\n\
\n\
			// Hook up the submit button to send the settings to the server\n\
			document.getElementById( \"submit\" ).addEventListener( \"click\", function() {\n\
				var xhr = new XMLHttpRequest();\n\
				var config = JSON.stringify( editor.getValue(), null, \"\t\" );\n\
				xhr.open( \"POST\", \"/MMM-Admin-Interface/\", true );\n\
				xhr.onreadystatechange = function() {\n\
					var progress_bar = document.getElementById( \"progress_bar\" );\n\
					var result_status = document.getElementById( \"result_status\" );\n\
					switch ( xhr.readyState ) {\n\
					case 1:\n\
						progress_bar.style.width = \"25%\";\n\
						break;\n\
					case 2:\n\
						progress_bar.style.width = \"50%\";\n\
						break;\n\
					case 3:\n\
						progress_bar.style.width = \"75%\";\n\
						break;\n\
					case 4:\n\
						progress_bar.className = \"progress-bar\";\n\
						progress_bar.style.width = \"100%\";\n\
						if ( xhr.status === 200 ) {\n\
							result_status.className = \"alert alert-success\";\n\
							result_status.textContent = xhr.responseText;\n\
						} else {\n\
							result_status.className = \"alert alert-warning\";\n\
							result_status.textContent = xhr.responseText;\n\
						}\n\
						break;\n\
					}\n\
				};\n\
				xhr.setRequestHeader( \"Content-type\", \"application/json\" );\n\
				xhr.send( config );\n\
\n\
			} );\n\
\n\
			// Hook up the Restore to Default button\n\
			document.getElementById( \"restore\" ).addEventListener( \"click\", function() {\n\
				editor.setValue( startingValue );\n\
			} );\n\
\n\
			// Hook up the validation indicator to update its\n\
			// status whenever the editor changes\n\
			editor.on( \"change\", function() {\n\
\n\
				// Get an array of errors from the validator\n\
				var errors = editor.validate();\n\
				var indicator = document.getElementById( \"valid_indicator\" );\n\
				if ( errors.length ) {\n\
					indicator.className = \"label label-warning\";\n\
					indicator.textContent = \"not valid\";\n\
				} else {\n\
					indicator.className = \"label label-success\";\n\
					indicator.textContent = \"valid\";\n\
				}\n\
			} );\n\
\n\
		</script>\n\
	</body>\n\
</html>";

module.exports = html;

