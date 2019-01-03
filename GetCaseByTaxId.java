//works! get a case by tax account number, test number: 311526415200
	@GET
	@Path("/cases/getCaseByTaxId/{taxAcctNbr}")
	public Response getCaseByTaxId(@PathParam("taxAcctNbr") String taxAcctNbr){
		List<ComplaintCase> complaintCases = new GenericDAOHibernateImpl<ComplaintCase, String>(){}.read("taxAcctNbr", taxAcctNbr, "id", OrderDirection.asc,IncludeNulls.FALSE);
		
		return Response.ok().entity(complaintCases).build();
	}

//get cases by address (house number and street name)
	@GET
	@Path("/cases/getCaseByAddress/{locationHouseNumber : (\\w+)?}/{locationStreetName : (\\w+)?}")
	public Response listCasesByAddress(@PathParam("locationHouseNumber") String locationHouseNumber,
									  @PathParam("locationStreetName") String locationStreetName) {
		
		if (locationHouseNumber.equals("")){
			List<ComplaintCase> complaintCases = new GenericDAOHibernateImpl<ComplaintCase, String>(){}.read("locationStreetName", locationStreetName, "id", OrderDirection.asc,IncludeNulls.FALSE);

			complaintCases.page(getAnd(), getOr(), getSidx(), getSord(), getFrom(), getRows());

			return Response.ok().entity(complaintCases).build();
		}
		
		else if (locationStreetName.equals("")) {
			List<ComplaintCase> complaintCases = new GenericDAOHibernateImpl<ComplaintCase, String>(){}.read("locationHouseNumber", locationHouseNumber, "id", OrderDirection.asc,IncludeNulls.FALSE);
			return Response.ok().entity(complaintCases).build();
		}
		
		else {
		
		ArrayList<FieldCompareBuilder<?>> fieldCompareItems = new ArrayList<FieldCompareBuilder<?>>();
		
		fieldCompareItems.add(new FieldCompareBuilder< String >("locationHouseNumber", locationHouseNumber, "=", "and"));
		fieldCompareItems.add(new FieldCompareBuilder< String >("locationStreetName", locationStreetName, "=", "and"));
		
		List<ComplaintCase> complaintCases = new GenericDAOHibernateImpl<ComplaintCase, String>(){}.readWithCriteria(fieldCompareItems, "id", OrderDirection.asc, 0, 5);

		return Response.ok().entity(complaintCases).build();
		}
	} 

//get cases by full or partial ID 
	@GET
	@Path("/cases/getCaseByFullId/{section}/{caseYear : (\\w+)?}/{caseNumber : (\\w+)?}")
	public Response listCasesByFullId(@PathParam("section") String section,
									  @PathParam("caseYear") String caseYear,
									  @PathParam("caseNumber") String caseNumber) {
		
		//if case year and case number are empty, read all cases with selected section (B,E,Z)
		if ((caseYear.equals("") && caseNumber.equals(""))) {
			List<ComplaintCase> complaintCases = new GenericDAOHibernateImpl<ComplaintCase, String>(){}.read("section", section, "id", OrderDirection.asc,IncludeNulls.FALSE);
			return Response.ok().entity(complaintCases).build();
		}
		
		//if case number empty, but year is not, read all cases by case year and section
		else if ((caseNumber.equals("")) && (!caseYear.equals(""))) {
			ArrayList<FieldCompareBuilder<?>> fieldCompareItems = new ArrayList<FieldCompareBuilder<?>>();
			
			fieldCompareItems.add(new FieldCompareBuilder< String >("section", section, "=", "and"));
			fieldCompareItems.add(new FieldCompareBuilder< String >("caseYear", caseYear, "=" , "and"));
			
			List<ComplaintCase> complaintCases = new GenericDAOHibernateImpl<ComplaintCase, String>(){}.readWithCriteria(fieldCompareItems, "id", OrderDirection.asc, 0, 10);
			
			return Response.ok().entity(complaintCases).build();
		}
		
		//if all fields are selected, read a specific case
		else {
		ArrayList<FieldCompareBuilder<?>> fieldCompareItems = new ArrayList<FieldCompareBuilder<?>>();
		
		fieldCompareItems.add(new FieldCompareBuilder< String >("section", section, "=", "and"));
		fieldCompareItems.add(new FieldCompareBuilder< String >("caseYear", caseYear, "=" , "and"));
		fieldCompareItems.add(new FieldCompareBuilder< String >("caseNumber", caseNumber, "=", "and"));
		
		List<ComplaintCase> complaintCases = new GenericDAOHibernateImpl<ComplaintCase, String>(){}.readWithCriteria(fieldCompareItems, "id", OrderDirection.asc, 0, 10);
		
		return Response.ok().entity(complaintCases).build();
		}
	} 


//Wont work?? Just using regular id enpoint now, works fine
//get case by actual fullCaseId (all one string)
@GET
@Path("/cases/{fullCaseId}")
public Response getSpecificCase(@PathParam("fullCaseId") String fullCaseId){
	complaintCase= new GenericDAOHibernateImpl<ComplaintCase, String>(){}.read(fullCaseId);
		
	return Response.ok().entity(complaintCase).build();

}

	@GET
	@Path("/cases/getSpecificCase/{fullCaseId}")
	public Response getSpecificCase(@PathParam("fullCaseId") String fullCaseId){
		List<ComplaintCase> complaintCases = new GenericDAOHibernateImpl<ComplaintCase, String>(){}.read("fullCaseId", fullCaseId, "id", OrderDirection.asc, IncludeNulls.FALSE);
		
		return Response.ok().entity(complaintCases).build();
	} 

@GET
@Path("/cases/getSpecificCase/{fullCaseId}")
public Response getSpecificCase(@PathParam("fullCaseId") String fullCaseId){
	complaintCase= new GenericDAOHibernateImpl<ComplaintCase, String>(){}.readOne("fullCaseId", fullCaseId);
		
	return Response.ok().entity(complaintCase).build();

}

//get cases by full address (addressSearch from ComplaintCaseDashboardView)
	@GET
	@Path("/cases/getCaseByAddress/{addressSearch}")
	public Response listCasesByAddress(@PathParam("addressSearch") String addressSearch) {
		
			List<ComplaintCaseDashboardView> complaintCases = new GenericDAOHibernateImpl<ComplaintCaseDashboardView, String>(){}.read("addressSearch", addressSearch, "id", OrderDirection.asc,IncludeNulls.FALSE);
		
		return Response.ok().entity(complaintCases).build();
	} 


//get cases by full or partial ID 
	@GET
	@Path("/cases/getCaseByFullId/{categoryCode : (\\w+)?}/{caseYear : (\\w+)?}/{caseNumber : (\\w+)?}")
	public Response listCasesByFullId(@PathParam("categoryCode") String complaintCategoryCode,
									  @PathParam("caseYear") String caseYear,
									  @PathParam("caseNumber") String caseNumber) {
		
		//if case year and case number are empty, read all cases with selected section (B,E,Z)
		if ((caseYear.equals("")) && (caseNumber.equals("")) && (!complaintCategoryCode.equals(""))) {
			
			GenericDAOHibernateImpl<ComplaintCase, String> complaintCaseDAO=new GenericDAOHibernateImpl<ComplaintCase, String>(){};
			
			List<ComplaintCase> complaintCases = complaintCaseDAO.page(Restrictions.conjunction(), Restrictions.disjunction(), "complaintCategoryCode", "asc", 0, 500);

			
			return Response.ok().entity(complaintCases).build();
		}
		
		//search for a case just by number
		else if ((complaintCategoryCode.equals("")) && (caseYear.equals("")) && (!caseNumber.equals(""))){
			List<ComplaintCase> complaintCases = new GenericDAOHibernateImpl<ComplaintCase, String>(){}.read("caseNumber", caseNumber, "id", OrderDirection.asc,IncludeNulls.FALSE);
							
			return Response.ok().entity(complaintCases).build();
							
		}
		
		//search for a case just by year
		else if ((caseNumber.equals("")) && (complaintCategoryCode.equals("")) && (!caseYear.equals(""))){
			List<ComplaintCase> complaintCases = new GenericDAOHibernateImpl<ComplaintCase, String>(){}.read("caseYear", caseYear, "id", OrderDirection.asc,IncludeNulls.FALSE);
					
			return Response.ok().entity(complaintCases).build();
					
		}
		
		//if case number empty, but year is not, read all cases by case year and section
		else if ((caseNumber.equals("")) && (!caseYear.equals("")) && (!complaintCategoryCode.equals(""))) {
			ArrayList<FieldCompareBuilder<?>> fieldCompareItems = new ArrayList<FieldCompareBuilder<?>>();
			
			fieldCompareItems.add(new FieldCompareBuilder< String >("complaintCategoryCode", section, "=", "and"));
			fieldCompareItems.add(new FieldCompareBuilder< String >("caseYear", caseYear, "=" , "and"));
			
			List<ComplaintCase> complaintCases = new GenericDAOHibernateImpl<ComplaintCase, String>(){}.readWithCriteria(fieldCompareItems, "id", OrderDirection.asc, 0, 10000);
			
			return Response.ok().entity(complaintCases).build();
		}
		
		//if all fields are selected, read a specific case
		else {
		ArrayList<FieldCompareBuilder<?>> fieldCompareItems = new ArrayList<FieldCompareBuilder<?>>();
		
		fieldCompareItems.add(new FieldCompareBuilder< String >("complaintCategoryCode", section, "=", "and"));
		fieldCompareItems.add(new FieldCompareBuilder< String >("caseYear", caseYear, "=" , "and"));
		fieldCompareItems.add(new FieldCompareBuilder< String >("caseNumber", caseNumber, "=", "and"));
		
		List<ComplaintCase> complaintCases = new GenericDAOHibernateImpl<ComplaintCase, String>(){}.readWithCriteria(fieldCompareItems, "id", OrderDirection.asc, 0, 500);
		
		return Response.ok().entity(complaintCases).build();
		}
	} 