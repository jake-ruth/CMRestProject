$(document).ready(function(){

	//throws the datatable errors to the console instead of an alert to user
	$.fn.dataTable.ext.errMode = 'throw';

	//calls the address service
	autocompleteAddress($("#locationAddress"));

	$('#caseForm').on('submit', function(event) {
		event.preventDefault();

	$('#resetbutton').on('click', function(event){
		$('#data_table').find("tr:gt(0)").remove(); //works the best, keeps the pagination stuff though
		$('#emptyform-error').hide();
		$('#fields-error').hide();
	});

	//get user inputted case ID, TaxId, Address
	var address_input = $("#locationAddress").val();
	var taxId_input = $("#tax_id").val(); //test with 311526415200
	var caseCategory_input = $("#caseType").val();
	var caseYear_input = $("#caseYear").val();
	var caseNum_input = $("#caseNum").val();

	//validation to check if at least 1 field filled
	if ((address_input == '')
	  &&(taxId_input == '')&&(caseCategory_input == '')
	  &&(caseYear_input == '')&&(caseNum_input == '')){
		$("#emptyform-error").show(); 
		$("#fields-error").hide();
		
		return false;
	} 
	else {
		$("#emptyform-error").hide();
	} //end validation

	//base url for cases in CM REST API 
	//var tax_url = 'https://aacoprod.aacounty.org/AACOServicePublic/rest/CaseManager/cases/getCaseByTaxId/' + taxId_input;
	//var caseByFullId_url = 'https://aacoprod.aacounty.org/AACOServicePublic/rest/CaseManager/cases/getCaseByFullId/' + caseCategory_input + "/" + caseYear_input + "/" + caseNum_input;
	//var caseByAddress_url = 'https://aacoprod.aacounty.org/AACOServicePublic/rest/CaseManager/cases/getCaseByAddress/' + address_input.replace(" ","%20");

	var caseByAddress_url = 'http://localhost:8080/CaseManager/rest/CombinedCases/cases/getCaseByAddress/' + address_input;
	var tax_url = 'http://localhost:8080/CaseManager/rest/CombinedCases/cases/getCaseByTaxId/' + taxId_input;
	var caseByFullId_url = 'http://localhost:8080/CaseManager/rest/CombinedCases/cases/getCaseByFullId/' + caseCategory_input + "/" + caseYear_input + "/" + caseNum_input;


	var final_url;

	//create final url based on user input, ands to validate user searching by one section
	if ((address_input != "")&&(taxId_input == "")&&(caseCategory_input == "")&&(caseYear_input == "")&&(caseNum_input == "")){
		final_url = caseByAddress_url;
		$("#fields-error").hide();
		$("#emptyform-error").hide();
	}

	else if ((taxId_input != "")&&(address_input == "")&&(caseCategory_input == "")&&(caseYear_input == "")&&(caseNum_input == "")){
		final_url = tax_url;
		$("#fields-error").hide();
		$("#emptyform-error").hide();
	}

	else if (((caseCategory_input != "")||(caseYear_input != "")||(caseNum_input != ""))&&((taxId_input == "")&&(address_input == ""))){
		final_url = caseByFullId_url;
		$("#fields-error").hide();
		$("#emptyform-error").hide();
	} else {
		$("#fields-error").show();
		return false;
	}//end validation

	if ( $.fn.DataTable.isDataTable('#data_table') ) {
  	$('#data_table').DataTable().destroy();
	}

	$('#data_table').empty();

	var table = $("#data_table").DataTable({
		destroy: true,
		searching: true, 
		"ajax" : {
		"type" : "GET",
		"url" : final_url,
		"dataSrc" : function(json) {
			table.clear().draw();
			var return_data = new Array();
			for (var i=0; i<json.length; i++) {
				return_data.push({
					'fullCaseId' : json[i].fullCaseId,
					'taxAccountNumber' : json[i].taxAccountNumber,
					'address' : removeNull(json[i].locationHouseNumber)+" "+
								removeNull(json[i].locationStreetName)+" "+
								removeNull(json[i].locationStreetType)+" "+
								removeNull(json[i].locationCity)+", MD "+
								removeNull(json[i].locationZipCode),
					'receivedDate' : convertDate(json[i].receivedDate),
					'completedDate' : convertDate(json[i].completedDate),
					'id' : json[i].id
				});
			}
			return return_data;
		}
	},
	"columnDefs" : [ {
		"title" : "Case ID",
		"type" : 'natural',
		"targets" : 0
	}, {
		"title" : "Tax ID",
		"targets" : 1
	}, {
		"title" : "Location",
		"targets" : 2
	}, {
		"title" : "Received",
		"targets" : 3
	}, {
		"title" : "Completed",
		"targets" : 4
	} ],

	"columns" : [ {
		'data' : "fullCaseId",
		'defaultContent' : "No Case ID available" //default content fixes unidentified bug
	}, {
		'data' : "taxAccountNumber",
		'defaultContent' : "No Tax ID available"
	}, {
		'data' : "address",
		 render: function(locationHouseNumber) { 
                if (locationHouseNumber == "0   , MD " || locationHouseNumber =="   , MD ") { //spacing is needed
                  return "No Address Available";
                } else {
                  return locationHouseNumber;
                }
              },
	}, {
		'data' : "receivedDate",
		'defaultContent' : "Click to see received date"
	}, {
		'data' : "completedDate",
		'defaultContent' : "Click to see completed date"
	} ],

	"language":{
	"emptyTable": "No cases found"
	}

}); //end datatable ajax

	//go to specific case details page
	$("#data_table tbody").on('click', 'tr', function(){
		var data = table.row(this).data();
		console.log(data);
		window.location = 'case-details/index.html?id=' + data.id; //gives a url param to the case_details.html page
	});

	}); //end anonymous function

	return false;
}); //end of jquery

//UTILITY FUNCTIONS//

//used because legacy data does not have full address fields
function removeNull(value){
	if (value == null ) {
		return "";
	}
	else return value;
}

//date conversion function using moment.js library
function convertDate(originalDate){
	var convertedDate = moment(originalDate).format("MM/DD/YYYY");
	var valid = moment(originalDate).isValid();
	if (valid == true){
		return convertedDate;
	} 
	else {
		return "";
	}	
}

//ajax address service
function createUrl(searchstring) {
	var protocol = ('https:' == document.location.protocol ? 'https://' : 'http://');
	var testIP = protocol+"aacoprod-intra.aacounty.org";
	var url = testIP + "/AACORest/rest/GetAddress/" + searchstring;
	return url;
};
			
function autocompleteAddress(selector) {
	$(selector).autocomplete({
		source : function (request, response) {
			$.ajax({
				type : "GET",
				url : createUrl( $(selector).val() ),
				contentType : "application/json",
				dataType : "jsonp",
				success : function (data) {
					response($.map(data, function (item) {
						return {
							label : item.streetNumber + " " + item.streetName,
							value : item.streetNumber + " " + item.streetName							
						}
				   }));
				}	
			});
			
		},
		select : function (event, ui) {
			$('#locationAddress').val(ui.item.value);									
		},
		minLength : 5
	}).autocomplete("instance")._renderItem = function (ul, item) {
		return $("<li>").append("<div>" + item.label + '<br /><span style="color:#c0c0c0;">' + "</span></div>").appendTo(ul);
	};

	$("ul").last().attr('id','address_list');
}



