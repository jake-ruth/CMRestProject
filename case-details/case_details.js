$(document).ready(function(){

	var caseId = getQueryVariable("id");
	console.log("case ID: " + caseId);

	//var caseId_url = 'http://aacotest2:8080/CaseManager/rest/CMMobile/cases/' + caseId;
	//var timeline_url = 'http://aacotest2:8080/CaseManager/rest/CMMobile/TimelineItems/' + caseId;

	//var timeline_url = 'https://aacoprod.aacounty.org/AACOServicePublic/rest/CaseManager/TimelineItems/' + caseId;
	//var caseId_url = 'https://aacoprod.aacounty.org/AACOServicePublic/rest/CaseManager/CMMobile/cases/' + caseId;

	
	//FOR TESTING -- new endpoint to order timeline items properly by date
	var timeline_url = 'http://localhost:8080/CaseManager/rest/CombinedCases/TimelineItems/' + caseId;
	var caseId_url = 'http://localhost:8080/CaseManager/rest/CombinedCases/cases/' + caseId;
	
	$.ajax({
		type:'GET',
		dataType:"json",
		url: caseId_url,
		success: renderSpecificCase 
	});

	function renderSpecificCase(data){
		console.table(data);

		//writes the case data to case details table
		var case_data = '';
		case_data += "<tr>";
		case_data += "<td>"+data.fullCaseId+"</td>";

		//if statement to show empty insted of null tax id
		if  (data.taxAccountNumber == null){
			case_data += "<td>"+" "+"</td>";
		} else {
		case_data += "<td>"+data.taxAccountNumber+"</td>";
		}

		if (data.locationHouseNumber == "0") {
			case_data += "<td>"+" "+"</td>";
		} else {
			case_data += "<td>"+removeNull(data.locationHouseNumber)+" "+
								removeNull(data.locationStreetName)+" "+
								removeNull(data.locationStreetType)+" - "+
								removeNull(data.locationCity)+" "+
								removeNull(data.locationZipCode);+"</td>";
		}
		case_data += "<td>"+convertDate(data.receivedDate)+"</td>";
		case_data += "<td>"+convertDate(data.completedDate)+"</td>";
		case_data += "<td>"+convertDate(data.dateAssigned)+"</td>";
		case_data += "<td>"+data.permitNumber+"</td>";
		case_data += "<td>"+data.origCaseId+"</td>";
		case_data += "<td>"+data.waterfront+"</td>";
		case_data += "<td>"+data.criticalArea+"</td>";
		if (data.caseForm = "IAP"){
		case_data += "<td>"+data.complaintType.complaintTypeName+"</td>";
		} else if (data.caseForm == "VEG" || data.caseForm == "SGP") {
			case_data += "";
		}
		case_data += "</tr>";

		$("#details_table1").append(case_data); //append the data to the html table

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
	}//end renderSpecificCase

	//render timeline items
	var event_table = $("#timeline_table").DataTable({
		searching: false,
		"ajax" : {
		"type" : "GET",
		"url" : timeline_url,
		"dataSrc" : function(json) {
			var return_data = new Array();
			for (var i=0; i<json.length; i++) {
				return_data.push({
					'date' : json[i].createdOn.monthValue+"/"+json[i].createdOn.dayOfMonth+"/"+json[i].createdOn.year+"</td>",
					'eventType' : json[i].eventType.eventTypeName+"</td>",
					'message' : json[i].message
				});
			}
			return return_data;
		}
	},

	"columnDefs" : [ 
	{
		"title" : "Date",
		"targets" : 1
	}, {
		"title" : "Event",
		"targets" : 2
	} ],

	"columns" : [ 
	{
			"className" : 'details-control',
			"orderable" : false,
			"data" : null,
			"defaultContent": ''
		},
	{
		'data' : "date",
		"orderable" : false,
		"sortable" : false,
		'defaultContent' : "" //default content fixes unidentified bug
	}, {
		'data' : "eventType",
		"orderable" : false,
		'defaultContent' : ""
	} ],

	"order": [[1, 'asc']],
	"language":{
	"emptyTable": "No case events"
	}

}); //end datatable ajax

	function format(data) {
    let message;
    if (data.message == ""){
    	message = "no event notes";
    }
    else{ 
    	message = data.message;
    }
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td class="small-font">'+message+'</td>'+
        '</tr>'+
    '</table>';
}

	//show and hide child rows for case notes
	$("#timeline_table tbody").on('click', 'td.details-control', function(){
		var tr = $(this).closest('tr');
		var row = event_table.row(tr);

		 if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
	});

}); //end jquery


//UTILITY FUNCTIONS//

function removeNull(value){
	if (value == null ) {
		return "";
	}
	else return value;
}

//function to get the url param 
function getQueryVariable(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++){
		var pair = vars[i].split("=");
		if (pair[0]==variable){
			return pair[1];
		}
	}
	return false;
}