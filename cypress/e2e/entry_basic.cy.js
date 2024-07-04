describe('Entry entering data', () => {
    it('Site: successfully loads', () => {
      cy.visit('/')
    })
    it('Lifecycle: default lifecycle available', () => {
      cy.visit('/')
      cy.get('#__BVID__8__BV_toggle_').click();
      cy.get(':nth-child(3) > .dropdown-item').click();
      cy.get('#__BVID__61__row_TJBQwoU9w3tOmYmEF_7cy > [aria-colindex="2"]').should($el =>{
        expect($el[0].innerText).to.contain('initialize, prospect, lead, onboarded, followup, intention')
        //console.log($el[0].innerText)
      })
    })
    //TODO: it('Lifecycle: add, edit, delete, clone', {includeShadowDom: true}, () => {
    //it.only(
    it('Project: add, edit, delete, clone', {includeShadowDom: true}, () => {
      cy.visit('/')
      //add project
      cy.get('#btnNewProject').click();
      cy.get('#nested-street').clear('MyPrj');
      cy.get('#nested-street').type('MyPrj');
      cy.get('#project-status').select('Active');
      cy.get('#project-startdate').click();
      cy.get('#project-startdate__dialog_').contains('span', '3').click()
      cy.get('#project-enddate').click();
      cy.get('#project-enddate__dialog_').contains('span', '4').click()
      cy.get('#mySelect2').select('default');
      cy.get('#new-project-modal___BV_modal_footer_ > .btn').click();
      cy.get('table').get('td').should($el => {
        expect($el[0].innerText).to.contain('MyPrj')
      })
      //edit project
      cy.get('span > :nth-child(1)').click();
      cy.get('#nested-street').clear('MyPrj');
      cy.get('#nested-street').type('NewName');
      cy.get('#project-status').select('Stand By');
      cy.get('#new-project-modal___BV_modal_footer_ > :nth-child(2)').click();
      cy.get('table').get('td').should($el => {
        expect($el[0].innerText).to.contain('NewName')
      })
      cy.get('table').get('td').should($el => {
        expect($el[1].innerText).to.contain('Stand By')
      })
      //clone project
      cy.get('span > :nth-child(1)').click();
      cy.get('#nested-street').clear('NewName');
      cy.get('#nested-street').type('NewPrj');
      cy.get('#project-status').select('Active');
      cy.get('#new-project-modal___BV_modal_footer_ > :nth-child(1)').click();
      cy.get('table').get('td').should($el => {
        expect($el[0].innerText).to.contain('NewName')
      })
      //delete project
      cy.get('span > :nth-child(2)').then($el => {
        $el[0].click()
      })
      cy.get('table').get('td').should($el => {
        expect($el[0].innerText).to.contain('NewPrj')
      })
    })
    it('Contact: add, edit, delete', {includeShadowDom: true}, () => {
      cy.visit('/')
      //add project
      cy.get('#btnNewProject').click();
      cy.get('#nested-street').clear('MyPrj');
      cy.get('#nested-street').type('MyPrj');
      cy.get('#project-status').select('Active');
      cy.get('#project-startdate').click();
      cy.get('#project-startdate__dialog_').contains('span', '3').click()
      cy.get('#project-enddate').click();
      cy.get('#project-enddate__dialog_').contains('span', '4').click()
      cy.get('#mySelect2').select('default');
      cy.get('#new-project-modal___BV_modal_footer_ > .btn').click();
      cy.get('table').get('td').should($el => {
        expect($el[0].innerText).to.contain('MyPrj')
      })
      //clone project
      cy.get('span > :nth-child(1)').click();
      cy.get('#nested-street').clear('MyPrj');
      cy.get('#nested-street').type('NewPrj');
      cy.get('#project-status').select('Active');
      cy.get('#new-project-modal___BV_modal_footer_ > :nth-child(1)').click();
      cy.get('table tbody > :nth-child(2)').should($el => {
        expect($el[0].innerText).to.contain('NewPrj')
      })
      //add contact
      cy.get('#__BVID__8__BV_toggle_').click();
      cy.get(':nth-child(2) > .dropdown-item').click();
      cy.get('#btnNewContact').click();
      cy.get('#nested-street').type('MyLead');
      cy.get('#__BVID__266 > .col > #nested-state').select('USER ACCOUNT');
      cy.get('#__BVID__292 > .col > #nested-country').select(['MyPrj']);
      cy.get('#new-contact-modal___BV_modal_footer_ > .btn').click();
      cy.get('table').get('td').should($el => {
        expect($el[0].innerText).to.contain('MyLead')
      })
      //edit contact
      cy.get('span > :nth-child(1)').click();
      cy.get('#nested-street').clear('N');
      cy.get('#nested-street').type('NewLeadName');
      cy.get('#__BVID__351 > .col > #nested-country').select(['NewPrj']);
      cy.get('#new-contact-modal___BV_modal_footer_ > .btn').click();
      cy.get('table').get('td').should($el => {
        expect($el[0].innerText).to.contain('NewLeadName')
      })
      //delete contact
      cy.get('span > :nth-child(2)').click();
      cy.get('table').get('td').should('not.exist')
    })

})