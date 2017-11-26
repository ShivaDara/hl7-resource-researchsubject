Session.setDefault('researchSubjectSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);



//------------------------------------------------------------------------------
// ROUTING

Router.map(function(){
  this.route('researchSubjectsTablePage', {
    path: '/table/researchSubjects',
    template: 'researchSubjectsTablePage'
  });
});


//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.researchSubjectsTablePage.events({
  'click .checkbox': function(event, template){
    event.stopPropagation();
    if(this.checked){
      ResearchSubjects.update({_id: this._id}, {$set: {checked: false}});
    }else{
      ResearchSubjects.update({_id: this._id}, {$set: {checked: true}});
    }
  },
  'click .flag': function(event, template){
    event.stopPropagation();
    if(this.flagged){
      ResearchSubjects.update({_id: this._id}, {$set: {flagged: false}});
    }else{
      ResearchSubjects.update({_id: this._id}, {$set: {flagged: true}});
    }
  },
  'click .addRecordIcon': function(){
    Router.go('/insert/researchSubject');
  },
  'click .delete': function(){
    ResearchSubjects.remove(this._id);
  },
  'click tr': function(){
    Router.go('/view/researchSubject/' + this._id);
  },
  // use keyup to implement dynamic filtering
  // keyup is preferred to keypress because of end-of-line issues
  'keyup #researchSubjectSearchInput': function() {
    Session.set('researchSubjectSearchFilter', $('#researchSubjectSearchInput').val());
  }
});


//------------------------------------------------------------------------------
// TEMPLATE OUTPUTS

Template.researchSubjectsTablePage.helpers({
  getName: function(){
    return this.name[0].text;
  },
  getCreatedAt: function(){
    return moment(this.createdAt).format("YYYY-MM-DD");
  },
  isGrayedOut: function(){
    if(this.checked){
      return "gray";
    }else{
      return "";
    }
  },
  checkedIcon: function(){
    if(this.services && this.services.resume && (this.services.resume.loginTokens.length > 0)){
      return "fa-signal";
    }else{
      return "";
    }
  },
  flaggedIcon: function(){
    if(this.flagged){
      return "fa-flag";
    }else{
      return "fa-flag-o";
    }
  },
  researchSubjectsList: function() {
    // this triggers a refresh of data elsewhere in the table
    // step C:  receive some data and set our reactive data variable with a new value
    Session.set('receivedData', new Date());

    Template.appLayout.delayedLayout(100);

    // this is a performant local (client-side) search on the data
    // current in our CustomerAccounts cursor, and will reactively
    // update the table
    return ResearchSubjects.find({
      'name.text': {
        $regex: Session.get('researchSubjectSearchFilter'),
        $options: 'i'
    }});
  }
});


Template.researchSubjectsTablePage.rendered = function(){

  // step A:  initialize the table sorting functionality
  $(this.find('#researchSubjectsTable')).tablesorter();

  // the Tracker API watches Collection and Session objects
  // so what we're doing here is registering a Tracker to watch the
  // Session.get('receivedData') variable.  When it changes, everything
  // in the autorun() clause will get rerun

  // step B:  register a tracker to add the tablesorting functionality back
  // after we update data
  Tracker.autorun(function() {

    // step D: register that the recevedData variable has been changed
    // and rerun the Tracker clause
    // step E: actually log the new value in receivedData
    console.log(Session.get('receivedData'))
    setTimeout(function() {
      // step F:  update the tablesorting library 200ms after receiving data
      // and Blaze has had a change to rerender the table
      $("#researchSubjectsTable").trigger("update");
    }, 200);
  });

};
