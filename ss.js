//'use strict'

// TO DO: if this script only uses _.chunk, just put that function and only that function in the code
var _ = require('lodash');

const result = require('dotenv').config();
const { SierraAPIAsPromised } = require('@sydneyunilibrary/sierra-api-as-promised');
var sqlite3 = require('sqlite3').verbose();
var students = new sqlite3.Database('data/20190315.db');
students.serialize(function() {
	students.run(`DROP TABLE IF EXISTS library`);
	students.run(`CREATE TABLE library
	        (patronId NOT NULL PRIMARY KEY
	        , studentId
	        , name
	        , address
	        , phone
	        , email
	        , birthdate
	        , pcode2
	        , patcat
	        , expirationDate
	        , pin
	        , schoolName
	        , grade
	        , status
	        , holdCode)`);
});

async function findAndExportPatrons() {
	const sierraAPI = await SierraAPIAsPromised();
	const booleanSearch = JSON.parse(process.env.SIERRA_PATRON_QUERY);
	const exportFields = [
		'id',
		'barcodes',
		'names',
		'addresses',
		'phones',
		'emails',
		'birthDate',
		'fixedFields',
		'varFields'
	]

/* Submit the query, getting back a list of links (full URLs to the patron) */
	let patronLinks = await sierraAPI.patrons.query(0, process.env.SIERRA_PATRON_QUERY_LIMIT, booleanSearch)

/* Transform the list of links to a list of IDs */
	let patronIDs = patronLinks.entries.map(({ link }) => link.substr(link.lastIndexOf('/') + 1))

	console.log(patronIDs.length)

/* The patron records with those IDs */
/* TO DO: use Stream */
/* TO DO: chunks of 500 : GET url gets too long and yields server error otherwise. Max tolerance appears to be 750 */
/* TO DO: figure out why my script limits to chunks of 50 */
/* TO DO: determine whether the await Promise.all below means that these requests are being sent concurrently - and how that would be AWESOME... */

	const punks = _.chunk(patronIDs, 5);

	await Promise.all(punks.map(async (punk) => {
		try {
			const patronResultSet = await sierraAPI.patrons.listPatrons({ id: punk, fields: exportFields });
// TO DO: save the patron info into sqlite
// we have a set of 50 patrons' information - can we dump it to sqlite all at once?
/*
library patron card number 		1 	P BARCODE 		b 	PatronPatch->barcodes[]
student id 				2 	STUDENTID APATID/SSN 	u 	??? PatronPatch->uniqueIds[]
patron name 				3 	PATRN NAME 		n 	PatronPatch->names[]
patron address 				4 	ADDRESS 		a 	PatronPatch->addresses[{lines[],type:a}]
patron telephone	 		5 	TELEPHONE 		t 	PatronPatch->phones[{number,type:t}]
patron email address 			6 	EMAIL ADDR 		z 	PatronPatch->emails[]
patron birth date 			7 	BIRTH DATE 		51 	PatronPatch->birthDate
patron pin 				8 	PIN 			= 	PatronPatch->pin
patron school name 			9 	SCHOOL 			e 	PatronPatch->varFields[{fieldTag:e,content}]
patron grade 				10 	GRADE 			f 	PatronPatch->varFields[{fieldTag:f,content}]
patron status 				11 	STATUS 			g 	PatronPatch->varFields[{fieldTag:g,content}]
???? 					12 	PCODE2 			45 	PatronPatch->patronCodes{pcode2:c}
patron type 				13 	PTYPE (PATCAT) 		47 	PatronPatch->patronType
patron hold code 			14 	HOLD CODE 		c 	PatronPatch->varFields[{fieldTag:c,content}]
patron library account expiration date 	15 	EXP DATE 		43 	PatronPatch->expirationDate
*/
			patronResultSet.entries.forEach(function(data, index) {
				let patronId		= data.barcodes[0];
				let studentId		= data.id;
				let name		= data.names[0];
				let address		= data.addresses[0].lines;
				let phone		= data.phones[0].number;
				let email		= data.emails[0];
				let birthdate		= data.birthDate;
				let pcode2		= data.fixedFields['45'].value;
				let patcat		= data.fixedFields['47'].value;
				let expirationDate	= data.fixedFields['43'].value;
				let pin, schoolName, grade, status, holdCode = '';
				for (let varField of data.varFields) {
					if (varField.fieldTag == '=') { pin 		= varField.content; }
					if (varField.fieldTag == 'c') { holdCode	= varField.content; }
					if (varField.fieldTag == 'e') { schoolName 	= varField.content; }
					if (varField.fieldTag == 'f') { grade 		= varField.content; }
					if (varField.fieldTag == 'g') { status		= varField.content; }
				}
				let sql = `
INSERT INTO library
	(patronId
	, studentId
	, name
	, address
	, phone
	, email
	, birthdate
	, pcode2
	, patcat
	, expirationDate
	, pin
	, schoolName
	, grade
	, status
	, holdCode)
VALUES 
	("${patronId}"
	, "${studentId}"
	, "${name}"
	, "${address}"
	, "${phone}"
	, "${email}"
	, "${birthdate}"
	, "${pcode2}"
	, "${patcat}"
	, "${expirationDate}"
	, "${pin}"
	, "${schoolName}"
	, "${grade}"
	, "${status}"
	, "${holdCode}")
ON CONFLICT (patronId) DO UPDATE SET
	studentId = excluded.studentId,
	name = excluded.name,
	address = excluded.address,
	phone = excluded.phone,
	email = excluded.email,
	birthdate = excluded.birthdate,
	pcode2 = excluded.pcode2,
	patcat = excluded.patcat,
	expirationDate = excluded.expirationDate,
	pin = excluded.pin,
	schoolName = excluded.schoolName,
	grade = excluded.grade,
	status = excluded.status,
	holdCode = excluded.holdCode
`;
//console.log(sql);
				students.run(sql);
			});
		} catch (err) {
// TO DO: handle connection error
//  message: 'Error: read ECONNRESET'
			console.error(`ERROR: id: ${punk}, ${err}`)
		}
	}));

}

findAndExportPatrons().catch(console.error)
